/**
 * Module TTS (Text To Speech) - Utilitaires pour la synthèse vocale
 */
import * as Speech from 'expo-speech';

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

const DEFAULT_OPTIONS: TTSOptions = {
  language: 'fr-FR',
  pitch: 1.2, // Voix plus aiguë, enfantine
  rate: 0.9, // Légèrement plus lent pour les enfants
  volume: 1.0,
};

/**
 * Parle un texte avec la voix d'Assena
 */
export async function speakAsAssena(
  text: string,
  options: TTSOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    
    Speech.speak(text, {
      language: finalOptions.language,
      pitch: finalOptions.pitch,
      rate: finalOptions.rate,
      volume: finalOptions.volume,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: (error) => reject(error),
    });
  });
}

/**
 * Arrête la synthèse vocale en cours
 */
export function stopSpeaking(): void {
  Speech.stop();
}

/**
 * Vérifie si la synthèse vocale est en cours
 */
export function isSpeaking(): boolean {
  // Note: expo-speech n'a pas de méthode native pour vérifier l'état
  // On peut utiliser un flag externe si nécessaire
  return false;
}

