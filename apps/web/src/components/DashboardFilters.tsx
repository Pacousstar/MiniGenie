'use client';

import React, { useState } from 'react';
import styles from './DashboardFilters.module.css';

export type FilterPeriod = 'all' | 'today' | 'week' | 'month';
export type FilterModule = 'all' | string;

interface DashboardFiltersProps {
  selectedPeriod: FilterPeriod;
  selectedModule: FilterModule;
  availableModules: string[];
  onPeriodChange: (period: FilterPeriod) => void;
  onModuleChange: (module: FilterModule) => void;
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
 * Composant de filtres pour le dashboard
 */
export default function DashboardFilters({
  selectedPeriod,
  selectedModule,
  availableModules,
  onPeriodChange,
  onModuleChange,
}: DashboardFiltersProps) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Période :</label>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${selectedPeriod === 'all' ? styles.active : ''}`}
            onClick={() => onPeriodChange('all')}
          >
            Tout
          </button>
          <button
            className={`${styles.filterButton} ${selectedPeriod === 'today' ? styles.active : ''}`}
            onClick={() => onPeriodChange('today')}
          >
            Aujourd'hui
          </button>
          <button
            className={`${styles.filterButton} ${selectedPeriod === 'week' ? styles.active : ''}`}
            onClick={() => onPeriodChange('week')}
          >
            Semaine
          </button>
          <button
            className={`${styles.filterButton} ${selectedPeriod === 'month' ? styles.active : ''}`}
            onClick={() => onPeriodChange('month')}
          >
            Mois
          </button>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Module :</label>
        <select
          className={styles.filterSelect}
          value={selectedModule}
          onChange={(e) => onModuleChange(e.target.value as FilterModule)}
        >
          <option value="all">Tous les modules</option>
          {availableModules.map((module) => (
            <option key={module} value={module}>
              {moduleNames[module] || module}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
