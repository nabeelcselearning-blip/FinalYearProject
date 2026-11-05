import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  MessageSquare,
  Bell,
  Pill,
  User,
  Settings,
  Upload,
  Sun,
  Moon,
  Laptop,
  Search,
} from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { useTheme } from '../../lib/theme';
import { useReportsQuery } from '../../lib/queries';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setCommandPaletteOpen, openUploadModal } = useUIStore();
  const { setTheme } = useTheme();
  const { data: reports = [] } = useReportsQuery();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const runCommand = (action: () => void) => {
    setCommandPaletteOpen(false);
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs px-4 animate-in fade-in-0">
      <div
        className="fixed inset-0"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <Command className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border bg-popover shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            placeholder="Type a command, search reports, or jump to page... (Esc to exit)"
            className="flex h-6 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
        </div>

        <Command.List className="max-h-[340px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-xs sm:text-sm text-muted-foreground">
            No clinical results found.
          </Command.Empty>

          <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(openUploadModal)}
            >
              <Upload className="mr-3 h-4 w-4 text-primary" />
              <span>Upload New Medical Report</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/chat'))}
            >
              <MessageSquare className="mr-3 h-4 w-4 text-emerald-500" />
              <span>Ask AI Health Assistant</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/'))}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              <span>Patient Dashboard</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/reports'))}
            >
              <FileText className="mr-3 h-4 w-4" />
              <span>Medical Reports Management</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/trends'))}
            >
              <TrendingUp className="mr-3 h-4 w-4" />
              <span>Clinical Trends Workspace</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/reminders'))}
            >
              <Bell className="mr-3 h-4 w-4" />
              <span>Health Reminders</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/medications'))}
            >
              <Pill className="mr-3 h-4 w-4" />
              <span>Medications Tracker</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/profile'))}
            >
              <User className="mr-3 h-4 w-4" />
              <span>Patient Profile</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => navigate('/settings'))}
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>System Settings</span>
            </Command.Item>
          </Command.Group>

          {reports.length > 0 && (
            <Command.Group heading="Recent Reports" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {reports.slice(0, 5).map((r) => (
                <Command.Item
                  key={r.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  onSelect={() => runCommand(() => navigate(`/reports/${r.id}`))}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate font-medium">{r.file_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{r.laboratory_name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Theme Settings" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => setTheme('light'))}
            >
              <Sun className="mr-3 h-4 w-4 text-amber-500" />
              <span>Switch to Light Mode</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => setTheme('dark'))}
            >
              <Moon className="mr-3 h-4 w-4 text-sky-400" />
              <span>Switch to Dark Mode (Charcoal Elevation)</span>
            </Command.Item>
            <Command.Item
              className="flex items-center rounded-lg px-3 py-2 text-xs sm:text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onSelect={() => runCommand(() => setTheme('system'))}
            >
              <Laptop className="mr-3 h-4 w-4 text-slate-400" />
              <span>System Theme Default</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};
