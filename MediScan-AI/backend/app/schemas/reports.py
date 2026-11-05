from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Profile Schemas
class ProfileBase(BaseModel):
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = "male" # male, female, other
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    blood_group: Optional[str] = None
    lifestyle: Optional[str] = "active" # sedentary, active, athlete
    exercise_frequency: Optional[str] = "3-5_times"
    smoking_status: Optional[str] = "non_smoker"
    alcohol_consumption: Optional[str] = "none"
    allergies: Optional[str] = None
    chronic_diseases: Optional[str] = None
    family_medical_history: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    user_id: str
    updated_at: datetime

    class Config:
        from_attributes = True


# User Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


# Biomarker Schemas
class BiomarkerSchema(BaseModel):
    id: Optional[int] = None
    canonical_name: str
    raw_name: str
    category: str = "General"
    value: float
    string_value: Optional[str] = None
    unit: str
    reference_min: Optional[float] = None
    reference_max: Optional[float] = None
    reference_range_str: Optional[str] = None
    status: str # low, slightly_low, normal, borderline_high, high, critical
    color_code: str # green, yellow, orange, red
    difference_from_normal: Optional[str] = None
    educational_explanation: Optional[str] = None
    causes_high: Optional[List[str]] = None
    causes_low: Optional[List[str]] = None
    symptoms: Optional[List[str]] = None
    food_recommendations: Optional[Dict[str, List[str]]] = None
    lifestyle_advice: Optional[str] = None

    class Config:
        from_attributes = True


# Report Schemas
class ReportSummarySchema(BaseModel):
    plain_language_summary: str
    important_findings: List[str]
    normal_parameters_count: int
    abnormal_parameters_count: int
    lifestyle_suggestions: List[str]
    follow_up_recommendations: List[str]

class ReportOut(BaseModel):
    id: str
    user_id: str
    file_name: str
    file_type: str
    upload_date: datetime
    laboratory_name: Optional[str] = "Clinical Diagnostics"
    environment: Optional[str] = "production"
    raw_ocr_text: Optional[str] = None
    ocr_confidence: float = 0.95
    overall_health_score: float
    health_risk_category: str
    abnormal_count: int
    ai_summary_json: Optional[Dict[str, Any]] = None
    ai_summary_text: Optional[str] = None
    biomarkers: List[BiomarkerSchema] = []
    followup_recommendations: Optional[List[Dict[str, Any]]] = None
    medication_analysis: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# Report Comparison Schema
class BiomarkerDelta(BaseModel):
    canonical_name: str
    category: str
    unit: str
    baseline_value: float
    current_value: float
    delta_value: float
    delta_percentage: float
    trend_status: str # improved, worsened, stable, new_abnormal

class ComparisonResponse(BaseModel):
    baseline_report_id: str
    baseline_date: datetime
    current_report_id: str
    current_date: datetime
    overall_trend: str # improved, stable, degraded
    ai_comparison_summary: str
    deltas: List[BiomarkerDelta]


# Health Trend Schema
class HealthTrendPoint(BaseModel):
    report_id: str
    date: str
    health_score: float
    risk_category: str
    biomarkers: Dict[str, Optional[float]] # canonical_name -> value


# Chat Schema
class ChatMessage(BaseModel):
    role: str # user, assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    context_report_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    disclaimer: str = "MediScan AI provides information for educational purposes only. Always consult a qualified physician for medical diagnosis."
