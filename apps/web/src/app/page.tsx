'use client';

import React from 'react';
import { COLORS, ASSENA_CONFIG } from '@minigenie/shared';
import styles from './page.module.css';

/**
 * Dashboard Parent - Page d'accueil
 */
export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMini}>Mini</span>
          <span className={styles.logoGenie}>Génie</span>
        </div>
        <h1 className={styles.title}>Dashboard Parent</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <div className={styles.assenaCard}>
            <div className={styles.assenaAvatar}>👧</div>
            <h2>Bienvenue sur le dashboard {ASSENA_CONFIG.name}</h2>
            <p>Suivez la progression de votre enfant en temps réel</p>
          </div>
        </section>

        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Statistiques</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Modules complétés</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏱️</div>
              <div className={styles.statValue}>0 min</div>
              <div className={styles.statLabel}>Temps d'apprentissage</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Badges obtenus</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statValue}>0%</div>
              <div className={styles.statLabel}>Progression globale</div>
            </div>
          </div>
        </section>

        <section className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>Progression par module</h2>
          <div className={styles.progressList}>
            <p className={styles.comingSoon}>
              Les données de progression apparaîtront ici une fois que votre enfant commencera à utiliser l'application.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

