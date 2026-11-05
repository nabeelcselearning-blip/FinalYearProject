import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface RiskMeterProps {
  riskCategory: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ riskCategory }) => {
  const levels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  const currentIndex = levels.indexOf(riskCategory);

  const riskColors: Record<string, { bg: string; text: string; bar: string }> = {
    'Very Low': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
    'Low': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', bar: 'bg-teal-500' },
    'Moderate': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
    'High': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', bar: 'bg-orange-500' },
    'Very High': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', bar: 'bg-rose-500' }
  };

  const currentTheme = riskColors[riskCategory] || riskColors['Low'];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl card-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Estimated Risk Category
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${currentTheme.bg} ${currentTheme.text}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            {riskCategory}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Calculated using Blood Sugar, HbA1c, Lipids, Liver, Kidney & BMI profiles.
        </p>
      </div>

      {/* 5-step visual progress bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5 h-3.5">
          {levels.map((lvl, idx) => (
            <div
              key={lvl}
              className={`rounded-sm transition-all ${
                idx <= currentIndex
                  ? currentTheme.bar
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
              title={lvl}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-400 px-0.5">
          <span>Very Low</span>
          <span>Moderate</span>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
};
