import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, ASSENA_CONFIG, ASSENA_MESSAGES, MODULES } from '@minigenie/shared';
import { speakAsAssena } from '../components/modules/TTSModule';
import AssenaAnimations from '../components/Assena/AssenaAnimations';

/**
 * Écran d'accueil avec Assena
 */
export default function HomeScreen() {
  const router = useRouter();
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    // Assena se présente à l'arrivée
    if (!hasSpoken) {
      speakAsAssena(ASSENA_MESSAGES.welcome).catch(console.error);
      setHasSpoken(true);
    }
  }, []);

  const handleModulePress = (moduleId: string) => {
    router.push(`/modules?module=${moduleId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header avec Assena */}
        <View style={styles.header}>
          <View style={styles.assenaContainer}>
            <AssenaAnimations expression="happy" size={120} />
            <Text style={styles.assenaName}>{ASSENA_CONFIG.name}</Text>
          </View>
        </View>

        {/* Message de bienvenue */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            {ASSENA_MESSAGES.welcome}
          </Text>
        </View>

        {/* Modules disponibles */}
        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Choisis ce que tu veux apprendre :</Text>
          
          <View style={styles.modulesGrid}>
            {Object.entries(MODULES).map(([id, module]) => (
              <TouchableOpacity
                key={id}
                style={styles.moduleCard}
                onPress={() => handleModulePress(id)}
                activeOpacity={0.7}
              >
                <Text style={styles.moduleIcon}>{module.icon}</Text>
                <Text style={styles.moduleTitle}>{module.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Boutons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/badges')}
          >
            <Text style={styles.actionButtonText}>🏆 Mes Badges</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.actionButtonText}>👤 Mon Profil</Text>
          </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  assenaContainer: {
    alignItems: 'center',
  },
  assenaAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 4,
    borderColor: COLORS.primary.green,
  },
  assenaEmoji: {
    fontSize: 60,
  },
  assenaName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
  },
  welcomeCard: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.text.dark,
    textAlign: 'center',
    lineHeight: 26,
  },
  modulesContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.primary.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.dark,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary.green,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.primary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

