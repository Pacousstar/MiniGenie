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

interface ChiffresModuleProps {
  onComplete?: () => void;
}

/**
 * Module Chiffres - Apprendre à compter de 1 à 100
 */
export default function ChiffresModule({ onComplete }: ChiffresModuleProps) {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [maxNumber] = useState(20); // Commencer par 1-20

  useEffect(() => {
    speakNumber(currentNumber);
  }, [currentNumber]);

  const speakNumber = async (number: number) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `Voici le chiffre ${number}. ${number}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentNumber < maxNumber) {
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
      
      setCurrentNumber(currentNumber + 1);
    } else {
      // Module terminé
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch(console.error);
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  const handlePrevious = () => {
    if (currentNumber > 1) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const handleRepeat = () => {
    speakNumber(currentNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Chiffres</Text>
          <Text style={styles.subtitle}>
            Chiffre {currentNumber} sur {maxNumber}
          </Text>
        </View>

        <Animated.View style={[styles.numberContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.numberCard}
            onPress={handleRepeat}
            activeOpacity={0.8}
          >
            <Text style={styles.number}>{currentNumber}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Représentation visuelle */}
        <View style={styles.visualContainer}>
          <Text style={styles.visualLabel}>
            {Array(currentNumber).fill('●').join(' ')}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentNumber === 1 && styles.controlButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentNumber === 1}
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
            style={[styles.controlButton, currentNumber === maxNumber && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentNumber === maxNumber}
          >
            <Text style={styles.controlButtonText}>
              {currentNumber === maxNumber ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentNumber) / maxNumber) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentNumber} / {maxNumber}
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
  numberContainer: {
    marginBottom: 40,
  },
  numberCard: {
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
    borderColor: COLORS.primary.blue,
  },
  number: {
    fontSize: 100,
    fontWeight: 'bold',
    color: COLORS.primary.blue,
  },
  visualContainer: {
    backgroundColor: COLORS.primary.green + '20',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: COLORS.primary.green,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualLabel: {
    fontSize: 24,
    color: COLORS.primary.green,
    fontWeight: '600',
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

