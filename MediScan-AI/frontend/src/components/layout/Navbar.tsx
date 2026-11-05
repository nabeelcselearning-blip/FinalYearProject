import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Upload, User, FileText, BarChart2, MessageSquare, Search, Sun, Moon, Menu, X, Bell, Pill } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useUIStore } from '../../lib/store';

interface NavbarProps {
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUploadModal }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toggleCommandPalette } = useUIStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/trends', label: 'Trends', icon: BarChart2 },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/medications', label: 'Medications', icon: Pill },
    { path: '/chat', label: 'AI Assistant', icon: MessageSquare }
  ];

  return (
    <div className={`sticky z-40 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'top-2' : 'top-4'}`}>
      <header className={`text-card-foreground flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? 'glass-scroll-active rounded-2xl px-3.5 sm:px-5 h-16 shadow-lg border border-primary/20'
          : 'bg-card/75 backdrop-blur-xl border border-border rounded-2xl shadow-xs px-3.5 sm:px-5 h-20'
      }`}>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-secondary text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            aria-label="Toggle navigation menu"
            title="Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="logo-wrapper w-9 h-9 flex items-center justify-center font-bold text-base shrink-0 relative overflow-hidden rounded-xl">
              <img src="/logo.png" alt="MediScan AI Logo" className="logo-image w-full h-full object-contain pointer-events-none" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight leading-none">
                MediScan<span className="text-primary ml-0.5">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-1 hidden sm:block">
                Clinical Lab Intelligence
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/80 mx-3">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-card text-primary shadow-2xs border border-border/80 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleCommandPalette}
            className="hidden sm:flex items-center gap-1.5 w-40 md:w-48 xl:w-56 px-3 py-2 rounded-xl border border-border bg-secondary/50 text-xs text-muted-foreground hover:bg-secondary hover:border-primary/30 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">Search reports...</span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-card hover:bg-secondary text-foreground flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>

          <button
            onClick={onOpenUploadModal}
            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden xs:inline">Upload</span>
          </button>

          <Link
            to="/profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-card hover:bg-secondary flex items-center justify-center text-foreground transition-colors shadow-2xs shrink-0"
            title="User Profile"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          <div className="relative bg-card text-card-foreground w-80 max-w-[85vw] h-full shadow-2xl border-r border-border p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center font-bold text-base shrink-0">
                    <img src="/logo.png" alt="MediScan AI Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-foreground tracking-tight leading-none">
                      MediScan<span className="text-primary ml-0.5">AI</span>
                    </h3>
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-1 block">
                      Navigation Menu
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleCommandPalette();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-xs text-muted-foreground hover:border-primary/30 transition-all"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span>Search biomarkers, reports...</span>
              </button>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 block mb-2">
                  Main Pages
                </span>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20 font-bold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/80 transition-all text-xs font-semibold text-foreground"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold">Patient Profile</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Manage personal metrics</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
