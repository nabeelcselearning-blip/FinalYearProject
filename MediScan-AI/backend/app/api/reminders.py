from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import Reminder, User
from app.schemas.reminders import ReminderCreate, ReminderUpdate, ReminderOut

router = APIRouter(prefix="/reminders", tags=["Health Reminders"])

def ensure_user_exists(user_id: str, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            email=f"{user_id}@mediscan.ai",
            full_name="Clinical User"
        )
        db.add(user)
        db.commit()

@router.get("/", response_model=List[ReminderOut])
@router.get("", response_model=List[ReminderOut])
def get_user_reminders(
    status: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    ensure_user_exists(user_id, db)
    query = db.query(Reminder).filter(Reminder.user_id == user_id)
    if status:
        st_clean = status.strip().lower()
        if st_clean in ("pending", "upcoming"):
            query = query.filter(Reminder.status != "Completed")
        else:
            query = query.filter(Reminder.status == status)
    return query.order_by(Reminder.reminder_date.asc(), Reminder.reminder_time.asc()).all()

@router.post("/", response_model=ReminderOut)
@router.post("", response_model=ReminderOut)
def create_reminder(
    reminder_in: ReminderCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    ensure_user_exists(user_id, db)
    reminder = Reminder(
        user_id=user_id,
        title=reminder_in.title,
        description=reminder_in.description,
        reminder_type=reminder_in.reminder_type,
        reminder_date=reminder_in.reminder_date,
        reminder_time=reminder_in.reminder_time,
        repeat_option=reminder_in.repeat_option,
        status=reminder_in.status
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder

@router.put("/{reminder_id}", response_model=ReminderOut)
def update_reminder(
    reminder_id: int,
    reminder_in: ReminderUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user_id).first()
    if not reminder:
        raise HTTPException(status_code=44, detail="Reminder not found.")

    update_data = reminder_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(reminder, field, val)

    db.commit()
    db.refresh(reminder)
    return reminder

@router.patch("/{reminder_id}/complete", response_model=ReminderOut)
def mark_reminder_complete(
    reminder_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")

    reminder.status = "Completed"
    db.commit()
    db.refresh(reminder)
    return reminder

@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found.")

    db.delete(reminder)
    db.commit()
    return {"message": "Reminder deleted successfully."}
