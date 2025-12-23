/**
 * Middleware d'authentification et autorisation
 */
import { Request, Response, NextFunction } from 'express';
import { supabaseClient, supabaseAdmin } from '../config/supabase';

/**
 * Vérifier l'authentification via Supabase
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant.' });
    }

    const token = authHeader.substring(7);

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Supabase non configuré.' });
    }

    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token invalide ou expiré.' });
    }

    // Ajouter l'utilisateur à la requête
    (req as any).user = user;
    next();
  } catch (error: any) {
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({ error: 'Erreur lors de la vérification de l\'authentification.' });
  }
};

/**
 * Vérifier que l'utilisateur peut accéder aux données d'un enfant
 */
export const authorizeChildAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const childId = req.params.childId || req.body.childId;
    const user = (req as any).user;

    if (!childId) {
      return res.status(400).json({ error: 'childId requis.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase non configuré.' });
    }

    // Vérifier que l'enfant appartient à l'utilisateur
    const { data: child, error } = await supabaseAdmin
      .from('children')
      .select('user_id')
      .eq('id', childId)
      .single();

    if (error || !child) {
      return res.status(404).json({ error: 'Enfant non trouvé.' });
    }

    if (child.user_id !== user.id) {
      return res.status(403).json({ error: 'Accès non autorisé à cet enfant.' });
    }

    next();
  } catch (error: any) {
    console.error('Erreur d\'autorisation:', error);
    return res.status(500).json({ error: 'Erreur lors de la vérification des permissions.' });
  }
};

/**
 * Middleware optionnel pour les endpoints publics
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (supabaseClient) {
        const { data: { user } } = await supabaseClient.auth.getUser(token);
        if (user) {
          (req as any).user = user;
        }
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};
