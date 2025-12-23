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
      await this.playAudioFile('success.wav');
    } catch (error) {
      console.warn('Son de succès non disponible:', error);
    }
  }

  /**
   * Joue un son d'erreur (mauvaise réponse) - ton descendant doux
   */
  async playError() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      await this.playAudioFile('error.wav');
    } catch (error) {
      console.warn('Son d\'erreur non disponible:', error);
    }
  }

  /**
   * Joue un son de badge débloqué - séquence montante joyeuse
   */
  async playBadge() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      await this.playAudioFile('badge.wav');
    } catch (error) {
      console.warn('Son de badge non disponible:', error);
    }
  }

  /**
   * Joue un son de célébration - fanfare joyeuse
   */
  async playCelebration() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      await this.playAudioFile('celebration.wav');
    } catch (error) {
      console.warn('Son de célébration non disponible:', error);
    }
  }

  /**
   * Joue un son de clic discret
   */
  async playClick() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      await this.playAudioFile('click.wav');
    } catch (error) {
      console.warn('Son de clic non disponible:', error);
    }
  }

  /**
   * Joue un son d'encouragement - ton positif
   */
  async playEncouragement() {
    if (!this.isEnabled) return;
    await this.initialize();
    
    try {
      await this.playAudioFile('encouragement.wav');
    } catch (error) {
      console.warn('Son d\'encouragement non disponible:', error);
    }
  }


  /**
   * Charge et joue un fichier audio
   * Note: Les fichiers doivent être ajoutés dans apps/mobile/assets/sounds/
   * et importés ici avec require() statique
   */
  private async playAudioFile(filename: string) {
    try {
      // Mapping statique des fichiers audio
      // Décommenter et ajouter les require() une fois les fichiers ajoutés
      let soundFile: any = null;
      
      // Charger les fichiers audio générés (format WAV)
      switch (filename) {
        case 'success.mp3':
        case 'success.wav':
          soundFile = require('../../assets/sounds/success.wav');
          break;
        case 'error.mp3':
        case 'error.wav':
          soundFile = require('../../assets/sounds/error.wav');
          break;
        case 'badge.mp3':
        case 'badge.wav':
          soundFile = require('../../assets/sounds/badge.wav');
          break;
        case 'celebration.mp3':
        case 'celebration.wav':
          soundFile = require('../../assets/sounds/celebration.wav');
          break;
        case 'click.mp3':
        case 'click.wav':
          soundFile = require('../../assets/sounds/click.wav');
          break;
        case 'encouragement.mp3':
        case 'encouragement.wav':
          soundFile = require('../../assets/sounds/encouragement.wav');
          break;
      }
      
      if (soundFile) {
        const { sound } = await Audio.Sound.createAsync(
          soundFile,
          { shouldPlay: true, volume: this.volume }
        );
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
          }
        });
      } else {
        // Fichiers non encore ajoutés - on continue silencieusement
        console.log(`Fichier audio ${filename} non configuré - Voir SOUNDS_RECOMMENDATIONS.md`);
      }
    } catch (error) {
      // Fichier non trouvé ou erreur de chargement - on continue silencieusement
      console.warn(`Erreur lors du chargement de ${filename}:`, error);
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
