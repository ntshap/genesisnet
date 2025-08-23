// Enhanced Mock data untuk testing tanpa ICP connection
let currentLogIndex = 0;
let simulationRunning = true; // Auto-start simulation

// Generate initial logs with current time
const generateInitialLogs = () => {
  const now = new Date();
  const logs = [];
  
  for (let i = 0; i < 12; i++) {
    const timestamp = new Date(now.getTime() - (12-i) * 1000);
    const timeStr = timestamp.toLocaleTimeString();
    
    const initialMessages = [
      '[INFO] GenesisNet interface initialized',
      '[INFO] System ready for data search', 
      '[DEBUG] Loading network topology...',
      '[INFO] ICP network connection established',
      '[DEBUG] Canister health check: OK',
      '[INFO] Discovered 4 active data providers',
      '[DEBUG] Provider reputation scores updated',
      '[INFO] FinanceData Corp connected (reputation: 9.2)',
      '[INFO] SocialInsights Ltd connected (reputation: 7.8)', 
      '[INFO] ResearchData Hub connected (reputation: 8.5)',
      '[INFO] MediaStream AI connected (reputation: 6.9)',
      '[DEBUG] Network initialization complete - ready for queries'
    ];
    
    logs.push(`[${timeStr}] ${initialMessages[i]}`);
  }
  
  return logs;
};

export const mockLogs = generateInitialLogs();

let mockMetricsState = {
  totalTransactions: 42,
  averagePricePerDataUnit: 15.5,
  networkLatency: 120,
  activeProviders: 4,
  successfulNegotiations: 38
};

// Mock wallet data for ICP ledger
let mockWalletState = {
  balance: 1250.75, // ICP balance
  transactions: [],
  lastUpdated: Date.now()
};

// Mock agent for interacting with the ICP ledger
export const mockAgent = {
  // Create a mock ledger actor for testing
  createLedgerActor: () => {
    return {
      account_balance: async (args) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { e8s: BigInt(Math.floor(mockWalletState.balance * 100000000)) };
      },
      transfer: async (args) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Extract transfer details
        const amount = Number(args.amount.e8s) / 100000000;
        const fee = Number(args.fee.e8s) / 100000000;
        const to = args.to.toString();
        const memo = args.memo.toString();
        
        // 5% chance of random failure for realism
        if (Math.random() < 0.05) {
          return { 
            Err: { 
              InsufficientFunds: { 
                balance: { e8s: BigInt(Math.floor(mockWalletState.balance * 100000000)) } 
              } 
            } 
          };
        }
        
        // Record the transaction
        const txId = Date.now().toString();
        mockWalletState.transactions.unshift({
          id: txId,
          blockHeight: Math.floor(Math.random() * 1000000).toString(),
          type: 'send',
          amount: amount.toFixed(8),
          fee: fee.toFixed(8),
          from: 'current-user-principal',
          to,
          timestamp: Date.now(),
          status: 'completed',
          memo
        });
        
        // Update balance
        mockWalletState.balance -= (amount + fee);
        mockWalletState.lastUpdated = Date.now();
        
        // Add corresponding incoming transaction for the receiver
        // This would be a separate account in a real system
        mockWalletState.transactions.unshift({
          id: `${txId}-recv`,
          blockHeight: Math.floor(Math.random() * 1000000).toString(),
          type: 'receive',
          amount: amount.toFixed(8),
          fee: '0.00000000',
          from: 'current-user-principal',
          to,
          timestamp: Date.now() + 1000, // Slightly later
          status: 'completed',
          memo
        });
        
        // Log the transfer
        mockLogs.push(`[${new Date().toLocaleTimeString()}] [INFO] Transferred ${amount} ICP to ${to}`);
        
        return { Ok: BigInt(txId) };
      }
    };
  },
  
  // Add funds to mock wallet (for testing)
  addFunds: (amount) => {
    mockWalletState.balance += Number(amount);
    
    // Record the transaction
    mockWalletState.transactions.unshift({
      id: `deposit-${Date.now()}`,
      blockHeight: Math.floor(Math.random() * 1000000).toString(),
      type: 'receive',
      amount: amount.toFixed(8),
      fee: '0.00000000',
      from: 'faucet',
      to: 'current-user-principal',
      timestamp: Date.now(),
      status: 'completed',
      memo: 'Faucet deposit'
    });
    
    mockWalletState.lastUpdated = Date.now();
    mockLogs.push(`[${new Date().toLocaleTimeString()}] [INFO] Received ${amount} ICP from faucet`);
    
    return {
      success: true,
      transaction: mockWalletState.transactions[0]
    };
  },
  
  // Get wallet balance
  getBalance: () => {
    return {
      success: true,
      balance: mockWalletState.balance,
      lastUpdated: mockWalletState.lastUpdated
    };
  },
  
  // Get transaction history
  getTransactions: (limit = 10) => {
    return {
      success: true,
      transactions: mockWalletState.transactions.slice(0, limit)
    };
  }
};

let mockNetworkState = {
  nodes: [
    { 
      id: 'requester', 
      name: 'Data Requester Agent', 
      type: 'requester', 
      fx: 300, 
      fy: 200,
      status: 'idle'
    },
    { 
      id: 'provider1', 
      name: 'FinanceData Corp', 
      type: 'provider', 
      reputation: 9.2, 
      price: '100 ICP',
      status: 'active',
      location: 'US-East',
      dataTypes: ['financial', 'market'],
      responseTime: 45,
      lastSeen: new Date()
    },
    { 
      id: 'provider2', 
      name: 'SocialInsights Ltd', 
      type: 'provider', 
      reputation: 7.8, 
      price: '120 ICP',
      status: 'active',
      location: 'EU-West',
      dataTypes: ['social', 'demographic'],
      responseTime: 67,
      lastSeen: new Date()
    },
    { 
      id: 'provider3', 
      name: 'ResearchData Hub', 
      type: 'provider', 
      reputation: 8.5, 
      price: '95 ICP',
      status: 'negotiating',
      location: 'Asia-Pacific',
      dataTypes: ['scientific', 'research'],
      responseTime: 123,
      lastSeen: new Date()
    },
    { 
      id: 'provider4', 
      name: 'MediaStream AI', 
      type: 'provider', 
      reputation: 6.9, 
      price: '85 ICP',
      status: 'active',
      location: 'US-West',
      dataTypes: ['entertainment', 'media'],
      responseTime: 89,
      lastSeen: new Date()
    },
  ],
  links: [
    { source: 'requester', target: 'provider1', strength: 0.8, status: 'active' },
    { source: 'requester', target: 'provider2', strength: 0.6, status: 'idle' },
    { source: 'requester', target: 'provider3', strength: 0.7, status: 'negotiating' },
    { source: 'requester', target: 'provider4', strength: 0.5, status: 'active' },
  ],
};

// Dynamic log generation untuk simulasi real-time activity
const logTemplates = [
  {
    level: 'INFO',
    templates: [
      'Provider {provider} responded to data query in {time}ms',
      'Negotiation completed successfully with {provider}',
      'Data transfer initiated from {provider}',
      'New provider {provider} joined the network',
      'Smart contract executed for transaction #{id}',
      'Payment of {amount} ICP processed',
      'Data quality verification passed for {provider}',
      'Network optimization completed, latency improved by {percent}%'
    ]
  },
  {
    level: 'DEBUG', 
    templates: [
      'Heartbeat received from {provider}',
      'Network latency measurement: {latency}ms',
      'Reputation score updated: {provider} now at {score}/10',
      'Cache refreshed for network topology',
      'Background sync operation completed in {time}ms',
      'Provider {provider} capacity: {capacity}% available',
      'Connection pool status: {active}/{total} active connections'
    ]
  },
  {
    level: 'WARN',
    templates: [
      'Provider {provider} response time ({time}ms) exceeded threshold',
      'High network latency detected: {latency}ms',
      'Provider {provider} reputation ({score}) below optimal level',
      'Connection retry attempt {attempt}/3 for {provider}',
      'Data quality score for {provider} declined to {score}%',
      'Price increase detected: {provider} raised rates by {percent}%'
    ]
  },
  {
    level: 'ERROR',
    templates: [
      'Failed to establish connection with {provider}',
      'Negotiation timeout with {provider} after {time}ms',
      'Data integrity check failed for transaction #{id}',
      'Network connection lost, attempting reconnection...',
      'Provider {provider} returned invalid data format',
      'Smart contract execution failed: insufficient funds'
    ]
  }
];

const generateDynamicLog = () => {
  const timestamp = new Date().toLocaleTimeString();
  const levelData = logTemplates[Math.floor(Math.random() * logTemplates.length)];
  const template = levelData.templates[Math.floor(Math.random() * levelData.templates.length)];
  
  // Generate realistic replacement values
  const replacements = {
    provider: ['FinanceData Corp', 'SocialInsights Ltd', 'ResearchData Hub', 'MediaStream AI'][Math.floor(Math.random() * 4)],
    time: Math.floor(Math.random() * 2000) + 100,
    latency: Math.floor(Math.random() * 300) + 50,
    score: (Math.random() * 3 + 7).toFixed(1),
    amount: Math.floor(Math.random() * 500) + 50,
    id: Math.floor(Math.random() * 10000) + 1000,
    percent: Math.floor(Math.random() * 30) + 5,
    capacity: Math.floor(Math.random() * 40) + 60,
    active: Math.floor(Math.random() * 8) + 2,
    total: 10,
    attempt: Math.floor(Math.random() * 3) + 1
  };

  let message = template;
  Object.keys(replacements).forEach(key => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), replacements[key]);
  });

  return `[${timestamp}] [${levelData.level}] ${message}`;
};

// Simulate network activity
const simulateNetworkActivity = () => {
  // Randomly update provider statuses
  mockNetworkState.nodes.forEach(node => {
    if (node.type === 'provider') {
      // Simulate status changes
      if (Math.random() < 0.1) {
        const statuses = ['active', 'negotiating', 'busy', 'idle'];
        node.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      // Simulate response time fluctuations
      node.responseTime += (Math.random() - 0.5) * 20;
      node.responseTime = Math.max(30, Math.min(200, node.responseTime));
      
      // Simulate reputation changes (small fluctuations)
      node.reputation += (Math.random() - 0.5) * 0.1;
      node.reputation = Math.max(5, Math.min(10, node.reputation));
      
      node.lastSeen = new Date();
    }
  });

  // Update link statuses based on node statuses
  mockNetworkState.links.forEach(link => {
    const targetNode = mockNetworkState.nodes.find(n => n.id === link.target);
    if (targetNode) {
      link.status = targetNode.status === 'negotiating' ? 'negotiating' : 
                   targetNode.status === 'active' ? 'active' : 'idle';
    }
  });

  // Update metrics
  if (Math.random() < 0.3) {
    mockMetricsState.totalTransactions += Math.floor(Math.random() * 3);
    mockMetricsState.networkLatency += (Math.random() - 0.5) * 20;
    mockMetricsState.networkLatency = Math.max(50, Math.min(300, mockMetricsState.networkLatency));
    
    if (Math.random() < 0.2) {
      mockMetricsState.successfulNegotiations += 1;
    }
    
    // Recalculate average price
    mockMetricsState.averagePricePerDataUnit = 
      mockNetworkState.nodes
        .filter(n => n.type === 'provider')
        .reduce((sum, n) => sum + parseInt(n.price.split(' ')[0]), 0) / 4;
  }
};

// Mock functions that simulate ICP calls dengan simulasi yang lebih realistis
export const mockStartSearchAgent = async (criteria) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      simulationRunning = true;
      
      // Update requester status
      const requester = mockNetworkState.nodes.find(n => n.id === 'requester');
      if (requester) requester.status = 'searching';
      
      // Add search-related logs immediately
      const searchLog = `[${new Date().toLocaleTimeString()}] [INFO] 🔍 Search initiated for "${criteria.dataType || 'weather'}" data${criteria.location ? ` in ${criteria.location}` : ' globally'}`;
      mockLogs.push(searchLog);
      
      const criteriaLog = `[${new Date().toLocaleTimeString()}] [DEBUG] Search parameters: max price ${criteria.priceRange || '100 ICP'}, location: ${criteria.location || 'Global'}`;
      mockLogs.push(criteriaLog);
      
      // Start immediate activity
      setTimeout(() => {
        const scanLog = `[${new Date().toLocaleTimeString()}] [INFO] Scanning network for matching providers...`;
        mockLogs.push(scanLog);
        
        // Simulate finding providers quickly
        setTimeout(() => {
          const matchingProviders = mockNetworkState.nodes.filter(n => n.type === 'provider');
          const foundLog = `[${new Date().toLocaleTimeString()}] [INFO] ✅ Found ${matchingProviders.length} matching providers - starting negotiations`;
          mockLogs.push(foundLog);
          
          // Update requester status to negotiating
          if (requester) requester.status = 'active';
          
          // Start negotiations immediately
          setTimeout(() => {
            const negotiationLog = `[${new Date().toLocaleTimeString()}] [INFO] 💰 Initiating price negotiations with top providers`;
            mockLogs.push(negotiationLog);
            
            // Auto-negotiate with first provider
            setTimeout(() => {
              const provider = matchingProviders[0];
              if (provider) {
                provider.status = 'active';
                const autoNegLog = `[${new Date().toLocaleTimeString()}] [INFO] ✅ Auto-negotiation completed with ${provider.name}`;
                mockLogs.push(autoNegLog);
              }
            }, 500);
            
          }, 300);
          
        }, 200);
        
      }, 100);
      
      resolve(`Search completed successfully for "${criteria.dataType || 'weather'}" with active monitoring`);
    }, 50); // Much faster initial response
  });
};

export const mockGetAgentLogs = async (limit = 50) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Add realistic log generation
      if (Math.random() < 0.6) {
        const newLog = generateDynamicLog();
        mockLogs.push(newLog);
        
        // Keep logs manageable
        if (mockLogs.length > 100) {
          mockLogs.splice(0, 10);
        }
      }
      
      // Simulate network activity
      simulateNetworkActivity();
      
      resolve([...mockLogs].slice(-limit));
    }, Math.random() * 50 + 25); // Much faster response
  });
};

export const mockGetAgentMetrics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate real-time metrics
      const activeProviders = mockNetworkState.nodes.filter(n => 
        n.type === 'provider' && n.status === 'active'
      ).length;
      
      const avgResponseTime = mockNetworkState.nodes
        .filter(n => n.type === 'provider' && n.responseTime)
        .reduce((sum, n) => sum + n.responseTime, 0) / 4;
      
      const currentMetrics = {
        ...mockMetricsState,
        activeProviders,
        averageResponseTime: Math.round(avgResponseTime),
        networkUtilization: Math.round(
          (mockNetworkState.links.filter(l => l.status === 'active').length / mockNetworkState.links.length) * 100
        )
      };
      
      resolve(currentMetrics);
    }, Math.random() * 30 + 10); // Much faster response
  });
};

export const mockGetNetworkVisualizationData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nodes: [...mockNetworkState.nodes],
        links: [...mockNetworkState.links]
      });
    }, Math.random() * 25 + 10); // Much faster response
  });
};

export const mockNegotiateWithProvider = async (providerId, price) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const provider = mockNetworkState.nodes.find(n => n.id === providerId);
      if (!provider) {
        resolve(false);
        return;
      }
      
      // Realistic negotiation logic
      const currentPrice = parseInt(provider.price.split(' ')[0]);
      const priceRatio = price / currentPrice;
      const reputationFactor = provider.reputation / 10;
      const successProbability = Math.min(0.9, (priceRatio * 0.7) + (reputationFactor * 0.3));
      const success = Math.random() < successProbability;
      
      // Update provider status
      provider.status = 'negotiating';
      
      const startLog = `[${new Date().toLocaleTimeString()}] [INFO] Negotiation started with ${provider.name} (offering ${price} ICP vs ${currentPrice} ICP asking price)`;
      mockLogs.push(startLog);
      
      setTimeout(() => {
        provider.status = success ? 'active' : 'idle';
        
        if (success) {
          const successLog = `[${new Date().toLocaleTimeString()}] [INFO] ✅ Negotiation successful! ${provider.name} accepted ${price} ICP`;
          mockLogs.push(successLog);
          
          // Update metrics
          mockMetricsState.totalTransactions += 1;
          mockMetricsState.successfulNegotiations += 1;
          
          // Update provider price occasionally
          if (Math.random() < 0.4) {
            provider.price = `${price} ICP`;
            const priceUpdateLog = `[${new Date().toLocaleTimeString()}] [DEBUG] ${provider.name} updated their base price to ${price} ICP`;
            mockLogs.push(priceUpdateLog);
          }
        } else {
          const failLog = `[${new Date().toLocaleTimeString()}] [WARN] ❌ Negotiation failed with ${provider.name} - offer rejected (${Math.round(successProbability * 100)}% success probability)`;
          mockLogs.push(failLog);
        }
        
        resolve(success);
      }, 800 + Math.random() * 1200); // Faster negotiation
      
    }, 100); // Faster initial response
  });
};

export const mockGetProviderDetails = async (providerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const provider = mockNetworkState.nodes.find(n => n.id === providerId);
      if (provider && provider.type === 'provider') {
        const enhancedProvider = {
          ...provider,
          totalDataSets: Math.floor(Math.random() * 1000) + 100,
          dataFreshness: Math.floor(Math.random() * 24) + 1,
          apiEndpoints: Math.floor(Math.random() * 10) + 3,
          storageCapacity: Math.floor(Math.random() * 1000) + 500,
          uptime: (Math.random() * 5 + 95).toFixed(2),
          supportedFormats: ['JSON', 'CSV', 'XML', 'Parquet'].slice(0, Math.floor(Math.random() * 4) + 1),
          certifications: ['ISO 27001', 'SOC 2', 'GDPR Compliant'].slice(0, Math.floor(Math.random() * 3) + 1),
          averageResponseTime: provider.responseTime || Math.floor(Math.random() * 200) + 50
        };
        resolve(enhancedProvider);
      } else {
        resolve(null);
      }
    }, Math.random() * 200 + 50);
  });
};

export const mockGetAgentStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requester = mockNetworkState.nodes.find(n => n.id === 'requester');
      
      const statusMap = {
        'idle': 'Idle',
        'searching': 'Searching', 
        'negotiating': 'Negotiating',
        'active': 'Active'
      };
      
      resolve(statusMap[requester?.status] || 'Idle');
    }, Math.random() * 100 + 25);
  });
};

// Utility functions
export const resetSimulation = () => {
  simulationRunning = false;
  const requester = mockNetworkState.nodes.find(n => n.id === 'requester');
  if (requester) requester.status = 'idle';
  
  mockNetworkState.nodes.filter(n => n.type === 'provider').forEach(n => {
    n.status = Math.random() < 0.7 ? 'active' : 'idle';
  });
  
  const resetLog = `[${new Date().toLocaleTimeString()}] [INFO] System simulation reset`;
  mockLogs.push(resetLog);
};

export const addProviderToNetwork = (providerData) => {
  const newProvider = {
    id: `provider${mockNetworkState.nodes.filter(n => n.type === 'provider').length + 1}`,
    type: 'provider',
    status: 'active',
    responseTime: Math.floor(Math.random() * 150) + 50,
    lastSeen: new Date(),
    ...providerData
  };
  
  mockNetworkState.nodes.push(newProvider);
  
  // Add link to requester
  mockNetworkState.links.push({
    source: 'requester',
    target: newProvider.id,
    strength: Math.random() * 0.5 + 0.5,
    status: 'idle'
  });
  
  const joinLog = `[${new Date().toLocaleTimeString()}] [INFO] New provider "${newProvider.name}" joined the network`;
  mockLogs.push(joinLog);
  
  return newProvider;
};

// Auto-generate realistic background activity dan auto-start
if (typeof window !== 'undefined') {
  // Auto-start simulation saat page load
  setTimeout(() => {
    const autoStartLog = `[${new Date().toLocaleTimeString()}] [INFO] 🚀 Auto-starting GenesisNet simulation...`;
    mockLogs.push(autoStartLog);
    
    // Auto-trigger search
    setTimeout(() => {
      mockStartSearchAgent({
        dataType: 'weather',
        location: 'Global',
        priceRange: '100 ICP'
      });
    }, 300); // Much faster auto-start
  }, 200);
  
  // Regular background activity
  setInterval(() => {
    if (Math.random() < 0.5) {
      simulateNetworkActivity();
    }
    
    // More frequent log generation for demo
    if (Math.random() < 0.4) {
      const newLog = generateDynamicLog();
      mockLogs.push(newLog);
      
      // Keep logs manageable
      if (mockLogs.length > 50) {
        mockLogs.splice(0, 5);
      }
    }
    
    // Occasionally add a background log
    if (Math.random() < 0.2) {
      const backgroundLogs = [
        '[SYSTEM] Network health check completed ✅',
        '[SYSTEM] Provider reputation scores updated 📊',
        '[SYSTEM] Cache optimization completed ⚡',
        '[SYSTEM] Security scan completed - no threats detected 🔒',
        '[SYSTEM] Data quality verification passed ✓',
        '[SYSTEM] Network latency optimized 🚀'
      ];
      
      const randomLog = backgroundLogs[Math.floor(Math.random() * backgroundLogs.length)];
      const timeStampedLog = `[${new Date().toLocaleTimeString()}] [DEBUG] ${randomLog}`;
      
      if (mockLogs.length < 50) { // Prevent log overflow
        mockLogs.push(timeStampedLog);
      }
    }
  }, 1000); // Much more frequent updates for demo
}
