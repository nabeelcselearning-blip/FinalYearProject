import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DashboardIcon, FileTextIcon, BarChartIcon, ActivityLogIcon, 
  ChatBubbleIcon, BellIcon, BookmarkIcon, PersonIcon, GearIcon,
  HamburgerMenuIcon, Cross2Icon
} from '@radix-ui/react-icons';
import { Cpu, HardDrive } from 'lucide-react';
import { useReportsQuery } from '../../lib/queries';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface SidebarProps {
  onOpenUploadModal: () => void;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: reports = [] } = useReportsQuery();
  const reportCount = reports.length;
  const estimatedMB = reportCount * 1.5;
  const storageLimitGB = 5.0;
  const storageUsedStr = estimatedMB < 1024 
    ? `${estimatedMB.toFixed(1)} MB` 
    : `${(estimatedMB / 1024).toFixed(2)} GB`;
  const storagePercent = Math.max(0, Math.min(100, Math.round((estimatedMB / (storageLimitGB * 1024)) * 100)));

  // Group 1: Primary Workspace (Dashboard is the primary workspace root)
  const primaryLinks = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/reports', label: 'Reports', icon: FileTextIcon },
    { path: '/trends', label: 'Trends', icon: BarChartIcon },
    { path: '/biomarkers', label: 'Biomarkers', icon: ActivityLogIcon },
    { path: '/chat', label: 'AI Assistant', icon: ChatBubbleIcon },
  ];

  // Group 2: Patient Management
  const managementLinks = [
    { path: '/reminders', label: 'Follow-ups', icon: BellIcon },
    { path: '/medications', label: 'Medications', icon: BookmarkIcon },
    { path: '/profile', label: 'Patient Profile', icon: PersonIcon },
    { path: '/settings', label: 'Settings', icon: GearIcon },
  ];

  const renderNavItem = (link: typeof primaryLinks[0]) => {
    const Icon = link.icon;
    const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={() => setIsMobileOpen(false)}
        className={`group relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all duration-200 ease-out hover:translate-x-1 ${
          isActive
            ? 'bg-primary/5 dark:bg-primary/10 text-primary font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }`}
      >
        {/* 3-4px Vertical Accent Bar */}
        {isActive && (
          <motion.span
            layoutId="activeBar"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full shadow-2xs"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}

        {/* Micro-animated Icon */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 2 }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground/80 group-hover:text-foreground'}`} />
        </motion.div>

        <span className="truncate tracking-tight font-medium">{link.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-card/95 text-card-foreground backdrop-blur-xl border-b border-border/80 px-4 h-14 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-9 h-9 rounded-xl border border-border bg-secondary/50 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            aria-label="Open sidebar menu"
          >
            <HamburgerMenuIcon className="w-5 h-5" />
          </button>
          <Link to="/landing" className="flex items-center gap-2">
            <div className="logo-wrapper w-8 h-8 flex items-center justify-center font-bold shrink-0 relative overflow-hidden rounded-lg">
              <img src="/logo.png" alt="MediScan AI Logo" className="logo-image w-full h-full object-contain pointer-events-none" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
              MediScan<span className="text-primary ml-0.5">AI</span>
            </span>
          </Link>
        </div>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* ALWAYS EXPANDED SIDEBAR CONTAINER */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen bg-card text-card-foreground border-r border-border/80 transition-transform duration-300 ease-in-out flex flex-col justify-between w-[240px] ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* HEADER & BRANDING (CLICKING LOGO OPENS LANDING HOME PAGE) */}
        <div className="p-3 border-b border-border/60">
          <div className="flex items-center justify-between min-h-[36px]">
            <Link
              to="/landing"
              className="flex items-center gap-2.5 overflow-hidden text-left hover:opacity-90 transition-opacity cursor-pointer group"
              title="Click to view Home Landing Page"
            >
              <div className="logo-wrapper w-9 h-9 flex items-center justify-center font-bold shrink-0 relative overflow-hidden rounded-xl">
                <img src="/logo.png" alt="MediScan AI Logo" className="logo-image w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground tracking-tight leading-none whitespace-nowrap">
                  MediScan<span className="text-primary ml-0.5">AI</span>
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground/80 tracking-wider uppercase mt-1 whitespace-nowrap">
                  Clinical Platform
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 no-scrollbar">
          {/* SECTION 1: PRIMARY WORKSPACE */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 block mb-1 select-none">
              Primary Workspace
            </span>
            <div className="space-y-0.5">
              {primaryLinks.map(renderNavItem)}
            </div>
          </div>

          {/* SECTION DIVIDER */}
          <div className="px-3">
            <div className="h-px bg-border/50" />
          </div>

          {/* SECTION 2: PATIENT MANAGEMENT */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 block mb-1 select-none">
              Patient Management
            </span>
            <div className="space-y-0.5">
              {managementLinks.map(renderNavItem)}
            </div>
          </div>
        </div>

        {/* REFINED BOTTOM METRICS SECTION */}
        <div className="border-t border-border/60 p-2.5">
          <div className="space-y-2">
            {/* Storage Meter Card */}
            <div className="p-2.5 rounded-xl border border-border/70 bg-secondary/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-primary" />
                  <span>Storage Usage</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{storagePercent}%</span>
              </div>
              <Progress value={storagePercent} className="h-1.5" />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground/90 pt-0.5 font-medium">
                <span>{reportCount} {reportCount === 1 ? 'Report' : 'Reports'}</span>
                <span>{storageUsedStr} / {storageLimitGB} GB</span>
              </div>
            </div>

            {/* System Info & Version */}
            <div className="space-y-1">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-secondary/20 border border-border/40 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px]">OCR Accuracy</span>
                </div>
                <span className="font-bold font-mono text-[11px] text-emerald-600 dark:text-emerald-400">96%</span>
              </div>

              <div className="flex items-center justify-between px-2 pt-1 text-[11px]">
                <span className="text-muted-foreground/80 font-medium text-[10px]">MediScan Engine</span>
                <Badge variant="slate" className="font-mono text-[10px] px-1.5 py-0">
                  v1.2.0
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
