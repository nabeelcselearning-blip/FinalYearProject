from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    chats = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True) # male, female, other
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    blood_group = Column(String, nullable=True)
    lifestyle = Column(String, nullable=True) # sedentary, active, athlete
    exercise_frequency = Column(String, nullable=True) # none, 1-2_times, 3-5_times, daily
    smoking_status = Column(String, nullable=True) # non_smoker, former, current
    alcohol_consumption = Column(String, nullable=True) # none, occasional, regular
    allergies = Column(Text, nullable=True)
    chronic_diseases = Column(Text, nullable=True)
    family_medical_history = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # pdf, png, jpg, jpeg
    upload_date = Column(DateTime, default=datetime.utcnow, index=True)
    laboratory_name = Column(String, nullable=True, default="Clinical Diagnostics")
    environment = Column(String, default="production", nullable=True, index=True) # development, production
    raw_ocr_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.95)
    
    overall_health_score = Column(Float, default=85.0) # 0 to 100
    health_risk_category = Column(String, default="Low") # Very Low, Low, Moderate, High, Very High
    abnormal_count = Column(Integer, default=0)
    
    ai_summary_json = Column(JSON, nullable=True)
    ai_summary_text = Column(Text, nullable=True)
    
    biomarkers = relationship("Biomarker", back_populates="report", cascade="all, delete-orphan")
    user = relationship("User", back_populates="reports")


class Biomarker(Base):
    __tablename__ = "biomarkers"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=False, index=True)
    canonical_name = Column(String, nullable=False, index=True)
    raw_name = Column(String, nullable=False)
    category = Column(String, nullable=False, default="General")
    
    value = Column(Float, nullable=False)
    string_value = Column(String, nullable=True) # Qualitative values e.g. Negative, Trace, 1+, Clear, Amber
    unit = Column(String, nullable=False)
    
    reference_min = Column(Float, nullable=True)
    reference_max = Column(Float, nullable=True)
    reference_range_str = Column(String, nullable=True)
    
    status = Column(String, nullable=False) # low, slightly_low, normal, borderline_high, high, critical
    color_code = Column(String, nullable=False, default="green") # green, yellow, orange, red
    difference_from_normal = Column(String, nullable=True)
    
    educational_explanation = Column(Text, nullable=True)
    causes_high = Column(JSON, nullable=True)
    causes_low = Column(JSON, nullable=True)
    symptoms = Column(JSON, nullable=True)
    food_recommendations = Column(JSON, nullable=True)
    lifestyle_advice = Column(Text, nullable=True)

    report = relationship("Report", back_populates="biomarkers")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String, nullable=False) # user, assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chats")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    reminder_type = Column(String, nullable=False, default="general") # lab_test, medication, doctor_appointment, water, exercise, sleep, general
    reminder_date = Column(String, nullable=False) # YYYY-MM-DD
    reminder_time = Column(String, nullable=False) # HH:MM
    repeat_option = Column(String, nullable=False, default="Once") # Once, Daily, Weekly, Monthly
    status = Column(String, nullable=False, default="Upcoming") # Upcoming, Completed, Missed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reminders")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False) # e.g. 500mg
    frequency = Column(String, nullable=False) # e.g. Once daily
    start_date = Column(String, nullable=False) # YYYY-MM-DD
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="medications")

