import React, { useState } from 'react';
import { 
  Clock, 
  BarChart, 
  ArrowDown, 
  ArrowUp, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Search, 
  Filter,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TransactionHistory = ({ transactionPool = [], completedDeliveries = [] }) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  
  // Combine transaction pool and completed deliveries
  const allTransactions = [
    ...transactionPool.map(tx => ({ ...tx, status: 'pending' })),
    ...completedDeliveries.map(tx => ({ ...tx, status: 'completed' }))
  ];

  // Filter transactions based on tab and search term
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'pending') return tx.status === 'pending' && matchesSearch;
    if (currentTab === 'completed') return tx.status === 'completed' && matchesSearch;
    return matchesSearch;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date || a.completedAt || Date.now());
      const dateB = new Date(b.date || b.completedAt || Date.now());
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' ? (a.amount || 0) - (b.amount || 0) : (b.amount || 0) - (a.amount || 0);
    }
    if (sortConfig.key === 'provider') {
      return sortConfig.direction === 'asc' 
        ? (a.provider || '').localeCompare(b.provider || '')
        : (b.provider || '').localeCompare(a.provider || '');
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleExpandTransaction = (id) => {
    if (expandedTransactionId === id) {
      setExpandedTransactionId(null);
    } else {
      setExpandedTransactionId(id);
    }
  };

  return (
    <div className="transaction-history bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
      {/* Header */}
      <div className="bg-purple-200 border-b-4 border-black p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-black">Transaction History</h2>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-lg bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm flex items-center">
              <BarChart className="w-5 h-5 mr-1" />
              Analytics
            </button>
            <button className="px-4 py-2 rounded-lg border-2 border-black font-bold text-sm flex items-center">
              <Calendar className="w-5 h-5 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-4 border-black p-2 bg-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentTab('all')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'all' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setCurrentTab('pending')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'pending' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setCurrentTab('completed')}
            className={`px-4 py-2 rounded-lg border-2 border-black font-bold text-sm ${
              currentTab === 'completed' 
                ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white hover:bg-yellow-100'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Transactions list */}
      <div className="flex-grow overflow-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="px-4 py-2 text-left">Data</th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('provider')}
              >
                Provider {sortConfig.key === 'provider' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-600">
                  No Transactions Found
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <tr className="border-b border-gray-200 hover:bg-yellow-50">
                    <td className="px-4 py-3 font-bold">{transaction.name || 'Unknown Data'}</td>
                    <td className="px-4 py-3">{transaction.provider || 'Unknown'}</td>
                    <td className="px-4 py-3">{formatDate(transaction.date || transaction.completedAt)}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold">{transaction.amount || '0'} credits</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </>
                        ) : transaction.status === 'pending' ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Pending
                          </>
                        ) : (
                          'Unknown'
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleExpandTransaction(transaction.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedTransactionId === transaction.id ? 
                          <ChevronUp className="w-5 h-5" /> : 
                          <ChevronDown className="w-5 h-5" />
                        }
                      </button>
                    </td>
                  </tr>
                  {expandedTransactionId === transaction.id && (
                    <tr>
                      <td colSpan="6" className="px-4 py-3 bg-gray-50">
                        <div className="p-3 border-2 border-black rounded-lg bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <h4 className="font-bold mb-2">Transaction Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 font-bold">Transaction ID</p>
                              <p className="font-medium">{transaction.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-bold">Data Type</p>
                              <p className="font-medium">{transaction.type || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-bold">Time Started</p>
                              <p className="font-medium">{formatDate(transaction.date)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-bold">Time Completed</p>
                              <p className="font-medium">{transaction.completedAt ? formatDate(transaction.completedAt) : 'Not completed'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-bold">Size</p>
                              <p className="font-medium">{transaction.size ? `${(transaction.size / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-bold">Payment Method</p>
                              <p className="font-medium">Data Credits</p>
                            </div>
                          </div>
                          
                          {transaction.status === 'completed' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-gray-500 font-bold">Completion Time</p>
                              <p className="font-medium">{formatDate(transaction.completedAt)}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
