/**
 * Middleware de sécurité pour protéger l'API
 */
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Configuration Helmet pour les headers de sécurité
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting pour prévenir les attaques DDoS et brute force
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP toutes les 15 minutes
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting strict pour les endpoints d'authentification
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite de 5 tentatives de connexion toutes les 15 minutes
  message: {
    error: 'Trop de tentatives de connexion, veuillez réessayer plus tard.',
  },
  skipSuccessfulRequests: true,
});

/**
 * Rate limiting pour les endpoints de synchronisation
 */
export const syncLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limite de 10 synchronisations par minute
  message: {
    error: 'Trop de synchronisations, veuillez patienter.',
  },
});

/**
 * Validation de l'origine CORS
 */
export const corsValidator = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  next();
};

/**
 * Protection contre les attaques par injection
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Fonction récursive pour nettoyer les objets
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Supprimer les caractères dangereux
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * Validation de la taille des requêtes
 */
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const maxSize = 1024 * 1024; // 1MB
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'La requête est trop volumineuse. Taille maximale : 1MB',
    });
  }

  next();
};

/**
 * Logging sécurisé (sans données sensibles)
 */
export const secureLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
      // Ne pas logger les données sensibles
    };

    // Logger uniquement les erreurs en production
    if (process.env.NODE_ENV === 'production') {
      if (res.statusCode >= 400) {
        console.error('API Error:', logData);
      }
    } else {
      console.log('API Request:', logData);
    }
  });

  next();
};
