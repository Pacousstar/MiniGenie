/**
 * Service pour le dashboard parent
 */
import { supabaseAdmin } from '../config/supabase';

export interface DashboardData {
  childName: string;
  overallScore: number;
  userLevel: number;
  totalSessions: number;
  totalTime: number;
  todayTime: number;
  modulesCompleted: number;
  badgesUnlocked: number;
  progressByModule: Record<string, any>;
  recentSessions: any[];
  timeByModule: Record<string, number>;
  sessionsByDate: any[];
  weeklyProgress: any[];
}

class DashboardService {
  /**
   * Récupérer les données complètes du dashboard
   */
  async getDashboardData(childId: string): Promise<DashboardData> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Récupérer le profil de l'enfant
      const { data: child, error: childError } = await supabaseAdmin
        .from('children')
        .select('*')
        .eq('id', childId)
        .single();

      if (childError || !child) {
        throw new Error('Enfant non trouvé');
      }

      // Récupérer les sessions
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId)
        .order('start_time', { ascending: false })
        .limit(50);

      // Récupérer la progression par module
      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      // Récupérer les badges
      const { data: badges } = await supabaseAdmin
        .from('badges')
        .select('*')
        .eq('child_id', childId);

      // Calculer les statistiques
      const totalSessions = sessions?.length || 0;
      const totalTime = Math.floor(
        (sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0) / 60
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = sessions?.filter((s) => {
        const sessionDate = new Date(s.start_time);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime();
      }) || [];
      const todayTime = Math.floor(
        todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60
      );

      const modulesCompleted = progress?.filter((p) => p.completed).length || 0;
      const badgesUnlocked = badges?.length || 0;

      // Formater la progression par module
      const progressByModule: Record<string, any> = {};
      progress?.forEach((p) => {
        progressByModule[`${p.module_type}_${childId}`] = {
          moduleType: p.module_type,
          score: p.score || 0,
          attempts: p.attempts || 0,
          completed: p.completed || false,
          bestScore: p.best_score || 0,
          lastAttempt: p.last_attempt ? new Date(p.last_attempt) : new Date(),
        };
      });

      // Sessions récentes
      const recentSessions = (sessions?.slice(0, 5) || []).map((s) => ({
        moduleType: s.module_type,
        date: new Date(s.start_time),
        duration: Math.floor((s.duration || 0) / 60),
        score: s.score,
      }));

      // Temps par module
      const timeByModule: Record<string, number> = {};
      sessions?.forEach((s) => {
        const moduleType = s.module_type;
        const duration = Math.floor((s.duration || 0) / 60);
        timeByModule[moduleType] = (timeByModule[moduleType] || 0) + duration;
      });

      // Progression hebdomadaire
      const weeklyProgress = this.calculateWeeklyProgress(sessions || []);

      return {
        childName: child.pseudo || 'Enfant',
        overallScore: child.overall_score || 0,
        userLevel: child.user_level || 0,
        totalSessions,
        totalTime,
        todayTime,
        modulesCompleted,
        badgesUnlocked,
        progressByModule,
        recentSessions,
        timeByModule,
        sessionsByDate: [],
        weeklyProgress,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données dashboard:', error);
      throw error;
    }
  }

  /**
   * Calculer la progression hebdomadaire
   */
  private calculateWeeklyProgress(sessions: any[]): Array<{ day: string; time: number; score: number }> {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const weekly: Record<string, { time: number; scores: number[] }> = {};

    days.forEach((day) => {
      weekly[day] = { time: 0, scores: [] };
    });

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];

      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.start_time);
        return sessionDate.toDateString() === date.toDateString();
      });

      const dayTime = daySessions.reduce((sum, s) => sum + Math.floor((s.duration || 0) / 60), 0);
      const dayScores = daySessions.map((s) => s.score).filter((s) => s !== null && s !== undefined) as number[];

      weekly[dayName].time += dayTime;
      weekly[dayName].scores.push(...dayScores);
    }

    return days.map((day) => ({
      day,
      time: weekly[day].time,
      score: weekly[day].scores.length > 0
        ? Math.round(weekly[day].scores.reduce((a, b) => a + b, 0) / weekly[day].scores.length)
        : 0,
    }));
  }

  /**
   * Récupérer les statistiques globales
   */
  async getStats(childId: string): Promise<any> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId);

      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      const totalSessions = sessions?.length || 0;
      const totalTime = Math.floor(
        (sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0) / 60
      );
      const averageScore =
        sessions && sessions.length > 0
          ? Math.round(
              sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
            )
          : 0;
      const modulesCompleted = progress?.filter((p) => p.completed).length || 0;

      return {
        totalSessions,
        totalTime,
        averageScore,
        modulesCompleted,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
