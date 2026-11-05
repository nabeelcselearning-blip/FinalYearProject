"""
Comprehensive Medical Knowledge Base for MediScan AI.
Contains reference ranges, clinical importance, causes of high/low values, symptoms,
food recommendations, lifestyle advice, and physician consultation guidance.
"""

from typing import Dict, Any, Optional

MEDICAL_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    # --- COMPLETE BLOOD COUNT (CBC) ---
    "hemoglobin": {
        "canonical_name": "Hemoglobin",
        "aliases": ["hb", "hgb", "hemoglobin concentration", "haemoglobin", "hemoglobina", "hémoglobine", "hämoglobin", "hemo"],
        "category": "Complete Blood Count",
        "unit": "g/dL",
        "reference_ranges": {
            "default": {"min": 12.0, "max": 17.5, "borderline_low": 11.0, "borderline_high": 18.0, "critical_low": 7.0, "critical_high": 20.0},
            "male": {"min": 13.8, "max": 17.2},
            "female": {"min": 12.1, "max": 15.1}
        },
        "clinical_importance": "Carries oxygen from lungs to rest of the body tissue via red blood cells.",
        "causes_low": ["Iron deficiency", "Vitamin B12 or folate deficiency", "Chronic blood loss", "Kidney disease", "Bone marrow disorders"],
        "causes_high": ["Dehydration", "Polycythemia vera", "Chronic lung disease / COPD", "High altitude living", "Heavy smoking"],
        "symptoms_low": ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands and feet"],
        "symptoms_high": ["Headaches", "Dizziness", "Flushed skin", "Blurred vision", "Blood clots"],
        "food_recommendations": {
            "to_increase": ["Spinach", "Lentils", "Red meat", "Pumpkin seeds", "Fortified cereals", "Vitamin C rich citrus fruits (enhances iron absorption)"],
            "to_avoid": ["Excessive tea/coffee with meals (tannins inhibit iron absorption)"]
        },
        "lifestyle_advice": "Maintain balanced iron intake, stay hydrated, avoid smoking, and pair plant iron with vitamin C.",
        "when_to_see_doctor": "Consult a doctor if hemoglobin is below 10 g/dL or above 18 g/dL, or if experiencing severe breathlessness."
    },
    "wbc": {
        "canonical_name": "White Blood Cell Count",
        "aliases": ["wbc", "white blood cells", "total leucocyte count", "tlc", "leukocytes", "glóbulos blancos", "leucocitos", "leucocytes"],
        "category": "Complete Blood Count",
        "unit": "/uL",
        "reference_ranges": {
            "default": {"min": 4500, "max": 11000, "borderline_low": 4000, "borderline_high": 12000, "critical_low": 2000, "critical_high": 30000}
        },
        "clinical_importance": "Primary component of the immune system responsible for fighting infections.",
        "causes_low": ["Viral infections", "Severe bacterial infection (sepsis)", "Autoimmune conditions", "Bone marrow failure", "Medications (chemotherapy)"],
        "causes_high": ["Bacterial infection", "Acute inflammation", "Physical or emotional stress", "Leukemia", "Tissue damage / burns"],
        "symptoms_low": ["Frequent infections", "Fever", "Mouth sores", "Chills"],
        "symptoms_high": ["Fever", "Fatigue", "Unexplained weight loss", "Night sweats", "Easy bruising"],
        "food_recommendations": {
            "to_increase": ["Citrus fruits", "Garlic", "Ginger", "Yogurt with probiotics", "Almonds", "Green tea"],
            "to_avoid": ["Processed sugars and ultra-processed foods which impair immune function"]
        },
        "lifestyle_advice": "Ensure adequate sleep (7-8 hrs), manage stress, practice hygiene, and stay physically active.",
        "when_to_see_doctor": "Seek medical evaluation if WBC count is persistently above 12,000 /uL or below 3,500 /uL accompanied by fever."
    },
    "rbc": {
        "canonical_name": "Red Blood Cell Count",
        "aliases": ["rbc", "red blood cells", "total rbc count", "erythrocytes", "glóbulos rojos", "eritrocitos", "hématies"],
        "category": "Complete Blood Count",
        "unit": "million/uL",
        "reference_ranges": {
            "default": {"min": 4.2, "max": 5.9, "borderline_low": 3.8, "borderline_high": 6.2, "critical_low": 2.5, "critical_high": 7.0},
            "male": {"min": 4.7, "max": 6.1},
            "female": {"min": 4.2, "max": 5.4}
        },
        "clinical_importance": "Transports oxygen from lungs throughout body tissues.",
        "causes_low": ["Anemia", "Blood loss", "Nutritional deficiencies (B12, Folate, Iron)", "Chronic kidney disease"],
        "causes_high": ["Dehydration", "Congenital heart disease", "COPD / Sleep apnea", "Polycythemia vera"],
        "symptoms_low": ["Fatigue", "Shortness of breath", "Pale skin"],
        "symptoms_high": ["Headache", "Dizziness", "Itchiness after warm shower"],
        "food_recommendations": {
            "to_increase": ["Leafy greens", "Beetroot", "Beans", "Eggs", "Fortified grains"],
            "to_avoid": ["Alcohol excess"]
        },
        "lifestyle_advice": "Regular moderate aerobic exercise supports healthy erythropoiesis.",
        "when_to_see_doctor": "Consult a doctor if RBC count is significantly below range alongside chronic fatigue."
    },
    "platelets": {
        "canonical_name": "Platelet Count",
        "aliases": ["platelets", "platelet count", "plt", "thrombocytes", "plaquetas", "plaquettes", "trombocitos"],
        "category": "Complete Blood Count",
        "unit": "/uL",
        "reference_ranges": {
            "default": {"min": 150000, "max": 450000, "borderline_low": 130000, "borderline_high": 480000, "critical_low": 50000, "critical_high": 800000}
        },
        "clinical_importance": "Crucial for blood clotting and wound healing.",
        "causes_low": ["Dengue / Viral infections", "Idiopathic thrombocytopenic purpura (ITP)", "Liver disease", "Chemotherapy"],
        "causes_high": ["Acute infection / inflammation", "Iron deficiency", "Splenectomy", "Myeloproliferative disorders"],
        "symptoms_low": ["Easy bruising", "Petechiae (tiny red spots)", "Frequent nosebleeds", "Bleeding gums"],
        "symptoms_high": ["Blood clot risk", "Headaches", "Chest pain", "Numbness in hands/feet"],
        "food_recommendations": {
            "to_increase": ["Papaya leaf extract", "Pomegranate", "Pumpkin", "Vitamin K rich spinach and kale"],
            "to_avoid": ["Alcohol", "Quinine drinks"]
        },
        "lifestyle_advice": "Avoid contact sports or high-impact trauma if platelet count is low.",
        "when_to_see_doctor": "Immediate medical care is required if platelets drop below 50,000 /uL or spontaneous bleeding occurs."
    },
    "hematocrit": {
        "canonical_name": "Hematocrit",
        "aliases": ["hematocrit", "hct", "packed cell volume", "pcv"],
        "category": "Complete Blood Count",
        "unit": "%",
        "reference_ranges": {
            "default": {"min": 37.0, "max": 52.0, "borderline_low": 35.0, "borderline_high": 54.0, "critical_low": 25.0, "critical_high": 60.0},
            "male": {"min": 40.7, "max": 50.3},
            "female": {"min": 36.1, "max": 44.3}
        },
        "clinical_importance": "Percentage of total blood volume occupied by red blood cells.",
        "causes_low": ["Anemia", "Overhydration", "Nutritional deficiencies"],
        "causes_high": ["Dehydration", "Polycythemia", "Smoking"],
        "symptoms_low": ["Fatigue", "Weakness"],
        "symptoms_high": ["Headache", "Flushed skin"],
        "food_recommendations": {"to_increase": ["Iron-rich foods"], "to_avoid": []},
        "lifestyle_advice": "Maintain daily hydration (2-3 liters water).",
        "when_to_see_doctor": "Seek evaluation if hematocrit is below 30% or above 55%."
    },

    # --- LIPID PROFILE ---
    "total_cholesterol": {
        "canonical_name": "Total Cholesterol",
        "aliases": ["total cholesterol", "cholesterol", "chol", "colesterol total", "cholestérol total", "cholesterin"],
        "category": "Lipid Profile",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 125, "max": 200, "borderline_high": 239, "high": 240, "critical_high": 300}
        },
        "clinical_importance": "Essential structural component of cell membranes and steroid hormone precursor, but high levels correlate with cardiovascular risk.",
        "causes_low": ["Hyperthyroidism", "Malnutrition", "Severe liver disease", "Celiac disease"],
        "causes_high": ["High saturated / trans fat diet", "Physical inactivity", "Genetics (Familial Hypercholesterolemia)", "Hypothyroidism", "Obesity"],
        "symptoms_low": ["Usually asymptomatic", "Hormonal imbalances"],
        "symptoms_high": ["Usually asymptomatic", "Xanthomas (fat deposits under skin in severe cases)", "Chest pain if arterial plaque forms"],
        "food_recommendations": {
            "to_increase": ["Soluble fiber (Oats, Barley, Psyllium)", "Avocados", "Olive oil", "Walnuts", "Fatty fish (Salmon)"],
            "to_avoid": ["Trans fats", "Fried foods", "Processed meats", "Full-fat dairy", "Palm oil"]
        },
        "lifestyle_advice": "Engage in 150 minutes of moderate aerobic exercise per week, quit smoking, and maintain healthy weight.",
        "when_to_see_doctor": "Consult a physician or cardiologist if total cholesterol is above 240 mg/dL or if familial history of early heart disease exists."
    },
    "hdl": {
        "canonical_name": "HDL Cholesterol",
        "aliases": ["hdl", "hdl-c", "high density lipoprotein", "good cholesterol"],
        "category": "Lipid Profile",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 40, "max": 90, "borderline_low": 45, "critical_low": 30}
        },
        "clinical_importance": "'Good cholesterol' that scavenges excess cholesterol from arteries back to the liver for disposal.",
        "causes_low": ["Sedentary lifestyle", "Smoking", "High refined carbohydrate diet", "Type 2 Diabetes", "Obesity"],
        "causes_high": ["Regular aerobic exercise", "Moderate healthy fat consumption", "Estrogen therapy", "Genetics"],
        "symptoms_low": ["Increased cardiovascular risk (no direct physical symptoms)"],
        "symptoms_high": ["Protective against heart disease"],
        "food_recommendations": {
            "to_increase": ["Extra virgin olive oil", "Chia seeds", "Flaxseeds", "Almonds", "Salmon", "Mackerel"],
            "to_avoid": ["Trans fats", "Refined sugars", "Ultra-processed snacks"]
        },
        "lifestyle_advice": "Regular physical activity (brisk walking, swimming) is the most effective way to raise HDL.",
        "when_to_see_doctor": "Consult your doctor if HDL is below 40 mg/dL (men) or below 50 mg/dL (women)."
    },
    "ldl": {
        "canonical_name": "LDL Cholesterol",
        "aliases": ["ldl", "ldl-c", "low density lipoprotein", "bad cholesterol"],
        "category": "Lipid Profile",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 50, "max": 100, "borderline_high": 129, "high": 159, "critical_high": 190}
        },
        "clinical_importance": "'Bad cholesterol' that deposits excess lipids into arterial walls, forming atherosclerotic plaques.",
        "causes_low": ["Severe malnutrition", "Hyperthyroidism"],
        "causes_high": ["Saturated fat intake", "Lack of exercise", "Hypothyroidism", "Genetics", "Diabetes"],
        "symptoms_low": ["Asymptomatic"],
        "symptoms_high": ["Atherosclerosis", "Increased risk of heart attack / stroke"],
        "food_recommendations": {
            "to_increase": ["Plant sterols", "Oat bran", "Legumes", "Nuts", "Apples", "Berries"],
            "to_avoid": ["Butter", "Lard", "Red meat fat", "Deep fried foods", "Bakery items with hydrogenated oils"]
        },
        "lifestyle_advice": "Focus on a Mediterranean-style diet, weight management, and daily movement.",
        "when_to_see_doctor": "Consult a physician if LDL exceeds 160 mg/dL or exceeds 100 mg/dL with existing diabetic risk."
    },
    "triglycerides": {
        "canonical_name": "Triglycerides",
        "aliases": ["triglycerides", "tg", "trig"],
        "category": "Lipid Profile",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 40, "max": 150, "borderline_high": 199, "high": 499, "critical_high": 500}
        },
        "clinical_importance": "Type of fat stored in fat cells used for energy between meals; elevated levels raise heart disease and pancreatitis risk.",
        "causes_low": ["Malnutrition", "Extremely low fat diet", "Hyperthyroidism"],
        "causes_high": ["High simple sugar diet", "Excess alcohol", "Insulin resistance / Diabetes", "Sedentary habit", "Obesity"],
        "symptoms_low": ["Asymptomatic"],
        "symptoms_high": ["Abdominal pain (in acute pancreatitis if > 500 mg/dL)", "Cardiovascular risk"],
        "food_recommendations": {
            "to_increase": ["Omega-3 fatty acids (Walnuts, Chia, Fish oil)"],
            "to_avoid": ["Sugar-sweetened beverages", "Sweets", "Alcohol", "White bread & refined flour"]
        },
        "lifestyle_advice": "Cut down alcohol and refined sugars sharply; exercise daily to burn stored triglycerides.",
        "when_to_see_doctor": "Seek doctor consultation if triglycerides are over 200 mg/dL, or urgently if over 500 mg/dL."
    },

    # --- DIABETES PANEL ---
    "fasting_glucose": {
        "canonical_name": "Fasting Blood Glucose",
        "aliases": ["fasting blood glucose", "fasting glucose", "fbs", "fasting blood sugar", "fbg", "glucosa", "glycémie", "glukose", "nuchternzucker", "fasting sugar", "rbs"],
        "category": "Diabetes Panel",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 70, "max": 99, "borderline_high": 125, "high": 126, "critical_high": 250, "critical_low": 50}
        },
        "clinical_importance": "Measures blood sugar level after an overnight fast of at least 8 hours.",
        "causes_low": ["Excess insulin / diabetic medication dose", "Prolonged fasting", "Severe liver disease", "Addison's disease"],
        "causes_high": ["Insulin resistance / Type 2 Diabetes", "Impaired fasting glucose (Prediabetes)", "Stress / Illness", "Steroid therapy"],
        "symptoms_low": ["Shakiness", "Sweating", "Confusion", "Fast heartbeat", "Dizziness", "Irritability"],
        "symptoms_high": ["Increased thirst (polydipsia)", "Frequent urination (polyuria)", "Fatigue", "Blurred vision", "Slow healing wounds"],
        "food_recommendations": {
            "to_increase": ["Whole grains (Quinoa, Brown rice)", "High-fiber vegetables", "Nuts", "Cinnamon", "Legumes"],
            "to_avoid": ["Refined sugars", "Sodas", "Fruit juices", "White bread", "Pastries"]
        },
        "lifestyle_advice": "Incorporate post-meal 10-minute walks, prioritize sleep hygiene, and avoid high glycemic index meals.",
        "when_to_see_doctor": "Consult a doctor if fasting blood glucose is >= 100 mg/dL (prediabetes threshold) or >= 126 mg/dL."
    },
    "hba1c": {
        "canonical_name": "HbA1c (Glycated Hemoglobin)",
        "aliases": ["hba1c", "glycated hemoglobin", "glycohemoglobin", "a1c"],
        "category": "Diabetes Panel",
        "unit": "%",
        "reference_ranges": {
            "default": {"min": 4.0, "max": 5.6, "borderline_high": 6.4, "high": 6.5, "critical_high": 10.0}
        },
        "clinical_importance": "Provides average blood sugar levels over the past 2 to 3 months.",
        "causes_low": ["Hemolytic anemia", "Recent heavy blood loss", "Chronic kidney failure"],
        "causes_high": ["Uncontrolled Type 1 or Type 2 Diabetes", "Prediabetes (5.7% - 6.4%)", "Iron deficiency anemia"],
        "symptoms_low": ["Hypoglycemic symptoms if caused by overtreatment"],
        "symptoms_high": ["Chronic high blood sugar symptoms: thirst, frequent urination, nerve numbness, eye strain"],
        "food_recommendations": {
            "to_increase": ["Fiber-rich vegetables (Broccoli, Spinach)", "Legumes", "Nuts", "Complex carbohydrates"],
            "to_avoid": ["Ultra-processed sugar", "High carbohydrate snacks", "Sweetened beverages"]
        },
        "lifestyle_advice": "Engage in regular resistance and endurance exercise; monitor glycemic load of meals.",
        "when_to_see_doctor": "Consult a healthcare professional if HbA1c is 5.7% or higher for comprehensive metabolic assessment."
    },
    "pp_glucose": {
        "canonical_name": "Post-Prandial Glucose",
        "aliases": ["pp glucose", "ppbs", "post prandial blood sugar", "2 hour post glucose"],
        "category": "Diabetes Panel",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 70, "max": 139, "borderline_high": 199, "high": 200, "critical_high": 300}
        },
        "clinical_importance": "Measures blood sugar level 2 hours after a meal.",
        "causes_high": ["Impaired glucose tolerance", "Diabetes mellitus", "High carb meal intake"],
        "causes_low": ["Reactive hypoglycemia", "Overmedication"],
        "symptoms_high": ["Post-meal drowsiness", "Excessive thirst"],
        "symptoms_low": ["Post-meal dizziness", "Sweating"],
        "food_recommendations": {"to_increase": ["Proteins and healthy fats with carbs"], "to_avoid": ["Simple sugar meals"]},
        "lifestyle_advice": "Take a light 15-minute walk after lunch and dinner.",
        "when_to_see_doctor": "Consult a physician if 2-hour post-meal glucose is >= 140 mg/dL."
    },

    # --- LIVER FUNCTION TEST ---
    "alt": {
        "canonical_name": "ALT (SGPT)",
        "aliases": ["alt", "sgpt", "alanine aminotransferase", "alanine transaminase", "transaminasa alt", "transaminase alt"],
        "category": "Liver Function",
        "unit": "U/L",
        "reference_ranges": {
            "default": {"min": 7, "max": 45, "borderline_high": 65, "high": 120, "critical_high": 300}
        },
        "clinical_importance": "Enzyme found primarily in liver cells; released into bloodstream when liver cells are injured.",
        "causes_low": ["Normal finding", "Vitamin B6 deficiency"],
        "causes_high": ["Nonalcoholic fatty liver disease (NAFLD)", "Alcoholic liver disease", "Hepatitis (Viral)", "Medication toxicity (Paracetamol, Statins)", "Obesity"],
        "symptoms_low": ["None"],
        "symptoms_high": ["Jaundice (yellowing of skin/eyes)", "Dark urine", "Abdominal pain in upper right side", "Nausea", "Fatigue"],
        "food_recommendations": {
            "to_increase": ["Coffee (shown to support liver health)", "Garlic", "Cruciferous vegetables (Broccoli, Brussels sprouts)", "Green tea", "Grapefruit"],
            "to_avoid": ["Alcohol", "Excess refined sugar", "High fat fried food", "Unnecessary self-medication"]
        },
        "lifestyle_advice": "Avoid alcohol, maintain healthy body mass index, and exercise regularly.",
        "when_to_see_doctor": "Consult a doctor if ALT is elevated above 45 U/L or significantly higher."
    },
    "ast": {
        "canonical_name": "AST (SGOT)",
        "aliases": ["ast", "sgot", "aspartate aminotransferase", "aspartate transaminase"],
        "category": "Liver Function",
        "unit": "U/L",
        "reference_ranges": {
            "default": {"min": 8, "max": 40, "borderline_high": 60, "high": 100, "critical_high": 250}
        },
        "clinical_importance": "Enzyme present in liver, heart, and muscle tissue. Raised levels signal cellular injury.",
        "causes_high": ["Alcoholic hepatitis", "Fatty liver", "Strenuous muscle exercise", "Myocardial injury", "Medication side effects"],
        "causes_low": ["Normal", "Vitamin B6 deficiency"],
        "symptoms_high": ["Fatigue", "Abdominal discomfort", "Dark urine"],
        "food_recommendations": {
            "to_increase": ["Antioxidant-rich berries", "Beetroot juice", "Nuts"],
            "to_avoid": ["Alcohol", "Processed foods"]
        },
        "lifestyle_advice": "Limit alcohol consumption and avoid intense unaccustomed weightlifting right before lab tests.",
        "when_to_see_doctor": "Consult a doctor if AST is persistently above normal range."
    },
    "alp": {
        "canonical_name": "Alkaline Phosphatase (ALP)",
        "aliases": ["alp", "alkaline phosphatase", "alk phos"],
        "category": "Liver Function",
        "unit": "U/L",
        "reference_ranges": {
            "default": {"min": 44, "max": 147, "borderline_high": 180, "critical_high": 350}
        },
        "clinical_importance": "Enzyme related to bile ducts in liver and bone mineralization.",
        "causes_high": ["Bile duct obstruction / Gallstones", "Paget's disease of bone", "Bone growth / Fractures", "Liver cirrhosis"],
        "causes_low": ["Zinc deficiency", "Hypophosphatasia", "Malnutrition"],
        "symptoms_high": ["Itchy skin (pruritus)", "Jaundice", "Bone pain"],
        "food_recommendations": {"to_increase": ["Balanced diet with zinc & vitamin D"], "to_avoid": ["Heavy alcohol"]},
        "lifestyle_advice": "Stay hydrated and get adequate sunlight exposure.",
        "when_to_see_doctor": "Seek evaluation if ALP is over 150 U/L."
    },
    "total_bilirubin": {
        "canonical_name": "Total Bilirubin",
        "aliases": ["total bilirubin", "t.bilirubin", "t bili", "bilirubin total"],
        "category": "Liver Function",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 0.1, "max": 1.2, "borderline_high": 1.9, "high": 2.0, "critical_high": 5.0}
        },
        "clinical_importance": "Yellow pigment produced during normal breakdown of red blood cells, processed by the liver.",
        "causes_high": ["Gilbert's syndrome (benign genetic variation)", "Hepatitis", "Gallstones / Bile duct obstruction", "Hemolytic anemia"],
        "causes_low": ["Low caffeine intake", "Generally not clinically concerning"],
        "symptoms_high": ["Jaundice (yellow eyes/skin)", "Pale stools", "Dark tea-colored urine", "Itchiness"],
        "food_recommendations": {
            "to_increase": ["Hydration", "High-fiber foods"],
            "to_avoid": ["Alcohol", "Fatty meals"]
        },
        "lifestyle_advice": "Avoid alcohol completely if bilirubin is high.",
        "when_to_see_doctor": "Seek prompt medical care if total bilirubin exceeds 2.0 mg/dL or yellowing of eyes appears."
    },

    # --- KIDNEY FUNCTION TEST ---
    "creatinine": {
        "canonical_name": "Serum Creatinine",
        "aliases": ["creatinine", "serum creatinine", "creat", "sr.creatinine"],
        "category": "Kidney Function",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 0.6, "max": 1.2, "borderline_high": 1.4, "high": 1.5, "critical_high": 3.0},
            "male": {"min": 0.7, "max": 1.3},
            "female": {"min": 0.6, "max": 1.1}
        },
        "clinical_importance": "Waste product from normal breakdown of muscle tissue, filtered out almost entirely by healthy kidneys.",
        "causes_low": ["Low muscle mass", "Severe malnutrition", "Pregnancy"],
        "causes_high": ["Chronic Kidney Disease (CKD)", "Acute Kidney Injury", "Dehydration", "High cooked red meat intake", "Heavy creatine supplementation"],
        "symptoms_low": ["Muscle weakness"],
        "symptoms_high": ["Swelling in feet/ankles (edema)", "Decreased urine output", "Nausea", "Fatigue", "Shortness of breath"],
        "food_recommendations": {
            "to_increase": ["Plant-based protein (Beans, Tofu)", "Cranberries", "Apples", "Bell peppers"],
            "to_avoid": ["Excess red meat", "Creatine monohydrate supplements", "Excess sodium / salt"]
        },
        "lifestyle_advice": "Maintain daily water intake, avoid NSAIDs (ibuprofen, naproxen) overuse without doctor approval.",
        "when_to_see_doctor": "Consult a nephrologist or physician if creatinine is above 1.3 mg/dL or rising over time."
    },
    "blood_urea": {
        "canonical_name": "Blood Urea Nitrogen / Urea",
        "aliases": ["urea", "blood urea", "bun", "blood urea nitrogen"],
        "category": "Kidney Function",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 7, "max": 20, "borderline_high": 25, "high": 26, "critical_high": 50}
        },
        "clinical_importance": "Byproduct of protein metabolism excreted by the kidneys.",
        "causes_high": ["Kidney dysfunction", "Dehydration", "High protein diet", "Gastrointestinal bleeding", "Heart failure"],
        "causes_low": ["Severe liver disease", "Low protein diet", "Overhydration"],
        "symptoms_high": ["Fatigue", "Dry itchy skin", "Metallic taste in mouth"],
        "food_recommendations": {"to_increase": ["Adequate hydration"], "to_avoid": ["Excessive animal protein intake"]},
        "lifestyle_advice": "Drink 2.5-3 liters of fluids daily.",
        "when_to_see_doctor": "Consult doctor if urea is over 25 mg/dL."
    },
    "egfr": {
        "canonical_name": "eGFR (Estimated Glomerular Filtration Rate)",
        "aliases": ["egfr", "estimated gfr", "gfr"],
        "category": "Kidney Function",
        "unit": "mL/min/1.73m2",
        "reference_ranges": {
            "default": {"min": 90, "max": 120, "borderline_low": 60, "critical_low": 30}
        },
        "clinical_importance": "Best overall measure of kidney filtering function.",
        "causes_low": ["Chronic kidney disease", "Diabetes damage (Diabetic nephropathy)", "Hypertension damage", "Glomerulonephritis"],
        "causes_high": ["Hyperfiltration in early stage diabetes", "Pregnancy"],
        "symptoms_low": ["Fluid retention", "Fatigue", "Changes in urination frequency"],
        "food_recommendations": {
            "to_increase": ["Low sodium diet", "Cranberries", "Cabbage"],
            "to_avoid": ["High sodium foods", "Processed meals", "Phosphorus additives"]
        },
        "lifestyle_advice": "Control blood pressure (< 130/80 mmHg) and blood sugar tightly.",
        "when_to_see_doctor": "Consult a doctor immediately if eGFR is below 60 mL/min/1.73m2."
    },

    # --- THYROID PROFILE ---
    "tsh": {
        "canonical_name": "Thyroid Stimulating Hormone (TSH)",
        "aliases": ["tsh", "thyroid stimulating hormone", "ultrasensitive tsh"],
        "category": "Thyroid Profile",
        "unit": "uIU/mL",
        "reference_ranges": {
            "default": {"min": 0.45, "max": 4.5, "borderline_high": 6.0, "high": 6.1, "critical_high": 10.0, "borderline_low": 0.2, "critical_low": 0.1}
        },
        "clinical_importance": "Pituitary hormone that stimulates the thyroid gland to produce T3 and T4.",
        "causes_high": ["Hypothyroidism (Underactive thyroid / Hashimoto's)", "Iodine deficiency", "Thyroid surgery recovery"],
        "causes_low": ["Hyperthyroidism (Overactive thyroid / Graves' disease)", "Excess thyroid hormone medication"],
        "symptoms_high": ["Weight gain", "Fatigue", "Cold intolerance", "Dry skin", "Constipation", "Depression"],
        "symptoms_low": ["Unexplained weight loss", "Rapid heart rate (tachycardia)", "Heat intolerance", "Anxiety", "Tremors"],
        "food_recommendations": {
            "to_increase": ["Iodized salt", "Seafood", "Brazil nuts (Selenium)", "Eggs", "Dairy"],
            "to_avoid": ["Excessive raw cruciferous vegetables (Cabbage, Broccoli in huge raw amounts if iodine deficient)"]
        },
        "lifestyle_advice": "Maintain stress management, regular sleep, and check T3/T4 if TSH is outside limits.",
        "when_to_see_doctor": "Consult an endocrinologist if TSH is below 0.4 uIU/mL or above 4.5 uIU/mL."
    },
    "free_t3": {
        "canonical_name": "Free T3 (Triiodothyronine)",
        "aliases": ["free t3", "ft3", "free triiodothyronine"],
        "category": "Thyroid Profile",
        "unit": "pg/mL",
        "reference_ranges": {
            "default": {"min": 2.0, "max": 4.4, "borderline_low": 1.8, "borderline_high": 4.8}
        },
        "clinical_importance": "Active form of thyroid hormone circulating unbound in blood.",
        "causes_high": ["Hyperthyroidism", "Thyroiditis"],
        "causes_low": ["Hypothyroidism", "Non-thyroidal illness syndrome"],
        "symptoms_high": ["Palpitations", "Sweating", "Insomnia"],
        "symptoms_low": ["Fatigue", "Sluggishness"],
        "food_recommendations": {"to_increase": ["Selenium and zinc rich foods"], "to_avoid": ["Processed sugars"]},
        "lifestyle_advice": "Manage stress and maintain thyroid health checks.",
        "when_to_see_doctor": "Consult a doctor if FT3 is abnormal alongside TSH anomalies."
    },
    "free_t4": {
        "canonical_name": "Free T4 (Thyroxine)",
        "aliases": ["free t4", "ft4", "free thyroxine"],
        "category": "Thyroid Profile",
        "unit": "ng/dL",
        "reference_ranges": {
            "default": {"min": 0.82, "max": 1.77, "borderline_low": 0.7, "borderline_high": 1.9}
        },
        "clinical_importance": "Main hormone produced by the thyroid gland, converted into active T3 in body tissues.",
        "causes_high": ["Hyperthyroidism", "Toxic nodular goiter"],
        "causes_low": ["Hypothyroidism", "Pituitary failure"],
        "symptoms_high": ["Weight loss", "Nervousness"],
        "symptoms_low": ["Cold sensitivity", "Weight gain"],
        "food_recommendations": {"to_increase": ["Iodine and selenium balanced diet"], "to_avoid": ["Soy isolates excess"]},
        "lifestyle_advice": "Take thyroid medication on an empty stomach in the morning if prescribed.",
        "when_to_see_doctor": "Consult your physician for comprehensive thyroid panel interpretation."
    },

    # --- VITAMINS & MINERALS ---
    "vitamin_d": {
        "canonical_name": "Vitamin D (25-OH)",
        "aliases": ["vitamin d", "25-oh vitamin d", "vitamin d3", "25 hydroxyvitamin d", "vit d"],
        "category": "Vitamins & Minerals",
        "unit": "ng/mL",
        "reference_ranges": {
            "default": {"min": 30.0, "max": 100.0, "borderline_low": 20.0, "critical_low": 10.0, "critical_high": 120.0}
        },
        "clinical_importance": "Crucial fat-soluble vitamin for calcium absorption, bone strength, immune defense, and mood regulation.",
        "causes_low": ["Lack of sun exposure", "Dark skin pigmentation", "Malabsorption / Celiac disease", "Obesity", "Strict vegan diet without supplementation"],
        "causes_high": ["Excessive vitamin D supplement megadosing"],
        "symptoms_low": ["Bone pain", "Muscle weakness", "Frequent infections", "Depressive mood", "Fatigue"],
        "symptoms_high": ["Hypercalcemia", "Nausea", "Kidney stones", "Confusion"],
        "food_recommendations": {
            "to_increase": ["Sunlight exposure (15-20 mins daily)", "Fatty fish (Salmon, Mackerel, Sardines)", "Egg yolks", "Fortified milk / orange juice", "Mushrooms exposed to UV"],
            "to_avoid": ["Excessive unmonitored megadoses (>10,000 IU daily without medical supervision)"]
        },
        "lifestyle_advice": "Get safe morning sunlight exposure; take Vitamin D3 with fat-containing meals for optimal absorption.",
        "when_to_see_doctor": "Consult a doctor if Vitamin D is below 20 ng/mL for proper oral supplementation dosage."
    },
    "vitamin_b12": {
        "canonical_name": "Vitamin B12 (Cobalamin)",
        "aliases": ["vitamin b12", "b12", "cobalamin", "cyanocobalamin"],
        "category": "Vitamins & Minerals",
        "unit": "pg/mL",
        "reference_ranges": {
            "default": {"min": 200, "max": 900, "borderline_low": 300, "critical_low": 150}
        },
        "clinical_importance": "Essential for red blood cell formation, neurological function, and DNA synthesis.",
        "causes_low": ["Strict vegetarian/vegan diet", "Pernicious anemia", "Atrophic gastritis", "Metformin medication use", "Gastric bypass surgery"],
        "causes_high": ["Hematologic malignancies", "Liver disease", "High dose supplementation"],
        "symptoms_low": ["Numbness / tingling in hands and feet (neuropathy)", "Memory loss / confusion", "Fatigue", "Swollen smooth tongue (glossitis)"],
        "symptoms_high": ["Rarely symptomatic"],
        "food_recommendations": {
            "to_increase": ["Fish", "Eggs", "Dairy products", "Fortified nutritional yeast", "Red meat"],
            "to_avoid": ["Excessive alcohol (impairs B12 absorption)"]
        },
        "lifestyle_advice": "Vegetarians and vegans should take daily B12 supplements or fortified foods.",
        "when_to_see_doctor": "Consult a doctor if B12 is below 250 pg/mL or if experiencing tingling sensations."
    },
    "iron": {
        "canonical_name": "Serum Iron",
        "aliases": ["serum iron", "iron", "fe"],
        "category": "Vitamins & Minerals",
        "unit": "ug/dL",
        "reference_ranges": {
            "default": {"min": 60, "max": 170, "borderline_low": 50, "critical_low": 30}
        },
        "clinical_importance": "Essential mineral for hemoglobin synthesis and cellular respiration.",
        "causes_low": ["Chronic blood loss", "Inadequate dietary intake", "Poor intestinal absorption"],
        "causes_high": ["Hemochromatosis (iron overload)", "Multiple blood transfusions", "Iron poisoning"],
        "symptoms_low": ["Pale skin", "Fatigue", "Brittle nails", "Cold sensitivity"],
        "symptoms_high": ["Joint pain", "Abdominal pain", "Hyperpigmentation"],
        "food_recommendations": {
            "to_increase": ["Spinach", "Legumes", "Dark poultry", "Organ meats", "Citrus (Vitamin C)"],
            "to_avoid": ["Tea/coffee during meals"]
        },
        "lifestyle_advice": "Combine iron-rich plant foods with vitamin C rich foods.",
        "when_to_see_doctor": "Seek evaluation if serum iron is low alongside low hemoglobin."
    },

    # --- INFLAMMATORY MARKERS ---
    "crp": {
        "canonical_name": "C-Reactive Protein (CRP)",
        "aliases": ["crp", "c-reactive protein", "c reactive protein"],
        "category": "Inflammatory Markers",
        "unit": "mg/L",
        "reference_ranges": {
            "default": {"min": 0.0, "max": 5.0, "borderline_high": 10.0, "high": 10.1, "critical_high": 50.0}
        },
        "clinical_importance": "Acute-phase reactant protein produced by the liver in response to systemic inflammation or acute infection.",
        "causes_high": ["Bacterial or viral infection", "Rheumatoid arthritis / Lupus", "Inflammatory bowel disease (Crohn's/Colitis)", "Tissue injury / Trauma", "Cardiovascular inflammation"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Fever", "Joint pain", "Muscle stiffness", "Fatigue", "Redness/swelling"],
        "food_recommendations": {
            "to_increase": ["Anti-inflammatory diet (Turmeric/Curcumin, Berries, Walnuts, Extra virgin olive oil, Fatty fish)"],
            "to_avoid": ["Trans fats", "Refined sugar", "Ultra-processed fried foods"]
        },
        "lifestyle_advice": "Maintain regular physical activity, stress reduction, and anti-inflammatory nutrition.",
        "when_to_see_doctor": "Seek doctor evaluation if CRP exceeds 10 mg/L to locate the source of systemic inflammation."
    },
    "esr": {
        "canonical_name": "Erythrocyte Sedimentation Rate (ESR)",
        "aliases": ["esr", "sed rate", "erythrocyte sedimentation rate"],
        "category": "Inflammatory Markers",
        "unit": "mm/hr",
        "reference_ranges": {
            "default": {"min": 0, "max": 20, "borderline_high": 30, "high": 31, "critical_high": 80},
            "male": {"min": 0, "max": 15},
            "female": {"min": 0, "max": 20}
        },
        "clinical_importance": "Measures how quickly red blood cells settle at the bottom of a test tube; indirect marker of inflammation.",
        "causes_high": ["Autoimmune diseases", "Chronic infections", "Kidney disease", "Anemia", "Aging"],
        "causes_low": ["Polycythemia", "Sickle cell trait", "Extreme leukocytosis"],
        "symptoms_high": ["Joint pain", "Stiffness", "Low grade fever"],
        "food_recommendations": {"to_increase": ["Anti-inflammatory foods"], "to_avoid": ["Sugar and saturated fat"]},
        "lifestyle_advice": "Focus on anti-inflammatory lifestyle habits.",
        "when_to_see_doctor": "Consult doctor if ESR is significantly elevated above age/gender range."
    },

    # --- URINALYSIS & UROLOGY PANELS ---
    "specific_gravity": {
        "canonical_name": "Urine Specific Gravity",
        "aliases": ["specific gravity", "sp. gr.", "sg", "urine sg"],
        "category": "Urology & Urinalysis",
        "unit": "",
        "reference_ranges": {
            "default": {"min": 1.005, "max": 1.030, "borderline_low": 1.002, "borderline_high": 1.035, "critical_low": 1.001, "critical_high": 1.040}
        },
        "clinical_importance": "Measures kidney concentrating ability and systemic hydration status.",
        "causes_high": ["Dehydration", "Glycosuria", "Proteinuria", "Syndrome of Inappropriate ADH (SIADH)"],
        "causes_low": ["Excessive fluid intake", "Diabetes insipidus", "Early renal failure", "Pyelonephritis"],
        "symptoms_high": ["Dark urine", "Thirst", "Dry mouth"],
        "symptoms_low": ["Frequent pale urination", "Excessive thirst"],
        "food_recommendations": {"to_increase": ["Water", "Electrolyte fluids", "Cucumber", "Watermelon"], "to_avoid": ["Excessive caffeine"]},
        "lifestyle_advice": "Drink 2-3 liters of water daily to maintain healthy kidney filtration.",
        "when_to_see_doctor": "Consult doctor if specific gravity is persistently out of range."
    },
    "urine_ph": {
        "canonical_name": "Urine pH",
        "aliases": ["urine ph", "ph, urine", "ph"],
        "category": "Urology & Urinalysis",
        "unit": "",
        "reference_ranges": {
            "default": {"min": 4.6, "max": 8.0, "borderline_low": 4.5, "borderline_high": 8.5}
        },
        "clinical_importance": "Indicates acid-base balance maintained by renal tubular excretion.",
        "causes_high": ["High vegetarian diet", "Urinary tract infection (Proteus)", "Renal tubular acidosis", "Vomiting"],
        "causes_low": ["High protein meat diet", "Diabetic ketoacidosis", "Starvation", "Diarrhea"],
        "symptoms_high": ["Urinary urgency", "Dysuria"],
        "symptoms_low": ["Burning sensation upon urination"],
        "food_recommendations": {"to_increase": ["Citrus, leafy greens (alkalizing)"], "to_avoid": ["Excessive processed red meat"]},
        "lifestyle_advice": "Maintain balanced intake of plant and protein foods.",
        "when_to_see_doctor": "Consult doctor if associated with kidney stones or UTI."
    },
    "urine_protein": {
        "canonical_name": "Urine Protein / Albumin",
        "aliases": ["urine protein", "protein, urine", "microalbumin", "proteinuria"],
        "category": "Urology & Urinalysis",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 0, "max": 14, "borderline_high": 30, "high": 31, "critical_high": 300}
        },
        "clinical_importance": "Detects early kidney damage or glomerular leakage of proteins.",
        "causes_high": ["Diabetic nephropathy", "Hypertension", "Glomerulonephritis", "Strenuous exercise", "UTI"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Foamy urine", "Swelling in ankles/face (edema)", "Fatigue"],
        "food_recommendations": {"to_increase": ["Moderate plant proteins", "Low sodium foods"], "to_avoid": ["Excessive sodium, high red meat"]},
        "lifestyle_advice": "Control blood pressure and blood glucose tightly.",
        "when_to_see_doctor": "See nephrologist if urine protein is persistently positive."
    },
    "urine_glucose": {
        "canonical_name": "Urine Glucose",
        "aliases": ["urine glucose", "glucose, urine", "glucosuria"],
        "category": "Urology & Urinalysis",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 0, "max": 15, "borderline_high": 50, "high": 51, "critical_high": 250}
        },
        "clinical_importance": "Spillover of blood glucose into urine when blood levels exceed renal threshold (~180 mg/dL).",
        "causes_high": ["Uncontrolled Diabetes Mellitus", "Pregnancy (lowered renal threshold)", "Renal glucosuria"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Excessive thirst", "Frequent urination", "Fatigue"],
        "food_recommendations": {"to_increase": ["High fiber foods, non-starchy vegetables"], "to_avoid": ["Refined sugars, sugary beverages"]},
        "lifestyle_advice": "Monitor fasting blood sugar and HbA1c closely.",
        "when_to_see_doctor": "Consult doctor immediately if glucose is present in urine."
    },
    "urine_rbc": {
        "canonical_name": "Urine Microscopic RBC",
        "aliases": ["urine rbc", "rbc, urine", "urine red blood cells", "hematuria"],
        "category": "Urology & Urinalysis",
        "unit": "/HPF",
        "reference_ranges": {
            "default": {"min": 0, "max": 4, "borderline_high": 8, "high": 9, "critical_high": 30}
        },
        "clinical_importance": "Presence of red blood cells in urine sediment (hematuria).",
        "causes_high": ["Kidney stones", "Urinary tract infection", "Bladder inflammation (cystitis)", "Strenuous exercise", "Prostate enlargement"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Pink/red urine", "Flank pain", "Burning sensation during urination"],
        "food_recommendations": {"to_increase": ["Hydration, cranberry extracts"], "to_avoid": ["Excessive oxalate rich foods if kidney stones present"]},
        "lifestyle_advice": "Drink 2.5-3 liters of water daily.",
        "when_to_see_doctor": "Seek doctor consultation if visible blood or >5 RBC/HPF detected."
    },
    "urine_wbc": {
        "canonical_name": "Urine Microscopic WBC",
        "aliases": ["urine wbc", "wbc, urine", "urine white blood cells", "pyuria"],
        "category": "Urology & Urinalysis",
        "unit": "/HPF",
        "reference_ranges": {
            "default": {"min": 0, "max": 5, "borderline_high": 10, "high": 11, "critical_high": 50}
        },
        "clinical_importance": "Indicates inflammation or immune response within the genitourinary tract.",
        "causes_high": ["Urinary tract infection (Cystitis/Pyelonephritis)", "Urethritis", "Interstitial cystitis", "Renal stones"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Cloudy urine", "Foul smelling urine", "Frequent urgent urination", "Fever"],
        "food_recommendations": {"to_increase": ["Unsweetened cranberry juice, water, probiotics"], "to_avoid": ["Alcohol, spicy foods, caffeine"]},
        "lifestyle_advice": "Do not delay urination, maintain proper hygiene, hydrate well.",
        "when_to_see_doctor": "Seek prompt medical care if elevated WBC is accompanied by fever or back pain."
    },
    "psa": {
        "canonical_name": "Prostate-Specific Antigen (PSA)",
        "aliases": ["psa", "total psa", "prostate specific antigen"],
        "category": "Urology & Urinalysis",
        "unit": "ng/mL",
        "reference_ranges": {
            "default": {"min": 0.0, "max": 4.0, "borderline_high": 7.0, "high": 7.1, "critical_high": 20.0}
        },
        "clinical_importance": "Glycoprotein enzyme produced by prostate gland epithelial cells.",
        "causes_high": ["Benign Prostatic Hyperplasia (BPH)", "Prostatitis", "Prostate Cancer", "Recent ejaculation", "Urinary retention"],
        "causes_low": ["Normal finding"],
        "symptoms_high": ["Weak urine stream", "Difficulty starting urination", "Frequent night urination (nocturia)"],
        "food_recommendations": {"to_increase": ["Cooked tomatoes (lycopene), green tea, pomegranate, pumpkin seeds"], "to_avoid": ["High intake of dairy and processed red meat"]},
        "lifestyle_advice": "Regular physical activity, prostate screening above age 50.",
        "when_to_see_doctor": "Consult a urologist if PSA exceeds 4.0 ng/mL."
    },
    "sodium": {
        "canonical_name": "Serum Sodium",
        "aliases": ["sodium", "serum sodium", "na", "s. sodium", "serum na"],
        "category": "Renal & Electrolyte Panel",
        "unit": "mmol/L",
        "reference_ranges": {
            "default": {"min": 136.0, "max": 145.0, "borderline_low": 132.0, "borderline_high": 148.0, "critical_low": 120.0, "critical_high": 160.0}
        },
        "clinical_importance": "Primary extracellular electrolyte regulating fluid balance, nerve conduction, and muscle contraction.",
        "causes_low": ["Excess water intake", "Diuretics", "Heart failure", "SIADH", "Vomiting/Diarrhea"],
        "causes_high": ["Dehydration", "High salt diet", "Diabetes insipidus", "Kidney dysfunction"],
        "symptoms_low": ["Headache", "Confusion", "Nausea", "Fatigue", "Muscle cramps"],
        "symptoms_high": ["Thirst", "Restlessness", "Weakness", "Irritability"],
        "food_recommendations": {"to_increase": ["Electrolyte fluids", "Soups"], "to_avoid": []},
        "lifestyle_advice": "Maintain balanced fluid and electrolyte intake.",
        "when_to_see_doctor": "Consult a physician if sodium is below 130 mmol/L or above 150 mmol/L."
    },
    "uric_acid": {
        "canonical_name": "Serum Uric Acid",
        "aliases": ["uric acid", "serum uric acid", "s. uric acid", "urate"],
        "category": "Renal & Metabolic Panel",
        "unit": "mg/dL",
        "reference_ranges": {
            "default": {"min": 3.5, "max": 7.2, "borderline_high": 8.0, "high": 8.1, "critical_high": 10.5},
            "male": {"min": 3.5, "max": 7.2},
            "female": {"min": 2.6, "max": 6.0}
        },
        "clinical_importance": "Waste product formed from purine breakdown; elevated levels can form painful gout crystals in joints.",
        "causes_high": ["High purine diet (red meat, seafood, beer)", "Kidney dysfunction", "Dehydration", "Obesity"],
        "causes_low": ["Low purine diet", "High vitamin C intake"],
        "symptoms_high": ["Joint pain", "Joint swelling", "Redness"],
        "symptoms_low": ["Asymptomatic"],
        "food_recommendations": {"to_increase": ["Cherries", "Low-fat dairy", "Water"], "to_avoid": ["Red meat", "Seafood", "Alcohol"]},
        "lifestyle_advice": "Stay well hydrated with 3 liters of water daily.",
        "when_to_see_doctor": "Consult a doctor if uric acid is > 7.0 mg/dL accompanied by joint pain."
    },
    "urea_creatinine_ratio": {
        "canonical_name": "Urea / Creatinine Ratio",
        "aliases": ["urea / creatinine ratio", "urea/creatinine ratio", "urea creatinine ratio"],
        "category": "Kidney Function",
        "unit": "",
        "reference_ranges": {
            "default": {"min": 10.0, "max": 20.0, "borderline_high": 25.0, "high": 25.1, "critical_high": 40.0}
        },
        "clinical_importance": "Evaluates kidney perfusion and differentiates pre-renal, renal, and post-renal azotemia.",
        "causes_high": ["Dehydration", "High protein diet"],
        "causes_low": ["Severe liver disease", "Low protein diet"],
        "symptoms_high": ["Dehydration symptoms"],
        "symptoms_low": ["Asymptomatic"],
        "food_recommendations": {"to_increase": ["Hydration"], "to_avoid": []},
        "lifestyle_advice": "Ensure adequate fluid intake.",
        "when_to_see_doctor": "Discuss ratio results with your physician."
    },
    "bun_creatinine_ratio": {
        "canonical_name": "BUN / Creatinine Ratio",
        "aliases": ["bun / creatinine ratio", "bun/creatinine ratio", "bun creatinine ratio"],
        "category": "Kidney Function",
        "unit": "",
        "reference_ranges": {
            "default": {"min": 10.0, "max": 20.0, "borderline_high": 25.0, "high": 25.1, "critical_high": 40.0}
        },
        "clinical_importance": "Ratio of Blood Urea Nitrogen to Creatinine used to evaluate renal function and hydration.",
        "causes_high": ["Dehydration", "Pre-renal acute kidney injury"],
        "causes_low": ["Low protein diet", "Starvation"],
        "symptoms_high": ["Thirst", "Reduced urine output"],
        "symptoms_low": ["Asymptomatic"],
        "food_recommendations": {"to_increase": ["Water"], "to_avoid": []},
        "lifestyle_advice": "Maintain healthy fluid intake.",
        "when_to_see_doctor": "Consult your physician for personalized evaluation."
    },
    "potassium": {
        "canonical_name": "Serum Potassium",
        "aliases": ["potassium", "serum potassium", "k", "s. potassium"],
        "category": "Renal & Electrolyte Panel",
        "unit": "mmol/L",
        "reference_ranges": {
            "default": {"min": 3.5, "max": 5.1, "borderline_low": 3.3, "borderline_high": 5.3, "critical_low": 2.8, "critical_high": 6.5}
        },
        "clinical_importance": "Vital electrolyte essential for cardiac muscle function and electrical cardiac signaling.",
        "causes_low": ["Diuretics", "Vomiting", "Diarrhea"],
        "causes_high": ["Kidney disease", "ACE inhibitors"],
        "symptoms_low": ["Muscle weakness", "Palpitations"],
        "symptoms_high": ["Numbness", "Chest pain"],
        "food_recommendations": {"to_increase": ["Bananas", "Potatoes", "Spinach"], "to_avoid": []},
        "lifestyle_advice": "Monitor electrolyte levels regularly.",
        "when_to_see_doctor": "Urgent medical evaluation if potassium is < 3.0 mmol/L or > 5.5 mmol/L."
    }
}


def get_biomarker_kb_entry(param_name: str) -> Optional[Dict[str, Any]]:
    """Retrieve KB entry for a parameter name or alias."""
    name_clean = param_name.lower().strip()
    
    # Direct match
    if name_clean in MEDICAL_KNOWLEDGE_BASE:
        return MEDICAL_KNOWLEDGE_BASE[name_clean]
        
    # Alias match
    for key, entry in MEDICAL_KNOWLEDGE_BASE.items():
        if name_clean in entry.get("aliases", []):
            return entry
            
    return None
