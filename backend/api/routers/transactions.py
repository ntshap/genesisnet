from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
from datetime import datetime

import models
import schemas
from database import get_db
from auth import get_current_user

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=List[schemas.TransactionResponse])
def get_transactions(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all transactions for the current user
    """
    query = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    )
    
    if status:
        query = query.filter(models.Transaction.status == status)
    
    transactions = query.order_by(models.Transaction.created_at.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=schemas.TransactionResponse)
def get_transaction(
    transaction_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get transaction by ID
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction

@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction_create: schemas.TransactionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new transaction
    """
    # Get provider
    provider = db.query(models.DataProvider).filter(
        models.DataProvider.id == transaction_create.provider_id
    ).first()
    
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    # Check if there's a successful negotiation
    negotiation = db.query(models.Negotiation).filter(
        models.Negotiation.user_id == current_user.id,
        models.Negotiation.provider_id == provider.id,
        models.Negotiation.status.in_(["accepted", "completed"])
    ).order_by(models.Negotiation.created_at.desc()).first()
    
    # Determine price
    price = negotiation.final_price if negotiation else provider.base_price
    
    # Create transaction
    transaction = models.Transaction(
        user_id=current_user.id,
        provider_id=provider.id,
        amount=price,
        status="pending",
        transaction_type=transaction_create.transaction_type,
        data_request=json.dumps(transaction_create.data_request),
        created_at=datetime.now()
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    # Process transaction (in a real system, this would be done asynchronously)
    try:
        # Simulate payment processing
        # Check wallet balance
        wallet = db.query(models.Wallet).filter(
            models.Wallet.user_id == current_user.id
        ).first()
        
        if not wallet or wallet.balance < price:
            transaction.status = "failed"
            transaction.status_reason = "Insufficient funds"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient funds"
            )
        
        # Update wallet balance
        wallet.balance -= price
        
        # Update transaction status
        transaction.status = "processing"
        db.commit()
        
        # In a real system, we would now call the canister to process the transaction
        # and update the status when complete
        
    except Exception as e:
        transaction.status = "failed"
        transaction.status_reason = str(e)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transaction processing failed: {str(e)}"
        )
    
    return transaction

@router.get("/{transaction_id}/status", response_model=Dict[str, Any])
def get_transaction_status(
    transaction_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current status of a transaction
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # In a real system, we would check the canister for the latest status
    # For now, we just return the status from the database
    
    return {
        "status": transaction.status,
        "status_reason": transaction.status_reason,
        "updated_at": transaction.updated_at or transaction.created_at
    }

@router.post("/{transaction_id}/cancel", response_model=schemas.TransactionResponse)
def cancel_transaction(
    transaction_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a pending transaction
    """
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == current_user.id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    if transaction.status not in ["pending", "processing"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel transaction with status '{transaction.status}'"
        )
    
    # Update transaction status
    transaction.status = "cancelled"
    transaction.updated_at = datetime.now()
    
    # If already paid, refund to wallet
    if transaction.status == "processing":
        wallet = db.query(models.Wallet).filter(
            models.Wallet.user_id == current_user.id
        ).first()
        
        if wallet:
            wallet.balance += transaction.amount
    
    db.commit()
    db.refresh(transaction)
    
    return transaction

@router.get("/summary", response_model=Dict[str, Any])
def get_transaction_summary(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get summary of user's transactions
    """
    # Get total transactions
    total_count = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).count()
    
    # Get successful transactions
    successful_count = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.status == "completed"
    ).count()
    
    # Get total spent
    total_spent = db.query(
        db.func.sum(models.Transaction.amount)
    ).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.status == "completed"
    ).scalar() or 0
    
    # Get recent transactions
    recent_transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).order_by(models.Transaction.created_at.desc()).limit(5).all()
    
    return {
        "total_count": total_count,
        "successful_count": successful_count,
        "success_rate": (successful_count / total_count) if total_count > 0 else 0,
        "total_spent": total_spent,
        "recent_transactions": recent_transactions
    }

@router.post("/data-request", response_model=schemas.DataRequestResponse)
def request_data(
    data_request: schemas.DataRequestCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new data request
    """
    # Create data request record
    request = models.DataRequest(
        user_id=current_user.id,
        provider_id=data_request.provider_id,
        request_details=json.dumps(data_request.request_details),
        status="pending",
        created_at=datetime.now()
    )
    
    db.add(request)
    db.commit()
    db.refresh(request)
    
    # Create a transaction for this request
    transaction = models.Transaction(
        user_id=current_user.id,
        provider_id=data_request.provider_id,
        amount=data_request.price,
        status="pending",
        transaction_type="data_request",
        data_request_id=request.id,
        created_at=datetime.now()
    )
    
    db.add(transaction)
    db.commit()
    
    # In a real system, we would now call the canister to initiate the data request
    # For now, we'll just return the request ID
    
    return {
        "request_id": request.id,
        "transaction_id": transaction.id,
        "status": "pending",
        "message": "Data request created successfully"
    }

@router.get("/data-deliveries", response_model=List[Dict[str, Any]])
def get_data_deliveries(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get data deliveries for the current user
    """
    query = db.query(models.DataDelivery).filter(
        models.DataDelivery.user_id == current_user.id
    )
    
    if status:
        query = query.filter(models.DataDelivery.status == status)
    
    deliveries = query.order_by(models.DataDelivery.created_at.desc()).offset(skip).limit(limit).all()
    return deliveries
