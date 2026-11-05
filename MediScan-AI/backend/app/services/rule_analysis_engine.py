"""
Rule-Based Medical Analysis Engine for MediScan AI.
Evaluates numerical biomarker values strictly against clinical reference ranges.
Categorizes into: low, slightly_low, normal, borderline_high, high, critical.
Assigns status color codes: green, yellow, orange, red.
"""

from typing import Dict, Any, List
from app.core.medical_kb import MEDICAL_KNOWLEDGE_BASE, get_biomarker_kb_entry

def evaluate_biomarker_rule(canonical_id: str, value: float, gender: str = "male", age: int = 35) -> Dict[str, Any]:
    """Deterministically analyze a single biomarker value against reference ranges."""
    kb = get_biomarker_kb_entry(canonical_id)
    if not kb:
        return {
            "status": "normal",
            "color_code": "green",
            "reference_min": 0,
            "reference_max": 100,
            "reference_range_str": "Standard Range",
            "difference_from_normal": "Within normal range",
            "educational_explanation": "Parameter monitored for general baseline health."
        }

    ref = kb["reference_ranges"].get(gender, kb["reference_ranges"]["default"])
    min_val = ref.get("min", 0.0)
    max_val = ref.get("max", 1000.0)
    
    borderline_low = ref.get("borderline_low", min_val * 0.9 if min_val else 0)
    borderline_high = ref.get("borderline_high", max_val * 1.15 if max_val else 1000)
    critical_low = ref.get("critical_low", min_val * 0.6 if min_val else 0)
    critical_high = ref.get("critical_high", max_val * 1.5 if max_val else 1000)

    status = "normal"
    color_code = "green"
    diff_str = "Within normal reference range"

    if value < critical_low:
        status = "critical"
        color_code = "red"
        diff_str = f"{round(min_val - value, 2)} {kb['unit']} below normal (Critical Low)"
    elif value < min_val:
        if value >= borderline_low:
            status = "slightly_low"
            color_code = "yellow"
            diff_str = f"{round(min_val - value, 2)} {kb['unit']} below normal"
        else:
            status = "low"
            color_code = "orange"
            diff_str = f"{round(min_val - value, 2)} {kb['unit']} below normal"
    elif value > critical_high:
        status = "critical"
        color_code = "red"
        diff_str = f"{round(value - max_val, 2)} {kb['unit']} above normal (Critical High)"
    elif value > max_val:
        if value <= borderline_high:
            status = "borderline_high"
            color_code = "yellow"
            diff_str = f"{round(value - max_val, 2)} {kb['unit']} above normal"
        else:
            status = "high"
            color_code = "orange"
            diff_str = f"{round(value - max_val, 2)} {kb['unit']} above normal"

    # Educational summary build
    edu_text = (
        f"{kb['canonical_name']} is currently {status.replace('_', ' ')}. "
        f"{kb['clinical_importance']}"
    )

    return {
        "status": status,
        "color_code": color_code,
        "reference_min": min_val,
        "reference_max": max_val,
        "reference_range_str": f"{min_val} - {max_val} {kb['unit']}",
        "difference_from_normal": diff_str,
        "educational_explanation": edu_text,
        "causes_high": kb.get("causes_high", []),
        "causes_low": kb.get("causes_low", []),
        "symptoms": kb.get("symptoms_high", []) if "high" in status else kb.get("symptoms_low", []),
        "food_recommendations": kb.get("food_recommendations", {}),
        "lifestyle_advice": kb.get("lifestyle_advice", ""),
        "when_to_see_doctor": kb.get("when_to_see_doctor", "")
    }


def analyze_all_biomarkers(biomarkers_list: List[Dict[str, Any]], gender: str = "male", age: int = 35) -> List[Dict[str, Any]]:
    """Analyze a list of parsed biomarkers deterministically."""
    analyzed = []
    for b in biomarkers_list:
        c_id = b.get("canonical_id", b["canonical_name"].lower())
        eval_res = evaluate_biomarker_rule(c_id, b["value"], gender=gender, age=age)
        
        merged = {**b, **eval_res}
        analyzed.append(merged)
    return analyzed
