# 🔧 Guide de Configuration Supabase pour MiniGénie

## 📋 Étape 1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"** ou **"Sign in"**
3. Connectez-vous avec GitHub, Google, ou créez un compte

---

## 📋 Étape 2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `minigenie` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE BIEN !**)
   - **Region** : Choisissez la région la plus proche (ex: `West US`, `Europe West`)
   - **Pricing Plan** : Free tier est suffisant pour commencer

3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

---

## 📋 Étape 3 : Récupérer les clés API

Une fois le projet créé :

1. Allez dans **Settings** (icône ⚙️ en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez plusieurs informations importantes :

### Informations à récupérer :

1. **Project URL** (ex: `https://xxxxx.supabase.co`)
   - C'est votre `SUPABASE_URL`

2. **anon public** key
   - C'est votre `SUPABASE_ANON_KEY`
   - ⚠️ Cette clé peut être utilisée côté client (mobile/web)

3. **service_role** key (cliquez sur "Reveal" pour la voir)
   - C'est votre `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **NE JAMAIS EXPOSER CETTE CLÉ** - Utilisée uniquement côté serveur

---

## 📋 Étape 4 : Créer les tables de base de données

1. Allez dans **SQL Editor** (icône SQL dans le menu de gauche)
2. Cliquez sur **"New query"**
3. Je vais vous fournir le script SQL complet à exécuter
4. Copiez-collez le script et cliquez sur **"Run"**

---

## 📋 Étape 5 : Configurer les variables d'environnement

Une fois que vous avez toutes les informations :

1. Dans le dossier `backend/`, créez un fichier `.env` (copiez depuis `.env.example`)
2. Remplissez les valeurs :

```env
PORT=3001

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

CORS_ORIGIN=http://localhost:3000

NODE_ENV=development
```

---

## 📋 Étape 6 : Tester la connexion

Une fois tout configuré, je pourrai tester la connexion et finaliser l'intégration.

---

## ✅ Checklist

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Project URL récupéré
- [ ] anon public key récupérée
- [ ] service_role key récupérée
- [ ] Tables créées (script SQL exécuté)
- [ ] Fichier `.env` configuré dans `backend/`

---

## 📝 Informations à me fournir

Une fois que vous avez tout fait, vous pouvez me donner :

1. **Project URL** : `https://xxxxx.supabase.co`
2. **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **service_role key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **ATTENTION** : Ne partagez jamais ces clés publiquement ! Vous pouvez me les donner ici en privé.

---

*Guide créé par Agent 4 - MiniGénie Backend*
