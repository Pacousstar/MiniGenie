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
import ClockDisplay from '../ClockDisplay';

interface VocabulaireModuleProps {
  onComplete?: () => void;
}

interface VocabItem {
  word: string;
  category: string;
  emoji: string;
  time?: { hour: number; minute: number };
}

const VOCABULARY: VocabItem[] = [
  // Couleurs (complètes)
  { word: 'Rouge', category: 'Couleurs', emoji: '🔴' },
  { word: 'Bleu', category: 'Couleurs', emoji: '🔵' },
  { word: 'Vert', category: 'Couleurs', emoji: '🟢' },
  { word: 'Jaune', category: 'Couleurs', emoji: '🟡' },
  { word: 'Orange', category: 'Couleurs', emoji: '🟠' },
  { word: 'Violet', category: 'Couleurs', emoji: '🟣' },
  { word: 'Rose', category: 'Couleurs', emoji: '🌸' },
  { word: 'Noir', category: 'Couleurs', emoji: '⚫' },
  { word: 'Blanc', category: 'Couleurs', emoji: '⚪' },
  { word: 'Marron', category: 'Couleurs', emoji: '🟤' },
  { word: 'Gris', category: 'Couleurs', emoji: '⚪' },
  
  // Animaux (enrichi)
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
  { word: 'Lapin', category: 'Animaux', emoji: '🐰' },
  { word: 'Souris', category: 'Animaux', emoji: '🐭' },
  { word: 'Cheval', category: 'Animaux', emoji: '🐴' },
  { word: 'Vache', category: 'Animaux', emoji: '🐮' },
  { word: 'Cochon', category: 'Animaux', emoji: '🐷' },
  { word: 'Mouton', category: 'Animaux', emoji: '🐑' },
  { word: 'Chèvre', category: 'Animaux', emoji: '🐐' },
  { word: 'Poule', category: 'Animaux', emoji: '🐔' },
  { word: 'Canard', category: 'Animaux', emoji: '🦆' },
  { word: 'Papillon', category: 'Animaux', emoji: '🦋' },
  
  // Objets (enrichi)
  { word: 'Livre', category: 'Objets', emoji: '📚' },
  { word: 'Crayon', category: 'Objets', emoji: '✏️' },
  { word: 'Ballon', category: 'Objets', emoji: '⚽' },
  { word: 'Voiture', category: 'Objets', emoji: '🚗' },
  { word: 'Maison', category: 'Objets', emoji: '🏠' },
  { word: 'Table', category: 'Objets', emoji: '🪑' },
  { word: 'Chaise', category: 'Objets', emoji: '💺' },
  { word: 'Lampe', category: 'Objets', emoji: '💡' },
  { word: 'Téléphone', category: 'Objets', emoji: '📱' },
  { word: 'Horloge', category: 'Objets', emoji: '🕐' },
  { word: 'Stylo', category: 'Objets', emoji: '✒️' },
  { word: 'Gomme', category: 'Objets', emoji: '🧹' },
  { word: 'Cahier', category: 'Objets', emoji: '📓' },
  { word: 'Règle', category: 'Objets', emoji: '📏' },
  { word: 'Sac', category: 'Objets', emoji: '🎒' },
  { word: 'Vélo', category: 'Objets', emoji: '🚲' },
  { word: 'Train', category: 'Objets', emoji: '🚂' },
  { word: 'Avion', category: 'Objets', emoji: '✈️' },
  { word: 'Bateau', category: 'Objets', emoji: '⛵' },
  { word: 'Poupée', category: 'Objets', emoji: '🧸' },
  
  // Fruits (enrichi)
  { word: 'Pomme', category: 'Fruits', emoji: '🍎' },
  { word: 'Banane', category: 'Fruits', emoji: '🍌' },
  { word: 'Orange', category: 'Fruits', emoji: '🍊' },
  { word: 'Fraise', category: 'Fruits', emoji: '🍓' },
  { word: 'Raisin', category: 'Fruits', emoji: '🍇' },
  { word: 'Pastèque', category: 'Fruits', emoji: '🍉' },
  { word: 'Ananas', category: 'Fruits', emoji: '🍍' },
  { word: 'Mangue', category: 'Fruits', emoji: '🥭' },
  { word: 'Cerise', category: 'Fruits', emoji: '🍒' },
  { word: 'Poire', category: 'Fruits', emoji: '🍐' },
  { word: 'Pêche', category: 'Fruits', emoji: '🍑' },
  { word: 'Citron', category: 'Fruits', emoji: '🍋' },
  
  // Parties du corps (COMPLET)
  { word: 'Tête', category: 'Corps', emoji: '👤' },
  { word: 'Cheveux', category: 'Corps', emoji: '💇' },
  { word: 'Front', category: 'Corps', emoji: '🧠' },
  { word: 'Œil', category: 'Corps', emoji: '👁️' },
  { word: 'Yeux', category: 'Corps', emoji: '👀' },
  { word: 'Nez', category: 'Corps', emoji: '👃' },
  { word: 'Bouche', category: 'Corps', emoji: '👄' },
  { word: 'Lèvres', category: 'Corps', emoji: '💋' },
  { word: 'Dent', category: 'Corps', emoji: '🦷' },
  { word: 'Langue', category: 'Corps', emoji: '👅' },
  { word: 'Oreille', category: 'Corps', emoji: '👂' },
  { word: 'Joues', category: 'Corps', emoji: '😊' },
  { word: 'Menton', category: 'Corps', emoji: '👤' },
  { word: 'Cou', category: 'Corps', emoji: '👔' },
  { word: 'Épaule', category: 'Corps', emoji: '💪' },
  { word: 'Bras', category: 'Corps', emoji: '💪' },
  { word: 'Coude', category: 'Corps', emoji: '🦾' },
  { word: 'Poignet', category: 'Corps', emoji: '🤲' },
  { word: 'Main', category: 'Corps', emoji: '✋' },
  { word: 'Doigt', category: 'Corps', emoji: '👆' },
  { word: 'Pouce', category: 'Corps', emoji: '👍' },
  { word: 'Ongle', category: 'Corps', emoji: '💅' },
  { word: 'Poitrine', category: 'Corps', emoji: '❤️' },
  { word: 'Ventre', category: 'Corps', emoji: '🤰' },
  { word: 'Dos', category: 'Corps', emoji: '🧘' },
  { word: 'Hanches', category: 'Corps', emoji: '🦴' },
  { word: 'Jambe', category: 'Corps', emoji: '🦵' },
  { word: 'Genou', category: 'Corps', emoji: '🦵' },
  { word: 'Cheville', category: 'Corps', emoji: '🦶' },
  { word: 'Pied', category: 'Corps', emoji: '🦶' },
  { word: 'Orteil', category: 'Corps', emoji: '🦶' },
  
  // Légumes (nouvelle catégorie)
  { word: 'Carotte', category: 'Légumes', emoji: '🥕' },
  { word: 'Tomate', category: 'Légumes', emoji: '🍅' },
  { word: 'Salade', category: 'Légumes', emoji: '🥬' },
  { word: 'Brocoli', category: 'Légumes', emoji: '🥦' },
  { word: 'Pomme de terre', category: 'Légumes', emoji: '🥔' },
  { word: 'Oignon', category: 'Légumes', emoji: '🧅' },
  { word: 'Poivron', category: 'Légumes', emoji: '🫑' },
  { word: 'Courgette', category: 'Légumes', emoji: '🥒' },
  { word: 'Aubergine', category: 'Légumes', emoji: '🍆' },
  { word: 'Champignon', category: 'Légumes', emoji: '🍄' },
  
  // Vêtements (nouvelle catégorie)
  { word: 'Chemise', category: 'Vêtements', emoji: '👔' },
  { word: 'Robe', category: 'Vêtements', emoji: '👗' },
  { word: 'Pantalon', category: 'Vêtements', emoji: '👖' },
  { word: 'Chaussure', category: 'Vêtements', emoji: '👟' },
  { word: 'Chapeau', category: 'Vêtements', emoji: '👒' },
  { word: 'Chaussette', category: 'Vêtements', emoji: '🧦' },
  { word: 'Gant', category: 'Vêtements', emoji: '🧤' },
  { word: 'Écharpe', category: 'Vêtements', emoji: '🧣' },
  { word: 'Manteau', category: 'Vêtements', emoji: '🧥' },
  { word: 'Lunettes', category: 'Vêtements', emoji: '👓' },
  
  // Météo (nouvelle catégorie)
  { word: 'Soleil', category: 'Météo', emoji: '☀️' },
  { word: 'Lune', category: 'Météo', emoji: '🌙' },
  { word: 'Étoile', category: 'Météo', emoji: '⭐' },
  { word: 'Nuage', category: 'Météo', emoji: '☁️' },
  { word: 'Pluie', category: 'Météo', emoji: '🌧️' },
  { word: 'Arc-en-ciel', category: 'Météo', emoji: '🌈' },
  { word: 'Neige', category: 'Météo', emoji: '❄️' },
  { word: 'Vent', category: 'Météo', emoji: '💨' },
  { word: 'Tonnerre', category: 'Météo', emoji: '⛈️' },
  { word: 'Éclair', category: 'Météo', emoji: '⚡' },
  
  // Temps - Jours
  { word: 'Lundi', category: 'Jours', emoji: '📅' },
  { word: 'Mardi', category: 'Jours', emoji: '📅' },
  { word: 'Mercredi', category: 'Jours', emoji: '📅' },
  { word: 'Jeudi', category: 'Jours', emoji: '📅' },
  { word: 'Vendredi', category: 'Jours', emoji: '📅' },
  { word: 'Samedi', category: 'Jours', emoji: '📅' },
  { word: 'Dimanche', category: 'Jours', emoji: '📅' },
  { word: 'Aujourd\'hui', category: 'Jours', emoji: '📆' },
  { word: 'Demain', category: 'Jours', emoji: '📆' },
  { word: 'Hier', category: 'Jours', emoji: '📆' },
  
  // Temps - Semaines
  { word: 'Semaine', category: 'Temps', emoji: '📆' },
  { word: 'Lundi', category: 'Temps', emoji: '📅' },
  { word: 'Mardi', category: 'Temps', emoji: '📅' },
  { word: 'Mercredi', category: 'Temps', emoji: '📅' },
  { word: 'Jeudi', category: 'Temps', emoji: '📅' },
  { word: 'Vendredi', category: 'Temps', emoji: '📅' },
  { word: 'Samedi', category: 'Temps', emoji: '📅' },
  { word: 'Dimanche', category: 'Temps', emoji: '📅' },
  
  // Temps - Mois
  { word: 'Janvier', category: 'Mois', emoji: '🗓️' },
  { word: 'Février', category: 'Mois', emoji: '🗓️' },
  { word: 'Mars', category: 'Mois', emoji: '🗓️' },
  { word: 'Avril', category: 'Mois', emoji: '🗓️' },
  { word: 'Mai', category: 'Mois', emoji: '🗓️' },
  { word: 'Juin', category: 'Mois', emoji: '🗓️' },
  { word: 'Juillet', category: 'Mois', emoji: '🗓️' },
  { word: 'Août', category: 'Mois', emoji: '🗓️' },
  { word: 'Septembre', category: 'Mois', emoji: '🗓️' },
  { word: 'Octobre', category: 'Mois', emoji: '🗓️' },
  { word: 'Novembre', category: 'Mois', emoji: '🗓️' },
  { word: 'Décembre', category: 'Mois', emoji: '🗓️' },
  { word: 'Mois', category: 'Mois', emoji: '📅' },
  
  // Temps - Heures (avec horloges)
  { word: 'Une heure', category: 'Heures', emoji: '🕐', time: { hour: 1, minute: 0 } },
  { word: 'Deux heures', category: 'Heures', emoji: '🕑', time: { hour: 2, minute: 0 } },
  { word: 'Trois heures', category: 'Heures', emoji: '🕒', time: { hour: 3, minute: 0 } },
  { word: 'Quatre heures', category: 'Heures', emoji: '🕓', time: { hour: 4, minute: 0 } },
  { word: 'Cinq heures', category: 'Heures', emoji: '🕔', time: { hour: 5, minute: 0 } },
  { word: 'Six heures', category: 'Heures', emoji: '🕕', time: { hour: 6, minute: 0 } },
  { word: 'Sept heures', category: 'Heures', emoji: '🕖', time: { hour: 7, minute: 0 } },
  { word: 'Huit heures', category: 'Heures', emoji: '🕗', time: { hour: 8, minute: 0 } },
  { word: 'Neuf heures', category: 'Heures', emoji: '🕘', time: { hour: 9, minute: 0 } },
  { word: 'Dix heures', category: 'Heures', emoji: '🕙', time: { hour: 10, minute: 0 } },
  { word: 'Onze heures', category: 'Heures', emoji: '🕚', time: { hour: 11, minute: 0 } },
  { word: 'Midi', category: 'Heures', emoji: '🕛', time: { hour: 12, minute: 0 } },
  { word: 'Une heure et demie', category: 'Heures', emoji: '🕐', time: { hour: 1, minute: 30 } },
  { word: 'Deux heures et demie', category: 'Heures', emoji: '🕑', time: { hour: 2, minute: 30 } },
  { word: 'Trois heures et demie', category: 'Heures', emoji: '🕒', time: { hour: 3, minute: 30 } },
  { word: 'Quatre heures et demie', category: 'Heures', emoji: '🕓', time: { hour: 4, minute: 30 } },
  { word: 'Cinq heures et demie', category: 'Heures', emoji: '🕔', time: { hour: 5, minute: 30 } },
  { word: 'Midi et demi', category: 'Heures', emoji: '🕛', time: { hour: 12, minute: 30 } },
];

/**
 * Module Vocabulaire - Apprendre des mots du quotidien
 */
export default function VocabulaireModule({ onComplete }: VocabulaireModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentItem = useMemo(() => VOCABULARY[currentIndex], [currentIndex]);

  useEffect(() => {
    speakWord(currentItem);
  }, [currentIndex]);

  const speakWord = useCallback(async (item: VocabItem) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    let message = '';
    
    if (item.time) {
      // Message spécial pour les heures
      const hourStr = item.time.hour === 12 ? 'midi' : item.time.hour === 0 ? 'minuit' : item.time.hour.toString();
      const minuteStr = item.time.minute === 0 ? '' : ` et ${item.time.minute} minutes`;
      message = `Il est ${hourStr} heures${minuteStr}. ${item.word}`;
    } else {
      message = `${item.word}. ${item.word} comme ${item.emoji}`;
    }
    
    try {
      await speakAsAssena(message);
    } catch (error) {
      console.warn('Erreur lors de la synthèse vocale:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
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
    speakWord(currentItem);
  }, [currentItem, speakWord]);

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
            {/* Afficher l'horloge si c'est une heure */}
            {currentItem.time ? (
              <View style={styles.clockContainer}>
                <ClockDisplay
                  hour={currentItem.time.hour}
                  minute={currentItem.time.minute}
                  size={150}
                />
              </View>
            ) : (
            <Text style={styles.emoji}>{currentItem.emoji}</Text>
            )}
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
  clockContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
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

