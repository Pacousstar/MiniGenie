/**
 * Routes pour la synchronisation offline/online
 */
import { Router, Request, Response } from 'express';
import { syncService } from '../services/SyncService';

export const syncRouter = Router();

/**
 * POST /api/sync/push
 * Pousser les données locales vers le serveur
 */
syncRouter.post('/push', async (req: Request, res: Response) => {
  try {
    const { childId, data } = req.body;
    const result = await syncService.pushData(childId, data);
    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la synchronisation push:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

/**
 * POST /api/sync/pull
 * Récupérer les données du serveur
 */
syncRouter.post('/pull', async (req: Request, res: Response) => {
  try {
    const { childId, lastSync } = req.body;
    const data = await syncService.pullData(childId, lastSync);
    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la synchronisation pull:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

/**
 * POST /api/sync/conflict
 * Résoudre un conflit de synchronisation
 */
syncRouter.post('/conflict', async (req: Request, res: Response) => {
  try {
    const { childId, conflictData } = req.body;
    const result = await syncService.resolveConflict(childId, conflictData);
    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la résolution de conflit:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});
