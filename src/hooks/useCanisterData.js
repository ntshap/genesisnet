import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAgentLogs, 
  getAgentMetrics, 
  getNetworkVisualizationData, 
  getAgentStatus,
  getICPConnectionStatus,
  startSearchAgent,
  negotiateWithProvider 
} from '../services/icpAgent.js';

const useCanisterData = () => {
  // Default network data for immediate visualization
  const defaultNetworkData = {
    nodes: [
      { id: 'requester', name: 'Data Requester Agent', type: 'requester', status: 'searching', fx: 400, fy: 300 },
      { id: 'provider1', name: 'FinanceData Corp', type: 'provider', reputation: 9.2, price: '100 ICP', status: 'active', location: 'US-East' },
      { id: 'provider2', name: 'SocialInsights Ltd', type: 'provider', reputation: 7.8, price: '120 ICP', status: 'active', location: 'EU-West' },
      { id: 'provider3', name: 'ResearchData Hub', type: 'provider', reputation: 8.5, price: '95 ICP', status: 'negotiating', location: 'Asia-Pacific' },
      { id: 'provider4', name: 'MediaStream AI', type: 'provider', reputation: 6.9, price: '85 ICP', status: 'active', location: 'US-West' }
    ],
    links: [
      { source: 'requester', target: 'provider1', strength: 0.8, status: 'active' },
      { source: 'requester', target: 'provider2', strength: 0.6, status: 'idle' },
      { source: 'requester', target: 'provider3', strength: 0.7, status: 'negotiating' },
      { source: 'requester', target: 'provider4', strength: 0.5, status: 'active' }
    ]
  };

  // State management
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTransactions: 42,
    averagePricePerDataUnit: 15.5,
    networkLatency: 120,
    activeProviders: 4,
    successfulNegotiations: 38
  });
  const [networkData, setNetworkData] = useState(defaultNetworkData); // Start with default data
  const [agentStatus, setAgentStatus] = useState('Searching');
  const [connectionStatus, setConnectionStatus] = useState({
    isInitialized: true, // Start as initialized
    fallbackToMock: true, // Start with mock immediately
    hasActors: false
  });
  const [isLoading, setIsLoading] = useState(false); // Start without loading
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Refs for intervals and cleanup
  const intervalRefs = useRef({});
  const mounted = useRef(true);

  // Helper function to safely update state if component is still mounted
  const safeSetState = useCallback((setter, value) => {
    if (mounted.current) {
      setter(value);
    }
  }, []);

  // Fetch functions with error handling
  const fetchLogs = useCallback(async () => {
    try {
      const newLogs = await getAgentLogs(100);
      safeSetState(setLogs, newLogs);
      return true;
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Don't set error state for logs - just use fallback
      const fallbackLogs = [
        `[${new Date().toLocaleTimeString()}] [INFO] System initialized`,
        `[${new Date().toLocaleTimeString()}] [INFO] Ready for data search`,
        `[${new Date().toLocaleTimeString()}] [DEBUG] GenesisNet interface active`
      ];
      safeSetState(setLogs, fallbackLogs);
      return false;
    }
  }, [safeSetState]);

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('🔄 Fetching metrics...');
      const newMetrics = await getAgentMetrics();
      console.log('✅ Metrics fetched successfully:', newMetrics);
      safeSetState(setMetrics, newMetrics);
      return true;
    } catch (error) {
      console.error('❌ Error fetching metrics:', error);
      
      // Use fallback metrics without setting error state
      const fallbackMetrics = {
        totalTransactions: 42,
        averagePricePerDataUnit: 15.5,
        networkLatency: 120,
        activeProviders: 4,
        successfulNegotiations: 38
      };
      safeSetState(setMetrics, fallbackMetrics);
      return false;
    }
  }, [safeSetState]);

  const fetchNetworkData = useCallback(async () => {
    try {
      console.log('🌐 Fetching network data...');
      const newNetworkData = await getNetworkVisualizationData();
      console.log('🌐 Network data received:', newNetworkData);
      safeSetState(setNetworkData, newNetworkData);
      return true;
    } catch (error) {
      console.error('Error fetching network data:', error);
      // Don't set error - keep using default network data
      return false;
    }
  }, [safeSetState]);

  const fetchAgentStatus = useCallback(async () => {
    try {
      const status = await getAgentStatus();
      safeSetState(setAgentStatus, status);
      return true;
    } catch (error) {
      console.error('Error fetching agent status:', error);
      return false;
    }
  }, [safeSetState]);

  const updateConnectionStatus = useCallback(() => {
    const status = getICPConnectionStatus();
    safeSetState(setConnectionStatus, status);
  }, [safeSetState]);

  // Comprehensive data fetch
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting data fetch...');
      updateConnectionStatus();
      
      const results = await Promise.allSettled([
        fetchLogs(),
        fetchMetrics(),
        fetchNetworkData(),
        fetchAgentStatus()
      ]);

      const failedOperations = results.filter(result => result.status === 'rejected');
      
      if (failedOperations.length === 4) {
        // Only show error if ALL operations failed
        console.error('All operations failed - system may be offline');
        safeSetState(setError, 'Connection issues detected - using fallback data');
        
        // Clear error after 3 seconds since we have fallback data
        setTimeout(() => {
          safeSetState(setError, null);
        }, 3000);
      } else {
        console.log(`✅ Data fetch completed - ${4 - failedOperations.length}/4 operations successful`);
      }

      safeSetState(setLastUpdate, new Date());
    } catch (error) {
      console.error('Error in fetchAllData:', error);
      // Don't show error for minor issues, just log
      console.warn('Data fetch had issues, but continuing with available data');
    } finally {
      safeSetState(setIsLoading, false);
    }
  }, [fetchLogs, fetchMetrics, fetchNetworkData, fetchAgentStatus, updateConnectionStatus, safeSetState]);

  // Start search with real-time updates
  const startSearch = useCallback(async (searchCriteria) => {
    try {
      safeSetState(setAgentStatus, 'Searching');
      const result = await startSearchAgent(searchCriteria);
      
      // Add success log
      const successLog = `[${new Date().toLocaleTimeString()}] Search started: ${JSON.stringify(searchCriteria)}`;
      safeSetState(setLogs, prevLogs => [...prevLogs, successLog]);
      
      // Trigger immediate data refresh
      setTimeout(() => fetchAllData(), 1000);
      
      return result;
    } catch (error) {
      console.error('Error starting search:', error);
      safeSetState(setAgentStatus, 'Error');
      safeSetState(setError, `Failed to start search: ${error.message}`);
      throw error;
    }
  }, [fetchAllData, safeSetState]);

  // Negotiate with provider
  const negotiate = useCallback(async (providerId, price) => {
    try {
      safeSetState(setAgentStatus, 'Negotiating');
      
      // Use the enhanced mock negotiation function
      const { mockNegotiateWithProvider } = await import('../services/mockData.js');
      const result = await mockNegotiateWithProvider(providerId, price);
      
      // Status will be updated by the mock function, so we just need to refresh data
      setTimeout(() => fetchAllData(), 500);
      
      return result;
    } catch (error) {
      console.error('Error during negotiation:', error);
      safeSetState(setAgentStatus, 'Error');
      safeSetState(setError, `Negotiation failed: ${error.message}`);
      throw error;
    }
  }, [fetchAllData, safeSetState]);

  // Real-time data polling setup
  const setupPolling = useCallback(() => {
    // Clear existing intervals
    Object.values(intervalRefs.current).forEach(clearInterval);
    
    // Setup new intervals based on agent status
    const getPollingInterval = (dataType) => {
      switch (agentStatus) {
        case 'Searching':
        case 'Negotiating':
          return dataType === 'status' ? 1000 : 2000; // High frequency during activity
        case 'Active':
          return dataType === 'status' ? 2000 : 5000; // Medium frequency when active
        default:
          return dataType === 'status' ? 5000 : 10000; // Low frequency when idle
      }
    };

    // Status polling (most frequent)
    intervalRefs.current.status = setInterval(fetchAgentStatus, getPollingInterval('status'));
    
    // Logs polling
    intervalRefs.current.logs = setInterval(fetchLogs, getPollingInterval('logs'));
    
    // Metrics polling
    intervalRefs.current.metrics = setInterval(fetchMetrics, getPollingInterval('metrics'));
    
    // Network data polling (least frequent)
    intervalRefs.current.network = setInterval(fetchNetworkData, getPollingInterval('network') * 2);
    
    // Connection status check
    intervalRefs.current.connection = setInterval(updateConnectionStatus, 30000); // Every 30 seconds

  }, [agentStatus, fetchAgentStatus, fetchLogs, fetchMetrics, fetchNetworkData, updateConnectionStatus]);

  // Initialize data and start polling
  useEffect(() => {
    mounted.current = true;
    
    // Immediate data fetch without loading state
    const initializeData = async () => {
      try {
        console.log('🔄 Initializing data with defaults...');
        updateConnectionStatus();
        
        // Fetch all data immediately
        const results = await Promise.allSettled([
          fetchLogs(),
          fetchMetrics(), 
          fetchNetworkData(),
          fetchAgentStatus()
        ]);
        
        console.log('📊 Data fetch results:', results.map(r => r.status));
        
        safeSetState(setLastUpdate, new Date());
        safeSetState(setIsLoading, false);
        
        // Start polling after initial load
        setupPolling();
        
      } catch (error) {
        console.error('Error initializing data:', error);
        safeSetState(setError, `Failed to initialize: ${error.message}`);
        safeSetState(setIsLoading, false);
      }
    };
    
    initializeData();
    
    return () => {
      mounted.current = false;
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [fetchAllData, updateConnectionStatus, fetchLogs, fetchMetrics, fetchNetworkData, fetchAgentStatus, setupPolling, safeSetState]);

  // Update polling intervals when agent status changes
  useEffect(() => {
    if (!isLoading) {
      setupPolling();
    }
    
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, [agentStatus, isLoading, setupPolling]);

  // Manual refresh function
  const refresh = useCallback(() => {
    return fetchAllData();
  }, [fetchAllData]);

  // Clear error function
  const clearError = useCallback(() => {
    safeSetState(setError, null);
  }, [safeSetState]);

  return {
    // Data
    logs,
    metrics,
    networkData,
    agentStatus,
    connectionStatus,
    
    // State
    isLoading,
    error,
    lastUpdate,
    
    // Actions
    startSearch,
    negotiate,
    refresh,
    clearError,
    
    // Utilities
    isConnectedToICP: connectionStatus.isInitialized && !connectionStatus.fallbackToMock,
    isMockMode: connectionStatus.fallbackToMock
  };
};

export default useCanisterData;