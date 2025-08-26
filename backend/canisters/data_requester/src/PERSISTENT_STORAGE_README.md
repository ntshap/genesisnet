# Data Requester Agent - Persistent Storage Implementation

This document describes the persistent storage implementation for the Data Requester Agent using ICP (Internet Computer Protocol) stable memory.

## Overview

The persistent storage system replaces the previous in-memory storage with a robust, persistent solution that survives canister upgrades and restarts. This implementation uses ICP stable memory to ensure data persistence across all canister lifecycle events.

## Architecture

### Core Components

1. **StableMemorySimulator** - Simulates ICP stable memory for development and testing
2. **PersistentStorage** - Abstract base class defining the storage interface
3. **StableMemoryStorage** - Concrete implementation using ICP stable memory
4. **LogsStorage** - Specialized storage for application logs
5. **MetricsStorage** - Specialized storage for performance metrics

### Data Models

- **LogEntry** - Structured log entries with timestamp, level, message, and transaction ID
- **MetricsData** - Performance metrics including transactions, pricing, and network data

## Features

### Data Persistence
- **Stable Memory Integration**: Uses ICP stable memory for true persistence
- **Automatic Serialization**: JSON-based serialization for complex data structures
- **Memory Management**: Efficient memory allocation and deallocation
- **Upgrade Safety**: Data survives canister upgrades and restarts

### Enhanced Logging
- **Structured Logging**: Consistent log format with metadata
- **Log Levels**: Support for INFO, WARNING, ERROR, DEBUG levels
- **Transaction Tracking**: Optional transaction ID for request tracing
- **Filtering**: Query logs by level, time range, or transaction ID
- **Automatic Cleanup**: Configurable log retention policies

### Advanced Metrics
- **Real-time Metrics**: Live performance monitoring
- **Aggregated Data**: Automatic calculation of averages and totals
- **Network Monitoring**: Latency and throughput tracking
- **Transaction Analytics**: Success rates and pricing analysis
- **Storage Statistics**: Memory usage and performance metrics

### Reliability Features
- **Error Handling**: Comprehensive error recovery mechanisms
- **Data Validation**: Input validation and sanitization
- **Concurrent Access**: Thread-safe operations
- **Backup and Recovery**: Data integrity protection
- **Migration Support**: Seamless upgrade from in-memory storage

## Usage

### Basic Implementation

```python
from stable_storage import (
    logs_storage_persistent,
    metrics_storage_persistent,
    get_storage_statistics
)

# Add a log entry
logs_storage_persistent.add_log(
    "Data request processed successfully",
    "INFO",
    transaction_id="req_12345"
)

# Update metrics
metrics_storage_persistent.update_transaction_metrics(
    price=25.50,
    success=True
)

# Get current metrics
metrics = metrics_storage_persistent.get_metrics()
print(f"Total transactions: {metrics[''totalTransactions'']}")

# Get storage statistics
stats = get_storage_statistics()
print(f"Memory usage: {stats[''memory_usage'']}")
```

### Advanced Usage

```python
# Query logs with filtering
recent_errors = logs_storage_persistent.get_logs(
    limit=50,
    level_filter="ERROR"
)

# Update network metrics
metrics_storage_persistent.update_network_latency(150)  # ms
metrics_storage_persistent.increment_data_purchased(5)  # units

# Get aggregated metrics
metrics = metrics_storage_persistent.get_metrics()
print(f"Average price: ${metrics[''averagePricePerDataUnit'']:.2f}")
print(f"Success rate: {metrics[''successRate'']:.2%}")
```

## Migration from In-Memory Storage

### Automatic Migration

The system includes automatic migration utilities:

```python
from stable_storage import migrate_from_memory_storage

# Migrate existing in-memory data
old_logs = [...]  # Your existing logs
old_metrics = {...}  # Your existing metrics

migrate_from_memory_storage(old_logs, old_metrics)
```

### Manual Migration Steps

1. **Backup Existing Data**
   ```python
   # Export current data
   backup_logs = list(existing_logs)
   backup_metrics = dict(existing_metrics)
   ```

2. **Initialize Persistent Storage**
   ```python
   from stable_storage import logs_storage_persistent, metrics_storage_persistent
   ```

3. **Migrate Data**
   ```python
   # Migrate logs
   for log in backup_logs:
       logs_storage_persistent.add_log(
           log["message"],
           log["level"],
           log.get("transaction_id")
       )
   
   # Migrate metrics
   for key, value in backup_metrics.items():
       # Update metrics based on your data structure
       pass
   ```

4. **Verify Migration**
   ```python
   # Check migrated data
   migrated_logs = logs_storage_persistent.get_logs()
   migrated_metrics = metrics_storage_persistent.get_metrics()
   
   print(f"Migrated {len(migrated_logs)} logs")
   print(f"Migrated metrics: {migrated_metrics}")
   ```

## Configuration

### Storage Limits

```python
# Configure storage limits (in stable_storage.py)
MAX_LOGS = 10000  # Maximum number of log entries
MAX_LOG_SIZE = 1000  # Maximum characters per log message
METRICS_RETENTION_DAYS = 30  # Metrics retention period
```

### Memory Management

```python
# Configure memory allocation
INITIAL_MEMORY_SIZE = 1024 * 1024  # 1MB initial allocation
MEMORY_GROWTH_FACTOR = 2  # Memory growth multiplier
MAX_MEMORY_SIZE = 100 * 1024 * 1024  # 100MB maximum
```

## API Reference

### LogsStorage

#### Methods

- `add_log(message: str, level: str, transaction_id: Optional[str] = None)`
  - Add a new log entry
  - **Parameters**: message, log level, optional transaction ID
  - **Returns**: None

- `get_logs(limit: Optional[int] = None, level_filter: Optional[str] = None) -> List[Dict]`
  - Retrieve log entries with optional filtering
  - **Parameters**: limit (max entries), level filter
  - **Returns**: List of log dictionaries

- `clear_logs()`
  - Clear all log entries
  - **Returns**: None

- `get_log_count() -> int`
  - Get total number of log entries
  - **Returns**: Integer count

### MetricsStorage

#### Methods

- `update_transaction_metrics(price: float, success: bool)`
  - Update transaction-related metrics
  - **Parameters**: transaction price, success status
  - **Returns**: None

- `update_network_latency(latency_ms: int)`
  - Update network latency metrics
  - **Parameters**: latency in milliseconds
  - **Returns**: None

- `increment_data_purchased(amount: int)`
  - Increment data purchased counter
  - **Parameters**: amount of data units
  - **Returns**: None

- `get_metrics() -> Dict[str, Any]`
  - Get current aggregated metrics
  - **Returns**: Dictionary with all metrics

- `reset_metrics()`
  - Reset all metrics to initial values
  - **Returns**: None

### Utility Functions

- `get_storage_statistics() -> Dict[str, Any]`
  - Get comprehensive storage statistics
  - **Returns**: Dictionary with memory usage, counts, and performance data

- `migrate_from_memory_storage(logs: List, metrics: Dict)`
  - Migrate data from in-memory storage
  - **Parameters**: existing logs and metrics
  - **Returns**: None

## Testing

### Running Tests

```bash
# Run the test suite
python test_persistent_storage.py
```

### Test Coverage

The test suite covers:
- **Basic Operations**: Add, retrieve, update operations
- **Data Persistence**: Verify data survives restarts
- **Error Handling**: Invalid input and edge cases
- **Performance**: Memory usage and operation speed
- **Concurrency**: Thread-safe operations
- **Migration**: Data migration from legacy systems

### Custom Tests

```python
# Example custom test
def test_custom_scenario():
    # Add test logs
    logs_storage_persistent.add_log("Test message", "INFO")
    
    # Verify storage
    logs = logs_storage_persistent.get_logs()
    assert len(logs) > 0
    assert logs[-1]["message"] == "Test message"
    
    print("Custom test passed!")

test_custom_scenario()
```

## Performance Considerations

### Memory Usage
- **Efficient Serialization**: Optimized JSON encoding/decoding
- **Lazy Loading**: Data loaded on demand
- **Memory Pooling**: Reuse of memory allocations
- **Garbage Collection**: Automatic cleanup of unused data

### Operation Speed
- **Indexed Access**: Fast lookup for recent entries
- **Batch Operations**: Efficient bulk data operations
- **Caching**: In-memory cache for frequently accessed data
- **Asynchronous I/O**: Non-blocking storage operations

### Scalability
- **Horizontal Scaling**: Support for multiple storage instances
- **Data Partitioning**: Distribute data across memory segments
- **Load Balancing**: Distribute operations across resources
- **Auto-scaling**: Dynamic resource allocation

## Production Deployment

### Pre-deployment Checklist

1. **Data Backup**: Ensure all critical data is backed up
2. **Testing**: Run comprehensive test suite
3. **Configuration**: Verify all configuration parameters
4. **Monitoring**: Set up monitoring and alerting
5. **Documentation**: Update operational documentation

### Deployment Steps

1. **Deploy Storage Module**
   ```bash
   # Deploy the stable_storage.py module
   dfx deploy --network ic
   ```

2. **Initialize Storage**
   ```python
   # Initialize persistent storage
   from stable_storage import logs_storage_persistent, metrics_storage_persistent
   ```

3. **Migrate Data** (if upgrading)
   ```python
   # Run migration scripts
   migrate_from_memory_storage(existing_logs, existing_metrics)
   ```

4. **Verify Deployment**
   ```python
   # Test basic operations
   logs_storage_persistent.add_log("Deployment successful", "INFO")
   stats = get_storage_statistics()
   print(f"Deployment verified: {stats}")
   ```

### Monitoring

```python
# Set up monitoring
@agent.on_interval(period=300.0)  # Every 5 minutes
async def monitor_storage(ctx: Context):
    stats = get_storage_statistics()
    
    # Check memory usage
    if stats["memory_usage_percent"] > 80:
        logs_storage_persistent.add_log(
            f"High memory usage: {stats[''memory_usage_percent'']}%",
            "WARNING"
        )
    
    # Check error rates
    metrics = metrics_storage_persistent.get_metrics()
    if metrics["successRate"] < 0.95:
        logs_storage_persistent.add_log(
            f"Low success rate: {metrics[''successRate'']:.2%}",
            "WARNING"
        )
```

## Troubleshooting

### Common Issues

#### Memory Allocation Errors
```python
# Check available memory
stats = get_storage_statistics()
if stats["memory_usage_percent"] > 90:
    # Clear old logs
    logs_storage_persistent.clear_logs()
    print("Memory cleared")
```

#### Data Corruption
```python
# Verify data integrity
try:
    logs = logs_storage_persistent.get_logs(limit=1)
    metrics = metrics_storage_persistent.get_metrics()
    print("Data integrity verified")
except Exception as e:
    print(f"Data corruption detected: {e}")
    # Implement recovery procedures
```

#### Performance Issues
```python
# Monitor operation performance
import time

start_time = time.time()
logs_storage_persistent.add_log("Performance test", "INFO")
end_time = time.time()

if (end_time - start_time) > 0.1:  # 100ms threshold
    print(f"Slow operation detected: {end_time - start_time:.3f}s")
```

### Debug Mode

```python
# Enable debug logging
DEBUG_MODE = True

if DEBUG_MODE:
    logs_storage_persistent.add_log("Debug mode enabled", "DEBUG")
    
    # Log all operations
    def debug_log(operation, data):
        logs_storage_persistent.add_log(
            f"DEBUG: {operation} - {data}",
            "DEBUG"
        )
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Machine learning-based anomaly detection
   - Predictive analytics for resource usage
   - Advanced data visualization

2. **Enhanced Security**
   - Data encryption at rest
   - Access control and authentication
   - Audit logging and compliance

3. **Performance Optimizations**
   - Compression algorithms for storage efficiency
   - Advanced caching strategies
   - Query optimization

4. **Integration Features**
   - External database connectors
   - Real-time data streaming
   - API gateway integration

### Contributing

To contribute to the persistent storage implementation:

1. **Fork the Repository**
2. **Create Feature Branch**
3. **Implement Changes**
4. **Add Tests**
5. **Update Documentation**
6. **Submit Pull Request**

### Support

For support and questions:
- **Documentation**: Refer to this README
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

---

**Last Updated**: August 2025  
**Version**: 1.0.0  
**Compatibility**: ICP Stable Memory API v2.0+
