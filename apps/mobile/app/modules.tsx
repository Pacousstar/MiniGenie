import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, MODULES, ASSENA_MESSAGES } from '@minigenie/shared';
import * as Speech from 'expo-speech';
import AlphabetModule from '../components/modules/AlphabetModule';

/**
 * Écran de module pédagogique
 */
export default function ModuleScreen() {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module: string }>();
  const [currentModule, setCurrentModule] = useState<string | null>(null);

  useEffect(() => {
    if (module) {
      setCurrentModule(module);
    }
  }, [module]);

  const handleBack = () => {
    router.back();
  };

  // Rendu du module spécifique
  const renderModule = () => {
    if (!currentModule) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Choisis un module pour commencer !</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (currentModule) {
      case 'alphabet':
        return <AlphabetModule onComplete={handleBack} />;
      default:
        return (
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>
              Le module "{MODULES[currentModule]?.title || currentModule}" arrive bientôt !
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderModule()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 30,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoonText: {
    fontSize: 22,
    color: COLORS.text.dark,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: COLORS.primary.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
