# 🚀 Démarrage Rapide - PowerShell

## ✅ Le fichier .env a été créé !

Maintenant, suivez ces étapes :

---

## 📋 Étape 1 : Redémarrer le serveur

**Dans le terminal où le serveur tourne :**

1. Arrêtez le serveur : `Ctrl + C`
2. Redémarrez :

```powershell
npm run dev
```

**Vous devriez maintenant voir :**
```
✅ Configuration Supabase chargée
🚀 Serveur MiniGénie démarré sur le port 3001
```

**Si vous voyez encore "Supabase non configuré"**, vérifiez :

```powershell
Test-Path "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

Doit retourner `True`

---

## 🧪 Étape 2 : Tester l'authentification

### Option A : Script PowerShell (Recommandé)

**Dans un nouveau terminal PowerShell :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
.\test-auth.ps1
```

**OU avec npm :**

```powershell
npm run test:auth:ps1
```

---

### Option B : Script Node.js

```powershell
npm run test:auth
```

---

### Option C : Tests manuels

**1. Health Check :**

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

**2. Inscription :**

```powershell
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json
```

**Copiez le `accessToken` de la réponse.**

**3. Créer un enfant :**

```powershell
$token = "VOTRE_TOKEN_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    pseudo = "Emma"
    age = 5
    level = "maternelle_gs"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/child" -Method POST -Headers $headers -Body $body
$response.Content | ConvertFrom-Json
```

**Copiez l'`id` de l'enfant.**

**4. Dashboard :**

```powershell
$token = "VOTRE_TOKEN_ICI"
$childId = "ID_ENFANT_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

---

## 🐛 Si ça ne fonctionne toujours pas

### Vérifier le contenu du .env

```powershell
Get-Content "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

**Vous devriez voir :**
```
SUPABASE_URL=https://hpwsnluixzcnsynunqek.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Recréer le .env si nécessaire

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
node create-env.js
```

---

## ✅ Checklist

- [ ] Fichier .env créé
- [ ] Serveur redémarré
- [ ] Message "✅ Configuration Supabase chargée" visible
- [ ] Health check fonctionne
- [ ] Tests d'authentification réussis

---

*Guide créé par Agent 4*
