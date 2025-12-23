import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';
import { COLORS } from '@minigenie/shared';

export type AssenaExpression = 'happy' | 'encouraging' | 'thinking' | 'celebrating' | 'listening';

interface AssenaAnimationsProps {
  expression: AssenaExpression;
  size?: number;
}

/**
 * Composant Assena avec animations améliorées selon l'expression
 */
export default function AssenaAnimations({ expression, size = 120 }: AssenaAnimationsProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Arrêter toutes les animations précédentes
    bounceAnim.stopAnimation();
    rotateAnim.stopAnimation();
    scaleAnim.stopAnimation();
    pulseAnim.stopAnimation();
    glowAnim.stopAnimation();

    // Réinitialiser les valeurs
    bounceAnim.setValue(0);
    rotateAnim.setValue(0);
    scaleAnim.setValue(1);
    pulseAnim.setValue(1);
    glowAnim.setValue(0);

    // Animation de base (rebond léger continu)
    const baseBounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Animation de pulsation douce (pour toutes les expressions)
    const basePulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Animations selon l'expression
    switch (expression) {
      case 'celebrating':
        // Animation de célébration (sauts énergiques + rotation + glow)
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.spring(bounceAnim, {
                toValue: -25,
                tension: 50,
                friction: 5,
                useNativeDriver: true,
              }),
              Animated.spring(bounceAnim, {
                toValue: 0,
                tension: 50,
                friction: 5,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.15,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(glowAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
              }),
            ])
          ),
        ]).start();
        break;

      case 'encouraging':
        // Animation d'encouragement (pulsation rythmée + rebond)
        Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.12,
                duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
                duration: 350,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: -12,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
          ),
        ]).start();
        break;

      case 'thinking':
        // Animation de réflexion (inclinaison douce + pulsation lente)
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 0.15,
                duration: 1200,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: -0.15,
                duration: 1200,
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.08,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
        break;

      case 'listening':
        // Animation d'écoute (pulsation douce + légère inclinaison)
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.08,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
            ])
          ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
                toValue: 0.08,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: -0.08,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
          ),
        ]).start();
        break;

      default:
        // Animation par défaut (happy) - rebond doux + pulsation
        baseBounceAnimation.start();
        basePulseAnimation.start();
        break;
    }

    return () => {
      bounceAnim.stopAnimation();
      rotateAnim.stopAnimation();
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [expression]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-0.15, 0, 0.15, 1],
    outputRange: ['-15deg', '0deg', '15deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const getEmoji = () => {
    switch (expression) {
      case 'happy':
        return '😊';
      case 'encouraging':
        return '👏';
      case 'thinking':
        return '🤔';
      case 'celebrating':
        return '🎉';
      case 'listening':
        return '👂';
      default:
        return '👧';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [
            { translateY: bounceAnim },
            { rotate },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowOpacity: expression === 'celebrating' ? glowOpacity : 0.3,
            shadowRadius: expression === 'celebrating' ? 15 : 8,
          },
        ]}
      >
        <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>{getEmoji()}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: COLORS.primary.orange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary.green,
  },
  emoji: {
    textAlign: 'center',
  },
});

