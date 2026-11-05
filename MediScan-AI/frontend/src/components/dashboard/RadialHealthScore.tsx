import React from 'react';
import { Pulse } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Badge } from '../ui/badge';
import { NumberTicker } from '../ui/NumberTicker';
import { Spotlight } from '../ui/Spotlight';
import { AuroraBackground } from '../ui/AuroraBackground';

interface RadialHealthScoreProps {
  score: number;
  previousScore?: number;
  riskCategory: string;
  ocrConfidence?: number;
  aiConfidence?: number;
  lastUpdated?: string;
}

export const RadialHealthScore: React.FC<RadialHealthScoreProps> = ({
  score,
  previousScore = 0,
  riskCategory,
  ocrConfidence = 96,
  aiConfidence = 98,
  lastUpdated = 'Latest scan',
}) => {
  const delta = previousScore > 0 ? score - previousScore : 0;
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 85) return { stroke: '#3F8F73', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', badge: 'healthy' as const };
    if (val >= 70) return { stroke: '#0284C7', bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', badge: 'slate' as const };
    if (val >= 55) return { stroke: '#F59E0B', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', badge: 'warning' as const };
    return { stroke: '#EF4444', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', badge: 'critical' as const };
  };

  const scoreTheme = getScoreColor(score);

  const getInterpretation = (category: string, scoreVal: number) => {
    if (scoreVal >= 85) return 'Optimal physiological markers. Low systemic risk detected across analyzed panels.';
    if (scoreVal >= 70) return 'Generally stable biomarker parameters with mild routine monitoring recommendations.';
    if (scoreVal >= 55) return 'Multiple biomarkers outside optimal reference ranges. Follow-up consultation advised.';
    return 'Critical biomarker deviations requiring clinical evaluation and physician review.';
  };

  return (
    <AuroraBackground>
      <SpotlightCard className="relative overflow-hidden p-6 sm:p-8 border bg-card text-card-foreground shadow-sm" spotlightColor="rgba(2, 132, 199, 0.12)">
        {/* Magic UI Subtle Spotlight Ambient Effect */}
        <Spotlight className="-top-20 opacity-30" fill="rgba(63, 143, 115, 0.12)" />

        {/* Hero Header */}
        <div className="relative z-10 flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Pulse className="w-5 h-5 text-primary shrink-0" />
              <h2 className="text-lg font-extrabold text-foreground tracking-tight">Patient Health Index</h2>
              <Badge variant={scoreTheme.badge}>{riskCategory} Risk</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Composite physiological score derived from latest diagnostic panels</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-xl border border-border">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AI Engine Confidence: <strong className="text-foreground">{aiConfidence}%</strong></span>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Radial Visualization & Number Ticker */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-muted/40"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={scoreTheme.stroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  <NumberTicker value={score} />
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Out of 100
                </span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border shadow-2xs"
            >
              {delta > 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">+{delta} pts improvement vs previous scan</span>
                </>
              ) : delta < 0 ? (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">{delta} pts vs previous scan</span>
                </>
              ) : (
                <>
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Baseline score established</span>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Clinical Assessment & Key Indicators */}
          <div className="md:col-span-7 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-secondary/20 p-5 shadow-2xs"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Clinical Intelligence Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                {getInterpretation(riskCategory, score)}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-border bg-card shadow-2xs"
              >
                <span className="text-[11px] font-semibold text-muted-foreground block">OCR Text Accuracy</span>
                <span className="text-lg font-extrabold text-foreground mt-0.5 block">
                  <NumberTicker value={ocrConfidence} />%
                </span>
                <span className="text-[10px] text-muted-foreground block mt-1">Matched against raw lab text</span>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-border bg-card shadow-2xs"
              >
                <span className="text-[11px] font-semibold text-muted-foreground block">Latest Lab Sync</span>
                <span className="text-xs font-extrabold text-foreground truncate block mt-1">{lastUpdated}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">Database Sync Active</span>
              </motion.div>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </AuroraBackground>
  );
};
