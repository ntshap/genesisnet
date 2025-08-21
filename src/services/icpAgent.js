// ICP Agent Service - Configured for Mock DFX Replica Server
// Connects to mock server at http://localhost:4943

// Mock server configuration
const MOCK_SERVER_URL = 'http://localhost:4943';

// Mock canister IDs from mock_dfx_replica.py
const CANISTER_IDS = {
  data_requester: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  data_provider: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  reputation_agent: 'rno2w-sqaaa-aaaaa-aaacq-cai'
};

// Mock data for development
const mockAgentLogs = [
  { timestamp: new Date().toISOString(), level: 'info', message: 'Agent initialized successfully', source: 'data_requester' },
  { timestamp: new Date().toISOString(), level: 'info', message: 'Searching for data providers...', source: 'data_requester' },
  { timestamp: new Date().toISOString(), level: 'success', message: 'Found 3 potential providers', source: 'data_requester' },
  { timestamp: new Date().toISOString(), level: 'info', message: 'Starting negotiation process', source: 'reputation_agent' }
];

const mockMetrics = {
  totalRequests: 156,
  successfulTransactions: 142,
  activeProviders: 8,
  averageResponseTime: 1.2,
  networkHealth: 95,
  reputationScore: 8.7
};

const mockNetworkData = {
  nodes: [
    { id: 'requester', name: 'Data Requester Agent', type: 'requester', status: 'active', fx: 400, fy: 300 },
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

// Helper function to make API calls to mock server
async function callMockServer(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${MOCK_SERVER_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Mock server call failed for ${endpoint}:`, error);
    // Return mock data as fallback
    return { status: 'mock_fallback', data: null };
  }
}

// Exported functions for use by React components

/**
 * Get agent logs from the mock server
 */
export async function getAgentLogs() {
  try {
    const response = await callMockServer('/api/v2/status');
    if (response.status === 'mock_fallback') {
      return mockAgentLogs;
    }
    
    // Transform server response to expected format
    return [
      { 
        timestamp: new Date().toISOString(), 
        level: 'info', 
        message: `Mock server status: ${response.replica_health_status}`, 
        source: 'mock_server' 
      },
      ...mockAgentLogs
    ];
  } catch (error) {
    console.error('Error fetching agent logs:', error);
    return mockAgentLogs;
  }
}

/**
 * Get agent metrics from the mock server
 */
export async function getAgentMetrics() {
  try {
    const response = await callMockServer('/api/v2/status');
    if (response.status === 'mock_fallback') {
      return mockMetrics;
    }
    
    // Enhance mock metrics with server data
    return {
      ...mockMetrics,
      serverVersion: response.version || 'unknown',
      serverStatus: response.replica_health_status || 'unknown'
    };
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    return mockMetrics;
  }
}

/**
 * Get network visualization data
 */
export async function getNetworkVisualizationData() {
  try {
    const response = await callMockServer('/_/dashboard');
    if (response.status === 'mock_fallback') {
      return mockNetworkData;
    }
    
    // Enhance network data with server information
    const enhancedData = { ...mockNetworkData };
    if (response.canisters) {
      enhancedData.serverInfo = {
        canisters: response.canisters,
        requestsCount: response.requests_count || 0,
        providersCount: response.providers_count || 0,
        transactionsCount: response.transactions_count || 0
      };
    }
    
    return enhancedData;
  } catch (error) {
    console.error('Error fetching network data:', error);
    return mockNetworkData;
  }
}

/**
 * Get agent status
 */
export async function getAgentStatus() {
  try {
    const response = await callMockServer('/api/v2/status');
    if (response.status === 'mock_fallback') {
      return { status: 'active', health: 'good', lastUpdate: new Date().toISOString() };
    }
    
    return {
      status: response.replica_health_status === 'healthy' ? 'active' : 'inactive',
      health: response.replica_health_status || 'unknown',
      version: response.version || 'unknown',
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching agent status:', error);
    return { status: 'error', health: 'poor', lastUpdate: new Date().toISOString() };
  }
}

/**
 * Get ICP connection status
 */
export async function getICPConnectionStatus() {
  try {
    const response = await callMockServer('/api/v2/status');
    if (response.status === 'mock_fallback') {
      return { connected: false, network: 'mock', latency: 0 };
    }
    
    return {
      connected: response.replica_health_status === 'healthy',
      network: 'mock_replica',
      version: response.version || 'unknown',
      latency: Math.random() * 100 + 50 // Mock latency
    };
  } catch (error) {
    console.error('Error checking ICP connection:', error);
    return { connected: false, network: 'error', latency: 0 };
  }
}

/**
 * Start search agent
 */
export async function startSearchAgent(searchParams = {}) {
  try {
    const response = await callMockServer(
      `/api/v2/canister/${CANISTER_IDS.data_requester}/call`,
      'POST',
      {
        method_name: 'submit_request',
        arg: JSON.stringify(searchParams)
      }
    );
    
    if (response.status === 'mock_fallback') {
      return { 
        success: true, 
        requestId: 'mock-request-' + Date.now(),
        message: 'Search agent started (mock mode)' 
      };
    }
    
    return {
      success: response.status === 'replied',
      requestId: response.reply?.arg || 'unknown',
      message: 'Search agent started successfully'
    };
  } catch (error) {
    console.error('Error starting search agent:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to start search agent' 
    };
  }
}

/**
 * Negotiate with provider
 */
export async function negotiateWithProvider(providerId, terms = {}) {
  try {
    const response = await callMockServer(
      `/api/v2/canister/${CANISTER_IDS.reputation_agent}/call`,
      'POST',
      {
        method_name: 'update_reputation',
        arg: JSON.stringify({ providerId, terms })
      }
    );
    
    if (response.status === 'mock_fallback') {
      return {
        success: true,
        negotiationId: 'mock-negotiation-' + Date.now(),
        finalPrice: Math.floor(Math.random() * 50) + 80,
        message: 'Negotiation completed (mock mode)'
      };
    }
    
    return {
      success: response.status === 'replied',
      negotiationId: 'negotiation-' + Date.now(),
      finalPrice: parseFloat(response.reply?.arg) || 100,
      message: 'Negotiation completed successfully'
    };
  } catch (error) {
    console.error('Error negotiating with provider:', error);
    return {
      success: false,
      error: error.message,
      message: 'Negotiation failed'
    };
  }
}

// Export configuration for debugging
export const config = {
  MOCK_SERVER_URL,
  CANISTER_IDS,
  isConnected: async () => {
    try {
      const response = await callMockServer('/api/v2/status');
      return response.replica_health_status === 'healthy';
    } catch {
      return false;
    }
  }
};

// Default export
export default {
  getAgentLogs,
  getAgentMetrics,
  getNetworkVisualizationData,
  getAgentStatus,
  getICPConnectionStatus,
  startSearchAgent,
  negotiateWithProvider,
  config
};
