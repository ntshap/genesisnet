"""Data Requester Agent with Persistent Storage

Enhanced version of the Data Requester Agent that uses ICP stable memory
for persistent storage of logs and metrics instead of in-memory storage.
"""

from uagents import Agent, Context, Model
from typing import Dict, List, Any, Optional
import time
import random
import asyncio

# Import persistent storage components
from stable_storage import (
    logs_storage_persistent,
    metrics_storage_persistent,
    migrate_from_memory_storage,
    get_storage_statistics
)

# Message Models
class DataOfferMessage(Model):
    provider_address: str
    data_type: str
    price: float
    quality_score: float
    availability: bool
    metadata: Dict[str, Any]

class LogMessage(Model):
    timestamp: float
    message: str
    level: str
    transaction_id: Optional[str] = None

class MetricMessage(Model):
    metric_name: str
    value: float
    timestamp: float

class NetworkDataMessage(Model):
    node_id: str
    data_type: str
    timestamp: float
    value: Any

# Initialize the agent
agent = Agent(
    name="data_requester_persistent",
    port=8001,
    seed="data_requester_persistent_seed",
    endpoint=["http://127.0.0.1:8001/submit"]
)

# Network data storage (keeping this in-memory for now)
network_data_storage: List[Dict[str, Any]] = []

# Helper function to calculate offer score
def calculate_offer_score(offer: Dict[str, Any]) -> float:
    """Calculate a score for data offers based on price and quality"""
    try:
        price = offer.get("price", 0)
        quality = offer.get("quality_score", 0)
        availability = offer.get("availability", False)
        
        # Simple scoring algorithm (can be enhanced)
        if not availability:
            return 0
        
        # Lower price and higher quality = better score
        if price > 0:
            score = (quality * 100) / price
        else:
            score = quality * 100
        
        return min(score, 100)  # Cap at 100
    except Exception as e:
        logs_storage_persistent.add_log(f"Error calculating offer score: {e}", "ERROR")
        return 0

@agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize persistent storage and log startup"""
    ctx.logger.info("Data Requester Agent with Persistent Storage starting up...")
    
    # Log startup
    logs_storage_persistent.add_log("Data Requester Agent started with persistent storage", "INFO")
    
    # Get initial storage statistics
    stats = get_storage_statistics()
    ctx.logger.info(f"Storage initialized - {stats}")
    
    # Start periodic data search
    ctx.logger.info("Starting periodic data search...")

async def start_data_search(ctx: Context):
    """Start searching for data providers"""
    try:
        search_criteria = {
            "data_type": "market_data",
            "max_price": 50.0,
            "min_quality": 0.7,
            "required_fields": ["timestamp", "price", "volume"]
        }
        
        logs_storage_persistent.add_log(
            f"Starting data search with criteria: {search_criteria}",
            "INFO"
        )
        
        # Simulate broadcasting search request
        ctx.logger.info(f"Broadcasting data search request: {search_criteria}")
        
        # Update metrics
        metrics_storage_persistent.update_network_latency(random.randint(100, 500))
        
    except Exception as e:
        logs_storage_persistent.add_log(f"Error in data search: {e}", "ERROR")
        ctx.logger.error(f"Data search failed: {e}")

@agent.on_message(model=DataOfferMessage)
async def handle_data_offer(ctx: Context, sender: str, msg: DataOfferMessage):
    """Handle incoming data offers from providers"""
    try:
        offer_data = {
            "provider_address": msg.provider_address,
            "data_type": msg.data_type,
            "price": msg.price,
            "quality_score": msg.quality_score,
            "availability": msg.availability,
            "metadata": msg.metadata,
            "timestamp": time.time(),
            "sender": sender
        }
        
        # Calculate offer score
        score = calculate_offer_score(offer_data)
        offer_data["calculated_score"] = score
        
        # Log the offer
        transaction_id = f"offer_{int(time.time())}_{random.randint(1000, 9999)}"
        logs_storage_persistent.add_log(
            f"Received data offer from {sender}: {msg.data_type} at ${msg.price} (score: {score:.2f})",
            "INFO",
            transaction_id
        )
        
        # Store in network data
        network_data_storage.append(offer_data)
        
        # Evaluate if this is a good offer
        if score > 50 and msg.availability:
            await evaluate_and_purchase_best_offer(ctx, [offer_data])
        
        ctx.logger.info(f"Processed offer from {sender} with score {score:.2f}")
        
    except Exception as e:
        logs_storage_persistent.add_log(f"Error handling data offer: {e}", "ERROR")
        ctx.logger.error(f"Failed to handle data offer: {e}")

async def evaluate_and_purchase_best_offer(ctx: Context, offers: List[Dict[str, Any]]):
    """Evaluate offers and purchase the best one"""
    try:
        if not offers:
            return
        
        # Sort offers by calculated score
        sorted_offers = sorted(offers, key=lambda x: x.get("calculated_score", 0), reverse=True)
        best_offer = sorted_offers[0]
        
        if best_offer["calculated_score"] > 60:  # Threshold for purchase
            # Simulate purchase
            transaction_id = f"purchase_{int(time.time())}_{random.randint(1000, 9999)}"
            
            logs_storage_persistent.add_log(
                f"Purchasing data from {best_offer['provider_address']} for ${best_offer['price']}",
                "INFO",
                transaction_id
            )
            
            # Update transaction metrics
            metrics_storage_persistent.update_transaction_metrics(
                best_offer["price"],
                success=True
            )
            
            # Increment data purchased counter
            metrics_storage_persistent.increment_data_purchased(1)
            
            ctx.logger.info(f"Purchased data from {best_offer['provider_address']}")
            
            # Simulate data delivery
            await handle_data_delivery(ctx, best_offer, transaction_id)
        
    except Exception as e:
        logs_storage_persistent.add_log(f"Error in offer evaluation: {e}", "ERROR")
        ctx.logger.error(f"Offer evaluation failed: {e}")

async def handle_data_delivery(ctx: Context, offer: Dict[str, Any], transaction_id: str):
    """Handle data delivery from provider"""
    try:
        # Simulate data processing
        await asyncio.sleep(0.1)  # Simulate processing time
        
        # Log successful delivery
        logs_storage_persistent.add_log(
            f"Data delivered successfully from {offer['provider_address']}",
            "INFO",
            transaction_id
        )
        
        # Update network latency metric
        latency = random.randint(50, 300)
        metrics_storage_persistent.update_network_latency(latency)
        
        ctx.logger.info(f"Data delivery completed for transaction {transaction_id}")
        
    except Exception as e:
        logs_storage_persistent.add_log(
            f"Error in data delivery: {e}",
            "ERROR",
            transaction_id
        )
        ctx.logger.error(f"Data delivery failed: {e}")

# Query handlers for external access
@agent.on_query(model=dict)
async def get_logs(ctx: Context, sender: str, msg: dict):
    """Get logs with optional filtering"""
    try:
        limit = msg.get("limit")
        level_filter = msg.get("level")
        
        logs = logs_storage_persistent.get_logs(limit=limit, level_filter=level_filter)
        
        return {
            "logs": logs,
            "total_count": len(logs),
            "timestamp": time.time()
        }
    except Exception as e:
        ctx.logger.error(f"Error retrieving logs: {e}")
        return {"error": str(e)}

@agent.on_query(model=dict)
async def get_metrics(ctx: Context, sender: str, msg: dict):
    """Get current metrics"""
    try:
        metrics = metrics_storage_persistent.get_metrics()
        return metrics
    except Exception as e:
        ctx.logger.error(f"Error retrieving metrics: {e}")
        return {"error": str(e)}

@agent.on_query(model=dict)
async def get_network_data(ctx: Context, sender: str, msg: dict):
    """Get network data"""
    try:
        limit = msg.get("limit", 100)
        data_type = msg.get("data_type")
        
        filtered_data = network_data_storage
        if data_type:
            filtered_data = [d for d in network_data_storage if d.get("data_type") == data_type]
        
        return {
            "network_data": filtered_data[-limit:],
            "total_count": len(filtered_data),
            "timestamp": time.time()
        }
    except Exception as e:
        ctx.logger.error(f"Error retrieving network data: {e}")
        return {"error": str(e)}

@agent.on_query(model=dict)
async def get_storage_stats(ctx: Context, sender: str, msg: dict):
    """Get comprehensive storage statistics"""
    try:
        stats = get_storage_statistics()
        return {
            "storage_statistics": stats,
            "network_data_count": len(network_data_storage),
            "timestamp": time.time()
        }
    except Exception as e:
        ctx.logger.error(f"Error retrieving storage stats: {e}")
        return {"error": str(e)}

# Periodic tasks
@agent.on_interval(period=30.0)
async def periodic_data_search(ctx: Context):
    """Periodically search for new data"""
    await start_data_search(ctx)

@agent.on_interval(period=60.0)
async def periodic_metrics_update(ctx: Context):
    """Periodically update metrics and log status"""
    try:
        # Get current metrics
        current_metrics = metrics_storage_persistent.get_metrics()
        
        # Log periodic status
        logs_storage_persistent.add_log(
            f"Periodic status - Transactions: {current_metrics['totalTransactions']}, "
            f"Avg Price: ${current_metrics['averagePricePerDataUnit']:.2f}, "
            f"Success Rate: {current_metrics['successRate']:.2%}",
            "INFO"
        )
        
        # Update network latency with current measurement
        current_latency = random.randint(100, 400)
        metrics_storage_persistent.update_network_latency(current_latency)
        
        ctx.logger.info(f"Periodic metrics update completed")
        
    except Exception as e:
        logs_storage_persistent.add_log(f"Error in periodic metrics update: {e}", "ERROR")
        ctx.logger.error(f"Periodic metrics update failed: {e}")

if __name__ == "__main__":
    print("Starting Data Requester Agent with Persistent Storage...")
    print("Features:")
    print("- Persistent logs storage using ICP stable memory")
    print("- Persistent metrics storage with automatic aggregation")
    print("- Enhanced error handling and recovery")
    print("- Real-time storage statistics")
    print("- Backward compatibility with existing APIs")
    print()
    
    # Log startup in persistent storage
    logs_storage_persistent.add_log("Data Requester Agent with persistent storage initialized", "INFO")
    
    agent.run()
