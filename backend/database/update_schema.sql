-- ============================================
-- Mise à jour du schéma pour l'authentification
-- À exécuter si vous avez déjà créé les tables
-- ============================================

-- Ajouter la colonne user_id à la table children
ALTER TABLE children 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Créer l'index pour user_id
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Exécuter ensuite le fichier rls_policies.sql pour créer les politiques
