# 🔧 Dépannage - Problèmes Courants

## ❌ Problème 1 : "Supabase non configuré" alors que .env existe

### Cause
Le fichier `.env` n'est pas chargé correctement par dotenv.

### Solution

**1. Vérifier que le fichier .env existe :**

```powershell
Test-Path "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

**2. Vérifier le contenu :**

```powershell
.\VERIFIER_ENV.ps1
```

**3. Si le fichier n'existe pas ou est incorrect, recréer :**

```powershell
node create-env.js
```

**4. Redémarrer le serveur :**

```powershell
# Arrêter (Ctrl+C)
npm run dev
```

---

## ❌ Problème 2 : "EADDRINUSE: address already in use :::3001"

### Cause
Un autre processus utilise déjà le port 3001.

### Solution

**1. Trouver le processus qui utilise le port 3001 :**

```powershell
netstat -ano | findstr :3001
```

Vous verrez quelque chose comme :
```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12345
```

Le dernier nombre (12345) est le PID du processus.

**2. Tuer le processus :**

```powershell
taskkill /PID 12345 /F
```

**Remplacez 12345 par le PID que vous avez trouvé.**

**3. OU changer le port dans .env :**

Éditez le fichier `.env` et changez :
```
PORT=3002
```

Puis redémarrez le serveur.

---

## ✅ Vérification Rapide

**Script PowerShell pour tout vérifier :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

# 1. Vérifier .env
Write-Host "1. Vérification .env..." -ForegroundColor Yellow
.\VERIFIER_ENV.ps1

# 2. Vérifier le port
Write-Host "`n2. Vérification port 3001..." -ForegroundColor Yellow
$port = netstat -ano | findstr :3001
if ($port) {
    Write-Host "⚠️  Port 3001 déjà utilisé" -ForegroundColor Red
    Write-Host "   Utilisez: netstat -ano | findstr :3001" -ForegroundColor Yellow
    Write-Host "   Puis: taskkill /PID <PID> /F" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 3001 disponible" -ForegroundColor Green
}
```

---

*Guide de dépannage créé par Agent 4*
