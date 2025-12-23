import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, MODULES, ASSENA_MESSAGES } from '@minigenie/shared';
import AlphabetModule from '../components/modules/AlphabetModule';
import ChiffresModule from '../components/modules/ChiffresModule';
import VocabulaireModule from '../components/modules/VocabulaireModule';
import CalculModule from '../components/modules/CalculModule';
import SyllabesModule from '../components/modules/SyllabesModule';
import FamilleModule from '../components/modules/FamilleModule';
import LectureModule from '../components/modules/LectureModule';
import EcritureModule from '../components/modules/EcritureModule';

/**
 * Écran de module pédagogique avec transitions améliorées
 */
export default function ModuleScreen() {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module: string }>();
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (module) {
      // Animation d'entrée du module
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentModule(module);
    }
  }, [module]);

  const handleBack = () => {
    // Animation de sortie avant retour
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
    router.back();
    });
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
      case 'chiffres':
        return <ChiffresModule onComplete={handleBack} />;
      case 'vocabulaire':
        return <VocabulaireModule onComplete={handleBack} />;
      case 'calcul':
        return <CalculModule onComplete={handleBack} />;
      case 'syllabes':
        return <SyllabesModule onComplete={handleBack} />;
      case 'famille':
        return <FamilleModule onComplete={handleBack} />;
      case 'lecture':
        return <LectureModule onComplete={handleBack} />;
      case 'ecriture':
        return <EcritureModule onComplete={handleBack} />;
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
      <Animated.View
        style={[
          styles.moduleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
      {renderModule()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  moduleContainer: {
    flex: 1,
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
