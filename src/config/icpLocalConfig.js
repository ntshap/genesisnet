// ICP Local Network Configuration for GenesisNet
// This configuration ensures we use local/simulated ICP tokens for development and hackathon demo

export const ICP_LOCAL_CONFIG = {
  // Network Configuration
  NETWORK: 'local',
  HOST: 'http://localhost:4943',
  
  // Local ICP Ledger Settings
  CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai', // Local ledger canister
  USE_LOCAL_REPLICA: true,
  DISABLE_CERTIFICATE_VERIFICATION: true,
  
  // Development/Demo Settings
  DEMO_MODE: true,
  FREE_TOKEN_ALLOCATION: true,
  
  // Default Balances for Demo (in ICP)
  DEFAULT_BALANCES: {
    DATA_REQUESTER: 1000.0,    // 1000 ICP untuk Data Requester Agent
    DATA_PROVIDER: 500.0,      // 500 ICP untuk Data Provider Agent  
    USER_WALLET: 100.0,        // 100 ICP untuk user wallet
    SYSTEM_RESERVE: 10000.0    // 10000 ICP untuk system reserve
  },
  
  // Transfer Fee (local network - bisa dibuat gratis atau minimal)
  LOCAL_TRANSFER_FEE: 0,       // 0 ICP transfer fee untuk demo lokal
  PRODUCTION_TRANSFER_FEE: 0.0001, // Standard ICP transfer fee untuk production
  
  // Mock Data Generation
  GENERATE_MOCK_TRANSACTIONS: true,
  SIMULATE_NETWORK_LATENCY: false,
  
  // Security Settings untuk Local Development
  SKIP_IDENTITY_VERIFICATION: true,
  ALLOW_ANONYMOUS_TRANSACTIONS: true,
  
  // Logging
  ENABLE_DEBUG_LOGGING: true,
  LOG_ALL_TRANSACTIONS: true
};

// Helper functions
export const getLocalICPConfig = () => {
  return {
    host: ICP_LOCAL_CONFIG.HOST,
    canisterId: ICP_LOCAL_CONFIG.CANISTER_ID,
    isLocal: true,
    transferFee: ICP_LOCAL_CONFIG.LOCAL_TRANSFER_FEE,
    defaultBalance: ICP_LOCAL_CONFIG.DEFAULT_BALANCES.USER_WALLET
  };
};

export const isLocalNetwork = () => {
  return ICP_LOCAL_CONFIG.USE_LOCAL_REPLICA && ICP_LOCAL_CONFIG.NETWORK === 'local';
};

export const getDefaultBalance = (agentType = 'USER_WALLET') => {
  return ICP_LOCAL_CONFIG.DEFAULT_BALANCES[agentType] || ICP_LOCAL_CONFIG.DEFAULT_BALANCES.USER_WALLET;
};

// Validation
export const validateLocalSetup = () => {
  console.log('🔧 GenesisNet ICP Local Configuration:');
  console.log(`   Network: ${ICP_LOCAL_CONFIG.NETWORK}`);
  console.log(`   Host: ${ICP_LOCAL_CONFIG.HOST}`);
  console.log(`   Using Local Replica: ${ICP_LOCAL_CONFIG.USE_LOCAL_REPLICA}`);
  console.log(`   Demo Mode: ${ICP_LOCAL_CONFIG.DEMO_MODE}`);
  console.log(`   Free Token Allocation: ${ICP_LOCAL_CONFIG.FREE_TOKEN_ALLOCATION}`);
  console.log(`   Default User Balance: ${ICP_LOCAL_CONFIG.DEFAULT_BALANCES.USER_WALLET} ICP`);
  console.log(`   Transfer Fee: ${ICP_LOCAL_CONFIG.LOCAL_TRANSFER_FEE} ICP`);
  
  return true;
};
