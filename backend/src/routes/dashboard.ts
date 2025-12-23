/**
 * Routes pour le dashboard parent
 */
import { Router, Request, Response } from 'express';
import { dashboardService } from '../services/DashboardService';
import { validateUUID } from '../middleware/validation';
import { authenticate, authorizeChildAccess } from '../middleware/auth';

export const dashboardRouter = Router();

/**
 * GET /api/dashboard/:childId
 * Récupérer les données du dashboard pour un enfant
 */
dashboardRouter.get(
  '/:childId',
  authenticate,
  validateUUID('childId'),
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const data = await dashboardService.getDashboardData(childId);
      res.json(data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données dashboard:', error);
      res.status(500).json({ error: error.message || 'Erreur serveur' });
    }
  }
);

/**
 * GET /api/dashboard/:childId/stats
 * Récupérer les statistiques globales
 */
dashboardRouter.get(
  '/:childId/stats',
  authenticate,
  validateUUID('childId'),
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const stats = await dashboardService.getStats(childId);
      res.json(stats);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats:', error);
      res.status(500).json({ error: error.message || 'Erreur serveur' });
    }
  }
);
