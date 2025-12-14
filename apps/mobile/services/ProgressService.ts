/**
 * Service de gestion de la progression automatique (user_level)
 */
import { getChildProfile, saveChildProfile } from '@minigenie/shared/src/utils/storage';
import type { EducationLevel } from '@minigenie/shared';

export interface ModuleProgress {
  moduleId: string;
  moduleType: string;
  score: number; // 0-100
  attempts: number;
  bestScore: number;
  lastAttempt: Date;
  completed: boolean;
}

export interface ChildProgress {
  childId: string;
  userLevel: number; // 0-100 (niveau détecté automatiquement)
  overallScore: number; // 0-100
  modulesProgress: Record<string, ModuleProgress>;
  lastUpdated: Date;
}

class ProgressService {
  /**
   * Calculer le user_level basé sur les performances
   */
  async calculateUserLevel(childId: string): Promise<number> {
    try {
      const profile = await getChildProfile();
      if (!profile || !profile.modulesProgress) {
        return 0;
      }

      const modulesProgress = profile.modulesProgress as Record<string, ModuleProgress>;
      const moduleTypes = Object.keys(modulesProgress);
      
      if (moduleTypes.length === 0) {
        return 0;
      }

      // Calculer la moyenne des scores par module
      let totalScore = 0;
      let totalWeight = 0;

      moduleTypes.forEach((moduleType) => {
        const progress = modulesProgress[moduleType];
        if (progress.attempts > 0) {
          // Ponderer par le nombre de tentatives (plus de tentatives = plus fiable)
          const weight = Math.min(progress.attempts, 10); // Max 10 tentatives
          totalScore += progress.score * weight;
          totalWeight += weight;
        }
      });

      if (totalWeight === 0) {
        return 0;
      }

      const averageScore = totalScore / totalWeight;
      
      // Ajuster selon l'âge/niveau scolaire
      const ageBonus = this.getAgeBonus(profile.age);
      
      // user_level final (0-100)
      const userLevel = Math.min(100, Math.max(0, averageScore + ageBonus));
      
      return Math.round(userLevel);
    } catch (error) {
      console.error('Erreur lors du calcul du user_level:', error);
      return 0;
    }
  }

  /**
   * Bonus selon l'âge (ajustement pédagogique)
   */
  private getAgeBonus(age: number): number {
    // Les enfants plus âgés ont un bonus de base
    if (age >= 7) return 5;
    if (age >= 6) return 3;
    if (age >= 5) return 1;
    return 0;
  }

  /**
   * Mettre à jour la progression d'un module
   */
  async updateModuleProgress(
    childId: string,
    moduleType: string,
    score: number,
    completed: boolean = false
  ): Promise<void> {
    try {
      const profile = await getChildProfile();
      if (!profile) return;

      if (!profile.modulesProgress) {
        profile.modulesProgress = {};
      }

      const moduleId = `${moduleType}_${childId}`;
      const existing = profile.modulesProgress[moduleId];

      const progress: ModuleProgress = {
        moduleId,
        moduleType,
        score,
        attempts: (existing?.attempts || 0) + 1,
        bestScore: Math.max(existing?.bestScore || 0, score),
        lastAttempt: new Date(),
        completed: completed || (existing?.completed || false),
      };

      profile.modulesProgress[moduleId] = progress;

      // Recalculer le user_level
      profile.userLevel = await this.calculateUserLevel(childId);

      // Calculer le score global
      profile.overallScore = await this.calculateOverallScore(childId);

      await saveChildProfile(profile);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    }
  }

  /**
   * Calculer le score global
   */
  async calculateOverallScore(childId: string): Promise<number> {
    try {
      const profile = await getChildProfile();
      if (!profile || !profile.modulesProgress) {
        return 0;
      }

      const modulesProgress = profile.modulesProgress as Record<string, ModuleProgress>;
      const moduleTypes = Object.keys(modulesProgress);
      
      if (moduleTypes.length === 0) {
        return 0;
      }

      // Moyenne pondérée des scores
      let totalScore = 0;
      let totalWeight = 0;

      moduleTypes.forEach((moduleId) => {
        const progress = modulesProgress[moduleId];
        if (progress.attempts > 0) {
          const weight = progress.completed ? 2 : 1; // Modules complétés comptent double
          totalScore += progress.score * weight;
          totalWeight += weight;
        }
      });

      if (totalWeight === 0) {
        return 0;
      }

      return Math.round(totalScore / totalWeight);
    } catch (error) {
      console.error('Erreur lors du calcul du score global:', error);
      return 0;
    }
  }

  /**
   * Obtenir la progression d'un module
   */
  async getModuleProgress(childId: string, moduleType: string): Promise<ModuleProgress | null> {
    try {
      const profile = await getChildProfile();
      if (!profile || !profile.modulesProgress) {
        return null;
      }

      const moduleId = `${moduleType}_${childId}`;
      return profile.modulesProgress[moduleId] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      return null;
    }
  }

  /**
   * Obtenir toutes les progressions
   */
  async getAllProgress(childId: string): Promise<Record<string, ModuleProgress>> {
    try {
      const profile = await getChildProfile();
      if (!profile || !profile.modulesProgress) {
        return {};
      }

      return profile.modulesProgress as Record<string, ModuleProgress>;
    } catch (error) {
      console.error('Erreur lors de la récupération des progressions:', error);
      return {};
    }
  }

  /**
   * Recommander un module selon le niveau
   */
  async recommendModule(childId: string): Promise<string | null> {
    try {
      const profile = await getChildProfile();
      if (!profile) return 'alphabet'; // Par défaut

      const userLevel = profile.userLevel || 0;
      const allProgress = await this.getAllProgress(childId);

      // Modules recommandés selon le niveau
      const recommendations: Record<number, string[]> = {
        0: ['alphabet', 'chiffres'],
        20: ['syllabes', 'vocabulaire'],
        40: ['lecture', 'calcul'],
        60: ['ecriture', 'famille'],
        80: ['calcul', 'lecture'],
      };

      // Trouver la catégorie de niveau
      let category = 0;
      for (const level in recommendations) {
        if (userLevel >= parseInt(level)) {
          category = parseInt(level);
        }
      }

      const suggestedModules = recommendations[category] || ['alphabet'];
      
      // Trouver un module non complété ou à améliorer
      for (const moduleType of suggestedModules) {
        const progress = allProgress[`${moduleType}_${childId}`];
        if (!progress || !progress.completed || progress.score < 80) {
          return moduleType;
        }
      }

      // Si tous les modules suggérés sont complétés, retourner le premier
      return suggestedModules[0];
    } catch (error) {
      console.error('Erreur lors de la recommandation:', error);
      return 'alphabet';
    }
  }

  /**
   * Obtenir le niveau scolaire suggéré selon user_level
   */
  getSuggestedLevel(userLevel: number, age: number): EducationLevel {
    if (age <= 3) return 'maternelle_ps';
    if (age <= 4) return 'maternelle_ms';
    if (age <= 5) return 'maternelle_gs';
    
    // Pour 6-8 ans, ajuster selon user_level
    if (age === 6) {
      return userLevel >= 50 ? 'primaire_cp2' : 'primaire_cp1';
    }
    if (age >= 7) {
      return userLevel >= 30 ? 'primaire_cp2' : 'primaire_cp1';
    }
    
    return 'primaire_cp1';
  }
}

// Instance singleton
export const progressService = new ProgressService();

