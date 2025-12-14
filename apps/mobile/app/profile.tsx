import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, ASSENA_CONFIG } from '@minigenie/shared';
import { saveChildProfile, getChildProfile } from '@minigenie/shared/src/utils/storage';
import { badgeService } from '../services/BadgeService';
import type { ChildProfile, EducationLevel } from '@minigenie/shared';

/**
 * Écran de création/modification du profil enfant
 */
export default function ProfileScreen() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState<EducationLevel>('maternelle_ps');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger le profil existant s'il existe
    loadProfile();
    // Charger les badges
    badgeService.loadBadges();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getChildProfile();
      if (profile) {
        setPseudo(profile.pseudo || '');
        setAge(profile.age?.toString() || '');
        setLevel(profile.level || 'maternelle_ps');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleSave = async () => {
    if (!pseudo.trim()) {
      Alert.alert('Attention', 'Entre ton prénom ou ton pseudo !');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 3 || ageNum > 8) {
      Alert.alert('Attention', 'Ton âge doit être entre 3 et 8 ans !');
      return;
    }

    setIsLoading(true);

    try {
      // Déterminer le niveau selon l'âge
      let detectedLevel: EducationLevel = 'maternelle_ps';
      if (ageNum === 3) detectedLevel = 'maternelle_ps';
      else if (ageNum === 4) detectedLevel = 'maternelle_ms';
      else if (ageNum === 5) detectedLevel = 'maternelle_gs';
      else if (ageNum === 6) detectedLevel = 'primaire_cp1';
      else if (ageNum >= 7) detectedLevel = 'primaire_cp2';

      const profile: ChildProfile = {
        id: `child_${Date.now()}`,
        pseudo: pseudo.trim(),
        age: ageNum,
        level: detectedLevel,
        userLevel: 0, // Sera ajusté automatiquement
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveChildProfile(profile);
      
      Alert.alert(
        'Super !',
        `Bonjour ${pseudo} ! ${ASSENA_CONFIG.name} est prête à t'aider à apprendre !`,
        [
          {
            text: 'Commencer',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder ton profil. Réessaie !');
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const levelLabels: Record<EducationLevel, string> = {
    maternelle_ps: 'Petite Section (3 ans)',
    maternelle_ms: 'Moyenne Section (4 ans)',
    maternelle_gs: 'Grande Section (5 ans)',
    primaire_cp1: 'CP1 (6 ans)',
    primaire_cp2: 'CP2 (7-8 ans)',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <Text style={styles.subtitle}>
            Dis-moi qui tu es, {ASSENA_CONFIG.name} veut te connaître !
          </Text>
        </View>

        <View style={styles.form}>
          {/* Pseudo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ton prénom ou pseudo :</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Amara, Fatou, Koffi..."
              value={pseudo}
              onChangeText={setPseudo}
              autoCapitalize="words"
              maxLength={20}
            />
          </View>

          {/* Âge */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ton âge :</Text>
            <TextInput
              style={styles.input}
              placeholder="Entre 3 et 8 ans"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={1}
            />
          </View>

          {/* Niveau détecté */}
          {age && parseInt(age, 10) >= 3 && parseInt(age, 10) <= 8 && (
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Niveau suggéré :</Text>
              <Text style={styles.levelValue}>
                {levelLabels[level]}
              </Text>
            </View>
          )}

          {/* Bouton Sauvegarder */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Sauvegarde...' : 'Commencer à apprendre !'}
            </Text>
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
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.dark,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: COLORS.primary.orange,
    color: COLORS.text.dark,
  },
  levelInfo: {
    backgroundColor: COLORS.primary.green + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: COLORS.primary.green,
  },
  levelLabel: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginBottom: 5,
  },
  levelValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary.green,
  },
  saveButton: {
    backgroundColor: COLORS.primary.orange,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.primary.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
