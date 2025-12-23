# 🔧 Solution aux Problèmes

## ❌ Problème 1 : "Supabase non configuré" alors que .env existe

### ✅ Solution

Le code a été corrigé pour charger le `.env` correctement. **Redémarrez le serveur** :

```powershell
# 1. Arrêtez le serveur (Ctrl+C)

# 2. Vérifiez que .env existe
.\VERIFIER_ENV.ps1

# 3. Redémarrez
npm run dev
```

---

## ❌ Problème 2 : "EADDRINUSE: address already in use :::3001"

### ✅ Solution Rapide

**Option A : Tuer le processus automatiquement**

```powershell
.\KILL_PORT.ps1
```

**Option B : Manuellement**

```powershell
# 1. Trouver le processus
netstat -ano | findstr :3001

# 2. Vous verrez quelque chose comme :
# TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12345
# Le dernier nombre (12345) est le PID

# 3. Tuer le processus (remplacez 12345 par votre PID)
taskkill /PID 12345 /F
```

**Option C : Changer le port**

Éditez `backend/.env` et changez :
```
PORT=3002
```

Puis redémarrez le serveur.

---

## 🚀 Commandes Complètes PowerShell

### Étape 1 : Vérifier et corriger

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

# Vérifier .env
.\VERIFIER_ENV.ps1

# Tuer le processus sur le port 3001
.\KILL_PORT.ps1
```

### Étape 2 : Redémarrer le serveur

```powershell
npm run dev
```

**Vous devriez voir :**
```
✅ Fichier .env chargé depuis: ...
✅ Configuration Supabase chargée
🚀 Serveur MiniGénie démarré sur le port 3001
```

### Étape 3 : Tester

```powershell
# Dans un nouveau terminal
.\test-auth.ps1
```

---

*Guide de solution créé par Agent 4*
