/**
 * Service pour la gestion de la progression
 */
import { supabaseAdmin } from '../config/supabase';

class ProgressService {
  /**
   * Récupérer la progression d'un enfant
   */
  async getProgress(childId: string): Promise<any> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: child } = await supabaseAdmin
        .from('children')
        .select('user_level, overall_score')
        .eq('id', childId)
        .single();

      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      const modulesProgress: Record<string, any> = {};
      progress?.forEach((p) => {
        modulesProgress[`${p.module_type}_${childId}`] = {
          moduleType: p.module_type,
          score: p.score || 0,
          attempts: p.attempts || 0,
          completed: p.completed || false,
          bestScore: p.best_score || 0,
          lastAttempt: p.last_attempt ? new Date(p.last_attempt) : new Date(),
        };
      });

      return {
        userLevel: child?.user_level || 0,
        overallScore: child?.overall_score || 0,
        modulesProgress,
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la progression:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la progression d'un module
   */
  async updateModuleProgress(
    childId: string,
    moduleType: string,
    score: number,
    completed: boolean
  ): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Vérifier si la progression existe
      const { data: existing } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId)
        .eq('module_type', moduleType)
        .single();

      const updateData: any = {
        score,
        attempts: (existing?.attempts || 0) + 1,
        best_score: Math.max(existing?.best_score || 0, score),
        last_attempt: new Date().toISOString(),
        completed: completed || (existing?.completed || false),
      };

      if (existing) {
        // Mettre à jour
        const { error } = await supabaseAdmin
          .from('module_progress')
          .update(updateData)
          .eq('child_id', childId)
          .eq('module_type', moduleType);

        if (error) throw error;
      } else {
        // Créer
        const { error } = await supabaseAdmin
          .from('module_progress')
          .insert({
            child_id: childId,
            module_type: moduleType,
            ...updateData,
          });

        if (error) throw error;
      }

      // Recalculer le user_level et overall_score
      await this.recalculateChildLevel(childId);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      throw error;
    }
  }

  /**
   * Recalculer le niveau et le score global d'un enfant
   */
  private async recalculateChildLevel(childId: string): Promise<void> {
    if (!supabaseAdmin) return;

    try {
      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('*')
        .eq('child_id', childId);

      if (!progress || progress.length === 0) return;

      // Calculer la moyenne des scores
      let totalScore = 0;
      let totalWeight = 0;

      progress.forEach((p) => {
        if (p.attempts > 0) {
          const weight = Math.min(p.attempts, 10);
          totalScore += (p.score || 0) * weight;
          totalWeight += weight;
        }
      });

      const userLevel = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
      const overallScore = userLevel; // Pour simplifier, on utilise le même calcul

      // Mettre à jour l'enfant
      await supabaseAdmin
        .from('children')
        .update({
          user_level: userLevel,
          overall_score: overallScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', childId);
    } catch (error) {
      console.error('Erreur lors du recalcul du niveau:', error);
    }
  }

  /**
   * Obtenir les recommandations de modules
   */
  async getRecommendations(childId: string): Promise<string[]> {
    if (!supabaseAdmin) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data: child } = await supabaseAdmin
        .from('children')
        .select('user_level')
        .eq('id', childId)
        .single();

      const userLevel = child?.user_level || 0;

      const { data: progress } = await supabaseAdmin
        .from('module_progress')
        .select('module_type, completed, score')
        .eq('child_id', childId);

      // Modules recommandés selon le niveau
      const recommendations: Record<number, string[]> = {
        0: ['alphabet', 'chiffres'],
        20: ['syllabes', 'vocabulaire'],
        40: ['lecture', 'calcul'],
        60: ['ecriture', 'famille'],
        80: ['calcul', 'lecture'],
      };

      let category = 0;
      for (const level in recommendations) {
        if (userLevel >= parseInt(level)) {
          category = parseInt(level);
        }
      }

      const suggestedModules = recommendations[category] || ['alphabet'];

      // Trouver un module non complété ou à améliorer
      for (const moduleType of suggestedModules) {
        const moduleProgress = progress?.find((p) => p.module_type === moduleType);
        if (!moduleProgress || !moduleProgress.completed || (moduleProgress.score || 0) < 80) {
          return [moduleType];
        }
      }

      return suggestedModules.slice(0, 1);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      return ['alphabet'];
    }
  }
}

export const progressService = new ProgressService();
