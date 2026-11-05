import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Trash2, Calendar, Building2, Eye, Sparkles } from 'lucide-react';
import { Report } from '../../types';
import { getReportPdfExportUrl } from '../../lib/api';

interface RecentReportsListProps {
  reports: Report[];
  onDeleteReport?: (id: string) => void;
}

export const RecentReportsList: React.FC<RecentReportsListProps> = ({ reports, onDeleteReport }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="card-soft p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="heading-card text-foreground">No Laboratory Reports Uploaded</h4>
        <p className="text-meta text-muted-foreground max-w-sm mx-auto">
          Upload your clinical laboratory PDF or image report to extract biomarkers and analyze health indices.
        </p>
      </div>
    );
  }

  const riskBadgeStyles: Record<string, string> = {
    'Very Low': 'badge-muted-green',
    'Low': 'badge-muted-green',
    'Moderate': 'badge-muted-yellow',
    'High': 'badge-muted-orange',
    'Very High': 'badge-muted-red'
  };

  return (
    <div className="card-soft p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="heading-card text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Clinical Reports Archive
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Processed laboratory reports and longitudinal records
          </p>
        </div>
        <Link
          to="/reports"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
        >
          View All ({reports.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {reports.slice(0, 5).map((rpt) => {
          const dateStr = new Date(rpt.upload_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const summaryText = rpt.ai_summary_text || rpt.ai_summary_json?.plain_language_summary;

          return (
            <div
              key={rpt.id}
              className="surface-card p-4 hover:border-border/80 transition-all flex flex-col space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <Link
                      to={`/reports/${rpt.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors font-heading"
                    >
                      {rpt.file_name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{rpt.laboratory_name || 'Clinical Diagnostics'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {dateStr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${riskBadgeStyles[rpt.health_risk_category] || riskBadgeStyles['Low']}`}>
                    {rpt.health_risk_category} Risk
                  </span>
                  <span className="text-xs font-bold text-foreground bg-secondary border border-border px-2.5 py-1 rounded-[8px] font-mono">
                    Score: {rpt.overall_health_score}/100
                  </span>
                </div>
              </div>

              {/* AI Summary Highlight Panel */}
              {(() => {
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
                  <div className="surface-subtle p-2.5 text-xs text-muted-foreground leading-relaxed flex items-start gap-2 overflow-hidden rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="font-medium">{clean}</p>
                  </div>
                );
              })()}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">
                  Biomarkers parsed: <strong className="text-foreground font-semibold">{rpt.biomarkers?.length || 0}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/reports/${rpt.id}`}
                    className="h-8 px-3 rounded-[8px] bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" /> Inspect
                  </Link>

                  <a
                    href={getReportPdfExportUrl(rpt.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 px-3 rounded-[8px] border border-border bg-card text-foreground hover:bg-secondary font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>

                  {onDeleteReport && (
                    <button
                      onClick={() => onDeleteReport(rpt.id)}
                      className="h-8 w-8 rounded-[8px] border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
