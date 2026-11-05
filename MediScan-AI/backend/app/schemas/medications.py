from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicationBase(BaseModel):
    name: str
    dosage: str # e.g. 500mg
    frequency: str # e.g. Once daily
    start_date: str # YYYY-MM-DD
    notes: Optional[str] = None

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[str] = None
    notes: Optional[str] = None

class MedicationOut(MedicationBase):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class MedicationInteractionRequest(BaseModel):
    medication_names: List[str]
