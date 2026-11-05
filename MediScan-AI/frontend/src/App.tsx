import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './lib/theme';
import { useUIStore } from './lib/store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DropzoneUpload } from './components/reports/DropzoneUpload';
import { CommandPalette } from './components/ui/CommandPalette';
import { TooltipProvider } from './components/ui/tooltip';
import { Skeleton } from './components/ui/skeleton';
import { Dashboard } from './pages/Dashboard';
import { Report } from './types';

// Lazy load secondary routes for blazing fast initial bundle size & load speed
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const ReportsPage = lazy(() => import('./pages/Reports').then(m => ({ default: m.ReportsPage })));
const ReportDetailPage = lazy(() => import('./pages/ReportDetail').then(m => ({ default: m.ReportDetailPage })));
const TrendsPage = lazy(() => import('./pages/Trends').then(m => ({ default: m.TrendsPage })));
const BiomarkersPage = lazy(() => import('./pages/Biomarkers').then(m => ({ default: m.BiomarkersPage })));
const RemindersPage = lazy(() => import('./pages/Reminders').then(m => ({ default: m.RemindersPage })));
const MedicationsPage = lazy(() => import('./pages/Medications').then(m => ({ default: m.MedicationsPage })));
const ChatPage = lazy(() => import('./pages/Chat').then(m => ({ default: m.ChatPage })));
const ProfilePage = lazy(() => import('./pages/Profile').then(m => ({ default: m.ProfilePage })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const LoginPage = lazy(() => import('./pages/Login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/Register').then(m => ({ default: m.RegisterPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

const RouteFallback: React.FC = () => (
  <div className="space-y-6 py-6 animate-pulse">
    <Skeleton className="h-10 w-48 rounded-xl" />
    <Skeleton className="h-64 w-full rounded-2xl" />
  </div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { isUploadOpen, setUploadOpen, openUploadModal } = useUIStore();

  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  const isStandaloneLandingPage = location.pathname === '/landing' || location.pathname === '/home';

  const handleUploadSuccess = (newReport: Report) => {
    queryClient.setQueriesData<Report[]>({ queryKey: ['reports'] }, (old) => {
      if (!Array.isArray(old)) return [newReport];
      const exists = old.some((r) => r.id === newReport.id);
      return exists ? old : [newReport, ...old];
    });
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['trends'] });
  };

  if (isStandaloneLandingPage) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
          </Routes>
        </Suspense>
        <DropzoneUpload
          isOpen={isUploadOpen}
          onClose={() => setUploadOpen(false)}
          onSuccess={handleUploadSuccess}
        />
        <CommandPalette />
        <Toaster position="bottom-right" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header onOpenUploadModal={openUploadModal} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard onOpenUploadModal={openUploadModal} />} />
              <Route path="/dashboard" element={<Dashboard onOpenUploadModal={openUploadModal} />} />
              <Route path="/reports" element={<ReportsPage onOpenUploadModal={openUploadModal} />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/biomarkers" element={<BiomarkersPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>

      <DropzoneUpload
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
      <CommandPalette />
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
