'use client';

import React, { useEffect, useState } from 'react';
import { ASSENA_CONFIG } from '@minigenie/shared';
import styles from './page.module.css';
import DashboardStats from '../components/DashboardStats';
import { getDashboardData, type DashboardData } from '../services/DataService';

/**
 * Dashboard Parent - Page d'accueil
 */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
      setLoading(false);
    };
    
    loadData();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>Aucune donnée disponible. Votre enfant doit d'abord utiliser l'application mobile.</p>
        </div>
      </div>
    );
  }

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
            <p>Suivez la progression de <strong>{data.childName}</strong> en temps réel</p>
            <div className={styles.levelInfo}>
              <span>Niveau détecté : {data.userLevel}/100</span>
              <span>Score global : {data.overallScore}%</span>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Statistiques</h2>
          <DashboardStats data={data} />
        </section>

        <section className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>Progression par module</h2>
          <div className={styles.progressList}>
            {Object.keys(data.progressByModule).length === 0 ? (
              <p className={styles.comingSoon}>
                Les données de progression apparaîtront ici une fois que votre enfant commencera à utiliser l'application.
              </p>
            ) : (
              <div className={styles.modulesGrid}>
                {Object.entries(data.progressByModule).map(([moduleId, progress]: [string, any]) => (
                  <div key={moduleId} className={styles.moduleProgressCard}>
                    <h3>{getModuleName(progress.moduleType || moduleId)}</h3>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress.score || 0}%` }}
                      />
                    </div>
                    <div className={styles.progressInfo}>
                      <span>Score : {progress.score || 0}%</span>
                      <span>Tentatives : {progress.attempts || 0}</span>
                      {progress.completed && <span className={styles.completed}>✓ Complété</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {data.recentSessions.length > 0 && (
          <section className={styles.sessionsSection}>
            <h2 className={styles.sectionTitle}>Sessions récentes</h2>
            <div className={styles.sessionsList}>
              {data.recentSessions.map((session, index) => (
                <div key={index} className={styles.sessionCard}>
                  <div className={styles.sessionModule}>{getModuleName(session.moduleType)}</div>
                  <div className={styles.sessionDate}>
                    {session.date.toLocaleDateString('fr-FR')} à {session.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className={styles.sessionDuration}>{session.duration} min</div>
                  {session.score !== undefined && (
                    <div className={styles.sessionScore}>Score : {session.score}%</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function getModuleName(moduleType: string): string {
  const names: Record<string, string> = {
    alphabet: 'Alphabet',
    chiffres: 'Chiffres',
    syllabes: 'Syllabes',
    lecture: 'Lecture',
    ecriture: 'Écriture',
    calcul: 'Calcul',
    vocabulaire: 'Vocabulaire',
    famille: 'Famille',
  };
  return names[moduleType] || moduleType;
}

