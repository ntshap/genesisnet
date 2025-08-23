// WalletContext.jsx
// This context provides wallet state and operations throughout the application

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { identityService } from '../services/identityService';
import { icpLedgerService } from '../services/icpLedgerService';
import { useNotifications } from './NotificationContext';

// Create the wallet context
const WalletContext = createContext(null);

// Wallet provider component
export const WalletProvider = ({ children }) => {
  // State for wallet functionality
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [accountIdHex, setAccountIdHex] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  
  // Access notifications
  const { addNotification } = useNotifications();

  // Initialize wallet
  const initializeWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize identity service
      const identityInitialized = await identityService.initialize();
      if (!identityInitialized) {
        throw new Error('Failed to initialize identity service');
      }
      
      // Initialize ICP ledger service with identity
      const ledgerInitialized = await icpLedgerService.initialize(identityService.getIdentity());
      if (!ledgerInitialized) {
        console.warn('Using mock ICP ledger service');
      }
      
      // Get wallet information
      const principal = identityService.getPrincipalText();
      const accountId = identityService.getAccountIdHex();
      
      setAddress(principal);
      setAccountIdHex(accountId);
      setIsInitialized(true);
      
      // Get initial balance
      await refreshBalance();
      
      addNotification({
        title: 'Wallet Initialized',
        message: 'Your ICP wallet is ready to use',
        type: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing wallet:', error);
      setError(error.message || 'Failed to initialize wallet');
      
      addNotification({
        title: 'Wallet Error',
        message: 'Failed to initialize your wallet',
        type: 'error'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  // Refresh wallet balance
  const refreshBalance = useCallback(async () => {
    if (!isInitialized) return;
    
    try {
      setIsLoading(true);
      const currentBalance = await icpLedgerService.getBalance();
      setBalance(currentBalance);
      return currentBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch wallet balance');
      return balance; // Return current balance as fallback
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, balance]);

  // Add funds to wallet (in a real app, this would connect to a faucet or exchange)
  const addFunds = useCallback(async (amount) => {
    if (!isInitialized) {
      setError('Wallet not initialized');
      return { success: false, error: 'Wallet not initialized' };
    }
    
    try {
      // In a real implementation, this would interface with a faucet or exchange
      // For demo purposes, we're just simulating the transaction
      
      // Create mock transaction record
      const transaction = {
        id: `tx-${Date.now()}`,
        type: 'receive',
        amount: amount,
        fee: 0,
        from: 'ICP Faucet',
        to: address,
        timestamp: Date.now(),
        status: 'completed',
        memo: 'Demo funds'
      };
      
      // Update state
      setBalance(prev => prev + amount);
      setTransactions(prev => [transaction, ...prev]);
      
      addNotification({
        title: 'Funds Added',
        message: `${amount.toFixed(2)} ICP added to your wallet`,
        type: 'success'
      });
      
      return {
        success: true,
        transaction
      };
    } catch (error) {
      console.error('Error adding funds:', error);
      setError('Failed to add funds to wallet');
      
      addNotification({
        title: 'Transaction Failed',
        message: 'Could not add funds to your wallet',
        type: 'error'
      });
      
      return { success: false, error: error.message };
    }
  }, [isInitialized, address, addNotification]);

  // Send payment
  const makePayment = useCallback(async (recipient, amount, memo = '') => {
    if (!isInitialized) {
      setError('Wallet not initialized');
      return { success: false, error: 'Wallet not initialized' };
    }
    
    if (amount <= 0) {
      setError('Invalid amount');
      return { success: false, error: 'Amount must be greater than 0' };
    }
    
    if (amount > balance) {
      setError('Insufficient balance');
      addNotification({
        title: 'Insufficient Balance',
        message: `You need ${amount.toFixed(2)} ICP but only have ${balance.toFixed(2)} ICP`,
        type: 'error'
      });
      return { success: false, error: 'Insufficient balance' };
    }
    
    try {
      setIsLoading(true);
      
      // Make the payment using ICP ledger service
      const result = await icpLedgerService.transfer(recipient, amount, { memo });
      
      // Add to transactions if successful
      if (result.success) {
        setTransactions(prev => [result, ...prev]);
        
        // Update balance
        await refreshBalance();
        
        addNotification({
          title: 'Payment Sent',
          message: `${amount.toFixed(2)} ICP sent successfully`,
          type: 'success'
        });
      } else {
        setError(result.error || 'Payment failed');
        
        addNotification({
          title: 'Payment Failed',
          message: result.error || 'Could not complete the transaction',
          type: 'error'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error making payment:', error);
      setError('Failed to send payment');
      
      addNotification({
        title: 'Transaction Failed',
        message: 'Could not send the payment',
        type: 'error'
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, balance, refreshBalance, addNotification]);

  // Get transaction history
  const getTransactionHistory = useCallback(async () => {
    if (!isInitialized) {
      return [];
    }
    
    try {
      setIsLoading(true);
      // In a real app, this would query the blockchain for transaction history
      // For now, we're just returning the cached transactions
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setError('Failed to fetch transaction history');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, transactions]);

  // Initialize wallet on component mount
  useEffect(() => {
    initializeWallet();
    
    // Set up a timer to refresh balance periodically
    const balanceTimer = setInterval(() => {
      if (isInitialized) {
        refreshBalance();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      clearInterval(balanceTimer);
    };
  }, [initializeWallet, isInitialized, refreshBalance]);

  // Clear error after a timeout
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Context values to provide
  const value = {
    isInitialized,
    isLoading,
    balance,
    address,
    accountIdHex,
    transactions,
    error,
    refreshBalance,
    addFunds,
    makePayment,
    getTransactionHistory,
    identityService,
    icpLedgerService
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
