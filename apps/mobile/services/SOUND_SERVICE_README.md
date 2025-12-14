# Service Audio - Sons de Récompense

## 📋 Vue d'ensemble

Le `SoundService` gère tous les sons de récompense et de feedback dans l'application MiniGénie.

## 🎵 Types de sons disponibles

- **success** : Son de succès (bonne réponse) - deux tons montants
- **error** : Son d'erreur (mauvaise réponse) - ton descendant doux
- **badge** : Son de badge débloqué - séquence montante joyeuse
- **celebration** : Son de célébration - fanfare joyeuse
- **click** : Son de clic discret
- **encouragement** : Son d'encouragement - ton positif

## 🔧 Utilisation

```typescript
import { soundService } from '../services/SoundService';

// Jouer un son de succès
await soundService.playSuccess();

// Ou utiliser la méthode générique
await soundService.play('success');

// Désactiver/activer les sons
soundService.setEnabled(false);
soundService.setEnabled(true);

// Ajuster le volume (0.0 à 1.0)
soundService.setVolume(0.5);
```

## 📁 Intégration actuelle

Les sons sont intégrés dans :
- ✅ `CalculModule` : success, error, badge
- ✅ `AlphabetModule` : badge, celebration
- ✅ `EcritureModule` : encouragement, error
- ✅ `BadgeCelebration` : celebration, badge

## 🚀 Extension avec fichiers audio

Pour ajouter de vrais fichiers audio :

1. **Créer le dossier assets/sounds/**
```
apps/mobile/
  assets/
    sounds/
      success.mp3
      error.mp3
      badge.mp3
      celebration.mp3
      click.mp3
      encouragement.mp3
```

2. **Modifier SoundService.ts** pour charger les fichiers :

```typescript
private async playTone(frequency: number, duration: number = 200) {
  try {
    // Charger le fichier audio correspondant
    const soundFile = require('../../assets/sounds/success.mp3');
    const { sound } = await Audio.Sound.createAsync(
      soundFile,
      { shouldPlay: true, volume: this.volume }
    );
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch (error) {
    console.warn('Impossible de jouer le son:', error);
  }
}
```

3. **Recommandations pour les fichiers audio** :
   - Format : MP3 ou WAV
   - Durée : 200-500ms pour les sons courts, jusqu'à 2s pour les célébrations
   - Volume : Normalisé à -3dB pour éviter les distorsions
   - Fréquence d'échantillonnage : 44.1kHz recommandé

## 🎨 Sons recommandés

- **Success** : Son court et positif (ex: "ding-ding" montant)
- **Error** : Son doux et encourageant, pas punitif
- **Badge** : Séquence joyeuse montante (ex: "do-mi-sol-do")
- **Celebration** : Fanfare courte et joyeuse
- **Click** : Son très discret (ex: "tick")
- **Encouragement** : Ton positif et chaleureux

## ⚙️ Configuration

Le service s'initialise automatiquement au démarrage de l'application.

Pour personnaliser :
- Volume par défaut : 0.7 (70%)
- Sons activés par défaut : Oui
- Mode silencieux iOS : Activé (playsInSilentModeIOS: true)

## 📝 Notes

- Le service actuel utilise une génération de sons simplifiée
- Pour une production, il est recommandé d'utiliser de vrais fichiers audio
- Les sons doivent être adaptés pour les enfants (pas trop forts, pas punitifs)
- Tous les sons doivent fonctionner en mode offline
