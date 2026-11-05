import React, { useState } from 'react';
import { useReportsQuery, useDeleteReportMutation } from '../lib/queries';
import { getReportPdfExportUrl } from '../lib/api';
import { ReportCard } from '../components/reports/ReportCard';
import { CompareModal } from '../components/reports/CompareModal';
import { Button } from '../components/ui/button';
import { ShinyButton } from '../components/ui/ShinyButton';
import { GradientText } from '../components/ui/GradientText';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Search, ArrowRightLeft, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '../lib/store';

interface ReportsPageProps {
  onOpenUploadModal: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onOpenUploadModal }) => {
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const { selectedComparisonIds, toggleComparisonId, clearComparisonIds } = useUIStore();
  const { data: reports = [], isLoading } = useReportsQuery(search, selectedRisk === 'All' ? undefined : selectedRisk);
  const deleteMutation = useDeleteReportMutation();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this clinical report record?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Report record deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete report');
        },
      });
    }
  };

  const handleDownloadPdf = (id: string) => {
    const pdfUrl = getReportPdfExportUrl(id);
    window.open(pdfUrl, '_blank');
    toast.info('Opening PDF document...');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in-50 slide-in-from-top-4 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              <GradientText>Clinical Reports Workspace</GradientText>
            </h1>
            <Badge variant="slate">{reports.length} Archived</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Document management for laboratory test panels, diagnostic PDFs, and extracted biomarker analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedComparisonIds.length > 0 && (
            <Button
              variant="outline"
              onClick={clearComparisonIds}
              className="text-xs"
            >
              Clear Selection ({selectedComparisonIds.length})
            </Button>
          )}

          {reports.length >= 2 && (
            <ShinyButton
              variant={selectedComparisonIds.length === 2 ? 'emerald' : 'outline'}
              onClick={() => setIsCompareOpen(true)}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Compare Reports ({selectedComparisonIds.length}/2)</span>
            </ShinyButton>
          )}

          <ShinyButton onClick={onOpenUploadModal} variant="emerald">
            <Upload className="w-4 h-4" />
            <span>Upload New Report</span>
          </ShinyButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laboratory name or file..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-xs sm:text-sm border border-border bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">Risk Filter:</span>
          {['All', 'Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                selectedRisk === risk
                  ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>


      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Matching Clinical Reports"
          description="No laboratory reports match your active search or risk category filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isSelectedForComparison={selectedComparisonIds.includes(report.id)}
              onToggleCompare={toggleComparisonId}
              onDelete={handleDelete}
              onDownloadPdf={handleDownloadPdf}
            />
          ))}
        </div>
      )}

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        reports={reports}
        selectedIds={selectedComparisonIds}
      />
    </div>
  );
};
