from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    wallet_address = Column(String(100), unique=True, nullable=True)
    reputation_score = Column(Float, default=5.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    data_requests = relationship("DataRequest", back_populates="requester")
    data_provisions = relationship("DataProvision", back_populates="provider")
    transactions = relationship("Transaction", back_populates="user")
    reputation_history = relationship("ReputationHistory", back_populates="user")

class DataRequest(Base):
    __tablename__ = "data_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_type = Column(String(100), nullable=False)
    criteria = Column(Text, nullable=True)  # JSON string
    max_price = Column(Float, nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    requester = relationship("User", back_populates="data_requests")
    provisions = relationship("DataProvision", back_populates="request")

class DataProvision(Base):
    __tablename__ = "data_provisions"
    
    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_id = Column(Integer, ForeignKey("data_requests.id"), nullable=True)
    data_hash = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    quality_score = Column(Float, default=5.0)
    status = Column(String(20), default="available")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    provider = relationship("User", back_populates="data_provisions")
    request = relationship("DataRequest", back_populates="provisions")
    transactions = relationship("Transaction", back_populates="data_provision")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_provision_id = Column(Integer, ForeignKey("data_provisions.id"), nullable=False)
    transaction_hash = Column(String(255), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    data_provision = relationship("DataProvision", back_populates="transactions")

class NetworkNode(Base):
    __tablename__ = "network_nodes"
    
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(100), unique=True, nullable=False)
    node_type = Column(String(50), nullable=False)  # provider, requester, validator
    address = Column(String(255), nullable=True)
    status = Column(String(20), default="active")
    last_seen = Column(DateTime, default=datetime.utcnow)
    reputation = Column(Float, default=5.0)
    
    # Relationships
    metrics = relationship("NetworkMetric", back_populates="node")

class NetworkMetric(Base):
    __tablename__ = "network_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("network_nodes.id"), nullable=False)
    metric_type = Column(String(50), nullable=False)  # latency, throughput, uptime
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    node = relationship("NetworkNode", back_populates="metrics")

class ReputationHistory(Base):
    __tablename__ = "reputation_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    old_score = Column(Float, nullable=False)
    new_score = Column(Float, nullable=False)
    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reputation_history")
