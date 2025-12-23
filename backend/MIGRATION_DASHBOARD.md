# 🔄 Migration Dashboard : localStorage → Supabase

## ✅ Migration Complétée

Le dashboard web utilise maintenant l'API backend (Supabase) au lieu de localStorage.

---

## 📋 Changements Effectués

### 1. Nouveau Service API (`apps/web/src/services/ApiService.ts`)

Service pour communiquer avec le backend :
- `getDashboardData(childId)` - Récupère les données depuis l'API
- `getUsageStats(childId)` - Statistiques d'utilisation
- `exportCSV(childId)` - Export CSV
- `generatePDFReport(childId)` - Génération rapport PDF

### 2. DataService Mis à Jour (`apps/web/src/services/DataService.ts`)

- **Priorité 1** : Utilise l'API backend si `childId` est disponible
- **Fallback** : Utilise localStorage si l'API n'est pas disponible
- **Défaut** : Retourne des données par défaut

### 3. Configuration Requise

#### Frontend Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (`backend/.env`)

Déjà configuré avec Supabase.

---

## 🔧 Utilisation

### Dans le Dashboard

Le dashboard récupère automatiquement l'ID de l'enfant depuis localStorage et utilise l'API :

```typescript
// Automatique dans page.tsx
const dashboardData = await getDashboardData(childId);
```

### Authentification

Le dashboard doit être authentifié pour accéder aux données :

1. **S'inscrire/Se connecter** via `/api/auth/register` ou `/api/auth/login`
2. **Stocker le token** dans localStorage : `@minigenie:auth_token`
3. **Le service API** utilise automatiquement ce token

---

## 📡 Endpoints Utilisés

- `GET /api/dashboard/:childId` - Données du dashboard
- `GET /api/analytics/child/:childId` - Statistiques d'utilisation
- `GET /api/analytics/export/csv/:childId` - Export CSV
- `GET /api/analytics/export/pdf/:childId` - Rapport PDF

---

## 🔄 Migration Progressive

Le système supporte une **migration progressive** :

1. **Si l'API est disponible** → Utilise Supabase (données en temps réel)
2. **Si l'API n'est pas disponible** → Fallback sur localStorage (données locales)
3. **Si aucune donnée** → Données par défaut

Cela permet de continuer à fonctionner même si le backend n'est pas démarré.

---

## ✅ Avantages

- ✅ **Données en temps réel** depuis Supabase
- ✅ **Synchronisation multi-appareils**
- ✅ **Sauvegarde cloud** automatique
- ✅ **Export de données** (CSV, PDF)
- ✅ **Analytics avancées**

---

*Migration effectuée par Agent 4*
