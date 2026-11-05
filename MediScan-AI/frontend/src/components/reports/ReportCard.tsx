import { Buildings } from '@phosphor-icons/react';
import { Eye, ArrowRightLeft, Download, Trash2, Calendar, Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CardHeader, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Report } from '../../types';

interface ReportCardProps {
  report: Report;
  isSelectedForComparison?: boolean;
  onToggleCompare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownloadPdf?: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  isSelectedForComparison = false,
  onToggleCompare,
  onDelete,
  onDownloadPdf,
}) => {
  const getRiskVariant = (risk: string) => {
    if (risk === 'Very Low' || risk === 'Low') return 'healthy';
    if (risk === 'Moderate') return 'warning';
    return 'critical';
  };

  return (
    <SpotlightCard className={`group relative ${isSelectedForComparison ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Buildings className="w-6 h-6 text-primary shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {report.laboratory_name || 'Clinical Diagnostics'}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{report.file_name}</p>
            </div>
          </div>

          <Badge variant={getRiskVariant(report.health_risk_category)} className="whitespace-nowrap shrink-0 text-xs px-2.5 py-1 font-semibold">
            Score: {report.overall_health_score} ({report.health_risk_category})
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-secondary/30 p-2 rounded-lg border border-border/50">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate">
              {(() => {
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
          <div className="flex items-center gap-1.5 bg-secondary/30 p-2 rounded-lg border border-border/50">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{report.biomarkers?.length || 0} Biomarkers</span>
          </div>
        </div>

        {(() => {
          const summaryText = report.ai_summary_text || report.ai_summary_json?.plain_language_summary;
          if (!summaryText) return null;

          let clean = summaryText.trim();
          if (clean.length > 115) {
            const sentences = clean.split(/(?<=\.)\s+/);
            clean = sentences[0] || clean;
            if (clean.length > 115) {
              const truncated = clean.slice(0, 110);
              const lastSpace = truncated.lastIndexOf(' ');
              clean = (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated).trim() + '...';
            }
          }

          return (
            <div className="bg-secondary/20 p-2.5 rounded-lg border border-border/40 overflow-hidden">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                "{clean}"
              </p>
            </div>
          );
        })()}

        {(() => {
          const abnormalBiomarkers = (report.biomarkers || []).filter(b => b.status !== 'normal');
          const abnormalNames = abnormalBiomarkers.map(b => b.canonical_name || b.raw_name);

          return (
            <div className="flex items-center gap-1.5 text-xs pt-1 min-w-0">
              <span className="text-muted-foreground shrink-0 font-medium">Abnormal findings:</span>
              {abnormalNames.length > 0 ? (
                <span className="font-extrabold text-rose-600 dark:text-rose-400 truncate" title={abnormalNames.join(', ')}>
                  {abnormalNames.join(', ')}
                </span>
              ) : (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  None (All Normal)
                </span>
              )}
            </div>
          );
        })()}
      </CardContent>

      <CardFooter className="p-3 bg-secondary/20 border-t flex items-center justify-between gap-2">
        <Link to={`/reports/${report.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full gap-1.5 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Report</span>
          </Button>
        </Link>

        {onToggleCompare && (
          <Button
            variant={isSelectedForComparison ? 'emerald' : 'outline'}
            size="sm"
            onClick={() => onToggleCompare(report.id)}
            title="Select for comparison"
            className="text-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </Button>
        )}

        {onDownloadPdf && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadPdf(report.id)}
            title="Download PDF"
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(report.id)}
            title="Delete report"
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </CardFooter>
    </SpotlightCard>
  );
};
