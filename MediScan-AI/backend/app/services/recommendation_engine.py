"""
Deterministic Follow-Up Test Recommendation Engine for MediScan AI.
Evaluates abnormal biomarkers against clinical evidence-informed rules to generate targeted follow-up test recommendations.
Guarantees 100% deterministic rule-based output without AI hallucinations.
"""

from typing import List, Dict, Any

FOLLOWUP_RULES = [
    {
        "trigger_ids": ["hba1c", "fasting_glucose"],
        "condition": lambda val, status: status in ["high", "critical", "borderline_high"],
        "recommendations": [
            {
                "test_name": "Repeat HbA1c",
                "reason": "Monitor glycemic control over the preceding 2–3 months.",
                "priority": "Important",
                "suggested_timeline": "Within 3 months"
            },
            {
                "test_name": "Fasting Blood Glucose",
                "reason": "Confirm baseline fasting plasma glucose stability.",
                "priority": "Routine",
                "suggested_timeline": "Within 1 month"
            },
            {
                "test_name": "Urine Microalbumin",
                "reason": "Screen for early diabetic nephropathy / kidney filtration impact.",
                "priority": "Recommended",
                "suggested_timeline": "Within 6 months"
            }
        ]
    },
    {
        "trigger_ids": ["total_cholesterol", "ldl_cholesterol", "triglycerides"],
        "condition": lambda val, status: status in ["high", "critical", "borderline_high"],
        "recommendations": [
            {
                "test_name": "Full Lipid Profile (Fasting)",
                "reason": "Re-evaluate total, LDL, HDL cholesterol, and triglyceride levels after dietary interventions.",
                "priority": "Recommended",
                "suggested_timeline": "Within 3 months"
            },
            {
                "test_name": "Apolipoprotein B (ApoB)",
                "reason": "Assess atherogenic particle count for refined cardiovascular risk stratification.",
                "priority": "Routine",
                "suggested_timeline": "Within 6 months"
            }
        ]
    },
    {
        "trigger_ids": ["creatinine", "bun"],
        "condition": lambda val, status: status in ["high", "critical", "borderline_high"],
        "recommendations": [
            {
                "test_name": "eGFR (Estimated Glomerular Filtration Rate)",
                "reason": "Evaluate kidney filtration capacity and renal health stage.",
                "priority": "Important",
                "suggested_timeline": "Within 1 month"
            },
            {
                "test_name": "Urine Albumin-to-Creatinine Ratio (uACR)",
                "reason": "Check for renal protein leakage and early nephron strain.",
                "priority": "Recommended",
                "suggested_timeline": "Within 3 months"
            }
        ]
    },
    {
        "trigger_ids": ["alt", "ast", "total_bilirubin"],
        "condition": lambda val, status: status in ["high", "critical", "borderline_high"],
        "recommendations": [
            {
                "test_name": "Comprehensive Liver Panel (AST, ALT, ALP, GGT)",
                "reason": "Monitor hepatocyte integrity and biliary tract function.",
                "priority": "Important",
                "suggested_timeline": "Within 1 month"
            },
            {
                "test_name": "Total & Direct Bilirubin Panel",
                "reason": "Rule out cholestasis or hemolytic elevation.",
                "priority": "Routine",
                "suggested_timeline": "Within 2 months"
            }
        ]
    },
    {
        "trigger_ids": ["hemoglobin", "rbc", "ferritin", "iron"],
        "condition": lambda val, status: status in ["low", "critical", "slightly_low"],
        "recommendations": [
            {
                "test_name": "Iron Profile (Total Iron, TIBC, Transferrin Saturation)",
                "reason": "Evaluate iron store kinetics and differential diagnosis for microcytic anemia.",
                "priority": "Important",
                "suggested_timeline": "Within 1 month"
            },
            {
                "test_name": "Serum Ferritin",
                "reason": "Quantify total intracellular iron reserves.",
                "priority": "Recommended",
                "suggested_timeline": "Within 1 month"
            },
            {
                "test_name": "Vitamin B12 & Folate Level",
                "reason": "Rule out macrocytic vitamin deficiency anemia.",
                "priority": "Routine",
                "suggested_timeline": "Within 2 months"
            }
        ]
    },
    {
        "trigger_ids": ["tsh"],
        "condition": lambda val, status: status in ["high", "critical", "borderline_high"],
        "recommendations": [
            {
                "test_name": "Free T3 & Free T4",
                "reason": "Evaluate circulating thyroid hormone levels to differentiate overt vs subclinical hypothyroidism.",
                "priority": "Important",
                "suggested_timeline": "Within 6 weeks"
            },
            {
                "test_name": "Thyroid Peroxidase (TPO) Antibodies",
                "reason": "Check for autoimmune thyroiditis (Hashimoto's disease).",
                "priority": "Routine",
                "suggested_timeline": "Within 3 months"
            }
        ]
    },
    {
        "trigger_ids": ["tsh"],
        "condition": lambda val, status: status in ["low", "slightly_low"],
        "recommendations": [
            {
                "test_name": "Free T4 & Free T3 Panel",
                "reason": "Evaluate for hyperthyroidism or thyroid hormone excess.",
                "priority": "Important",
                "suggested_timeline": "Within 4 weeks"
            }
        ]
    },
    {
        "trigger_ids": ["vitamin_d"],
        "condition": lambda val, status: status in ["low", "critical", "slightly_low"],
        "recommendations": [
            {
                "test_name": "Vitamin D (25-Hydroxy)",
                "reason": "Re-check serum 25-OH Vitamin D after supplementation therapy.",
                "priority": "Recommended",
                "suggested_timeline": "Within 3 months"
            },
            {
                "test_name": "Serum Calcium & Phosphate",
                "reason": "Assess bone mineral metabolism balance.",
                "priority": "Routine",
                "suggested_timeline": "Within 3 months"
            }
        ]
    }
]

def generate_followup_recommendations(biomarkers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Evaluates analyzed report biomarkers and returns a deduplicated list of recommended follow-up tests.
    """
    results: List[Dict[str, Any]] = []
    seen_tests = set()

    for b in biomarkers:
        c_id = b.get("canonical_id", "").lower()
        val = b.get("value", 0.0)
        status = b.get("status", "normal").lower()

        if status == "normal":
            continue

        for rule in FOLLOWUP_RULES:
            if c_id in rule["trigger_ids"] and rule["condition"](val, status):
                for rec in rule["recommendations"]:
                    test_key = rec["test_name"].lower()
                    if test_key not in seen_tests:
                        seen_tests.add(test_key)
                        results.append({
                            "test_name": rec["test_name"],
                            "reason": rec["reason"],
                            "priority": rec["priority"],
                            "suggested_timeline": rec["suggested_timeline"],
                            "trigger_biomarker": b.get("canonical_name", c_id.title())
                        })

    return results
