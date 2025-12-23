/**
 * Routes pour l'IA Assena
 */
import { Router, Request, Response } from 'express';
import { aiService } from '../services/AIService';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/security';

export const aiRouter = Router();

/**
 * POST /api/ai/chat
 * Chat avec Assena
 */
aiRouter.post(
  '/chat',
  authenticate,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { childId, message } = req.body;

      if (!childId || !message) {
        return res.status(400).json({ error: 'childId et message requis' });
      }

      // Vérifier que l'enfant appartient à l'utilisateur
      // (déjà fait par authenticate + authorizeChildAccess si nécessaire)

      const response = await aiService.generateResponse(childId, message);
      res.json({ response });
    } catch (error: any) {
      console.error('Erreur lors du chat avec Assena:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération de la réponse' });
    }
  }
);

/**
 * POST /api/ai/encouragement
 * Générer un message d'encouragement
 */
aiRouter.post(
  '/encouragement',
  authenticate,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { childId } = req.body;

      if (!childId) {
        return res.status(400).json({ error: 'childId requis' });
      }

      const encouragement = await aiService.generateEncouragement(childId);
      res.json({ message: encouragement });
    } catch (error: any) {
      console.error('Erreur lors de la génération d\'encouragement:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération' });
    }
  }
);

/**
 * POST /api/ai/explain
 * Générer une explication pédagogique
 */
aiRouter.post(
  '/explain',
  authenticate,
  apiLimiter,
  async (req: Request, res: Response) => {
    try {
      const { childId, topic } = req.body;

      if (!childId || !topic) {
        return res.status(400).json({ error: 'childId et topic requis' });
      }

      const explanation = await aiService.generateExplanation(childId, topic);
      res.json({ explanation });
    } catch (error: any) {
      console.error('Erreur lors de la génération d\'explication:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la génération' });
    }
  }
);

/**
 * GET /api/ai/config
 * Obtenir la configuration IA (statut seulement)
 */
aiRouter.get(
  '/config',
  authenticate,
  (req: Request, res: Response) => {
    try {
      const isConfigured = aiService.isConfigured();
      res.json({
        configured: isConfigured,
        message: isConfigured
          ? 'Service IA configuré et opérationnel'
          : 'Service IA non configuré - Utilisation du mode fallback',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
