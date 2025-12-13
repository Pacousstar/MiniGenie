import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, MODULES, ASSENA_MESSAGES } from '@minigenie/shared';
import * as Speech from 'expo-speech';

/**
 * Écran de module pédagogique
 */
export default function ModuleScreen() {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module: string }>();
  const moduleData = module ? MODULES[module] : null;

  useEffect(() => {
    if (moduleData) {
      Speech.speak(
        `Super ! Tu as choisi le module ${moduleData.title}. C'est parti !`,
        { language: 'fr-FR', pitch: 1.2, rate: 0.9 }
      );
    }
  }, [moduleData]);

  if (!moduleData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Module non trouvé</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Pour l'instant, affichage simple - À développer selon le module
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.moduleIcon}>{moduleData.icon}</Text>
        <Text style={styles.moduleTitle}>{moduleData.title}</Text>
        <Text style={styles.comingSoon}>Module en développement...</Text>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  moduleIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  moduleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 18,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.primary.red,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

