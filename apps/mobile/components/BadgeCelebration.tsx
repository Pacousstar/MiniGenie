import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@minigenie/shared';
import AssenaAnimations from './Assena/AssenaAnimations';
import type { Badge } from '../services/BadgeService';

interface BadgeCelebrationProps {
  badge: Badge;
  visible: boolean;
  onClose: () => void;
}

/**
 * Composant de célébration pour les badges débloqués
 */
export default function BadgeCelebration({ badge, visible, onClose }: BadgeCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'entrée améliorée avec rebond
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 40,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      // Animation de sortie
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Réinitialiser après l'animation
        scaleAnim.setValue(0);
        fadeAnim.setValue(0);
        rotateAnim.setValue(0);
      });
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Confettis animés améliorés */}
          <View style={styles.confettiContainer}>
            {Array.from({ length: 25 }).map((_, i) => {
              const randomDelay = i * 50;
              const randomColor = [
                COLORS.primary.orange,
                COLORS.primary.green,
                COLORS.primary.blue,
                COLORS.primary.red,
              ][i % 4];
              
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.confetti,
                    {
                      left: `${(i * 4) % 100}%`,
                      top: `${(i * 3) % 100}%`,
                      backgroundColor: randomColor,
                      transform: [
                        { rotate: rotate },
                        {
                          translateY: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 150 + (i % 3) * 50],
                          }),
                        },
                      ],
                      opacity: fadeAnim,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Assena qui célèbre */}
          <View style={styles.assenaContainer}>
            <AssenaAnimations expression="celebrating" size={100} />
          </View>

          {/* Badge */}
          <Animated.View
            style={[
              styles.badgeContainer,
              {
                transform: [{ rotate }],
              },
            ]}
          >
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
          </Animated.View>

          {/* Texte */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bravo ! 🎉</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDescription}>{badge.description}</Text>
          </View>

          {/* Bouton Fermer */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continuer</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  assenaContainer: {
    marginBottom: 20,
  },
  badgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary.orange + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: COLORS.primary.orange,
  },
  badgeIcon: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 40,
    minWidth: 150,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.primary.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

