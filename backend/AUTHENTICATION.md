# 🔐 Authentification Supabase - MiniGénie

## ✅ Implémentation complète

L'authentification est maintenant entièrement implémentée avec Supabase Auth.

## 📋 Fonctionnalités

### 1. Inscription et Connexion
- ✅ Inscription de parents (`POST /api/auth/register`)
- ✅ Connexion (`POST /api/auth/login`)
- ✅ Déconnexion (`POST /api/auth/logout`)
- ✅ Récupération du profil utilisateur (`GET /api/auth/me`)

### 2. Gestion des enfants
- ✅ Création de profils enfants (`POST /api/auth/child`)
- ✅ Récupération des enfants d'un utilisateur (`GET /api/auth/children`)
- ✅ Liaison automatique enfants-parents

### 3. Sécurité
- ✅ Rate limiting sur les endpoints d'authentification (5 tentatives / 15 min)
- ✅ Validation des données
- ✅ Vérification des permissions (un parent ne peut accéder qu'à ses enfants)
- ✅ Row Level Security (RLS) dans Supabase

## 🚀 Utilisation

### 1. Inscription

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "motdepasse123",
  "name": "Nom du parent"
}
```

Réponse :
```json
{
  "user": {
    "id": "uuid",
    "email": "parent@example.com",
    "name": "Nom du parent"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### 2. Connexion

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "motdepasse123"
}
```

### 3. Créer un profil enfant

```bash
POST /api/auth/child
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "pseudo": "Emma",
  "age": 5,
  "level": "maternelle_gs"
}
```

### 4. Utiliser les endpoints protégés

Tous les endpoints nécessitent maintenant un token d'authentification :

```bash
GET /api/dashboard/:childId
Authorization: Bearer {accessToken}
```

## 🔒 Sécurité Row Level Security (RLS)

Les politiques RLS garantissent que :
- Un parent ne peut voir que ses propres enfants
- Un parent ne peut accéder qu'aux sessions de ses enfants
- Un parent ne peut modifier que la progression de ses enfants

### Activer les politiques RLS

1. Allez dans Supabase Dashboard > SQL Editor
2. Exécutez le fichier `backend/database/rls_policies.sql`
3. Les politiques seront activées automatiquement

## 📝 Mise à jour du schéma

Le schéma de la table `children` a été mis à jour pour inclure `user_id` :

```sql
ALTER TABLE children 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
```

Si vous avez déjà créé la table, exécutez cette commande dans Supabase SQL Editor.

## ⚠️ Important

- **Rate limiting** : 5 tentatives de connexion toutes les 15 minutes
- **Mots de passe** : Minimum 6 caractères
- **Tokens** : Stockez-les de manière sécurisée côté client
- **HTTPS** : Utilisez toujours HTTPS en production

## 🐛 Dépannage

### Erreur "Token invalide"
- Vérifiez que le token est bien inclus dans le header `Authorization: Bearer {token}`
- Vérifiez que le token n'est pas expiré

### Erreur "Accès non autorisé"
- Vérifiez que l'enfant appartient bien à l'utilisateur connecté
- Vérifiez que les politiques RLS sont activées

### Erreur "Enfant non trouvé"
- Vérifiez que l'ID de l'enfant est correct
- Vérifiez que l'enfant existe dans la base de données

---

*Authentification implémentée par Agent 4 - MiniGénie Backend*
