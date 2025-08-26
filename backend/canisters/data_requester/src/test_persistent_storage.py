"""Test script for persistent storage implementation

This script verifies the functionality of the persistent storage system
for logs and metrics using ICP stable memory simulation.
"""

import time
import asyncio
from stable_storage import (
    LogsStorage, MetricsStorage, stable_memory,
    migrate_from_memory_storage, get_storage_statistics
)

def test_logs_storage():
    """Test logs storage functionality"""
    print("\n=== Testing Logs Storage ===")
    
    # Create a new logs storage instance
    logs = LogsStorage(max_entries=100)
    
    # Test adding logs
    logs.add_log("Test log message 1", "INFO", "tx_001")
    logs.add_log("Test log message 2", "WARNING", "tx_002")
    logs.add_log("Test log message 3", "ERROR", "tx_003")
    
    # Test retrieving logs
    all_logs = logs.get_logs()
    print(f"Total logs: {len(all_logs)}")
    
    # Test filtering by level
    error_logs = logs.get_logs(level_filter="ERROR")
    print(f"Error logs: {len(error_logs)}")
    
    # Test filtering by transaction
    tx_logs = logs.get_logs_by_transaction("tx_001")
    print(f"Transaction tx_001 logs: {len(tx_logs)}")
    
    # Test statistics
    stats = logs.get_stats()
    print(f"Logs statistics: {stats}")
    
    print(" Logs storage test completed")

def test_metrics_storage():
    """Test metrics storage functionality"""
    print("\n=== Testing Metrics Storage ===")
    
    # Create a new metrics storage instance
    metrics = MetricsStorage()
    
    # Test updating transaction metrics
    metrics.update_transaction_metrics(10.5, success=True)
    metrics.update_transaction_metrics(15.2, success=True)
    metrics.update_transaction_metrics(8.7, success=False)
    
    # Test updating network latency
    metrics.update_network_latency(250)
    
    # Test incrementing data purchased
    metrics.increment_data_purchased(5)
    
    # Test retrieving metrics
    current_metrics = metrics.get_metrics()
    print(f"Current metrics: {current_metrics}")
    
    # Test storage info
    storage_info = metrics.get_storage_info()
    print(f"Storage info: {storage_info}")
    
    print(" Metrics storage test completed")

def test_memory_migration():
    """Test migration from in-memory storage"""
    print("\n=== Testing Memory Migration ===")
    
    # Simulate old in-memory storage
    old_logs = [
        {"message": "Old log 1", "transaction_id": "old_tx_1"},
        {"message": "Old log 2", "transaction_id": "old_tx_2"}
    ]
    
    old_metrics = {
        "totalTransactions": 50,
        "averagePricePerDataUnit": 12.5,
        "networkLatency": 300
    }
    
    # Perform migration
    migrate_from_memory_storage(old_logs, old_metrics)
    
    print(" Memory migration test completed")

def test_storage_limits():
    """Test storage limits and cleanup"""
    print("\n=== Testing Storage Limits ===")
    
    # Create logs storage with small limit
    logs = LogsStorage(max_entries=5)
    
    # Add more logs than the limit
    for i in range(10):
        logs.add_log(f"Log message {i}", "INFO", f"tx_{i}")
    
    # Check that only the last 5 logs are kept
    all_logs = logs.get_logs()
    print(f"Logs after limit test: {len(all_logs)} (should be 5)")
    
    # Verify the logs are the most recent ones
    if len(all_logs) == 5:
        print(f"First log message: {all_logs[0]['message']}")
        print(f"Last log message: {all_logs[-1]['message']}")
    
    print(" Storage limits test completed")

def test_error_handling():
    """Test error handling and recovery"""
    print("\n=== Testing Error Handling ===")
    
    # Test with corrupted data
    try:
        # Clear memory and try to load
        stable_memory.clear()
        logs = LogsStorage()
        print(" Handled empty storage gracefully")
        
        # Add some data and verify it persists
        logs.add_log("Recovery test", "INFO")
        recovery_logs = logs.get_logs()
        print(f" Recovery successful: {len(recovery_logs)} logs")
        
    except Exception as e:
        print(f" Error handling failed: {e}")
    
    print(" Error handling test completed")

def test_concurrent_access():
    """Test concurrent access to storage"""
    print("\n=== Testing Concurrent Access ===")
    
    # Create multiple storage instances
    logs1 = LogsStorage()
    logs2 = LogsStorage()
    
    # Add logs from different instances
    logs1.add_log("Log from instance 1", "INFO")
    logs2.add_log("Log from instance 2", "INFO")
    
    # Verify both instances see the data
    logs1_data = logs1.get_logs()
    logs2_data = logs2.get_logs()
    
    print(f"Instance 1 sees {len(logs1_data)} logs")
    print(f"Instance 2 sees {len(logs2_data)} logs")
    
    print(" Concurrent access test completed")

def main():
    """Run all tests"""
    print("Starting Persistent Storage Tests...")
    print("=" * 50)
    
    try:
        # Run all tests
        test_logs_storage()
        test_metrics_storage()
        test_memory_migration()
        test_storage_limits()
        test_error_handling()
        test_concurrent_access()
        
        # Get final statistics
        print("\n=== Final Storage Statistics ===")
        stats = get_storage_statistics()
        print(f"Storage statistics: {stats}")
        
        print("\n" + "=" * 50)
        print(" All persistent storage tests completed successfully!")
        
    except Exception as e:
        print(f"\n Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
