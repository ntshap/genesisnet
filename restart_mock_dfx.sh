#!/bin/bash

# Navigate to the project directory
cd /home/dministrator/genesisnet-main/1genesisnet-main

# Find and kill any process using port 4943
echo "Checking for processes using port 4943..."
pid=$(lsof -ti:4943)
if [ ! -z "$pid" ]; then
    echo "Killing process $pid using port 4943..."
    kill -9 $pid
else
    echo "No process found using port 4943"
fi

# Wait a moment to ensure the port is released
sleep 2

# Navigate to backend directory
cd backend

# Activate the virtual environment if it exists
if [ -d "dfx_venv" ]; then
    echo "Activating virtual environment..."
    source dfx_venv/bin/activate
else
    echo "Virtual environment not found. Creating one..."
    python3 -m venv dfx_venv
    source dfx_venv/bin/activate
    pip install flask flask-cors
fi

# Start the mock DFX replica
echo "Starting mock DFX replica..."
python3 mock_dfx_replica.py
