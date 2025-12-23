/**
 * Routes pour la progression
 */
import { Router, Request, Response } from 'express';
import { progressService } from '../services/ProgressService';
import { validateUUID, validateProgressData } from '../middleware/validation';
import { authenticate, authorizeChildAccess } from '../middleware/auth';

export const progressRouter = Router();

/**
 * GET /api/progress/:childId
 * Récupérer la progression d'un enfant
 */
progressRouter.get(
  '/:childId',
  authenticate,
  validateUUID('childId'),
  authorizeChildAccess,
  async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const progress = await progressService.getProgress(childId);
    res.json(progress);
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la progression:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

/**
 * PUT /api/progress/:childId/module/:moduleType
 * Mettre à jour la progression d'un module
 */
progressRouter.put(
  '/:childId/module/:moduleType',
  authenticate,
  validateUUID('childId'),
  validateProgressData,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
  try {
    const { childId, moduleType } = req.params;
    const { score, completed } = req.body;
    
    await progressService.updateModuleProgress(childId, moduleType, score, completed);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la progression:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

/**
 * GET /api/progress/:childId/recommendations
 * Obtenir les recommandations de modules
 */
progressRouter.get(
  '/:childId/recommendations',
  authenticate,
  validateUUID('childId'),
  authorizeChildAccess,
  async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const recommendations = await progressService.getRecommendations(childId);
    res.json(recommendations);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});
