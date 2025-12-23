/**
 * Routes API principales
 */
import { Router } from 'express';
import { dashboardRouter } from './dashboard';
import { sessionsRouter } from './sessions';
import { progressRouter } from './progress';
import { syncRouter } from './sync';
import { authRouter } from './auth';
import { aiRouter } from './ai';
import { analyticsRouter } from './analytics';

export const router = Router();

// Routes principales
router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);
router.use('/sessions', sessionsRouter);
router.use('/progress', progressRouter);
router.use('/sync', syncRouter);
router.use('/ai', aiRouter);
router.use('/analytics', analyticsRouter);

// Route de test
router.get('/', (req, res) => {
  res.json({
    message: 'MiniGénie API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      sessions: '/api/sessions',
      progress: '/api/progress',
      sync: '/api/sync',
      ai: '/api/ai',
      analytics: '/api/analytics',
    },
  });
});
