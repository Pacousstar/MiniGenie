# Backend MiniGénie

API backend Node.js pour MiniGénie.

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env` et remplir les variables :

```bash
cp .env.example .env
```

Variables requises :
- `PORT` : Port du serveur (défaut: 3001)
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_ANON_KEY` : Clé anonyme Supabase
- `CORS_ORIGIN` : Origine autorisée pour CORS

## Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

## Build

```bash
npm run build
npm start
```

## Endpoints API

### Dashboard
- `GET /api/dashboard/:childId` - Données du dashboard
- `GET /api/dashboard/:childId/stats` - Statistiques

### Sessions
- `GET /api/sessions/:childId` - Liste des sessions
- `POST /api/sessions` - Créer une session
- `PUT /api/sessions/:sessionId` - Mettre à jour une session
- `GET /api/sessions/:childId/stats` - Statistiques de sessions

### Progression
- `GET /api/progress/:childId` - Progression d'un enfant
- `PUT /api/progress/:childId/module/:moduleType` - Mettre à jour la progression
- `GET /api/progress/:childId/recommendations` - Recommandations

### Synchronisation
- `POST /api/sync/push` - Pousser les données locales
- `POST /api/sync/pull` - Récupérer les données serveur
- `POST /api/sync/conflict` - Résoudre un conflit

## Health Check

```bash
curl http://localhost:3001/health
```
