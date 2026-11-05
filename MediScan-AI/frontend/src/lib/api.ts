import { UserProfile, Report, ComparisonResult, HealthTrendPoint, ChatMessage, HealthReminder, Medication, MedicationInteractionResult } from '../types';

let rawBase = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim().replace(/\/+$/, '');
if (!rawBase.endsWith('/api/v1') && rawBase.startsWith('http')) {
  rawBase += '/api/v1';
}
const API_BASE = rawBase;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mediscan_token');
  const selectedModel = localStorage.getItem('mediscan_selected_model') || 'groq/gpt-oss-120b';
  const customApiKey = localStorage.getItem('mediscan_custom_api_key') || '';
  const customModelId = localStorage.getItem('mediscan_custom_model_id') || '';
  const customProviderUrl = localStorage.getItem('mediscan_custom_provider_url') || '';
  const useCustomKey = localStorage.getItem('mediscan_use_custom_key') === 'true';

  const headers: Record<string, string> = {
    'X-AI-Model': selectedModel
  };

  if (useCustomKey && customApiKey) {
    headers['X-Custom-API-Key'] = customApiKey;
    headers['X-Custom-Model-Id'] = customModelId;
    headers['X-Custom-Provider-Url'] = customProviderUrl;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile/`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch profile.');
  return res.json();
}

export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to update profile.');
  return res.json();
}

export async function uploadReport(file: File, labName: string = 'Clinical Diagnostics'): Promise<Report> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('laboratory_name', labName);
  formData.append('environment', import.meta.env.MODE || 'development');
  const autoAi = localStorage.getItem('mediscan_auto_analysis_enabled') !== 'false';
  formData.append('auto_ai_analysis', String(autoAi));

  const res = await fetch(`${API_BASE}/reports/upload`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Report processing failed.');
  }
  return res.json();
}

export async function fetchReports(search?: string, risk?: string): Promise<Report[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (risk) params.append('risk', risk);
  params.append('environment', import.meta.env.MODE || 'development');

  const res = await fetch(`${API_BASE}/reports/?${params.toString()}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch reports.');
  return res.json();
}

export async function fetchReportDetail(id: string): Promise<Report> {
  const res = await fetch(`${API_BASE}/reports/${id}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Report not found.');
  return res.json();
}

export async function deleteReport(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reports/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete report.');
}

export async function compareReports(baselineId: string, currentId: string): Promise<ComparisonResult> {
  const params = new URLSearchParams({
    baseline_id: baselineId,
    current_id: currentId,
  });

  const res = await fetch(`${API_BASE}/reports/compare?${params.toString()}`, {
    method: 'GET',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to compute comparison.');
  return res.json();
}

export async function fetchHealthTrends(): Promise<HealthTrendPoint[]> {
  const params = new URLSearchParams();
  params.append('environment', import.meta.env.MODE || 'development');

  const res = await fetch(`${API_BASE}/trends/?${params.toString()}`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch health trends.');
  return res.json();
}

export async function sendChatMessage(message: string): Promise<{ reply: string }> {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('AI Assistant communication failed.');
  return res.json();
}

export function getReportPdfExportUrl(reportId: string): string {
  return `${API_BASE}/reports/${reportId}/export-pdf`;
}

// Reminders API
export async function fetchReminders(status?: string): Promise<HealthReminder[]> {
  const url = status ? `${API_BASE}/reminders/?status=${encodeURIComponent(status)}` : `${API_BASE}/reminders/`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch health reminders.');
  return res.json();
}

export async function createReminder(reminder: Partial<HealthReminder>): Promise<HealthReminder> {
  const res = await fetch(`${API_BASE}/reminders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(reminder),
  });
  if (!res.ok) throw new Error('Failed to create reminder.');
  return res.json();
}

export async function updateReminder(id: number, reminder: Partial<HealthReminder>): Promise<HealthReminder> {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(reminder),
  });
  if (!res.ok) throw new Error('Failed to update reminder.');
  return res.json();
}

export async function markReminderComplete(id: number): Promise<HealthReminder> {
  const res = await fetch(`${API_BASE}/reminders/${id}/complete`, {
    method: 'PATCH',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to complete reminder.');
  return res.json();
}

export async function deleteReminder(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete reminder.');
}

// Medications API
export async function fetchMedications(): Promise<Medication[]> {
  const res = await fetch(`${API_BASE}/medications/`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch medications.');
  return res.json();
}

export async function createMedication(medication: Partial<Medication>): Promise<Medication> {
  const res = await fetch(`${API_BASE}/medications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(medication),
  });
  if (!res.ok) throw new Error('Failed to create medication.');
  return res.json();
}

export async function updateMedication(id: number, medication: Partial<Medication>): Promise<Medication> {
  const res = await fetch(`${API_BASE}/medications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(medication),
  });
  if (!res.ok) throw new Error('Failed to update medication.');
  return res.json();
}

export async function deleteMedication(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/medications/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete medication record.');
}

export async function fetchLatestMedicationInteractions(): Promise<MedicationInteractionResult> {
  const res = await fetch(`${API_BASE}/medications/analyze-latest`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to analyze medication interactions.');
  return res.json();
}

