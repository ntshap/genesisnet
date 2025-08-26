#!/usr/bin/env python3
"""
Script untuk menambahkan sample data providers ke database GenesisNet
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

# Database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./genesisnet.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

Base = declarative_base()

# Define DataProvider model
class DataProvider(Base):
    __tablename__ = "data_providers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    data_types = Column(Text, default="[]")  # JSON array of data types
    location = Column(String(100), default="Global")
    base_price = Column(Float, default=0.0)
    reputation_score = Column(Float, default=5.0)
    availability_score = Column(Float, default=1.0)
    avg_response_time = Column(String(50), default="< 1 second")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_sample_data():
    """Create sample data providers"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(DataProvider).count()
        if existing_count > 0:
            print(f"Found {existing_count} existing data providers. Skipping creation.")
            return
        
        # Sample data providers
        sample_providers = [
            {
                "name": "WeatherPro Global",
                "description": "Premium weather data provider with global coverage",
                "data_types": json.dumps(["weather", "climate"]),
                "location": "Global",
                "base_price": 2.5,
                "reputation_score": 9.2,
                "availability_score": 0.98,
                "avg_response_time": "< 500ms"
            },
            {
                "name": "FinanceStream Analytics",
                "description": "Real-time financial market data and analytics",
                "data_types": json.dumps(["financial", "market"]),
                "location": "New York",
                "base_price": 5.8,
                "reputation_score": 8.7,
                "availability_score": 0.95,
                "avg_response_time": "< 1 second"
            },
            {
                "name": "HealthData Network",
                "description": "Anonymized health statistics and medical research data",
                "data_types": json.dumps(["health", "medical"]),
                "location": "Europe",
                "base_price": 4.2,
                "reputation_score": 9.0,
                "availability_score": 0.97,
                "avg_response_time": "< 2 seconds"
            },
            {
                "name": "SocialTrends Monitor",
                "description": "Social media trends and sentiment analysis data",
                "data_types": json.dumps(["social", "trends"]),
                "location": "Global",
                "base_price": 1.8,
                "reputation_score": 7.9,
                "availability_score": 0.92,
                "avg_response_time": "< 3 seconds"
            },
            {
                "name": "ScientificData Hub",
                "description": "Research datasets from scientific institutions worldwide",
                "data_types": json.dumps(["scientific", "research"]),
                "location": "Global",
                "base_price": 3.7,
                "reputation_score": 9.5,
                "availability_score": 0.99,
                "avg_response_time": "< 1 second"
            },
            {
                "name": "Regional Weather Station",
                "description": "Local weather data with high precision for specific regions",
                "data_types": json.dumps(["weather", "local"]),
                "location": "Asia Pacific",
                "base_price": 1.9,
                "reputation_score": 8.3,
                "availability_score": 0.94,
                "avg_response_time": "< 800ms"
            }
        ]
        
        # Create and add providers
        for provider_data in sample_providers:
            provider = DataProvider(**provider_data)
            db.add(provider)
        
        # Commit changes
        db.commit()
        print(f"Successfully created {len(sample_providers)} sample data providers")
        
        # Verify creation
        total_providers = db.query(DataProvider).count()
        print(f"Total data providers in database: {total_providers}")
        
    except Exception as e:
        print(f"Error creating sample data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating sample data providers for GenesisNet...")
    create_sample_data()
    print("Done!")
