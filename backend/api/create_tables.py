from database import engine, Base
from models import User, DataRequest, DataProvision, Transaction, NetworkNode, NetworkMetric, ReputationHistory

def create_tables():
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print(" Database tables created successfully!")
        print("\nCreated tables:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
        return True
    except Exception as e:
        print(f" Error creating tables: {e}")
        return False

if __name__ == "__main__":
    create_tables()
