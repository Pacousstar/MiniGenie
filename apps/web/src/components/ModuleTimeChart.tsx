'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './ModuleTimeChart.module.css';

interface ModuleTimeChartProps {
  timeByModule: Record<string, number>;
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
 * Graphique du temps passé par module
 */
export default function ModuleTimeChart({ timeByModule }: ModuleTimeChartProps) {
  const data = Object.entries(timeByModule)
    .map(([moduleType, time]) => ({
      module: moduleNames[moduleType] || moduleType,
      temps: time,
    }))
    .sort((a, b) => b.temps - a.temps);

  if (data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Temps par module</h3>
        <p className={styles.emptyMessage}>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Temps passé par module</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="module" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="temps" fill="#FF6B35" name="Temps (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
