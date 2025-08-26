from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Dict, Any
import json
from datetime import datetime, timedelta

import models
import schemas
from database import get_db
from auth import get_current_user
from network import fetch_network_status, get_canister_status

router = APIRouter(
    prefix="/network",
    tags=["network"],
    responses={404: {"description": "Not found"}}
)

@router.get("/visualization", response_model=schemas.NetworkVisualizationData)
def get_network_visualization(current_user: models.User = Depends(get_current_user),
                             db: Session = Depends(get_db)):
    """
    Get network visualization data including nodes and connections
    """
    try:
        # Get data providers from database
        providers = db.query(models.DataProvider).filter(
            models.DataProvider.is_active == True
        ).all()
        
        # Transform to network nodes
        nodes = []
        # Add requester node (the user)
        nodes.append({
            "id": "requester", 
            "name": "Data Requester Agent", 
            "type": "requester", 
            "status": "active", 
            "fx": 400, 
            "fy": 300
        })
        
        # Add provider nodes
        for provider in providers:
            nodes.append({
                "id": f"provider{provider.id}",
                "name": provider.name,
                "type": "provider",
                "reputation": provider.reputation_score,
                "price": f"{provider.base_price} ICP",
                "status": provider.status,
                "location": provider.location,
                "dataTypes": json.loads(provider.data_types)
            })
        
        # Get active connections
        connections = db.query(models.NetworkConnection).filter(
            models.NetworkConnection.is_active == True,
            models.NetworkConnection.user_id == current_user.id
        ).all()
        
        # Transform to network links
        links = []
        for conn in connections:
            provider = db.query(models.DataProvider).filter(
                models.DataProvider.id == conn.provider_id
            ).first()
            
            if provider:
                links.append({
                    "source": "requester",
                    "target": f"provider{provider.id}",
                    "strength": conn.strength,
                    "status": conn.status,
                    "label": conn.connection_type
                })
        
        return {
            "nodes": nodes,
            "links": links,
            "success": True,
            "message": "Network visualization data retrieved successfully"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error retrieving network visualization data: {str(e)}")
        
        # Return a fallback or error
        return {
            "nodes": [],
            "links": [],
            "success": False,
            "message": f"Failed to retrieve network data: {str(e)}"
        }

@router.get("/metrics", response_model=schemas.NetworkMetricsResponse)
def get_network_metrics(current_user: models.User = Depends(get_current_user)):
    """
    Get real-time network metrics
    """
    try:
        # Get metrics from canisters or calculate from DB
        network_status = fetch_network_status()
        
        # Transform to metrics format
        metrics = {
            "totalTransactions": network_status.get("total_transactions", 0),
            "activeProviders": network_status.get("active_providers", 0),
            "averageResponseTime": network_status.get("avg_response_time", 0),
            "networkHealth": network_status.get("health_score", 0),
            "averagePricePerDataUnit": network_status.get("avg_price", 0),
            "successfulNegotiations": network_status.get("successful_negotiations", 0),
            "networkLatency": network_status.get("latency_ms", 0),
            "cpuUsage": network_status.get("cpu_usage", 0),
            "memoryUsage": network_status.get("memory_usage", 0),
            "networkIO": network_status.get("network_io", 0)
        }
        
        return {
            "metrics": metrics,
            "success": True,
            "message": "Network metrics retrieved successfully"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error retrieving network metrics: {str(e)}")
        
        # Return fallback metrics
        return {
            "metrics": {
                "totalTransactions": 42,
                "activeProviders": 4,
                "averageResponseTime": 1.2,
                "networkHealth": 95,
                "averagePricePerDataUnit": 15.5,
                "successfulNegotiations": 38,
                "networkLatency": 120,
                "cpuUsage": 65,
                "memoryUsage": 48,
                "networkIO": 72
            },
            "success": False,
            "message": f"Failed to retrieve metrics: {str(e)}"
        }

@router.post("/search", response_model=Dict[str, Any])
def search_data_providers(
    search_criteria: Dict[str, Any],
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for data providers matching criteria
    """
    try:
        # Basic query for data providers
        query = db.query(models.DataProvider).filter(
            models.DataProvider.is_active == True
        )
        
        # Apply filters based on search criteria
        if search_criteria.dataType:
            query = query.filter(models.DataProvider.data_types.contains(search_criteria.dataType))
            
        if search_criteria.location:
            query = query.filter(models.DataProvider.location == search_criteria.location)
            
        if search_criteria.minReputation:
            query = query.filter(models.DataProvider.reputation_score >= search_criteria.minReputation)
            
        if search_criteria.maxPrice:
            query = query.filter(models.DataProvider.base_price <= search_criteria.maxPrice)
        
        # Execute query
        providers = query.all()
        
        # Transform to response format
        results = []
        for provider in providers:
            results.append({
                "id": provider.id,
                "name": provider.name,
                "reputation": provider.reputation_score,
                "price": provider.base_price,
                "location": provider.location,
                "dataTypes": json.loads(provider.data_types),
                "responseTime": provider.avg_response_time,
                "availability": provider.availability_score
            })
        
        # Create search log
        search_log = models.SearchLog(
            user_id=current_user.id,
            search_criteria=json.dumps(search_criteria.dict()),
            results_count=len(results),
            timestamp=datetime.now()
        )
        db.add(search_log)
        db.commit()
        
        return {
            "results": results,
            "count": len(results),
            "success": True,
            "message": "Search completed successfully"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error searching data providers: {str(e)}")
        
        return {
            "results": [],
            "count": 0,
            "success": False,
            "message": f"Search failed: {str(e)}"
        }

@router.post("/search-public", response_model=Dict[str, Any])
def search_data_providers_public(
    search_criteria: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Public search for data providers - no authentication required (for testing)
    """
    try:
        print(f"Received search criteria: {search_criteria}")
        
        # Basic query for data providers
        query = db.query(models.DataProvider).filter(
            models.DataProvider.is_active == True
        )
        
        # Apply filters based on search criteria
        if 'data_type' in search_criteria and search_criteria['data_type']:
            data_type = search_criteria['data_type']
            query = query.filter(models.DataProvider.data_types.contains(data_type))
            
        if 'location' in search_criteria and search_criteria['location']:
            location = search_criteria['location']
            query = query.filter(models.DataProvider.location == location)
            
        if 'min_reputation' in search_criteria and search_criteria['min_reputation']:
            min_reputation = search_criteria['min_reputation']
            query = query.filter(models.DataProvider.reputation_score >= min_reputation)
            
        if 'max_price' in search_criteria and search_criteria['max_price']:
            max_price = search_criteria['max_price']
            query = query.filter(models.DataProvider.base_price <= max_price)
        
        # Execute query
        providers = query.all()
        
        # Transform to response format
        results = []
        for provider in providers:
            results.append({
                "id": provider.id,
                "name": provider.name,
                "reputation": provider.reputation_score,
                "price": provider.base_price,
                "location": provider.location,
                "dataTypes": json.loads(provider.data_types),
                "responseTime": provider.avg_response_time,
                "availability": provider.availability_score
            })
        
        return {
            "results": results,
            "count": len(results),
            "success": True,
            "message": "Search completed successfully"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error searching data providers: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return {
            "results": [],
            "count": 0,
            "success": False,
            "message": f"Search failed: {str(e)}"
        }

@router.get("/status", response_model=Dict[str, Any])
def get_network_status(current_user: models.User = Depends(get_current_user)):
    """
    Get the current status of the network and connected canisters
    """
    try:
        # Get status of canisters
        requester_status = get_canister_status("data_requester")
        provider_status = get_canister_status("data_provider")
        reputation_status = get_canister_status("reputation_agent")
        
        return {
            "status": {
                "requester": requester_status.get("status", "unknown"),
                "provider": provider_status.get("status", "unknown"),
                "reputation": reputation_status.get("status", "unknown"),
                "networkConnected": all([
                    requester_status.get("status") == "running",
                    provider_status.get("status") == "running",
                    reputation_status.get("status") == "running"
                ])
            },
            "success": True,
            "message": "Network status retrieved successfully"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error retrieving network status: {str(e)}")
        
        return {
            "status": {
                "requester": "unknown",
                "provider": "unknown",
                "reputation": "unknown",
                "networkConnected": False
            },
            "success": False,
            "message": f"Failed to retrieve network status: {str(e)}"
        }

@router.post("/negotiate", response_model=schemas.NegotiationResponse)
def negotiate_with_provider(
    negotiation: Dict[str, Any],
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initiate negotiation with a data provider
    """
    try:
        # Get provider
        provider = db.query(models.DataProvider).filter(
            models.DataProvider.id == negotiation.providerId
        ).first()
        
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found"
            )
        
        # Create negotiation record
        negotiation_record = models.Negotiation(
            user_id=current_user.id,
            provider_id=provider.id,
            proposed_price=negotiation.proposedPrice,
            data_request=json.dumps(negotiation.dataRequest),
            status="pending",
            created_at=datetime.now()
        )
        db.add(negotiation_record)
        db.commit()
        db.refresh(negotiation_record)
        
        # In a real system, we would now call the canister to initiate negotiation
        # For now we'll simulate the response
        
        # Simulate success/failure based on price difference
        price_difference = abs(provider.base_price - negotiation.proposedPrice)
        success_threshold = provider.base_price * 0.2  # 20% threshold
        
        if price_difference <= success_threshold:
            negotiation_record.status = "accepted"
            result = {
                "accepted": True,
                "counterOffer": None,
                "message": "Negotiation accepted",
                "finalPrice": negotiation.proposedPrice
            }
        else:
            # Counter offer
            counter_price = max(provider.base_price * 0.9, negotiation.proposedPrice * 1.1)
            negotiation_record.status = "counter_offer"
            negotiation_record.counter_price = counter_price
            result = {
                "accepted": False,
                "counterOffer": counter_price,
                "message": "Provider made a counter offer",
                "finalPrice": None
            }
        
        db.commit()
        
        return {
            "negotiationId": negotiation_record.id,
            "result": result,
            "success": True,
            "message": "Negotiation completed"
        }
        
    except Exception as e:
        # Log the error
        print(f"Error negotiating with provider: {str(e)}")
        
        return {
            "negotiationId": None,
            "result": {
                "accepted": False,
                "counterOffer": None,
                "message": "Negotiation failed",
                "finalPrice": None
            },
            "success": False,
            "message": f"Negotiation failed: {str(e)}"
        }
