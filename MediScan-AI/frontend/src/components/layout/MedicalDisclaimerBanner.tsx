import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/90 dark:bg-amber-950/30 border-l-4 border-amber-500 border-y border-r border-amber-200/80 dark:border-amber-900/60 p-4 mb-6 rounded-r-xl shadow-2xs">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-normal">
          <span className="font-bold text-amber-900 dark:text-amber-300 mr-1.5">
            EDUCATIONAL & INFORMATIONAL DISCLAIMER:
          </span>
          MediScan AI is intended solely for educational and informational purposes. It does not diagnose, treat, cure, or prevent any disease. AI-generated analyses may contain inaccuracies. Always consult a qualified healthcare professional before making any medical decisions based on your laboratory reports.
        </div>
      </div>
    </div>
  );
};
