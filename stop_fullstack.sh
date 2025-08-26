#!/bin/bash

# GenesisNet Fullstack Stop Script
# This script stops all components of the GenesisNet application

# Base directory
BASE_DIR="/home/dministrator/genesisnet-main/1genesisnet-main"
cd "$BASE_DIR"

echo "=== Stopping GenesisNet Fullstack Application ==="

# 1. Read PIDs from file if available
if [ -f "$BASE_DIR/app_pids.txt" ]; then
    PIDS=$(cat "$BASE_DIR/app_pids.txt")
    echo "Killing processes: $PIDS"
    kill -9 $PIDS 2>/dev/null
    rm "$BASE_DIR/app_pids.txt"
fi

# 2. Kill any remaining processes
echo "Ensuring all processes are stopped..."
pkill -f 'mock_dfx_replica.py' 2>/dev/null
pkill -f 'main.py' 2>/dev/null
pkill -f 'vite' 2>/dev/null

# 3. Check if ports are free
for port in 4943 8000 4000 4001; do
    if lsof -i:"$port" >/dev/null 2>&1; then
        echo "Warning: Port $port is still in use."
        lsof -i:"$port" | grep LISTEN
    else
        echo "Port $port is free."
    fi
done

echo "=== GenesisNet Fullstack Application Stopped ==="
