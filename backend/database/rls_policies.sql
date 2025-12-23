-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Ces politiques garantissent que les utilisateurs ne peuvent accéder qu'à leurs propres données

-- ============================================
-- Table : children
-- ============================================

-- Politique : Les utilisateurs peuvent voir uniquement leurs propres enfants
CREATE POLICY "Users can view their own children"
  ON children
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer des enfants pour leur compte
CREATE POLICY "Users can create their own children"
  ON children
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres enfants
CREATE POLICY "Users can update their own children"
  ON children
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres enfants
CREATE POLICY "Users can delete their own children"
  ON children
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Table : sessions
-- ============================================

-- Politique : Les utilisateurs peuvent voir les sessions de leurs enfants
CREATE POLICY "Users can view sessions of their children"
  ON sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent créer des sessions pour leurs enfants
CREATE POLICY "Users can create sessions for their children"
  ON sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent mettre à jour les sessions de leurs enfants
CREATE POLICY "Users can update sessions of their children"
  ON sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sessions.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- Table : module_progress
-- ============================================

-- Politique : Les utilisateurs peuvent voir la progression de leurs enfants
CREATE POLICY "Users can view progress of their children"
  ON module_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = module_progress.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent créer/mettre à jour la progression de leurs enfants
CREATE POLICY "Users can manage progress of their children"
  ON module_progress
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = module_progress.child_id
      AND children.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = module_progress.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- Table : badges
-- ============================================

-- Politique : Les utilisateurs peuvent voir les badges de leurs enfants
CREATE POLICY "Users can view badges of their children"
  ON badges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = badges.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent créer des badges pour leurs enfants
CREATE POLICY "Users can create badges for their children"
  ON badges
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = badges.child_id
      AND children.user_id = auth.uid()
    )
  );

-- ============================================
-- Table : sync_queue
-- ============================================

-- Politique : Les utilisateurs peuvent voir leur file de synchronisation
CREATE POLICY "Users can view their sync queue"
  ON sync_queue
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sync_queue.child_id
      AND children.user_id = auth.uid()
    )
  );

-- Politique : Les utilisateurs peuvent gérer leur file de synchronisation
CREATE POLICY "Users can manage their sync queue"
  ON sync_queue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sync_queue.child_id
      AND children.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = sync_queue.child_id
      AND children.user_id = auth.uid()
    )
  );
