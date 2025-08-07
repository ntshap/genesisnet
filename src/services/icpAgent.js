import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { DEMO_CONFIG } from '../utils/demoConfig.js';

// Configuration for different environments
const getICPConfig = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return {
    host: isDevelopment ? 'http://localhost:8000' : 'https://ic0.app',
    canisterIds: {
      dataRequester: isDevelopment ? 'rdmx6-jaaaa-aaaaa-aaadq-cai' : 'rrkah-fqaaa-aaaah-qcu7q-cai',
      dataProviders: isDevelopment ? [
        'rno2w-sqaaa-aaaah-qcu6q-cai',
        'rkp4c-7iaaa-aaaah-qcu6w-cai', 
        'renrk-eyaaa-aaaah-qcu7a-cai'
      ] : [
        'rrkah-fqaaa-aaaah-qcu7q-cai',
        'renrk-eyaaa-aaaah-qcu7a-cai',
        'rkp4c-7iaaa-aaaah-qcu6w-cai'
      ],
      reputation: isDevelopment ? 'ryjl3-tyaaa-aaaah-qcu6y-cai' : 'ryjl3-tyaaa-aaaah-qcu6y-cai'
    },
    forceMockMode: DEMO_CONFIG.FORCE_MOCK_MODE || false
  };
};

// Enhanced IDL Factory with comprehensive interface
const idlFactory = ({ IDL }) => {
  const Node = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    type: IDL.Text,
    reputation: IDL.Opt(IDL.Float64),
    price: IDL.Opt(IDL.Text),
    status: IDL.Opt(IDL.Text),
    location: IDL.Opt(IDL.Text),
    dataTypes: IDL.Opt(IDL.Vec(IDL.Text))
  });

  const Link = IDL.Record({
    source: IDL.Text,
    target: IDL.Text,
    strength: IDL.Opt(IDL.Float64),
    status: IDL.Opt(IDL.Text)
  });

  const NetworkData = IDL.Record({
    nodes: IDL.Vec(Node),
    links: IDL.Vec(Link)
  });

  const SearchCriteria = IDL.Record({
    dataType: IDL.Text,
    location: IDL.Opt(IDL.Text),
    timeRange: IDL.Opt(IDL.Text),
    maxPrice: IDL.Opt(IDL.Nat32),
    minReputation: IDL.Opt(IDL.Float64)
  });

  const Metrics = IDL.Record({
    totalTransactions: IDL.Nat32,
    averagePricePerDataUnit: IDL.Float64,
    networkLatency: IDL.Nat32,
    activeProviders: IDL.Nat32,
    successfulNegotiations: IDL.Nat32
  });

  return IDL.Service({
    'start_search': IDL.Func([SearchCriteria], [IDL.Text], []),
    'get_logs': IDL.Func([IDL.Opt(IDL.Nat32)], [IDL.Vec(IDL.Text)], ['query']),
    'get_metrics': IDL.Func([], [Metrics], ['query']),
    'get_network_data': IDL.Func([], [NetworkData], ['query']),
    'negotiate_with_provider': IDL.Func([IDL.Text, IDL.Nat32], [IDL.Bool], []),
    'get_provider_details': IDL.Func([IDL.Text], [IDL.Opt(Node)], ['query']),
    'get_agent_status': IDL.Func([], [IDL.Text], ['query'])
  });
};

// Actor creation with error handling and retry logic
const createActor = async (canisterId, maxRetries = 3) => {
  const config = getICPConfig();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const agent = new HttpAgent({ host: config.host });
      
      // Fetch root key for local development
      if (process.env.NODE_ENV !== 'production') {
        await agent.fetchRootKey().catch(err => {
          console.warn('Unable to fetch root key. Check if local replica is running');
          console.error(err);
        });
      }

      return Actor.createActor(idlFactory, {
        agent,
        canisterId: Principal.fromText(canisterId),
      });
    } catch (error) {
      console.error(`Attempt ${attempt} failed to create actor for ${canisterId}:`, error);
      if (attempt === maxRetries) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Service class for ICP integration
class ICPService {
  constructor() {
    this.actors = {};
    this.isInitialized = false;
    this.fallbackToMock = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const config = getICPConfig();
      
      // Initialize main data requester actor
      this.actors.dataRequester = await createActor(config.canisterIds.dataRequester);
      
      // Initialize provider actors
      this.actors.dataProviders = await Promise.all(
        config.canisterIds.dataProviders.map(id => createActor(id))
      );
      
      // Initialize reputation actor
      this.actors.reputation = await createActor(config.canisterIds.reputation);
      
      this.isInitialized = true;
      console.log('ICP Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ICP Service:', error);
      console.warn('Falling back to mock data');
      this.fallbackToMock = true;
    }
  }

  async withFallback(icpCall, mockCall) {
    const config = getICPConfig();
    
    // Force mock mode for demo
    if (config.forceMockMode || this.fallbackToMock) {
      if (config.forceMockMode) {
        console.log('🎬 Demo mode: Using mock data');
      }
      return await mockCall();
    }

    try {
      return await icpCall();
    } catch (error) {
      console.error('ICP call failed, using mock data:', error);
      return await mockCall();
    }
  }
}

// Create singleton instance
const icpService = new ICPService();

// Enhanced API functions
export const startSearchAgent = async (criteria) => {
  try {
    await icpService.initialize();
    
    return icpService.withFallback(
      async () => {
        const result = await icpService.actors.dataRequester.start_search(criteria);
        console.log('Search started successfully:', result);
        return result;
      },
      async () => {
        // Use static import for better reliability
        const mockData = await import('./mockData.js');
        return await mockData.mockStartSearchAgent(criteria);
      }
    );
  } catch (error) {
    console.error('Failed to start search agent:', error);
    // Fallback response
    return 'Search started in demo mode';
  }
};

export const getAgentLogs = async (limit = 50) => {
  try {
    await icpService.initialize();
    
    return icpService.withFallback(
      async () => {
        const logs = await icpService.actors.dataRequester.get_logs([limit]);
        return logs;
      },
      async () => {
        // Use static import for better reliability
        const mockData = await import('./mockData.js');
        return await mockData.mockGetAgentLogs(limit);
      }
    );
  } catch (error) {
    console.warn('Log fetch failed, using simple fallback:', error.message);
    // Fallback to basic logs if all else fails
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    return [
      `[${timeStr}] [INFO] GenesisNet system active`,
      `[${timeStr}] [INFO] Mock data mode enabled`,
      `[${timeStr}] [DEBUG] Network interface operational`,
      `[${timeStr}] [INFO] Ready for data marketplace operations`
    ];
  }
};

export const getAgentMetrics = async () => {
  try {
    await icpService.initialize();
    
    return icpService.withFallback(
      async () => {
        const metrics = await icpService.actors.dataRequester.get_metrics();
        return metrics;
      },
      async () => {
        // Use static import for better reliability
        const mockData = await import('./mockData.js');
        return await mockData.mockGetAgentMetrics();
      }
    );
  } catch (error) {
    console.error('Failed to get agent metrics:', error);
    // Fallback to hardcoded metrics if all else fails
    return {
      totalTransactions: 42,
      averagePricePerDataUnit: 15.5,
      networkLatency: 120,
      activeProviders: 4,
      successfulNegotiations: 38
    };
  }
};

export const getNetworkVisualizationData = async () => {
  try {
    await icpService.initialize();
    
    return icpService.withFallback(
      async () => {
        const networkData = await icpService.actors.dataRequester.get_network_data();
        return networkData;
      },
      async () => {
        // Use static import for better reliability
        const mockData = await import('./mockData.js');
        return await mockData.mockGetNetworkVisualizationData();
      }
    );
  } catch (error) {
    console.error('Failed to get network data:', error);
    // Fallback to basic network data if all else fails
    return {
      nodes: [
        { id: 'requester', name: 'Data Requester Agent', type: 'requester', status: 'searching', fx: 400, fy: 300 },
        { id: 'provider1', name: 'FinanceData Corp', type: 'provider', reputation: 9.2, price: '100 ICP', status: 'active', location: 'US-East' }
      ],
      links: [
        { source: 'requester', target: 'provider1', strength: 0.8, status: 'active' }
      ]
    };
  }
};

export const negotiateWithProvider = async (providerId, price) => {
  await icpService.initialize();
  
  return icpService.withFallback(
    async () => {
      const result = await icpService.actors.dataRequester.negotiate_with_provider(providerId, price);
      return result;
    },
    async () => {
      // Mock negotiation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() > 0.3); // 70% success rate
        }, 2000);
      });
    }
  );
};

export const getProviderDetails = async (providerId) => {
  await icpService.initialize();
  
  return icpService.withFallback(
    async () => {
      const details = await icpService.actors.dataRequester.get_provider_details(providerId);
      return details[0] || null; // Handle Option type
    },
    async () => {
      const { mockNetworkData } = await import('./mockData.js');
      return mockNetworkData.nodes.find(node => node.id === providerId) || null;
    }
  );
};

export const getAgentStatus = async () => {
  try {
    await icpService.initialize();
    
    return icpService.withFallback(
      async () => {
        const status = await icpService.actors.dataRequester.get_agent_status();
        return status;
      },
      async () => {
        // Use static import for better reliability
        const mockData = await import('./mockData.js');
        return await mockData.mockGetAgentStatus();
      }
    );
  } catch (error) {
    console.error('Failed to get agent status:', error);
    // Fallback to basic status if all else fails
    return 'Searching';
  }
};

// Utility function to check ICP connection status
export const getICPConnectionStatus = () => {
  const config = getICPConfig();
  
  return {
    isInitialized: config.forceMockMode ? true : icpService.isInitialized,
    fallbackToMock: config.forceMockMode ? true : icpService.fallbackToMock,
    hasActors: config.forceMockMode ? true : Object.keys(icpService.actors).length > 0,
    forceMockMode: config.forceMockMode
  };
};

// Export the service instance for advanced usage
export { icpService };
