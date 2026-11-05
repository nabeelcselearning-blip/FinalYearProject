from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import Medication, User, Report
from app.schemas.medications import MedicationCreate, MedicationUpdate, MedicationOut, MedicationInteractionRequest
from app.services.medication_analysis_engine import analyze_medication_lab_interactions

router = APIRouter(prefix="/medications", tags=["Medications"])

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

@router.get("/", response_model=List[MedicationOut])
@router.get("", response_model=List[MedicationOut])
def get_user_medications(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    ensure_user_exists(user_id, db)
    return db.query(Medication).filter(Medication.user_id == user_id).order_by(Medication.created_at.desc()).all()

@router.post("/", response_model=MedicationOut)
@router.post("", response_model=MedicationOut)
def create_medication(
    med_in: MedicationCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    ensure_user_exists(user_id, db)
    medication = Medication(
        user_id=user_id,
        name=med_in.name,
        dosage=med_in.dosage,
        frequency=med_in.frequency,
        start_date=med_in.start_date,
        notes=med_in.notes
    )
    db.add(medication)
    db.commit()
    db.refresh(medication)
    return medication

@router.put("/{med_id}", response_model=MedicationOut)
def update_medication(
    med_id: int,
    med_in: MedicationUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    medication = db.query(Medication).filter(Medication.id == med_id, Medication.user_id == user_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication record not found.")

    update_data = med_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(medication, field, val)

    db.commit()
    db.refresh(medication)
    return medication

@router.delete("/{med_id}")
def delete_medication(
    med_id: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    medication = db.query(Medication).filter(Medication.id == med_id, Medication.user_id == user_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication record not found.")

    db.delete(medication)
    db.commit()
    return {"message": "Medication deleted successfully."}

@router.get("/analyze-latest")
def analyze_latest_interactions(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    ensure_user_exists(user_id, db)
    meds = db.query(Medication).filter(Medication.user_id == user_id).all()
    latest_report = db.query(Report).filter(Report.user_id == user_id).order_by(Report.upload_date.desc()).first()

    med_dicts = [{"name": m.name, "dosage": m.dosage} for m in meds]
    biomarker_dicts = []
    if latest_report:
        for b in latest_report.biomarkers:
            biomarker_dicts.append({
                "canonical_id": b.canonical_name.lower().replace(" ", "_"),
                "canonical_name": b.canonical_name,
                "value": b.value,
                "status": b.status
            })

    return analyze_medication_lab_interactions(med_dicts, biomarker_dicts)
