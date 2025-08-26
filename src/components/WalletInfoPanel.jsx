// WalletInfoPanel.jsx
// Component for displaying wallet information and transaction history

import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Copy, RefreshCw, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

// Format date to readable string
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Format ICP amount with proper decimals
const formatICP = (amount) => {
  return parseFloat(amount).toFixed(4);
};

// Format address for display (truncate middle)
const formatAddress = (address, length = 8) => {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
};

const WalletInfoPanel = () => {
  const { 
    isInitialized,
    isLoading,
    balance,
    address,
    accountIdHex,
    transactions,
    error,
    refreshBalance,
    addFunds,
    getTransactionHistory
  } = useWallet();

  const [activeTab, setActiveTab] = useState('balance');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inputAmount, setInputAmount] = useState('');

  // Handle copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle refresh balance
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    await getTransactionHistory();
    setIsRefreshing(false);
  };

  // Handle add funds (demo mode)
  const handleAddFunds = async () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    await addFunds(amount);
    setInputAmount('');
  };

  // Refresh data on component mount
  useEffect(() => {
    if (isInitialized) {
      handleRefresh();
    }
  }, [isInitialized]);

  // Render loading state
  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p>Loading wallet information...</p>
      </div>
    );
  }

  // Render error state
  if (error && !isInitialized) {
    return (
      <div className="p-4 bg-red-100 border-red-400 border rounded-lg">
        <h3 className="font-bold text-red-800">Wallet Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="wallet-info-panel bg-white shadow-lg border-3 border-black rounded-lg overflow-hidden">
      {/* Header with balance and controls */}
      <div className="p-4 bg-yellow-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-black">💰 ICP WALLET</h2>
          <button 
            className="flex items-center bg-yellow-300 px-3 py-1 rounded-lg border-2 border-black hover:bg-yellow-400 transition-colors"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {/* Balance Display */}
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">Current Balance</div>
          <div className="text-4xl font-bold text-green-600">{formatICP(balance)} ICP</div>
          <div className="text-sm text-gray-500">≈ ${(balance * 25).toFixed(2)} USD</div>
        </div>

        {/* Address Display */}
        <div className="mt-4 bg-gray-100 p-2 rounded-lg">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Principal ID:</span>
            <button 
              onClick={() => copyToClipboard(address)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="font-mono text-sm break-all">{formatAddress(address, 12)}</div>
          
          <div className="flex justify-between items-center text-xs text-gray-600 mt-2">
            <span>Account ID:</span>
            <button 
              onClick={() => copyToClipboard(accountIdHex)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="font-mono text-sm break-all">{formatAddress(accountIdHex, 12)}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b-2 border-black">
        <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'balance' ? 'bg-blue-100 border-b-2 border-blue-500' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('balance')}
        >
          Transactions
        </button>
        <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'deposit' ? 'bg-blue-100 border-b-2 border-blue-500' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Transactions Tab */}
        {activeTab === 'balance' && (
          <div>
            <h3 className="font-bold mb-2">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No transactions yet</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="border rounded p-2 flex items-center">
                    {tx.type === 'receive' ? (
                      <ArrowDownLeft className="mr-2 text-green-500" size={20} />
                    ) : (
                      <ArrowUpRight className="mr-2 text-red-500" size={20} />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          {tx.type === 'receive' ? 'Received' : 'Sent'}
                        </span>
                        <span className={tx.type === 'receive' ? 'text-green-600' : 'text-red-600'}>
                          {tx.type === 'receive' ? '+' : '-'}{formatICP(tx.amount)} ICP
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(tx.timestamp)}
                      </div>
                      <div className="text-xs truncate">
                        {tx.type === 'receive' ? 'From: ' : 'To: '}
                        {formatAddress(tx.type === 'receive' ? tx.from : tx.to, 8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div>
            <h3 className="font-bold mb-2">Add Funds (Demo Mode)</h3>
            <p className="text-sm text-gray-600 mb-4">
              In a real application, this would connect to a faucet, exchange, or another ICP wallet.
            </p>
            
            <div className="flex space-x-2">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="flex-1 p-2 border-2 border-black rounded"
                placeholder="Amount in ICP"
                min="0.0001"
                step="0.1"
              />
              <button
                onClick={handleAddFunds}
                disabled={!inputAmount || isNaN(parseFloat(inputAmount)) || parseFloat(inputAmount) <= 0}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded border-2 border-black disabled:opacity-50"
              >
                Add Funds
              </button>
            </div>
            
            <div className="mt-4 flex space-x-2">
              {[1, 5, 10, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => setInputAmount(amount.toString())}
                  className="px-2 py-1 bg-gray-200 rounded border border-gray-400 text-sm hover:bg-gray-300"
                >
                  {amount} ICP
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfoPanel;
