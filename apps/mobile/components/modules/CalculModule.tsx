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
import { badgeService } from '../../services/BadgeService';
import { sessionService } from '../../services/SessionService';
import { progressService } from '../../services/ProgressService';
import { soundService } from '../../services/SoundService';
import BadgeCelebration from '../BadgeCelebration';
import { getChildProfile } from '@minigenie/shared/src/utils/storage';

interface CalculModuleProps {
  onComplete?: () => void;
}

interface CalculProblem {
  question: string;
  answer: number;
  options: number[];
  type: 'addition' | 'soustraction' | 'comparaison';
}

/**
 * Module Calcul - Additions et soustractions simples
 */
export default function CalculModule({ onComplete }: CalculModuleProps) {
  const [currentProblem, setCurrentProblem] = useState<CalculProblem | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [newBadge, setNewBadge] = useState<any>(null);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    // Initialiser la session
    const initSession = async () => {
      try {
        const profile = await getChildProfile();
        if (profile) {
          setChildId(profile.id);
          await sessionService.startSession(profile.id, 'calcul', 'calcul');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la session:', error);
      }
    };
    
    initSession();
    generateProblem();
    
    // Nettoyer la session à la fin
    return () => {
      if (childId) {
        sessionService.endSession().catch(console.error);
      }
    };
  }, []);

  const generateProblem = () => {
    // Réinitialiser les animations
    problemAnim.setValue(0);
    correctAnim.setValue(0);
    incorrectAnim.setValue(0);
    
    // Variété d'exercices : 60% additions, 30% soustractions, 10% comparaisons
    const problemType = Math.random();
    let num1: number, num2: number, answer: number, question: string, type: 'addition' | 'soustraction' | 'comparaison';
    
    if (problemType < 0.6) {
      // Addition
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      type = 'addition';
    } else if (problemType < 0.9) {
      // Soustraction
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      type = 'soustraction';
    } else {
      // Comparaison (plus grand, plus petit)
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      if (num1 > num2) {
        answer = num1;
        question = `Quel nombre est plus grand : ${num1} ou ${num2} ?`;
      } else {
        answer = num2;
        question = `Quel nombre est plus grand : ${num1} ou ${num2} ?`;
      }
      type = 'comparaison';
    }

    // Générer des options (bonne réponse + 3 mauvaises)
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer >= 0 && wrongAnswer !== answer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Mélanger les options
    options.sort(() => Math.random() - 0.5);

    setCurrentProblem({ question, answer, options, type });
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    // Animation d'apparition du problème
    Animated.spring(problemAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    // Prononcer la question
    speakAsAssena(question).catch(console.error);
  };

  const handleAnswerSelect = async (option: number) => {
    if (selectedAnswer !== null) return; // Déjà répondu
    
    setSelectedAnswer(option);
    const correct = option === currentProblem?.answer;
    setIsCorrect(correct);
    setAttempts(attempts + 1);

    if (correct) {
      // Son de succès
      soundService.playSuccess().catch(console.error);
      
      const newScore = score + 1;
      setScore(newScore);
      speakAsAssena(ASSENA_MESSAGES.encouragement[Math.floor(Math.random() * ASSENA_MESSAGES.encouragement.length)]).catch(console.error);
      
      // Vérifier les badges
      const unlockedBadges = badgeService.checkAndUnlockBadges('calcul', newScore);
      if (unlockedBadges.length > 0) {
        setNewBadge(unlockedBadges[0]);
        setShowBadgeCelebration(true);
        // Son de badge
        soundService.playBadge().catch(console.error);
      }
      
      // Nouveau problème après 2 secondes
      setTimeout(async () => {
        if (attempts < 9) {
          generateProblem();
        } else {
          // Module terminé
          const finalScore = Math.round((newScore / (attempts + 1)) * 100);
          speakAsAssena(`Bravo ! Tu as répondu correctement à ${newScore} questions sur ${attempts + 1} !`).catch(console.error);
          
          // Mettre à jour la progression
          if (childId) {
            await progressService.updateModuleProgress(childId, 'calcul', finalScore, true);
            await sessionService.endSession(finalScore, true);
          }
          
          if (onComplete) {
            setTimeout(() => onComplete(), 3000);
          }
        }
      }, 2000);
    } else {
      // Son d'erreur (doux et encourageant)
      soundService.playError().catch(console.error);
      
      speakAsAssena(ASSENA_MESSAGES.correction[0]).catch(console.error);
      
      // Nouveau problème après 2 secondes
      setTimeout(() => {
        if (attempts < 9) {
          generateProblem();
        } else {
          if (onComplete) {
            setTimeout(() => onComplete(), 3000);
          }
        }
      }, 2000);
    }
  };

  if (!currentProblem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Calcul</Text>
          <Text style={styles.subtitle}>
            Score: {score} / {attempts + 1}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.problemContainer,
            {
              transform: [{ scale: problemAnim }],
              opacity: Animated.subtract(1, incorrectAnim),
            },
          ]}
        >
          <Text style={styles.problemText}>{currentProblem.question}</Text>
          {isCorrect && (
            <Animated.View
              style={[
                styles.feedbackOverlay,
                {
                  opacity: correctAnim,
                },
              ]}
            >
              <Text style={styles.feedbackText}>✓ Bravo !</Text>
            </Animated.View>
          )}
        </Animated.View>

        <View style={styles.optionsContainer}>
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isRightAnswer = option === currentProblem.answer;
            const buttonStyles: any[] = [styles.optionButton];
            
            if (isSelected) {
              buttonStyles.push(
                isCorrect ? styles.optionButtonCorrect : styles.optionButtonIncorrect
              );
            }
            
            if (selectedAnswer !== null && isRightAnswer) {
              buttonStyles.push(styles.optionButtonCorrect);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyles}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((attempts + 1) / 10) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {attempts + 1} / 10 questions
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: COLORS.text.medium,
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
  problemContainer: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 20,
    padding: 40,
    marginBottom: 40,
    shadowColor: COLORS.primary.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: COLORS.primary.orange,
    position: 'relative',
    overflow: 'hidden',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary.green + '80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  feedbackText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary.white,
  },
  problemText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  optionButton: {
    width: '48%',
    backgroundColor: COLORS.primary.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary.green,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionButtonCorrect: {
    backgroundColor: COLORS.primary.green,
    borderColor: COLORS.primary.green,
  },
  optionButtonIncorrect: {
    backgroundColor: COLORS.primary.red,
    borderColor: COLORS.primary.red,
  },
  optionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.dark,
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

