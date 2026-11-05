import React from 'react';

// Health Icons Concept SVG Components
export const KidneyIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.5 2 5.5 4.5 5 8c-.6 4.2 1.5 8 4 10.5 2 2 4.5 3.5 7 3.5 3.5 0 5-2.5 5-5 0-3.5-3-5.5-5-6-1.5-.4-2-1.5-2-3 0-2.2-.8-6-4-6z" />
    <path d="M11 9c.5.8.5 2-.5 3s-2.5 1.5-3 1" />
  </svg>
);

export const LiverIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11c0-4 3.5-7 8.5-7s9.5 2.5 9.5 6.5-3 7.5-8 7.5c-3 0-5-1-6.5-2.5L3 11z" />
    <path d="M11 4v14" />
  </svg>
);

export const ThyroidIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5c-1.5 2-2 5-1 8s3.5 6 5.5 6c1.5 0 2.5-1 2.5-3v-8c0-1.5-1-3-2.5-3S7.5 3 6 5z" />
    <path d="M18 5c1.5 2 2 5 1 8s-3.5 6-5.5 6c-1.5 0-2.5-1-2.5-3v-8c0-1.5 1-3 2.5-3s3-2 4.5 0z" />
    <path d="M9 11h6" />
  </svg>
);

export const BloodCellsIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="8" cy="10" rx="5" ry="4" />
    <ellipse cx="8" cy="10" rx="2" ry="1.5" />
    <ellipse cx="16" cy="14" rx="4.5" ry="3.5" />
    <ellipse cx="16" cy="14" rx="1.8" ry="1.2" />
  </svg>
);

export const DiabetesMeasureIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5L7.5 9a6 6 0 109 0L12 2.5z" />
    <path d="M12 11v4" />
    <path d="M10 13h4" />
  </svg>
);

export const LipidIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
  </svg>
);

export const VitaminMoleculeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <circle cx="5" cy="7" r="2" />
    <circle cx="19" cy="7" r="2" />
    <circle cx="19" cy="17" r="2" />
    <circle cx="5" cy="17" r="2" />
    <path d="M7 8l3.5 2.5M17 8l-3.5 2.5M17 16l-3.5-2.5M7 16l3.5-2.5" />
  </svg>
);

export const InflammationIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-3 4-6 6-6 10a6 6 0 0012 0c0-4-3-6-6-10z" />
    <path d="M12 11c-1 1.5-2 2.5-2 4a2 2 0 004 0c0-1.5-1-2.5-2-4z" fill="currentColor" opacity="0.3" />
  </svg>
);

export function getBiomarkerIcon(name?: string, category?: string): React.FC<{ className?: string }> {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();

  // 1. Blood Cells (Hemoglobin, WBC, RBC, Platelets)
  if (n.includes('hemoglobin') || n.includes('wbc') || n.includes('rbc') || n.includes('platelet') || n.includes('ferritin') || n.includes('iron') || c.includes('cbc') || c.includes('hematology')) {
    return BloodCellsIcon;
  }
  // 2. Diabetes Measure / Blood Drop (Glucose, HbA1c)
  if (n.includes('glucose') || n.includes('hba1c') || n.includes('insulin') || c.includes('metabolic') || c.includes('diabetes')) {
    return DiabetesMeasureIcon;
  }
  // 3. Blood / Lipid (Total Cholesterol, HDL, LDL, Triglycerides)
  if (n.includes('cholesterol') || n.includes('triglyceride') || n.includes('hdl') || n.includes('ldl') || c.includes('lipid') || c.includes('cardio')) {
    return LipidIcon;
  }
  // 4. Thyroid (TSH, Free T3, Free T4)
  if (n.includes('tsh') || n.includes('t3') || n.includes('t4') || c.includes('thyroid') || c.includes('endocrine')) {
    return ThyroidIcon;
  }
  // 5. Kidney (Creatinine, BUN, Urea, eGFR)
  if (n.includes('creatinine') || n.includes('urea') || n.includes('egfr') || n.includes('bun') || c.includes('kidney') || c.includes('renal')) {
    return KidneyIcon;
  }
  // 6. Liver (ALT, AST, Bilirubin, ALP)
  if (n.includes('alt') || n.includes('ast') || n.includes('sgpt') || n.includes('sgot') || n.includes('bilirubin') || c.includes('liver') || c.includes('hepatic')) {
    return LiverIcon;
  }
  // 7. Inflammation (CRP, ESR)
  if (n.includes('crp') || n.includes('esr') || c.includes('inflammation')) {
    return InflammationIcon;
  }
  // 8. Vitamin / Molecule (Vitamin D, B12)
  if (n.includes('vitamin') || c.includes('vitamin')) {
    return VitaminMoleculeIcon;
  }

  return BloodCellsIcon;
}
