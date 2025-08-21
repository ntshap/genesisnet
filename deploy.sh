#!/bin/bash

# GenesisNet Deployment Script
# This script helps you deploy the GenesisNet project

set -e  # Exit on any error

echo "🚀 GenesisNet Deployment Script"
echo "================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists dfx; then
    echo "❌ DFX not found. Please install DFX first:"
    echo "   sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python3 not found. Please install Python 3.12+"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Find the project directory
echo "🔍 Looking for project directory..."

# Try to find the backend directory with dfx.json
PROJECT_DIR=""
if [ -f "backend/dfx.json" ]; then
    PROJECT_DIR="$(pwd)"
elif [ -f "dfx.json" ]; then
    PROJECT_DIR="$(pwd)/.."
else
    echo "❌ Could not find dfx.json. Please run this script from the project root directory."
    echo "   Expected structure:"
    echo "   ├── backend/"
    echo "   │   ├── dfx.json"
    echo "   │   └── canisters/"
    echo "   └── src/"
    exit 1
fi

echo "✅ Found project at: $PROJECT_DIR"

# Navigate to backend directory
BACKEND_DIR="$PROJECT_DIR/backend"
echo "📁 Navigating to backend directory: $BACKEND_DIR"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

cd "$BACKEND_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r canisters/data_provider/requirements.txt
pip install -r canisters/data_requester/requirements.txt
pip install -r canisters/reputation_agent/requirements.txt

# Verify imports
echo "🔍 Verifying Python imports..."
if [ -f "verify_imports.py" ]; then
    python3 verify_imports.py
else
    echo "⚠️  verify_imports.py not found, skipping import verification"
fi

# Start local replica
echo "🌐 Starting local Internet Computer replica..."
dfx start --background

# Wait for replica to be ready
echo "⏳ Waiting for replica to be ready..."
sleep 5
dfx ping

# Deploy canisters
echo "🚀 Deploying canisters..."
dfx deploy

# Show deployment status
echo "📊 Deployment Status:"
echo "====================="
dfx canister list

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the frontend: cd .. && npm run dev"
echo "2. Access the application at: http://localhost:5173"
echo "3. View canister status: dfx canister status <canister_name>"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: dfx logs"
echo "- Stop replica: dfx stop"
echo "- Deploy to mainnet: dfx deploy --network ic"
