/**
 * Utilitaires de stockage local (offline-first)
 */

// Clés de stockage
export const STORAGE_KEYS = {
  CHILD_PROFILE: '@minigenie:child_profile',
  PROGRESS: '@minigenie:progress',
  SETTINGS: '@minigenie:settings',
  OFFLINE_QUEUE: '@minigenie:offline_queue',
} as const;

/**
 * Sauvegarde d'un profil enfant
 */
export async function saveChildProfile(profile: any): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Web
    window.localStorage.setItem(STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(profile));
  } else {
    // Mobile - AsyncStorage sera importé dynamiquement
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem(STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(profile));
  }
}

/**
 * Récupération du profil enfant
 */
export async function getChildProfile(): Promise<any | null> {
  try {
    let data: string | null = null;
    
    if (typeof window !== 'undefined' && window.localStorage) {
      // Web
      data = window.localStorage.getItem(STORAGE_KEYS.CHILD_PROFILE);
    } else {
      // Mobile
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      data = await AsyncStorage.getItem(STORAGE_KEYS.CHILD_PROFILE);
    }
    
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
}

/**
 * Sauvegarde de la progression
 */
export async function saveProgress(progress: any): Promise<void> {
  try {
    const existing = await getProgress();
    const updated = { ...existing, ...progress };
    
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
  }
}

/**
 * Récupération de la progression
 */
export async function getProgress(): Promise<any> {
  try {
    let data: string | null = null;
    
    if (typeof window !== 'undefined' && window.localStorage) {
      data = window.localStorage.getItem(STORAGE_KEYS.PROGRESS);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
    }
    
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    return {};
  }
}

