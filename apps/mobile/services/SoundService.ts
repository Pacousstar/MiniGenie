import { Audio } from 'expo-av';

export type SoundType = 'success' | 'error' | 'badge' | 'celebration' | 'click' | 'encouragement';

/**
 * Service de gestion des sons de récompense et feedback
 * Utilise des sons système simples pour un feedback audio immédiat
 */
class SoundService {
  private isEnabled: boolean = true;
  private volume: number = 0.7;
  private initialized: boolean = false;

  /**
   * Initialise le service audio
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation audio:', error);
    }
  }

  /**
   * Joue un son de succès (bonne réponse) - deux tons montants
   */
  async playSuccess() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son de succès : séquence de deux tons montants (Do-Mi)
      await this.playToneSequence([523.25, 659.25], [150, 200]);
    } catch (error) {
      console.warn('Impossible de jouer le son de succès:', error);
    }
  }

  /**
   * Joue un son d'erreur (mauvaise réponse) - ton descendant doux
   */
  async playError() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son d'erreur : ton descendant doux (Mi-Do)
      await this.playToneSequence([659.25, 523.25], [200]);
    } catch (error) {
      console.warn('Impossible de jouer le son d\'erreur:', error);
    }
  }

  /**
   * Joue un son de badge débloqué - séquence montante joyeuse
   */
  async playBadge() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son de badge : séquence montante joyeuse (Do-Mi-Sol-Do aigu)
      await this.playToneSequence([523.25, 659.25, 783.99, 1046.50], [100, 100, 100, 200]);
    } catch (error) {
      console.warn('Impossible de jouer le son de badge:', error);
    }
  }

  /**
   * Joue un son de célébration - fanfare joyeuse
   */
  async playCelebration() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son de célébration : fanfare (Do-Mi-Sol-Do-Mi-Sol)
      await this.playToneSequence(
        [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
        [80, 80, 80, 80, 80, 300]
      );
    } catch (error) {
      console.warn('Impossible de jouer le son de célébration:', error);
    }
  }

  /**
   * Joue un son de clic discret
   */
  async playClick() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son de clic : ton très court et discret
      await this.playToneSequence([800], [50]);
    } catch (error) {
      console.warn('Impossible de jouer le son de clic:', error);
    }
  }

  /**
   * Joue un son d'encouragement - ton positif
   */
  async playEncouragement() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      // Son d'encouragement : séquence positive (Do-Mi-Sol)
      await this.playToneSequence([523.25, 659.25, 783.99], [150, 150, 250]);
    } catch (error) {
      console.warn('Impossible de jouer le son d\'encouragement:', error);
    }
  }

  /**
   * Joue une séquence de tons
   */
  private async playToneSequence(frequencies: number[], durations: number[]) {
    for (let i = 0; i < frequencies.length; i++) {
      const frequency = frequencies[i];
      const duration = durations[i] || durations[0] || 200;
      
      if (i > 0) {
        // Petit délai entre les tons
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      await this.playTone(frequency, duration);
    }
  }

  /**
   * Crée et joue un ton avec une fréquence spécifique
   * Version simplifiée pour compatibilité maximale
   */
  private async playTone(frequency: number, duration: number = 200) {
    try {
      // Pour l'instant, on utilise une approche simple
      // Dans une version future, on pourra ajouter de vrais fichiers audio
      // Pour l'instant, on génère un son simple avec expo-av
      
      // Note: La génération de sons WAV en runtime peut être complexe
      // Pour une solution de production, il serait préférable d'utiliser
      // des fichiers audio pré-enregistrés dans assets/sounds/
      
      // Version simplifiée : on log pour l'instant
      // Les sons seront joués via des fichiers audio dans une version future
      console.log(`Playing tone: ${frequency}Hz for ${duration}ms`);
      
      // TODO: Ajouter des fichiers audio dans assets/sounds/ et les charger ici
      // Exemple:
      // const soundFile = require('../../assets/sounds/success.mp3');
      // const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true });
    } catch (error) {
      // Si la génération échoue, on continue silencieusement
      console.warn('Impossible de générer le ton audio:', error);
    }
  }

  /**
   * Active ou désactive les sons
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Définit le volume (0.0 à 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Vérifie si les sons sont activés
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Joue un son selon le type
   */
  async play(type: SoundType) {
    switch (type) {
      case 'success':
        await this.playSuccess();
        break;
      case 'error':
        await this.playError();
        break;
      case 'badge':
        await this.playBadge();
        break;
      case 'celebration':
        await this.playCelebration();
        break;
      case 'click':
        await this.playClick();
        break;
      case 'encouragement':
        await this.playEncouragement();
        break;
    }
  }
}

// Instance singleton
export const soundService = new SoundService();
