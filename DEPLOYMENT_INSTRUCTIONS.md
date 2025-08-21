# GenesisNet Deployment Instructions

## 🚀 Complete Deployment Guide

### Prerequisites

1. **DFX SDK** - Internet Computer development kit
2. **Node.js** - Version 18+ for frontend
3. **Python** - Version 3.12+ for backend agents
4. **Git** - Version control

### Step 1: Environment Setup

#### Install DFX (if not already installed)
```bash
# Download and install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Verify installation
dfx --version
```

#### Install Node.js Dependencies
```bash
# Navigate to project root
cd /path/to/1genesisnet-main

# Install frontend dependencies
npm install
```

### Step 2: Backend Setup (Python Agents)

#### Navigate to Backend Directory
```bash
cd backend
```

#### Set Up Python Environment
```bash
# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r canisters/data_provider/requirements.txt
pip install -r canisters/data_requester/requirements.txt
pip install -r canisters/reputation_agent/requirements.txt
```

#### Verify Python Imports
```bash
# Test that all imports work correctly
python3 verify_imports.py
```

### Step 3: Local Development Deployment

#### Start Local Internet Computer
```bash
# Start local replica
dfx start --background

# Wait for replica to be ready
dfx ping
```

#### Deploy Canisters
```bash
# Deploy all canisters
dfx deploy

# Or deploy specific canisters
dfx deploy data_provider
dfx deploy data_requester
dfx deploy reputation_agent
```

#### Verify Deployment
```bash
# Check canister status
dfx canister status data_provider
dfx canister status data_requester
dfx canister status reputation_agent

# List all canisters
dfx canister list
```

### Step 4: Frontend Development

#### Build Frontend
```bash
# Navigate back to project root
cd ..

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

#### Access Application
- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Local IC**: http://localhost:8000

### Step 5: Production Deployment

#### Prepare for Production
```bash
# Build frontend for production
npm run build

# Verify build
npm run preview
```

#### Deploy to IC Mainnet
```bash
# Navigate to backend directory
cd backend

# Set identity (if not set)
dfx identity use default

# Deploy to IC mainnet
dfx deploy --network ic

# Get canister IDs
dfx canister --network ic id data_provider
dfx canister --network ic id data_requester
dfx canister --network ic id reputation_agent
```

#### Update Frontend Configuration
Update the frontend configuration with the deployed canister IDs:

```javascript
// src/services/icpAgent.js
const CANISTER_IDS = {
  data_provider: "YOUR_DATA_PROVIDER_CANISTER_ID",
  data_requester: "YOUR_DATA_REQUESTER_CANISTER_ID", 
  reputation_agent: "YOUR_REPUTATION_AGENT_CANISTER_ID"
};
```

### Step 6: Verification

#### Test Backend Agents
```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate

# Test individual canisters
cd canisters/data_provider/src
python3 main.py

cd ../../data_requester/src
python3 main.py

cd ../../reputation_agent/src
python3 main.py
```

#### Test Frontend Integration
1. Open browser to deployed frontend
2. Test data query functionality
3. Verify agent communication
4. Check transaction logs

### Troubleshooting

#### Common Issues

1. **DFX Configuration Error**
   ```bash
   # Ensure you're in the backend directory
   cd backend
   ls dfx.json  # Should show the file
   ```

2. **Python Import Errors**
   ```bash
   # Verify virtual environment is activated
   which python3
   # Should show path to venv/bin/python3
   
   # Reinstall dependencies
   pip install --force-reinstall -r canisters/*/requirements.txt
   ```

3. **Canister Build Errors**
   ```bash
   # Clean and rebuild
   dfx stop
   dfx start --clean --background
   dfx deploy
   ```

4. **Network Issues**
   ```bash
   # Check IC network status
   dfx ping --network ic
   
   # Check local network
   dfx ping
   ```

#### Logs and Debugging
```bash
# View canister logs
dfx canister call data_requester get_logs

# Check canister status
dfx canister status data_requester

# View replica logs
dfx logs
```

### Environment Variables

#### Development (.env.development)
```bash
VITE_ENVIRONMENT=development
VITE_ICP_HOST=http://localhost:8000
VITE_ENABLE_MOCK_FALLBACK=true
VITE_LOG_LEVEL=debug
```

#### Production (.env.production)
```bash
VITE_ENVIRONMENT=production
VITE_ICP_HOST=https://ic0.app
VITE_ENABLE_MOCK_FALLBACK=false
VITE_LOG_LEVEL=error
```

### Security Checklist

- [ ] Environment variables configured
- [ ] Canister permissions set correctly
- [ ] Frontend security headers configured
- [ ] HTTPS enabled for production
- [ ] Error handling implemented
- [ ] Input validation in place

### Performance Optimization

- [ ] Frontend bundle optimized
- [ ] Images compressed
- [ ] CDN configured
- [ ] Caching strategies implemented
- [ ] Database queries optimized

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Log aggregation set up
- [ ] Health checks implemented
- [ ] Alerting configured

## 🎯 Quick Start Commands

```bash
# Complete setup and deployment
cd backend
source venv/bin/activate
dfx start --background
dfx deploy
cd ..
npm install
npm run dev
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure you're in the correct directory
4. Check the logs for specific error messages
5. Refer to the DFX documentation: https://internetcomputer.org/docs/current/developer-docs/setup/install/
