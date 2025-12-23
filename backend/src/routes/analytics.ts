/**
 * Routes pour les analytics et exports
 */
import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/AnalyticsService';
import { exportService } from '../services/ExportService';
import { authenticate, authorizeChildAccess } from '../middleware/auth';
import { apiLimiter } from '../middleware/security';

export const analyticsRouter = Router();

/**
 * GET /api/analytics/global
 * Analytics globales (admin uniquement pour l'instant)
 */
analyticsRouter.get(
  '/global',
  authenticate,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const analytics = await analyticsService.getGlobalAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des analytics:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération' });
    }
  }
);

/**
 * GET /api/analytics/child/:childId
 * Statistiques d'utilisation pour un enfant
 */
analyticsRouter.get(
  '/child/:childId',
  authenticate,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const stats = await analyticsService.getChildUsageStats(childId);
      res.json(stats);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des stats:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération' });
    }
  }
);

/**
 * GET /api/analytics/export/csv/:childId
 * Exporter les données en CSV
 */
analyticsRouter.get(
  '/export/csv/:childId',
  authenticate,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const csv = await exportService.exportToCSV(childId, start, end);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="minigenie-export-${childId}-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error: any) {
      console.error('Erreur lors de l\'export CSV:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de l\'export' });
    }
  }
);

/**
 * GET /api/analytics/export/pdf/:childId
 * Générer un rapport PDF (retourne les données structurées)
 */
analyticsRouter.get(
  '/export/pdf/:childId',
  authenticate,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const reportData = await exportService.generatePDFReport(childId);
      const textSummary = exportService.generateTextSummary(reportData);

      res.json({
        ...reportData,
        textSummary,
      });
    } catch (error: any) {
      console.error('Erreur lors de la génération du rapport PDF:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération' });
    }
  }
);
