"""Persistent Storage Implementation for ICP Stable Memory

This module provides persistent storage capabilities using ICP's stable memory
for logs_storage and metrics_storage, replacing the current in-memory storage.
"""

import json
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod

# ICP Stable Memory simulation (in production, this would use actual ICP stable memory APIs)
class StableMemorySimulator:
    """Simulates ICP stable memory for development/testing purposes"""
    
    def __init__(self):
        self._memory: Dict[str, bytes] = {}
        self._size_limit = 64 * 1024 * 1024  # 64MB limit simulation
        self._current_size = 0
    
    def read(self, offset: int, length: int) -> bytes:
        """Read data from stable memory at given offset"""
        key = f"offset_{offset}"
        if key in self._memory:
            data = self._memory[key]
            return data[:length] if len(data) > length else data
        return b''
    
    def write(self, offset: int, data: bytes) -> bool:
        """Write data to stable memory at given offset"""
        if self._current_size + len(data) > self._size_limit:
            return False  # Memory limit exceeded
        
        key = f"offset_{offset}"
        old_size = len(self._memory.get(key, b''))
        self._memory[key] = data
        self._current_size += len(data) - old_size
        return True
    
    def size(self) -> int:
        """Get current memory usage"""
        return self._current_size
    
    def clear(self):
        """Clear all memory (for testing)"""
        self._memory.clear()
        self._current_size = 0

# Global stable memory instance
stable_memory = StableMemorySimulator()

@dataclass
class LogEntry:
    """Structure for log entries"""
    timestamp: float
    message: str
    level: str = "INFO"
    source: str = "data_requester"
    transaction_id: Optional[str] = None

@dataclass
class MetricsData:
    """Structure for metrics data"""
    total_transactions: int = 0
    average_price_per_data_unit: float = 0.0
    network_latency: int = 0
    success_rate: float = 0.0
    total_data_purchased: int = 0
    last_updated: float = 0.0

class PersistentStorage(ABC):
    """Abstract base class for persistent storage"""
    
    @abstractmethod
    def save(self, data: Any) -> bool:
        """Save data to persistent storage"""
        pass
    
    @abstractmethod
    def load(self) -> Any:
        """Load data from persistent storage"""
        pass
    
    @abstractmethod
    def clear(self) -> bool:
        """Clear all stored data"""
        pass

class StableMemoryStorage(PersistentStorage):
    """Persistent storage implementation using ICP stable memory"""
    
    def __init__(self, storage_key: str, max_entries: int = 1000):
        self.storage_key = storage_key
        self.max_entries = max_entries
        self.offset = hash(storage_key) % 1000000  # Simple offset calculation
    
    def _serialize(self, data: Any) -> bytes:
        """Serialize data to bytes"""
        try:
            json_str = json.dumps(data, default=str)
            return json_str.encode('utf-8')
        except Exception as e:
            print(f"Serialization error: {e}")
            return b''
    
    def _deserialize(self, data: bytes) -> Any:
        """Deserialize bytes to data"""
        try:
            if not data:
                return None
            json_str = data.decode('utf-8')
            return json.loads(json_str)
        except Exception as e:
            print(f"Deserialization error: {e}")
            return None
    
    def save(self, data: Any) -> bool:
        """Save data to stable memory"""
        try:
            serialized_data = self._serialize(data)
            if not serialized_data:
                return False
            
            # Add metadata header
            metadata = {
                "timestamp": time.time(),
                "size": len(serialized_data),
                "version": "1.0"
            }
            metadata_bytes = self._serialize(metadata)
            
            # Combine metadata and data
            full_data = len(metadata_bytes).to_bytes(4, 'big') + metadata_bytes + serialized_data
            
            return stable_memory.write(self.offset, full_data)
        except Exception as e:
            print(f"Save error: {e}")
            return False
    
    def load(self) -> Any:
        """Load data from stable memory"""
        try:
            # Read metadata size first
            metadata_size_bytes = stable_memory.read(self.offset, 4)
            if len(metadata_size_bytes) < 4:
                return None
            
            metadata_size = int.from_bytes(metadata_size_bytes, 'big')
            
            # Read metadata
            metadata_bytes = stable_memory.read(self.offset + 4, metadata_size)
            metadata = self._deserialize(metadata_bytes)
            
            if not metadata:
                return None
            
            # Read actual data
            data_bytes = stable_memory.read(self.offset + 4 + metadata_size, metadata['size'])
            return self._deserialize(data_bytes)
        except Exception as e:
            print(f"Load error: {e}")
            return None
    
    def clear(self) -> bool:
        """Clear stored data"""
        try:
            return stable_memory.write(self.offset, b'')
        except Exception as e:
            print(f"Clear error: {e}")
            return False

class LogsStorage:
    """Persistent logs storage with automatic cleanup and indexing"""
    
    def __init__(self, max_entries: int = 1000):
        self.storage = StableMemoryStorage("logs_storage", max_entries)
        self.max_entries = max_entries
        self._cache: List[Dict] = []
        self._load_from_storage()
    
    def _load_from_storage(self):
        """Load logs from persistent storage"""
        try:
            stored_data = self.storage.load()
            if stored_data and isinstance(stored_data, list):
                self._cache = stored_data[-self.max_entries:]  # Keep only recent entries
            else:
                self._cache = []
        except Exception as e:
            print(f"Error loading logs: {e}")
            self._cache = []
    
    def add_log(self, message: str, level: str = "INFO", transaction_id: Optional[str] = None):
        """Add a new log entry"""
        log_entry = {
            "timestamp": time.time(),
            "message": message,
            "level": level,
            "source": "data_requester",
            "transaction_id": transaction_id
        }
        
        self._cache.append(log_entry)
        
        # Maintain max entries limit
        if len(self._cache) > self.max_entries:
            self._cache = self._cache[-self.max_entries:]
        
        # Save to persistent storage
        self.storage.save(self._cache)
    
    def get_logs(self, limit: Optional[int] = None, level_filter: Optional[str] = None) -> List[Dict]:
        """Get logs with optional filtering"""
        logs = self._cache.copy()
        
        if level_filter:
            logs = [log for log in logs if log.get('level') == level_filter]
        
        if limit:
            logs = logs[-limit:]
        
        return logs
    
    def get_logs_by_transaction(self, transaction_id: str) -> List[Dict]:
        """Get logs for a specific transaction"""
        return [log for log in self._cache if log.get('transaction_id') == transaction_id]
    
    def clear_logs(self) -> bool:
        """Clear all logs"""
        self._cache = []
        return self.storage.clear()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get logs statistics"""
        if not self._cache:
            return {"total_logs": 0, "levels": {}, "oldest_log": None, "newest_log": None}
        
        levels = {}
        for log in self._cache:
            level = log.get('level', 'UNKNOWN')
            levels[level] = levels.get(level, 0) + 1
        
        return {
            "total_logs": len(self._cache),
            "levels": levels,
            "oldest_log": self._cache[0]['timestamp'] if self._cache else None,
            "newest_log": self._cache[-1]['timestamp'] if self._cache else None
        }

class MetricsStorage:
    """Persistent metrics storage with automatic aggregation"""
    
    def __init__(self):
        self.storage = StableMemoryStorage("metrics_storage")
        self._metrics = MetricsData()
        self._load_from_storage()
    
    def _load_from_storage(self):
        """Load metrics from persistent storage"""
        try:
            stored_data = self.storage.load()
            if stored_data and isinstance(stored_data, dict):
                self._metrics = MetricsData(**stored_data)
            else:
                self._metrics = MetricsData()
        except Exception as e:
            print(f"Error loading metrics: {e}")
            self._metrics = MetricsData()
    
    def _save_to_storage(self):
        """Save current metrics to persistent storage"""
        self._metrics.last_updated = time.time()
        metrics_dict = asdict(self._metrics)
        self.storage.save(metrics_dict)
    
    def update_transaction_metrics(self, price: float, success: bool = True):
        """Update transaction-related metrics"""
        self._metrics.total_transactions += 1
        
        if success:
            # Update average price calculation
            current_total = self._metrics.average_price_per_data_unit * (self._metrics.total_transactions - 1)
            self._metrics.average_price_per_data_unit = (current_total + price) / self._metrics.total_transactions
            
            # Update success rate
            successful_transactions = self._metrics.success_rate * (self._metrics.total_transactions - 1) + 1
            self._metrics.success_rate = successful_transactions / self._metrics.total_transactions
        else:
            # Update success rate for failed transaction
            successful_transactions = self._metrics.success_rate * (self._metrics.total_transactions - 1)
            self._metrics.success_rate = successful_transactions / self._metrics.total_transactions
        
        self._save_to_storage()
    
    def update_network_latency(self, latency: int):
        """Update network latency metric"""
        self._metrics.network_latency = latency
        self._save_to_storage()
    
    def increment_data_purchased(self, amount: int = 1):
        """Increment total data purchased counter"""
        self._metrics.total_data_purchased += amount
        self._save_to_storage()
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics as dictionary"""
        return {
            "totalTransactions": self._metrics.total_transactions,
            "averagePricePerDataUnit": self._metrics.average_price_per_data_unit,
            "networkLatency": self._metrics.network_latency,
            "successRate": self._metrics.success_rate,
            "totalDataPurchased": self._metrics.total_data_purchased,
            "lastUpdated": self._metrics.last_updated
        }
    
    def reset_metrics(self) -> bool:
        """Reset all metrics to default values"""
        self._metrics = MetricsData()
        return self.storage.clear()
    
    def get_storage_info(self) -> Dict[str, Any]:
        """Get storage information"""
        return {
            "memory_usage": stable_memory.size(),
            "memory_limit": stable_memory._size_limit,
            "last_updated": self._metrics.last_updated
        }

# Global instances for backward compatibility
logs_storage_persistent = LogsStorage()
metrics_storage_persistent = MetricsStorage()

# Compatibility functions to replace the original lists/dicts
def get_logs_storage():
    """Get logs in the original format for backward compatibility"""
    return logs_storage_persistent.get_logs()

def add_to_logs_storage(message: str, transaction_id: Optional[str] = None):
    """Add log entry in the original format"""
    logs_storage_persistent.add_log(message, transaction_id=transaction_id)

def get_metrics_storage():
    """Get metrics in the original format for backward compatibility"""
    return metrics_storage_persistent.get_metrics()

def update_metrics_storage(key: str, value: Any):
    """Update metrics in the original format"""
    if key == "totalTransactions":
        # This is handled by update_transaction_metrics
        pass
    elif key == "networkLatency":
        metrics_storage_persistent.update_network_latency(value)
    elif key == "averagePricePerDataUnit":
        # This is calculated automatically in update_transaction_metrics
        pass

# Migration utilities
def migrate_from_memory_storage(old_logs: List[Dict], old_metrics: Dict[str, Any]):
    """Migrate data from old in-memory storage to persistent storage"""
    print("Migrating logs and metrics to persistent storage...")
    
    # Migrate logs
    for log in old_logs:
        logs_storage_persistent.add_log(
            message=log.get('message', ''),
            level="INFO",
            transaction_id=log.get('transaction_id')
        )
    
    # Migrate metrics
    if old_metrics:
        metrics_storage_persistent._metrics.total_transactions = old_metrics.get('totalTransactions', 0)
        metrics_storage_persistent._metrics.average_price_per_data_unit = old_metrics.get('averagePricePerDataUnit', 0.0)
        metrics_storage_persistent._metrics.network_latency = old_metrics.get('networkLatency', 0)
        metrics_storage_persistent._save_to_storage()
    
    print(f"Migration completed: {len(old_logs)} logs and metrics migrated")

def get_storage_statistics():
    """Get comprehensive storage statistics"""
    return {
        "logs": logs_storage_persistent.get_stats(),
        "metrics": metrics_storage_persistent.get_metrics(),
        "storage": metrics_storage_persistent.get_storage_info()
    }
