import React from 'react';
import { Upload, Shield, Activity, Calendar, FlaskConical, Sprout } from 'lucide-react';
import { Report } from '../../types';

interface HeroDashboardProps {
  latestReport: Report | null;
  userName?: string;
  onOpenUploadModal: () => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({ latestReport, userName = 'User', onOpenUploadModal }) => {
  // Compute time-of-day greeting
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (currentHour >= 17) {
    timeGreeting = 'Good Evening';
  }

  // Extract firstName only if multi-word name
  const firstName = userName.split(' ')[0] || 'User';


  const healthScore = latestReport ? Math.round(latestReport.overall_health_score) : null;
  const riskCategory = latestReport ? latestReport.health_risk_category : 'N/A';
  const confidence = latestReport ? Math.round((latestReport.ocr_confidence || 0.98) * 100) : null;

  const abnormalBiomarker = latestReport?.biomarkers?.find(b => b.status !== 'normal');
  const keyFindingName = latestReport 
    ? (abnormalBiomarker ? `${abnormalBiomarker.canonical_name} ${abnormalBiomarker.status === 'high' ? 'High' : 'Low'}` : 'All Parameters Normal')
    : 'No Active Lab Reports';
  const keyFindingVal = latestReport
    ? (abnormalBiomarker ? `${abnormalBiomarker.value} ${abnormalBiomarker.unit}` : 'Reference Range OK')
    : 'Upload report to begin';

  // SVG Ring constants
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = healthScore !== null ? circumference - (healthScore / 100) * circumference : circumference;

  return (
    <div className="space-y-4">
      {/* Top Greeting Header Bar (Clean, no upload button) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading tracking-tight flex items-center gap-2">
            {timeGreeting}, {firstName}
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Here's your health overview
          </p>
        </div>
      </div>

      {/* Top Row: Exact 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Health Score */}
        <div className="card-soft p-4 flex items-center justify-between hover:border-primary/40 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Health Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-foreground font-heading">
                {healthScore !== null ? healthScore : '--'}
              </span>
              {healthScore !== null && (
                <span className="text-xs font-semibold text-muted-foreground">
                  /100
                </span>
              )}
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/20">
              {healthScore !== null ? (healthScore >= 80 ? 'Optimal' : healthScore >= 70 ? 'Good' : 'Needs Focus') : 'No Data'}
            </span>
          </div>

          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-border/60"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-primary transition-all duration-1000 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <Activity className="w-3.5 h-3.5 text-primary absolute" />
          </div>
        </div>

        {/* Card 2: Risk Category */}
        <div className="card-soft p-4 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Risk Category
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-500 font-heading">
              {riskCategory}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
              {latestReport ? 'Keep improving' : 'Upload lab report'}
            </p>
          </div>
        </div>

        {/* Card 3: Key Finding */}
        <div className="card-soft p-4 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Key Finding
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-heading truncate" title={keyFindingName}>
              {keyFindingName}
            </div>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
              {keyFindingVal}
            </p>
          </div>
        </div>

        {/* Card 4: AI Confidence */}
        <div className="card-soft p-4 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              AI Confidence
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-foreground font-heading">
              {confidence !== null ? `${confidence}%` : '--'}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
              {confidence !== null ? 'High Confidence' : 'No Active Analysis'}
            </p>
          </div>
        </div>

        {/* Card 5: Next Recommended */}
        <div className="card-soft p-4 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Next Recommended
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-heading truncate">
              {latestReport?.followup_recommendations?.[0]
                ? latestReport.followup_recommendations[0].suggested_timeline
                : (latestReport ? 'All Clear' : 'Upload First Report')}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
              {latestReport?.followup_recommendations?.[0]
                ? latestReport.followup_recommendations[0].test_name
                : (latestReport ? 'No follow-ups needed' : 'Select PDF or scan image')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
