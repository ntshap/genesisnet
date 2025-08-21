import sqlite3
import os

def create_database_tables():
    # Remove existing database if exists
    db_file = "genesisnet_working.db"
    if os.path.exists(db_file):
        os.remove(db_file)
    
    # Create new database connection
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    try:
        # Create users table
        cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            wallet_address VARCHAR(100) UNIQUE,
            reputation_score REAL DEFAULT 5.0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create data_requests table
        cursor.execute("""
        CREATE TABLE data_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            requester_id INTEGER NOT NULL,
            data_type VARCHAR(100) NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requester_id) REFERENCES users (id)
        )
        """)
        
        # Create data_provisions table
        cursor.execute("""
        CREATE TABLE data_provisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_id INTEGER NOT NULL,
            request_id INTEGER NOT NULL,
            data_hash VARCHAR(255) NOT NULL,
            price REAL NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (provider_id) REFERENCES users (id),
            FOREIGN KEY (request_id) REFERENCES data_requests (id)
        )
        """)
        
        # Create transactions table
        cursor.execute("""
        CREATE TABLE transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_user_id INTEGER NOT NULL,
            to_user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            transaction_type VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            transaction_hash VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (from_user_id) REFERENCES users (id),
            FOREIGN KEY (to_user_id) REFERENCES users (id)
        )
        """)
        
        # Create network_nodes table
        cursor.execute("""
        CREATE TABLE network_nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id VARCHAR(100) UNIQUE NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            port INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'active',
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # Create network_metrics table
        cursor.execute("""
        CREATE TABLE network_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id INTEGER NOT NULL,
            cpu_usage REAL,
            memory_usage REAL,
            bandwidth_usage REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (node_id) REFERENCES network_nodes (id)
        )
        """)
        
        # Create reputation_history table
        cursor.execute("""
        CREATE TABLE reputation_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            old_score REAL NOT NULL,
            new_score REAL NOT NULL,
            reason VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """)
        
        # Commit changes
        conn.commit()
        
        # Verify tables were created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(" Database tables created successfully!")
        print(f"\nCreated {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
            
        print(f"\nDatabase file: {db_file}")
        print(f"Database size: {os.path.getsize(db_file)} bytes")
        
        return True
        
    except Exception as e:
        print(f" Error creating tables: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_database_tables()
