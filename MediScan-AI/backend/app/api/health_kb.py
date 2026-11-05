from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from app.core.medical_kb import MEDICAL_KNOWLEDGE_BASE, get_biomarker_kb_entry

router = APIRouter(prefix="/health-kb", tags=["Medical Knowledge Base"])

@router.get("/")
def get_all_kb_entries():
    """Return all laboratory test definitions in the knowledge base."""
    return list(MEDICAL_KNOWLEDGE_BASE.values())

@router.get("/search")
def search_kb(query: str = Query(...)):
    """Search knowledge base entries by test name or category."""
    q = query.lower()
    results = []
    for k, v in MEDICAL_KNOWLEDGE_BASE.items():
        if (q in k or 
            q in v["canonical_name"].lower() or 
            q in v["category"].lower() or 
            any(q in alias.lower() for alias in v.get("aliases", []))):
            results.append(v)
    return results
