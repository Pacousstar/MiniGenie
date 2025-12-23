'use client';

import React from 'react';
import styles from './DashboardStats.module.css';
import type { DashboardData } from '../services/DataService';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

interface DashboardStatsProps {
  data: DashboardData;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = {
    modulesCompleted: data.modulesCompleted,
    learningTime: `${data.totalTime} min`,
    todayTime: `${data.todayTime} min`,
    badges: data.badgesUnlocked,
    progress: `${data.overallScore}%`,
    sessions: data.totalSessions,
  };

  return (
    <div className={styles.statsGrid}>
      <StatCard
        icon="📚"
        value={stats.modulesCompleted}
        label="Modules complétés"
      />
      <StatCard
        icon="⏱️"
        value={stats.learningTime}
        label="Temps total"
      />
      <StatCard
        icon="📅"
        value={stats.todayTime}
        label="Aujourd'hui"
      />
      <StatCard
        icon="🎯"
        value={stats.sessions}
        label="Sessions"
      />
      <StatCard
        icon="⭐"
        value={stats.badges}
        label="Badges obtenus"
      />
      <StatCard
        icon="📈"
        value={stats.progress}
        label="Progression globale"
      />
    </div>
  );
}

