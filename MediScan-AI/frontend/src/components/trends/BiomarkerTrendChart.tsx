import React, { useState, useMemo, useEffect } from 'react';
import { TradeUpIcon } from 'hugeicons-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from 'recharts';
import { HealthTrendPoint } from '../../types';
import { 
  Activity, TrendingUp, TrendingDown, Minus, ShieldCheck, Sparkles, 
  Target, Layers, Zap, Info, Filter, BarChart3, CheckCircle2, ChevronRight, ChevronDown
} from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { CardHeader, CardTitle, CardContent } from '../ui/card';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/badge';

interface BiomarkerTrendChartProps {
  trends: HealthTrendPoint[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

type TimeRangeKey = '3M' | '6M' | '1Y' | 'ALL';

const TIME_RANGE_LABELS: Record<TimeRangeKey, string> = {
  '3M': '3 Months',
  '6M': '6 Months',
  '1Y': '1 Year',
  'ALL': 'All Time'
};

// Custom CountUp Number Component (react-countup style)
const CountUpNumber: React.FC<{ value: number; decimals?: number; prefix?: string; suffix?: string }> = ({
  value,
  decimals = 1,
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // 800ms smooth count up animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOutProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const CATEGORY_BIOMARKER_KEYWORDS: Record<string, string[]> = {
  cbc: ['hemoglobin', 'wbc', 'rbc', 'platelets', 'hematocrit', 'mcv', 'mch', 'mchc', 'rdw', 'neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil', 'cbc', 'blood count', 'leucocyte', 'erythrocyte'],
  lipids: ['cholesterol', 'hdl', 'ldl', 'vldl', 'triglycerides', 'apolipoprotein', 'lipid'],
  glycemic: ['glucose', 'hba1c', 'sugar', 'glycemic', 'insulin', 'homa', 'c-peptide', 'fructosamine'],
  hepatic: ['alt', 'ast', 'sgpt', 'sgot', 'bilirubin', 'alkaline', 'alp', 'ggt', 'albumin', 'globulin', 'protein', 'liver', 'hepatic'],
  renal: ['bun', 'urea', 'creatinine', 'egfr', 'gfr', 'uric acid', 'cystatin', 'kidney', 'renal'],
  electrolytes: ['sodium', 'potassium', 'chloride', 'bicarbonate', 'co2', 'calcium', 'magnesium', 'phosphorus', 'phosphate', 'electrolyte'],
  thyroid: ['tsh', 't3', 't4', 'ft3', 'ft4', 'thyroid', 'anti-tpo', 'thyroxine'],
  vitamins: ['vitamin', 'vit d', 'vit b12', 'cobalamin', 'iron', 'ferritin', 'transferrin', 'folate', 'nutrient'],
  inflammatory: ['crp', 'esr', 'sed rate', 'homocysteine', 'troponin', 'bnp', 'd-dimer', 'fibrinogen', 'inflammatory', 'cardiac'],
  urinalysis: ['urine', 'sp. gr.', 'specific gravity', 'ph', 'proteinuria', 'microalbumin', 'psa', 'urology', 'urinalysis'],
  hormones: ['cortisol', 'testosterone', 'estrogen', 'estradiol', 'dhea', 'progesterone', 'prolactin', 'pth', 'hormone']
};

const getCategoryForBiomarker = (bmName: string): string => {
  if (bmName === 'health_score') return 'all';
  const lower = bmName.toLowerCase();
  for (const [catId, keywords] of Object.entries(CATEGORY_BIOMARKER_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return catId;
    }
  }
  return 'all';
};

const getBiomarkerUnit = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('hba1c') || lower.includes('hematocrit') || lower.includes('pct')) return '%';
  if (lower.includes('ast') || lower.includes('alt') || lower.includes('alk') || lower.includes('alp')) return 'U/L';
  if (lower.includes('wbc') || lower.includes('rbc') || lower.includes('platelet')) return '/uL';
  if (lower.includes('tsh')) return 'uIU/mL';
  if (lower.includes('free t3') || lower.includes('ft3') || lower.includes('b12')) return 'pg/mL';
  if (lower.includes('free t4') || lower.includes('ft4')) return 'ng/dL';
  if (lower.includes('hemoglobin') || lower.includes('hgb')) return 'g/dL';
  if (lower.includes('vitamin d')) return 'ng/mL';
  if (lower.includes('crp')) return 'mg/L';
  if (lower.includes('esr')) return 'mm/hr';
  if (lower.includes('egfr')) return 'mL/min/1.73m2';
  return 'mg/dL';
};

export const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ trends, selectedCategory = 'all', onCategoryChange }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('health_score');
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('ALL');
  const { effectiveTheme } = useTheme();

  const handleMetricSelect = (metricId: string) => {
    setSelectedMetric(metricId);
    if (onCategoryChange) {
      const cat = getCategoryForBiomarker(metricId);
      onCategoryChange(cat);
    }
  };

  const availableBiomarkers = useMemo(() => {
    if (!trends || trends.length === 0) return [];
    const set = new Set<string>();
    trends.forEach(t => {
      if (t.biomarkers) {
        Object.keys(t.biomarkers).forEach(name => set.add(name));
      }
    });
    const list = Array.from(set).sort();
    if (selectedCategory && selectedCategory !== 'all' && CATEGORY_BIOMARKER_KEYWORDS[selectedCategory]) {
      const keywords = CATEGORY_BIOMARKER_KEYWORDS[selectedCategory];
      const filtered = list.filter(bmName => {
        const lower = bmName.toLowerCase();
        return keywords.some(kw => lower.includes(kw));
      });
      if (filtered.length > 0) return filtered;
    }
    return list;
  }, [trends, selectedCategory]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setSelectedMetric('health_score');
    } else if (selectedCategory && selectedCategory !== 'all' && availableBiomarkers.length > 0) {
      if (!availableBiomarkers.includes(selectedMetric)) {
        setSelectedMetric(availableBiomarkers[0]);
      }
    }
  }, [selectedCategory, availableBiomarkers]);

  const metricOptions = useMemo(() => {
    const options: { id: string; label: string; color: string; unit: string }[] = [
      { id: 'health_score', label: 'Overall Health Rating Index', color: '#0EA5E9', unit: 'pts' }
    ];
    const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
    availableBiomarkers.forEach((bmName, idx) => {
      options.push({
        id: bmName,
        label: bmName,
        color: colors[idx % colors.length],
        unit: getBiomarkerUnit(bmName)
      });
    });
    return options;
  }, [availableBiomarkers]);

  const currentOption = useMemo(() => {
    return metricOptions.find(m => m.id === selectedMetric) || metricOptions[0];
  }, [metricOptions, selectedMetric]);

  const chartData = useMemo(() => {
    if (!trends) return [];
    return trends.map((t) => {
      let val: number | null = null;
      if (selectedMetric === 'health_score') {
        val = t.health_score;
      } else if (t.biomarkers && t.biomarkers[selectedMetric] !== undefined) {
        val = t.biomarkers[selectedMetric];
      }
      return {
        date: t.date,
        value: val
      };
    }).filter(d => d.value !== null);
  }, [trends, selectedMetric]);

  const stats = useMemo(() => {
    const values = chartData.map(d => Number(d.value)).filter(v => !isNaN(v));
    if (values.length === 0) return { mean: 0, min: 0, max: 0, delta: 0, direction: 'stable' as const };
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / values.length) * 10) / 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const first = values[0];
    const last = values[values.length - 1];
    const delta = Math.round((last - first) * 10) / 10;
    const direction = delta > 0 ? 'improved' : delta < 0 ? 'degraded' : 'stable';

    return { mean, min, max, delta, direction };
  }, [chartData]);

  const isDark = effectiveTheme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const axisTextColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <SpotlightCard className="border border-border bg-card shadow-sm rounded-3xl overflow-hidden" spotlightColor="rgba(2, 132, 199, 0.12)">
        
        <CardHeader className="p-4 sm:p-5 border-b border-border bg-secondary/10">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4">
            
            <div className="flex items-start sm:items-center gap-3">
              <TradeUpIcon className="w-7 h-7 text-primary shrink-0" />
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold tracking-tight text-foreground">
                  Biomarker Explorer & Trajectory Engine
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Longitudinal parameter trajectories with clinical reference interval band overlays
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Metric Dropdown Selector */}
              <div className="relative flex items-center min-w-0">
                <select
                  value={selectedMetric}
                  onChange={(e) => handleMetricSelect(e.target.value)}
                  className="appearance-none truncate pr-8 pl-3.5 py-2 rounded-xl border border-border bg-card text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:bg-secondary/40 transition-colors"
                >
                  {metricOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-background text-foreground dark:bg-slate-900 dark:text-white py-1 font-medium">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 pointer-events-none" />
              </div>

              {/* Time Range Segmented Buttons */}
              <div className="flex items-center gap-0.5 bg-secondary/40 p-1 rounded-xl border border-border/80 shrink-0">
                {(Object.keys(TIME_RANGE_LABELS) as TimeRangeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTimeRange(key)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      timeRange === key
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          
          {/* STATISTICAL SUMMARY TILES WITH REACT-COUNTUP NUMBERS & ANIMATE UI HOVER EFFECTS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            
            <motion.div 
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-4 rounded-2xl border border-border bg-secondary/20 shadow-xs transition-all duration-300"
            >
              <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block tracking-wider">
                Historical Mean
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono mt-1">
                <CountUpNumber value={stats.mean} decimals={1} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-4 rounded-2xl border border-border bg-secondary/20 shadow-xs transition-all duration-300"
            >
              <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block tracking-wider">
                Min / Max Bounds
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-foreground font-mono mt-1">
                <CountUpNumber value={stats.min} decimals={1} /> – <CountUpNumber value={stats.max} decimals={1} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-4 rounded-2xl border border-border bg-secondary/20 shadow-xs transition-all duration-300"
            >
              <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block tracking-wider">
                Trajectory Delta
              </span>
              <div className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${
                stats.delta > 0 ? 'text-emerald-500' : stats.delta < 0 ? 'text-amber-500' : 'text-foreground'
              }`}>
                {stats.delta > 0 ? '+' : ''}<CountUpNumber value={stats.delta} decimals={1} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-4 rounded-2xl border border-border bg-secondary/20 shadow-xs transition-all duration-300"
            >
              <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block tracking-wider">
                Clinical Trend
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                {stats.direction === 'improved' ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Positive</span>
                  </>
                ) : stats.direction === 'degraded' ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-tight">Deviation</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-tight">Stable</span>
                  </>
                )}
              </div>
            </motion.div>

          </div>

          {/* VISX / TREMOR STYLED MODERN RECHARTS CANVAS WITH REFERENCE RANGE BANDS & FLOATING TOOLTIPS */}
          <div className="h-72 sm:h-80 w-full pt-2">
            {chartData.length < 2 ? (
              <div className="py-16 text-center text-xs text-muted-foreground space-y-3 bg-secondary/10 rounded-2xl border border-dashed border-border/80">
                <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto opacity-40 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-extrabold text-foreground text-sm">Insufficient Historical Data Points</p>
                  <p className="max-w-md mx-auto">Upload at least 2 historical lab reports to render continuous trajectory curves and reference range bands.</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visxTrendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentOption.color} stopOpacity={0.4} />
                      <stop offset="50%" stopColor={currentOption.color} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={currentOption.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Standard Reference Band Highlight (70-100 optimal interval) */}
                  <ReferenceArea
                    y1={stats.mean * 0.85}
                    y2={stats.mean * 1.15}
                    fill="#10B981"
                    fillOpacity={isDark ? 0.05 : 0.08}
                  />

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke={axisTextColor} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="monospace"
                  />
                  
                  <YAxis 
                    stroke={axisTextColor} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="monospace"
                  />

                  {/* FLOATING UI GLASS TOOLTIP POPOVER */}
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/90 shadow-2xl space-y-1.5 min-w-[170px]">
                            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                              <span className="text-[10px] font-mono text-muted-foreground uppercase">{data.date}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                            <div className="text-sm font-extrabold text-foreground">{currentOption.label}</div>
                            <div className="text-lg font-extrabold text-primary font-mono">
                              {data.value} <span className="text-xs font-normal text-muted-foreground">{currentOption.unit}</span>
                            </div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Target Band Optimal
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* GLOWING TRAJECTORY AREA CURVE */}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={currentOption.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#visxTrendGradient)"
                    dot={{ 
                      r: 5, 
                      fill: currentOption.color, 
                      strokeWidth: 3, 
                      stroke: isDark ? '#090D16' : '#FFFFFF' 
                    }}
                    activeDot={{ 
                      r: 8, 
                      stroke: currentOption.color, 
                      strokeWidth: 3, 
                      fill: isDark ? '#090D16' : '#FFFFFF' 
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-medium pt-2 border-t border-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500 shrink-0" />
              <span>Green Band: Optimal Reference Range</span>
            </div>
          </div>

        </CardContent>
      </SpotlightCard>
    </motion.div>
  );
};
