import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, TrendingUp, TestTube2, Bot, 
  Calendar, Pill, Upload, ArrowRight, ShieldCheck, Sparkles, 
  Activity, CheckCircle2, Cpu, Zap, HeartPulse, Eye, Layers, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShinyButton } from '../components/ui/ShinyButton';
import { GradientText } from '../components/ui/GradientText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { NumberTicker } from '../components/ui/NumberTicker';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

interface HomePageProps {
  onOpenUploadModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenUploadModal }) => {
  const capabilities = [
    {
      icon: LayoutDashboard,
      title: 'Patient Health Workspace',
      route: '/',
      tag: 'Core Dashboard',
      description: 'Hero physiological score index, radial risk gauges, abnormal biomarker alerts, and chronological activity timelines.',
      features: ['Composite 100-pt Score', 'Risk Classification', 'Activity History'],
    },
    {
      icon: FileText,
      title: 'Diagnostic Reports Workspace',
      route: '/reports',
      tag: 'PDF & Comparison',
      description: 'Document archive system with interactive PDF inspection modal, raw OCR text layer review, and side-by-side report delta comparison.',
      features: ['Interactive PDF Viewer', 'Side-by-Side Delta', 'Raw OCR Inspection'],
    },
    {
      icon: TrendingUp,
      title: 'Clinical Analytics & Trends',
      route: '/trends',
      tag: 'Trajectory Engine',
      description: 'Longitudinal biomarker tracking charts with normal reference range bands, min/max historical bounds, and category panel selectors.',
      features: ['Reference Range Bands', 'Panel Filtering', 'Min/Max Trajectory'],
    },
    {
      icon: TestTube2,
      title: 'Biomarkers Explorer Directory',
      route: '/biomarkers',
      tag: 'Parameter Database',
      description: 'Directory of 30+ canonical laboratory parameters, standard reference intervals, educational explanations, and status filters.',
      features: ['Canonical Parameter Lookup', 'Reference Intervals', 'Status Badges'],
    },
    {
      icon: Bot,
      title: 'AI Intelligence Assistant',
      route: '/chat',
      tag: 'GPT-OSS 120B Engine',
      description: 'Conversational AI helper powered by GPT-OSS 120B with lab context support.',
      features: ['Markdown Formatting', 'Active Lab Context', 'Preset Questions'],
    },
    {
      icon: Calendar,
      title: 'Follow-ups & Test Reminders',
      route: '/reminders',
      tag: 'Scheduler',
      description: 'Diagnostic re-testing alerts, doctor appointment reminders, repeat options, and status tracking cards.',
      features: ['Diagnostic Alerts', 'Repeat Options', 'Status Cards'],
    },
    {
      icon: Pill,
      title: 'Medications Tracker & Safety',
      route: '/medications',
      tag: 'Safety Engine',
      description: 'Cross-referencing active prescription medications against parsed laboratory biomarkers for potential interactions.',
      features: ['Prescription Log', 'Biomarker Cross-Check', 'Safety Warnings'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Diagnostic Scan',
      desc: 'Drag & drop clinical PDF reports or image scans (PNG, JPG) up to 15MB.',
      icon: Upload,
    },
    {
      num: '02',
      title: 'Tesseract OCR & AI Structuring',
      desc: 'OpenCV text extraction and Groq GPT-OSS 120B LLM structure raw text into canonical biomarkers.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Risk Profile & Insights',
      desc: 'Composite physiological health score calculation, reference range comparison, and follow-up recommendations.',
      icon: HeartPulse,
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION WITH DESATURATED SAGE AURORA */}
      <AuroraBackground className="rounded-3xl border bg-card p-6 sm:p-12 shadow-sm text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Logo & Platform Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-2xs">
            <div className="logo-wrapper w-5 h-5 flex items-center justify-center font-bold shrink-0 relative overflow-hidden rounded-md">
              <img src="/logo.png" alt="MediScan AI" className="logo-image w-full h-full object-contain pointer-events-none" />
            </div>
            <span>Next-Generation Healthcare Analytics</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Clinical Diagnostic Intelligence & <GradientText>Biomarker Analytics</GradientText>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            MediScan AI transforms static lab report PDFs into structured physiological intelligence, longitudinal biomarker trends, risk profiles, and conversational AI guidance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/">
              <ShinyButton variant="primary" className="h-11 px-6 text-sm">
                <LayoutDashboard className="w-4 h-4" />
                <span>Launch Patient Workspace</span>
              </ShinyButton>
            </Link>

            <ShinyButton onClick={onOpenUploadModal} variant="emerald" className="h-11 px-6 text-sm">
              <Upload className="w-4 h-4" />
              <span>Upload Lab PDF</span>
            </ShinyButton>
          </div>

          {/* Live Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/60 max-w-xl mx-auto">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                <NumberTicker value={30} />+
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Canonical Biomarkers</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                <NumberTicker value={96} />%
              </span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">OCR Engine Precision</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">120B</span>
              <span className="text-[11px] text-muted-foreground block mt-0.5">GPT-OSS 120B Engine</span>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* SECTION 2: APP CAPABILITIES SHOWCASE */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="slate" className="text-xs">Platform Modules</Badge>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Comprehensive Clinical Ecosystem
          </h2>
          <p className="text-xs text-muted-foreground">
            Explore the core modules and diagnostic tools available in MediScan AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.route}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
              >
                <SpotlightCard enableSpotlightFill={true} className="h-full p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="healthy" className="text-[10px]">
                        {cap.tag}
                      </Badge>
                    </div>

                    <h3 className="text-base font-extrabold text-foreground tracking-tight">{cap.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>

                    <div className="space-y-1.5 pt-2">
                      {cap.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-foreground font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <Link
                      to={cap.route}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: HOW IT WORKS TIMELINE */}
      <Card className="p-8 border bg-card shadow-sm space-y-8">
        <div className="text-center space-y-1 max-w-lg mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Ingestion Pipeline</span>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">How MediScan AI Processes Lab Scans</h2>
          <p className="text-xs text-muted-foreground">Four-step automated clinical pipeline from raw PDF to health insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((st, i) => {
            const StepIcon = st.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-border/70 bg-secondary/20 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                    <StepIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xl font-extrabold text-muted-foreground/40 font-mono">{st.num}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* SECTION 4: CALL TO ACTION */}
      <div className="p-8 sm:p-10 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">Ready to Analyze Your Diagnostic Reports?</h3>
          <p className="text-xs text-muted-foreground">Upload your blood test or lab report PDF to generate instant clinical insights.</p>
        </div>
        <ShinyButton onClick={onOpenUploadModal} variant="primary" className="h-11 px-6 text-sm shrink-0">
          <Upload className="w-4 h-4" />
          <span>Upload First Lab Report</span>
        </ShinyButton>
      </div>
    </div>
  );
};
