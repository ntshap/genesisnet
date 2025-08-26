from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import get_db
from auth import get_current_user, create_access_token

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@router.post("/register", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user with the email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with required fields from the model
    db_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=user.password,  # In a real app, this would be hashed
        wallet_address=None,
        reputation_score=5.0  # Default value
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login to get access token"""
    # Find user with the provided username (which is actually email in our frontend)
    user = db.query(models.User).filter(models.User.email == credentials.username).first()
    
    # Check if user exists and password is correct
    if not user or credentials.password != user.password_hash:  # In a real app, this would use proper verification
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_user(user_update: schemas.UserCreate, 
                current_user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    """Update current user profile"""
    # Update allowed fields
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.username:
        current_user.username = user_update.username
    
    # Update password if provided
    if user_update.password:
        current_user.hashed_password = models.User.get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db),
              current_user: models.User = Depends(get_current_user)):
    """Get list of users (admin only)"""
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db),
             current_user: models.User = Depends(get_current_user)):
    """Get user by ID (admin only or own profile)"""
    # Allow users to view their own profile or admins to view any profile
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
