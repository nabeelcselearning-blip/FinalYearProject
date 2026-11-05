import { Report, FollowupRecommendation } from '../types';

export function getEffectiveFollowupRecommendations(report?: Report | null): FollowupRecommendation[] {
  if (!report) return [];

  if (report.followup_recommendations && report.followup_recommendations.length > 0) {
    return report.followup_recommendations;
  }

  const result: FollowupRecommendation[] = [];
  const abnormal = (report.biomarkers || []).filter(b => b.status !== 'normal');

  abnormal.forEach(b => {
    const nameLower = (b.canonical_name || b.raw_name || '').toLowerCase();
    if (nameLower.includes('cholesterol') || nameLower.includes('triglyceride') || nameLower.includes('hdl') || nameLower.includes('ldl')) {
      if (!result.some(r => r.test_name.includes('Lipid'))) {
        result.push({
          test_name: 'Lipid Profile & Cardio Risk Panel',
          suggested_timeline: 'Within 4-6 weeks',
          reason: 'Monitor lipid particle distribution and response to dietary interventions.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    } else if (nameLower.includes('urea') || nameLower.includes('creatinine') || nameLower.includes('egfr') || nameLower.includes('bun')) {
      if (!result.some(r => r.test_name.includes('Renal'))) {
        result.push({
          test_name: 'Renal Function Panel & Electrolytes',
          suggested_timeline: 'Within 2-4 weeks',
          reason: 'Evaluate kidney filtration capacity and hydration/nitrogen balance.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    } else if (nameLower.includes('glucose') || nameLower.includes('hba1c')) {
      if (!result.some(r => r.test_name.includes('Glycemic'))) {
        result.push({
          test_name: 'Glycemic Control & Fasting Insulin',
          suggested_timeline: 'Within 2-4 weeks',
          reason: 'Track glucose homeostasis and insulin sensitivity.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    } else if (nameLower.includes('tsh') || nameLower.includes('t4') || nameLower.includes('t3')) {
      if (!result.some(r => r.test_name.includes('Thyroid'))) {
        result.push({
          test_name: 'Thyroid Function Re-test (TSH & Free T4)',
          suggested_timeline: 'Within 3-4 weeks',
          reason: 'Verify thyroid hormone synthesis and endocrine baseline.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    } else if (nameLower.includes('alt') || nameLower.includes('ast') || nameLower.includes('bilirubin')) {
      if (!result.some(r => r.test_name.includes('Hepatic'))) {
        result.push({
          test_name: 'Hepatic Function & Liver Enzyme Panel',
          suggested_timeline: 'Within 2-4 weeks',
          reason: 'Monitor liver enzyme activity and biliary excretion.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    } else if (nameLower.includes('hemoglobin') || nameLower.includes('wbc') || nameLower.includes('platelet')) {
      if (!result.some(r => r.test_name.includes('CBC'))) {
        result.push({
          test_name: 'Complete Blood Count (CBC) Differential',
          suggested_timeline: 'Within 2-3 weeks',
          reason: 'Track hematologic cell indices and immune/clotting balance.',
          priority: b.status === 'critical' ? 'Important' : 'Recommended',
          trigger_biomarker: b.canonical_name || b.raw_name
        });
      }
    }
  });

  if (result.length === 0) {
    result.push({
      test_name: 'Routine Health Check & Annual Lab Panel',
      suggested_timeline: 'In 6-12 months',
      reason: 'All current biomarkers fall within optimal reference bounds. Continue routine monitoring.',
      priority: 'Routine',
      trigger_biomarker: 'General Clinical Baseline'
    });
  }

  return result;
}
