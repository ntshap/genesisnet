#!/usr/bin/env python3
"""
Mock DFX Replica Server
Simulates DFINITY dfx replica functionality for development purposes
"""

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json
import time
import uuid
import base64
from datetime import datetime

# Try to import cbor2 for proper CBOR encoding
try:
    import cbor2
    HAS_CBOR = True
    print("CBOR2 library available - using proper CBOR encoding")
except ImportError:
    HAS_CBOR = False
    print("CBOR2 library not available - falling back to JSON encoding")
    print("To install: pip install cbor2")

app = Flask(__name__)
# Configure CORS to allow all origins for all routes
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Mock canister IDs from dfx.json
CANISTER_IDS = {
    "data_requester": "rdmx6-jaaaa-aaaaa-aaadq-cai",
    "data_provider": "rrkah-fqaaa-aaaaa-aaaaq-cai", 
    "reputation_agent": "rno2w-sqaaa-aaaaa-aaacq-cai",
    "ledger": "ryjl3-tyaaa-aaaaa-aaaba-cai"  # ICP ledger canister
}

# Mock data storage dengan saldo default yang lebih besar untuk demo
mock_data = {
    "requests": [],
    "providers": [],
    "reputation_scores": {},
    "transactions": [],
    "balances": {
        "default": 10000000000,        # 100 ICP in e8s untuk user wallet
        "data_requester": 100000000000,  # 1000 ICP in e8s untuk Data Requester Agent
        "data_provider": 50000000000,    # 500 ICP in e8s untuk Data Provider Agent
        "system_reserve": 1000000000000  # 10000 ICP in e8s untuk system reserve
    }
}

def encode_cbor_response(data):
    """
    Encode response data properly for CBOR compatibility.
    Falls back to JSON encoding if CBOR is not available.
    """
    if HAS_CBOR:
        try:
            # For ICP ledger responses, we need to encode as CBOR bytes
            # Make sure to handle BigInt-like numbers properly
            if isinstance(data, dict):
                # Convert large numbers to int if they exist
                processed_data = {}
                for key, value in data.items():
                    if key == "e8s" and isinstance(value, (int, str)):
                        # Ensure e8s values are integers
                        processed_data[key] = int(value)
                    elif isinstance(value, dict):
                        # Recursively process nested dictionaries
                        sub_processed = {}
                        for sub_key, sub_value in value.items():
                            if sub_key == "e8s" and isinstance(sub_value, (int, str)):
                                sub_processed[sub_key] = int(sub_value)
                            else:
                                sub_processed[sub_key] = sub_value
                        processed_data[key] = sub_processed
                    else:
                        processed_data[key] = value
                data = processed_data
            elif isinstance(data, (int, str)):
                data = int(data)
            
            cbor_bytes = cbor2.dumps(data)
            return base64.b64encode(cbor_bytes).decode()
        except Exception as e:
            print(f"CBOR encoding failed: {e}, falling back to JSON")
    
    # Fallback to JSON encoding
    return base64.b64encode(json.dumps(data).encode()).decode()

@app.route('/api/v2/status', methods=['GET'])
def status():
    """Health check endpoint"""
    return jsonify({
        "replica_health_status": "healthy",
        "version": "0.15.2-mock",
        "impl_version": "mock-replica",
        "impl_hash": "mock-hash",
        "root_key": "mock-root-key"
    })

# Handle preflight OPTIONS requests
@app.route('/api/v2/canister/<canister_id>/query', methods=['OPTIONS'])
def handle_canister_query_options(canister_id):
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response

# Handle preflight OPTIONS requests
@app.route('/api/v2/canister/<canister_id>/read_state', methods=['OPTIONS'])
def handle_canister_read_state_options(canister_id):
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response

# Handle the canister query endpoint
@app.route('/api/v2/canister/<canister_id>/query', methods=['POST'])
def canister_query(canister_id):
    # Handle various content types including CBOR
    try:
        data = {}
        if request.content_type and 'application/json' in request.content_type:
            data = request.json if request.json else {}
        elif request.content_type and 'application/cbor' in request.content_type:
            # For CBOR requests, try to decode if possible
            print(f"Received CBOR request for canister {canister_id}")
            data = {"method_name": "account_balance"}  # Default assumption for CBOR requests
        else:
            # Try to parse as JSON first
            try:
                data = json.loads(request.data.decode('utf-8')) if request.data else {}
            except:
                # If not valid JSON and not empty, assume it's a binary format like CBOR
                if request.data:
                    print(f"Received non-JSON binary data for canister {canister_id}")
                    # Try to determine method by examining the request size or pattern
                    data_size = len(request.data)
                    print(f"Binary request size: {data_size} bytes")
                    
                    # Small requests are likely transfer_fee calls
                    if data_size < 100:
                        data = {"method_name": "transfer_fee"}
                        print("Assuming transfer_fee call based on small request size")
                    else:
                        data = {"method_name": "account_balance"}
                        print("Assuming account_balance call based on larger request size")
                else:
                    data = {}
    except Exception as e:
        print(f"Error parsing request data: {e}")
        # For ICP ledger canister, assume account_balance for error cases
        if canister_id == "ryjl3-tyaaa-aaaaa-aaaba-cai":
            data = {"method_name": "account_balance"}
        else:
            data = {}
    
    # Log the incoming request
    print(f"Query request for canister {canister_id}: {data}")
    
    # ICP Ledger mock response
    if canister_id == "ryjl3-tyaaa-aaaaa-aaaba-cai":
        method_name = data.get("method_name", "")
        
        if method_name == "icrc1_balance_of" or method_name == "account_balance":
            # Return a mock balance in the correct format for ICP
            balance_e8s = mock_data["balances"]["default"]
            balance_structure = {
                "e8s": balance_e8s
            }
            response = {
                "status": "replied",
                "reply": {
                    "arg": encode_cbor_response(balance_structure)  # Return proper Tokens structure
                }
            }
            return jsonify(response)
        
        if method_name == "icrc1_fee" or method_name == "transfer_fee":
            # Return a mock fee in the correct ICP ledger format
            fee_e8s = 10000  # 0.0001 ICP
            fee_structure = {
                "transfer_fee": {
                    "e8s": fee_e8s
                }
            }
            response = {
                "status": "replied",
                "reply": {
                    "arg": encode_cbor_response(fee_structure)  # Return proper structure
                }
            }
            return jsonify(response)
            
    # Generic response for other canister calls
    return jsonify({
        "status": "replied",
        "reply": {
            "arg": encode_cbor_response({"success": True})
        }
    })

# Handle the canister read_state endpoint
@app.route('/api/v2/canister/<canister_id>/read_state', methods=['POST'])
def canister_read_state(canister_id):
    # Mock response for read_state
    return jsonify({
        "certificate": base64.b64encode(json.dumps({
            "tree": {
                "subnet": {
                    "keys": ["mock-subnet-key"]
                }
            }
        }).encode()).decode()
    })

if __name__ == '__main__':
    print("Starting Mock DFX Replica Server...")
    print(f"Canister IDs: {CANISTER_IDS}")
    print("Server running on http://localhost:4943")
    app.run(host='0.0.0.0', port=4943, debug=True)
