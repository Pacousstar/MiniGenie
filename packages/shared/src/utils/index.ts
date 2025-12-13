/**
 * Utilitaires partagés
 */

/**
 * Détermine le niveau éducatif à partir de l'âge
 */
export function getEducationLevelFromAge(age: number): string {
  if (age >= 3 && age < 4) return 'maternelle_ps';
  if (age >= 4 && age < 5) return 'maternelle_ms';
  if (age >= 5 && age < 6) return 'maternelle_gs';
  if (age >= 6 && age < 7) return 'primaire_cp1';
  if (age >= 7 && age <= 8) return 'primaire_cp2';
  return 'maternelle_ps'; // Par défaut
}

/**
 * Formate la durée en minutes:secondes
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Vérifie si une valeur est en ligne
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

