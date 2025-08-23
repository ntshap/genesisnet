"""
Network utility functions for interacting with Internet Computer Protocol (ICP) canisters
and managing network status information.
"""

import json
import random
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import httpx
import asyncio
from fastapi import HTTPException, status

# Mock canister IDs for development - replace with actual canister IDs in production
CANISTER_IDS = {
    "data_provider": "rrkah-fqaaa-aaaaa-aaaaq-cai",
    "data_requester": "ryjl3-tyaaa-aaaaa-aaaba-cai",
    "reputation_agent": "r7inp-6aaaa-aaaaa-aaabq-cai",
}

# ICP API endpoint - replace with actual endpoint in production
ICP_API_ENDPOINT = "http://localhost:8000/api/v2/canister/"

# Cache for network status to avoid frequent requests
network_status_cache = {}
network_status_timestamp = None
CACHE_DURATION = timedelta(minutes=5)

async def call_canister(canister_id: str, method: str, args: Optional[Dict] = None) -> Dict[str, Any]:
    """
    Call a canister method on the Internet Computer
    
    Args:
        canister_id: The ID of the canister to call
        method: The method name to call
        args: Optional arguments to pass to the method
        
    Returns:
        The response from the canister
    """
    # In development/testing mode, return mock data
    if canister_id not in CANISTER_IDS.values():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid canister ID: {canister_id}"
        )
    
    # For now, return mock data based on the method
    if method == "get_status":
        return {
            "status": "running",
            "cycles": random.randint(1000000, 9999999),
            "memory_used": random.randint(1000, 9000),
            "last_updated": datetime.utcnow().isoformat()
        }
    elif method == "get_metrics":
        return {
            "total_transactions": random.randint(100, 500),
            "active_providers": random.randint(3, 10),
            "avg_response_time": round(random.uniform(0.5, 3.0), 2),
            "health_score": random.randint(85, 100),
            "latency_ms": random.randint(50, 200)
        }
    
    # In production, make actual API call to the canister
    """
    try:
        async with httpx.AsyncClient() as client:
            url = f"{ICP_API_ENDPOINT}{canister_id}/{method}"
            payload = args or {}
            
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error calling canister: {str(e)}"
        )
    """
    
    # Default mock response for unknown methods
    return {
        "success": True,
        "message": f"Mock response for {method}",
        "timestamp": datetime.utcnow().isoformat()
    }

async def get_canister_status(canister_id: str) -> Dict[str, Any]:
    """
    Get the status of a canister
    
    Args:
        canister_id: The ID of the canister
        
    Returns:
        The status information for the canister
    """
    return await call_canister(canister_id, "get_status")

async def fetch_network_status() -> Dict[str, Any]:
    """
    Fetch network status information from all canisters
    
    Returns:
        Combined network status information
    """
    global network_status_cache, network_status_timestamp
    
    # Check if cached data is still valid
    now = datetime.utcnow()
    if (network_status_timestamp and 
        network_status_timestamp + CACHE_DURATION > now and 
        network_status_cache):
        return network_status_cache
    
    # Fetch status from all canisters
    try:
        tasks = [
            call_canister(CANISTER_IDS["data_provider"], "get_metrics"),
            call_canister(CANISTER_IDS["data_requester"], "get_metrics"),
            call_canister(CANISTER_IDS["reputation_agent"], "get_metrics")
        ]
        
        results = await asyncio.gather(*tasks)
        
        # Combine results
        combined_status = {}
        for result in results:
            combined_status.update(result)
        
        # Add additional computed metrics
        combined_status.update({
            "avg_price": round(random.uniform(10, 30), 2),
            "successful_negotiations": random.randint(30, 100),
            "cpu_usage": random.randint(20, 80),
            "memory_usage": random.randint(30, 70),
            "network_io": random.randint(50, 100)
        })
        
        # Update cache
        network_status_cache = combined_status
        network_status_timestamp = now
        
        return combined_status
    
    except Exception as e:
        # If error occurs, return cached data if available, otherwise raise
        if network_status_cache:
            return network_status_cache
        
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error fetching network status: {str(e)}"
        )

def get_mock_network_visualization() -> Dict[str, Any]:
    """
    Generate mock network visualization data
    
    Returns:
        Network visualization data with nodes and links
    """
    # Create mock nodes
    nodes = [
        {
            "id": "requester",
            "name": "Data Requester Agent",
            "type": "requester",
            "status": "active",
            "fx": 400,
            "fy": 300
        }
    ]
    
    # Create mock provider nodes
    provider_types = ["weather", "financial", "health", "transportation", "social"]
    for i in range(1, 6):
        nodes.append({
            "id": f"provider{i}",
            "name": f"Provider {i}",
            "type": "provider",
            "dataType": random.choice(provider_types),
            "reputation": round(random.uniform(3.0, 5.0), 1),
            "price": f"{round(random.uniform(10, 50), 2)} ICP",
            "status": "active"
        })
    
    # Create mock links
    links = []
    connection_types = ["data_request", "blockchain", "reputation"]
    for i in range(1, 6):
        if random.random() > 0.3:  # 70% chance of connection
            links.append({
                "source": "requester",
                "target": f"provider{i}",
                "strength": round(random.uniform(0.1, 1.0), 2),
                "status": "active",
                "label": random.choice(connection_types)
            })
    
    return {
        "nodes": nodes,
        "links": links
    }

def simulate_negotiation(user_id: int, provider_id: int, proposed_price: float) -> Dict[str, Any]:
    """
    Simulate a price negotiation with a data provider
    
    Args:
        user_id: The ID of the user
        provider_id: The ID of the provider
        proposed_price: The price proposed by the user
        
    Returns:
        The negotiation result
    """
    # Randomly determine if provider accepts, counters, or rejects
    decision = random.choices(
        ["accept", "counter", "reject"], 
        weights=[0.4, 0.4, 0.2], 
        k=1
    )[0]
    
    if decision == "accept":
        return {
            "status": "accepted",
            "final_price": proposed_price,
            "message": "Provider accepted your offer"
        }
    elif decision == "counter":
        counter_price = round(proposed_price * random.uniform(1.1, 1.3), 2)
        return {
            "status": "counter_offer",
            "counter_price": counter_price,
            "message": f"Provider countered with {counter_price} ICP"
        }
    else:
        return {
            "status": "rejected",
            "message": "Provider rejected your offer"
        }
