# 🪟 Guide de Test - PowerShell Windows

## ⚠️ Problème : Fichier .env manquant

Le serveur indique "Supabase non configuré" car le fichier `.env` n'existe pas encore.

---

## 🔧 Solution : Créer le fichier .env

### Étape 1 : Exécuter le script de création

**Dans PowerShell :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
node create-env.js
```

Vous devriez voir :
```
✅ Fichier .env créé avec succès !
```

---

### Étape 2 : Redémarrer le serveur

**Arrêtez le serveur** (Ctrl+C) puis relancez :

```powershell
npm run dev
```

Maintenant vous ne devriez **PAS** voir le message "Supabase non configuré".

---

## 🧪 Tester l'authentification

### Méthode 1 : Script automatique

**Dans un nouveau terminal PowerShell :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm run test:auth
```

---

### Méthode 2 : Avec Invoke-WebRequest (PowerShell)

**Test 1 : Health Check**

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET | Select-Object -ExpandProperty Content
```

**Test 2 : Inscription**

```powershell
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json
```

**Copiez le `accessToken` de la réponse, puis :**

**Test 3 : Créer un enfant**

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

**Copiez l'`id` de l'enfant, puis :**

**Test 4 : Dashboard**

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

### Méthode 3 : Avec curl (si installé)

**Test 1 : Health Check**

```powershell
curl http://localhost:3001/health
```

**Test 2 : Inscription**

```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123456\",\"name\":\"Parent Test\"}'
```

**Note :** Dans PowerShell, utilisez des backticks (`) pour les retours à la ligne, et échappez les guillemets avec `\"`

**Test 3 : Créer un enfant**

```powershell
curl -X POST http://localhost:3001/api/auth/child `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" `
  -H "Content-Type: application/json" `
  -d '{\"pseudo\":\"Emma\",\"age\":5,\"level\":\"maternelle_gs\"}'
```

**Test 4 : Dashboard**

```powershell
curl -X GET http://localhost:3001/api/dashboard/ID_ENFANT_ICI `
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 🐛 Dépannage

### Erreur "Supabase non configuré"

1. Vérifiez que le fichier `.env` existe dans `backend/`
2. Vérifiez le contenu du fichier `.env`
3. Redémarrez le serveur après avoir créé le `.env`

### Vérifier le contenu du .env

```powershell
Get-Content "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

### Erreur "tsx n'est pas reconnu"

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm install
```

---

## ✅ Checklist

- [ ] Fichier `.env` créé (node create-env.js)
- [ ] Serveur redémarré
- [ ] Pas de message "Supabase non configuré"
- [ ] Health check fonctionne
- [ ] Inscription fonctionne
- [ ] Création d'enfant fonctionne
- [ ] Dashboard accessible

---

*Guide PowerShell créé par Agent 4*
