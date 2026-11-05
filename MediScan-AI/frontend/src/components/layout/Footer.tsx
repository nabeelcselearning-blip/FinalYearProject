import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-12 py-8 text-muted-foreground text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Global Medical Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold uppercase tracking-wider mr-1.5">
              Educational & Informational Disclaimer:
            </span>
            MediScan AI is intended solely for educational and informational purposes. It does not diagnose, treat, cure, or prevent any disease. AI-generated analyses may contain inaccuracies. Always consult a qualified healthcare professional before making any medical decisions based on your laboratory reports. In case of a medical emergency, call emergency services (911 / 112) immediately.
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-primary text-primary-foreground font-bold flex items-center justify-center text-[10px]">
              M
            </div>
            <span className="font-semibold text-foreground">
              MediScan AI © 2026
            </span>
            <span className="text-muted-foreground font-mono">• Clinical Intelligence Engine v1.2</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground font-medium">
            <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            <Link to="/settings" className="hover:text-primary transition-colors">Settings</Link>
            <Link to="/chat" className="hover:text-primary transition-colors">AI Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
