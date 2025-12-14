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
import { speakAsAssena } from './TTSModule';

interface SyllabesModuleProps {
  onComplete?: () => void;
}

const SYLLABES = [
  'ba', 'be', 'bi', 'bo', 'bu',
  'ca', 'ce', 'ci', 'co', 'cu',
  'da', 'de', 'di', 'do', 'du',
  'fa', 'fe', 'fi', 'fo', 'fu',
  'ga', 'ge', 'gi', 'go', 'gu',
  'la', 'le', 'li', 'lo', 'lu',
  'ma', 'me', 'mi', 'mo', 'mu',
  'na', 'ne', 'ni', 'no', 'nu',
  'pa', 'pe', 'pi', 'po', 'pu',
  'ra', 're', 'ri', 'ro', 'ru',
  'sa', 'se', 'si', 'so', 'su',
  'ta', 'te', 'ti', 'to', 'tu',
  'va', 've', 'vi', 'vo', 'vu',
];

/**
 * Module Syllabes - Apprendre les sons et syllabes
 */
export default function SyllabesModule({ onComplete }: SyllabesModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [maxItems] = useState(20); // Limiter à 20 syllabes

  const currentSyllabe = SYLLABES[currentIndex];

  useEffect(() => {
    speakSyllabe(currentSyllabe);
  }, [currentIndex]);

  const speakSyllabe = async (syllabe: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `La syllabe ${syllabe}. ${syllabe}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxItems - 1) {
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
      
      setCurrentIndex(currentIndex + 1);
    } else {
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch(console.error);
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRepeat = () => {
    speakSyllabe(currentSyllabe);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Syllabes</Text>
          <Text style={styles.subtitle}>
            Syllabe {currentIndex + 1} sur {maxItems}
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
            style={[styles.controlButton, currentIndex === maxItems - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentIndex === maxItems - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentIndex === maxItems - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / maxItems) * 100}%` },
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

