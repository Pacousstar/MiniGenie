/**
 * Configuration Supabase
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fonction pour obtenir les variables d'environnement (chargées après dotenv)
function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

// Fonction pour créer les clients (appelée après chargement du .env)
function createSupabaseClients() {
  const config = getSupabaseConfig();
  
  const client = config.url && config.anonKey
    ? createClient(config.url, config.anonKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;

  const admin = config.url && config.serviceRoleKey
    ? createClient(config.url, config.serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

  return { client, admin };
}

// Créer les clients (sera réévalué après chargement du .env)
let { client: supabaseClient, admin: supabaseAdmin } = createSupabaseClients();

// Réinitialiser les clients si nécessaire (pour le hot-reload)
export function reinitializeSupabase() {
  const newClients = createSupabaseClients();
  supabaseClient = newClients.client;
  supabaseAdmin = newClients.admin;
}

export { supabaseClient, supabaseAdmin };
