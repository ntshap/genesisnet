from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
import asyncio
from datetime import datetime, timedelta
import random

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter()

# WebSocket connection manager for real-time metrics
class MetricsConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.metrics_task = None
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Start metrics broadcasting if this is the first connection
        if len(self.active_connections) == 1:
            self.metrics_task = asyncio.create_task(self.broadcast_metrics())
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            
        # Stop metrics broadcasting if no connections
        if len(self.active_connections) == 0 and self.metrics_task:
            self.metrics_task.cancel()
            self.metrics_task = None
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                disconnected.append(connection)
        
        # Remove disconnected connections
        for connection in disconnected:
            self.disconnect(connection)
    
    async def broadcast_metrics(self):
        """Continuously broadcast metrics data every 5 seconds"""
        while self.active_connections:
            try:
                # Generate mock metrics data
                metrics_data = {
                    "type": "metrics",
                    "payload": {
                        "totalNodes": random.randint(50, 100),
                        "activeConnections": random.randint(20, 80),
                        "dataTransferred": round(random.uniform(100, 1000), 2),
                        "networkLatency": random.randint(10, 100),
                        "timestamp": datetime.now().isoformat()
                    }
                }
                
                await self.broadcast(json.dumps(metrics_data))
                await asyncio.sleep(5)  # Send metrics every 5 seconds
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error broadcasting metrics: {e}")
                await asyncio.sleep(5)

manager = MetricsConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time metrics"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle ping messages
            if message.get("type") == "ping":
                await manager.send_personal_message(
                    json.dumps({"type": "pong", "timestamp": datetime.now().isoformat()}),
                    websocket
                )
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

@router.get("/metrics", response_model=Dict[str, Any])
async def get_current_metrics(db: Session = Depends(get_db)):
    """Get current system metrics"""
    try:
        # In a real implementation, these would come from actual system monitoring
        metrics = {
            "totalNodes": random.randint(50, 100),
            "activeConnections": random.randint(20, 80),
            "dataTransferred": round(random.uniform(100, 1000), 2),
            "networkLatency": random.randint(10, 100),
            "uptime": "24h 15m",
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": metrics
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metrics: {str(e)}")

@router.get("/network-data", response_model=Dict[str, Any])
async def get_network_data(db: Session = Depends(get_db)):
    """Get network topology and connection data"""
    try:
        # Generate mock network data
        network_data = []
        for i in range(10):
            network_data.append({
                "id": f"node_{i}",
                "type": random.choice(["provider", "requester", "validator"]),
                "connections": random.randint(1, 5),
                "status": random.choice(["active", "idle", "busy"]),
                "location": {
                    "x": random.randint(0, 800),
                    "y": random.randint(0, 600)
                },
                "timestamp": datetime.now().isoformat()
            })
        
        return {
            "success": True,
            "data": network_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get network data: {str(e)}")

@router.get("/logs", response_model=Dict[str, Any])
async def get_system_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Get system logs"""
    try:
        # Generate mock log data
        logs = []
        log_types = ["info", "warning", "error", "success"]
        log_messages = [
            "Node connected to network",
            "Data transfer completed",
            "New data provider registered",
            "Transaction processed",
            "Network latency spike detected",
            "Reputation score updated",
            "WebSocket connection established"
        ]
        
        for i in range(min(limit, 50)):
            logs.append({
                "id": f"log_{i}",
                "type": random.choice(log_types),
                "message": random.choice(log_messages),
                "timestamp": (datetime.now() - timedelta(minutes=i)).isoformat(),
                "source": random.choice(["network", "api", "websocket", "database"])
            })
        
        return {
            "success": True,
            "data": logs
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get logs: {str(e)}")

@router.get("/wallet-info", response_model=Dict[str, Any])
async def get_wallet_info(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get wallet information for current user"""
    try:
        # In a real implementation, this would fetch actual wallet data
        wallet_info = {
            "balance": round(random.uniform(0, 1000), 2),
            "address": f"wallet_{current_user.id}_{random.randint(1000, 9999)}",
            "transactions": [
                {
                    "id": f"tx_{i}",
                    "type": random.choice(["deposit", "withdrawal", "payment", "reward"]),
                    "amount": round(random.uniform(1, 100), 2),
                    "timestamp": (datetime.now() - timedelta(hours=i)).isoformat(),
                    "status": random.choice(["completed", "pending", "failed"])
                }
                for i in range(5)
            ]
        }
        
        return {
            "success": True,
            "data": wallet_info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get wallet info: {str(e)}")

@router.post("/add-funds", response_model=Dict[str, Any])
async def add_funds(amount: float, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add funds to user wallet"""
    try:
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")
        
        # In a real implementation, this would process actual payment
        transaction = {
            "id": f"tx_{random.randint(10000, 99999)}",
            "type": "deposit",
            "amount": amount,
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }
        
        return {
            "success": True,
            "message": f"Successfully added {amount} to wallet",
            "data": transaction
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add funds: {str(e)}")
