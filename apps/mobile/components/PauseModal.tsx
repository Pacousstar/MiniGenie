import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, ASSENA_MESSAGES } from '@minigenie/shared';
import AssenaAnimations from './Assena/AssenaAnimations';
import { speakAsAssena } from './modules/TTSModule';

interface PauseModalProps {
  visible: boolean;
  onContinue: () => void;
  onTakeBreak: () => void;
  sessionDuration: number; // en secondes
}

/**
 * Modal de pause intelligente
 */
export default function PauseModal({ visible, onContinue, onTakeBreak, sessionDuration }: PauseModalProps) {
  const minutes = Math.floor(sessionDuration / 60);

  React.useEffect(() => {
    if (visible) {
      const message = ASSENA_MESSAGES.pause[0];
      speakAsAssena(message).catch(console.error);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <AssenaAnimations expression="thinking" size={100} />
          
          <Text style={styles.title}>Pause recommandée</Text>
          <Text style={styles.message}>
            Tu as bien travaillé pendant {minutes} minutes ! 🎉
          </Text>
          <Text style={styles.suggestion}>
            Assena te propose de faire une petite pause pour reposer ton cerveau.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={onContinue}
            >
              <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.breakButton]}
              onPress={onTakeBreak}
            >
              <Text style={styles.buttonText}>Faire une pause</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: COLORS.text.dark,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  suggestion: {
    fontSize: 16,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttons: {
    width: '100%',
    gap: 15,
  },
  button: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    minWidth: 200,
  },
  continueButton: {
    backgroundColor: COLORS.primary.green,
  },
  breakButton: {
    backgroundColor: COLORS.primary.orange,
  },
  buttonText: {
    color: COLORS.primary.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

