// Demo Mode Configuration
export const DEMO_CONFIG = {
  DEMO_MODE: false,
  DEFAULT_BALANCE: 5000,
  MAX_PROVIDERS: 25,
  DEFAULT_PROVIDER_COUNT: 10,
  SIMULATION_SPEED: 1,
  MAX_SIMULATION_SPEED: 5,
  VISUALIZATION_FPS: 30,
  TRANSACTION_INTERVAL: 8000,
  NODE_STATUS_INTERVAL: 5000,
  EVENT_GENERATION_INTERVAL: 15000,
  METRICS_UPDATE_INTERVAL: 3000,
  LOG_ROTATION_INTERVAL: 60000,
  MAX_LOG_ENTRIES: 50,
  MAX_EVENTS: 15,
  INITIAL_REPUTATION: 75,
  MIN_REPUTATION: 1,
  MAX_REPUTATION: 100
};

// Demo scenarios configuration
export const demoControls = {
  scenarios: [
    {
      id: 'data_marketplace',
      name: 'Data Marketplace',
      description: 'Normal operation of the data marketplace',
      duration: 90,
      effects: {
        transactionRate: 1,
        errorRate: 0.05,
        nodeJoinRate: 0.1,
        nodeLeaveRate: 0.05
      }
    },
    {
      id: 'high_demand',
      name: 'High Demand',
      description: 'Many data requests coming into the network',
      duration: 45,
      effects: {
        transactionRate: 3,
        errorRate: 0.1,
        nodeJoinRate: 0.2,
        nodeLeaveRate: 0.05
      }
    },
    {
      id: 'network_stress',
      name: 'Network Stress',
      description: 'Network under high load with many errors',
      duration: 30,
      effects: {
        transactionRate: 2,
        errorRate: 0.3,
        nodeJoinRate: 0.1,
        nodeLeaveRate: 0.2
      }
    },
    {
      id: 'rapid_growth',
      name: 'Rapid Growth',
      description: 'Many new providers joining the network',
      duration: 60,
      effects: {
        transactionRate: 1.5,
        errorRate: 0.1,
        nodeJoinRate: 0.4,
        nodeLeaveRate: 0.05
      }
    }
  ]
};
