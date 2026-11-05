import React, { useState, useMemo } from 'react';
import { useReportsQuery } from '../lib/queries';
import { Biomarker, Report } from '../types';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { EmptyState } from '../components/ui/EmptyState';
import { GradientText } from '../components/ui/GradientText';
import { TestTube2, Search, Filter, AlertTriangle, CheckCircle2, ChevronRight, Activity, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatBiomarkerUnit } from '../lib/utils';
import { getBiomarkerIcon } from '../lib/biomarkerIcons.tsx';

import { HorizontalScrollContainer } from '../components/ui/HorizontalScrollContainer';

export const BiomarkersPage: React.FC = () => {
  const { data: reports = [], isLoading } = useReportsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Extract all unique biomarkers across all reports with their report context
  const allBiomarkers = useMemo(() => {
    const list: Array<Biomarker & { reportId: string; reportName: string; uploadDate: string }> = [];
    reports.forEach((report: Report) => {
      if (report.biomarkers) {
        report.biomarkers.forEach((bm) => {
          list.push({
            ...bm,
            reportId: report.id,
            reportName: report.laboratory_name || report.file_name,
            uploadDate: report.upload_date,
          });
        });
      }
    });
    return list;
  }, [reports]);

  // Comprehensive, medically standardized categories
  const categories = [
    { id: 'all', label: 'All Categories', matchKeys: [] },
    { id: 'cbc', label: 'Hematology (CBC)', matchKeys: ['cbc', 'hematology', 'blood count', 'hemoglobin', 'wbc', 'rbc', 'platelet', 'hematocrit', 'leucocyte', 'erythrocyte'] },
    { id: 'lipids', label: 'Lipids', matchKeys: ['lipid', 'cholesterol', 'hdl', 'ldl', 'vldl', 'triglyceride'] },
    { id: 'glycemic', label: 'Glycemic & Metabolic', matchKeys: ['glycemic', 'diabetes', 'metabolic', 'glucose', 'hba1c', 'sugar', 'insulin', 'homa'] },
    { id: 'hepatic', label: 'Liver (Hepatic)', matchKeys: ['liver', 'hepatic', 'sgpt', 'sgot', 'alt', 'ast', 'alp', 'alkaline phosphatase', 'bilirubin', 'ggt', 'albumin'] },
    { id: 'renal', label: 'Renal (Kidney)', matchKeys: ['renal', 'kidney', 'creatinine', 'urea', 'bun', 'egfr', 'gfr', 'uric acid'] },
    { id: 'electrolytes', label: 'Electrolytes & Minerals', matchKeys: ['electrolyte', 'mineral', 'sodium', 'potassium', 'chloride', 'bicarbonate', 'co2', 'calcium', 'magnesium', 'phosphorus', 'phosphate'] },
    { id: 'thyroid', label: 'Thyroid', matchKeys: ['thyroid', 'tsh', 'ft3', 'ft4', 't3', 't4', 'thyroxine', 'triiodothyronine'] },
    { id: 'vitamins', label: 'Vitamins & Nutrients', matchKeys: ['vitamin', 'vit d', 'vit b12', 'cobalamin', 'iron', 'ferritin', 'transferrin', 'folate', 'nutrient'] },
    { id: 'inflammatory', label: 'Inflammatory & Cardiac', matchKeys: ['inflammatory', 'inflammation', 'cardiac', 'crp', 'esr', 'sed rate', 'homocysteine', 'troponin', 'bnp'] },
    { id: 'urinalysis', label: 'Urinalysis & Urology', matchKeys: ['urinalysis', 'urology', 'urine', 'specific gravity', 'ph', 'proteinuria', 'microalbumin', 'psa'] },
    { id: 'hormones', label: 'Hormones & Endocrine', matchKeys: ['hormone', 'endocrine', 'cortisol', 'testosterone', 'estrogen', 'estradiol', 'dhea', 'progesterone', 'prolactin'] },
  ];

  // Filter biomarkers
  const filteredBiomarkers = useMemo(() => {
    return allBiomarkers.filter((bm) => {
      const nameMatch =
        (bm.raw_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bm.canonical_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bm.category || '').toLowerCase().includes(searchTerm.toLowerCase());

      const activeCatObj = categories.find((c) => c.id === selectedCategory);
      let catMatch = selectedCategory === 'all';
      if (!catMatch && activeCatObj && activeCatObj.matchKeys && activeCatObj.matchKeys.length > 0) {
        const bmCatLower = (bm.category || '').toLowerCase();
        const bmNameLower = `${bm.canonical_name || ''} ${bm.raw_name || ''}`.toLowerCase();
        catMatch = activeCatObj.matchKeys.some((key) => bmCatLower.includes(key) || bmNameLower.includes(key));
      } else if (!catMatch && selectedCategory) {
        catMatch = (bm.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      }

      const statusMatch =
        selectedStatus === 'all' ||
        (selectedStatus === 'abnormal' ? bm.status !== 'normal' : bm.status === selectedStatus);

      return nameMatch && catMatch && statusMatch;
    });
  }, [allBiomarkers, searchTerm, selectedCategory, selectedStatus]);

  // Stats calculation
  const totalCount = allBiomarkers.length;
  const abnormalCount = allBiomarkers.filter(b => b.status !== 'normal').length;
  const criticalCount = allBiomarkers.filter(b => b.status === 'critical' || b.status === 'high').length;
  const normalCount = totalCount - abnormalCount;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              <GradientText>Biomarkers Directory & Explorer</GradientText>
            </h1>
            <Badge variant="healthy">{totalCount} Parameters Extracted</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Comprehensive diagnostic laboratory biomarker database, standard reference intervals, and clinical status analysis.
          </p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground block">Total Extracted</span>
          <span className="text-2xl font-extrabold text-foreground">{totalCount}</span>
          <span className="text-[10px] text-muted-foreground block">Across all scans</span>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Normal Range</span>
          <span className="text-2xl font-extrabold text-foreground">{normalCount}</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Optimal parameters</span>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">Flagged / Outside Range</span>
          <span className="text-2xl font-extrabold text-foreground">{abnormalCount}</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">Require monitoring</span>
        </Card>

        <Card className="p-4 border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 block">Critical Deviations</span>
          <span className="text-2xl font-extrabold text-foreground">{criticalCount}</span>
          <span className="text-[10px] text-red-600 dark:text-red-400 block">High priority flags</span>
        </Card>
      </div>

      {/* Search and Filter Control Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3.5 shadow-xs overflow-hidden">
        {/* Top Bar: Search Input & Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search biomarker name or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-border bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-border shrink-0 self-start sm:self-auto">
            {[
              { id: 'all', label: 'All Parameters' },
              { id: 'normal', label: 'Optimal' },
              { id: 'abnormal', label: 'Flagged' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Category Filter Pills */}
        <HorizontalScrollContainer>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
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

      {/* Biomarkers Grid */}
      {filteredBiomarkers.length === 0 ? (
        <EmptyState
          icon={TestTube2}
          title="No Matching Biomarkers Found"
          description="No diagnostic biomarkers match your current search query or active filter selections."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBiomarkers.map((bm, idx) => {
            const BiomarkerIcon = getBiomarkerIcon(bm.canonical_name || bm.raw_name, bm.category);
            return (
              <SpotlightCard key={`${bm.reportId}-${bm.raw_name}-${idx}`} className="p-4 sm:p-5 space-y-3 rounded-2xl border border-border bg-card shadow-xs">
                {/* Upper Header: Icon, Title, Category & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 text-primary">
                      <BiomarkerIcon className="w-5 h-5" />
                    </div>
                  <div className="truncate">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground truncate font-heading tracking-tight">
                      {bm.canonical_name || bm.raw_name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                      {bm.category || 'General Diagnostic'}
                    </span>
                  </div>
                </div>

                <Badge variant={bm.status === 'normal' ? 'healthy' : bm.status === 'critical' || bm.status === 'high' ? 'critical' : 'warning'}>
                  {bm.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Measured Value & Reference Interval (Clean Layout without Inner Border Boxes) */}
              <div className="py-1 flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Measured Value</span>
                  <span className="text-base sm:text-lg font-bold text-foreground font-sans mt-0.5 block">
                    {bm.value} <span className="text-[11px] text-muted-foreground font-medium">{formatBiomarkerUnit(bm.unit, bm.canonical_name || bm.raw_name)}</span>
                  </span>
                </div>

                {bm.reference_range_str && (
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Reference Interval</span>
                    <span className="text-xs font-sans font-semibold text-foreground mt-0.5 block">{bm.reference_range_str}</span>
                  </div>
                )}
              </div>

              {/* Educational Clinical Explanation (Clean Text without Inner Border Boxes) */}
              {bm.educational_explanation && (
                <p className="text-[11px] text-muted-foreground leading-relaxed font-normal pt-0.5">
                  {bm.educational_explanation}
                </p>
              )}

              {/* Lower Footer: Report Origin & Action Link */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                <span className="text-muted-foreground truncate max-w-[180px] font-normal">
                  Report: <strong className="text-foreground font-medium">{bm.reportName}</strong>
                </span>
                <Link
                  to={`/reports/${bm.reportId}`}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1 shrink-0 transition-all"
                >
                  <span>View Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          );
        })}
        </div>
      )}
    </div>
  );
};
