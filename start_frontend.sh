#!/bin/bash

echo "Starting GenesisNet Frontend"

# Navigate to project directory
cd "$(dirname "$0")"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm not found!"
    exit 1
fi

# Start frontend development server
echo "Starting frontend development server..."
npm run dev
