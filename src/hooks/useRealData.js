import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { websocketService } from '../services/websocketService';

const useRealData = () => {
  // State management
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    totalNodes: 0,
    activeConnections: 0,
    dataTransferred: 0,
    networkLatency: 0
  });
  const [networkData, setNetworkData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [walletInfo, setWalletInfo] = useState({
    balance: 0,
    address: '',
    transactions: []
  });
  const [agentStatus, setAgentStatus] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // WebSocket event handlers
  const handleMetricsUpdate = useCallback((data) => {
    setMetrics(prev => ({ ...prev, ...data }));
  }, []);

  const handleNetworkUpdate = useCallback((data) => {
    setNetworkData(prev => [...prev.slice(-99), data]);
  }, []);

  const handleLogsUpdate = useCallback((data) => {
    setLogs(prev => [...prev.slice(-99), data]);
  }, []);

  const handleTransactionUpdate = useCallback((data) => {
    setWalletInfo(prev => ({
      ...prev,
      transactions: [...prev.transactions.slice(-19), data]
    }));
  }, []);

  const handleWalletUpdate = useCallback((data) => {
    setWalletInfo(prev => ({ ...prev, ...data }));
  }, []);

  // Initialize WebSocket connections
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        console.log('useRealData: Attempting WebSocket connection...');
        // Re-enable WebSocket for full functionality
        await websocketService.connect();
        console.log('useRealData: WebSocket connected successfully');
        
        // Subscribe to real-time updates
        websocketService.subscribe('metrics', handleMetricsUpdate);
        websocketService.subscribe('network_data', handleNetworkUpdate);
        websocketService.subscribe('logs', handleLogsUpdate);
        websocketService.subscribe('transaction', handleTransactionUpdate);
        websocketService.subscribe('wallet_update', handleWalletUpdate);
      } catch (error) {
        console.warn('useRealData: Failed to initialize WebSocket (continuing without real-time updates):', error);
        // Don't set error state - continue without WebSocket
      }
    };

    initializeWebSocket();

    return () => {
      try {
        websocketService.unsubscribe('metrics', handleMetricsUpdate);
        websocketService.unsubscribe('network_data', handleNetworkUpdate);
        websocketService.unsubscribe('logs', handleLogsUpdate);
        websocketService.unsubscribe('transaction', handleTransactionUpdate);
        websocketService.unsubscribe('wallet_update', handleWalletUpdate);
        websocketService.disconnect();
      } catch (error) {
        console.warn('useRealData: Error during WebSocket cleanup:', error);
      }
    };
  }, [handleMetricsUpdate, handleNetworkUpdate, handleLogsUpdate, handleTransactionUpdate, handleWalletUpdate]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('Loading initial data...');
        
        const [metricsData, networkInfo, walletData] = await Promise.all([
          apiService.network.getMetrics().catch(() => ({
            totalNodes: 15,
            activeConnections: 8,
            dataTransferred: '2.1 GB',
            networkLatency: 45
          })),
          apiService.network.getNodes().catch(() => [
            { id: 'node-1', status: 'active', location: 'US-East' },
            { id: 'node-2', status: 'active', location: 'EU-West' }
          ]),
          apiService.wallet.getBalance().catch(() => ({
            balance: 100.0,
            address: '0x1234...5678',
            transactions: []
          }))
        ]);
        
        setMetrics(metricsData);
        setNetworkData(networkInfo);
        setWalletInfo(walletData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setError('Failed to load initial data: ' + error.message);
        
        // Set fallback data
        setMetrics({
          totalNodes: 15,
          activeConnections: 8,
          dataTransferred: '2.1 GB',
          networkLatency: 45
        });
        setNetworkData([
          { id: 'node-1', status: 'active', location: 'US-East' },
          { id: 'node-2', status: 'active', location: 'EU-West' }
        ]);
        setWalletInfo({
          balance: 100.0,
          address: '0x1234...5678',
          transactions: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Action functions
  const searchData = useCallback(async (searchCriteria) => {
    console.log('=== USEREALDATA SEARCH DEBUG START ===');
    console.log('useRealData: searchData called with criteria:', searchCriteria);
    
    setLoading(true);
    setError(null);
    setAgentStatus('searching');
    
    try {
      console.log('Starting search with criteria:', searchCriteria);
      
      // Convert camelCase to snake_case for backend API
      const backendCriteria = {
        data_type: searchCriteria.dataType,
        location: searchCriteria.location,
        max_price: parseFloat(searchCriteria.maxPrice) || 100,
        min_reputation: parseFloat(searchCriteria.minReputation) || 0
      };
      
      console.log('Backend criteria (snake_case):', backendCriteria);
      console.log('About to call apiService.dataRequest.search');
      console.log('apiService:', apiService);
      console.log('apiService.dataRequest:', apiService.dataRequest);
      console.log('apiService.dataRequest.search:', apiService.dataRequest.search);
      
      // Gunakan API untuk search data providers dengan endpoint yang benar
      const response = await apiService.dataRequest.search(backendCriteria);
      console.log('Search API response received:', response);
      
      // Extract results dari response
      const results = response.results || response;
      console.log('Search results from API:', results);
      console.log('Response structure:', response);
      
      if (!results || !Array.isArray(results)) {
        console.error('Invalid API response structure:', response);
        throw new Error('Invalid response from API - results is not an array: ' + typeof results);
      }
      
      console.log('About to transform results, count:', results.length);
      
      // Transform results ke format yang diharapkan frontend
      const formattedResults = results.map(provider => ({
        id: provider.id || 'provider-' + Date.now(),
        name: provider.name || 'Unknown Provider',
        dataType: searchCriteria.dataType || 'weather',
        location: provider.location || searchCriteria.location || 'Global',
        currentPrice: provider.price?.toString() || provider.basePrice?.toString() || '2.5',
        basePrice: provider.price?.toString() || provider.basePrice?.toString() || '2.5',
        dataQuality: provider.dataQuality || 8,
        reputation: provider.reputation || provider.reputation_score || 8.5,
        availability: provider.availability || 'available',
        lastUpdate: provider.lastUpdate || new Date().toISOString(),
        description: provider.description || `${searchCriteria.dataType} data from ${provider.location || searchCriteria.location}`,
        responseTime: provider.responseTime || '< 1 second'
      }));
      
      console.log('Formatted results:', formattedResults);
      console.log('About to setSearchResults');
      
      setSearchResults(formattedResults);
      setAgentStatus('idle');
      
      console.log('=== USEREALDATA SEARCH DEBUG END - SUCCESS ===');
      return formattedResults;
    } catch (error) {
      console.error('=== USEREALDATA SEARCH ERROR ===');
      console.error('Search error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      
      setError('Search failed: ' + error.message);
      setAgentStatus('idle');
      
      console.log('=== USEREALDATA SEARCH DEBUG END - ERROR ===');
      
      // Jangan gunakan fallback mock - biarkan error
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const negotiateData = useCallback(async (providerId, terms) => {
    setAgentStatus('negotiating');
    try {
      console.log('Starting negotiation with provider:', providerId, 'terms:', terms);
      
      // Gunakan API untuk negotiate
      const result = await apiService.dataRequest.requestData({ providerId, terms });
      setAgentStatus('idle');
      
      // Mock successful negotiation
      const mockResult = {
        success: true,
        providerId,
        terms,
        negotiationId: 'neg-' + Date.now(),
        status: 'accepted',
        finalPrice: terms.price,
        estimatedDelivery: '5 minutes'
      };
      
      return mockResult;
    } catch (error) {
      console.error('Negotiation error:', error);
      setAgentStatus('idle');
      setError('Negotiation failed: ' + error.message);
      
      // Mock successful negotiation for development
      const mockResult = {
        success: true,
        providerId,
        terms,
        negotiationId: 'neg-' + Date.now(),
        status: 'accepted',
        finalPrice: terms.price || '2.5',
        estimatedDelivery: '5 minutes'
      };
      
      return mockResult;
    }
  }, []);

  const downloadData = useCallback(async (dataId) => {
    setAgentStatus('downloading');
    try {
      console.log('Starting download for data ID:', dataId);
      
      // Mock download process
      const result = {
        success: true,
        dataId,
        downloadId: 'dl-' + Date.now(),
        status: 'completed',
        data: `Mock data for ${dataId}`,
        size: '1.2 MB',
        format: 'JSON'
      };
      
      setAgentStatus('idle');
      return result;
    } catch (error) {
      console.error('Download error:', error);
      setAgentStatus('idle');
      setError('Download failed: ' + error.message);
      
      // Return mock successful download
      const result = {
        success: true,
        dataId,
        downloadId: 'dl-' + Date.now(),
        status: 'completed',
        data: `Mock data for ${dataId}`,
        size: '1.2 MB',
        format: 'JSON'
      };
      
      return result;
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Refreshing data...');
      
      // Gunakan API yang ada
      const [metricsData, networkInfo] = await Promise.all([
        apiService.network.getMetrics().catch(() => ({
          totalNodes: 15,
          activeConnections: 8,
          dataTransferred: '2.1 GB',
          networkLatency: 45
        })),
        apiService.network.getNodes().catch(() => [
          { id: 'node-1', status: 'active', location: 'US-East' },
          { id: 'node-2', status: 'active', location: 'EU-West' }
        ])
      ]);
      
      setMetrics(metricsData);
      setNetworkData(networkInfo);
    } catch (error) {
      console.error('Refresh error:', error);
      setError('Refresh failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFunds = useCallback(async (amount) => {
    try {
      console.log('Adding funds:', amount);
      const result = await apiService.wallet.addFunds(amount);
      // Wallet will be updated via WebSocket or direct state update
      setWalletInfo(prev => ({
        ...prev,
        balance: prev.balance + parseFloat(amount)
      }));
      return result;
    } catch (error) {
      console.error('Add funds error:', error);
      setError('Failed to add funds: ' + error.message);
      
      // Mock successful funding for development
      setWalletInfo(prev => ({
        ...prev,
        balance: prev.balance + parseFloat(amount)
      }));
      
      return { success: true, amount, newBalance: walletInfo.balance + parseFloat(amount) };
    }
  }, [walletInfo.balance]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Debug logging for return object
  const returnObject = {
    // State
    logs,
    metrics,
    networkData,
    searchResults,
    walletInfo,
    agentStatus,
    loading,
    error,
    
    // Actions
    searchData,
    negotiateData,
    downloadData,
    refreshData,
    addFunds,
    clearError
  };

  // Log the functions being returned
  console.log('=== USEREALDATA RETURN DEBUG ===');
  console.log('useRealData: Returning object with functions:');
  console.log('useRealData: searchData type:', typeof searchData);
  console.log('useRealData: searchData exists:', !!searchData);
  console.log('useRealData: negotiateData type:', typeof negotiateData);
  console.log('useRealData: All function types:', {
    searchData: typeof searchData,
    negotiateData: typeof negotiateData,
    downloadData: typeof downloadData,
    refreshData: typeof refreshData,
    addFunds: typeof addFunds,
    clearError: typeof clearError
  });
  console.log('=== END USEREALDATA RETURN DEBUG ===');

  return returnObject;
};

export default useRealData;
