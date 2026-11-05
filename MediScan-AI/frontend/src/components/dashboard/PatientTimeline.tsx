import React from 'react';
import { Clock } from '@phosphor-icons/react';
import { FileText, Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '../ui/card';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/badge';
import { Report } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PatientTimelineProps {
  reports: Report[];
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ reports = [] }) => {
  return (
    <SpotlightCard className="border bg-card shadow-sm" spotlightColor="rgba(2, 132, 199, 0.12)">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <div>
              <CardTitle className="text-sm font-extrabold">Health Journey & Timeline</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Chronological record of lab scans, AI extraction events, and score evolution</p>
            </div>
          </div>
          <Badge variant="slate">{reports.length} Reports Archived</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {reports.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground space-y-2">
            <Clock className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
            <p className="font-bold text-foreground">No Timeline Records</p>
            <p className="max-w-xs mx-auto">Upload your first laboratory PDF or image to generate your health history timeline.</p>
          </div>
        ) : (
          /* Inspira UI Vertical Timeline Container */
          <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-6 space-y-8 py-2">
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="relative pl-6 sm:pl-8"
              >
                {/* Glowing Dot Indicator */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-background bg-primary ring-4 ring-primary/20 shadow-md" />

                <SpotlightCard className="p-5" spotlightColor="rgba(2, 132, 199, 0.12)">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-foreground">{report.laboratory_name || 'Clinical Laboratory'}</span>
                        <Badge variant={report.health_risk_category === 'Low' || report.health_risk_category === 'Very Low' ? 'healthy' : 'warning'}>
                          {report.health_risk_category} Risk
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {report.file_name} • Scanned on {(() => {
                          try {
                            const d = new Date(report.upload_date);
                            return !isNaN(d.getTime()) 
                              ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : report.upload_date;
                          } catch {
                            return report.upload_date;
                          }
                        })()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Health Score</span>
                        <span className="text-base font-extrabold text-foreground">{report.overall_health_score}/100</span>
                      </div>
                      <Link
                        to={`/reports/${report.id}`}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-secondary/20">
                      <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>OCR Accuracy: <strong className="text-foreground">{report.ocr_confidence}%</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-secondary/20">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Flagged Markers: <strong className="text-foreground">{report.abnormal_count} Flagged</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-secondary/20">
                      <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Total Biomarkers: <strong className="text-foreground">{report.biomarkers?.length || 0} Parsed</strong></span>
                    </div>
                  </div>

                  {(() => {
                    const summaryText = report.ai_summary_text || report.ai_summary_json?.plain_language_summary;
                    if (!summaryText) return null;
                    let clean = summaryText.trim();
                    if (clean.length > 120) {
                      const sentences = clean.split(/(?<=\.)\s+/);
                      clean = sentences[0] || clean;
                      if (clean.length > 120) {
                        const truncated = clean.slice(0, 115);
                        const lastSpace = truncated.lastIndexOf(' ');
                        clean = (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated).trim() + '...';
                      }
                    }
                    return (
                      <p className="text-xs text-muted-foreground mt-3 bg-secondary/30 p-3 rounded-xl border border-border/40 font-medium leading-relaxed overflow-hidden">
                        "{clean}"
                      </p>
                    );
                  })()}
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </SpotlightCard>
  );
};
