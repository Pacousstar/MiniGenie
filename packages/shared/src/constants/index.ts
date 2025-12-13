/**
 * Constantes partagées pour MiniGénie
 */

// Couleurs principales
export const COLORS = {
  primary: {
    orange: '#FF6B35',
    green: '#4ECDC4',
    white: '#FFFFFF',
    blue: '#1E88E5',
    red: '#E53935',
  },
  background: {
    light: '#F5F5F5',
    white: '#FFFFFF',
    orange: '#FFF3E0',
  },
  text: {
    dark: '#212121',
    medium: '#616161',
    light: '#9E9E9E',
  },
} as const;

// Configuration Assena
export const ASSENA_CONFIG = {
  name: 'Assena',
  personality: {
    tone: 'bienveillant',
    patience: 'illimitée',
    encouragement: 'constant',
  },
} as const;

// Modules disponibles
export const MODULES: Record<string, { title: string; icon: string }> = {
  alphabet: { title: 'Alphabet', icon: '🔤' },
  syllabes: { title: 'Syllabes', icon: '🔠' },
  lecture: { title: 'Lecture', icon: '📖' },
  ecriture: { title: 'Écriture', icon: '✍️' },
  chiffres: { title: 'Chiffres', icon: '🔢' },
  calcul: { title: 'Calcul', icon: '➕' },
  vocabulaire: { title: 'Vocabulaire', icon: '📚' },
  famille: { title: 'Famille', icon: '👨‍👩‍👧‍👦' },
} as const;

// Messages Assena
export const ASSENA_MESSAGES = {
  welcome: "Bonjour ! Je suis Assena, ton amie pour apprendre !",
  encouragement: [
    "Bravo ! Tu es formidable !",
    "C'est super ! Continue comme ça !",
    "Tu progresses à chaque fois !",
    "Excellent travail !",
    "Je suis fière de toi !",
  ],
  correction: [
    "Presque ! Essaie encore, tu y es presque !",
    "C'est une bonne idée, mais essayons autrement.",
    "Pas tout à fait, mais tu es sur la bonne voie !",
  ],
  pause: [
    "Tu as bien travaillé ! On fait une petite pause ?",
    "Bravo pour ta concentration ! Reposons-nous un peu.",
  ],
} as const;

