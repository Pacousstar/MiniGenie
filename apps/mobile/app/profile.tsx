import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@minigenie/shared';

/**
 * Écran de profil enfant
 */
export default function ProfileScreen() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState('');
  const [age, setAge] = useState('');

  const handleSave = () => {
    // TODO: Sauvegarder le profil
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Mon Profil</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mon prénom ou pseudo :</Text>
            <TextInput
              style={styles.input}
              value={pseudo}
              onChangeText={setPseudo}
              placeholder="Ex: Amara, Fatou..."
              placeholderTextColor={COLORS.text.light}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mon âge :</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Ex: 5"
              keyboardType="numeric"
              placeholderTextColor={COLORS.text.light}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Enregistrer</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 20,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.dark,
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.primary.green,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: COLORS.text.dark,
  },
  saveButton: {
    backgroundColor: COLORS.primary.orange,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.primary.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

