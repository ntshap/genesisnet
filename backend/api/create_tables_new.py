from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time

# Database URL - menggunakan SQLite untuk development
DATABASE_URL = "sqlite:///./genesisnet_test.db"

# Create SQLAlchemy engine dengan timeout
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
        "timeout": 20
    },
    pool_pre_ping=True,
    pool_recycle=300
)

# Create Base class
Base = declarative_base()

# Import models
from models import User, DataRequest, DataProvision, Transaction, NetworkNode, NetworkMetric, ReputationHistory

def create_tables():
    try:
        print("Creating database tables...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print(" Database tables created successfully!")
        print("\nCreated tables:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type=\'table\'"))
            tables = result.fetchall()
            print(f"\nVerified {len(tables)} tables in database")
            
        return True
    except Exception as e:
        print(f" Error creating tables: {e}")
        return False
    finally:
        # Ensure engine is disposed
        engine.dispose()

if __name__ == "__main__":
    create_tables()
