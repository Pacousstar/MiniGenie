/**
 * Service d'authentification
 */
import { supabaseClient, supabaseAdmin } from '../config/supabase';

export interface AuthResult {
  user: any;
  session: any;
  accessToken: string;
  refreshToken: string;
}

export interface ChildProfile {
  id: string;
  pseudo: string;
  age: number;
  level: string;
  userLevel: number;
  overallScore: number;
  userId: string;
}

class AuthService {
  /**
   * Inscription d'un parent
   */
  async register(email: string, password: string, name?: string): Promise<AuthResult> {
    if (!supabaseClient) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user || !data.session) {
        throw new Error('Erreur lors de l\'inscription');
      }

      // Créer le profil utilisateur dans la table users (si elle existe)
      // Pour l'instant, on utilise les métadonnées de Supabase Auth

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || name,
        },
        session: data.session,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion d'un parent
   */
  async login(email: string, password: string): Promise<AuthResult> {
    if (!supabaseClient) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user || !data.session) {
        throw new Error('Erreur lors de la connexion');
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
        },
        session: data.session,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnexion
   */
  async logout(token: string): Promise<void> {
    if (!supabaseClient) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Créer un client temporaire avec le token
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'utilisateur depuis le token
   */
  async getUser(token: string): Promise<any> {
    if (!supabaseClient) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);

      if (error || !user) {
        throw new Error('Token invalide ou expiré');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Créer un profil enfant pour un utilisateur
   */
  async createChild(token: string, childData: any): Promise<ChildProfile> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Vérifier l'utilisateur
      const user = await this.getUser(token);

      // Créer le profil enfant
      const { data, error } = await supabaseAdmin
        .from('children')
        .insert({
          pseudo: childData.pseudo,
          age: childData.age,
          level: childData.level || this.detectLevel(childData.age),
          user_level: 0,
          overall_score: 0,
          user_id: user.id, // Lier l'enfant à l'utilisateur
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        pseudo: data.pseudo,
        age: data.age,
        level: data.level,
        userLevel: data.user_level,
        overallScore: data.overall_score,
        userId: data.user_id,
      };
    } catch (error: any) {
      console.error('Erreur lors de la création du profil enfant:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les enfants d'un utilisateur
   */
  async getUserChildren(token: string): Promise<ChildProfile[]> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const user = await this.getUser(token);

      const { data, error } = await supabaseAdmin
        .from('children')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      return (data || []).map((child) => ({
        id: child.id,
        pseudo: child.pseudo,
        age: child.age,
        level: child.level,
        userLevel: child.user_level,
        overallScore: child.overall_score,
        userId: child.user_id,
      }));
    } catch (error: any) {
      console.error('Erreur lors de la récupération des enfants:', error);
      throw error;
    }
  }

  /**
   * Détecter le niveau selon l'âge
   */
  private detectLevel(age: number): string {
    if (age === 3) return 'maternelle_ps';
    if (age === 4) return 'maternelle_ms';
    if (age === 5) return 'maternelle_gs';
    if (age === 6) return 'primaire_cp1';
    if (age >= 7) return 'primaire_cp2';
    return 'maternelle_ps';
  }
}

export const authService = new AuthService();
