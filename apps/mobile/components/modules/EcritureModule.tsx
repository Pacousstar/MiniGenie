import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  PanResponder,
  Animated,
} from 'react-native';
import { COLORS, ASSENA_MESSAGES } from '@minigenie/shared';
import { speakAsAssena } from './TTSModule';
import { soundService } from '../../services/SoundService';

interface EcritureModuleProps {
  onComplete?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface LetterTemplate {
  letter: string;
  paths: string[]; // Chemins SVG pour guider le tracé
}

const LETTER_TEMPLATES: LetterTemplate[] = [
  { letter: 'A', paths: ['M 50 150 L 50 50 L 100 50 L 100 150', 'M 50 100 L 100 100'] },
  { letter: 'B', paths: ['M 50 50 L 50 150', 'M 50 50 Q 75 50 75 75', 'M 50 100 Q 75 100 75 125', 'M 50 150 Q 75 150 75 125'] },
  { letter: 'C', paths: ['M 100 50 Q 50 50 50 100 Q 50 150 100 150'] },
  { letter: 'D', paths: ['M 50 50 L 50 150', 'M 50 50 L 75 50 Q 100 50 100 100 Q 100 150 75 150 L 50 150'] },
  { letter: 'E', paths: ['M 50 50 L 50 150', 'M 50 50 L 100 50', 'M 50 100 L 90 100', 'M 50 150 L 100 150'] },
  { letter: 'a', paths: ['M 75 100 Q 50 100 50 125 Q 50 150 75 150', 'M 50 125 L 100 125'] },
  { letter: 'b', paths: ['M 50 50 L 50 150', 'M 50 100 Q 75 100 75 125 Q 75 150 50 150'] },
  { letter: 'c', paths: ['M 100 100 Q 50 100 50 125 Q 50 150 100 150'] },
];

/**
 * Module Écriture - Tracé tactile des lettres
 */
export default function EcritureModule({ onComplete }: EcritureModuleProps) {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [drawingPath, setDrawingPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const canvasRef = useRef<View>(null);
  const [canvasSize] = useState({ width: 300, height: 300 });
  const guidePulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const letterAppearAnim = useRef(new Animated.Value(0)).current;

  const currentTemplate = LETTER_TEMPLATES[currentLetterIndex] || LETTER_TEMPLATES[0];

  // Animation du guide qui pulse
  React.useEffect(() => {
    if (showGuide) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(guidePulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(guidePulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [showGuide, currentLetterIndex]);

  // Animation d'apparition de la lettre
  React.useEffect(() => {
    letterAppearAnim.setValue(0);
    Animated.spring(letterAppearAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [currentLetterIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setIsDrawing(true);
        setDrawingPath([{ x: locationX, y: locationY }]);
        setFeedback(null);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawing) return;
        const { locationX, locationY } = evt.nativeEvent;
        setDrawingPath((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        validateDrawing();
      },
    })
  ).current;

  const validateDrawing = () => {
    // Validation simplifiée : vérifier si le tracé est proche du template
    // Dans une vraie implémentation, on utiliserait une reconnaissance de forme
    if (drawingPath.length > 10) {
      setFeedback('Bien ! Continue comme ça !');
      // Son d'encouragement
      soundService.playEncouragement().catch(console.error);
      
      // Animation de feedback positif
      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch(console.error);
    } else {
      setFeedback('Essaie de tracer toute la lettre !');
      // Son d'erreur doux
      soundService.playError().catch(console.error);
      
      // Animation de feedback d'encouragement
      Animated.sequence([
        Animated.timing(feedbackAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(feedbackAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      speakAsAssena(ASSENA_MESSAGES.correction[0]).catch(console.error);
    }
  };

  const handleClear = () => {
    setDrawingPath([]);
    setFeedback(null);
  };

  const handleNext = () => {
    if (currentLetterIndex < LETTER_TEMPLATES.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setDrawingPath([]);
      setFeedback(null);
      speakAsAssena(`Trace maintenant la lettre ${LETTER_TEMPLATES[currentLetterIndex + 1].letter}`).catch(console.error);
    } else {
      speakAsAssena(ASSENA_MESSAGES.encouragement[0]).catch(console.error);
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  const handlePrevious = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(currentLetterIndex - 1);
      setDrawingPath([]);
      setFeedback(null);
    }
  };

  const handleToggleGuide = () => {
    setShowGuide(!showGuide);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Écriture</Text>
          <Text style={styles.subtitle}>
            Lettre {currentLetterIndex + 1} sur {LETTER_TEMPLATES.length}
          </Text>
        </View>

        {/* Zone de dessin */}
        <View style={styles.drawingContainer}>
          <View
            ref={canvasRef}
            style={[styles.canvas, { width: canvasSize.width, height: canvasSize.height }]}
            {...panResponder.panHandlers}
          >
            {/* Guide (lettre en pointillés) avec animation */}
            {showGuide && (
              <Animated.View
                style={[
                  styles.guideContainer,
                  {
                    opacity: guidePulseAnim,
                  },
                ]}
              >
                <Text style={styles.guideLetter}>{currentTemplate.letter}</Text>
              </Animated.View>
            )}
            
            {/* Tracé de l'utilisateur - représentation simplifiée */}
            {drawingPath.length > 0 && (
              <View style={styles.drawingOverlay}>
                {drawingPath.map((point, index) => {
                  if (index === 0) return null;
                  const prevPoint = drawingPath[index - 1];
                  return (
                    <View
                      key={index}
                      style={[
                        styles.drawingLine,
                        {
                          left: Math.min(prevPoint.x, point.x),
                          top: Math.min(prevPoint.y, point.y),
                          width: Math.abs(point.x - prevPoint.x) || 2,
                          height: Math.abs(point.y - prevPoint.y) || 2,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            )}
            
            {/* Lettre cible affichée en haut avec animation */}
            <Animated.View
              style={[
                styles.targetLetterContainer,
                {
                  opacity: letterAppearAnim,
                  transform: [
                    {
                      scale: letterAppearAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.targetLetter}>{currentTemplate.letter}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Feedback avec animation */}
        {feedback && (
          <Animated.View
            style={[
              styles.feedbackContainer,
              {
                opacity: feedbackAnim,
                transform: [
                  {
                    translateY: feedbackAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.feedbackText}>{feedback}</Text>
          </Animated.View>
        )}

        {/* Contrôles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentLetterIndex === 0 && styles.controlButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentLetterIndex === 0}
          >
            <Text style={styles.controlButtonText}>← Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>🗑️ Effacer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guideButton}
            onPress={handleToggleGuide}
          >
            <Text style={styles.guideButtonText}>
              {showGuide ? '👁️ Cacher' : '👁️ Afficher'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, currentLetterIndex === LETTER_TEMPLATES.length - 1 && styles.controlButtonDisabled]}
            onPress={handleNext}
            disabled={currentLetterIndex === LETTER_TEMPLATES.length - 1}
          >
            <Text style={styles.controlButtonText}>
              {currentLetterIndex === LETTER_TEMPLATES.length - 1 ? 'Terminer ✓' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            👆 Trace la lettre {currentTemplate.letter} avec ton doigt en suivant le guide vert
          </Text>
        </View>

        {/* Progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentLetterIndex + 1) / LETTER_TEMPLATES.length) * 100}%` },
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
    marginBottom: 30,
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
  drawingContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.primary.orange,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  guideContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideLetter: {
    fontSize: 200,
    fontWeight: 'bold',
    color: COLORS.primary.green,
    opacity: 0.25,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  drawingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  drawingLine: {
    position: 'absolute',
    backgroundColor: COLORS.primary.orange,
    borderRadius: 2,
  },
  targetLetterContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  targetLetter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    opacity: 0.3,
  },
  feedbackContainer: {
    backgroundColor: COLORS.primary.green + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary.green,
  },
  feedbackText: {
    fontSize: 18,
    color: COLORS.primary.green,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  controlButton: {
    flex: 1,
    minWidth: '45%',
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
  clearButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.primary.red,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.primary.blue,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  guideButtonText: {
    color: COLORS.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  instructionsText: {
    fontSize: 16,
    color: COLORS.text.dark,
    textAlign: 'center',
    lineHeight: 24,
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

