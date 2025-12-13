/**
 * Types partagés pour MiniGénie
 */

// Niveaux pédagogiques
export type EducationLevel = 
  | 'maternelle_ps' // Petite Section (3 ans)
  | 'maternelle_ms' // Moyenne Section (4 ans)
  | 'maternelle_gs' // Grande Section (5 ans)
  | 'primaire_cp1'  // CP1 (6 ans)
  | 'primaire_cp2'; // CP2 (7-8 ans)

// Profil enfant
export interface ChildProfile {
  id: string;
  pseudo: string;
  age: number;
  level: EducationLevel;
  userLevel: number; // Niveau détecté automatiquement (0-100)
  createdAt: Date;
  updatedAt: Date;
}

// Modules pédagogiques
export type ModuleType = 
  | 'alphabet'
  | 'syllabes'
  | 'lecture'
  | 'ecriture'
  | 'chiffres'
  | 'calcul'
  | 'vocabulaire'
  | 'famille';

export interface Module {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
}

// Progression
export interface Progress {
  childId: string;
  moduleId: string;
  score: number;
  completed: boolean;
  attempts: number;
  lastAttempt: Date;
  bestScore: number;
}

// Récompenses
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// Session
export interface Session {
  id: string;
  childId: string;
  moduleId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // en secondes
}

// Configuration offline
export interface OfflineConfig {
  enabled: boolean;
  lastSync?: Date;
  pendingSync: boolean;
}

