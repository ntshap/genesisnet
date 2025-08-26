// historyService.js - Real transaction history implementation
// This service connects to the ROSETTA API to get transaction history for ICP accounts

import { identityService } from './identityService';
import { icpLedgerService } from './icpLedgerService';

// Rosetta API endpoint for ICP transaction history
const ROSETTA_API_URL = 'https://rosetta-api.internetcomputer.org';

/**
 * Get transaction history from Rosetta API
 * @param {string} accountId - Account ID in hex format
 * @param {object} options - Query options
 * @returns {Promise<Array>} Transaction history
 */
export async function getTransactionHistory(accountId, options = {}) {
  try {
    const { limit = 10, offset = 0 } = options;
    
    // Prepare request body for Rosetta API
    const requestBody = {
      network_identifier: {
        blockchain: 'Internet Computer',
        network: 'mainnet'
      },
      account_identifier: {
        address: accountId
      },
      options: {
        limit,
        offset
      }
    };
    
    // Call the Rosetta API
    const response = await fetch(`${ROSETTA_API_URL}/account/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    // Transform response to our format
    return data.transactions.map(tx => {
      const operations = tx.operations || [];
      const amount = operations.find(op => op.amount && op.amount.value)?.amount.value || 0;
      const fee = operations.find(op => op.type === 'FEE')?.amount?.value || 0;
      
      // Determine if this is an incoming or outgoing transaction
      const direction = operations.some(op => 
        op.account?.address === accountId && op.amount?.value && op.amount.value < 0
      ) ? 'outgoing' : 'incoming';
      
      return {
        id: tx.transaction_identifier.hash,
        blockHeight: tx.block_identifier.index,
        timestamp: new Date(tx.metadata.timestamp).getTime(),
        amount: Number(amount) / 100000000, // Convert from e8s to ICP
        fee: Number(fee) / 100000000, // Convert from e8s to ICP
        direction,
        memo: tx.metadata.memo || '',
        status: tx.status,
        from: operations.find(op => op.type === 'PAYMENT' && op.amount?.value < 0)?.account?.address || '',
        to: operations.find(op => op.type === 'PAYMENT' && op.amount?.value > 0)?.account?.address || ''
      };
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

/**
 * Get transaction history for the current user
 * @param {object} options - Query options
 * @returns {Promise<Array>} Transaction history
 */
export async function getCurrentUserTransactionHistory(options = {}) {
  const accountId = identityService.getAccountIdHex();
  return getTransactionHistory(accountId, options);
}

export const historyService = {
  getTransactionHistory,
  getCurrentUserTransactionHistory
};

export default historyService;
