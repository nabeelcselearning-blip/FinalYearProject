import React from 'react';
import { motion } from 'framer-motion';
import { 
  DashboardSquare01Icon, File01Icon, TradeUpIcon, 
  TestTubeIcon, BrainIcon, Calendar01Icon, Medicine01Icon, FileSecurityIcon 
} from 'hugeicons-react';
import { 
  LayoutDashboard, FileText, Brain, AlertTriangle, ShieldCheck, Lock, Activity,
  ArrowRight, CheckCircle2, Cpu, HeartPulse, 
  Sparkles, Bell, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShinyButton } from '../components/ui/ShinyButton';
import { GradientText } from '../components/ui/GradientText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { NumberTicker } from '../components/ui/NumberTicker';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { TiltLogoCard } from '../components/ui/TiltLogoCard';

export { TiltLogoCard };

export const LandingPage: React.FC = () => {
  const [activeDisclaimer, setActiveDisclaimer] = React.useState<'disclaimer' | 'security' | 'hipaa' | null>(null);
  const coreModules = [
    {
      icon: DashboardSquare01Icon,
      title: 'Physiological Health & Alert Overview',
      tag: 'Status Summary',
      description: 'Provides a central overview of overall physiological status, highlighting abnormal laboratory parameters and compiling chronological medical event logs.',
      highlights: ['Composite Health Index', 'Abnormal Parameter Alerts', 'Chronological Activity Log'],
      iconColor: 'text-sky-500',
    },
    {
      icon: File01Icon,
      title: 'Historical Report Archive & Comparison',
      tag: 'Document Vault',
      description: 'Organizes and stores historical diagnostic laboratory documents in a secure digital archive with side-by-side delta comparison capabilities.',
      highlights: ['Historical Document Archive', 'Side-by-Side Delta Comparison', 'Interactive Document Review'],
      iconColor: 'text-blue-500',
    },
    {
      icon: TradeUpIcon,
      title: 'Longitudinal Biomarker Trajectories',
      tag: 'Trend Analysis',
      description: 'Tracks changes in physiological indicators over time across multiple laboratory reports, displaying values against clinical reference range boundaries.',
      highlights: ['Multi-Report Trend Overlay', 'Clinical Reference Intervals', 'Min & Max Trajectory Bounds'],
      iconColor: 'text-emerald-500',
    },
    {
      icon: TestTubeIcon,
      title: 'Biomarker Reference & Educational Guide',
      tag: 'Parameter Dictionary',
      description: 'Offers a searchable clinical dictionary of canonical laboratory parameters, standard reference intervals, and educational biomarker descriptions.',
      highlights: ['Canonical Parameter Lookup', 'Clinical Reference Bands', 'Educational Descriptions'],
      iconColor: 'text-amber-500',
    },
    {
      icon: BrainIcon,
      title: 'Educational AI Report Interpretation',
      tag: 'Report Analysis',
      description: 'Delivers contextual, educational explanations of diagnostic findings, helping clarify complex medical terminology and reference range variations.',
      highlights: ['Educational Report Clarification', 'Contextual Lab Analysis', 'Medical Terminology Mapping'],
      iconColor: 'text-purple-500',
    },
    {
      icon: Calendar01Icon,
      title: 'Diagnostic Re-testing & Scheduling',
      tag: 'Follow-up Monitor',
      description: 'Assists patients in tracking recommended re-testing schedules and clinical follow-up timelines for key physiological indicators.',
      highlights: ['Re-testing Timelines', 'Scheduled Follow-up Reminders', 'Status Monitoring Cards'],
      iconColor: 'text-rose-500',
    },
    {
      icon: Medicine01Icon,
      title: 'Prescription Medication & Biomarker Review',
      tag: 'Therapy Logger',
      description: 'Cross-references active prescription medications against parsed laboratory parameters to provide educational insights into potential biomarker interactions.',
      highlights: ['Active Prescription Tracker', 'Biomarker Cross-Reference', 'Interaction Warnings'],
      iconColor: 'text-cyan-500',
    },
    {
      icon: FileSecurityIcon,
      title: 'Client-Controlled Security & Privacy',
      tag: 'Data Control',
      description: 'Protects sensitive personal health information using client-controlled browser storage, local session encryption, and zero data monetization.',
      highlights: ['Local Session Encryption', 'Client Data Ownership', 'Zero Persistent Sharing'],
      iconColor: 'text-slate-400',
    },
  ];

  const pipelineSteps = [
    {
      step: '01',
      title: 'Secure Document Ingestion',
      desc: 'Ingests multipage laboratory PDFs and diagnostic image scans into a secure processing environment.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'OCR & Structured Text Extraction',
      desc: 'Applies contrast optimization and Optical Character Recognition to extract tabular laboratory data from unformatted reports.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Canonical Normalization & Reference Matching',
      desc: 'Normalizes raw text into standard canonical units, numerical biomarker values, and clinical reference interval boundaries.',
      icon: Brain,
    },
    {
      step: '04',
      title: 'Deterministic Analysis & Educational Summaries',
      desc: 'Evaluates physiological indicators, calculates educational health scores, and prepares longitudinal trend data for provider consultation.',
      icon: HeartPulse,
    },
  ];

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reusable motion settings for 60+ FPS smooth 16px scroll fade-in
  const sectionFadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20">
      {/* STANDALONE LANDING HEADER WITH DYNAMIC GLASSMORPHISM ON SCROLL */}
      <motion.header 
        {...sectionFadeUp}
        className={`sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'glass-scroll-active py-2.5 shadow-lg' 
            : 'bg-card/70 backdrop-blur-xl border-b border-border/80 py-3.5 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="logo-wrapper w-10 h-10 flex items-center justify-center font-bold shrink-0 relative overflow-hidden rounded-xl">
            <img src="/logo.png" alt="MediScan AI Logo" className="logo-image w-full h-full object-contain pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-foreground tracking-tight leading-none">
              MediScan<span className="text-primary ml-0.5">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-1">
              Clinical Laboratory Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/">
            <ShinyButton variant="primary" className="h-10 px-5 text-xs sm:text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Patient Workspace</span>
            </ShinyButton>
          </Link>
        </div>
      </motion.header>

      {/* REFINED & BALANCED HERO SECTION WITH ALWAYS-ACTIVE SCROLL FADE-IN */}
      <motion.section 
        {...sectionFadeUp}
        className="relative overflow-hidden border-b border-border/80"
      >
        <AuroraBackground className="py-12 sm:py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT SIDE: PERFECTLY ALIGNED MEDIUM-SIZED LOGO DISPLAY */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="lg:col-span-4 flex flex-col items-center lg:items-center text-center space-y-4 pt-2 transform-gpu"
            >
              {/* Animated Interactive 3D Cursor-Tilt Logo Container */}
              <TiltLogoCard />
            </motion.div>

            {/* RIGHT SIDE: MISSION STATEMENT & EDUCATIONAL PURPOSE */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
              className="lg:col-span-8 space-y-5 text-center lg:text-left transform-gpu"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Transform Raw Lab Reports into <GradientText>Physiological Intelligence</GradientText>
              </h1>

              <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed font-medium max-w-2xl">
                <p>
                  MediScan AI is an AI-assisted clinical laboratory intelligence platform engineered to convert unformatted laboratory reports into structured physiological insights. By integrating Optical Character Recognition, deterministic clinical rule analysis, cloud-based AI interpretation, and longitudinal biomarker monitoring, the platform organizes diagnostic findings into accessible educational summaries.
                </p>
                <p>
                  Diagnostic reports frequently contain dozens of complex numerical indicators that are challenging for patients to interpret. MediScan AI organizes these parameters, highlights abnormal values, tracks health changes across multiple lab visits, and encourages proactive consultations with licensed healthcare providers.
                </p>
              </div>

              {/* Explicit Educational Purpose Disclaimer Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-3 max-w-2xl">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold uppercase tracking-wider block mb-0.5">Educational Purpose Notice:</span>
                  MediScan AI is designed exclusively for educational and informational purposes and does not diagnose, treat, or replace licensed healthcare professionals. Always consult a qualified medical practitioner regarding diagnostic laboratory findings.
                </div>
              </div>

              {/* VALUE-FOCUSED PLATFORM CAPABILITIES BAR */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl sm:text-4xl font-extrabold text-foreground font-mono tracking-tight">
                    <NumberTicker value={30} />+
                  </span>
                  <span className="text-xs text-muted-foreground font-medium block mt-1">Supported Biomarkers</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                    100%
                  </span>
                  <span className="text-xs text-muted-foreground font-medium block mt-1">Deterministic Rule Engine</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-4xl font-extrabold text-sky-600 dark:text-sky-400 font-mono tracking-tight">
                    Multi-Visit
                  </span>
                  <span className="text-xs text-muted-foreground font-medium block mt-1">Longitudinal Monitoring</span>
                </div>
              </div>
            </motion.div>

          </div>
        </AuroraBackground>
      </motion.section>

      {/* SECTION 2: SYSTEM ARCHITECTURE & CORE CAPABILITIES WITH ALWAYS-ACTIVE STAGGERED 100ms CARDS */}
      <motion.section 
        {...sectionFadeUp}
        className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="slate" className="text-xs font-semibold px-3 py-1 uppercase tracking-wider">
            Platform Capabilities & Clinical Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Designed for Comprehensive Diagnostic Analysis
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Purpose-built tools for diagnostic report organization, biomarker tracking, and educational analysis.
          </p>
        </div>

        {/* STAGGERED SEQUENTIAL 100ms CARD ANIMATION GRID (once: false) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: idx * 0.06, duration: 0.35, ease: 'easeOut' }}
                className="transform-gpu"
              >
                <SpotlightCard enableSpotlightFill={true} className="h-full p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className={`w-7 h-7 ${mod.iconColor} shrink-0 transition-transform duration-200 group-hover:scale-110`} />
                      <Badge variant="healthy" className="text-[10px] px-2 py-0.5 font-semibold">
                        {mod.tag}
                      </Badge>
                    </div>

                    <h3 className="text-base font-extrabold text-foreground tracking-tight leading-snug">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{mod.description}</p>

                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      {mod.highlights.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* SECTION 3: INGESTION PIPELINE FLOW (once: false) */}
      <motion.section 
        {...sectionFadeUp}
        className="py-16 sm:py-24 px-4 sm:px-8 bg-card border-y border-border/80"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block">Automated Processing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Automated Laboratory Processing Pipeline</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">How MediScan AI transforms unformatted diagnostic documents into structured physiological information.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineSteps.map((st, i) => {
              const StepIcon = st.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
                  className="p-6 rounded-2xl border border-border/80 bg-secondary/20 space-y-4 relative transform-gpu"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-extrabold text-muted-foreground/30 font-mono">{st.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{st.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{st.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4: SVG DRAW ANIMATION BANNER */}
      <motion.section 
        {...sectionFadeUp}
        className="py-12 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border/90 shadow-lg space-y-8 relative overflow-hidden">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-b border-border/60 pb-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Clinical Processing & History</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Lab Report Analysis & Biomarker Tracking
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                Upload medical lab reports to view structured biomarker measurements, standard reference ranges, and scheduled follow-up tests.
              </p>
            </div>
          </div>

          {/* LIVE ANIMATED OCR SCANNER & BIOMARKER TRAJECTORY CANVAS */}
          <div className="relative p-5 sm:p-6 rounded-2xl bg-secondary/30 border border-border/80 overflow-hidden space-y-4">
            
            {/* Live Header Status */}
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Diagnostic Scan</span>
              </div>
            </div>

            {/* SVG Interactive Live Line Canvas */}
            <div className="relative h-28 sm:h-32 rounded-xl bg-card border border-border/60 overflow-hidden flex items-center group/graph cursor-pointer">
              
              {/* Reference Interval Target Bands (Upper, Optimal, Lower) */}
              <div className="absolute inset-0 flex flex-col justify-between py-3 px-4 pointer-events-none opacity-60 group-hover/graph:opacity-100 transition-opacity duration-300 z-10">
                <div className="border-b border-rose-500/40 group-hover/graph:border-rose-500 border-dashed flex justify-between text-[10px] text-rose-600 dark:text-rose-400 group-hover/graph:text-rose-700 dark:group-hover/graph:text-rose-300 font-semibold group-hover/graph:font-bold transition-all duration-300">
                  <span>High Reference Limit (20.0 mg/dL)</span>
                  <span>Flagged</span>
                </div>
                <div className="border-b border-emerald-500/40 group-hover/graph:border-emerald-500 border-dashed flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400 group-hover/graph:text-emerald-700 dark:group-hover/graph:text-emerald-300 font-semibold group-hover/graph:font-bold transition-all duration-300">
                  <span>Standard Reference Range (7.0 - 18.0 mg/dL)</span>
                  <span>Normal Range</span>
                </div>
                <div className="border-b border-sky-500/40 group-hover/graph:border-sky-500 border-dashed flex justify-between text-[10px] text-sky-600 dark:text-sky-400 group-hover/graph:text-sky-700 dark:group-hover/graph:text-sky-300 font-semibold group-hover/graph:font-bold transition-all duration-300">
                  <span>Lower Reference Bound (7.0 mg/dL)</span>
                  <span>Baseline</span>
                </div>
              </div>

              {/* Animated SVG Path for Lab Trajectory Curve */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 900 130" fill="none">
                <defs>
                  <linearGradient id="labScanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                    <stop offset="35%" stopColor="#10B981" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#F59E0B" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Smooth Curve Connecting Scanned Lab Parameters - FORWARD-ONLY SWEEP WITH INSTANT LOOP RESET */}
                <motion.path
                  d="M 40 95 C 140 90, 200 95, 280 75 C 360 55, 420 60, 500 50 C 580 40, 660 30, 740 30 C 800 30, 840 25, 860 25"
                  stroke="url(#labScanGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1] }}
                  transition={{
                    duration: 4.0,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                />

                {/* Node 1: Baseline Sky Blue */}
                <motion.circle
                  cx="40"
                  cy="95"
                  r="4.5"
                  className="fill-sky-400 stroke-card stroke-2"
                  animate={{ opacity: [0, 1] }}
                  transition={{
                    duration: 4.0,
                    times: [0, 0.05],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                />

                {/* Node 2: Normal Emerald Green */}
                <motion.circle
                  cx="280"
                  cy="75"
                  r="5"
                  className="fill-emerald-400 stroke-card stroke-2"
                  animate={{ opacity: [0, 0, 1] }}
                  transition={{
                    duration: 4.0,
                    times: [0, 0.28, 0.32],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                />

                {/* Node 3: Optimal Green */}
                <motion.circle
                  cx="500"
                  cy="50"
                  r="5"
                  className="fill-emerald-500 stroke-card stroke-2"
                  animate={{ opacity: [0, 0, 1] }}
                  transition={{
                    duration: 4.0,
                    times: [0, 0.52, 0.57],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                />

                {/* Node 4: High Flagged Red */}
                <motion.circle
                  cx="740"
                  cy="30"
                  r="6"
                  className="fill-rose-500 stroke-card stroke-2"
                  animate={{ opacity: [0, 0, 1] }}
                  transition={{
                    duration: 4.0,
                    times: [0, 0.78, 0.83],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  }}
                />
              </svg>

              {/* Live Laser Scanner Line sweep effect - FORWARD SWEEP ONLY, INSTANT RESET */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-emerald-400 to-rose-500 shadow-[0_0_18px_#0EA5E9] z-20 pointer-events-none"
                animate={{ left: ['0%', '100%'] }}
                transition={{
                  duration: 4.0,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }}
              />
            </div>

            {/* Live Ticker Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground bg-card px-3 py-1.5 rounded-xl border">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Hemoglobin: 14.2 g/dL (Normal)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Blood Urea Nitrogen: 24.5 mg/dL (High)
              </span>
              <span className="flex items-center gap-1.5 text-foreground bg-card px-3 py-1.5 rounded-xl border">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                TSH: 2.1 uIU/mL (Normal)
              </span>
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Follow-Up Test Scheduled
              </span>
            </div>
          </div>

          {/* 3-STEP PIPELINE SHOWCASE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-secondary/20 border border-border/70 space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center text-xs font-extrabold">
                  01
                </div>
                <Badge variant="slate" className="text-xs font-semibold">
                  Parsed Report
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground">Lab Report Upload & Parsing</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Extracts test names, measured values, units, and lab reference intervals from your PDF documents.
              </p>
              <div className="p-2.5 rounded-xl bg-card border text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Blood Urea Nitrogen</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">24.5 mg/dL</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-secondary/20 border border-border/70 space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-extrabold">
                  02
                </div>
                <Badge variant="warning" className="text-xs font-semibold">
                  Range Check
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground">Reference Range Comparison</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Compares your lab values against established age and gender reference ranges to flag high or low results.
              </p>
              <div className="p-2.5 rounded-xl bg-card border text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Standard Range</span>
                <span className="text-foreground font-bold">7.0 - 18.0 mg/dL</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-secondary/20 border border-border/70 space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-extrabold">
                  03
                </div>
                <Badge variant="healthy" className="text-xs font-semibold">
                  Scheduled
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-foreground">Follow-Up Test Reminders</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Sets automated reminders for suggested re-testing dates so you never miss a follow-up test.
              </p>
              <div className="p-2.5 rounded-xl bg-card border text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Renal Panel Re-test</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">In 2-4 Weeks</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 5: CALL TO ACTION BANNER WITH ALWAYS-ACTIVE SCROLL FADE-IN */}
      <motion.section 
        {...sectionFadeUp}
        className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-emerald-500/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Streamline Your Diagnostic Report Workflow</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              Launching the workspace allows you to upload laboratory reports, extract structured biomarker data, compare values against clinical reference ranges, generate educational summaries, and build a longitudinal health history over time.
            </p>
          </div>
          <Link to="/">
            <ShinyButton variant="primary" className="h-12 px-8 text-sm font-bold shadow-lg shadow-primary/20 shrink-0">
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Launch Patient Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </ShinyButton>
          </Link>
        </div>
      </motion.section>

      {/* STANDALONE LANDING FOOTER WITH ALWAYS-ACTIVE SCROLL FADE-IN */}
      <motion.footer 
        {...sectionFadeUp}
        className="border-t border-border/80 py-10 px-4 sm:px-8 bg-card text-muted-foreground text-xs"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MediScan AI" className="w-7 h-7 object-contain rounded-md" />
              <div>
                <span className="font-extrabold text-foreground text-sm">MediScan AI</span>
                <span className="text-muted-foreground/80 font-mono text-[11px] block sm:inline sm:ml-2">
                  • Clinical Laboratory Intelligence Engine v1.2.0
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
              <Link to="/" className="hover:text-primary transition-colors">Workspace</Link>
              <Link to="/reports" className="hover:text-primary transition-colors">Reports Vault</Link>
              <Link to="/trends" className="hover:text-primary transition-colors">Longitudinal Trends</Link>
              <Link to="/biomarkers" className="hover:text-primary transition-colors">Biomarkers Guide</Link>
              <Link to="/settings" className="hover:text-primary transition-colors">System Settings</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/80">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <button
                onClick={() => setActiveDisclaimer('disclaimer')}
                className="hover:text-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Educational Use Disclaimer
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveDisclaimer('security')}
                className="hover:text-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Client-Side Security
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveDisclaimer('hipaa')}
                className="hover:text-primary transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                HIPAA Standards Compliant
              </button>
            </div>
            <div>
              <span>MediScan AI © 2026 • Designed for Clinical Laboratory Research</span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* INTERACTIVE POPUP MODAL FOR DISCLAIMER / SECURITY / HIPAA */}
      <Dialog open={activeDisclaimer !== null} onOpenChange={() => setActiveDisclaimer(null)}>
        <DialogContent className="max-w-md w-full p-6 space-y-4 rounded-2xl border-border bg-card shadow-2xl">
          <DialogHeader className="border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                {activeDisclaimer === 'disclaimer' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {activeDisclaimer === 'security' && <ShieldCheck className="w-4 h-4 text-sky-500" />}
                {activeDisclaimer === 'hipaa' && <Lock className="w-4 h-4 text-emerald-500" />}
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                {activeDisclaimer === 'disclaimer' && 'Educational Use Disclaimer'}
                {activeDisclaimer === 'security' && 'Client-Side Security Protocols'}
                {activeDisclaimer === 'hipaa' && 'HIPAA Standards Compliance'}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-3 pt-1">
            {activeDisclaimer === 'disclaimer' && (
              <>
                <p>
                  MediScan AI is designed exclusively for educational, personal wellness tracking, and laboratory research purposes. The biomarker measurements, health scores, and automated follow-up suggestions generated by this system do not constitute professional medical diagnosis or clinical treatment advice.
                </p>
                <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                  Always consult a qualified physician or licensed healthcare provider to review laboratory findings and make decisions regarding medical care.
                </p>
              </>
            )}

            {activeDisclaimer === 'security' && (
              <>
                <p>
                  Your medical data security is our highest priority. MediScan AI operates using strict client-side encryption and localized processing protocols.
                </p>
                <ul className="space-y-2 font-medium text-foreground pt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span><strong>Local Data Storage:</strong> All uploaded laboratory reports and biomarker values remain stored within your local session database.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span><strong>Zero Ad-Server Retention:</strong> Medical PDF scans are parsed in real-time and are never harvested on third-party ad servers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span><strong>User Session Control:</strong> You retain 100% authority to clear your local database session or purge files at any time.</span>
                  </li>
                </ul>
              </>
            )}

            {activeDisclaimer === 'hipaa' && (
              <>
                <p>
                  MediScan AI aligns with administrative, physical, and technical safeguard principles established by HIPAA guidelines.
                </p>
                <ul className="space-y-2 font-medium text-foreground pt-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Isolated Privacy Scoping:</strong> Strict user-isolated session architecture keeps your records restricted exclusively to your browser session.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Encrypted Transport:</strong> All data transmissions utilize TLS 1.3 protocol encryption.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span><strong>Audit Control:</strong> Built-in chronological logging tracks all file uploads and reminder actions for complete user transparency.</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
