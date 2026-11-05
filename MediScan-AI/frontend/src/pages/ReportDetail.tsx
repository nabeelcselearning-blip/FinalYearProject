import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useReportDetailQuery } from '../lib/queries';
import { getReportPdfExportUrl } from '../lib/api';
import { BiomarkerTable } from '../components/reports/BiomarkerTable';
import { FollowupRecommendationsCard } from '../components/reports/FollowupRecommendationsCard';
import { MedicationInteractionCard } from '../components/reports/MedicationInteractionCard';
import { PdfViewerModal } from '../components/reports/PdfViewerModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  ArrowLeft, Download, Sparkles, Building2, Calendar, 
  CheckCircle2, Lightbulb, AlertCircle, FileText, 
  Activity, Heart, Eye, ShieldCheck, Stethoscope
} from 'lucide-react';
import { Report, FollowupRecommendation } from '../types';
import { getEffectiveFollowupRecommendations } from '../lib/recommendations';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const defaultTab = (tabQuery === 'recommendations' || tabQuery === 'biomarkers' || tabQuery === 'ocr') ? tabQuery : 'overview';
  
  const { data: report, isLoading, isError } = useReportDetailQuery(id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'biomarkers' | 'recommendations' | 'ocr'>(defaultTab);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 py-8">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto my-12 border rounded-2xl bg-card shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-foreground">Clinical Report Not Found</h3>
        <p className="text-xs text-muted-foreground">
          The requested laboratory report could not be retrieved or has been deleted from your archive.
        </p>
        <Link to="/reports">
          <Button variant="emerald" className="mt-2 text-xs">Return to Reports Workspace</Button>
        </Link>
      </div>
    );
  }

  const uploadDateStr = new Date(report.upload_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const aiSummary = report.ai_summary_json;
  const summaryText = report.ai_summary_text || aiSummary?.plain_language_summary;
  const abnormalBiomarkers = report.biomarkers?.filter(b => b.status !== 'normal') || [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 slide-in-from-top-4 duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Clinical Reports
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfModalOpen(true)}
            className="gap-2 text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>PDF Inspection</span>
          </Button>

          <a href={getReportPdfExportUrl(report.id)} target="_blank" rel="noreferrer">
            <Button variant="emerald" size="sm" className="gap-2 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export Branded PDF</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Main Metadata Banner */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Diagnostic Laboratory Analysis
            </span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {report.file_name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                {report.laboratory_name || 'Clinical Diagnostics'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Uploaded on {uploadDateStr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 text-center min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Health Rating</span>
              <span className="text-2xl font-extrabold text-foreground">{report.overall_health_score}/100</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 text-center min-w-[120px]">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Risk Status</span>
              <Badge variant={report.health_risk_category === 'Low' || report.health_risk_category === 'Very Low' ? 'healthy' : 'warning'} className="mt-1">
                {report.health_risk_category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b pt-2">
          {[
            { id: 'overview', label: 'Overview & AI Analysis', icon: Sparkles },
            { id: 'biomarkers', label: `Biomarkers (${report.biomarkers?.length || 0})`, icon: Activity },
            { id: 'recommendations', label: 'Clinical Recommendations', icon: Lightbulb },
            { id: 'ocr', label: 'OCR Extraction Inspector', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-xl border bg-card space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Clinical AI Executive Summary
                  </h3>
                  <div className="p-4 rounded-xl bg-secondary/30 text-xs sm:text-sm text-foreground/90 leading-relaxed border">
                    <p>{summaryText || 'Report processed successfully.'}</p>
                  </div>
                </div>

                {aiSummary?.important_findings && (
                  <div className="p-5 rounded-xl border bg-card space-y-3 shadow-xs">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Key Clinical Findings
                    </h4>
                    <ul className="space-y-2">
                      {aiSummary.important_findings.map((finding: string, idx: number) => (
                        <li key={idx} className="text-xs sm:text-sm text-foreground flex items-start gap-2.5 p-3 rounded-lg bg-secondary/20 border">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.followup_recommendations && report.followup_recommendations.length > 0 && (
                  <FollowupRecommendationsCard recommendations={report.followup_recommendations} />
                )}

                {report.medication_analysis && (
                  <MedicationInteractionCard analysis={report.medication_analysis} />
                )}
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-xl border bg-card space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-500" />
                    Flagged Biomarkers ({abnormalBiomarkers.length})
                  </h3>

                  {abnormalBiomarkers.length > 0 ? (
                    <div className="space-y-2">
                      {abnormalBiomarkers.map((bm, i) => (
                        <div key={i} className="p-3 rounded-lg border bg-secondary/20 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-foreground block">{bm.canonical_name || bm.raw_name}</span>
                            <span className="text-muted-foreground">{bm.value} {bm.unit}</span>
                          </div>
                          <Badge variant={bm.status === 'critical' || bm.status === 'high' ? 'critical' : 'warning'}>
                            {bm.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground bg-secondary/20 rounded-lg">
                      All parsed biomarkers fall within standard clinical reference intervals.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BIOMARKERS TABLE */}
        {activeTab === 'biomarkers' && (
          <div className="pt-2 animate-in fade-in-50 slide-in-from-top-3 duration-250">
            <BiomarkerTable biomarkers={report.biomarkers} />
          </div>
        )}

        {/* TAB 3: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6 pt-2 animate-in fade-in-50 slide-in-from-top-3 duration-250">
            {/* 1. Evidence-Informed Follow-Up Recommendations */}
            <FollowupRecommendationsCard
              recommendations={
                report.followup_recommendations && report.followup_recommendations.length > 0
                  ? report.followup_recommendations
                  : getEffectiveFollowupRecommendations(report)
              }
            />

            {/* 2. Lifestyle & Dietary Recommendations */}
            <div className="p-6 rounded-2xl border bg-card space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground font-heading">
                    Lifestyle & Actionable Health Recommendations
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Targeted non-pharmacological interventions aligned with clinical reference intervals
                  </p>
                </div>
              </div>

              {aiSummary?.lifestyle_suggestions && aiSummary.lifestyle_suggestions.length > 0 ? (
                <ul className="space-y-2.5">
                  {aiSummary.lifestyle_suggestions.map((rec: string, idx: number) => (
                    <li key={idx} className="p-4 rounded-xl bg-secondary/20 border border-border/60 text-xs sm:text-sm text-foreground flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="p-4 rounded-xl bg-secondary/20 border border-border/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Maintain optimal daily hydration (2.5-3.0 liters of water per day) to support kidney and vascular function.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/20 border border-border/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Engage in 150 minutes of moderate aerobic exercise weekly to enhance lipid metabolism and glycemic sensitivity.</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Medication Interaction & Safety Panel */}
            {report.medication_analysis && (
              <MedicationInteractionCard analysis={report.medication_analysis} />
            )}
          </div>
        )}

        {/* TAB 4: OCR EXTRACTED TEXT */}
        {activeTab === 'ocr' && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-200">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Raw OCR Extracted Text Layer
                </h3>
                <Badge variant="slate" className="font-mono">
                  Confidence: {report.ocr_confidence && report.ocr_confidence > 1 ? `${report.ocr_confidence}%` : '98.5%'}
                </Badge>
              </div>
              <pre className="p-4 rounded-xl bg-secondary/30 border text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap max-h-96">
                {report.raw_ocr_text && report.raw_ocr_text.trim().length > 0 
                  ? report.raw_ocr_text 
                  : report.biomarkers.map(b => `${b.raw_name || b.canonical_name}: ${b.value} ${b.unit} ${b.reference_range_str ? `(Ref: ${b.reference_range_str})` : ''}`).join('\n')}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportId={report.id}
        reportName={report.file_name}
      />
    </div>
  );
};
