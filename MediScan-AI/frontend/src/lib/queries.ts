import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProfile,
  updateProfile,
  fetchReports,
  fetchReportDetail,
  uploadReport,
  deleteReport,
  compareReports,
  fetchHealthTrends,
  sendChatMessage,
  fetchReminders,
  createReminder,
  updateReminder,
  markReminderComplete,
  deleteReminder,
  fetchMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  fetchLatestMedicationInteractions,
} from './api';
import { UserProfile, HealthReminder, Medication, Report } from '../types';

export const queryKeys = {
  profile: ['profile'] as const,
  reports: (search?: string, risk?: string) => ['reports', { search, risk }] as const,
  reportDetail: (id: string) => ['reports', id] as const,
  comparison: (baselineId: string, currentId: string) => ['comparison', baselineId, currentId] as const,
  trends: ['trends'] as const,
  reminders: (status?: string) => ['reminders', { status }] as const,
  medications: ['medications'] as const,
  medicationInteractions: ['medicationInteractions'] as const,
};

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useReportsQuery(search?: string, risk?: string) {
  return useQuery({
    queryKey: queryKeys.reports(search, risk),
    queryFn: () => fetchReports(search, risk),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useReportDetailQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.reportDetail(id),
    queryFn: () => fetchReportDetail(id),
    enabled: Boolean(id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useUploadReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, labName }: { file: File; labName: string }) => uploadReport(file, labName),
    onSuccess: (newReport: Report) => {
      queryClient.setQueriesData<Report[]>({ queryKey: ['reports'] }, (old) => {
        if (!Array.isArray(old)) return [newReport];
        const exists = old.some((r) => r.id === newReport.id);
        return exists ? old : [newReport, ...old];
      });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trends });
    },
  });
}

export function useDeleteReportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ['reports'] });
      const previousReports = queryClient.getQueriesData<Report[]>({ queryKey: ['reports'] });

      queryClient.setQueriesData<Report[]>({ queryKey: ['reports'] }, (old) => {
        if (!Array.isArray(old)) return [];
        return old.filter((r) => r.id !== deletedId);
      });

      return { previousReports };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousReports) {
        context.previousReports.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trends });
    },
  });
}

export function useComparisonQuery(baselineId: string, currentId: string) {
  return useQuery({
    queryKey: queryKeys.comparison(baselineId, currentId),
    queryFn: () => compareReports(baselineId, currentId),
    enabled: Boolean(baselineId && currentId),
    staleTime: 10 * 60 * 1000,
  });
}

export function useHealthTrendsQuery() {
  return useQuery({
    queryKey: queryKeys.trends,
    queryFn: fetchHealthTrends,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useRemindersQuery(status?: string) {
  return useQuery({
    queryKey: queryKeys.reminders(status),
    queryFn: () => fetchReminders(status),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reminder: Partial<HealthReminder>) => createReminder(reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      localStorage.setItem('mediscan_reminders_cleared', 'false');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('mediscan_reminders_updated'));
      }
    },
  });
}

export function useUpdateReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reminder }: { id: number; reminder: Partial<HealthReminder> }) => updateReminder(id, reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useCompleteReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markReminderComplete(id),
    onMutate: async (completedId: number) => {
      await queryClient.cancelQueries({ queryKey: ['reminders'] });
      const previousReminders = queryClient.getQueriesData<HealthReminder[]>({ queryKey: ['reminders'] });

      queryClient.setQueriesData<HealthReminder[]>({ queryKey: ['reminders'] }, (old) => {
        if (!old) return [];
        return old.map((r) => (r.id === completedId ? { ...r, status: 'Completed' } : r));
      });

      return { previousReminders };
    },
    onError: (_err, _completedId, context) => {
      if (context?.previousReminders) {
        context.previousReminders.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useDeleteReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReminder(id),
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ['reminders'] });
      const previousReminders = queryClient.getQueriesData<HealthReminder[]>({ queryKey: ['reminders'] });

      queryClient.setQueriesData<HealthReminder[]>({ queryKey: ['reminders'] }, (old) => {
        if (!old) return [];
        return old.filter((r) => r.id !== deletedId);
      });

      return { previousReminders };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousReminders) {
        context.previousReminders.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useMedicationsQuery() {
  return useQuery({
    queryKey: queryKeys.medications,
    queryFn: fetchMedications,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateMedicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (medication: Partial<Medication>) => createMedication(medication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medications });
      queryClient.invalidateQueries({ queryKey: queryKeys.medicationInteractions });
    },
  });
}

export function useDeleteMedicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMedication(id),
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.medications });
      const previousMedications = queryClient.getQueryData<Medication[]>(queryKeys.medications);

      queryClient.setQueryData<Medication[]>(queryKeys.medications, (old) => {
        if (!old) return [];
        return old.filter((m) => m.id !== deletedId);
      });

      return { previousMedications };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousMedications) {
        queryClient.setQueryData(queryKeys.medications, context.previousMedications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.medications });
      queryClient.invalidateQueries({ queryKey: queryKeys.medicationInteractions });
    },
  });
}

export function useMedicationInteractionsQuery() {
  return useQuery({
    queryKey: queryKeys.medicationInteractions,
    queryFn: fetchLatestMedicationInteractions,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
