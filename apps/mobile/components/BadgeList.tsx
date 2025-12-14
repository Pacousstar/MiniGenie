import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '@minigenie/shared';
import { badgeService, type Badge } from '../services/BadgeService';

/**
 * Composant pour afficher la liste des badges
 */
export default function BadgeList() {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    await badgeService.loadBadges();
    setBadges(badgeService.getAllBadges());
  };

  const getBadgeStyle = (badge: Badge) => {
    if (badge.unlockedAt) {
      return [styles.badgeCard, styles.badgeUnlocked];
    }
    return [styles.badgeCard, styles.badgeLocked];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes Badges</Text>
          <Text style={styles.subtitle}>
            {badgeService.getUnlockedBadges().length} / {badges.length} débloqués
          </Text>
        </View>

        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={getBadgeStyle(badge)}>
              <Text style={styles.badgeIcon}>
                {badge.unlockedAt ? badge.icon : '🔒'}
              </Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
              
              {/* Barre de progression */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(badge.progress / badge.required) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {badge.progress} / {badge.required}
              </Text>
            </View>
          ))}
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
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary.orange,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.medium,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: COLORS.primary.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 3,
  },
  badgeUnlocked: {
    borderColor: COLORS.primary.green,
  },
  badgeLocked: {
    borderColor: COLORS.text.light,
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    marginBottom: 5,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: COLORS.text.medium,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.background.light,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary.green,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text.medium,
    fontWeight: '600',
  },
});

