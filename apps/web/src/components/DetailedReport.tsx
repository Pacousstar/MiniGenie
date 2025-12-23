'use client';

import React from 'react';
import styles from './DetailedReport.module.css';
import type { DashboardData } from '../services/DataService';

interface DetailedReportProps {
  data: DashboardData;
}

const moduleNames: Record<string, string> = {
  alphabet: 'Alphabet',
  chiffres: 'Chiffres',
  syllabes: 'Syllabes',
  lecture: 'Lecture',
  ecriture: 'Écriture',
  calcul: 'Calcul',
  vocabulaire: 'Vocabulaire',
  famille: 'Famille',
};

/**
 * Composant de rapport détaillé pour les parents
 */
export default function DetailedReport({ data }: DetailedReportProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getLevelLabel = (level: number) => {
    if (level >= 80) return 'Excellent';
    if (level >= 60) return 'Très bien';
    if (level >= 40) return 'Bien';
    if (level >= 20) return 'En progression';
    return 'Débutant';
  };

  const getRecommendation = () => {
    const incompleteModules = Object.values(data.progressByModule)
      .filter((p: any) => !p.completed || p.score < 70)
      .map((p: any) => moduleNames[p.moduleType] || p.moduleType);

    if (incompleteModules.length === 0) {
      return "Félicitations ! Votre enfant progresse très bien dans tous les modules. Continuez à l'encourager !";
    }

    return `Nous recommandons de continuer à pratiquer : ${incompleteModules.join(', ')}.`;
  };

  return (
    <div className={styles.reportContainer}>
      <h2 className={styles.reportTitle}>Rapport détaillé</h2>
      
      <div className={styles.reportSection}>
        <h3 className={styles.sectionTitle}>📊 Vue d'ensemble</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCard}>
            <div className={styles.overviewLabel}>Niveau détecté</div>
            <div className={styles.overviewValue}>{data.userLevel}/100</div>
            <div className={styles.overviewSubtext}>{getLevelLabel(data.userLevel)}</div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewLabel}>Score global</div>
            <div className={styles.overviewValue}>{data.overallScore}%</div>
            <div className={styles.overviewSubtext}>
              {data.overallScore >= 80 ? 'Excellent' : data.overallScore >= 60 ? 'Très bien' : 'En progression'}
            </div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewLabel}>Modules complétés</div>
            <div className={styles.overviewValue}>{data.modulesCompleted}</div>
            <div className={styles.overviewSubtext}>
              sur {Object.keys(data.progressByModule).length} modules
            </div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.overviewLabel}>Badges obtenus</div>
            <div className={styles.overviewValue}>{data.badgesUnlocked}</div>
            <div className={styles.overviewSubtext}>Récompenses</div>
          </div>
        </div>
      </div>

      <div className={styles.reportSection}>
        <h3 className={styles.sectionTitle}>⏱️ Temps d'apprentissage</h3>
        <div className={styles.timeStats}>
          <div className={styles.timeCard}>
            <span className={styles.timeLabel}>Temps total :</span>
            <span className={styles.timeValue}>{data.totalTime} minutes</span>
          </div>
          <div className={styles.timeCard}>
            <span className={styles.timeLabel}>Aujourd'hui :</span>
            <span className={styles.timeValue}>{data.todayTime} minutes</span>
          </div>
          <div className={styles.timeCard}>
            <span className={styles.timeLabel}>Sessions totales :</span>
            <span className={styles.timeValue}>{data.totalSessions}</span>
          </div>
          <div className={styles.timeCard}>
            <span className={styles.timeLabel}>Temps moyen par session :</span>
            <span className={styles.timeValue}>
              {data.totalSessions > 0
                ? Math.round(data.totalTime / data.totalSessions)
                : 0}{' '}
              minutes
            </span>
          </div>
        </div>
      </div>

      <div className={styles.reportSection}>
        <h3 className={styles.sectionTitle}>📚 Détails par module</h3>
        <div className={styles.modulesDetail}>
          {Object.entries(data.progressByModule).map(([moduleId, progress]: [string, any]) => (
            <div key={moduleId} className={styles.moduleDetailCard}>
              <div className={styles.moduleHeader}>
                <h4 className={styles.moduleName}>
                  {moduleNames[progress.moduleType] || progress.moduleType}
                </h4>
                {progress.completed && (
                  <span className={styles.completedBadge}>✓ Complété</span>
                )}
              </div>
              <div className={styles.moduleStats}>
                <div className={styles.moduleStat}>
                  <span className={styles.statLabel}>Score actuel :</span>
                  <span className={styles.statValue}>{progress.score}%</span>
                </div>
                <div className={styles.moduleStat}>
                  <span className={styles.statLabel}>Meilleur score :</span>
                  <span className={styles.statValue}>{progress.bestScore}%</span>
                </div>
                <div className={styles.moduleStat}>
                  <span className={styles.statLabel}>Tentatives :</span>
                  <span className={styles.statValue}>{progress.attempts}</span>
                </div>
                {progress.lastAttempt && (
                  <div className={styles.moduleStat}>
                    <span className={styles.statLabel}>Dernière activité :</span>
                    <span className={styles.statValue}>
                      {formatDate(new Date(progress.lastAttempt))}
                    </span>
                  </div>
                )}
              </div>
              {data.timeByModule[progress.moduleType] && (
                <div className={styles.moduleTime}>
                  Temps passé : {data.timeByModule[progress.moduleType]} minutes
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reportSection}>
        <h3 className={styles.sectionTitle}>💡 Recommandations</h3>
        <div className={styles.recommendationBox}>
          <p className={styles.recommendationText}>{getRecommendation()}</p>
        </div>
      </div>

      <div className={styles.reportSection}>
        <h3 className={styles.sectionTitle}>📅 Activité récente</h3>
        {data.recentSessions.length > 0 ? (
          <div className={styles.activityList}>
            {data.recentSessions.slice(0, 10).map((session, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityModule}>
                  {moduleNames[session.moduleType] || session.moduleType}
                </div>
                <div className={styles.activityDate}>
                  {session.date.toLocaleDateString('fr-FR')} à{' '}
                  {session.date.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className={styles.activityDuration}>{session.duration} min</div>
                {session.score !== undefined && (
                  <div className={styles.activityScore}>Score : {session.score}%</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noActivity}>Aucune activité récente</p>
        )}
      </div>
    </div>
  );
}
