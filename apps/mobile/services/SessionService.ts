/**
 * Service de gestion des sessions et temps d'utilisation
 */
import { getChildProfile, saveChildProfile } from '@minigenie/shared/src/utils/storage';

export interface Session {
  id: string;
  childId: string;
  moduleId: string;
  moduleType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // en secondes
  score?: number;
  completed: boolean;
}

export interface SessionStats {
  totalSessions: number;
  totalTime: number; // en minutes
  averageSessionTime: number; // en minutes
  sessionsByModule: Record<string, number>;
  timeByModule: Record<string, number>; // en minutes
  lastSessionDate?: Date;
}

class SessionService {
  private currentSession: Session | null = null;
  private sessionStartTime: Date | null = null;
  private readonly MAX_SESSION_DURATION = 40 * 60; // 40 minutes en secondes
  private readonly PAUSE_REMINDER_TIME = 20 * 60; // 20 minutes en secondes

  /**
   * Démarrer une nouvelle session
   */
  async startSession(childId: string, moduleId: string, moduleType: string): Promise<Session> {
    // Terminer la session précédente si elle existe
    if (this.currentSession) {
      await this.endSession();
    }

    const session: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      childId,
      moduleId,
      moduleType,
      startTime: new Date(),
      completed: false,
    };

    this.currentSession = session;
    this.sessionStartTime = new Date();

    // Sauvegarder la session
    await this.saveSession(session);

    return session;
  }

  /**
   * Terminer la session en cours
   */
  async endSession(score?: number, completed: boolean = true): Promise<Session | null> {
    if (!this.currentSession) {
      return null;
    }
    
    if (!this.sessionStartTime) {
      // Si pas de startTime, utiliser la date de début de la session
      this.sessionStartTime = new Date(this.currentSession.startTime);
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - this.sessionStartTime.getTime()) / 1000);

    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;
    this.currentSession.score = score;
    this.currentSession.completed = completed;

    // Sauvegarder la session terminée
    await this.saveSession(this.currentSession);

    const finishedSession = this.currentSession;
    this.currentSession = null;
    this.sessionStartTime = null;

    return finishedSession;
  }

  /**
   * Vérifier si une pause est nécessaire
   */
  shouldTakeBreak(): boolean {
    if (!this.sessionStartTime) return false;
    
    const elapsed = Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
    return elapsed >= this.PAUSE_REMINDER_TIME;
  }

  /**
   * Vérifier si la session a atteint la durée maximale
   */
  isSessionTooLong(): boolean {
    if (!this.sessionStartTime) return false;
    
    const elapsed = Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
    return elapsed >= this.MAX_SESSION_DURATION;
  }

  /**
   * Obtenir la durée de la session en cours
   */
  getCurrentSessionDuration(): number {
    if (!this.sessionStartTime) return 0;
    
    return Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
  }

  /**
   * Sauvegarder une session
   */
  private async saveSession(session: Session): Promise<void> {
    try {
      const profile = await getChildProfile();
      if (!profile) return;

      if (!profile.sessions) {
        profile.sessions = [];
      }

      // Mettre à jour ou ajouter la session
      const existingIndex = profile.sessions.findIndex((s: Session) => s.id === session.id);
      if (existingIndex >= 0) {
        profile.sessions[existingIndex] = session;
      } else {
        profile.sessions.push(session);
      }

      await saveChildProfile(profile);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
    }
  }

  /**
   * Récupérer toutes les sessions d'un enfant
   */
  async getSessions(childId: string): Promise<Session[]> {
    try {
      const profile = await getChildProfile();
      if (!profile || !profile.sessions) {
        return [];
      }

      return profile.sessions.filter((s: Session) => s.childId === childId);
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      return [];
    }
  }

  /**
   * Obtenir les statistiques de sessions
   */
  async getSessionStats(childId: string): Promise<SessionStats> {
    const sessions = await this.getSessions(childId);
    
    const stats: SessionStats = {
      totalSessions: sessions.length,
      totalTime: 0,
      averageSessionTime: 0,
      sessionsByModule: {},
      timeByModule: {},
    };

    if (sessions.length === 0) {
      return stats;
    }

    // Calculer les statistiques
    let totalSeconds = 0;
    sessions.forEach((session) => {
      const duration = session.duration || 0;
      totalSeconds += duration;
      
      // Par module
      if (!stats.sessionsByModule[session.moduleType]) {
        stats.sessionsByModule[session.moduleType] = 0;
        stats.timeByModule[session.moduleType] = 0;
      }
      stats.sessionsByModule[session.moduleType]++;
      stats.timeByModule[session.moduleType] += Math.floor(duration / 60);
    });

    stats.totalTime = Math.floor(totalSeconds / 60);
    stats.averageSessionTime = Math.floor(totalSeconds / sessions.length / 60);

    // Dernière session
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    if (sortedSessions.length > 0) {
      stats.lastSessionDate = new Date(sortedSessions[0].startTime);
    }

    return stats;
  }

  /**
   * Obtenir le temps total d'apprentissage aujourd'hui
   */
  async getTodayTime(childId: string): Promise<number> {
    const sessions = await this.getSessions(childId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    const totalSeconds = todaySessions.reduce((sum, session) => {
      return sum + (session.duration || 0);
    }, 0);

    return Math.floor(totalSeconds / 60); // en minutes
  }
}

// Instance singleton
export const sessionService = new SessionService();

