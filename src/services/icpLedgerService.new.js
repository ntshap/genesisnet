// ICP Ledger Service
// This file provides interfaces to interact with the ICP Ledger canister

import { idlFactory as ledgerIdlFactory } from './did/ledger.did.js';
import { 
  principalToAccountIdentifier, 
  accountIdentifierToHex,
  stringToAccountIdentifier,
  icpToE8s as icpToE8sHelper,
  e8sToIcp as e8sToIcpHelper,
  ICP_LEDGER_CANISTER_ID,
  SUB_ACCOUNT_ZERO
} from './icpUtils';

// Custom Actor implementation for browser environments
class HttpAgent {
  constructor({ identity, host }) {
    this.identity = identity;
    this.host = host || 'https://ic0.app';
  }
  
  async fetchRootKey() {
    console.log('Fetching root key (simulated in browser)');
    return new Uint8Array(32).fill(1); // Simulated root key
  }
}

// Browser-compatible Actor implementation
class Actor {
  static createActor(idlFactory, { agent, canisterId }) {
    // Create a simplified actor that works in the browser
    const actor = {
      // Implement required ledger methods
      async account_balance({ account }) {
        console.log('Checking balance for account:', accountIdentifierToHex(account));
        // Simulate a balance check
        // In a real implementation, this would make an API call to the IC network
        return { e8s: BigInt(1000000000) }; // Simulated 10 ICP balance
      },
      
      async transfer(args) {
        console.log('Transfer request:', {
          to: accountIdentifierToHex(args.to),
          amount: Number(args.amount.e8s) / 100000000,
          fee: Number(args.fee.e8s) / 100000000,
          memo: args.memo.toString()
        });
        
        // Simulate a successful transfer
        // In a real implementation, this would submit the transaction to the IC network
        return { 'Ok': BigInt(Math.floor(Math.random() * 1000000)) };
      },
      
      async transfer_fee() {
        // Return the standard ICP transfer fee
        return { transfer_fee: { e8s: BigInt(10000) } };
      }
    };
    
    return actor;
  }
}

/**
 * Convert ICP token amount from number to Ledger compatible format
 * @param {number} amount - The amount in ICP
 * @returns {object} The amount in e8s format for the ledger
 */
export function icpToE8s(amount) {
  return { e8s: BigInt(Math.round(amount * 100000000)) };
}

/**
 * Convert ICP token amount from Ledger format to number
 * @param {object} e8s - The amount in e8s format from the ledger
 * @returns {number} The amount in ICP
 */
export function e8sToIcp(e8s) {
  return Number(e8s.e8s) / 100000000;
}

// Default fee in e8s (0.0001 ICP)
const DEFAULT_TRANSFER_FEE = BigInt(10000);

// Helper to create an actor for interacting with the ledger
const createLedgerActorHelper = async (identity = null) => {
  try {
    // Create an agent for interacting with the IC
    const agent = new HttpAgent({
      identity,
      host: process.env.VITE_ICP_HOST || 'https://ic0.app',
    });

    // In development, we might need to fetch the root key
    if (process.env.NODE_ENV !== 'production') {
      await agent.fetchRootKey();
    }

    // Create an actor to interact with the ledger canister
    return Actor.createActor(ledgerIdlFactory, {
      agent,
      canisterId: ICP_LEDGER_CANISTER_ID,
    });
  } catch (error) {
    console.error("Error creating ledger actor:", error);
    throw error;
  }
};

/**
 * ICP Ledger Service for handling payments and balance queries
 */
class ICPLedgerService {
  constructor() {
    this.ledgerActor = null;
    this.isInitialized = false;
    this.identity = null;
    this.transferFee = DEFAULT_TRANSFER_FEE;
  }

  /**
   * Initialize the ledger service
   * @param {SignIdentity} identity - The identity to use for ledger interactions
   */
  async initialize(identity) {
    try {
      this.identity = identity;
      this.ledgerActor = await createLedgerActorHelper(identity);
      
      // Get the current transfer fee
      try {
        const feeResponse = await this.ledgerActor.transfer_fee({});
        this.transferFee = feeResponse.transfer_fee.e8s;
        console.log(`ICP transfer fee: ${e8sToIcpHelper(this.transferFee)} ICP`);
      } catch (error) {
        console.warn("Could not get transfer fee, using default:", error);
      }
      
      this.isInitialized = true;
      console.log('ICP Ledger service initialized');
      return true;
    } catch (error) {
      console.error("Failed to initialize ICP ledger service:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Get the principal ID associated with the current identity
   * @returns {object|null} - The principal ID or null if not initialized
   */
  getPrincipal() {
    if (!this.identity) {
      console.warn("No identity set");
      return null;
    }
    return this.identity.toPrincipal();
  }
  
  /**
   * Get the account ID for the current principal
   * @param {Uint8Array} subAccount - Optional subaccount (defaults to 0)
   * @returns {Promise<Uint8Array>} - The account ID
   */
  async getAccountId(subAccount = SUB_ACCOUNT_ZERO) {
    const principal = this.getPrincipal();
    if (!principal) {
      console.warn("No principal available");
      // Return a mock account ID
      return new Uint8Array(32).fill(1);
    }
    return await principalToAccountIdentifier(principal, subAccount);
  }
  
  /**
   * Get the account ID as a hex string
   * @returns {Promise<string>} - The account ID as a hex string
   */
  async getAccountIdHex() {
    const accountId = await this.getAccountId();
    return accountIdentifierToHex(accountId);
  }

  /**
   * Get the balance of an account
   * @param {string|object|Uint8Array} accountId - The account identifier, can be:
   *   - A hex string
   *   - A Principal object (will be converted to default account ID)
   *   - A Uint8Array account ID
   * @returns {Promise<number>} - The balance in ICP
   */
  async getBalance(accountId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      let accountIdBytes;
      
      // Handle different input types
      if (typeof accountId === 'string') {
        // Assume it's a hex string
        accountIdBytes = stringToAccountIdentifier(accountId);
      } else if (accountId && typeof accountId.toText === 'function') {
        // Convert principal to account ID
        accountIdBytes = await principalToAccountIdentifier(accountId);
      } else if (accountId instanceof Uint8Array) {
        // Already in the right format
        accountIdBytes = accountId;
      } else {
        // Use the current user's account ID
        accountIdBytes = await this.getAccountId();
      }
      
      // Query the ledger for balance
      const balanceE8s = await this.ledgerActor.account_balance({ 
        account: accountIdBytes
      });
      
      return e8sToIcpHelper(balanceE8s.e8s);
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }

  /**
   * Transfer ICP from one account to another
   * @param {string|object} to - The recipient's principal ID or account ID hex string
   * @param {number} amountIcp - The amount to transfer in ICP
   * @param {Object} options - Additional options for the transfer
   * @returns {Promise<Object>} - The result of the transfer
   */
  async transfer(to, amountIcp, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const memo = options.memo || BigInt(Date.now());
      const amountE8s = icpToE8sHelper(amountIcp);
      let toAccountId;
      
      // Convert recipient to account ID based on input type
      if (typeof to === 'string' && to.length === 64) {
        // Assume it's already an account ID in hex format
        toAccountId = stringToAccountIdentifier(to);
      } else if (to && typeof to.toText === 'function') {
        // Convert principal to account ID
        toAccountId = await principalToAccountIdentifier(to);
      } else if (typeof to === 'string') {
        // Assume it's a principal ID text
        // In a real implementation we would use Principal.fromText
        console.warn("Principal from text not fully implemented");
        toAccountId = new Uint8Array(29);
        toAccountId.fill(2);
      } else {
        throw new Error("Invalid recipient format");
      }

      // Create transfer arguments
      const transferArgs = {
        from_subaccount: [], // Default subaccount
        to: toAccountId,
        amount: { e8s: amountE8s },
        fee: { e8s: this.transferFee },
        memo: BigInt(memo),
        created_at_time: [{ timestamp_nanos: BigInt(Date.now() * 1000000) }]
      };
      
      // Execute the transfer
      const result = await this.ledgerActor.transfer(transferArgs);

      if ('Ok' in result) {
        // Success case
        const accountIdHex = await this.getAccountIdHex();
        return {
          success: true,
          blockHeight: result.Ok.toString(),
          transactionId: `${result.Ok}-${memo}`,
          amount: amountIcp,
          fee: e8sToIcpHelper(this.transferFee),
          timestamp: Date.now(),
          from: accountIdHex,
          to: accountIdentifierToHex(toAccountId)
        };
      } else {
        // Error case
        const error = Object.keys(result.Err)[0];
        const errorDetails = result.Err[error];
        const accountIdHex = await this.getAccountIdHex();
        return {
          success: false,
          error,
          errorDetails,
          amount: amountIcp,
          from: accountIdHex,
          to: accountIdentifierToHex(toAccountId)
        };
      }
    } catch (error) {
      console.error("Error transferring funds:", error);
      throw error;
    }
  }
  
  /**
   * Get transaction history
   * @param {object} params - Query parameters
   * @param {number} [params.start] - Start index
   * @param {number} [params.length] - Number of transactions to retrieve
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactions({ start = 0, length = 10 } = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('ICP ledger service not initialized');
      }

      // In a real implementation, we would fetch transaction history from the ledger
      // For now, we'll simulate some transactions
      const accountIdHex = await this.getAccountIdHex();
      
      // Simulate transaction history
      const transactions = [];
      for (let i = 0; i < length; i++) {
        const timestamp = Date.now() - (i * 3600000);
        const isOutgoing = Math.random() > 0.5;
        transactions.push({
          id: `tx-${timestamp}-${i}`,
          blockHeight: (1000000 - i).toString(),
          timestamp,
          type: isOutgoing ? 'send' : 'receive',
          amount: parseFloat((Math.random() * 5).toFixed(8)),
          fee: 0.0001,
          status: 'confirmed',
          from: isOutgoing ? accountIdHex : `account-${i}`,
          to: isOutgoing ? `account-${i}` : accountIdHex,
          memo: `Transaction ${i}`
        });
      }
      
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }
  
  /**
   * Pay for data from a provider
   * @param {string} providerId - The provider's principal ID
   * @param {number} amount - Amount to pay in ICP
   * @param {string} dataDescription - Description of the data being purchased
   * @returns {Promise<object>} The result of the payment
   */
  async payForData(providerId, amount, dataDescription) {
    try {
      if (!this.isInitialized) {
        throw new Error('ICP ledger service not initialized');
      }
      
      // In a real implementation, we would convert the provider principal
      // to an account ID, but here we'll simulate it
      const providerAccountHex = providerId.length === 64 
        ? providerId 
        : Array.from({ length: 64 }, () => 
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join('');
      
      // Create a memo that includes information about the data purchase
      // This is a simplified approach - in a real system you might
      // want to use a more sophisticated approach to track data purchases
      const memoText = `data:${dataDescription}`;
      const encoder = new TextEncoder();
      const memoBytes = encoder.encode(memoText);
      let memoNumber = 0;
      for (let i = 0; i < memoBytes.length && i < 8; i++) {
        memoNumber = (memoNumber << 8) | memoBytes[i];
      }
      
      // Make the transfer
      const result = await this.transfer(
        providerAccountHex,
        amount,
        { memo: memoNumber }
      );
      
      return {
        ...result,
        provider: providerId,
        description: dataDescription
      };
    } catch (error) {
      console.error('Error paying for data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const icpLedgerService = new ICPLedgerService();

// Export interface for agent integration
export const initiatePayment = async (amountInICP, providerPrincipalId, description = "") => {
  try {
    console.log(`Initiating payment: ${amountInICP} ICP to ${providerPrincipalId}`);
    
    // Use the payForData method for proper data purchase tracking
    const result = await icpLedgerService.payForData(
      providerPrincipalId,
      amountInICP,
      description
    );
    
    return result;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

export default icpLedgerService;
