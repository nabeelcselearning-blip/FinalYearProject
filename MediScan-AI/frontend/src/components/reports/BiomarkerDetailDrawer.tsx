import React, { useState } from 'react';
import { 
  X, 
  HeartPulse, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Dumbbell, 
  Apple, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { Biomarker } from '../../types';

interface BiomarkerDetailDrawerProps {
  biomarker: Biomarker | null;
  onClose: () => void;
}

export const BiomarkerDetailDrawer: React.FC<BiomarkerDetailDrawerProps> = ({ biomarker, onClose }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    measures: true,
    matters: true,
    causes_high: true,
    causes_low: true,
    symptoms: true,
    lifestyle: false,
    diet: false,
    followup: true,
  });

  if (!biomarker) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const statusColors: Record<string, string> = {
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    red: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
  };

  // Helper defaults for fallback educational lookup
  const name = biomarker.canonical_name;
  const status = biomarker.status;

  const whatItMeasures = biomarker.educational_explanation || `${name} measures key biochemical balance in clinical circulation.`;
  const whyItMatters = `Maintaining ${name} within reference target bounds (${biomarker.reference_range_str || 'standard range'}) ensures healthy organ function and metabolic regulation.`;
  
  const causesHigh = biomarker.causes_high && biomarker.causes_high.length > 0 
    ? biomarker.causes_high 
    : ['Dehydration or reduced fluid intake', 'Acute physiological stress or inflammation', 'Dietary or metabolic variations'];
    
  const causesLow = biomarker.causes_low && biomarker.causes_low.length > 0 
    ? biomarker.causes_low 
    : ['Inadequate nutritional intake or malabsorption', 'Chronic health stress or physiological fatigue', 'Increased utilization or excretion'];

  const symptoms = biomarker.symptoms && biomarker.symptoms.length > 0
    ? biomarker.symptoms
    : status.includes('high') || status.includes('critical')
    ? ['Mild fatigue or sluggishness', 'Headaches or restlessness', 'Changes in energy levels']
    : ['General tiredness or low stamina', 'Dizziness on sudden movement', 'Mild weakness or muscle aches'];

  const lifestyle = biomarker.lifestyle_advice || 'Maintain consistent hydration, regular physical activity, and adequate restful sleep to support baseline balance.';
  
  const foodIncrease = biomarker.food_recommendations?.to_increase || ['Nutrient-dense whole foods', 'Fresh vegetables & leafy greens', 'Adequate daily water intake'];
  const foodAvoid = biomarker.food_recommendations?.to_avoid || ['Excessive sodium', 'Processed ultra-refined foods', 'High refined sugar intake'];

  const whenToSeekDoctor = status === 'critical' || status === 'high' || status === 'low'
    ? `Since your ${name} level (${biomarker.value} ${biomarker.unit}) is flagged as ${status.replace('_', ' ')}, schedule a medical review with your doctor within 2–4 weeks to interpret this result alongside your clinical history.`
    : `Your ${name} level is currently within normal ranges. Continue routine annual screening or consult your doctor if you experience new symptoms.`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground w-full max-w-lg h-full overflow-y-auto border-l border-border p-6 shadow-2xl relative flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {biomarker.category}
              </span>
              <h3 className="text-xl font-bold text-foreground font-heading mt-0.5">
                {biomarker.canonical_name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Measured Value Card */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Measured Value</span>
              <div className="text-2xl font-bold text-foreground font-heading mt-0.5">
                {biomarker.value} <span className="text-sm font-normal text-muted-foreground">{biomarker.unit}</span>
              </div>
              <span className="text-xs text-muted-foreground/80 mt-1 block font-medium">
                Target: {biomarker.reference_range_str}
              </span>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColors[biomarker.color_code] || statusColors['green']}`}>
                {biomarker.status.replace('_', ' ').toUpperCase()}
              </span>
              {biomarker.difference_from_normal && (
                <span className="text-xs text-muted-foreground block mt-1">
                  {biomarker.difference_from_normal}
                </span>
              )}
            </div>
          </div>

          {/* 8 Comprehensive Educational Sections Accordion */}
          <div className="space-y-3">
            {/* 1. What this test measures */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('measures')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-500" />
                  1. What This Test Measures
                </span>
                {openSections['measures'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['measures'] && (
                <div className="p-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                  {whatItMeasures}
                </div>
              )}
            </div>

            {/* 2. Why it matters */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('matters')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  2. Why It Matters
                </span>
                {openSections['matters'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['matters'] && (
                <div className="p-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                  {whyItMatters}
                </div>
              )}
            </div>

            {/* 3. Common causes of high values */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('causes_high')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  3. Common Causes of High Values
                </span>
                {openSections['causes_high'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['causes_high'] && (
                <div className="p-3.5 border-t border-border/50">
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {causesHigh.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 4. Common causes of low values */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('causes_low')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-blue-500" />
                  4. Common Causes of Low Values
                </span>
                {openSections['causes_low'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['causes_low'] && (
                <div className="p-3.5 border-t border-border/50">
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {causesLow.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 5. Possible symptoms */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('symptoms')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-500" />
                  5. Possible Symptoms
                </span>
                {openSections['symptoms'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['symptoms'] && (
                <div className="p-3.5 border-t border-border/50">
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {symptoms.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 6. Lifestyle improvements */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('lifestyle')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-indigo-500" />
                  6. Lifestyle Improvements
                </span>
                {openSections['lifestyle'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['lifestyle'] && (
                <div className="p-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                  {lifestyle}
                </div>
              )}
            </div>

            {/* 7. Dietary suggestions */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('diet')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-500" />
                  7. Dietary Suggestions
                </span>
                {openSections['diet'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['diet'] && (
                <div className="p-3.5 border-t border-border/50 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      Recommended Foods:
                    </span>
                    <p className="text-muted-foreground">{foodIncrease.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-0.5">
                      Foods to Limit / Avoid:
                    </span>
                    <p className="text-muted-foreground">{foodAvoid.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 8. When medical follow-up may be appropriate */}
            <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
              <button
                onClick={() => toggleSection('followup')}
                className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-foreground bg-secondary/30 hover:bg-secondary/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-sky-500" />
                  8. When Medical Follow-up is Appropriate
                </span>
                {openSections['followup'] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {openSections['followup'] && (
                <div className="p-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                  {whenToSeekDoctor}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Medical Disclaimer */}
        <div className="pt-4 mt-6 border-t border-border text-xs text-muted-foreground flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <span>
            MediScan AI is strictly an educational tool. Laboratory findings must always be evaluated by a licensed physician in the context of your overall clinical history.
          </span>
        </div>
      </div>
    </div>
  );
};
