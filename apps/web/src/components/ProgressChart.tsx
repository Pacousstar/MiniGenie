'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './ProgressChart.module.css';

interface ProgressChartProps {
  weeklyProgress: Array<{
    day: string;
    time: number;
    score: number;
  }>;
}

/**
 * Graphique de progression hebdomadaire
 */
export default function ProgressChart({ weeklyProgress }: ProgressChartProps) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Progression de la semaine</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weeklyProgress}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="time"
            stroke="#FF6B35"
            strokeWidth={2}
            name="Temps (min)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="score"
            stroke="#4ECDC4"
            strokeWidth={2}
            name="Score (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
