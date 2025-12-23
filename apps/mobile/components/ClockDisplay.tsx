import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '@minigenie/shared';

interface ClockDisplayProps {
  hour: number;
  minute: number;
  size?: number;
}

/**
 * Composant d'affichage d'horloge analogique simple
 */
export default function ClockDisplay({ hour, minute, size = 120 }: ClockDisplayProps) {
  // Calculer les angles des aiguilles (en degrés)
  // Heure : 12 heures = 360 degrés, donc 1 heure = 30 degrés
  // Minute : 60 minutes = 360 degrés, donc 1 minute = 6 degrés
  const hourAngle = (hour % 12) * 30 + minute * 0.5 - 90; // -90 pour commencer en haut
  const minuteAngle = minute * 6 - 90;
  
  // Format de l'heure pour affichage numérique
  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');
  const timeString = `${hourStr}:${minuteStr}`;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Cercle de l'horloge */}
      <View style={[styles.clockCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        {/* Marques des heures (12, 3, 6, 9) */}
        <View style={[styles.hourMark, styles.mark12]} />
        <View style={[styles.hourMark, styles.mark3]} />
        <View style={[styles.hourMark, styles.mark6]} />
        <View style={[styles.hourMark, styles.mark9]} />
        
        {/* Aiguille des heures */}
        <View
          style={[
            styles.hourHand,
            {
              transform: [{ rotate: `${hourAngle}deg` }],
              width: size * 0.25,
            },
          ]}
        />
        
        {/* Aiguille des minutes */}
        <View
          style={[
            styles.minuteHand,
            {
              transform: [{ rotate: `${minuteAngle}deg` }],
              width: size * 0.35,
            },
          ]}
        />
        
        {/* Centre de l'horloge */}
        <View style={styles.centerDot} />
      </View>
      
      {/* Affichage numérique de l'heure */}
      <View style={styles.digitalTime}>
        <Text style={styles.timeText}>{timeString}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clockCircle: {
    backgroundColor: COLORS.primary.white,
    borderWidth: 4,
    borderColor: COLORS.primary.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  hourMark: {
    position: 'absolute',
    backgroundColor: COLORS.primary.orange,
    width: 3,
    height: 12,
  },
  mark12: {
    top: 8,
    left: '50%',
    marginLeft: -1.5,
  },
  mark3: {
    right: 8,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 3,
  },
  mark6: {
    bottom: 8,
    left: '50%',
    marginLeft: -1.5,
  },
  mark9: {
    left: 8,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 3,
  },
  hourHand: {
    position: 'absolute',
    height: 4,
    backgroundColor: COLORS.primary.blue,
    borderRadius: 2,
    top: '50%',
    left: '50%',
    marginTop: -2,
    transformOrigin: 'left center',
  },
  minuteHand: {
    position: 'absolute',
    height: 3,
    backgroundColor: COLORS.primary.green,
    borderRadius: 1.5,
    top: '50%',
    left: '50%',
    marginTop: -1.5,
    transformOrigin: 'left center',
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary.orange,
    top: '50%',
    left: '50%',
    marginTop: -6,
    marginLeft: -6,
  },
  digitalTime: {
    marginTop: 10,
    backgroundColor: COLORS.primary.green + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary.green,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary.green,
  },
});
