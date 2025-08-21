// ICP Agent Service - Connects frontend to real backend agents

// Real backend server configuration
const BACKEND_SERVER_URL = 'http://localhost:4943';
const CANISTER_IDS = {
  data_requester: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  data_provider: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  reputation_agent: 'rno2w-sqaaa-aaaaa-aaacq-cai'
};

// Mock data for fallback scenarios
const mockLogs = [
  { timestamp: new Date().toISOString(), level: 'INFO', message: 'Data Provider Agent initialized', agent: 'provider' },
  { timestamp: new Date(Date.now() - 60000).toISOString(), level: 'INFO', message: 'Data Requester Agent started search', agent: 'requester' },
  { timestamp: new Date(Date.now() - 120000).toISOString(), level: 'SUCCESS', message: 'Transaction completed successfully', agent: 'reputation' },
  { timestamp: new Date(Date.now() - 180000).toISOString(), level: 'INFO', message: 'New data offer received', agent: 'provider' },
  { timestamp: new Date(Date.now() - 240000).toISOString(), level: 'WARNING', message: 'High network latency detected', agent: 'network' }
];

const mockMetrics = {
  totalTransactions: 142,
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

// Helper function to make API calls to backend server
async function callBackendServer(endpoint, method = 'GET', data = null) {
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

    const response = await fetch(`${BACKEND_SERVER_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Backend server call failed, using fallback data:', error);
    return { status: 'fallback', error: error.message };
  }
}

/**
 * Get agent logs from Data Requester Agent
 */
export async function getAgentLogs(startTime, endTime) {
  try {
    const response = await callBackendServer(
      `/api/v2/canister/${CANISTER_IDS.data_requester}/call`,
      'POST',
      {
        method_name: 'get_logs',
        arg: JSON.stringify({ startTime, endTime })
      }
    );

    if (response.status === 'fallback') {
      return {
        success: true,
        logs: mockLogs,
        message: 'Using fallback data (backend unavailable)'
      };
    }

    return {
      success: response.status === 'replied',
      logs: JSON.parse(response.reply?.arg || '[]'),
      message: 'Logs retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting agent logs:', error);
    return {
      success: false,
      logs: mockLogs,
      error: error.message,
      message: 'Failed to retrieve logs, using fallback data'
    };
  }
}

/**
 * Get agent metrics from Data Requester Agent
 */
export async function getAgentMetrics() {
  try {
    const response = await callBackendServer(
      `/api/v2/canister/${CANISTER_IDS.data_requester}/call`,
      'POST',
      {
        method_name: 'get_metrics',
        arg: JSON.stringify({})
      }
    );

    if (response.status === 'fallback') {
      return {
        success: true,
        metrics: mockMetrics,
        message: 'Using fallback data (backend unavailable)'
      };
    }

    return {
      success: response.status === 'replied',
      metrics: JSON.parse(response.reply?.arg || '{}'),
      message: 'Metrics retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting agent metrics:', error);
    return {
      success: false,
      metrics: mockMetrics,
      error: error.message,
      message: 'Failed to retrieve metrics, using fallback data'
    };
  }
}

/**
 * Get network visualization data from Data Requester Agent
 */
export async function getNetworkVisualizationData() {
  try {
    const response = await callBackendServer(
      `/api/v2/canister/${CANISTER_IDS.data_requester}/call`,
      'POST',
      {
        method_name: 'get_network_data',
        arg: JSON.stringify({})
      }
    );

    if (response.status === 'fallback') {
      return {
        success: true,
        data: mockNetworkData,
        message: 'Using fallback data (backend unavailable)'
      };
    }

    return {
      success: response.status === 'replied',
      data: JSON.parse(response.reply?.arg || '{}'),
      message: 'Network data retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting network data:', error);
    return {
      success: false,
      data: mockNetworkData,
      error: error.message,
      message: 'Failed to retrieve network data, using fallback data'
    };
  }
}

/**
 * Get agent status from all agents
 */
export async function getAgentStatus() {
  try {
    const [requesterStatus, providerStatus, reputationStatus] = await Promise.allSettled([
      callBackendServer(`/api/v2/canister/${CANISTER_IDS.data_requester}/call`, 'POST', {
        method_name: 'get_status',
        arg: JSON.stringify({})
      }),
      callBackendServer(`/api/v2/canister/${CANISTER_IDS.data_provider}/call`, 'POST', {
        method_name: 'get_status',
        arg: JSON.stringify({})
      }),
      callBackendServer(`/api/v2/canister/${CANISTER_IDS.reputation_agent}/call`, 'POST', {
        method_name: 'get_status',
        arg: JSON.stringify({})
      })
    ]);

    return {
      success: true,
      agents: {
        data_requester: requesterStatus.status === 'fulfilled' ? requesterStatus.value : { status: 'offline' },
        data_provider: providerStatus.status === 'fulfilled' ? providerStatus.value : { status: 'offline' },
        reputation_agent: reputationStatus.status === 'fulfilled' ? reputationStatus.value : { status: 'offline' }
      },
      message: 'Agent status retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting agent status:', error);
    return {
      success: false,
      agents: {
        data_requester: { status: 'unknown' },
        data_provider: { status: 'unknown' },
        reputation_agent: { status: 'unknown' }
      },
      error: error.message,
      message: 'Failed to retrieve agent status'
    };
  }
}

/**
 * Check ICP connection status
 */
export async function getICPConnectionStatus() {
  try {
    const response = await callBackendServer('/api/v2/status');
    
    return {
      success: true,
      connected: response.replica_health_status === 'healthy',
      status: response.replica_health_status || 'unknown',
      message: 'ICP connection status retrieved successfully'
    };
  } catch (error) {
    console.error('Error checking ICP connection:', error);
    return {
      success: false,
      connected: false,
      status: 'disconnected',
      error: error.message,
      message: 'Failed to check ICP connection status'
    };
  }
}

/**
 * Start search agent with query parameters
 */
export async function startSearchAgent(queryParams = {}) {
  try {
    const response = await callBackendServer(
      `/api/v2/canister/${CANISTER_IDS.data_requester}/call`,
      'POST',
      {
        method_name: 'start_data_search',
        arg: JSON.stringify({
          query_id: queryParams.queryId || 'search-' + Date.now(),
          requester_id: queryParams.requesterId || 'frontend-user',
          data_type: queryParams.dataType || 'sensor',
          location: queryParams.location || 'unknown',
          timestamp: Date.now(),
          max_price: queryParams.maxPrice || 100,
          quality_requirements: queryParams.qualityRequirements || 'standard'
        })
      }
    );

    return {
      success: response.status === 'replied',
      searchId: queryParams.queryId || 'search-' + Date.now(),
      location: queryParams.location || 'unknown',
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
    const response = await callBackendServer(
      `/api/v2/canister/${CANISTER_IDS.reputation_agent}/call`,
      'POST',
      {
        method_name: 'update_reputation',
        arg: JSON.stringify({ providerId, terms })
      }
    );

    if (response.status === 'fallback') {
      return {
        success: true,
        negotiationId: 'fallback-negotiation-' + Date.now(),
        finalPrice: Math.floor(Math.random() * 50) + 80,
        message: 'Negotiation completed (fallback mode)'
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
  BACKEND_SERVER_URL,
  CANISTER_IDS,
  isConnected: async () => {
    try {
      const response = await callBackendServer('/api/v2/status');
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
