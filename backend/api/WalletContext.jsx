import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Assuming identityService is properly implemented and provides an identity object
// No changes here, as it's not part of the scope.
import { identityService } from '../services/identityService';
import icpLedgerService from '../services/icpLedgerService';

export const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState('0.00000000');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [accountId, setAccountId] = useState(null);

  const initializeServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      try {
        // Assuming identityService.initialize() handles identity creation if none exists
        await identityService.initialize();
        const identity = identityService.getIdentity();
        
        if (!identity) {
          throw new Error('Failed to get a valid identity after initialization');
        }
        
        await icpLedgerService.initialize(identity);
        
        const userPrincipal = icpLedgerService.getPrincipal();
        const userAccountId = icpLedgerService.getAccountId();
        
        if (userPrincipal) setPrincipal(userPrincipal);
        if (userAccountId) setAccountId(userAccountId);
      } catch (serviceError) {
        console.error('WalletProvider: Service initialization failed:', serviceError);
        setError(serviceError.message || 'Failed to initialize wallet services');
      }
      
      await refreshBalance();
      
      setIsInitialized(true);
    } catch (err) {
      console.error('WalletProvider: Initialization failed:', err);
      setError(err.message || 'Failed to initialize wallet services');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    try {
      console.log('WalletProvider: Refreshing balance...');
      
      const newBalance = await icpLedgerService.getBalance();
      
      // Validate the balance response
      if (newBalance !== null && newBalance !== undefined && typeof newBalance === 'number' && !isNaN(newBalance)) {
        setBalance(newBalance.toFixed(8));
        console.log('WalletProvider: Balance updated successfully:', newBalance.toFixed(8), 'ICP');
      } else {
        console.warn('WalletProvider: Invalid balance received:', newBalance);
        setError('Received invalid balance data');
        setBalance('0.00000000');
      }
      
    } catch (err) {
      console.error('WalletProvider: Failed to refresh balance:', err);
      setError(`Failed to fetch balance: ${err.message}`);
    }
  }, []);
  
  /**
   * Makes a payment using the ICP Ledger.
   * @param {string} recipient - The recipient's account ID in hex format.
   * @param {number} amount - The amount to send in ICP.
   * @returns {Promise<{success: boolean, transactionId?: string, error?: string}>}
   */
  const makePayment = useCallback(async (recipient, amount) => {
    try {
      if (!icpLedgerService.isServiceInitialized()) {
        throw new Error('ICP Ledger service is not initialized.');
      }
      
      const currentBalance = parseFloat(balance);
      const fee = await icpLedgerService.getTransferFeeIcp();
      const totalCost = amount + fee;
      
      if (currentBalance < totalCost) {
        throw new Error('Insufficient balance to cover amount and fee.');
      }
      
      console.log(`Making payment of ${amount} ICP to ${recipient}...`);
      
      // Call the real transfer method on the ledger
      const blockHeight = await icpLedgerService.transfer(recipient, amount);
      
      const transaction = {
        id: blockHeight.toString(),
        type: 'send',
        amount: amount,
        fee: fee,
        recipient,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Refresh balance after a successful transfer
      await refreshBalance();
      
      console.log('Payment successful. Block height:', blockHeight);
      return { success: true, transactionId: blockHeight.toString() };
      
    } catch (err) {
      console.error('WalletProvider: Failed to make payment:', err);
      setError(`Payment failed: ${err.message}`);
      
      // Add a failed transaction entry
      const failedTransaction = {
        id: Date.now().toString(),
        type: 'send',
        amount: amount,
        recipient,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: err.message
      };
      setTransactions(prev => [failedTransaction, ...prev]);
      
      return { success: false, error: err.message };
    }
  }, [balance, refreshBalance]); // Dependency on balance ensures it's up-to-date

  // This is no longer needed since we are using the real transfer method
  const addFunds = useCallback(() => {
    console.warn("addFunds mock is no longer supported. Please fund your account directly on the ICP network.");
  }, []);

  const clearWallet = useCallback(() => {
    setBalance('0.00000000');
    setTransactions([]);
    setPrincipal(null);
    setAccountId(null);
    setIsInitialized(false);
    setError(null);
  }, []);

  useEffect(() => {
    initializeServices();
  }, [initializeServices]);

  const value = {
    balance,
    transactions,
    isLoading,
    isInitialized,
    error,
    principal,
    accountId,
    refreshBalance,
    addFunds, // Kept for API compatibility, but warns user
    makePayment,
    clearWallet,
    retryInitialization: initializeServices,
    isReady: () => isInitialized && !isLoading && !error
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

