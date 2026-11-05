from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReminderBase(BaseModel):
    title: str
    description: Optional[str] = None
    reminder_type: str = "general" # lab_test, medication, doctor_appointment, water, exercise, sleep, general
    reminder_date: str # YYYY-MM-DD
    reminder_time: str # HH:MM
    repeat_option: str = "Once" # Once, Daily, Weekly, Monthly
    status: str = "Upcoming" # Upcoming, Completed, Missed

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reminder_type: Optional[str] = None
    reminder_date: Optional[str] = None
    reminder_time: Optional[str] = None
    repeat_option: Optional[str] = None
    status: Optional[str] = None

class ReminderOut(ReminderBase):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
