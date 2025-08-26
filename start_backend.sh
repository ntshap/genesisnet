#!/bin/bash

echo "Starting GenesisNet Backend"

# Navigate to backend directory
cd "$(dirname "$0")/backend/api"

# Check if python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python not found!"
    exit 1
fi

# Check if database exists, if not create it
if [ ! -f "genesisnet.db" ]; then
    echo "Creating database..."
    $PYTHON_CMD create_tables.py
fi

# Run the backend server
echo "Starting API server..."
$PYTHON_CMD -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
