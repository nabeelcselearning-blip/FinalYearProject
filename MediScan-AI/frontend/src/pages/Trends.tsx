import React, { useState } from 'react';
import { useHealthTrendsQuery } from '../lib/queries';
import { BiomarkerTrendChart } from '../components/trends/BiomarkerTrendChart';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { HorizontalScrollContainer } from '../components/ui/HorizontalScrollContainer';

export const TrendsPage: React.FC = () => {
  const { data: trends = [], isLoading } = useHealthTrendsQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Panels' },
    { id: 'cbc', label: 'Hematology (CBC)' },
    { id: 'lipids', label: 'Lipid Profile' },
    { id: 'glycemic', label: 'Glycemic & Metabolic' },
    { id: 'hepatic', label: 'Liver Function' },
    { id: 'renal', label: 'Renal Function' },
    { id: 'electrolytes', label: 'Electrolytes & Minerals' },
    { id: 'thyroid', label: 'Thyroid Panel' },
    { id: 'vitamins', label: 'Vitamins & Nutrients' },
    { id: 'inflammatory', label: 'Inflammatory & Cardiac' },
    { id: 'urinalysis', label: 'Urinalysis & Urology' },
    { id: 'hormones', label: 'Hormones & Endocrine' },
  ];

  const scores = trends.map(t => t.health_score).filter((s): s is number => s !== null && s !== undefined);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const maxScore = scores.length > 0 ? Math.max(...scores) : null;
  const minScore = scores.length > 0 ? Math.min(...scores) : null;

  const firstScore = scores[0] || null;
  const lastScore = scores[scores.length - 1] || null;
  const deltaScore = (lastScore !== null && firstScore !== null) ? (lastScore - firstScore) : null;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Clinical Analytics Workspace</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Longitudinal trend trajectory monitoring across diagnostic panels and biomarker progression over time.
          </p>
        </div>
      </div>

      {/* Segmented Control Panel Selector */}
      <div className="rounded-xl border bg-card p-2 flex items-center gap-2 shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 px-3 text-xs font-semibold text-muted-foreground shrink-0 border-r border-border pr-3">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span>Panel Category:</span>
        </div>
        <HorizontalScrollContainer className="flex-1 min-w-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </HorizontalScrollContainer>
      </div>

      {/* Analytics KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Average Health Rating</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {avgScore !== null ? `${avgScore}/100` : '--'}
          </div>
          <p className="text-[11px] text-muted-foreground">Historical average across scans</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Peak Historical Rating</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {maxScore !== null ? `${maxScore}/100` : '--'}
          </div>
          <p className="text-[11px] text-muted-foreground">Highest recorded health score</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Minimum Historical Rating</span>
            <ArrowDownRight className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {minScore !== null ? `${minScore}/100` : '--'}
          </div>
          <p className="text-[11px] text-muted-foreground">Baseline minimum health score</p>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Overall Trajectory Delta</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {deltaScore !== null ? (
              <span className={deltaScore >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                {deltaScore >= 0 ? `+${deltaScore}` : deltaScore} pts
              </span>
            ) : (
              '--'
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">Net score change over time</p>
        </Card>
      </div>

      {/* Main Interactive Bklit Styled Trend Chart */}
      <BiomarkerTrendChart
        trends={trends}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
};
