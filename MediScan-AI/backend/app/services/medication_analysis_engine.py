"""
Deterministic Medication Interaction & Lab Interpretation Engine for MediScan AI.
Cross-references active medications with patient biomarkers to identify potential medication impacts,
food/supplement timing interactions, monitoring advice, and safety notes.
Guarantees 100% deterministic rule-based output without AI hallucinations.
"""

from typing import List, Dict, Any

MEDICATION_KNOWLEDGE_BASE = [
    {
        "keywords": ["metformin", "glucophage"],
        "impact_rules": [
            {
                "target_canonical_ids": ["vitamin_b12", "hemoglobin", "rbc"],
                "impact_statement": "Metformin can reduce intestinal Vitamin B12 absorption over long-term use, potentially contributing to low Vitamin B12 levels or megaloblastic anemia."
            }
        ],
        "general_impact": "Metformin is a primary biguanide for blood glucose control. Long-term use may modestly reduce Vitamin B12 serum concentrations.",
        "food_interactions": ["Take Metformin with meals to reduce gastrointestinal upset. Limit excessive alcohol consumption as it increases risk of lactic acidosis."],
        "monitoring_advice": "Periodically monitor Vitamin B12 levels, Complete Blood Count (CBC), and renal function (Creatinine/eGFR) annually."
    },
    {
        "keywords": ["statin", "atorvastatin", "rosuvastatin", "simvastatin", "lipitor", "crestor"],
        "impact_rules": [
            {
                "target_canonical_ids": ["alt", "ast", "total_bilirubin"],
                "impact_statement": "Statins can cause transient mild elevations in liver enzymes (ALT and AST)."
            }
        ],
        "general_impact": "Statins lower LDL cholesterol and cardiovascular risk. Mild hepatic transaminase elevations can occur, usually self-limiting.",
        "food_interactions": ["Avoid drinking large amounts of grapefruit juice (especially with atorvastatin or simvastatin) as it can increase drug blood levels."],
        "monitoring_advice": "Patients taking statins should periodically monitor baseline and ongoing Liver Function Tests (ALT, AST) and report unexplained muscle pain."
    },
    {
        "keywords": ["levothyroxine", "synthroid", "eltroxin", "thyronorm"],
        "impact_rules": [
            {
                "target_canonical_ids": ["tsh", "free_t3", "free_t4"],
                "impact_statement": "Levothyroxine directly replaces thyroid hormone to normalize TSH levels. Dose adjustments depend on TSH and Free T4 trends."
            }
        ],
        "general_impact": "Levothyroxine synthesizes T4 hormone to manage hypothyroidism. Absorption is highly sensitive to food and co-administered minerals.",
        "food_interactions": ["Take Levothyroxine on an empty stomach with water 30–60 minutes before breakfast. Avoid taking together with calcium, iron supplements, or antacids (separate by at least 4 hours)."],
        "monitoring_advice": "Re-evaluate TSH and Free T4 6–8 weeks after dose modifications or changing medication brands."
    },
    {
        "keywords": ["diuretic", "furosemide", "lasix", "hydrochlorothiazide", "hctz", "spironolactone"],
        "impact_rules": [
            {
                "target_canonical_ids": ["potassium", "sodium", "creatinine", "uric_acid"],
                "impact_statement": "Diuretics alter renal electrolyte excretion, which may lead to variations in Potassium, Sodium, Uric Acid, or serum Creatinine."
            }
        ],
        "general_impact": "Diuretics promote fluid excretion. Loop/thiazide diuretics may cause hypokalemia (low potassium), while potassium-sparing diuretics may increase potassium.",
        "food_interactions": ["Maintain consistent dietary potassium intake. If taking loop diuretics, potassium-rich foods or supplements may be recommended by your doctor."],
        "monitoring_advice": "Regularly monitor serum electrolytes (Potassium, Sodium) and renal parameters (Creatinine, BUN)."
    },
    {
        "keywords": ["steroid", "prednisone", "dexamethasone", "hydrocortisone", "methylprednisolone"],
        "impact_rules": [
            {
                "target_canonical_ids": ["fasting_glucose", "hba1c", "wbc"],
                "impact_statement": "Systemic corticosteroids can elevate blood glucose levels (inducing transient hyperglycemia) and increase White Blood Cell (WBC) counts."
            }
        ],
        "general_impact": "Corticosteroids exert strong anti-inflammatory effects but induce insulin resistance and fluid retention.",
        "food_interactions": ["Take corticosteroids with food or milk to prevent gastric irritation. Limit refined sugars and maintain adequate calcium/Vitamin D intake."],
        "monitoring_advice": "Monitor Fasting Blood Glucose, HbA1c, blood pressure, and bone density during prolonged corticosteroid therapy."
    },
    {
        "keywords": ["lisinopril", "losartan", "enalapril", "valsartan", "ramipril", "ace inhibitor", "arb"],
        "impact_rules": [
            {
                "target_canonical_ids": ["potassium", "creatinine"],
                "impact_statement": "ACE inhibitors and ARBs can decrease aldosterone secretion, which may elevate serum Potassium levels or transiently increase Creatinine."
            }
        ],
        "general_impact": "RAAS blockers protect kidney function in diabetes and lower blood pressure, but require electrolyte monitoring.",
        "food_interactions": ["Avoid excessive use of potassium-based salt substitutes without consulting your physician."],
        "monitoring_advice": "Check serum Potassium and renal function (Creatinine/eGFR) within 2–4 weeks of starting or escalating dose."
    },
    {
        "keywords": ["omeprazole", "pantoprazole", "esomeprazole", "ppi", "antacid"],
        "impact_rules": [
            {
                "target_canonical_ids": ["vitamin_b12", "magnesium", "calcium"],
                "impact_statement": "Long-term Proton Pump Inhibitor (PPI) therapy reduces gastric acid, which can impair absorption of Vitamin B12 and Magnesium."
            }
        ],
        "general_impact": "PPIs suppress gastric acid production. Prolonged suppression reduces acid-dependent micronutrient cleavage.",
        "food_interactions": ["Take PPIs 30–60 minutes before the first meal of the day for optimal acid suppression."],
        "monitoring_advice": "Consider checking serum Magnesium and Vitamin B12 levels annually if on continuous PPI therapy for > 1 year."
    }
]

def analyze_medication_lab_interactions(
    medications: List[Dict[str, Any]],
    biomarkers: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Cross-references user active medications with report biomarkers.
    Returns structured interaction analysis.
    """
    impacts: List[str] = []
    food_interactions: List[str] = []
    monitoring_advice: List[str] = []

    biomarker_map = {b.get("canonical_id", "").lower(): b for b in biomarkers}

    for med in medications:
        med_name = med.get("name", "").lower()
        
        for entry in MEDICATION_KNOWLEDGE_BASE:
            if any(kw in med_name for kw in entry["keywords"]):
                matched = False
                for rule in entry["impact_rules"]:
                    for target_id in rule["target_canonical_ids"]:
                        if target_id in biomarker_map:
                            bm = biomarker_map[target_id]
                            if bm.get("status") != "normal":
                                impacts.append(
                                    f"• {med.get('name')}: {rule['impact_statement']} (Note: Patient's {bm.get('canonical_name')} is currently {bm.get('status').replace('_', ' ')})"
                                )
                                matched = True
                
                if not matched and entry.get("general_impact"):
                    impacts.append(f"• {med.get('name')}: {entry['general_impact']}")

                for food_rule in entry["food_interactions"]:
                    if food_rule not in food_interactions:
                        food_interactions.append(f"• {food_rule}")

                if entry.get("monitoring_advice") and entry["monitoring_advice"] not in monitoring_advice:
                    monitoring_advice.append(f"• {entry['monitoring_advice']}")

    return {
        "medication_impacts": impacts,
        "food_interactions": food_interactions,
        "monitoring_advice": monitoring_advice,
        "safety_disclaimer": "EDUCATIONAL NOTICE: This analysis is for informational purposes only. Do NOT adjust, discontinue, or alter prescription medications without explicit guidance from a licensed physician."
    }
