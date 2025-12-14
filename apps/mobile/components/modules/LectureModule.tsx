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

interface LectureModuleProps {
  onComplete?: () => void;
}

interface ReadingItem {
  text: string;
  level: 'simple' | 'moyen';
  category: string;
}

const READING_ITEMS: ReadingItem[] = [
  { text: 'Papa', level: 'simple', category: 'Mots simples' },
  { text: 'Maman', level: 'simple', category: 'Mots simples' },
  { text: 'Chat', level: 'simple', category: 'Mots simples' },
  { text: 'Chien', level: 'simple', category: 'Mots simples' },
  { text: 'Maison', level: 'simple', category: 'Mots simples' },
  { text: 'École', level: 'simple', category: 'Mots simples' },
  { text: 'Papa aime maman', level: 'moyen', category: 'Phrases courtes' },
  { text: 'Le chat est noir', level: 'moyen', category: 'Phrases courtes' },
  { text: 'Je vais à l\'école', level: 'moyen', category: 'Phrases courtes' },
  { text: 'Maman fait la cuisine', level: 'moyen', category: 'Phrases courtes' },
];

/**
 * Module Lecture - Lire des mots et phrases simples
 */
export default function LectureModule({ onComplete }: LectureModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showAnswer, setShowAnswer] = useState(false);

  const currentItem = READING_ITEMS[currentIndex];

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const speakText = async (text: string) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = showAnswer ? text : `Lis ce mot ou cette phrase : ${text}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    speakText(currentItem.text);
  };

  const handleNext = () => {
    if (currentIndex < READING_ITEMS.length - 1) {
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
    speakText(currentItem.text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Lecture</Text>
          <Text style={styles.subtitle}>
            {currentItem.category} - {currentIndex + 1} sur {READING_ITEMS.length}
          </Text>
        </View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.textCard}
            onPress={handleShowAnswer}
            activeOpacity={0.8}
          >
            {showAnswer ? (
              <Text style={styles.text}>{currentItem.text}</Text>
            ) : (
              <View style={styles.hiddenContainer}>
                <Text style={styles.hiddenText}>Appuie pour voir</Text>
                <Text style={styles.hintText}>👆</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {showAnswer && (
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
              style={[styles.controlButton, currentIndex === READING_ITEMS.length - 1 && styles.controlButtonDisabled]}
              onPress={handleNext}
              disabled={currentIndex === READING_ITEMS.length - 1}
            >
              <Text style={styles.controlButtonText}>
                {currentIndex === READING_ITEMS.length - 1 ? 'Terminer ✓' : 'Suivant →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / READING_ITEMS.length) * 100}%` },
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
  textContainer: {
    marginBottom: 40,
    width: '100%',
  },
  textCard: {
    width: '100%',
    minHeight: 200,
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
    padding: 30,
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary.blue,
    textAlign: 'center',
    lineHeight: 60,
  },
  hiddenContainer: {
    alignItems: 'center',
  },
  hiddenText: {
    fontSize: 24,
    color: COLORS.text.medium,
    marginBottom: 10,
  },
  hintText: {
    fontSize: 40,
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

