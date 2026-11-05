import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, CalendarCheck, ShieldWarning, ArrowRight, CheckCircle, CaretDown, CaretRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { CardHeader, CardTitle, CardContent } from '../ui/card';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/badge';
import { Biomarker, FollowupRecommendation, MedicationInteractionResult } from '../../types';

interface ClinicalInsightPanelsProps {
  abnormalBiomarkers: Biomarker[];
  recommendations?: FollowupRecommendation[];
  medicationInteractions?: MedicationInteractionResult;
  latestReportId?: string;
}

export const ClinicalInsightPanels: React.FC<ClinicalInsightPanelsProps> = ({
  abnormalBiomarkers = [],
  recommendations = [],
  medicationInteractions,
  latestReportId,
}) => {
  const [expandedBiomarkerId, setExpandedBiomarkerId] = useState<number | string | null>(null);

  const toggleExpand = (id: number | string) => {
    setExpandedBiomarkerId(prev => prev === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel 1: AI Findings (Inspira UI + Animate UI) - Expandable Insight Cards */}
      <SpotlightCard className="lg:col-span-1 border bg-card shadow-sm flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.12)">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warning className="w-5 h-5 text-amber-500 shrink-0" />
              <CardTitle className="text-sm font-extrabold">Flagged Biomarkers</CardTitle>
            </div>
            <Badge variant={abnormalBiomarkers.length > 0 ? 'warning' : 'healthy'}>
              {abnormalBiomarkers.length} Flagged
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 flex-1">
          {abnormalBiomarkers.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
              <p className="font-bold text-foreground">All Parameters Within Range</p>
              <p className="max-w-xs mx-auto">No critical biomarker deviations detected in your recent test panels.</p>
            </div>
          ) : (
            abnormalBiomarkers.slice(0, 4).map((bio, idx) => {
              const bioId = bio.id || idx;
              const isExpanded = expandedBiomarkerId === bioId;

              return (
                <motion.div
                  key={bioId}
                  layout
                  className="rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors overflow-hidden cursor-pointer"
                  onClick={() => toggleExpand(bioId)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">{bio.canonical_name || bio.raw_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bio.status === 'critical' || bio.status === 'high' ? 'critical' : 'warning'}>
                        {bio.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <CaretDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <div className="px-3 pb-2.5 flex items-baseline justify-between text-xs border-t border-border/40 pt-2">
                    <span className="text-muted-foreground">{bio.category}</span>
                    <span className="font-mono font-bold text-foreground">
                      {bio.value} <span className="text-[10px] text-muted-foreground font-normal">{bio.unit}</span>
                    </span>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-3 pb-3 pt-1 border-t border-border/40 text-xs space-y-1.5 bg-card/60"
                      >
                        {bio.reference_range_str && (
                          <div className="text-[11px] text-muted-foreground">
                            Normal Range: <strong className="text-foreground">{bio.reference_range_str}</strong>
                          </div>
                        )}
                        {bio.educational_explanation && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                            {bio.educational_explanation}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </CardContent>

        {abnormalBiomarkers.length > 4 && (
          <div className="p-3 border-t text-center">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View all {abnormalBiomarkers.length} flagged biomarkers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </SpotlightCard>

      {/* Panel 2: AI Recommendations & Action Items (Animate UI + shadcn/ui) */}
      <SpotlightCard className="lg:col-span-1 border bg-card shadow-sm flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.12)">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-sky-500 shrink-0" />
              <CardTitle className="text-sm font-extrabold">Follow-Up Actions</CardTitle>
            </div>
            <Badge variant="slate">{recommendations.length} Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 flex-1">
          {recommendations.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
              <CalendarCheck className="w-10 h-10 text-sky-500 mx-auto opacity-70" />
              <p className="font-bold text-foreground">Routine Schedule Clear</p>
              <p className="max-w-xs mx-auto">No immediate diagnostic follow-ups requested by AI intelligence.</p>
            </div>
          ) : (
            recommendations.slice(0, 3).map((rec, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{rec.test_name}</span>
                  <Badge variant={rec.priority === 'Important' ? 'critical' : rec.priority === 'Recommended' ? 'warning' : 'slate'}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{rec.reason}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>Timeline: <strong className="text-foreground">{rec.suggested_timeline}</strong></span>
                  <span>Trigger: {rec.trigger_biomarker}</span>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>

        <div className="p-3 border-t text-center">
          <Link
            to={latestReportId ? `/reports/${latestReportId}?tab=recommendations` : '/reports'}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>View Full Recommendations</span>
            <CaretRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </SpotlightCard>

      {/* Panel 3: Medication & Safety Alerts (Origin UI + Animate UI) */}
      <SpotlightCard className="lg:col-span-1 border bg-card shadow-sm flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.12)">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldWarning className="w-5 h-5 text-emerald-500 shrink-0" />
              <CardTitle className="text-sm font-extrabold">Medication Safety</CardTitle>
            </div>
            <Link to="/medications" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>Tracker</span>
              <CaretRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 flex-1">
          {medicationInteractions?.medication_impacts && medicationInteractions.medication_impacts.length > 0 ? (
            medicationInteractions.medication_impacts.slice(0, 3).map((impact, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="p-3 rounded-xl border border-border bg-secondary/20 shadow-2xs"
              >
                <p className="text-xs text-foreground font-medium leading-relaxed">{impact}</p>
              </motion.div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
              <ShieldWarning className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
              <p className="font-bold text-foreground">No Medication Conflicts</p>
              <p className="max-w-xs mx-auto">Active prescriptions do not interfere with present lab parameters.</p>
            </div>
          )}
          {medicationInteractions?.safety_disclaimer && (
            <p className="text-[10px] text-muted-foreground italic border-t border-border/40 pt-2 mt-2">
              {medicationInteractions.safety_disclaimer}
            </p>
          )}
        </CardContent>
      </SpotlightCard>
    </div>
  );
};
