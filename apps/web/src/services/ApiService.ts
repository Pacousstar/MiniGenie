/**
 * Service API pour communiquer avec le backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Récupérer le token d'authentification depuis localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('@minigenie:auth_token');
}

/**
 * Effectuer une requête API authentifiée
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: `Erreur ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.error || `Erreur ${response.status}`);
  }

  return response.json();
}

/**
 * Service API pour le dashboard
 */
export const apiService = {
  /**
   * Récupérer les données du dashboard pour un enfant
   */
  async getDashboardData(childId: string): Promise<Partial<{
    childName: string;
    overallScore: number;
    userLevel: number;
    totalSessions: number;
    totalTime: number;
    todayTime: number;
    modulesCompleted: number;
    badgesUnlocked: number;
    progressByModule: Record<string, any>;
    recentSessions: Array<any>;
    timeByModule: Record<string, number>;
    sessionsByDate: Array<any>;
    weeklyProgress: Array<any>;
  }>> {
    return apiRequest(`/api/dashboard/${childId}`);
  },

  /**
   * Récupérer les statistiques d'utilisation
   */
  async getUsageStats(childId: string) {
    return apiRequest(`/api/analytics/child/${childId}`);
  },

  /**
   * Exporter les données en CSV
   */
  async exportCSV(childId: string, startDate?: Date, endDate?: Date) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const token = getAuthToken();
    const url = `${API_BASE_URL}/api/analytics/export/csv/${childId}${params.toString() ? `?${params}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `minigenie-export-${childId}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  /**
   * Générer un rapport PDF (retourne les données structurées)
   */
  async generatePDFReport(childId: string) {
    return apiRequest(`/api/analytics/export/pdf/${childId}`);
  },
};
