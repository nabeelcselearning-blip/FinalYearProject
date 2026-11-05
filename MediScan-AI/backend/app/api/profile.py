from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import Profile, User
from app.schemas.reports import ProfileBase, ProfileOut
from datetime import datetime

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/", response_model=ProfileOut)
def get_user_profile(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        # Create default demo profile
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
            alcohol_consumption="none",
            allergies="None reported",
            chronic_diseases="None reported",
            family_medical_history="Mild hypertension in paternal lineage"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("/", response_model=ProfileOut)
def update_user_profile(profile_in: ProfileBase, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)

    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)

    profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    return profile
