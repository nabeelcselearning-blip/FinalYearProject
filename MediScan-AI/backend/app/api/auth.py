from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user_id
from app.models.database import User, Profile
from app.schemas.reports import UserCreate, UserLogin, Token, ProfileOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User email already registered.")

    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=user_in.email,
        full_name=user_in.full_name or user_in.email.split("@")[0].title(),
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    
    # Create default user profile
    profile = Profile(
        user_id=user_id,
        age=35,
        gender="male",
        height_cm=175.0,
        weight_kg=72.0,
        blood_group="O+",
        lifestyle="active",
        exercise_frequency="3-5_times",
        smoking_status="non_smoker",
        alcohol_consumption="none"
    )
    db.add(profile)
    db.commit()

    access_token = create_access_token(subject=user_id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user_id, "email": user.email, "full_name": user.full_name}
    }


@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not user.hashed_password or not verify_password(credentials.password, user.hashed_password):
        # Demo fallback for out-of-the-box instant login
        if credentials.email == "demo@mediscan.ai":
            token = create_access_token(subject="demo_user_123")
            return {
                "access_token": token,
                "token_type": "bearer",
                "user": {"id": "demo_user_123", "email": "demo@mediscan.ai", "full_name": "Demo User"}
            }
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(subject=user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "full_name": user.full_name}
    }


@router.get("/me")
def get_current_user(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"id": "demo_user_123", "email": "demo@mediscan.ai", "full_name": "Demo User"}
    return {"id": user.id, "email": user.email, "full_name": user.full_name}
