#!/bin/bash

echo "=========================================="
echo "  GenesisNet Backend Services Status Check"
echo "=========================================="
echo ""

# Get absolute workspace directory
WORKSPACE_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$WORKSPACE_DIR"

# Define colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    timeout 1 bash -c "</dev/tcp/localhost/$1" &> /dev/null
    return $?
}

# Function to display status
show_status() {
    if [ "$2" = "UP" ]; then
        echo -e "  $1: ${GREEN}UP${NC} (port $3)"
    else
        echo -e "  $1: ${RED}DOWN${NC} (port $3)"
    fi
}

# Check FastAPI Backend
echo "Checking backend services:"
if check_port 8000; then
    # Make an HTTP request to the API to verify it's actually running
    response=$(curl -s http://localhost:8000/)
    if [[ "$response" == *"GenesisNet API"* ]]; then
        show_status "FastAPI Backend" "UP" "8000"
        api_status="UP"
    else
        show_status "FastAPI Backend" "DOWN" "8000 (responds but may not be correct service)"
        api_status="DOWN"
    fi
else
    show_status "FastAPI Backend" "DOWN" "8000"
    api_status="DOWN"
fi

# Check Mock DFX Replica
if check_port 4943; then
    # Make an HTTP request to verify it's the DFX replica
    response=$(curl -s http://localhost:4943/api/v2/status)
    if [[ "$response" == *"replica_health_status"* ]]; then
        show_status "Mock DFX Replica" "UP" "4943"
        dfx_status="UP"
    else
        show_status "Mock DFX Replica" "DOWN" "4943 (responds but may not be correct service)"
        dfx_status="DOWN"
    fi
else
    show_status "Mock DFX Replica" "DOWN" "4943"
    dfx_status="DOWN"
fi

echo ""
echo "API Endpoints:"
if [ "$api_status" = "UP" ]; then
    # Check some key API endpoints
    echo "  Testing /api/users/users/register:"
    result=$(curl -s -X POST http://localhost:8000/api/users/users/register -H "Content-Type: application/json" -d '{"username":"testcheck", "email":"testcheck@example.com", "password":"testcheck"}')
    if [[ "$result" == *"username"* ]]; then
        echo -e "    ${GREEN}Working${NC}"
    else
        echo -e "    ${RED}Not working${NC}: $result"
    fi
    
    echo "  Testing /api/users/users/login:"
    result=$(curl -s -X POST http://localhost:8000/api/users/users/login -H "Content-Type: application/json" -d '{"username":"testcheck", "password":"testcheck"}')
    if [[ "$result" == *"access_token"* ]]; then
        echo -e "    ${GREEN}Working${NC}"
    else
        echo -e "    ${YELLOW}Issue${NC}: $result"
    fi
else
    echo -e "  ${RED}API not available to test endpoints${NC}"
fi

echo ""
echo "DFX Mock Status:"
if [ "$dfx_status" = "UP" ]; then
    # Get canister IDs
    canister_ids=$(curl -s http://localhost:4943/api/v2/status | grep -o '"root_key"')
    if [[ -n "$canister_ids" ]]; then
        echo -e "  ${GREEN}Mock canisters are available${NC}"
    else
        echo -e "  ${YELLOW}Mock DFX response might be incomplete${NC}"
    fi
else
    echo -e "  ${RED}Mock DFX not available${NC}"
fi

echo ""
echo "=========================================="
if [ "$api_status" = "UP" ] && [ "$dfx_status" = "UP" ]; then
    echo -e "${GREEN}All critical backend services are running!${NC}"
    echo -e "You can now start the frontend with: ./start_frontend.sh"
else
    echo -e "${RED}Some backend services are not running properly${NC}"
    echo -e "Try running: ./start_all_backend.sh"
fi
echo "=========================================="
echo ""
