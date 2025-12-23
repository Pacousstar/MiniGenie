/**
 * Service pour la gestion des sessions
 */
import { supabaseAdmin } from '../config/supabase';

export interface Session {
  id: string;
  childId: string;
  moduleId: string;
  moduleType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  score?: number;
  completed: boolean;
}

interface SessionFilters {
  startDate?: string;
  endDate?: string;
  moduleType?: string;
}

class SessionService {
  /**
   * Récupérer les sessions d'un enfant
   */
  async getSessions(childId: string, filters?: SessionFilters): Promise<Session[]> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      let query = supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId);

      if (filters?.startDate) {
        query = query.gte('start_time', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('start_time', filters.endDate);
      }

      if (filters?.moduleType) {
        query = query.eq('module_type', filters.moduleType);
      }

      query = query.order('start_time', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map((s) => ({
        id: s.id,
        childId: s.child_id,
        moduleId: s.module_id,
        moduleType: s.module_type,
        startTime: new Date(s.start_time),
        endTime: s.end_time ? new Date(s.end_time) : undefined,
        duration: s.duration,
        score: s.score,
        completed: s.completed || false,
      }));
    } catch (error: any) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle session
   */
  async createSession(sessionData: Partial<Session>): Promise<Session> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .insert({
          child_id: sessionData.childId,
          module_id: sessionData.moduleId || '',
          module_type: sessionData.moduleType || '',
          start_time: sessionData.startTime?.toISOString() || new Date().toISOString(),
          end_time: sessionData.endTime?.toISOString() || null,
          duration: sessionData.duration || null,
          score: sessionData.score || null,
          completed: sessionData.completed || false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        childId: data.child_id,
        moduleId: data.module_id,
        moduleType: data.module_type,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        duration: data.duration,
        score: data.score,
        completed: data.completed || false,
      };
    } catch (error: any) {
      console.error('Erreur lors de la création de la session:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une session
   */
  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const updateData: any = {};

      if (updates.endTime !== undefined) {
        updateData.end_time = updates.endTime.toISOString();
      }
      if (updates.duration !== undefined) {
        updateData.duration = updates.duration;
      }
      if (updates.score !== undefined) {
        updateData.score = updates.score;
      }
      if (updates.completed !== undefined) {
        updateData.completed = updates.completed;
      }

      const { data, error } = await supabaseAdmin
        .from('sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        childId: data.child_id,
        moduleId: data.module_id,
        moduleType: data.module_type,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        duration: data.duration,
        score: data.score,
        completed: data.completed || false,
      };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de sessions
   */
  async getSessionStats(childId: string): Promise<any> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: sessions } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('child_id', childId);

      const totalSessions = sessions?.length || 0;
      const totalSeconds = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
      const totalTime = Math.floor(totalSeconds / 60);
      const averageSessionTime = totalSessions > 0 ? Math.floor(totalSeconds / totalSessions / 60) : 0;

      const sessionsByModule: Record<string, number> = {};
      const timeByModule: Record<string, number> = {};

      sessions?.forEach((s) => {
        const moduleType = s.module_type;
        sessionsByModule[moduleType] = (sessionsByModule[moduleType] || 0) + 1;
        timeByModule[moduleType] = (timeByModule[moduleType] || 0) + Math.floor((s.duration || 0) / 60);
      });

      return {
        totalSessions,
        totalTime,
        averageSessionTime,
        sessionsByModule,
        timeByModule,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats de sessions:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
