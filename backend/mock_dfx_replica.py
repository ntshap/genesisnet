#!/usr/bin/env python3
"""
Mock DFX Replica Server
Simulates DFINITY dfx replica functionality for development purposes
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock canister IDs from dfx.json
CANISTER_IDS = {
    "data_requester": "rdmx6-jaaaa-aaaaa-aaadq-cai",
    "data_provider": "rrkah-fqaaa-aaaaa-aaaaq-cai", 
    "reputation_agent": "rno2w-sqaaa-aaaaa-aaacq-cai"
}

# Mock data storage
mock_data = {
    "requests": [],
    "providers": [],
    "reputation_scores": {},
    "transactions": []
}

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

if __name__ == '__main__':
    print("Starting Mock DFX Replica Server...")
    print(f"Canister IDs: {CANISTER_IDS}")
    print("Server running on http://localhost:4943")
    app.run(host='0.0.0.0', port=4943, debug=True)
