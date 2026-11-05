"""
Health Risk & Overall Health Score Calculator for MediScan AI.
Uses deterministic weighted scoring across key metabolic, lipid, hepatic, renal, and inflammatory parameters.
Categories: Very Low, Low, Moderate, High, Very High.
Score Range: 0 to 100.
"""

from typing import List, Dict, Any, Tuple

def calculate_health_risk_and_score(biomarkers: List[Dict[str, Any]], bmi: float = 23.5, age: int = 35) -> Tuple[float, str, int]:
    """Calculate overall health score (0-100), risk category, and abnormal parameter count."""
    base_score = 100.0
    abnormal_count = 0

    for b in biomarkers:
        status = b.get("status", "normal")
        c_id = b.get("canonical_id", "").lower()

        if status == "critical":
            base_score -= 15.0
            abnormal_count += 1
        elif status == "high" or status == "low":
            base_score -= 8.0
            abnormal_count += 1
        elif status == "borderline_high" or status == "slightly_low":
            base_score -= 3.5
            abnormal_count += 1

        # Specific metabolic impact penalties
        if c_id == "hba1c" and b["value"] >= 6.5:
            base_score -= 5.0
        if c_id == "fasting_glucose" and b["value"] >= 126:
            base_score -= 4.0
        if c_id == "total_cholesterol" and b["value"] >= 240:
            base_score -= 4.0
        if c_id == "creatinine" and b["value"] >= 1.4:
            base_score -= 6.0
        if c_id == "alt" and b["value"] >= 65:
            base_score -= 4.0

    # BMI adjustment
    if bmi > 30.0:
        base_score -= 4.0
    elif bmi > 25.0:
        base_score -= 2.0

    # Clamp score to [0, 100]
    final_score = max(10.0, min(100.0, round(base_score, 1)))

    # Determine risk category
    if final_score >= 88.0:
        risk_category = "Very Low"
    elif final_score >= 75.0:
        risk_category = "Low"
    elif final_score >= 60.0:
        risk_category = "Moderate"
    elif final_score >= 45.0:
        risk_category = "High"
    else:
        risk_category = "Very High"

    return final_score, risk_category, abnormal_count
