#!/bin/bash

echo "Starting GenesisNet Full Stack"

# Make scripts executable
chmod +x start_backend.sh
chmod +x start_frontend.sh

# Start backend in background
./start_backend.sh &
BACKEND_PID=$!

# Wait for backend to initialize (5 seconds)
echo "Waiting for backend to initialize..."
sleep 5

# Start frontend
./start_frontend.sh

# When frontend is stopped, also stop backend
kill $BACKEND_PID
