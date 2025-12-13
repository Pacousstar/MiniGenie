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
import * as Speech from 'expo-speech';

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

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const currentChar = alphabet[currentLetter];

  useEffect(() => {
    // Prononcer la lettre au chargement
    speakLetter(currentChar);
  }, [currentLetter]);

  const speakLetter = (letter: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `Voici la lettre ${letter}. ${letter} comme...`;
    
    Speech.speak(message, {
      language: 'fr-FR',
      pitch: 1.2,
      rate: 0.9,
      onDone: () => {
        setIsPlaying(false);
      },
      onStopped: () => {
        setIsPlaying(false);
      },
      onError: () => {
        setIsPlaying(false);
      },
    });
  };

  const handleNext = () => {
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
      Speech.speak(ASSENA_MESSAGES.encouragement[0], {
        language: 'fr-FR',
        pitch: 1.2,
        rate: 0.9,
      });
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
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

