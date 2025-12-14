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

interface VocabulaireModuleProps {
  onComplete?: () => void;
}

interface VocabItem {
  word: string;
  category: string;
  emoji: string;
}

const VOCABULARY: VocabItem[] = [
  // Couleurs
  { word: 'Rouge', category: 'Couleurs', emoji: '🔴' },
  { word: 'Bleu', category: 'Couleurs', emoji: '🔵' },
  { word: 'Vert', category: 'Couleurs', emoji: '🟢' },
  { word: 'Jaune', category: 'Couleurs', emoji: '🟡' },
  { word: 'Orange', category: 'Couleurs', emoji: '🟠' },
  { word: 'Violet', category: 'Couleurs', emoji: '🟣' },
  { word: 'Rose', category: 'Couleurs', emoji: '🌸' },
  { word: 'Noir', category: 'Couleurs', emoji: '⚫' },
  { word: 'Blanc', category: 'Couleurs', emoji: '⚪' },
  // Animaux
  { word: 'Chat', category: 'Animaux', emoji: '🐱' },
  { word: 'Chien', category: 'Animaux', emoji: '🐶' },
  { word: 'Lion', category: 'Animaux', emoji: '🦁' },
  { word: 'Éléphant', category: 'Animaux', emoji: '🐘' },
  { word: 'Girafe', category: 'Animaux', emoji: '🦒' },
  { word: 'Zèbre', category: 'Animaux', emoji: '🦓' },
  { word: 'Singe', category: 'Animaux', emoji: '🐵' },
  { word: 'Oiseau', category: 'Animaux', emoji: '🐦' },
  { word: 'Poisson', category: 'Animaux', emoji: '🐠' },
  { word: 'Tortue', category: 'Animaux', emoji: '🐢' },
  // Objets
  { word: 'Livre', category: 'Objets', emoji: '📚' },
  { word: 'Crayon', category: 'Objets', emoji: '✏️' },
  { word: 'Ballon', category: 'Objets', emoji: '⚽' },
  { word: 'Voiture', category: 'Objets', emoji: '🚗' },
  { word: 'Maison', category: 'Objets', emoji: '🏠' },
  { word: 'Table', category: 'Objets', emoji: '🪑' },
  { word: 'Chaise', category: 'Objets', emoji: '💺' },
  { word: 'Lamp', category: 'Objets', emoji: '💡' },
  { word: 'Téléphone', category: 'Objets', emoji: '📱' },
  { word: 'Horloge', category: 'Objets', emoji: '🕐' },
  // Fruits
  { word: 'Pomme', category: 'Fruits', emoji: '🍎' },
  { word: 'Banane', category: 'Fruits', emoji: '🍌' },
  { word: 'Orange', category: 'Fruits', emoji: '🍊' },
  { word: 'Fraise', category: 'Fruits', emoji: '🍓' },
  { word: 'Raisin', category: 'Fruits', emoji: '🍇' },
  // Parties du corps
  { word: 'Tête', category: 'Corps', emoji: '👤' },
  { word: 'Main', category: 'Corps', emoji: '✋' },
  { word: 'Pied', category: 'Corps', emoji: '🦶' },
  { word: 'Œil', category: 'Corps', emoji: '👁️' },
  { word: 'Bouche', category: 'Corps', emoji: '👄' },
];

/**
 * Module Vocabulaire - Apprendre des mots du quotidien
 */
export default function VocabulaireModule({ onComplete }: VocabulaireModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentItem = VOCABULARY[currentIndex];

  useEffect(() => {
    speakWord(currentItem);
  }, [currentIndex]);

  const speakWord = async (item: VocabItem) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `${item.word}. ${item.word} comme ${item.emoji}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < VOCABULARY.length - 1) {
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
    speakWord(currentItem);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Vocabulaire</Text>
          <Text style={styles.subtitle}>
            Mot {currentIndex + 1} sur {VOCABULARY.length}
          </Text>
        </View>

        <Animated.View style={[styles.wordContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.wordCard}
            onPress={handleRepeat}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{currentItem.emoji}</Text>
            <Text style={styles.word}>{currentItem.word}</Text>
            <Text style={styles.category}>{currentItem.category}</Text>
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
            style={[styles.controlButton, currentIndex === VOCABULARY.length - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentIndex === VOCABULARY.length - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentIndex === VOCABULARY.length - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / VOCABULARY.length) * 100}%` },
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
  wordContainer: {
    marginBottom: 40,
  },
  wordCard: {
    width: 280,
    minHeight: 280,
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
    borderColor: COLORS.primary.green,
    padding: 30,
  },
  emoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 10,
  },
  category: {
    fontSize: 20,
    color: COLORS.text.medium,
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
});

