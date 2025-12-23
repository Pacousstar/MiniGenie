-- ============================================
-- Schéma de base de données MiniGénie
-- ============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table : children (Profils enfants)
-- ============================================
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Lien avec l'utilisateur parent
  pseudo VARCHAR(50) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 3 AND age <= 8),
  level VARCHAR(20) NOT NULL, -- maternelle_ps, maternelle_ms, etc.
  user_level INTEGER DEFAULT 0 CHECK (user_level >= 0 AND user_level <= 100),
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_children_user_level ON children(user_level);
CREATE INDEX IF NOT EXISTS idx_children_created_at ON children(created_at);

-- ============================================
-- Table : sessions (Sessions d'apprentissage)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  module_id VARCHAR(50) NOT NULL,
  module_type VARCHAR(50) NOT NULL, -- alphabet, chiffres, etc.
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- en secondes
  score INTEGER CHECK (score >= 0 AND score <= 100),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_sessions_child_id ON sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_sessions_module_type ON sessions(module_type);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_child_module ON sessions(child_id, module_type);

-- ============================================
-- Table : module_progress (Progression par module)
-- ============================================
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  module_type VARCHAR(50) NOT NULL,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
  last_attempt TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, module_type)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_module_progress_child_id ON module_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_type ON module_progress(module_type);
CREATE INDEX IF NOT EXISTS idx_module_progress_completed ON module_progress(completed);

-- ============================================
-- Table : badges (Badges obtenus)
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL, -- alphabet_master, numbers_expert, etc.
  badge_name VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, badge_type)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_badges_child_id ON badges(child_id);
CREATE INDEX IF NOT EXISTS idx_badges_badge_type ON badges(badge_type);

-- ============================================
-- Table : sync_queue (File d'attente de synchronisation)
-- ============================================
CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  operation_type VARCHAR(20) NOT NULL, -- create, update, delete
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, synced, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_sync_queue_child_id ON sync_queue(child_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_created_at ON sync_queue(created_at);

-- ============================================
-- Fonction : Mettre à jour updated_at automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) - Sécurité
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (à ajuster selon vos besoins d'authentification)
-- Pour l'instant, on permet l'accès via service_role (backend)
-- Vous pourrez ajouter des politiques plus strictes plus tard

-- ============================================
-- Vues utiles pour les statistiques
-- ============================================

-- Vue : Statistiques par enfant
CREATE OR REPLACE VIEW child_stats AS
SELECT 
  c.id,
  c.pseudo,
  c.user_level,
  c.overall_score,
  COUNT(DISTINCT s.id) as total_sessions,
  COALESCE(SUM(s.duration), 0) / 60 as total_time_minutes,
  COUNT(DISTINCT mp.module_type) as modules_attempted,
  COUNT(DISTINCT CASE WHEN mp.completed = true THEN mp.module_type END) as modules_completed,
  COUNT(DISTINCT b.id) as badges_unlocked
FROM children c
LEFT JOIN sessions s ON s.child_id = c.id
LEFT JOIN module_progress mp ON mp.child_id = c.id
LEFT JOIN badges b ON b.child_id = c.id
GROUP BY c.id, c.pseudo, c.user_level, c.overall_score;

-- ============================================
-- Fin du schéma
-- ============================================
