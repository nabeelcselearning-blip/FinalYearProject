import React from 'react';
import { useReportsQuery, useHealthTrendsQuery, useProfileQuery, useRemindersQuery, useMedicationInteractionsQuery } from '../lib/queries';
import { RadialHealthScore } from '../components/dashboard/RadialHealthScore';
import { ClinicalInsightPanels } from '../components/dashboard/ClinicalInsightPanels';
import { PatientTimeline } from '../components/dashboard/PatientTimeline';
import { BiomarkerTrendChart } from '../components/trends/BiomarkerTrendChart';
import { Skeleton } from '../components/ui/skeleton';
import { ShinyButton } from '../components/ui/ShinyButton';
import { GradientText } from '../components/ui/GradientText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Upload, Sparkles, Activity, ArrowRight, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEffectiveFollowupRecommendations } from '../lib/recommendations';

interface DashboardProps {
  onOpenUploadModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenUploadModal }) => {
  const { data: reports = [], isLoading: isLoadingReports } = useReportsQuery();
  const { data: trends = [], isLoading: isLoadingTrends } = useHealthTrendsQuery();
  const { data: profile } = useProfileQuery();
  const { data: reminders = [] } = useRemindersQuery('Upcoming');
  const { data: medicationInteractions } = useMedicationInteractionsQuery();

  const [userName, setUserName] = React.useState(() => localStorage.getItem('mediscan_user_name') || 'John Doe');

  React.useEffect(() => {
    const syncName = () => {
      const cached = localStorage.getItem('mediscan_user_name');
      if (cached) setUserName(cached);
    };
    syncName();
    window.addEventListener('mediscan_name_updated', syncName);
    window.addEventListener('storage', syncName);
    return () => {
      window.removeEventListener('mediscan_name_updated', syncName);
      window.removeEventListener('storage', syncName);
    };
  }, []);
  const latestReport = reports[0] || null;
  const previousReport = reports[1] || null;

  const abnormalBiomarkers = latestReport?.biomarkers?.filter(b => b.status !== 'normal') || [];
  const followups = getEffectiveFollowupRecommendations(latestReport);

  if (isLoadingReports || isLoadingTrends) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Patient Workspace Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              <GradientText>Patient Health Workspace</GradientText>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 font-semibold">
            Welcome back, <strong className="text-foreground font-bold">{userName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ShinyButton onClick={onOpenUploadModal} variant="emerald">
            <Upload className="w-4 h-4" />
            <span>Upload Report / Image</span>
          </ShinyButton>

          <Link to="/chat">
            <ShinyButton variant="outline">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Ask AI Assistant</span>
            </ShinyButton>
          </Link>
        </div>
      </div>

      {/* Hero Radial Health Score Widget */}
      {latestReport ? (
        <RadialHealthScore
          score={latestReport.overall_health_score}
          previousScore={previousReport?.overall_health_score || 0}
          riskCategory={latestReport.health_risk_category}
          ocrConfidence={latestReport.ocr_confidence}
          aiConfidence={98}
          lastUpdated={`${latestReport.laboratory_name} • ${latestReport.upload_date}`}
        />
      ) : (
        <EmptyState
          icon={Activity}
          title="No Laboratory Reports Uploaded Yet"
          description="Upload your blood test, lipid panel, metabolic panel, or diagnostic laboratory PDF to generate your clinical health score."
          actionText="Upload First Lab Report"
          onAction={onOpenUploadModal}
        />
      )}

      {/* Row 2: Clinical Insights & Flags */}
      <ClinicalInsightPanels
        abnormalBiomarkers={abnormalBiomarkers}
        recommendations={followups}
        medicationInteractions={medicationInteractions}
        latestReportId={latestReport?.id}
      />

      {/* Row 3: Clinical Trends Workspace Chart & Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <BiomarkerTrendChart trends={trends} />
        </div>

        <div className="lg:col-span-4">
          <SpotlightCard className="h-full flex flex-col justify-between p-0">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-extrabold">Upcoming Reminders</CardTitle>
                </div>
                <Badge variant="slate">{reminders.length}</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3 flex-1">
              {reminders.length > 0 ? (
                reminders.slice(0, 3).map((rem, idx) => (
                  <div key={rem.id || idx} className="p-3 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{rem.title}</span>
                      <Badge variant="slate">{rem.repeat_option}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                      {rem.reminder_date} at {rem.reminder_time}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p>No upcoming reminders scheduled.</p>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t border-border">
              <Link to="/reminders" className="text-xs font-bold text-primary hover:underline flex items-center justify-between">
                <span>Manage Reminders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Row 4: Patient Activity Timeline */}
      <PatientTimeline reports={reports} />
    </div>
  );
};
