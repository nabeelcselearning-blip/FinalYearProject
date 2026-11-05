import json
import base64
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from groq import Groq
from app.core.config import settings

_groq_client_instance = None


class TokenTracker:
    """Tracks cumulative AI token consumption across all Groq LLM API calls."""
    def __init__(self):
        self.total_prompt_tokens: int = 0
        self.total_completion_tokens: int = 0
        self.total_tokens: int = 0
        self.total_api_calls: int = 0
        self.call_history: List[Dict[str, Any]] = []

    def record(self, usage: Any, feature_name: str, model_name: str) -> None:
        if not usage:
            return
        prompt_tokens = getattr(usage, "prompt_tokens", 0) or 0
        completion_tokens = getattr(usage, "completion_tokens", 0) or 0
        total_tokens = getattr(usage, "total_tokens", 0) or (prompt_tokens + completion_tokens)

        self.total_prompt_tokens += prompt_tokens
        self.total_completion_tokens += completion_tokens
        self.total_tokens += total_tokens
        self.total_api_calls += 1

        entry = {
            "id": self.total_api_calls,
            "feature": feature_name,
            "model": model_name,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.call_history.append(entry)
        if len(self.call_history) > 100:
            self.call_history.pop(0)

        print(
            f"[AI Token Usage] Call #{self.total_api_calls} ({feature_name} - {model_name}) | "
            f"Prompt: {prompt_tokens} | Completion: {completion_tokens} | Total: {total_tokens} tokens "
            f"(Cumulative Total: {self.total_tokens} tokens)"
        )

    def get_summary(self) -> Dict[str, Any]:
        return {
            "total_api_calls": self.total_api_calls,
            "total_prompt_tokens": self.total_prompt_tokens,
            "total_completion_tokens": self.total_completion_tokens,
            "total_tokens": self.total_tokens,
            "recent_calls": self.call_history[-20:]
        }


token_tracker = TokenTracker()


def get_token_usage_stats() -> Dict[str, Any]:
    """Returns AI token consumption statistics."""
    return token_tracker.get_summary()


def get_groq_client() -> Optional[Groq]:
    """Lazily initialize Groq API Client."""
    global _groq_client_instance
    if _groq_client_instance is None and settings.GROQ_API_KEY:
        try:
            _groq_client_instance = Groq(api_key=settings.GROQ_API_KEY)
        except Exception as e:
            print(f"[Groq AI Service Init Error]: {e}")
            _groq_client_instance = None
    return _groq_client_instance


def call_groq_with_fallback(
    messages: List[Dict[str, Any]],
    preferred_model: str,
    feature_name: str,
    temperature: float = 0.3,
    max_tokens: int = 500,
    response_format: Optional[Dict[str, str]] = None
) -> Optional[str]:
    """
    Executes a Groq chat completion request with automatic model cascade and exponential backoff retry
    to guarantee high availability and protect against rate limits (HTTP 429).
    """
    client = get_groq_client()
    if not client:
        return None

    raw_candidates = [preferred_model] + settings.FALLBACK_MODELS
    candidate_models = []
    for item in raw_candidates:
        cleaned = item.split("/")[-1] if "/" in item else item
        for variant in [item, cleaned, f"openai/{cleaned}" if not item.startswith("openai/") else cleaned]:
            if variant and variant not in candidate_models:
                candidate_models.append(variant)

    for model in candidate_models:
        for attempt in range(2): # Up to 2 attempts with backoff on rate limits
            try:
                kwargs = {
                    "messages": messages,
                    "model": model,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                if response_format:
                    kwargs["response_format"] = response_format

                res = client.chat.completions.create(**kwargs)
                if hasattr(res, "usage") and res.usage:
                    token_tracker.record(res.usage, feature_name, model)

                if res.choices and len(res.choices) > 0:
                    return res.choices[0].message.content
            except Exception as e:
                err_msg = str(e).lower()
                print(f"[Groq AI Call Warning] Model {model} attempt {attempt + 1} failed: {e}")
                
                # If model fails Groq's strict API-level JSON validation, retry without response_format constraint
                if ("json" in err_msg or "400" in err_msg) and response_format:
                    try:
                        kwargs_no_fmt = {k: v for k, v in kwargs.items() if k != "response_format"}
                        res = client.chat.completions.create(**kwargs_no_fmt)
                        if hasattr(res, "usage") and res.usage:
                            token_tracker.record(res.usage, feature_name, f"{model}")
                        if res.choices and len(res.choices) > 0:
                            return res.choices[0].message.content
                    except Exception as j_err:
                        print(f"[Groq AI Call Warning] Model {model} JSON-mode fallback attempt failed: {j_err}")

                if "rate" in err_msg or "429" in err_msg or "tpm" in err_msg or "rpm" in err_msg:
                    time.sleep(1.0 * (attempt + 1))
                    continue
                else:
                    break # Switch to next candidate model for non-rate-limit errors

    return None


def ocr_image_with_groq_vision(image_bytes: bytes) -> str:
    """
    Extracts text from lab report images using Groq Vision API (llama-3.2-11b-vision-preview).
    Runs completely in the cloud with ZERO server RAM usage (no PyTorch/EasyOCR).
    """
    client = get_groq_client()
    if not client:
        return ""

    try:
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:image/jpeg;base64,{base64_image}"

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Transcribe all text from this medical lab report or clinical document, including non-English lab terms, handwritten doctor notes, circled numbers, and margin annotations. Extract all test names, numerical values, units, and reference ranges cleanly into plain text."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": data_url
                        }
                    }
                ]
            }
        ]

        vision_models = []
        for v in [settings.VISION_MODEL, "qwen/qwen3.6-27b", "llama-3.2-11b-vision-instruct", "llama-3.2-90b-vision-instruct"]:
            if v and v not in vision_models:
                vision_models.append(v)

        for model in vision_models:
            try:
                res = client.chat.completions.create(
                    messages=messages,
                    model=model,
                    temperature=0.1,
                    max_tokens=1000
                )
                if hasattr(res, "usage") and res.usage:
                    token_tracker.record(res.usage, "Groq Vision OCR", model)
                if res.choices and len(res.choices) > 0:
                    text = res.choices[0].message.content
                    print(f"[Groq Vision OCR Success] Extracted {len(text)} characters using {model}.")
                    return text
            except Exception as v_err:
                print(f"[Groq Vision Warning] Model {model} failed: {v_err}")
                continue

    except Exception as e:
        print(f"[Groq Vision OCR Error]: {e}")

    return ""


def generate_report_ai_summary(
    biomarkers: List[Dict[str, Any]],
    health_score: float,
    risk_category: str
) -> Dict[str, Any]:
    """
    Generates plain-language medical summary, key insights, and lifestyle recommendations using Groq Llama 3.3 70B with fallbacks.
    """
    fallback_res = {
        "plain_language_summary": f"Your overall health score is {health_score}/100 with a {risk_category} risk profile based on reference range evaluation.",
        "important_findings": [f"Evaluated {len(biomarkers)} clinical parameters against deterministic medical reference bounds."],
        "normal_parameters_count": sum(1 for b in biomarkers if b.get("status") == "normal"),
        "abnormal_parameters_count": sum(1 for b in biomarkers if b.get("status") != "normal"),
        "lifestyle_suggestions": ["Maintain balanced hydration and discuss findings with your physician."],
        "follow_up_recommendations": ["Schedule routine follow-up lab screening."]
    }

    biomarker_summary = []
    for b in biomarkers[:10]: # Limit to top 10 biomarkers to stay well under token limits
        status_tag = b.get("status", "normal").upper()
        biomarker_summary.append(
            f"- {b['canonical_name']}: {b['value']} {b['unit']} (Status: {status_tag})"
        )

    prompt = f"""
Analyze patient lab findings (Score: {health_score}/100, Risk: {risk_category}):
{chr(10).join(biomarker_summary)}

Return strictly valid JSON:
{{
  "plain_language_summary": "2-sentence patient summary.",
  "important_findings": ["Finding 1", "Finding 2"],
  "normal_parameters_count": {sum(1 for b in biomarkers if b.get("status") == "normal")},
  "abnormal_parameters_count": {sum(1 for b in biomarkers if b.get("status") != "normal")},
  "lifestyle_suggestions": ["Suggestion 1", "Suggestion 2"],
  "follow_up_recommendations": ["Recommendation 1"]
}}
"""

    messages = [
        {"role": "system", "content": "Medical lab educator outputting strictly valid JSON."},
        {"role": "user", "content": prompt}
    ]

    content = call_groq_with_fallback(
        messages=messages,
        preferred_model=settings.FAST_MODEL,
        feature_name="Report AI Summary",
        temperature=0.3,
        max_tokens=750,
        response_format={"type": "json_object"}
    )

    if content:
        try:
            return json.loads(content)
        except Exception as e:
            print(f"[Groq AI Summary JSON Parse Error]: {e}")

    return fallback_res


def generate_report_comparison_summary(
    baseline_date: str,
    current_date: str,
    deltas: List[Dict[str, Any]]
) -> str:
    """Generates comparative progression text between two lab reports."""
    improved = [d['canonical_name'] for d in deltas if d.get('trend_status') == 'improved']
    worsened = [d['canonical_name'] for d in deltas if d.get('trend_status') == 'worsened']

    delta_lines = []
    for d in deltas[:10]:
        delta_lines.append(
            f"- {d['canonical_name']}: Baseline={d['baseline_value']} {d.get('unit','')}, Current={d['current_value']} {d.get('unit','')}, Trend={d.get('trend_status','stable')}"
        )

    data_summary = "\n".join(delta_lines) if delta_lines else "- Biomarkers evaluated were within expected ranges."

    prompt = f"""
You are an expert clinical laboratory analyst. Below is patient lab report comparative data:

Baseline Date: {baseline_date}
Current Date: {current_date}

Biomarker Changes:
{data_summary}

Task: Write a direct, professional 2-sentence clinical summary comparing the baseline report ({baseline_date}) with the current report ({current_date}). Highlight any key improvements or parameters requiring attention.
CRITICAL INSTRUCTION: Do NOT include any disclaimers about AI limits, real-time data, cut-off dates, or medical disclaimers. Output ONLY the 2-sentence clinical comparison summary directly.
"""

    messages = [
        {"role": "system", "content": "You are a clinical laboratory analyst. You evaluate patient lab data provided in the prompt directly and produce concise clinical comparison summaries without disclaimers."},
        {"role": "user", "content": prompt}
    ]

    text = call_groq_with_fallback(
        messages=messages,
        preferred_model=settings.PRIMARY_MODEL,
        feature_name="Report Comparison Summary",
        temperature=0.2,
        max_tokens=250
    )

    if text:
        text = text.strip()
        if "Unfortunately" in text or "cut-off" in text or "real-time" in text:
            text = text.split(". ", 2)[-1]
        return text

    summary_parts = []
    if improved:
        summary_parts.append(f"Notable improvements were recorded in {', '.join(improved[:2])}.")
    if worsened:
        summary_parts.append(f"Parameters such as {', '.join(worsened[:2])} showed elevated levels requiring clinical monitoring.")
    if not summary_parts:
        summary_parts.append("Biomarker parameters remained consistent between baseline and current evaluations.")

    return f"Comparing baseline report ({baseline_date}) to current report ({current_date}): " + " ".join(summary_parts)


HEALTH_KEYWORDS = [
    'health', 'medical', 'medicine', 'doctor', 'patient', 'hospital', 'clinic', 'lab', 'report',
    'test', 'blood', 'biomarker', 'symptom', 'disease', 'condition', 'illness', 'treatment',
    'therapy', 'drug', 'medication', 'dose', 'pill', 'supplement', 'vitamin', 'mineral',
    'nutrition', 'diet', 'food', 'calorie', 'protein', 'carb', 'fat', 'exercise', 'workout',
    'fitness', 'heart', 'liver', 'kidney', 'lung', 'brain', 'stomach', 'skin', 'bone',
    'muscle', 'blood pressure', 'pulse', 'rate', 'glucose', 'sugar', 'cholesterol', 'tsh',
    'thyroid', 'hemoglobin', 'wbc', 'rbc', 'platelet', 'creatinine', 'urea', 'alt', 'ast',
    'bilirubin', 'crp', 'esr', 'hba1c', 'hdl', 'ldl', 'triglyceride', 'cell', 'organ',
    'body', 'fever', 'pain', 'headache', 'fatigue', 'sleep', 'stress', 'mental', 'anxiety',
    'depression', 'wellness', 'hygiene', 'infection', 'virus', 'bacteria', 'cancer', 'tumor',
    'surgery', 'scan', 'mri', 'ct', 'x-ray', 'ultrasound', 'pathology', 'physiology', 'anatomy',
    'hydration', 'water', 'bmi', 'weight', 'height', 'age', 'gender', 'pregnancy', 'cycle'
]

NON_HEALTH_KEYWORDS = [
    # Code & Math
    'write code', 'python code', 'javascript', 'html', 'css', 'react', 'sql', 'database',
    'programming', 'algorithm', 'solve math', 'calculus', 'algebra',
    # Movies, Sports & Entertainment
    'movie', 'actor', 'actress', 'football', 'cricket', 'basketball', 'sports', 'game', 'gaming', 'car', 'vehicle', 'weather', 'forecast', 'tell a joke', 'write an essay', 'poem',
    # Religion & Faith
    'religion', 'religious', 'god', 'church', 'mosque', 'temple', 'bible', 'quran', 'torah', 'prayer', 'faith', 'spiritual', 'theology', 'sin', 'karma', 'afterlife',
    # Politics & Government
    'politics', 'political', 'election', 'president', 'prime minister', 'parliament', 'government', 'democracy', 'voting', 'war', 'military', 'lawmaker', 'capital of', 'who is the president',
    # Social Controversies
    'racism', 'feminism', 'protest', 'social media', 'scandal', 'celebrity',
    # Dangerous, Harmful, Puzzling & Illegal
    'bomb', 'weapon', 'suicide', 'self harm', 'illegal drug', 'cocaine', 'heroin', 'meth', 'hacking', 'dark web', 'occult', 'magic', 'conspiracy', 'riddle', 'puzzle'
]


def is_health_question(text: str) -> bool:
    text_lower = text.lower().strip()
    if any(k in text_lower for k in NON_HEALTH_KEYWORDS):
        return False
    if any(k in text_lower for k in HEALTH_KEYWORDS):
        return True
    if any(g in text_lower for g in ['hi', 'hello', 'hey', 'good morning', 'good evening', 'help', 'what can you do', 'who are you']):
        return True
    return False


def generate_chat_response(messages: List[Dict[str, str]], context_report: Optional[Dict[str, Any]] = None) -> str:
    """Educational AI Health Assistant powered by Groq LLM with strict health-only guardrails and extended conversation memory."""
    user_msg = messages[-1]["content"] if messages else ""

    # Emergency / prescription refusal check
    refusal_keywords = ["diagnose me", "what disease do i have", "prescribe", "dosage for", "what medication should i take", "am i dying"]
    if any(k in user_msg.lower() for k in refusal_keywords):
        return (
            "I cannot diagnose diseases, prescribe medication, or provide emergency medical advice. "
            "MediScan AI is strictly an educational tool. Please consult a qualified licensed physician."
        )

    # Strict non-health question rejection pre-check
    if not is_health_question(user_msg):
        return (
            "I am MediScan AI, a specialized clinical and educational healthcare assistant. "
            "I am trained to answer ONLY health, medical, laboratory, nutrition, physiology, and wellness-related questions. "
            "I do not respond to religious, political, social, coding, or non-health topics. Please feel free to ask any health or medical question!"
        )

    system_prompt = (
        "You are MediScan AI, an expert clinical healthcare, lab biomarker analyst, and educational wellness assistant.\n\n"
        "STRICT SCOPE GUARDRAIL RULES:\n"
        "1. YOU MUST ONLY ANSWER QUESTIONS DIRECTLY RELATED TO HEALTH, MEDICINE, LAB TESTS, BIOMARKERS, NUTRITION, DIET, BODY SYSTEMS, ANATOMY, PHYSIOLOGY, AND WELLNESS.\n"
        "2. YOU MUST STRICTLY REFUSE TO ANSWER ANY RELIGIOUS, POLITICAL, SOCIAL, PSYCHOLOGICAL NON-CLINICAL, PUZZLING, DANGEROUS, ILLEGAL, CODING, OR GENERAL NON-HEALTH QUESTIONS.\n"
        "3. If the user asks a non-health or forbidden question, respond strictly with: 'I am MediScan AI, a specialized clinical and educational healthcare assistant. I am trained to answer only health, medical, laboratory, nutrition, and wellness-related questions. Please feel free to ask any health or medical question!'\n\n"
        "CRITICAL RESPONSE FORMATTING & READABILITY INSTRUCTIONS:\n"
        "1. NEVER USE MARKDOWN TABLES (`| col | col |`). Tables collapse and look cramped on chat screens.\n"
        "2. ALWAYS USE CLEAN BULLETED LISTS AND BOLD HEADERS (`- **Food/Item Name**: Serving size — Key clinical benefit`).\n"
        "3. Divide responses into clear sections using headers (e.g. `### 🩸 1. Low-Glycemic Index Foods`) with generous double line breaks (`\n\n`) between sections and lists.\n"
        "4. Bold key clinical terms (`**Glycemic Index < 55**`, `**Soluble Fiber**`, `**HbA1c**`) for easy scanning.\n"
        "5. Include a distinct callout tip at the end (e.g. `> 💡 **Clinical Tip**: ...`).\n"
        "6. Ensure all paragraphs, bullet points, and headers have clear spacing and breathing room."
    )

    full_msgs = [{"role": "system", "content": system_prompt}] + messages[-7:] # Pass last 7 messages for strong conversation memory

    reply = call_groq_with_fallback(
        messages=full_msgs,
        preferred_model=settings.PRIMARY_MODEL,
        feature_name="AI Health Assistant Chat",
        temperature=0.3,
        max_tokens=800
    )

    if reply:
        return reply

    return (
        "I am MediScan AI, a specialized clinical and educational healthcare assistant. "
        "I am trained to answer only health, medical, laboratory, nutrition, and wellness-related questions. "
        "Please feel free to ask any health or medical question!"
    )


def classify_document_type(ocr_text: str) -> Dict[str, Any]:
    """
    Uses Groq LLM to classify whether OCR text originates from a genuine clinical lab report vs a non-medical document.
    """
    truncated_text = ocr_text[:1200] if len(ocr_text) > 1200 else ocr_text

    prompt = f"""
Analyze the following extracted document text:
\"\"\"
{truncated_text}
\"\"\"

Determine whether this document is a genuine clinical medical laboratory report, pathology test result, or diagnostic panel.
If it is a general document (e.g. internship report, academic book, invoice, resume, manual, code, general letter), return false.

Return strictly valid JSON:
{{
  "is_medical_report": true,
  "confidence": 0.95,
  "reason": "Contains clinical lab parameters, specimen reference ranges, and test results."
}}
"""

    messages = [
        {"role": "system", "content": "You are a clinical document classification system outputting strictly JSON."},
        {"role": "user", "content": prompt}
    ]

    content = call_groq_with_fallback(
        messages=messages,
        preferred_model=settings.FAST_MODEL,
        feature_name="Document Type Classification",
        temperature=0.0,
        max_tokens=200,
        response_format={"type": "json_object"}
    )

    if content:
        try:
            res = json.loads(content)
            if isinstance(res, dict) and "is_medical_report" in res:
                return res
        except Exception as e:
            print(f"[Document Classification Parse Error]: {e}")

    return {"is_medical_report": True, "confidence": 0.5, "reason": "Fallback classification"}


def parse_biomarkers_with_llm(ocr_text: str) -> List[Dict[str, Any]]:
    """Parse OCR text using Groq Cloud AI LLM for optimal biomarker extraction fallback."""
    # Truncate text to max 1,500 characters (~350 tokens) to guarantee staying well under Groq 6,000 TPM limit
    truncated_text = ocr_text[:1500] if len(ocr_text) > 1500 else ocr_text

    prompt = f"""
Analyze the OCR text below:
\"\"\"
{truncated_text}
\"\"\"

CRITICAL INSTRUCTION:
1. ONLY extract genuine clinical laboratory biomarkers (e.g. Hemoglobin, Glucose, Cholesterol, TSH, WBC, Platelets, Creatinine, Liver enzymes, etc.).
2. If this document is NOT a medical lab report, or contains NO actual laboratory test values, return an empty array `{"biomarkers": []}`.
3. DO NOT invent, assume, or convert non-medical numbers (such as page numbers, dates, prices, chapter indices, or random text statistics) into biomarkers.

Translate non-English parameter names (e.g. Hemoglobina, Glycémie) to canonical English IDs ("hemoglobin", "glucose", "creatinine", "cholesterol", "tsh", "alt", "ast", "hba1c", "wbc", "rbc", "platelets", "triglycerides", "hdl", "ldl", "urea", "crp", "vitamin_d").

Return strictly valid JSON object:
{{
  "biomarkers": [
    {{"canonical_id": "hemoglobin", "raw_name": "Hemoglobina", "value": 14.2, "unit": "g/dL"}}
  ]
}}
"""

    messages = [
        {"role": "system", "content": "Extract lab parameters from multilingual medical text into JSON format. Do not extract biomarkers from non-medical documents."},
        {"role": "user", "content": prompt}
    ]

    content = call_groq_with_fallback(
        messages=messages,
        preferred_model=settings.FAST_MODEL,
        feature_name="OCR Biomarker LLM Fallback",
        temperature=0.1,
        max_tokens=400,
        response_format={"type": "json_object"}
    )

    if content:
        try:
            parsed = json.loads(content)
            if isinstance(parsed, dict) and "biomarkers" in parsed:
                return parsed["biomarkers"]
            elif isinstance(parsed, list):
                return parsed
        except Exception as e:
            print(f"[Groq LLM Parser Error]: {e}")

    return []

