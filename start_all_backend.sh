#!/bin/bash

echo "=========================================="
echo "  Starting GenesisNet All Backend Services"
echo "=========================================="

# Get absolute workspace directory
WORKSPACE_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$WORKSPACE_DIR"

# Check if python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python not found!"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    timeout 1 bash -c "</dev/tcp/localhost/$1" &> /dev/null
    return $?
}

# 1. Start Main FastAPI Backend if not already running
echo "1. Checking FastAPI Backend (port 8000)..."
if check_port 8000; then
    echo "   ✅ FastAPI Backend is already running on port 8000"
else
    echo "   🚀 Starting FastAPI Backend..."
    cd "$WORKSPACE_DIR/backend/api"

    # Check if database exists, if not create it
    if [ ! -f "genesisnet.db" ]; then
        echo "   📦 Creating database..."
        $PYTHON_CMD create_tables.py
    fi

    # Start the API server in background
    $PYTHON_CMD -m uvicorn main:app --host 0.0.0.0 --port 8000 > "$WORKSPACE_DIR/backend_api.log" 2>&1 &
    echo "   📝 API logs: $WORKSPACE_DIR/backend_api.log"
    sleep 3
fi

# 2. Start Mock DFX Replica if not already running
echo "2. Checking Mock DFX Replica (port 4943)..."
if check_port 4943; then
    echo "   ✅ Mock DFX Replica is already running on port 4943"
else
    echo "   🚀 Starting Mock DFX Replica..."
    cd "$WORKSPACE_DIR/backend"
    # Run the mock DFX replica with virtual environment
    source dfx_venv/bin/activate
    $PYTHON_CMD mock_dfx_replica.py > "$WORKSPACE_DIR/mock_dfx.log" 2>&1 &
    deactivate
    echo "   📝 Mock DFX logs: $WORKSPACE_DIR/mock_dfx.log"
    sleep 3
fi

echo "All backend services have been started!"
echo ""
echo "Backend Services:"
echo "- FastAPI Backend: http://localhost:8000"
echo "- Mock DFX Replica: http://localhost:4943"
echo ""
echo "Services will continue running in the background"
echo "To view logs: tail -f backend_api.log or mock_dfx.log"
echo ""
