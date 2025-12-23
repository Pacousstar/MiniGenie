import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { speakAsAssena } from './TTSModule';

interface SyllabesModuleProps {
  onComplete?: () => void;
}

// Syllabes complètes - toutes les combinaisons courantes
const SYLLABES = [
  // Consonnes + a, e, i, o, u
  'ba', 'be', 'bi', 'bo', 'bu',
  'ca', 'ce', 'ci', 'co', 'cu',
  'da', 'de', 'di', 'do', 'du',
  'fa', 'fe', 'fi', 'fo', 'fu',
  'ga', 'ge', 'gi', 'go', 'gu',
  'ha', 'he', 'hi', 'ho', 'hu',
  'ja', 'je', 'ji', 'jo', 'ju',
  'ka', 'ke', 'ki', 'ko', 'ku',
  'la', 'le', 'li', 'lo', 'lu',
  'ma', 'me', 'mi', 'mo', 'mu',
  'na', 'ne', 'ni', 'no', 'nu',
  'pa', 'pe', 'pi', 'po', 'pu',
  'ra', 're', 'ri', 'ro', 'ru',
  'sa', 'se', 'si', 'so', 'su',
  'ta', 'te', 'ti', 'to', 'tu',
  'va', 've', 'vi', 'vo', 'vu',
  'wa', 'we', 'wi', 'wo', 'wu',
  'za', 'ze', 'zi', 'zo', 'zu',
  // Syllabes avec accents
  'ça', 'çe', 'çi', 'ço', 'çu',
  'é', 'è', 'ê', 'ë',
  'à', 'â',
  'î', 'ï',
  'ô', 'ö',
  'ù', 'û', 'ü',
  // Syllabes composées courantes
  'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'vr',
  'ch', 'ph', 'th',
];

/**
 * Module Syllabes - Apprendre les sons et syllabes
 */
export default function SyllabesModule({ onComplete }: SyllabesModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentSyllabe = useMemo(() => SYLLABES[currentIndex], [currentIndex]);

  useEffect(() => {
    speakSyllabe(currentSyllabe);
  }, [currentIndex]);

  const speakSyllabe = useCallback(async (syllabe: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `La syllabe ${syllabe}. ${syllabe}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.warn('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    if (currentIndex < SYLLABES.length - 1) {
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
      
      setCurrentIndex(prev => prev + 1);
    } else {
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch((err) => {
        console.warn('Erreur TTS encouragement:', err);
      });
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  }, [currentIndex, fadeAnim, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleRepeat = useCallback(() => {
    speakSyllabe(currentSyllabe);
  }, [currentSyllabe, speakSyllabe]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Syllabes</Text>
          <Text style={styles.subtitle}>
            Syllabe {currentIndex + 1} sur {SYLLABES.length}
          </Text>
        </View>

        <Animated.View style={[styles.syllabeContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.syllabeCard}
            onPress={handleRepeat}
            activeOpacity={0.8}
          >
            <Text style={styles.syllabe}>{currentSyllabe}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
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
            style={[styles.controlButton, currentIndex === SYLLABES.length - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentIndex === SYLLABES.length - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentIndex === SYLLABES.length - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / SYLLABES.length) * 100}%` },
              ]}
            />
          </View>
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
  syllabeContainer: {
    marginBottom: 40,
  },
  syllabeCard: {
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
  syllabe: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
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
});

