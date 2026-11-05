import React from 'react';
import { FileText, AlertCircle, Calendar, Activity, CheckCircle2 } from 'lucide-react';

interface QuickStatsProps {
  totalReports: number;
  abnormalCount: number;
  latestUploadDate: string;
  latestHealthScore: number | null;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalReports,
  abnormalCount,
  latestUploadDate,
  latestHealthScore
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Primary KPI Card: Total Uploaded Reports */}
      <div className="card-soft p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground font-heading">
            {totalReports}
          </div>
          <p className="text-meta font-medium text-muted-foreground">Uploaded Lab Reports</p>
        </div>
      </div>

      {/* KPI Card 2: Flagged Abnormal Biomarkers */}
      <div className="card-soft p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          totalReports > 0 && abnormalCount > 0
            ? 'bg-amber-500/10 text-amber-500'
            : totalReports > 0
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-secondary text-muted-foreground'
        }`}>
          {totalReports > 0 && abnormalCount > 0 ? (
            <AlertCircle className="w-5 h-5" />
          ) : totalReports > 0 ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground font-heading">
            {totalReports > 0 ? abnormalCount : '--'}
          </div>
          <p className="text-meta font-medium text-muted-foreground">Abnormal Parameters</p>
        </div>
      </div>

      {/* KPI Card 3: Last Scan Date */}
      <div className="card-soft p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <div className="text-base font-bold text-foreground font-heading truncate">
            {latestUploadDate}
          </div>
          <p className="text-meta font-medium text-muted-foreground">Last Scanned Date</p>
        </div>
      </div>

      {/* KPI Card 4: Health Rating */}
      <div className="card-soft p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
        <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground font-heading">
            {latestHealthScore !== null ? `${latestHealthScore}/100` : '--'}
          </div>
          <p className="text-meta font-medium text-muted-foreground">Health Rating Index</p>
        </div>
      </div>
    </div>
  );
};
