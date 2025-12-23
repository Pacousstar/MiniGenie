/**
 * Service pour récupérer les données depuis l'API backend (Supabase)
 * Utilise l'API backend au lieu de localStorage
 */
import { apiService } from './ApiService';

export interface DashboardData {
  childName: string;
  overallScore: number;
  userLevel: number;
  totalSessions: number;
  totalTime: number; // en minutes
  todayTime: number; // en minutes
  modulesCompleted: number;
  badgesUnlocked: number;
  progressByModule: Record<string, {
    moduleType: string;
    score: number;
    attempts: number;
    completed: boolean;
    bestScore: number;
    lastAttempt: Date;
  }>;
  recentSessions: Array<{
    moduleType: string;
    date: Date;
    duration: number;
    score?: number;
  }>;
  timeByModule: Record<string, number>; // en minutes
  sessionsByDate: Array<{
    date: string;
    sessions: number;
    time: number; // en minutes
  }>;
  weeklyProgress: Array<{
    day: string;
    time: number; // en minutes
    score: number;
  }>;
}

/**
 * Récupérer les données du dashboard depuis l'API backend
 * @param childId - ID de l'enfant (optionnel, récupéré depuis localStorage si non fourni)
 */
export async function getDashboardData(childId?: string): Promise<DashboardData> {
  try {
    // Récupérer l'ID de l'enfant depuis localStorage si non fourni
    let targetChildId = childId;
    
    if (!targetChildId && typeof window !== 'undefined' && window.localStorage) {
      const profileData = localStorage.getItem('@minigenie:child_profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        targetChildId = profile.id;
      }
    }

    // Si on a un childId, utiliser l'API backend
    if (targetChildId) {
      try {
        const apiData = await apiService.getDashboardData(targetChildId);
        
        // Adapter le format de l'API au format attendu par le dashboard
        return {
          childName: apiData.childName || 'Enfant',
          overallScore: apiData.overallScore || 0,
          userLevel: apiData.userLevel || 0,
          totalSessions: apiData.totalSessions || 0,
          totalTime: apiData.totalTime || 0,
          todayTime: apiData.todayTime || 0,
          modulesCompleted: apiData.modulesCompleted || 0,
          badgesUnlocked: apiData.badgesUnlocked || 0,
          progressByModule: (apiData.progressByModule || {}) as Record<string, {
            moduleType: string;
            score: number;
            attempts: number;
            completed: boolean;
            bestScore: number;
            lastAttempt: Date;
          }>,
          recentSessions: ((apiData.recentSessions || []) as Array<any>).map((s: any) => ({
            moduleType: s.moduleType,
            date: typeof s.date === 'string' ? new Date(s.date) : s.date,
            duration: s.duration,
            score: s.score,
          })),
          timeByModule: (apiData.timeByModule || {}) as Record<string, number>,
          sessionsByDate: (apiData.sessionsByDate || []) as Array<{
            date: string;
            sessions: number;
            time: number;
          }>,
          weeklyProgress: (apiData.weeklyProgress || []) as Array<{
            day: string;
            time: number;
            score: number;
          }>,
        };
      } catch (apiError) {
        console.warn('Erreur API, fallback sur localStorage:', apiError);
        // Fallback sur localStorage en cas d'erreur API
      }
    }

    // Fallback : essayer localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const profileData = localStorage.getItem('@minigenie:child_profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        
        return {
          childName: profile.pseudo || 'Enfant',
          overallScore: profile.overallScore || 0,
          userLevel: profile.userLevel || 0,
          totalSessions: profile.sessions?.length || 0,
          totalTime: calculateTotalTime(profile.sessions || []),
          todayTime: calculateTodayTime(profile.sessions || []),
          modulesCompleted: countCompletedModules(profile.modulesProgress || {}),
          badgesUnlocked: profile.badges?.filter((b: any) => b.unlockedAt).length || 0,
          progressByModule: profile.modulesProgress || {},
          recentSessions: getRecentSessions(profile.sessions || []),
          timeByModule: calculateTimeByModule(profile.sessions || []),
          sessionsByDate: calculateSessionsByDate(profile.sessions || []),
          weeklyProgress: calculateWeeklyProgress(profile.sessions || [], profile.modulesProgress || {}),
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }

  // Retourner des données par défaut
  return getDefaultData();
}

function getDefaultData(): DashboardData {
  return {
    childName: 'Enfant',
    overallScore: 0,
    userLevel: 0,
    totalSessions: 0,
    totalTime: 0,
    todayTime: 0,
    modulesCompleted: 0,
    badgesUnlocked: 0,
    progressByModule: {},
    recentSessions: [],
    timeByModule: {},
    sessionsByDate: [],
    weeklyProgress: [],
  };
}

function calculateTotalTime(sessions: any[]): number {
  return Math.floor(
    sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60
  );
}

function calculateTodayTime(sessions: any[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  return Math.floor(
    todaySessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60
  );
}

function countCompletedModules(modulesProgress: Record<string, any>): number {
  return Object.values(modulesProgress).filter((progress: any) => progress.completed).length;
}

function formatProgressByModule(modulesProgress: Record<string, any>): Record<string, any> {
  const formatted: Record<string, any> = {};
  
  Object.entries(modulesProgress).forEach(([key, progress]) => {
    formatted[key] = {
      moduleType: progress.moduleType || key.split('_')[0],
      score: progress.score || 0,
      attempts: progress.attempts || 0,
      completed: progress.completed || false,
      bestScore: progress.bestScore || progress.score || 0,
      lastAttempt: progress.lastAttempt ? new Date(progress.lastAttempt) : new Date(),
    };
  });
  
  return formatted;
}

function calculateTimeByModule(sessions: any[]): Record<string, number> {
  const timeByModule: Record<string, number> = {};
  
  sessions.forEach((session) => {
    const moduleType = session.moduleType || 'unknown';
    const duration = Math.floor((session.duration || 0) / 60); // en minutes
    
    if (!timeByModule[moduleType]) {
      timeByModule[moduleType] = 0;
    }
    timeByModule[moduleType] += duration;
  });
  
  return timeByModule;
}

function calculateSessionsByDate(sessions: any[], limit: number = 30): Array<{ date: string; sessions: number; time: number }> {
  const byDate: Record<string, { sessions: number; time: number }> = {};
  
  sessions.forEach((session) => {
    const date = new Date(session.startTime);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const duration = Math.floor((session.duration || 0) / 60); // en minutes
    
    if (!byDate[dateKey]) {
      byDate[dateKey] = { sessions: 0, time: 0 };
    }
    byDate[dateKey].sessions++;
    byDate[dateKey].time += duration;
  });
  
  // Convertir en tableau et trier par date
  return Object.entries(byDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit); // Derniers 30 jours
}

function calculateWeeklyProgress(sessions: any[], modulesProgress: Record<string, any>): Array<{ day: string; time: number; score: number }> {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weekly: Record<string, { time: number; scores: number[] }> = {};
  
  // Initialiser tous les jours
  days.forEach(day => {
    weekly[day] = { time: 0, scores: [] };
  });
  
  // Calculer pour les 7 derniers jours
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Ajuster pour lundi = 0
    
    const daySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === date.toDateString();
    });
    
    const dayTime = daySessions.reduce((sum, s) => sum + Math.floor((s.duration || 0) / 60), 0);
    const dayScores = daySessions.map(s => s.score).filter(s => s !== undefined) as number[];
    
    weekly[dayName].time += dayTime;
    weekly[dayName].scores.push(...dayScores);
  }
  
  // Convertir en format final
  return days.map(day => ({
    day,
    time: weekly[day].time,
    score: weekly[day].scores.length > 0
      ? Math.round(weekly[day].scores.reduce((a, b) => a + b, 0) / weekly[day].scores.length)
      : 0,
  }));
}

function getRecentSessions(sessions: any[], limit: number = 5): any[] {
  return sessions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, limit)
    .map((session) => ({
      moduleType: session.moduleType,
      date: new Date(session.startTime),
      duration: Math.floor((session.duration || 0) / 60),
      score: session.score,
    }));
}

