from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_complexity(cls, v):
        """Validate password complexity."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(UserBase):
    id: int
    reputation_score: float
    wallet_address: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Data Request Schemas
class DataRequestBase(BaseModel):
    data_type: str
    criteria: Optional[str] = None
    max_price: Optional[float] = None

class DataRequestCreate(DataRequestBase):
    expires_at: Optional[datetime] = None

class DataRequestResponse(DataRequestBase):
    id: int
    requester_id: int
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Data Provision Schemas
class DataProvisionBase(BaseModel):
    data_hash: str
    price: float
    quality_score: Optional[float] = 5.0

class DataProvisionCreate(DataProvisionBase):
    request_id: Optional[int] = None

class DataProvisionResponse(DataProvisionBase):
    id: int
    provider_id: int
    request_id: Optional[int] = None
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Transaction Schemas
class TransactionBase(BaseModel):
    data_provision_id: int
    amount: float

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    transaction_hash: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Network Node Schemas
class NetworkNodeBase(BaseModel):
    node_id: str
    node_type: str
    address: Optional[str] = None

class NetworkNodeCreate(NetworkNodeBase):
    pass

class NetworkNodeResponse(NetworkNodeBase):
    id: int
    status: str
    last_seen: datetime
    reputation: float
    
    class Config:
        orm_mode = True

# Network Metric Schemas
class NetworkMetricBase(BaseModel):
    metric_type: str
    value: float

class NetworkMetricCreate(NetworkMetricBase):
    node_id: int

class NetworkMetricResponse(NetworkMetricBase):
    id: int
    node_id: int
    timestamp: datetime
    
    class Config:
        orm_mode = True

# Reputation History Schemas
class ReputationHistoryBase(BaseModel):
    old_score: float
    new_score: float
    reason: Optional[str] = None

class ReputationHistoryCreate(ReputationHistoryBase):
    user_id: int

class ReputationHistoryResponse(ReputationHistoryBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Search and Query Schemas
class DataProviderSearch(BaseModel):
    data_type: Optional[str] = None
    min_reputation: Optional[float] = None
    max_price: Optional[float] = None
    location: Optional[str] = None

class NetworkVisualizationData(BaseModel):
    nodes: List[Dict[str, Any]]
    links: List[Dict[str, Any]]

class NetworkMetricsResponse(BaseModel):
    total_nodes: int
    total_providers: int
    total_requesters: int
    total_validators: int
    average_reputation: float
    total_transactions: int
    transaction_volume: float
    active_requests: int

class NegotiationCreate(BaseModel):
    provider_id: int
    proposed_price: float
    data_request: Dict[str, Any]

class NegotiationResponse(BaseModel):
    id: int
    user_id: int
    provider_id: int
    proposed_price: float
    counter_price: Optional[float] = None
    final_price: Optional[float] = None
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True
