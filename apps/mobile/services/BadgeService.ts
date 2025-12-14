/**
 * Service de gestion des badges et récompenses
 */
import { getChildProfile, saveChildProfile } from '@minigenie/shared/src/utils/storage';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'alphabet' | 'chiffres' | 'calcul' | 'vocabulaire' | 'general';
  unlockedAt?: Date;
  progress: number; // 0-100
  required: number; // Score requis pour débloquer
}

const BADGES: Badge[] = [
  {
    id: 'alphabet_master',
    name: 'Maître de l\'Alphabet',
    description: 'A terminé l\'alphabet complet',
    icon: '🔤',
    category: 'alphabet',
    progress: 0,
    required: 26,
  },
  {
    id: 'chiffres_expert',
    name: 'Expert en Chiffres',
    description: 'A compté jusqu\'à 20',
    icon: '🔢',
    category: 'chiffres',
    progress: 0,
    required: 20,
  },
  {
    id: 'calcul_champion',
    name: 'Champion du Calcul',
    description: 'A répondu correctement à 10 calculs',
    icon: '➕',
    category: 'calcul',
    progress: 0,
    required: 10,
  },
  {
    id: 'vocabulaire_star',
    name: 'Étoile du Vocabulaire',
    description: 'A appris 15 mots',
    icon: '⭐',
    category: 'vocabulaire',
    progress: 0,
    required: 15,
  },
  {
    id: 'first_steps',
    name: 'Premiers Pas',
    description: 'A complété son premier module',
    icon: '👣',
    category: 'general',
    progress: 0,
    required: 1,
  },
  {
    id: 'perseverance',
    name: 'Persévérance',
    description: 'A utilisé l\'app pendant 7 jours',
    icon: '💪',
    category: 'general',
    progress: 0,
    required: 7,
  },
];

class BadgeService {
  private badges: Badge[] = [...BADGES];

  /**
   * Récupérer tous les badges
   */
  getAllBadges(): Badge[] {
    return this.badges;
  }

  /**
   * Récupérer les badges débloqués
   */
  getUnlockedBadges(): Badge[] {
    return this.badges.filter((badge) => badge.unlockedAt !== undefined);
  }

  /**
   * Récupérer les badges par catégorie
   */
  getBadgesByCategory(category: Badge['category']): Badge[] {
    return this.badges.filter((badge) => badge.category === category);
  }

  /**
   * Mettre à jour la progression d'un badge
   */
  updateBadgeProgress(badgeId: string, progress: number): void {
    const badge = this.badges.find((b) => b.id === badgeId);
    if (badge) {
      badge.progress = Math.min(progress, badge.required);
      
      // Débloquer le badge si la progression atteint le requis
      if (badge.progress >= badge.required && !badge.unlockedAt) {
        badge.unlockedAt = new Date();
        this.saveBadges();
      }
    }
  }

  /**
   * Vérifier et débloquer les badges selon la progression
   */
  checkAndUnlockBadges(moduleType: string, score: number): Badge[] {
    const newlyUnlocked: Badge[] = [];
    
    // Mettre à jour les badges selon le module
    switch (moduleType) {
      case 'alphabet':
        this.updateBadgeProgress('alphabet_master', score);
        break;
      case 'chiffres':
        this.updateBadgeProgress('chiffres_expert', score);
        break;
      case 'calcul':
        this.updateBadgeProgress('calcul_champion', score);
        break;
      case 'vocabulaire':
        this.updateBadgeProgress('vocabulaire_star', score);
        break;
    }

    // Vérifier le badge "Premiers Pas"
    const firstStepsBadge = this.badges.find((b) => b.id === 'first_steps');
    if (firstStepsBadge && !firstStepsBadge.unlockedAt && score > 0) {
      firstStepsBadge.progress = 1;
      firstStepsBadge.unlockedAt = new Date();
      newlyUnlocked.push(firstStepsBadge);
    }

    // Vérifier les autres badges généraux
    this.badges.forEach((badge) => {
      if (badge.progress >= badge.required && !badge.unlockedAt) {
        badge.unlockedAt = new Date();
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveBadges();
    }

    return newlyUnlocked;
  }

  /**
   * Sauvegarder les badges
   */
  private async saveBadges(): Promise<void> {
    try {
      const profile = await getChildProfile();
      if (profile) {
        profile.badges = this.badges;
        await saveChildProfile(profile);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des badges:', error);
    }
  }

  /**
   * Charger les badges depuis le profil
   */
  async loadBadges(): Promise<void> {
    try {
      const profile = await getChildProfile();
      if (profile && profile.badges) {
        this.badges = profile.badges;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des badges:', error);
    }
  }

  /**
   * Obtenir le pourcentage de progression global
   */
  getOverallProgress(): number {
    const totalProgress = this.badges.reduce((sum, badge) => sum + badge.progress, 0);
    const totalRequired = this.badges.reduce((sum, badge) => sum + badge.required, 0);
    return totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
  }
}

// Instance singleton
export const badgeService = new BadgeService();

