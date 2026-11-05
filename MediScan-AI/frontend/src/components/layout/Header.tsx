import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, BellIcon, CalendarIcon, CaretDownIcon, 
  SunIcon, MoonIcon, DesktopIcon, PersonIcon, FileTextIcon, GearIcon, ChatBubbleIcon
} from '@radix-ui/react-icons';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../lib/theme';
import { useUIStore } from '../../lib/store';
import { useRemindersQuery } from '../../lib/queries';

interface HeaderProps {
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenUploadModal }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const { toggleCommandPalette } = useUIStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('mediscan_user_name') || 'John Doe');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: reminders = [] } = useRemindersQuery();
  const pendingRemindersCount = reminders.filter(r => r.status !== 'Completed').length;

  const [hasClearedDot, setHasClearedDot] = useState(() => {
    return localStorage.getItem('mediscan_reminders_cleared') === 'true';
  });

  useEffect(() => {
    const handleRemindersUpdated = () => {
      setHasClearedDot(localStorage.getItem('mediscan_reminders_cleared') === 'true');
    };
    handleRemindersUpdated();
    window.addEventListener('mediscan_reminders_updated', handleRemindersUpdated);
    return () => window.removeEventListener('mediscan_reminders_updated', handleRemindersUpdated);
  }, []);

  useEffect(() => {
    if (location.pathname === '/reminders') {
      setHasClearedDot(true);
      localStorage.setItem('mediscan_reminders_cleared', 'true');
    }
  }, [location.pathname]);

  const showNotificationDot = pendingRemindersCount > 0 && !hasClearedDot && location.pathname !== '/reminders';

  useEffect(() => {
    const syncName = () => {
      const cached = localStorage.getItem('mediscan_user_name');
      if (cached) setUserName(cached);
    };
    syncName();
    window.addEventListener('mediscan_name_updated', syncName);
    window.addEventListener('storage', syncName);
    return () => {
      window.removeEventListener('mediscan_name_updated', syncName);
      window.removeEventListener('storage', syncName);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PA';

  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className={`sticky top-0 z-20 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
      isScrolled
        ? 'glass-scroll-active border-b border-primary/20'
        : 'bg-card/70 backdrop-blur-md border-b border-border'
    }`}>
      {/* Search Bar Triggering Command Palette */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center justify-between gap-2.5 px-3.5 h-10 rounded-xl border border-border bg-secondary/30 text-xs text-muted-foreground hover:bg-secondary/60 hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">Search clinical reports, biomarkers, or jump to page...</span>
          </div>
        </button>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* Date Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-xl bg-secondary/30 border border-border">
          <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Session Date: {todayStr}</span>
        </div>

        {/* Theme Selector */}
        <button
          onClick={() => {
            if (theme === 'light') setTheme('dark');
            else if (theme === 'dark') setTheme('system');
            else setTheme('light');
          }}
          className="w-9 h-9 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-foreground flex items-center justify-center transition-colors shrink-0"
          title={`Current theme: ${theme}. Click to switch theme.`}
        >
          {effectiveTheme === 'dark' ? (
            <SunIcon className="w-4 h-4 text-amber-400" />
          ) : theme === 'system' ? (
            <DesktopIcon className="w-4 h-4 text-sky-500" />
          ) : (
            <MoonIcon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <Link
          to="/reminders"
          className="relative w-9 h-9 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-foreground flex items-center justify-center transition-colors shrink-0"
          title="Notifications & Health Reminders"
        >
          <BellIcon className="w-4 h-4" />
          {showNotificationDot && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-border bg-secondary/30 hover:bg-secondary text-foreground transition-colors shrink-0"
            title="User Profile Menu"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <CaretDownIcon className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-popover border border-border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <div className="text-xs font-bold text-foreground truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                  Clinical Patient Workspace
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <PersonIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Patient Profile</span>
                </Link>

                <Link
                  to="/reports"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <FileTextIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Reports Archive</span>
                </Link>

                <Link
                  to="/chat"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <ChatBubbleIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Assistant</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <GearIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Settings & LLM Options</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
