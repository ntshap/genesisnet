import { useState, useEffect, useCallback, useRef } from 'react';

// Realistic dummy data generators
const generateRealisticLog = (type, details) => ({
  id: Date.now() + Math.random(),
  timestamp: new Date(),
  type,
  message: details.message,
  level: details.level || 'info',
  source: details.source || 'system'
});

const generateNetworkMetrics = () => ({
  totalTransactions: Math.floor(Math.random() * 100) + 50,
  dataVolume: `${(Math.random() * 5 + 2).toFixed(1)}TB`,
  activeUsers: Math.floor(Math.random() * 50) + 80,
  successRate: (Math.random() * 0.1 + 0.9).toFixed(3),
  networkLatency: Math.floor(Math.random() * 50) + 30,
  activeProviders: Math.floor(Math.random() * 8) + 12,
  averagePricePerDataUnit: Math.random() * 1.5 + 0.25, // Increased range to make values more visible
  cpuUsage: Math.floor(Math.random() * 30) + 50,
  memoryUsage: Math.floor(Math.random() * 20) + 40,
  networkIO: Math.floor(Math.random() * 40) + 60
});

const dataProviders = [
  { id: 'provider1', name: 'WeatherAPI Global', type: 'weather', reputation: 9.2, basePrice: 85, location: 'US-East', status: 'active' },
  { id: 'provider2', name: 'FinanceStream Inc', type: 'financial', reputation: 8.8, basePrice: 120, location: 'EU-West', status: 'active' },
  { id: 'provider3', name: 'IoT Sensors Network', type: 'iot', reputation: 7.9, basePrice: 95, location: 'Asia-Pacific', status: 'active' },
  { id: 'provider4', name: 'ResearchData Hub', type: 'research', reputation: 8.5, basePrice: 110, location: 'US-West', status: 'active' },
  { id: 'provider5', name: 'CryptoMarket Live', type: 'financial', reputation: 9.0, basePrice: 140, location: 'EU-Central', status: 'active' },
  { id: 'provider6', name: 'AI Training Datasets', type: 'ai', reputation: 8.2, basePrice: 200, location: 'US-Central', status: 'active' }
];

const useInteractiveDemo = () => {
  // State management
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(generateNetworkMetrics());
  const [agentStatus, setAgentStatus] = useState('idle');
  const [isSearching, setIsSearching] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [negotiationStatus, setNegotiationStatus] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const [transactionPool, setTransactionPool] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchCriteria, setSearchCriteria] = useState(null);
  
  // Data delivery states
  const [dataDeliveries, setDataDeliveries] = useState([]);
  const [activeDownloads, setActiveDownloads] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  
  // Wallet and payment states
  const [walletBalance, setWalletBalance] = useState(() => {
    // Initialize wallet with realistic funding history
    const saved = localStorage.getItem('genesisnet-wallet-balance');
    return saved ? parseFloat(saved) : 0;
  });
  const [paymentHistory, setPaymentHistory] = useState(() => {
    const saved = localStorage.getItem('genesisnet-payment-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [walletInitialized, setWalletInitialized] = useState(false);
  const [fundingHistory, setFundingHistory] = useState(() => {
    const saved = localStorage.getItem('genesisnet-funding-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Refs for intervals
  const metricsInterval = useRef(null);
  const logsInterval = useRef(null);

  // Add realistic log entry
  const addLog = useCallback((type, message, level = 'info', source = 'system') => {
    const newLog = generateRealisticLog(type, { message, level, source });
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    setLastUpdate(new Date());
  }, []);

  // Initialize wallet with realistic funding scenario
  const initializeWallet = useCallback(() => {
    if (walletInitialized) return;
    
    // Check if wallet already has history
    if (fundingHistory.length > 0 && walletBalance > 0) {
      setWalletInitialized(true);
      return;
    }

    // Simulate realistic funding scenarios
    const fundingScenarios = [
      {
        type: 'initial_grant',
        amount: 500,
        description: '🎁 Welcome bonus from GenesisNet',
        source: 'GenesisNet Foundation'
      },
      {
        type: 'referral_bonus',
        amount: 150.25,
        description: '👥 Referral bonus (3 users)',
        source: 'Referral Program'
      },
      {
        type: 'staking_reward',
        amount: 327.50,
        description: '💎 Staking rewards (30 days)',
        source: 'ICP Staking Pool'
      },
      {
        type: 'trading_profit',
        amount: 273,
        description: '📈 Trading profits from DeFi',
        source: 'DEX Trading'
      }
    ];

    let totalFunded = 0;
    const newFundingHistory = [];

    fundingScenarios.forEach((scenario, index) => {
      const fundingEvent = {
        id: `FUND${Date.now() + index}`,
        type: scenario.type,
        amount: scenario.amount,
        description: scenario.description,
        source: scenario.source,
        timestamp: new Date(Date.now() - (4 - index) * 24 * 60 * 60 * 1000), // Spread over 4 days
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
      
      newFundingHistory.push(fundingEvent);
      totalFunded += scenario.amount;
    });

    setFundingHistory(newFundingHistory);
    setWalletBalance(totalFunded);
    setWalletInitialized(true);

    // Save to localStorage
    localStorage.setItem('genesisnet-wallet-balance', totalFunded.toString());
    localStorage.setItem('genesisnet-funding-history', JSON.stringify(newFundingHistory));

    // Add logs about wallet initialization
    addLog('wallet', `💰 Wallet initialized with ${totalFunded.toFixed(2)} ICP`, 'success', 'wallet-system');
    addLog('wallet', `📊 Funding sources: ${fundingScenarios.length} transactions`, 'info', 'wallet-system');
    
  }, [walletInitialized, fundingHistory.length, walletBalance, addLog]);

  // Save wallet state to localStorage
  const saveWalletState = useCallback(() => {
    localStorage.setItem('genesisnet-wallet-balance', walletBalance.toString());
    localStorage.setItem('genesisnet-payment-history', JSON.stringify(paymentHistory));
    localStorage.setItem('genesisnet-funding-history', JSON.stringify(fundingHistory));
  }, [walletBalance, paymentHistory, fundingHistory]);

  // Initialize wallet on first load
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  // Save wallet state when it changes
  useEffect(() => {
    if (walletInitialized) {
      saveWalletState();
    }
  }, [walletBalance, paymentHistory, fundingHistory, walletInitialized, saveWalletState]);

  // Simulate realistic search process
  const startSearch = useCallback(async (criteria) => {
    if (isSearching) return;
    
    setIsSearching(true);
    setAgentStatus('searching');
    setSearchResults([]);
    setSearchCriteria(criteria);
    
    addLog('search', `🔍 Starting search for ${criteria.dataType} data in ${criteria.location}`, 'info', 'search-agent');
    
    // Simulate progressive search results
    const relevantProviders = dataProviders.filter(provider => {
      if (criteria.dataType === 'weather' && provider.type === 'weather') return true;
      if (criteria.dataType === 'financial' && provider.type === 'financial') return true;
      if (criteria.dataType === 'iot' && provider.type === 'iot') return true;
      if (criteria.dataType === 'research' && provider.type === 'research') return true;
      if (criteria.dataType === 'ai' && provider.type === 'ai') return true;
      return Math.random() > 0.7; // Some providers might have cross-category data
    });
    
    // Simulate network discovery delays
    for (let i = 0; i < relevantProviders.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const provider = relevantProviders[i];
      const priceVariation = (Math.random() - 0.5) * 0.3; // ±30% price variation
      const currentPrice = Math.round(provider.basePrice * (1 + priceVariation));
      
      const result = {
        ...provider,
        currentPrice,
        responseTime: Math.floor(Math.random() * 100) + 50,
        dataQuality: (Math.random() * 2 + 7).toFixed(1),
        availability: Math.random() > 0.1 ? 'available' : 'limited',
        lastSeen: new Date()
      };
      
      setSearchResults(prev => [...prev, result]);
      addLog('discovery', `📡 Found provider: ${provider.name} - ${currentPrice} ICP`, 'success', 'network');
    }
    
    setIsSearching(false);
    setAgentStatus('found_providers');
    addLog('search', `✅ Search completed. Found ${relevantProviders.length} providers`, 'success', 'search-agent');
  }, [isSearching, addLog]);

  // Process payment with wallet simulation
  const processPayment = useCallback(async (provider, finalPrice) => {
    const paymentId = `PAY${Date.now().toString().slice(-6)}`;
    
    // Check wallet balance
    if (walletBalance < finalPrice) {
      addLog('payment', `❌ Insufficient balance: ${walletBalance.toFixed(2)} ICP < ${finalPrice.toFixed(2)} ICP`, 'error', 'wallet');
      throw new Error('Insufficient balance');
    }

    // Create pending payment
    const payment = {
      id: paymentId,
      provider: provider.name,
      amount: finalPrice,
      status: 'pending',
      timestamp: new Date(),
      escrowAddress: `icp_escrow_${Math.random().toString(36).substr(2, 10)}`
    };

    setPendingPayments(prev => [...prev, payment]);
    addLog('payment', `💰 Initiating payment: ${finalPrice.toFixed(2)} ICP to ${provider.name}`, 'info', 'wallet');

    // Simulate wallet interaction stages
    const stages = [
      { status: 'authenticating', message: '🔐 Authenticating with ICP wallet...', delay: 1500 },
      { status: 'authorizing', message: '✍️ Awaiting user authorization...', delay: 2000 },
      { status: 'transferring', message: '💸 Transferring to escrow...', delay: 1800 },
      { status: 'confirming', message: '⏳ Confirming on ICP network...', delay: 2200 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      
      setPendingPayments(prev => 
        prev.map(p => p.id === paymentId ? { ...p, status: stage.status } : p)
      );
      
      addLog('payment', stage.message, 'info', 'wallet');
    }

    // Complete payment
    setWalletBalance(prev => prev - finalPrice);
    setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
    
    const completedPayment = {
      ...payment,
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
      completedAt: new Date()
    };
    
    setPaymentHistory(prev => [...prev, completedPayment]);
    addLog('payment', `✅ Payment completed: ${finalPrice.toFixed(2)} ICP sent to escrow`, 'success', 'wallet');
    
    return completedPayment;
  }, [walletBalance, addLog]);

  // Simulate data delivery process
  const initiateDataDelivery = useCallback(async (provider, transaction, finalPrice) => {
    const deliveryId = `DL${Date.now().toString().slice(-6)}`;
    
    // Generate realistic data package based on search criteria
    const generateDataPackage = () => {
      const dataType = searchCriteria?.dataType || 'general';
      const sampleSizes = {
        'weather': { records: '2.3M', size: '450MB', files: 12 },
        'financial': { records: '1.8M', size: '320MB', files: 8 },
        'iot': { records: '5.2M', size: '680MB', files: 15 },
        'research': { records: '890K', size: '1.2GB', files: 25 },
        'ai': { records: '15M', size: '3.4GB', files: 45 }
      };
      
      return sampleSizes[dataType] || { records: '1M', size: '200MB', files: 5 };
    };

    const dataPackage = generateDataPackage();
    
    // Create data delivery record
    const delivery = {
      id: deliveryId,
      transactionId: transaction.id,
      provider: provider.name,
      dataType: searchCriteria?.dataType || 'general',
      package: dataPackage,
      status: 'preparing',
      progress: 0,
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 15000), // 15 seconds
      downloadUrl: null,
      accessToken: null
    };

    setDataDeliveries(prev => [...prev, delivery]);
    addLog('delivery', `📦 Preparing data package: ${delivery.id} (${dataPackage.size})`, 'info', 'data-provider');

    // Simulate data preparation stages
    const stages = [
      { status: 'validating', progress: 15, message: '🔍 Validating data integrity...', delay: 2000 },
      { status: 'encrypting', progress: 35, message: '🔐 Encrypting data package...', delay: 2500 },
      { status: 'packaging', progress: 60, message: '📁 Creating secure package...', delay: 3000 },
      { status: 'uploading', progress: 85, message: '☁️ Uploading to secure storage...', delay: 2000 },
      { status: 'ready', progress: 100, message: '✅ Data package ready for download', delay: 1500 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      
      setDataDeliveries(prev => 
        prev.map(d => d.id === deliveryId ? { 
          ...d, 
          status: stage.status, 
          progress: stage.progress,
          ...(stage.status === 'ready' && {
            downloadUrl: `https://secure.genesisnet.data/${deliveryId}`,
            accessToken: `gt_${Math.random().toString(36).substr(2, 12)}`
          })
        } : d)
      );
      
      addLog('delivery', stage.message, stage.status === 'ready' ? 'success' : 'info', 'data-provider');
    }

    // Move to completed deliveries
    setTimeout(() => {
      setDataDeliveries(prev => prev.filter(d => d.id !== deliveryId));
      setCompletedDeliveries(prev => [...prev, {
        ...delivery,
        status: 'ready',
        progress: 100,
        downloadUrl: `https://secure.genesisnet.data/${deliveryId}`,
        accessToken: `gt_${Math.random().toString(36).substr(2, 12)}`,
        completedTime: new Date()
      }]);
    }, 500);

  }, [searchCriteria, addLog]);

  // Simulate negotiation process
  const negotiate = useCallback(async (provider) => {
    if (isNegotiating) return;
    
    setIsNegotiating(true);
    setSelectedProvider(provider);
    setNegotiationStatus('connecting');
    setAgentStatus('negotiating');
    
    addLog('negotiation', `🤝 Starting negotiation with ${provider.name}`, 'info', 'negotiation-agent');
    
    // Simulate multi-stage negotiation
    const stages = [
      { status: 'connecting', message: '🔗 Establishing secure connection...', delay: 1500 },
      { status: 'authenticating', message: '🔐 Authenticating credentials...', delay: 1200 },
      { status: 'price_discussion', message: '💰 Discussing pricing and terms...', delay: 2000 },
      { status: 'quality_verification', message: '🔍 Verifying data quality...', delay: 1800 },
      { status: 'contract_creation', message: '📄 Creating smart contract...', delay: 1000 }
    ];
    
    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      setNegotiationStatus(stage.status);
      addLog('negotiation', stage.message, 'info', 'negotiation-agent');
    }
    
    // Simulate negotiation outcome (90% success rate)
    const isSuccessful = Math.random() > 0.1;
    
    if (isSuccessful) {
      const finalPrice = Math.max(provider.currentPrice * (0.9 + Math.random() * 0.2), provider.currentPrice * 0.85);
      setNegotiationStatus('success');
      setAgentStatus('contract_signed');
      
      // Add to active connections
      const newConnection = {
        id: `conn_${Date.now()}`,
        provider: provider.name,
        price: finalPrice.toFixed(0),
        status: 'active',
        dataType: searchCriteria?.dataType || 'general',
        startTime: new Date(),
        bandwidth: Math.floor(Math.random() * 100) + 50
      };
      setActiveConnections(prev => [...prev, newConnection]);
      
      // Add transaction to pool
      const transaction = {
        id: `TX${String(Date.now()).slice(-3)}`,
        type: 'Data Purchase',
        provider: provider.name,
        amount: `${finalPrice.toFixed(0)} ICP`,
        status: 'processing',
        timestamp: new Date()
      };
      setTransactionPool(prev => [...prev, transaction]);
      
      addLog('negotiation', `✅ Negotiation successful! Final price: ${finalPrice.toFixed(0)} ICP`, 'success', 'negotiation-agent');
      
      // Process payment before creating transaction
      try {
        const payment = await processPayment(provider, finalPrice);
        addLog('transaction', `💳 Transaction initiated: ${transaction.id} (Payment: ${payment.id})`, 'info', 'blockchain');
        
        // Update transaction with payment info
        transaction.paymentId = payment.id;
        transaction.escrowAddress = payment.escrowAddress;
        
        // Simulate transaction processing
        setTimeout(() => {
          setTransactionPool(prev => 
            prev.map(tx => tx.id === transaction.id ? { ...tx, status: 'confirmed' } : tx)
          );
          addLog('transaction', `✅ Transaction confirmed: ${transaction.id}`, 'success', 'blockchain');
          
          // Initiate data delivery after payment confirmed
          initiateDataDelivery(provider, transaction, finalPrice);
        }, 3000);
        
      } catch (paymentError) {
        // Payment failed
        setNegotiationStatus('payment_failed');
        setAgentStatus('payment_failed');
        addLog('payment', `❌ Payment failed: ${paymentError.message}`, 'error', 'wallet');
        
        setTimeout(() => {
          setNegotiationStatus(null);
          setSelectedProvider(null);
          setAgentStatus('idle');
        }, 5000);
        setIsNegotiating(false);
        return;
      }
      
    } else {
      setNegotiationStatus('failed');
      setAgentStatus('negotiation_failed');
      addLog('negotiation', `❌ Negotiation failed with ${provider.name}`, 'error', 'negotiation-agent');
    }
    
    setIsNegotiating(false);
    
    // Reset after a while
    setTimeout(() => {
      setNegotiationStatus(null);
      setSelectedProvider(null);
      setAgentStatus('idle');
    }, 5000);
    
  }, [isNegotiating, addLog, searchCriteria]);

  // Auto-refresh metrics
  useEffect(() => {
    metricsInterval.current = setInterval(() => {
      setMetrics(generateNetworkMetrics());
      setLastUpdate(new Date());
    }, 3000);

    return () => {
      if (metricsInterval.current) clearInterval(metricsInterval.current);
    };
  }, []);

  // Generate periodic system logs
  useEffect(() => {
    const systemMessages = [
      { message: '🔄 System health check completed', level: 'success' },
      { message: '📡 Network scan in progress', level: 'info' },
      { message: '⚡ High traffic detected on EU servers', level: 'warning' },
      { message: '🔒 Security scan passed', level: 'success' },
      { message: '📊 Generating analytics report', level: 'info' },
      { message: '🌐 New node joined the network', level: 'info' },
      { message: '💾 Database optimization complete', level: 'success' }
    ];

    logsInterval.current = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of generating a log
        const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
        addLog('system', randomMessage.message, randomMessage.level);
      }
    }, 4000);

    return () => {
      if (logsInterval.current) clearInterval(logsInterval.current);
    };
  }, [addLog]);

  // Generate network data based on search results
  const networkData = {
    nodes: [
      { 
        id: 'requester', 
        name: 'Data Requester Agent', 
        type: 'requester', 
        status: agentStatus,
        fx: 400, 
        fy: 300 
      },
      ...searchResults.map((provider, index) => ({
        id: provider.id,
        name: provider.name,
        type: 'provider',
        reputation: provider.reputation,
        price: `${provider.currentPrice} ICP`,
        status: selectedProvider?.id === provider.id ? 'negotiating' : provider.status,
        location: provider.location,
        dataQuality: provider.dataQuality
      }))
    ],
    links: searchResults.map(provider => ({
      source: 'requester',
      target: provider.id,
      strength: Math.random() * 0.5 + 0.5,
      status: selectedProvider?.id === provider.id ? 'negotiating' : 
              activeConnections.some(conn => conn.provider === provider.name) ? 'active' : 'idle'
    }))
  };

  // Utility functions
  const refresh = useCallback(() => {
    setMetrics(generateNetworkMetrics());
    setLastUpdate(new Date());
    addLog('system', '🔄 Manual refresh triggered', 'info', 'user');
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('system', '🗑️ Logs cleared', 'info', 'user');
  }, [addLog]);

  // Generate realistic dummy data files
  const generateDummyDataFile = (dataType, records, fileName) => {
    let content = '';
    
    switch (dataType) {
      case 'financial':
        content = generateFinancialData(records);
        break;
      case 'weather':
        content = generateWeatherData(records);
        break;
      case 'iot':
        content = generateIoTData(records);
        break;
      case 'research':
        content = generateResearchData(records);
        break;
      case 'ai':
        content = generateAIData(records);
        break;
      default:
        content = generateGenericData(records);
    }
    
    return new Blob([content], { type: 'text/csv' });
  };

  // Data generators for different types
  const generateFinancialData = (records) => {
    let csv = 'timestamp,symbol,price,volume,market_cap,change_24h\n';
    const symbols = ['BTC', 'ETH', 'ICP', 'ADA', 'DOT', 'LINK', 'UNI', 'SOL'];
    
    for (let i = 0; i < records; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const price = (Math.random() * 1000 + 10).toFixed(2);
      const volume = Math.floor(Math.random() * 1000000000);
      const marketCap = Math.floor(Math.random() * 100000000000);
      const change = ((Math.random() - 0.5) * 20).toFixed(2);
      
      csv += `${timestamp},${symbol},${price},${volume},${marketCap},${change}%\n`;
    }
    return csv;
  };

  const generateWeatherData = (records) => {
    let csv = 'timestamp,location,temperature,humidity,pressure,wind_speed,condition\n';
    const locations = ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Paris', 'Toronto', 'Singapore'];
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy'];
    
    for (let i = 0; i < records; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
      const location = locations[Math.floor(Math.random() * locations.length)];
      const temperature = (Math.random() * 40 - 10).toFixed(1);
      const humidity = Math.floor(Math.random() * 100);
      const pressure = (Math.random() * 100 + 950).toFixed(1);
      const windSpeed = (Math.random() * 50).toFixed(1);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      csv += `${timestamp},${location},${temperature},${humidity},${pressure},${windSpeed},${condition}\n`;
    }
    return csv;
  };

  const generateIoTData = (records) => {
    let csv = 'timestamp,device_id,sensor_type,value,unit,battery,status\n';
    const sensorTypes = ['temperature', 'humidity', 'motion', 'light', 'pressure', 'gas'];
    const units = ['°C', '%', 'boolean', 'lux', 'hPa', 'ppm'];
    
    for (let i = 0; i < records; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      const deviceId = `IOT${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const sensorIndex = Math.floor(Math.random() * sensorTypes.length);
      const sensorType = sensorTypes[sensorIndex];
      const value = sensorType === 'motion' ? Math.random() > 0.7 : (Math.random() * 100).toFixed(2);
      const unit = units[sensorIndex];
      const battery = Math.floor(Math.random() * 100);
      const status = Math.random() > 0.1 ? 'online' : 'offline';
      
      csv += `${timestamp},${deviceId},${sensorType},${value},${unit},${battery}%,${status}\n`;
    }
    return csv;
  };

  const generateResearchData = (records) => {
    let csv = 'id,title,author,institution,year,citations,field,doi\n';
    const fields = ['AI', 'Blockchain', 'Climate', 'Medicine', 'Physics', 'Chemistry', 'Biology'];
    const institutions = ['MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge', 'ETH Zurich', 'UC Berkeley'];
    
    for (let i = 0; i < records; i++) {
      const id = `R${String(i + 1).padStart(6, '0')}`;
      const title = `Research Paper ${i + 1}: Advanced Study in ${fields[Math.floor(Math.random() * fields.length)]}`;
      const author = `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. Smith ${i + 1}`;
      const institution = institutions[Math.floor(Math.random() * institutions.length)];
      const year = Math.floor(Math.random() * 20) + 2005;
      const citations = Math.floor(Math.random() * 1000);
      const field = fields[Math.floor(Math.random() * fields.length)];
      const doi = `10.1000/${Math.random().toString(36).substr(2, 8)}`;
      
      csv += `${id},"${title}","${author}",${institution},${year},${citations},${field},${doi}\n`;
    }
    return csv;
  };

  const generateAIData = (records) => {
    let csv = 'model_id,architecture,parameters,accuracy,loss,training_time,dataset_size,framework\n';
    const architectures = ['Transformer', 'CNN', 'RNN', 'GAN', 'VAE', 'ResNet', 'BERT', 'GPT'];
    const frameworks = ['PyTorch', 'TensorFlow', 'JAX', 'Keras', 'Hugging Face'];
    
    for (let i = 0; i < records; i++) {
      const modelId = `AI_${Math.random().toString(36).substr(2, 8)}`;
      const architecture = architectures[Math.floor(Math.random() * architectures.length)];
      const parameters = Math.floor(Math.random() * 1000000000) + 1000000;
      const accuracy = (Math.random() * 0.3 + 0.7).toFixed(4);
      const loss = (Math.random() * 0.5).toFixed(4);
      const trainingTime = Math.floor(Math.random() * 168) + 1; // hours
      const datasetSize = Math.floor(Math.random() * 10000000) + 100000;
      const framework = frameworks[Math.floor(Math.random() * frameworks.length)];
      
      csv += `${modelId},${architecture},${parameters},${accuracy},${loss},${trainingTime}h,${datasetSize},${framework}\n`;
    }
    return csv;
  };

  const generateGenericData = (records) => {
    let csv = 'id,timestamp,category,value,status\n';
    const categories = ['A', 'B', 'C', 'D'];
    const statuses = ['active', 'inactive', 'pending'];
    
    for (let i = 0; i < records; i++) {
      const id = i + 1;
      const timestamp = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
      const category = categories[Math.floor(Math.random() * categories.length)];
      const value = Math.random() * 1000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      csv += `${id},${timestamp},${category},${value.toFixed(2)},${status}\n`;
    }
    return csv;
  };

  // Enhanced download with actual file generation
  const downloadData = useCallback(async (delivery) => {
    const downloadId = `DL${Date.now().toString().slice(-6)}`;
    
    // Parse records count from package
    const recordsText = delivery.package.records;
    const recordsCount = parseFloat(recordsText.replace(/[^0-9.]/g, ''));
    const actualRecords = recordsText.includes('M') ? Math.floor(recordsCount * 1000) : Math.floor(recordsCount * 100);
    
    // Add to active downloads
    const download = {
      id: downloadId,
      deliveryId: delivery.id,
      fileName: `genesisnet_${delivery.dataType}_${delivery.id}.csv`,
      size: delivery.package.size,
      progress: 0,
      speed: '0 MB/s',
      status: 'preparing'
    };

    setActiveDownloads(prev => [...prev, download]);
    addLog('download', `🔽 Preparing download: ${download.fileName}`, 'info', 'download-manager');

    // Generate actual data file
    setActiveDownloads(prev => 
      prev.map(d => d.id === downloadId ? { ...d, status: 'generating', progress: 10 } : d)
    );
    addLog('download', `📊 Generating ${actualRecords} records of ${delivery.dataType} data...`, 'info', 'data-generator');

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create file content
    const fileBlob = generateDummyDataFile(delivery.dataType, actualRecords, download.fileName);
    
    setActiveDownloads(prev => 
      prev.map(d => d.id === downloadId ? { ...d, status: 'downloading', progress: 30 } : d)
    );

    // Simulate download progress with real file
    const totalSteps = 15;
    for (let i = 4; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));
      
      const progress = (i / totalSteps) * 100;
      const speed = (Math.random() * 8 + 3).toFixed(1);
      
      setActiveDownloads(prev => 
        prev.map(d => d.id === downloadId ? { 
          ...d, 
          progress: Math.round(progress),
          speed: `${speed} MB/s`,
          status: i === totalSteps ? 'completed' : 'downloading'
        } : d)
      );
    }

    // Trigger actual file download
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = download.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog('download', `✅ Download completed: ${download.fileName} (${actualRecords} records)`, 'success', 'download-manager');
    
    // Remove from active downloads after completion
    setTimeout(() => {
      setActiveDownloads(prev => prev.filter(d => d.id !== downloadId));
    }, 3000);

    // Simulate file validation
    setTimeout(() => {
      addLog('system', `📂 File ready: ${download.fileName} contains ${actualRecords} validated records`, 'success', 'data-validator');
      addLog('system', `💾 File size: ${(fileBlob.size / 1024).toFixed(1)} KB`, 'info', 'file-system');
    }, 1000);

  }, [addLog]);

  return {
    // Data
    logs,
    metrics,
    networkData,
    searchResults,
    activeConnections,
    transactionPool,
    dataDeliveries,
    activeDownloads,
    completedDeliveries,
    walletBalance,
    paymentHistory,
    pendingPayments,
    fundingHistory,
    
    // Status
    agentStatus,
    isSearching,
    isNegotiating,
    selectedProvider,
    negotiationStatus,
    lastUpdate,
    
    // Actions
    startSearch,
    negotiate,
    downloadData,
    refresh,
    addLog,
    clearLogs,
    
    // Connection info
    isConnectedToICP: true,
    isMockMode: true,
    connectionStatus: { isInitialized: true, fallbackToMock: true, hasActors: false },
    isLoading: isSearching || isNegotiating,
    error: null,
    clearError: () => {}
  };
};

export default useInteractiveDemo;
