#!/bin/bash

# GenesisNet Fullstack Starter Script
# This script starts all components of the GenesisNet application

# Base directory
BASE_DIR="/home/dministrator/genesisnet-main/1genesisnet-main"
cd "$BASE_DIR"

echo "=== Starting GenesisNet Fullstack Application ==="

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
  return $?
}

# 1. Kill any existing processes on our ports
echo "Checking for existing processes..."
for port in 4943 8000; do
  if is_port_in_use "$port"; then
    echo "Killing process on port $port..."
    pid=$(lsof -ti:"$port")
    if [ ! -z "$pid" ]; then
      kill -9 "$pid"
      echo "Process $pid killed."
    fi
  fi
done

# Give processes time to shut down
sleep 2

# 2. Start the mock DFX replica in the background
echo "Starting mock DFX replica..."
cd "$BASE_DIR/backend"
if [ ! -d "dfx_venv" ]; then
    echo "Creating virtual environment for mock DFX replica..."
    python3 -m venv dfx_venv
    source dfx_venv/bin/activate
    pip install flask flask-cors
else
    source dfx_venv/bin/activate
fi
python3 mock_dfx_replica.py > "$BASE_DIR/dfx_replica.log" 2>&1 &
DFX_PID=$!
echo "Mock DFX replica started with PID $DFX_PID"

# 3. Start the FastAPI backend in the background
echo "Starting FastAPI backend..."
cd "$BASE_DIR/backend/api"
if [ ! -d "api_venv" ]; then
    echo "Creating virtual environment for FastAPI backend..."
    python3 -m venv api_venv
    source api_venv/bin/activate
    pip install -r requirements.txt
else
    source api_venv/bin/activate
fi
python main.py > "$BASE_DIR/api_backend.log" 2>&1 &
API_PID=$!
echo "FastAPI backend started with PID $API_PID"

# Wait for the backend services to be ready
sleep 5

# 4. Start the frontend (Vite/React)
echo "Starting frontend application..."
cd "$BASE_DIR"
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

echo "=== GenesisNet Fullstack Application Started ==="
echo "Frontend: http://localhost:4001"
echo "Backend API: http://localhost:8000"
echo "Mock DFX Replica: http://localhost:4943"
echo ""
echo "To stop all services, run: kill $DFX_PID $API_PID $FRONTEND_PID"
echo "Or run: pkill -f 'mock_dfx_replica.py|main.py|vite'"

# Store PIDs for later use
echo "$DFX_PID $API_PID $FRONTEND_PID" > "$BASE_DIR/app_pids.txt"
