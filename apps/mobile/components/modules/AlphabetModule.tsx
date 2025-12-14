import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { COLORS, ASSENA_MESSAGES } from '@minigenie/shared';
import { speakAsAssena, stopSpeaking } from './TTSModule';
import { badgeService } from '../../services/BadgeService';
import { sessionService } from '../../services/SessionService';
import { progressService } from '../../services/ProgressService';
import BadgeCelebration from '../BadgeCelebration';
import PauseModal from '../PauseModal';
import { getChildProfile } from '@minigenie/shared/src/utils/storage';

interface AlphabetModuleProps {
  onComplete?: () => void;
}

/**
 * Module Alphabet - Apprendre les lettres A-Z
 */
export default function AlphabetModule({ onComplete }: AlphabetModuleProps) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [newBadge, setNewBadge] = useState<any>(null);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);
  const [childId, setChildId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const currentChar = alphabet[currentLetter];

  useEffect(() => {
    // Initialiser la session
    const initSession = async () => {
      try {
        const profile = await getChildProfile();
        if (profile) {
          setChildId(profile.id);
          const session = await sessionService.startSession(
            profile.id,
            'alphabet',
            'alphabet'
          );
          setSessionId(session.id);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la session:', error);
      }
    };
    
    initSession();
    
    // Prononcer la lettre au chargement
    speakLetter(currentChar);
    
    // Nettoyer la session à la fin
    return () => {
      if (childId) {
        sessionService.endSession().catch(console.error);
      }
    };
  }, []);
  
  useEffect(() => {
    // Prononcer la lettre au chargement
    speakLetter(currentChar);
  }, [currentLetter]);
  
  // Vérifier les pauses dans un effet séparé
  useEffect(() => {
    const checkPause = setInterval(() => {
      if (sessionService.shouldTakeBreak() && !showPauseModal) {
        setShowPauseModal(true);
      }
    }, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(checkPause);
  }, [showPauseModal]);

  const speakLetter = async (letter: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const exampleWord = getExampleWord(letter);
    const message = `Voici la lettre ${letter}. ${letter} comme ${exampleWord}.`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = async () => {
    if (currentLetter < alphabet.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentLetter(currentLetter + 1);
    } else {
      // Module terminé
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch(console.error);
      
      // Calculer le score (100% si toutes les lettres vues)
      const score = 100;
      
      // Mettre à jour la progression
      if (childId) {
        await progressService.updateModuleProgress(childId, 'alphabet', score, true);
        await sessionService.endSession(score, true);
      }
      
      // Vérifier les badges
      const unlockedBadges = badgeService.checkAndUnlockBadges('alphabet', alphabet.length);
      if (unlockedBadges.length > 0) {
        setNewBadge(unlockedBadges[0]);
        setShowBadgeCelebration(true);
      }
      
      if (onComplete) {
        setTimeout(() => onComplete(), 3000);
      }
    }
  };

  const handlePrevious = () => {
    if (currentLetter > 0) {
      setCurrentLetter(currentLetter - 1);
    }
  };

  const handleRepeat = () => {
    speakLetter(currentChar);
  };

  // Exemples de mots pour chaque lettre
  const getExampleWord = (letter: string): string => {
    const examples: Record<string, string> = {
      A: 'Arbre',
      B: 'Bateau',
      C: 'Chat',
      D: 'Doudou',
      E: 'École',
      F: 'Fleur',
      G: 'Girafe',
      H: 'Hippopotame',
      I: 'Ile',
      J: 'Jouet',
      K: 'Kangourou',
      L: 'Lion',
      M: 'Maman',
      N: 'Nuit',
      O: 'Orange',
      P: 'Papa',
      Q: 'Quatre',
      R: 'Roi',
      S: 'Soleil',
      T: 'Tigre',
      U: 'Univers',
      V: 'Voiture',
      W: 'Wagon',
      X: 'Xylophone',
      Y: 'Yoyo',
      Z: 'Zèbre',
    };
    return examples[letter] || letter;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Alphabet</Text>
          <Text style={styles.subtitle}>
            Lettre {currentLetter + 1} sur {alphabet.length}
          </Text>
        </View>

        {/* Lettre principale */}
        <Animated.View style={[styles.letterContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.letterCard}
            onPress={handleRepeat}
            activeOpacity={0.8}
          >
            <Text style={styles.letter}>{currentChar}</Text>
            <Text style={styles.letterLowercase}>{currentChar.toLowerCase()}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Exemple de mot */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>
            {currentChar} comme {getExampleWord(currentChar)}
          </Text>
        </View>

        {/* Boutons de contrôle */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentLetter === 0 && styles.controlButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentLetter === 0}
          >
            <Text style={styles.controlButtonText}>← Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.repeatButton}
            onPress={handleRepeat}
            disabled={isPlaying}
          >
            <Text style={styles.repeatButtonText}>
              {isPlaying ? '🔊' : '🔁'} Répéter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, currentLetter === alphabet.length - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentLetter === alphabet.length - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentLetter === alphabet.length - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentLetter + 1) / alphabet.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentLetter + 1} / {alphabet.length}
          </Text>
        </View>
      </ScrollView>
      
      {/* Célébration de badge */}
      {newBadge && (
        <BadgeCelebration
          badge={newBadge}
          visible={showBadgeCelebration}
          onClose={() => {
            setShowBadgeCelebration(false);
            setNewBadge(null);
          }}
        />
      )}
      
      {/* Modal de pause */}
      <PauseModal
        visible={showPauseModal}
        sessionDuration={sessionService.getCurrentSessionDuration()}
        onContinue={() => setShowPauseModal(false)}
        onTakeBreak={() => {
          setShowPauseModal(false);
          if (onComplete) {
            onComplete();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.medium,
  },
  letterContainer: {
    marginBottom: 40,
  },
  letterCard: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.primary.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 4,
    borderColor: COLORS.primary.orange,
  },
  letter: {
    fontSize: 100,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
  },
  letterLowercase: {
    fontSize: 60,
    fontWeight: 'bold',
    color: COLORS.primary.green,
    marginTop: 10,
  },
  exampleContainer: {
    backgroundColor: COLORS.primary.green + '20',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: COLORS.primary.green,
  },
  exampleLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.dark,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: COLORS.primary.orange,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: COLORS.text.light,
    opacity: 0.5,
  },
  controlButtonText: {
    color: COLORS.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  repeatButton: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  repeatButtonText: {
    color: COLORS.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.background.light,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary.green,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    color: COLORS.text.medium,
    fontWeight: '600',
  },
});

