from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password

def get_user_by_username(db: Session, username: str):
    """Get a user by username."""
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    """Get a user by email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Get a user by ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user."""
    # Check if username or email already exists
    if get_user_by_username(db, user.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    if get_user_by_email(db, user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create a new user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def get_data_request(db: Session, request_id: int):
    """Get a data request by ID."""
    return db.query(models.DataRequest).filter(models.DataRequest.id == request_id).first()

def get_data_requests(db: Session, skip: int = 0, limit: int = 100, user_id: int = None):
    """Get all data requests, optionally filtered by user ID."""
    query = db.query(models.DataRequest)
    
    if user_id:
        query = query.filter(models.DataRequest.requester_id == user_id)
    
    return query.order_by(models.DataRequest.created_at.desc()).offset(skip).limit(limit).all()

def create_data_request(db: Session, data_request: schemas.DataRequestCreate, user_id: int):
    """Create a new data request."""
    db_request = models.DataRequest(
        requester_id=user_id,
        data_type=data_request.data_type,
        criteria=data_request.criteria,
        max_price=data_request.max_price,
        expires_at=data_request.expires_at
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request

def get_data_provision(db: Session, provision_id: int):
    """Get a data provision by ID."""
    return db.query(models.DataProvision).filter(models.DataProvision.id == provision_id).first()

def get_data_provisions(db: Session, skip: int = 0, limit: int = 100, user_id: int = None):
    """Get all data provisions, optionally filtered by user ID."""
    query = db.query(models.DataProvision)
    
    if user_id:
        query = query.filter(models.DataProvision.provider_id == user_id)
    
    return query.order_by(models.DataProvision.created_at.desc()).offset(skip).limit(limit).all()

def create_data_provision(db: Session, data_provision: schemas.DataProvisionCreate, user_id: int):
    """Create a new data provision."""
    db_provision = models.DataProvision(
        provider_id=user_id,
        request_id=data_provision.request_id,
        data_hash=data_provision.data_hash,
        price=data_provision.price,
        quality_score=data_provision.quality_score
    )
    
    db.add(db_provision)
    db.commit()
    db.refresh(db_provision)
    
    return db_provision

def get_transaction(db: Session, transaction_id: int):
    """Get a transaction by ID."""
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

def get_transactions(db: Session, skip: int = 0, limit: int = 100, user_id: int = None):
    """Get all transactions, optionally filtered by user ID."""
    query = db.query(models.Transaction)
    
    if user_id:
        query = query.filter(models.Transaction.user_id == user_id)
    
    return query.order_by(models.Transaction.created_at.desc()).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    """Create a new transaction."""
    # Generate a unique transaction hash
    import uuid
    transaction_hash = str(uuid.uuid4())
    
    db_transaction = models.Transaction(
        user_id=user_id,
        data_provision_id=transaction.data_provision_id,
        transaction_hash=transaction_hash,
        amount=transaction.amount,
        status="pending"
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

def get_network_metrics(db: Session):
    """Get network-wide metrics."""
    total_nodes = db.query(models.NetworkNode).count()
    total_providers = db.query(models.NetworkNode).filter(models.NetworkNode.node_type == "provider").count()
    total_requesters = db.query(models.NetworkNode).filter(models.NetworkNode.node_type == "requester").count()
    total_validators = db.query(models.NetworkNode).filter(models.NetworkNode.node_type == "validator").count()
    
    # Calculate average reputation
    from sqlalchemy import func
    avg_reputation = db.query(func.avg(models.NetworkNode.reputation)).scalar() or 0.0
    
    # Get transaction metrics
    total_transactions = db.query(models.Transaction).count()
    transaction_volume = db.query(func.sum(models.Transaction.amount)).scalar() or 0.0
    
    # Get active requests
    active_requests = db.query(models.DataRequest).filter(models.DataRequest.status == "pending").count()
    
    return {
        "total_nodes": total_nodes,
        "total_providers": total_providers,
        "total_requesters": total_requesters,
        "total_validators": total_validators,
        "average_reputation": float(avg_reputation),
        "total_transactions": total_transactions,
        "transaction_volume": float(transaction_volume),
        "active_requests": active_requests
    }

def update_user_reputation(db: Session, user_id: int, new_score: float, reason: str = None):
    """Update a user's reputation score and log the change."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    old_score = user.reputation_score
    user.reputation_score = new_score
    
    # Log the change
    reputation_log = models.ReputationHistory(
        user_id=user_id,
        old_score=old_score,
        new_score=new_score,
        reason=reason
    )
    
    db.add(reputation_log)
    db.commit()
    db.refresh(user)
    
    return user
