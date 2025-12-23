/**
 * Routes d'authentification
 */
import { Router, Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { validateChildData } from '../middleware/validation';
import { authLimiter } from '../middleware/security';

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Inscription d'un parent
 */
authRouter.post(
  '/register',
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
      }

      const result = await authService.register(email, password, name);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de l\'inscription' });
    }
  }
);

/**
 * POST /api/auth/login
 * Connexion d'un parent
 */
authRouter.post(
  '/login',
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      res.status(401).json({ error: error.message || 'Email ou mot de passe incorrect' });
    }
  }
);

/**
 * POST /api/auth/logout
 * Déconnexion
 */
authRouter.post(
  '/logout',
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await authService.logout(token);
      }
      res.json({ message: 'Déconnexion réussie' });
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la déconnexion' });
    }
  }
);

/**
 * GET /api/auth/me
 * Récupérer les informations de l'utilisateur connecté
 */
authRouter.get(
  '/me',
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token d\'authentification manquant.' });
      }

      const token = authHeader.substring(7);
      const user = await authService.getUser(token);
      res.json(user);
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(401).json({ error: error.message || 'Token invalide' });
    }
  }
);

/**
 * POST /api/auth/child
 * Créer un profil enfant pour l'utilisateur connecté
 */
authRouter.post(
  '/child',
  validateChildData,
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token d\'authentification manquant.' });
      }

      const token = authHeader.substring(7);
      const childData = req.body;

      const child = await authService.createChild(token, childData);
      res.status(201).json(child);
    } catch (error: any) {
      console.error('Erreur lors de la création du profil enfant:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la création du profil' });
    }
  }
);

/**
 * GET /api/auth/children
 * Récupérer tous les enfants d'un utilisateur
 */
authRouter.get(
  '/children',
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token d\'authentification manquant.' });
      }

      const token = authHeader.substring(7);
      const children = await authService.getUserChildren(token);
      res.json(children);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des enfants:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération' });
    }
  }
);
