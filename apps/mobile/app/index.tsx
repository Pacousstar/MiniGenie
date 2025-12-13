import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, ASSENA_CONFIG } from '@minigenie/shared';

/**
 * Écran Splash Screen animé avec logo MiniGénie
 */
export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirection après 2.5 secondes
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo MiniGénie - À remplacer par l'image réelle */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Mini</Text>
          <Text style={[styles.logoText, styles.logoTextGreen]}>Génie</Text>
        </View>

        {/* Mascotte génie - Placeholder */}
        <View style={styles.genieContainer}>
          <View style={styles.genieHead} />
          <View style={styles.genieBody} />
        </View>

        <Text style={styles.subtitle}>
          Apprendre en s'amusant avec {ASSENA_CONFIG.name} !
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logoTextGreen: {
    color: COLORS.primary.green,
    marginLeft: 10,
  },
  genieContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  genieHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary.orange,
    marginBottom: 10,
  },
  genieBody: {
    width: 60,
    height: 100,
    backgroundColor: COLORS.primary.green,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.primary.white,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});

