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

interface FamilleModuleProps {
  onComplete?: () => void;
}

interface FamilleMember {
  word: string;
  emoji: string;
  description: string;
}

const FAMILLE: FamilleMember[] = [
  { word: 'Papa', emoji: '👨', description: 'Ton père' },
  { word: 'Maman', emoji: '👩', description: 'Ta mère' },
  { word: 'Grand-père', emoji: '👴', description: 'Le père de papa ou maman' },
  { word: 'Grand-mère', emoji: '👵', description: 'La mère de papa ou maman' },
  { word: 'Frère', emoji: '👦', description: 'Ton frère' },
  { word: 'Sœur', emoji: '👧', description: 'Ta sœur' },
  { word: 'Oncle', emoji: '👨', description: 'Le frère de papa ou maman' },
  { word: 'Tante', emoji: '👩', description: 'La sœur de papa ou maman' },
  { word: 'Cousin', emoji: '👦', description: 'Le fils de ton oncle ou tante' },
  { word: 'Cousine', emoji: '👧', description: 'La fille de ton oncle ou tante' },
];

/**
 * Module Famille - Connaître les membres de la famille
 */
export default function FamilleModule({ onComplete }: FamilleModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentMember = FAMILLE[currentIndex];

  useEffect(() => {
    speakMember(currentMember);
  }, [currentIndex]);

  const speakMember = async (member: FamilleMember) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    const message = `${member.word}. ${member.description}`;
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < FAMILLE.length - 1) {
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
    speakMember(currentMember);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Famille</Text>
          <Text style={styles.subtitle}>
            Membre {currentIndex + 1} sur {FAMILLE.length}
          </Text>
        </View>

        <Animated.View style={[styles.memberContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.memberCard}
            onPress={handleRepeat}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{currentMember.emoji}</Text>
            <Text style={styles.word}>{currentMember.word}</Text>
            <Text style={styles.description}>{currentMember.description}</Text>
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
            style={[styles.controlButton, currentIndex === FAMILLE.length - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentIndex === FAMILLE.length - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentIndex === FAMILLE.length - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / FAMILLE.length) * 100}%` },
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
  memberContainer: {
    marginBottom: 40,
  },
  memberCard: {
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
    marginBottom: 15,
  },
  description: {
    fontSize: 20,
    color: COLORS.text.medium,
    textAlign: 'center',
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

