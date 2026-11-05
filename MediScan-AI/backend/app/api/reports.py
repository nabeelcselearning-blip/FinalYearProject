import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response, Query
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.database import Report, Biomarker, Profile, User, Medication
from app.schemas.reports import ReportOut, ComparisonResponse, BiomarkerDelta
from app.services.ocr_engine import process_document_ocr
from app.services.parser_engine import parse_medical_text, validate_is_medical_report
from app.services.rule_analysis_engine import analyze_all_biomarkers
from app.services.health_risk_calculator import calculate_health_risk_and_score
from app.services.groq_ai_service import generate_report_ai_summary, generate_report_comparison_summary
from app.services.pdf_generator import generate_report_pdf_bytes
from app.services.recommendation_engine import generate_followup_recommendations
from app.services.medication_analysis_engine import analyze_medication_lab_interactions

router = APIRouter(prefix="/reports", tags=["Lab Reports"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ReportOut)
@router.post("/upload/", response_model=ReportOut)
async def upload_lab_report(
    file: UploadFile = File(...),
    laboratory_name: Optional[str] = Form("Clinical Diagnostics"),
    environment: Optional[str] = Form(None),
    auto_ai_analysis: Optional[str] = Form("true"),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Ensure User record exists to satisfy ForeignKey("users.id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            email=f"{user_id}@mediscan.ai",
            full_name="Demo User" if user_id == "demo_user_123" else "Clinical User"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # File validation
    filename = file.filename or "report.pdf"
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported extensions: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    report_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{report_id}_{filename}")
    
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 15MB limit.")

    with open(save_path, "wb") as f:
        f.write(content)

    # 1. OCR Extraction
    ocr_text, confidence = process_document_ocr(save_path, ext)

    # 1.5 Document Type Validation (Reject non-medical uploads like internship reports, books, invoices)
    is_valid_report, val_reason = validate_is_medical_report(ocr_text)
    if not is_valid_report:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(
            status_code=400,
            detail=f"The uploaded document is not recognized as a medical lab report ({val_reason}). Please make sure you are uploading a valid clinical laboratory or diagnostic test report."
        )

    # 2. Medical Parameter Parsing
    raw_parsed, was_fallback = parse_medical_text(ocr_text)
    if not raw_parsed:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(
            status_code=400,
            detail="Could not extract any medical biomarkers from the uploaded report. Please make sure you are uploading a clear, legible clinical laboratory report containing supported biomarkers (e.g. Hemoglobin, Glucose, Cholesterol, Thyroid, etc.)."
        )

    # Fetch user profile for age/gender rule tuning
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    gender = profile.gender if profile else "male"
    age = profile.age if profile else 35
    height = profile.height_cm if profile else 175.0
    weight = profile.weight_kg if profile else 72.0
    bmi = round(weight / ((height / 100) ** 2), 1) if height and weight else 23.5

    # 3. Rule Analysis Engine
    analyzed_biomarkers = analyze_all_biomarkers(raw_parsed, gender=gender, age=age)

    # 4. Health Score & Risk Estimation
    health_score, risk_cat, abnormal_cnt = calculate_health_risk_and_score(analyzed_biomarkers, bmi=bmi, age=age)

    # 5. Groq AI Summary Generation
    should_run_ai = str(auto_ai_analysis).strip().lower() not in ("false", "0", "no")
    if should_run_ai:
        ai_summary_json = generate_report_ai_summary(analyzed_biomarkers, health_score, risk_cat)
        ai_summary_text = ai_summary_json.get("plain_language_summary", "")
    else:
        ai_summary_json = {
            "plain_language_summary": "Automatic AI analysis was disabled in your Settings. Out-of-range biomarkers have been identified by the clinical rule engine.",
            "key_findings": [f"Processed {len(analyzed_biomarkers)} parameters with {abnormal_cnt} out of reference range."],
            "actionable_recommendations": ["Consult your physician for personalized medical advice."]
        }
        ai_summary_text = ai_summary_json["plain_language_summary"]

    # Save to Database
    report = Report(
        id=report_id,
        user_id=user_id,
        file_name=filename,
        file_path=save_path,
        file_type=ext,
        upload_date=datetime.utcnow(),
        laboratory_name=laboratory_name,
        environment=(environment or "development").strip().lower(),
        raw_ocr_text=ocr_text,
        ocr_confidence=-1.0 if was_fallback else confidence,
        overall_health_score=health_score,
        health_risk_category=risk_cat,
        abnormal_count=abnormal_cnt,
        ai_summary_json=ai_summary_json,
        ai_summary_text=ai_summary_text
    )
    db.add(report)

    for b in analyzed_biomarkers:
        bm = Biomarker(
            report_id=report_id,
            canonical_name=b["canonical_name"],
            raw_name=b["raw_name"],
            category=b.get("category", "General"),
            value=b["value"],
            string_value=b.get("string_value"),
            unit=b["unit"],
            reference_min=b.get("reference_min"),
            reference_max=b.get("reference_max"),
            reference_range_str=b.get("reference_range_str"),
            status=b["status"],
            color_code=b["color_code"],
            difference_from_normal=b.get("difference_from_normal"),
            educational_explanation=b.get("educational_explanation"),
            causes_high=b.get("causes_high"),
            causes_low=b.get("causes_low"),
            symptoms=b.get("symptoms"),
            food_recommendations=b.get("food_recommendations"),
            lifestyle_advice=b.get("lifestyle_advice")
        )
        db.add(bm)

    db.commit()
    db.refresh(report)

    return report


@router.get("/", response_model=List[ReportOut])
@router.get("", response_model=List[ReportOut])
def get_all_reports(
    search: Optional[str] = Query(None),
    risk: Optional[str] = Query(None),
    environment: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    query = db.query(Report).options(joinedload(Report.biomarkers)).filter(Report.user_id == user_id)

    if environment:
        target_env = environment.strip().lower()
        if target_env == "production":
            query = query.filter((Report.environment == "production") | (Report.environment == None))
        else:
            query = query.filter(Report.environment == target_env)
    
    if search:
        query = query.filter(
            (Report.file_name.ilike(f"%{search}%")) | 
            (Report.laboratory_name.ilike(f"%{search}%"))
        )
    if risk and risk != "All":
        query = query.filter(Report.health_risk_category == risk)
        
    return query.order_by(Report.upload_date.desc()).all()


@router.get("/compare", response_model=ComparisonResponse)
def compare_reports(
    baseline_id: str = Query(...),
    current_id: str = Query(...),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    base_report = db.query(Report).filter(Report.id == baseline_id, Report.user_id == user_id).first()
    curr_report = db.query(Report).filter(Report.id == current_id, Report.user_id == user_id).first()

    if not base_report or not curr_report:
        raise HTTPException(status_code=404, detail="One or both comparison reports were not found.")

    def norm(name: str) -> str:
        return name.strip().lower().replace("_", " ").replace("-", " ")

    base_map = {norm(b.canonical_name): b for b in base_report.biomarkers}
    curr_map = {norm(b.canonical_name): b for b in curr_report.biomarkers}

    deltas: List[BiomarkerDelta] = []
    all_keys = list(set(base_map.keys()).union(set(curr_map.keys())))

    for key in all_keys:
        b_bm = base_map.get(key)
        c_bm = curr_map.get(key)

        display_name = (c_bm or b_bm).canonical_name
        category = (c_bm or b_bm).category
        unit = (c_bm or b_bm).unit

        b_val = b_bm.value if b_bm else (c_bm.value if c_bm else 0.0)
        c_val = c_bm.value if c_bm else (b_bm.value if b_bm else 0.0)

        delta_val = round(c_val - b_val, 2)
        pct = round((delta_val / b_val) * 100, 1) if b_val != 0 else 0.0

        status = "stable"
        if b_bm and c_bm:
            if c_bm.status != "normal" and b_bm.status == "normal":
                status = "new_abnormal"
            elif abs(pct) > 5.0:
                status = "improved" if (c_bm.status == "normal" and b_bm.status != "normal") else "worsened"
        elif c_bm and not b_bm:
            status = "new_parameter"
        elif b_bm and not c_bm:
            status = "stable"

        deltas.append(BiomarkerDelta(
            canonical_name=display_name,
            category=category,
            unit=unit,
            baseline_value=b_val,
            current_value=c_val,
            delta_value=delta_val,
            delta_percentage=pct,
            trend_status=status
        ))

    score_diff = curr_report.overall_health_score - base_report.overall_health_score
    overall_trend = "improved" if score_diff > 3.0 else ("degraded" if score_diff < -3.0 else "stable")
    
    ai_comp_text = generate_report_comparison_summary(
        baseline_date=base_report.upload_date.strftime("%Y-%m-%d"),
        current_date=curr_report.upload_date.strftime("%Y-%m-%d"),
        deltas=[d.dict() for d in deltas]
    )

    return ComparisonResponse(
        baseline_report_id=base_report.id,
        baseline_date=base_report.upload_date.strftime("%Y-%m-%d"),
        current_report_id=curr_report.id,
        current_date=curr_report.upload_date.strftime("%Y-%m-%d"),
        overall_trend=overall_trend,
        ai_comparison_summary=ai_comp_text,
        deltas=deltas
    )


@router.get("/{report_id}", response_model=ReportOut)
def get_report_detail(
    report_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    report = db.query(Report).options(joinedload(Report.biomarkers)).filter(Report.id == report_id, Report.user_id == user_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    biomarker_dicts = [
        {
            "canonical_id": b.canonical_name.lower().replace(" ", "_"),
            "canonical_name": b.canonical_name,
            "value": b.value,
            "unit": b.unit,
            "status": b.status,
            "color_code": b.color_code
        }
        for b in report.biomarkers
    ]

    # Guarantee raw_ocr_text is populated with actual extracted text or structured biomarker layer
    if not report.raw_ocr_text or len(report.raw_ocr_text.strip()) == 0:
        if report.file_path and os.path.exists(report.file_path):
            try:
                extracted_ocr, conf = process_document_ocr(report.file_path, report.file_type)
                if extracted_ocr and len(extracted_ocr.strip()) > 10:
                    report.raw_ocr_text = extracted_ocr
                    report.ocr_confidence = conf
                    db.commit()
            except Exception as ocr_err:
                print(f"[On-demand OCR Extraction Warning]: {ocr_err}")

        if not report.raw_ocr_text or len(report.raw_ocr_text.strip()) == 0:
            lines = [
                f"=== {report.laboratory_name.upper() if report.laboratory_name else 'DIAGNOSTIC'} LABORATORY REPORT ===",
                f"Document: {report.file_name}",
                f"Date: {report.upload_date.strftime('%Y-%m-%d')}",
                "",
                "EXTRACTED CLINICAL BIOMARKERS & REFERENCE RANGES:"
            ]
            for b in report.biomarkers:
                ref_str = f" (Ref Range: {b.reference_range_str})" if b.reference_range_str else ""
                lines.append(f"• {b.raw_name or b.canonical_name}\n  Result: {b.value} {b.unit}{ref_str}\n  Status: {b.status.upper()}\n")
            lines.append("~~ End of Laboratory OCR Extracted Text Layer ~~")
            report.raw_ocr_text = "\n".join(lines)
            db.commit()

    recs = generate_followup_recommendations(biomarker_dicts)

    user_meds = db.query(Medication).filter(Medication.user_id == user_id).all()
    med_dicts = [{"name": m.name, "dosage": m.dosage} for m in user_meds]
    med_analysis = analyze_medication_lab_interactions(med_dicts, biomarker_dicts)

    # Attach dynamic properties for schema serialization
    report.followup_recommendations = recs
    report.medication_analysis = med_analysis

    return report


@router.get("/{report_id}/pdf")
@router.get("/{report_id}/export-pdf")
def export_report_pdf(
    report_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    profile = db.query(Profile).filter(Profile.user_id == report.user_id).first()
    user = db.query(User).filter(User.id == report.user_id).first()

    patient_name = user.full_name if user and user.full_name else "Clinical Patient"
    gender = profile.gender if profile else "male"
    age = profile.age if profile else 35

    bm_dicts = [
        {
            "canonical_name": b.canonical_name,
            "raw_name": b.raw_name,
            "category": b.category,
            "value": b.value,
            "unit": b.unit,
            "reference_min": b.reference_min,
            "reference_max": b.reference_max,
            "reference_range_str": b.reference_range_str,
            "status": b.status,
            "color_code": b.color_code,
            "educational_explanation": b.educational_explanation
        }
        for b in report.biomarkers
    ]

    pdf_bytes = generate_report_pdf_bytes(
        report_data={
            "id": report.id,
            "file_name": report.file_name,
            "upload_date": report.upload_date.strftime("%B %d, %Y"),
            "laboratory_name": report.laboratory_name,
            "overall_health_score": report.overall_health_score,
            "health_risk_category": report.health_risk_category,
            "ai_summary_text": report.ai_summary_text,
            "biomarkers": bm_dicts
        },
        user_profile={
            "name": patient_name,
            "gender": gender,
            "age": age
        }
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=MediScan_Report_{report.id[:8]}.pdf"}
    )


@router.delete("/{report_id}")
def delete_report(
    report_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == user_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")

    if report.file_path and os.path.exists(report.file_path):
        try:
            os.remove(report.file_path)
        except Exception:
            pass

    db.delete(report)
    db.commit()
    return {"status": "success", "message": "Report deleted."}
