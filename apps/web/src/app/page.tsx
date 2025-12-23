'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ASSENA_CONFIG } from '@minigenie/shared';
import styles from './page.module.css';
import DashboardStats from '../components/DashboardStats';
import ProgressChart from '../components/ProgressChart';
import ModuleTimeChart from '../components/ModuleTimeChart';
import DashboardFilters, { type FilterPeriod, type FilterModule } from '../components/DashboardFilters';
import DetailedReport from '../components/DetailedReport';
import { getDashboardData, type DashboardData } from '../services/DataService';

/**
 * Dashboard Parent - Page d'accueil
 */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('all');
  const [selectedModule, setSelectedModule] = useState<FilterModule>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Récupérer l'ID de l'enfant depuis localStorage si disponible
        let childId: string | undefined;
        if (typeof window !== 'undefined' && window.localStorage) {
          const profileData = localStorage.getItem('@minigenie:child_profile');
          if (profileData) {
            const profile = JSON.parse(profileData);
            childId = profile.id;
          }
        }
        
        const dashboardData = await getDashboardData(childId);
        setData(dashboardData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, charger les données par défaut
        const defaultData = await getDashboardData();
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtrer les données selon les filtres sélectionnés
  const filteredData = useMemo(() => {
    if (!data) return null;

    let filtered = { ...data };

    // Filtrer par période
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered.recentSessions = data.recentSessions.filter((session) => {
        return new Date(session.date) >= filterDate;
      });

      filtered.weeklyProgress = data.weeklyProgress.filter((progress) => {
        // Pour la semaine, on garde les 7 derniers jours
        return true;
      });
    }

    // Filtrer par module
    if (selectedModule !== 'all') {
      filtered.recentSessions = filtered.recentSessions.filter(
        (session) => session.moduleType === selectedModule
      );
      
      const filteredProgress: Record<string, any> = {};
      Object.entries(filtered.progressByModule).forEach(([key, progress]) => {
        if (progress.moduleType === selectedModule) {
          filteredProgress[key] = progress;
        }
      });
      filtered.progressByModule = filteredProgress;
    }

    return filtered;
  }, [data, selectedPeriod, selectedModule]);

  const availableModules = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(
      Object.values(data.progressByModule).map((p: any) => p.moduleType)
    ));
  }, [data]);

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

  const displayData = filteredData || data;

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
          <DashboardStats data={displayData} />
        </section>

        <section className={styles.filtersSection}>
          <DashboardFilters
            selectedPeriod={selectedPeriod}
            selectedModule={selectedModule}
            availableModules={availableModules}
            onPeriodChange={setSelectedPeriod}
            onModuleChange={setSelectedModule}
          />
        </section>

        {displayData.weeklyProgress.length > 0 && (
          <section className={styles.chartsSection}>
            <ProgressChart weeklyProgress={displayData.weeklyProgress} />
          </section>
        )}

        {Object.keys(displayData.timeByModule).length > 0 && (
          <section className={styles.chartsSection}>
            <ModuleTimeChart timeByModule={displayData.timeByModule} />
          </section>
        )}

        <section className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>Progression par module</h2>
          <div className={styles.progressList}>
            {Object.keys(displayData.progressByModule).length === 0 ? (
              <p className={styles.comingSoon}>
                Les données de progression apparaîtront ici une fois que votre enfant commencera à utiliser l'application.
              </p>
            ) : (
              <div className={styles.modulesGrid}>
                {Object.entries(displayData.progressByModule).map(([moduleId, progress]: [string, any]) => (
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
                      <span>Meilleur : {progress.bestScore || progress.score || 0}%</span>
                      <span>Tentatives : {progress.attempts || 0}</span>
                      {progress.completed && <span className={styles.completed}>✓ Complété</span>}
                    </div>
                    {progress.lastAttempt && (
                      <div className={styles.lastAttempt}>
                        Dernière activité : {new Date(progress.lastAttempt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {displayData.recentSessions.length > 0 && (
          <section className={styles.sessionsSection}>
            <h2 className={styles.sectionTitle}>Sessions récentes</h2>
            <div className={styles.sessionsList}>
              {displayData.recentSessions.map((session, index) => (
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

        <section className={styles.reportSection}>
          <DetailedReport data={displayData} />
        </section>
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

