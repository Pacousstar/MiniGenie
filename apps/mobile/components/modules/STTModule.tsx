/**
 * Module STT (Speech To Text) - Reconnaissance vocale
 * Note: Pour l'instant, on utilise une approche simplifiée
 * Une vraie implémentation STT nécessiterait expo-speech ou une API externe
 */

export interface STTOptions {
  language?: string;
  timeout?: number;
}

/**
 * Démarrer l'écoute vocale
 * TODO: Implémenter avec expo-speech ou API STT externe
 */
export async function startListening(
  options: STTOptions = {}
): Promise<string> {
  // Pour l'instant, retourne une promesse qui sera résolue manuellement
  // Dans une vraie implémentation, on utiliserait:
  // - expo-speech (limité)
  // - API Google Speech-to-Text
  // - API Azure Speech
  // - API Deepgram
  
  return new Promise((resolve, reject) => {
    // Placeholder - à implémenter avec une vraie API STT
    setTimeout(() => {
      reject(new Error('STT non implémenté pour le moment'));
    }, 1000);
  });
}

/**
 * Arrêter l'écoute vocale
 */
export function stopListening(): void {
  // À implémenter
}

/**
 * Vérifier si l'écoute est active
 */
export function isListening(): boolean {
  return false;
}

