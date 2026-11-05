export interface UserProfile {
  id?: number;
  user_id?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height_cm: number;
  weight_kg: number;
  blood_group: string;
  lifestyle: string;
  exercise_frequency: string;
  smoking_status: string;
  alcohol_consumption: string;
  allergies?: string;
  chronic_diseases?: string;
  family_medical_history?: string;
  updated_at?: string;
}

export interface Biomarker {
  id?: number;
  canonical_name: string;
  raw_name: string;
  category: string;
  value: number;
  string_value?: string;
  unit: string;
  reference_min?: number;
  reference_max?: number;
  reference_range_str?: string;
  status: 'low' | 'slightly_low' | 'normal' | 'borderline_high' | 'high' | 'critical';
  color_code: 'green' | 'yellow' | 'orange' | 'red';
  difference_from_normal?: string;
  educational_explanation?: string;
  causes_high?: string[];
  causes_low?: string[];
  symptoms?: string[];
  food_recommendations?: {
    to_increase?: string[];
    to_avoid?: string[];
  };
  lifestyle_advice?: string;
}

export interface ReportSummary {
  plain_language_summary: string;
  important_findings: string[];
  normal_parameters_count: number;
  abnormal_parameters_count: number;
  lifestyle_suggestions: string[];
  follow_up_recommendations: string[];
}

export interface FollowupRecommendation {
  test_name: string;
  reason: string;
  priority: 'Routine' | 'Recommended' | 'Important';
  suggested_timeline: string;
  trigger_biomarker: string;
}

export interface MedicationInteractionResult {
  medication_impacts: string[];
  food_interactions: string[];
  monitoring_advice: string[];
  safety_disclaimer: string;
}

export interface Report {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  upload_date: string;
  laboratory_name: string;
  raw_ocr_text?: string;
  ocr_confidence: number;
  overall_health_score: number;
  health_risk_category: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  abnormal_count: number;
  ai_summary_json?: ReportSummary;
  ai_summary_text?: string;
  biomarkers: Biomarker[];
  followup_recommendations?: FollowupRecommendation[];
  medication_analysis?: MedicationInteractionResult;
}

export interface BiomarkerDelta {
  canonical_name: string;
  category: string;
  unit: string;
  baseline_value: number;
  current_value: number;
  delta_value: number;
  delta_percentage: number;
  trend_status: 'improved' | 'worsened' | 'stable' | 'new_abnormal';
}

export interface ComparisonResult {
  baseline_report_id: string;
  baseline_date: string;
  current_report_id: string;
  current_date: string;
  overall_trend: 'improved' | 'stable' | 'degraded';
  ai_comparison_summary: string;
  deltas: BiomarkerDelta[];
}

export interface HealthTrendPoint {
  report_id: string;
  date: string;
  health_score: number;
  risk_category: string;
  biomarkers: Record<string, number | null>;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface HealthReminder {
  id?: number;
  user_id?: string;
  title: string;
  description?: string;
  reminder_type: 'lab_test' | 'medication' | 'doctor_appointment' | 'water' | 'exercise' | 'sleep' | 'general';
  reminder_date: string;
  reminder_time: string;
  repeat_option: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Upcoming' | 'Completed' | 'Missed';
  created_at?: string;
}

export interface Medication {
  id?: number;
  user_id?: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  notes?: string;
  created_at?: string;
}
