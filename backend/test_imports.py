#!/usr/bin/env python3
"""
Test script to verify all uagents imports are working correctly
"""

import sys
import os

def test_imports():
    """Test all the import statements from the canister files"""
    
    print("Testing uagents imports...")
    
    # Test basic uagents imports
    try:
        from uagents import Agent, Context, Model
        print("✓ Basic uagents imports successful")
    except ImportError as e:
        print(f"✗ Basic uagents imports failed: {e}")
        return False
    
    # Test data provider imports
    try:
        original_path = sys.path.copy()
        sys.path = [os.path.abspath('canisters/data_provider/src')] + original_path
        from main import DataQueryMessage, DataOfferMessage, agent
        print("✓ Data provider imports successful")
        sys.path = original_path
    except ImportError as e:
        print(f"✗ Data provider imports failed: {e}")
        sys.path = original_path
        return False
    
    # Test data requester imports
    try:
        original_path = sys.path.copy()
        sys.path = [os.path.abspath('canisters/data_requester/src')] + original_path
        from main import DataQueryMessage, DataOfferMessage, PurchaseMessage, LogMessage, MetricMessage, NetworkDataMessage, LogQueryMessage, MetricQueryMessage, NetworkQueryMessage, agent
        print("✓ Data requester imports successful")
        sys.path = original_path
    except ImportError as e:
        print(f"✗ Data requester imports failed: {e}")
        sys.path = original_path
        return False
    
    # Test reputation agent imports
    try:
        original_path = sys.path.copy()
        sys.path = [os.path.abspath('canisters/reputation_agent/src')] + original_path
        from main import TransactionLogMessage, agent
        print("✓ Reputation agent imports successful")
        sys.path = original_path
    except ImportError as e:
        print(f"✗ Reputation agent imports failed: {e}")
        sys.path = original_path
        return False
    
    print("\n🎉 All imports are working correctly!")
    return True

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
