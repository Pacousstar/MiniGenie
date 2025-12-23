/**
 * Routes pour les sessions d'apprentissage
 */
import { Router, Request, Response } from 'express';
import { sessionService } from '../services/SessionService';
import { validateUUID, validateSessionData, validateDateRange } from '../middleware/validation';
import { authenticate, authorizeChildAccess } from '../middleware/auth';

export const sessionsRouter = Router();

/**
 * GET /api/sessions/:childId
 * Récupérer toutes les sessions d'un enfant
 */
sessionsRouter.get(
  '/:childId',
  authenticate,
  validateUUID('childId'),
  validateDateRange,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.params;
      const { startDate, endDate, moduleType } = req.query;
      
      const sessions = await sessionService.getSessions(childId, {
        startDate: startDate as string,
        endDate: endDate as string,
        moduleType: moduleType as string,
      });
      
      res.json(sessions);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des sessions:', error);
      res.status(500).json({ error: error.message || 'Erreur serveur' });
    }
  }
);

/**
 * POST /api/sessions
 * Créer une nouvelle session
 */
sessionsRouter.post(
  '/',
  authenticate,
  validateSessionData,
  authorizeChildAccess,
  async (req: Request, res: Response) => {
    try {
      const session = await sessionService.createSession(req.body);
      res.status(201).json(session);
    } catch (error: any) {
      console.error('Erreur lors de la création de la session:', error);
      res.status(500).json({ error: error.message || 'Erreur serveur' });
    }
  }
);

/**
 * PUT /api/sessions/:sessionId
 * Mettre à jour une session
 */
sessionsRouter.put(
  '/:sessionId',
  authenticate,
  validateUUID('sessionId'),
  async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await sessionService.updateSession(sessionId, req.body);
    res.json(session);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la session:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

/**
 * GET /api/sessions/:childId/stats
 * Récupérer les statistiques de sessions
 */
sessionsRouter.get(
  '/:childId/stats',
  authenticate,
  validateUUID('childId'),
  authorizeChildAccess,
  async (req: Request, res: Response) => {
  try {
    const { childId } = req.params;
    const stats = await sessionService.getSessionStats(childId);
    res.json(stats);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats de sessions:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});
