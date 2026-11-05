import React from 'react';
import { MedicationInteractionResult } from '../../types';
import { Pill, AlertCircle, Utensils, Activity, ShieldAlert, Sparkles } from 'lucide-react';

interface MedicationInteractionCardProps {
  analysis: MedicationInteractionResult;
}

export const MedicationInteractionCard: React.FC<MedicationInteractionCardProps> = ({
  analysis,
}) => {
  if (
    !analysis ||
    (analysis.medication_impacts.length === 0 &&
      analysis.food_interactions.length === 0 &&
      analysis.monitoring_advice.length === 0)
  ) {
    return null;
  }

  return (
    <div className="card-soft p-6 space-y-5 border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="heading-card text-foreground font-heading">
              Medication & Lab Interactions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cross-referenced analysis of tracked medications against clinical biomarkers
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Medication Impact on Lab Results */}
        {analysis.medication_impacts.length > 0 && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-xs font-bold text-foreground font-heading uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" /> Medication Impact on Lab Results
            </h4>
            <div className="space-y-1.5 text-xs text-foreground leading-relaxed">
              {analysis.medication_impacts.map((impact, idx) => (
                <p key={idx}>{impact}</p>
              ))}
            </div>
          </div>
        )}

        {/* Food Interactions */}
        {analysis.food_interactions.length > 0 && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-xs font-bold text-foreground font-heading uppercase tracking-wider flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Utensils className="w-4 h-4" /> Food & Supplement Timing Guidance
            </h4>
            <div className="space-y-1.5 text-xs text-foreground leading-relaxed">
              {analysis.food_interactions.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>
        )}

        {/* Monitoring Advice */}
        {analysis.monitoring_advice.length > 0 && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-xs font-bold text-foreground font-heading uppercase tracking-wider flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
              <Activity className="w-4 h-4" /> Monitoring Recommendations
            </h4>
            <div className="space-y-1.5 text-xs text-foreground leading-relaxed">
              {analysis.monitoring_advice.map((advice, idx) => (
                <p key={idx}>{advice}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Educational Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{analysis.safety_disclaimer}</span>
      </div>
    </div>
  );
};

export default MedicationInteractionCard;
