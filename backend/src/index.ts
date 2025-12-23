/**
 * Point d'entrée principal du backend MiniGénie
 * IMPORTANT: Charger dotenv AVANT tous les autres imports
 */
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement EN PREMIER
// Essayer plusieurs chemins possibles
let envPath = path.resolve(process.cwd(), '.env');
let result = dotenv.config({ path: envPath });

// Si pas trouvé, essayer depuis le répertoire parent (backend/.env)
if (result.error) {
  envPath = path.resolve(process.cwd(), '..', '.env');
  result = dotenv.config({ path: envPath });
}

// Si toujours pas trouvé, essayer dans le répertoire backend
if (result.error) {
  envPath = path.resolve(__dirname || process.cwd(), '.env');
  result = dotenv.config({ path: envPath });
}

if (result.error) {
  console.warn('⚠️  Erreur lors du chargement du .env:', result.error.message);
  console.warn(`   Chemin recherché: ${envPath}`);
  console.warn(`   Répertoire courant: ${process.cwd()}`);
} else if (result.parsed) {
  console.log(`✅ Fichier .env chargé depuis: ${envPath}`);
}

// Vérifier que les variables sont chargées
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('⚠️  Variables Supabase non trouvées dans .env');
  console.warn(`   Chemin recherché: ${envPath}`);
  console.warn('   Vérifiez que le fichier .env existe et contient SUPABASE_URL et SUPABASE_ANON_KEY');
  console.warn('   Exécutez: node create-env.js');
  console.warn('   Ou vérifiez avec PowerShell: .\VERIFIER_ENV.ps1');
}

// Réinitialiser Supabase après chargement du .env
import { reinitializeSupabase } from './config/supabase';
reinitializeSupabase();

// Initialiser le service IA si les clés sont disponibles
import { aiService } from './services/AIService';

if (process.env.DEEPSEEK_API_KEY) {
  aiService.initialize({
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '150'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  });
  console.log('✅ Service IA DeepSeek configuré');
} else if (process.env.OPENAI_API_KEY) {
  aiService.initialize({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '150'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  });
  console.log('✅ Service IA OpenAI configuré');
} else {
  console.log('ℹ️  Service IA non configuré - Mode fallback activé');
}

// Maintenant, importer les autres modules (qui utiliseront les variables d'environnement)
import express from 'express';
import cors from 'cors';
import { router as apiRouter } from './routes/api';
import {
  securityHeaders,
  apiLimiter,
  sanitizeInput,
  requestSizeLimiter,
  secureLogger,
  corsValidator,
} from './middleware/security';

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// SÉCURITÉ - Middleware de protection
// ============================================

// Headers de sécurité (Helmet)
app.use(securityHeaders);

// CORS strict
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(corsValidator);

// Limitation de la taille des requêtes
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestSizeLimiter);

// Sanitization des entrées (protection injection)
app.use(sanitizeInput);

// Logging sécurisé
app.use(secureLogger);

// Rate limiting global
app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRouter);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MiniGénie Backend API' });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur MiniGénie démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

// Gestion des erreurs de port
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Erreur: Le port ${PORT} est déjà utilisé`);
    console.error('   Solution 1: Arrêtez l\'autre processus utilisant le port 3001');
    console.error('   Solution 2: Changez le PORT dans le fichier .env');
    console.error('');
    console.error('   Pour trouver le processus:');
    console.error('   Windows: netstat -ano | findstr :3001');
    console.error('   Puis tuez-le: taskkill /PID <PID> /F');
  } else {
    console.error('❌ Erreur serveur:', error);
  }
  process.exit(1);
});

export default app;
