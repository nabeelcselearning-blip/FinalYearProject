"""
Medical Parsing Engine for MediScan AI.
Parses unstructured OCR text into structured laboratory biomarkers using flexible regex pattern matching,
canonical alias resolution, multiline table support, and LLM fallback parsing.
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from app.core.medical_kb import MEDICAL_KNOWLEDGE_BASE, get_biomarker_kb_entry

INVALID_UNIT_TOKENS = {
    'male', 'female', 'm', 'f', 'high', 'low', 'normal', 'abnormal', 'critical',
    'result', 'results', 'ref', 'reference', 'range', 'flag', 'status', 'value',
    'h', 'l', 'a', 'n', 'test', 'index', 'specimen', 'patient', 'age', 'year', 'years', 'lha'
}

MEDICAL_HEADER_KEYWORDS = [
    'patient', 'specimen', 'pathology', 'laboratory', 'diagnostic', 'hospital',
    'clinical', 'ref range', 'reference range', 'reference interval', 'biological reference',
    'test name', 'result', 'units', 'flag', 'doctor', 'physician', 'referred by',
    'hemoglobin', 'glucose', 'cholesterol', 'tsh', 'creatinine', 'wbc', 'platelet',
    'g/dl', 'mg/dl', 'uiuml', 'mmol/l', 'ng/ml', 'pg/ml'
]


def validate_is_medical_report(raw_text: str) -> Tuple[bool, str]:
    """
    Validates whether the raw text extracted from an uploaded document represents a genuine medical lab report.
    Returns (is_valid, reason).
    """
    if not raw_text or len(raw_text.strip()) < 15:
        return False, "Document contains insufficient or unreadable text."

    text_lower = raw_text.lower()

    # Check for obvious non-medical document headers/phrases
    non_medical_indicators = [
        'internship report', 'table of contents', 'abstract', 'declaration',
        'certificate of completion', 'acknowledgements', 'chapter 1', 'chapter 2',
        'curriculum vitae', 'resume', 'invoice', 'receipt', 'purchase order',
        'git clone', 'repository', 'github', 'licence', 'software architecture'
    ]

    non_med_hits = sum(1 for phrase in non_medical_indicators if phrase in text_lower)
    if non_med_hits >= 2 and not any(k in text_lower for k in ['reference range', 'specimen', 'g/dl', 'mg/dl']):
        return False, "Uploaded file appears to be an academic or non-medical document (e.g. internship report, invoice, or manual)."

    # Count clinical keyword hits
    matched_keywords = [kw for kw in MEDICAL_HEADER_KEYWORDS if kw in text_lower]

    # If 3 or more strong medical indicator terms are present, approve directly
    if len(matched_keywords) >= 3:
        return True, "Valid clinical report detected via medical header keywords."

    # Otherwise, perform LLM document classification check
    try:
        from app.services.groq_ai_service import classify_document_type
        res = classify_document_type(raw_text)
        if res.get("is_medical_report", False):
            return True, res.get("reason", "Approved by AI classifier.")
        else:
            return False, res.get("reason", "Document was classified as non-medical by AI validator.")
    except Exception as e:
        print(f"[Document Validation Warning]: AI classification fallback error: {e}")
        if len(matched_keywords) >= 1:
            return True, "Borderline document approved."

    return False, "Uploaded document does not contain recognizable clinical lab markers or report headers."


def sanitize_biomarker_unit(raw_unit: Optional[str], default_unit: str) -> str:
    if not raw_unit:
        return default_unit
    clean = raw_unit.strip().lower()
    if clean.isdigit() or (len(clean) <= 1 and clean != '%') or clean in INVALID_UNIT_TOKENS or any(tok in clean for tok in ['male', 'female', 'result', 'reference', 'range', 'status']):
        return default_unit

    unit_map = {
        'g/dl': 'g/dL',
        'mg/dl': 'mg/dL',
        'mg/l': 'mg/L',
        'ng/dl': 'ng/dL',
        'ng/ml': 'ng/mL',
        'pg/ml': 'pg/mL',
        'uiuml': 'uIU/mL',
        'uiu/ml': 'uIU/mL',
        'µiu/ml': 'uIU/mL',
        'u/l': 'U/L',
        'iu/l': 'U/L',
        'ug/dl': 'ug/dL',
        'µg/dl': 'ug/dL',
        'mcg/dl': 'ug/dL',
        'million/ul': 'million/uL',
        'million/µl': 'million/uL',
        '/ul': '/uL',
        '/µl': '/uL',
        'hpf': '/HPF',
        '/hpf': '/HPF',
        'mm/hr': 'mm/hr',
        'ml/min/1.73m2': 'mL/min/1.73m2'
    }

    return unit_map.get(clean, raw_unit.strip())

def parse_medical_text(raw_text: str) -> Tuple[List[Dict[str, Any]], bool]:
    """Parse OCR text into structured list of medical parameters."""
    parsed_biomarkers = []
    text_lower = raw_text.lower()

    for canonical_id, kb in MEDICAL_KNOWLEDGE_BASE.items():
        aliases = [kb["canonical_name"].lower()] + [a.lower() for a in kb.get("aliases", [])]
        found = False

        for alias in aliases:
            alias_pattern = re.escape(alias)
            
            # Flexible pattern matching: Alias followed by optional intermediate text (Method, Result, dots) -> Number -> Unit
            pattern = (
                r"(?:^|\b)" + alias_pattern + 
                r"\b(?:[^\d\n]{0,45}?)(?:[LHa\*]|low|high|abnormal|critical)?[\s:=:\-\.\*_]*([0-9]+\.?[0-9]*)\s*([a-zA-Z/%³µuU1-9]*)"
            )
            
            match = re.search(pattern, text_lower, re.IGNORECASE | re.MULTILINE)
            if match:
                try:
                    val_str = match.group(1)
                    val_float = float(val_str)
                    raw_extracted_unit = match.group(2).strip() if match.group(2) else ""
                    unit_str = sanitize_biomarker_unit(raw_extracted_unit, kb["unit"])
                    
                    parsed_biomarkers.append({
                        "canonical_id": canonical_id,
                        "canonical_name": kb["canonical_name"],
                        "raw_name": alias.title(),
                        "category": kb["category"],
                        "value": val_float,
                        "unit": unit_str
                    })
                    found = True
                    break
                except (ValueError, IndexError):
                    continue
        
        if found:
            continue

    # Multiline stacked layout search (check up to 5 lines ahead for parameter name, value, and unit)
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
    for idx, line in enumerate(lines):
        line_lower = line.lower()
        for canonical_id, kb in MEDICAL_KNOWLEDGE_BASE.items():
            if any(b["canonical_id"] == canonical_id for b in parsed_biomarkers):
                continue
            aliases = [kb["canonical_name"].lower()] + [a.lower() for a in kb.get("aliases", [])]
            for alias in aliases:
                if alias in line_lower:
                    # Join up to 5 consecutive lines to handle vertical stacked PDF layouts
                    block_text = " ".join(lines[idx:min(idx + 5, len(lines))])
                    num_match = re.search(r"([0-9]+\.?[0-9]*)", block_text[len(alias):] if alias in block_text.lower() else block_text)
                    if num_match:
                        try:
                            val_float = float(num_match.group(1))
                            unit_match = re.search(r"\b(mmol/l|mg/dl|g/dl|ug/dl|uIU/ml|ng/ml|U/L|%|million/uL|/uL|/HPF|pg/ml)\b", block_text, re.IGNORECASE)
                            unit_str = sanitize_biomarker_unit(unit_match.group(1) if unit_match else "", kb["unit"])
                            parsed_biomarkers.append({
                                "canonical_id": canonical_id,
                                "canonical_name": kb["canonical_name"],
                                "raw_name": alias.title(),
                                "category": kb["category"],
                                "value": val_float,
                                "unit": unit_str
                            })
                            break
                        except ValueError:
                            pass

    # LLM extraction fallback for missing or custom parameters
    was_fallback = False
    if len(parsed_biomarkers) < 3:
        try:
            from app.services.groq_ai_service import parse_biomarkers_with_llm
            llm_parsed = parse_biomarkers_with_llm(raw_text)
            if len(llm_parsed) >= 1:
                for item in llm_parsed:
                    c_id = item.get("canonical_id", "").lower().replace(" ", "_")
                    if not c_id:
                        continue
                    if not any(b["canonical_id"] == c_id for b in parsed_biomarkers):
                        if c_id in MEDICAL_KNOWLEDGE_BASE:
                            kb = MEDICAL_KNOWLEDGE_BASE[c_id]
                            parsed_biomarkers.append({
                                "canonical_id": c_id,
                                "canonical_name": kb["canonical_name"],
                                "raw_name": item.get("raw_name") or kb["canonical_name"],
                                "category": kb["category"],
                                "value": float(item["value"]),
                                "unit": sanitize_biomarker_unit(item.get("unit"), kb["unit"])
                            })
                        elif "value" in item and item["value"] is not None:
                            try:
                                parsed_biomarkers.append({
                                    "canonical_id": c_id,
                                    "canonical_name": item.get("raw_name") or c_id.replace("_", " ").title(),
                                    "raw_name": item.get("raw_name") or c_id.title(),
                                    "category": "Diagnostic Panel",
                                    "value": float(item["value"]),
                                    "unit": str(item.get("unit", ""))
                                })
                            except ValueError:
                                pass
        except Exception as e:
            print(f"[LLM Parser fallback failed]: {e}")

    if len(parsed_biomarkers) == 0:
        was_fallback = True

    return parsed_biomarkers, was_fallback
