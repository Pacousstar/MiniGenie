# Base de données MiniGénie

## Installation

1. Ouvrez Supabase SQL Editor
2. Copiez le contenu de `schema.sql`
3. Collez et exécutez dans Supabase SQL Editor
4. Vérifiez que toutes les tables sont créées

## Structure des tables

### `children`
Profils des enfants utilisateurs

### `sessions`
Sessions d'apprentissage avec durée, score, etc.

### `module_progress`
Progression détaillée par module

### `badges`
Badges débloqués par les enfants

### `sync_queue`
File d'attente pour la synchronisation offline/online

## Vues

### `child_stats`
Vue agrégée des statistiques par enfant

## Sécurité

Row Level Security (RLS) est activé sur toutes les tables.
Les politiques de sécurité seront configurées lors de l'implémentation de l'authentification.
