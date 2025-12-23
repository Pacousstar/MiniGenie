/**
 * Service d'analytics et de collecte de données
 */
import { supabaseAdmin } from '../config/supabase';

export interface AnalyticsData {
  totalUsers: number;
  totalChildren: number;
  totalSessions: number;
  totalTime: number; // en minutes
  averageSessionTime: number;
  sessionsByModule: Record<string, number>;
  sessionsByDate: Array<{ date: string; count: number }>;
  activeUsers: number; // utilisateurs actifs sur les 30 derniers jours
  completionRate: number; // taux de complétion des modules
}

export interface UsageStats {
  childId: string;
  sessionsCount: number;
  totalTime: number;
  modulesUsed: string[];
  averageScore: number;
  lastActivity: Date;
}

class AnalyticsService {
  /**
   * Récupérer les analytics globales
   */
  async getGlobalAnalytics(): Promise<AnalyticsData> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Compter les utilisateurs (via auth.users)
      // Note: On ne peut pas compter directement auth.users avec Supabase Admin
      // On compte les enfants uniques comme proxy
      const { data: children } = await supabaseAdmin
        .from('children')
        .select('id, user_id');

      const uniqueUsers = new Set(children?.map(c => c.user_id) || []);
      const totalUsers = uniqueUsers.size;
      const totalChildren = children?.length || 0;

      // Récupérer toutes les sessions
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*');

      const totalSessions = sessions?.length || 0;
      const totalSeconds = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
      const totalTime = Math.floor(totalSeconds / 60);
      const averageSessionTime = totalSessions > 0 ? Math.floor(totalSeconds / totalSessions / 60) : 0;

      // Sessions par module
      const sessionsByModule: Record<string, number> = {};
      sessions?.forEach((s) => {
        const moduleType = s.module_type || 'unknown';
        sessionsByModule[moduleType] = (sessionsByModule[moduleType] || 0) + 1;
      });

      // Sessions par date (30 derniers jours)
      const sessionsByDate: Array<{ date: string; count: number }> = [];
      const dateMap: Record<string, number> = {};

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      sessions?.forEach((s) => {
        const sessionDate = new Date(s.start_time);
        if (sessionDate >= thirtyDaysAgo) {
          const dateKey = sessionDate.toISOString().split('T')[0];
          dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
        }
      });

      // Remplir les dates manquantes avec 0
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        sessionsByDate.push({
          date: dateKey,
          count: dateMap[dateKey] || 0,
        });
      }

      // Utilisateurs actifs (30 derniers jours)
      const activeUserIds = new Set<string>();
      sessions?.forEach((s) => {
        const sessionDate = new Date(s.start_time);
        if (sessionDate >= thirtyDaysAgo) {
          // Trouver l'user_id via child_id
          const child = children?.find(c => c.id === s.child_id);
          if (child) {
            activeUserIds.add(child.user_id);
          }
        }
      });

      // Taux de complétion
      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('completed');

      const completedCount = progress?.filter(p => p.completed).length || 0;
      const totalProgress = progress?.length || 0;
      const completionRate = totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0;

      return {
        totalUsers,
        totalChildren,
        totalSessions,
        totalTime,
        averageSessionTime,
        sessionsByModule,
        sessionsByDate,
        activeUsers: activeUserIds.size,
        completionRate,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des analytics:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques d'utilisation pour un enfant
   */
  async getChildUsageStats(childId: string): Promise<UsageStats> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId)
        .order('start_time', { ascending: false });

      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      const sessionsCount = sessions?.length || 0;
      const totalSeconds = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
      const totalTime = Math.floor(totalSeconds / 60);

      const modulesUsed = new Set<string>();
      sessions?.forEach((s) => {
        if (s.module_type) {
          modulesUsed.add(s.module_type);
        }
      });

      const scores = sessions?.map(s => s.score).filter(s => s !== null && s !== undefined) as number[];
      const averageScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      const lastSession = sessions?.[0];
      const lastActivity = lastSession ? new Date(lastSession.start_time) : new Date();

      return {
        childId,
        sessionsCount,
        totalTime,
        modulesUsed: Array.from(modulesUsed),
        averageScore,
        lastActivity,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats d\'utilisation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données pour export CSV
   */
  async getExportData(childId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      let query = supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId);

      if (startDate) {
        query = query.gte('start_time', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('start_time', endDate.toISOString());
      }

      query = query.order('start_time', { ascending: false });

      const { data: sessions, error } = await query;

      if (error) {
        throw error;
      }

      // Formater pour export
      return (sessions || []).map((s) => ({
        date: new Date(s.start_time).toLocaleDateString('fr-FR'),
        heure: new Date(s.start_time).toLocaleTimeString('fr-FR'),
        module: s.module_type || 'N/A',
        duree: `${Math.floor((s.duration || 0) / 60)} min`,
        score: s.score || 'N/A',
        complete: s.completed ? 'Oui' : 'Non',
      }));
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données d\'export:', error);
      throw error;
    }
  }

  /**
   * Récupérer les données complètes pour rapport PDF
   */
  async getReportData(childId: string): Promise<any> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Profil enfant
      const { data: child } = await supabaseAdmin
        .from('children')
        .select('*')
        .eq('id', childId)
        .single();

      // Sessions
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId)
        .order('start_time', { ascending: false });

      // Progression
      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      // Badges
      const { data: badges } = await supabaseAdmin
        .from('badges')
        .select('*')
        .eq('child_id', childId);

      // Statistiques
      const stats = await this.getChildUsageStats(childId);

      return {
        child: {
          pseudo: child?.pseudo,
          age: child?.age,
          level: child?.level,
          userLevel: child?.user_level,
          overallScore: child?.overall_score,
        },
        stats,
        sessions: (sessions || []).slice(0, 50), // Limiter à 50 dernières
        progress: progress || [],
        badges: badges || [],
        generatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données de rapport:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
