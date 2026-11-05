import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Biomarker } from '../../types';

interface MedicalRiskGaugeProps {
  riskCategory: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | null;
  abnormalCount: number;
  biomarkers?: Biomarker[];
}

export const MedicalRiskGauge: React.FC<MedicalRiskGaugeProps> = ({
  riskCategory,
  abnormalCount,
  biomarkers = []
}) => {
  const hasData = riskCategory !== null;
  const levels = ['Very Low', 'Low', 'Moderate', 'High', 'Critical'];
  const mappedCat = riskCategory === 'Very High' ? 'Critical' : (riskCategory || 'Low');
  const activeIndex = hasData ? levels.indexOf(mappedCat) : -1;

  const levelColors: Record<string, { bg: string; bar: string }> = {
    'Very Low': { bg: 'badge-muted-green', bar: 'bg-primary' },
    'Low': { bg: 'badge-muted-green', bar: 'bg-primary/80' },
    'Moderate': { bg: 'badge-muted-yellow', bar: 'bg-amber-500' },
    'High': { bg: 'badge-muted-orange', bar: 'bg-orange-500' },
    'Critical': { bg: 'badge-muted-red', bar: 'bg-rose-500' }
  };

  const currentTheme = levelColors[mappedCat] || levelColors['Low'];
  const abnormalBiomarkers = biomarkers.filter(b => b.status !== 'normal');

  return (
    <div className="card-soft p-5 flex flex-col justify-between h-full space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Estimated Medical Risk Category
          </span>
          {hasData ? (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${currentTheme.bg}`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              {riskCategory} Risk
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-muted-foreground border border-border">
              <ShieldAlert className="w-3.5 h-3.5" />
              No Data
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">
          Calculated using deterministic clinical algorithms across metabolic, lipid, hepatic, renal, and inflammatory parameters.
        </p>

        {/* Horizontal Medical Risk Gauge Bar */}
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-5 gap-1.5 h-2.5">
            {levels.map((lvl, idx) => (
              <div
                key={lvl}
                className={`rounded-sm transition-all ${
                  idx <= activeIndex
                    ? currentTheme.bar
                    : 'bg-secondary border border-border/40'
                }`}
                title={lvl}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Very Low</span>
            <span>Moderate</span>
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Contributing Biomarkers Section */}
      <div className="pt-3 border-t border-border">
        <span className="text-xs font-bold text-foreground mb-2 block">
          Key Contributing Biomarkers ({abnormalBiomarkers.length}):
        </span>
        {!hasData ? (
          <div className="text-xs text-muted-foreground font-medium">
            No biomarkers tracked. Upload a report to get started.
          </div>
        ) : abnormalBiomarkers.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {abnormalBiomarkers.slice(0, 4).map((b, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-[8px] text-xs font-semibold bg-secondary text-foreground border border-border"
              >
                {b.canonical_name}: <span className="font-bold text-primary">{b.value} {b.unit}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All parameters within expected target ranges
          </div>
        )}
      </div>
    </div>
  );
};
