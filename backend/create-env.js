/**
 * Script pour créer le fichier .env
 * Usage: node create-env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# ============================================
# Configuration Backend MiniGénie
# ⚠️ NE JAMAIS COMMITER CE FICHIER
# ============================================

# Port du serveur
PORT=3001

# ============================================
# Supabase Configuration
# ============================================
SUPABASE_URL=https://hpwsnluixzcnsynunqek.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3NubHVpeHpjbnN5bnVucWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjUwNDYsImV4cCI6MjA4MTMwMTA0Nn0.CxCvf2V1e_A4tmZ-Pwn6PDe5v4a48zMtAg-h1YCmP7w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3NubHVpeHpjbnN5bnVucWVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTcyNTA0NiwiZXhwIjoyMDgxMzAxMDQ2fQ.ut6eodsd25_YsYRKPaFxttsvIsbrQvCbQ9JGtvwPUjw

# ============================================
# CORS Configuration
# ============================================
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# ============================================
# Environment
# ============================================
NODE_ENV=development

# ============================================
# API Keys (Optionnel - pour l'IA Assena)
# ============================================
# Au moins une clé API est requise pour activer l'IA
# Si aucune clé n'est fournie, le mode fallback (réponses pré-définies) sera utilisé

# DeepSeek (Recommandé - moins cher)
# DEEPSEEK_API_KEY=your_deepseek_api_key
# DEEPSEEK_MODEL=deepseek-chat (par défaut)

# OpenAI (Alternative)
# OPENAI_API_KEY=your_openai_api_key
# OPENAI_MODEL=gpt-3.5-turbo (par défaut)

# Configuration IA (optionnel)
# AI_MAX_TOKENS=150 (par défaut)
# AI_TEMPERATURE=0.7 (par défaut, 0.0-2.0)
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Fichier .env créé avec succès !');
  console.log('⚠️  Assurez-vous que ce fichier est dans .gitignore');
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error);
  process.exit(1);
}
