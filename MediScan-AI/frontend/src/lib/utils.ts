import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBiomarkerUnit(unit?: string, canonicalName?: string): string {
  if (!unit) return '';
  const clean = unit.trim();
  
  // If unit is pure digits or a single character that is not '%', fallback to canonical unit
  if (/^\d+$/.test(clean) || (clean.length <= 1 && clean !== '%')) {
    const name = (canonicalName || '').toLowerCase();
    if (name.includes('free t3') || name.includes('t3')) return 'pg/mL';
    if (name.includes('free t4') || name.includes('t4')) return 'ng/dL';
    if (name.includes('tsh')) return 'uIU/mL';
    if (name.includes('cholesterol') || name.includes('triglyceride') || name.includes('glucose') || name.includes('creatinine') || name.includes('urea') || name.includes('bun')) return 'mg/dL';
    if (name.includes('hemoglobin') || name.includes('hgb')) return 'g/dL';
    if (name.includes('alt') || name.includes('ast') || name.includes('alkaline')) return 'U/L';
    return '';
  }
  
  return clean;
}
