/**
 * Middleware de validation des données
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Validation des UUID
 */
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuid || !uuidRegex.test(uuid)) {
      return res.status(400).json({
        error: `Paramètre ${paramName} invalide. UUID requis.`,
      });
    }

    next();
  };
};

/**
 * Validation des données d'enfant
 */
export const validateChildData = (req: Request, res: Response, next: NextFunction) => {
  const { pseudo, age, level } = req.body;

  if (!pseudo || typeof pseudo !== 'string' || pseudo.trim().length === 0) {
    return res.status(400).json({ error: 'Le pseudo est requis et doit être une chaîne non vide.' });
  }

  if (pseudo.length > 50) {
    return res.status(400).json({ error: 'Le pseudo ne peut pas dépasser 50 caractères.' });
  }

  if (age !== undefined) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 8) {
      return res.status(400).json({ error: "L'âge doit être un nombre entre 3 et 8." });
    }
  }

  if (level && typeof level !== 'string') {
    return res.status(400).json({ error: 'Le niveau doit être une chaîne de caractères.' });
  }

  next();
};

/**
 * Validation des données de session
 */
export const validateSessionData = (req: Request, res: Response, next: NextFunction) => {
  const { childId, moduleType, score } = req.body;

  if (!childId || typeof childId !== 'string') {
    return res.status(400).json({ error: 'childId est requis et doit être une chaîne.' });
  }

  if (!moduleType || typeof moduleType !== 'string') {
    return res.status(400).json({ error: 'moduleType est requis et doit être une chaîne.' });
  }

  const validModules = ['alphabet', 'chiffres', 'syllabes', 'lecture', 'ecriture', 'calcul', 'vocabulaire', 'famille'];
  if (!validModules.includes(moduleType)) {
    return res.status(400).json({ error: `moduleType invalide. Valeurs autorisées : ${validModules.join(', ')}` });
  }

  if (score !== undefined) {
    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      return res.status(400).json({ error: 'Le score doit être un nombre entre 0 et 100.' });
    }
  }

  next();
};

/**
 * Validation des données de progression
 */
export const validateProgressData = (req: Request, res: Response, next: NextFunction) => {
  const { score, completed } = req.body;

  if (score !== undefined) {
    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      return res.status(400).json({ error: 'Le score doit être un nombre entre 0 et 100.' });
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed doit être un booléen.' });
  }

  next();
};

/**
 * Validation des dates
 */
export const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate } = req.query;

  if (startDate && typeof startDate === 'string') {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'startDate invalide. Format attendu : ISO 8601' });
    }
  }

  if (endDate && typeof endDate === 'string') {
    const date = new Date(endDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'endDate invalide. Format attendu : ISO 8601' });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    if (start > end) {
      return res.status(400).json({ error: 'startDate doit être antérieure à endDate.' });
    }
  }

  next();
};
