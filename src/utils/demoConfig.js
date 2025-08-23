// Demo configuration untuk GenesisNet
export const DEMO_CONFIG = {
  // Demo mode settings
  DEMO_MODE: false, // Backend is ready - no demo mode
  AUTO_START: false, // Auto-start simulation
  FORCE_MOCK_MODE: false, // No mock data - using real ICP backend
  
  // Animation settings
  ANIMATION_SPEED: 1.0, // 1.0 = normal speed, 0.5 = half speed, 2.0 = double speed
  ENABLE_PARTICLES: true,
  ENABLE_GLOW_EFFECTS: true,
  
  // Data refresh intervals (in milliseconds)
  POLLING_INTERVALS: {
    DEMO: {
      logs: 800,    // Much faster updates for demo
      metrics: 1200,
      networkData: 1500,
      status: 500
    },
    PRODUCTION: {
      logs: 5000,
      metrics: 10000,
      networkData: 15000,
      status: 2000
    }
  },
  
  // Demo scenario presets
  DEMO_SCENARIOS: [
    {
      name: "Weather Data Search",
      description: "Search for real-time weather data across multiple regions",
      criteria: {
        dataType: "weather",
        location: "Global",
        timeRange: "2024-01-01 to 2024-12-31",
        maxPrice: 75,
        minReputation: 7.0
      },
      expectedProviders: 3,
      simulationDuration: 15000 // 15 seconds
    },
    {
      name: "Financial Market Data",
      description: "High-frequency trading data with strict latency requirements",
      criteria: {
        dataType: "financial",
        location: "US-East",
        timeRange: "2024-06-01 to 2024-06-30",
        maxPrice: 200,
        minReputation: 8.5
      },
      expectedProviders: 2,
      simulationDuration: 12000
    },
    {
      name: "Social Media Analytics",
      description: "Real-time social sentiment and engagement metrics",
      criteria: {
        dataType: "social",
        location: "Southeast Asia",
        timeRange: "2024-03-01 to 2024-03-31",
        maxPrice: 100,
        minReputation: 6.0
      },
      expectedProviders: 2,
      simulationDuration: 18000
    },
    {
      name: "Scientific Research Data",
      description: "Large datasets for machine learning and research",
      criteria: {
        dataType: "scientific",
        location: "Europe",
        timeRange: "2024-01-01 to 2024-06-30",
        maxPrice: 150,
        minReputation: 8.0
      },
      expectedProviders: 1,
      simulationDuration: 20000
    }
  ],
  
  // Network simulation settings
  NETWORK_SIMULATION: {
    PROVIDER_STATUS_CHANGE_PROBABILITY: 0.1, // 10% chance per update cycle
    REPUTATION_FLUCTUATION_RANGE: 0.1, // ±0.1 points
    RESPONSE_TIME_VARIATION: 20, // ±20ms
    AUTO_BACKGROUND_ACTIVITY: true,
    BACKGROUND_ACTIVITY_INTERVAL: 3000, // 3 seconds
  },
  
  // UI settings for demo
  UI_SETTINGS: {
    SHOW_DEBUG_INFO: true,
    HIGHLIGHT_NEW_LOGS: true,
    AUTO_SCROLL_LOGS: true,
    SHOW_PERFORMANCE_METRICS: true,
    ENABLE_TOOLTIPS: true,
    ANIMATION_REDUCE_MOTION: false // Set to true for accessibility
  },
  
  // Demo presentation settings
  PRESENTATION: {
    AUTO_PLAY_SCENARIOS: false, // Automatically cycle through scenarios
    SCENARIO_DURATION: 30000, // 30 seconds per scenario when auto-playing
    SHOW_SCENARIO_PROGRESS: true,
    ENABLE_FULLSCREEN_MODE: true,
    HIDE_TECHNICAL_DETAILS: false // Hide technical details for business audience
  },
  
  // Mock data behavior
  MOCK_DATA_BEHAVIOR: {
    REALISTIC_DELAYS: true, // Add realistic network delays
    VARIABLE_SUCCESS_RATES: true, // Variable negotiation success based on price/reputation
    DYNAMIC_PRICING: true, // Providers can update their prices
    PROVIDER_AVAILABILITY: true, // Providers can go online/offline
    REPUTATION_EVOLUTION: true // Provider reputations change over time
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isDemo = DEMO_CONFIG.DEMO_MODE;
  
  return {
    // API endpoints
    ICP_HOST: isDevelopment ? 'http://localhost:8000' : 'https://ic0.app',
    
    // Feature flags
    ENABLE_ICP_INTEGRATION: !isDemo,
    ENABLE_MOCK_FALLBACK: true,
    ENABLE_ANALYTICS: !isDevelopment,
    ENABLE_ERROR_REPORTING: !isDevelopment,
    
    // Performance settings
    POLLING_INTERVALS: isDemo 
      ? DEMO_CONFIG.POLLING_INTERVALS.DEMO 
      : DEMO_CONFIG.POLLING_INTERVALS.PRODUCTION,
      
    // Debug settings
    VERBOSE_LOGGING: isDevelopment,
    SHOW_PERFORMANCE_WARNINGS: isDevelopment,
    
    // Security settings
    ENABLE_CSP: !isDevelopment,
    ENABLE_HTTPS_ONLY: !isDevelopment
  };
};

// Demo control functions
export const demoControls = {
  // Start a specific demo scenario
  startScenario: (scenarioIndex) => {
    const scenario = DEMO_CONFIG.DEMO_SCENARIOS[scenarioIndex];
    if (!scenario) return null;
    
    console.log(`🎬 Starting demo scenario: ${scenario.name}`);
    return scenario;
  },
  
  // Reset demo to initial state
  resetDemo: () => {
    console.log('🔄 Resetting demo to initial state');
    // This would trigger a reset in the mock data
    if (typeof window !== 'undefined' && window.mockDataReset) {
      window.mockDataReset();
    }
  },
  
  // Toggle demo mode
  toggleDemoMode: () => {
    DEMO_CONFIG.DEMO_MODE = !DEMO_CONFIG.DEMO_MODE;
    console.log(`🎭 Demo mode ${DEMO_CONFIG.DEMO_MODE ? 'enabled' : 'disabled'}`);
    return DEMO_CONFIG.DEMO_MODE;
  },
  
  // Adjust animation speed for presentation
  setAnimationSpeed: (speed) => {
    DEMO_CONFIG.ANIMATION_SPEED = Math.max(0.1, Math.min(3.0, speed));
    console.log(`⚡ Animation speed set to ${DEMO_CONFIG.ANIMATION_SPEED}x`);
  },
  
  // Generate demo report
  generateDemoReport: () => {
    return {
      timestamp: new Date().toISOString(),
      config: DEMO_CONFIG,
      environment: getEnvironmentConfig(),
      scenarios: DEMO_CONFIG.DEMO_SCENARIOS.map((scenario, index) => ({
        index,
        name: scenario.name,
        duration: scenario.simulationDuration,
        completed: false // This would be tracked during actual demo
      }))
    };
  }
};

// Export for use in components
export default DEMO_CONFIG;
