# 🧪 Guide Simple - Tests d'Authentification

## 📖 Explication : Qu'est-ce qu'un Token ?

**Le token** est comme un "ticket d'entrée" que vous recevez après vous être inscrit. Il permet au serveur de savoir que vous êtes bien connecté.

- **Test 2 (Inscription)** → Vous recevez un token
- **Tests suivants** → Vous utilisez ce token pour prouver votre identité

---

## ✅ Prérequis

**Le serveur doit être démarré** dans un autre terminal :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm run dev
```

Vous devez voir :
```
✅ Fichier .env chargé depuis: ...
🚀 Serveur MiniGénie démarré sur le port 3001
```

---

## 🧪 Test 1 : Health Check (Vérifier que le serveur fonctionne)

### Commande :
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

### Résultat attendu :
```json
{"status":"ok","message":"MiniGénie Backend API"}
```

**✅ Si vous voyez ça, le serveur fonctionne !**

---

## 🧪 Test 2 : Inscription (Créer un compte parent)

### Commande :
```powershell
$body = @{email="test@example.com";password="test123456";name="Parent Test"} | ConvertTo-Json; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"; $result = $response.Content | ConvertFrom-Json; $token = $result.accessToken; Write-Host "VOTRE TOKEN: $token"
```

### Résultat attendu :
```
VOTRE TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3NubHVpeHpjbnN5bnVucWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjUwNDYsImV4cCI6MjA4MTMwMTA0Nn0.CxCvf2V1e_A4tmZ-Pwn6PDe5v4a48zMtAg-h1YCmP7w
```

**⚠️ IMPORTANT : Copiez le token affiché (la longue chaîne qui commence par "eyJ...")**

**💡 Le token est maintenant stocké dans la variable `$token` pour les tests suivants.**

---

## 🧪 Test 3 : Vérifier votre profil (Me)

### Commande :
```powershell
$headers = @{"Authorization" = "Bearer $token"}; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers; $response.Content | ConvertFrom-Json
```

### Résultat attendu :
```json
{
  "id": "uuid-utilisateur",
  "email": "test@example.com",
  "name": "Parent Test"
}
```

**✅ Si vous voyez vos informations, l'authentification fonctionne !**

---

## 🧪 Test 4 : Créer un profil enfant

### Commande :
```powershell
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}; $body = @{pseudo="Emma";age=5;level="maternelle_gs"} | ConvertTo-Json; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/child" -Method POST -Headers $headers -Body $body; $child = $response.Content | ConvertFrom-Json; $childId = $child.id; Write-Host "ID ENFANT: $childId"
```

### Résultat attendu :
```
ID ENFANT: 123e4567-e89b-12d3-a456-426614174000
```

**⚠️ IMPORTANT : Copiez l'ID de l'enfant affiché (l'UUID)**

**💡 L'ID de l'enfant est maintenant stocké dans la variable `$childId`.**

---

## 🧪 Test 5 : Liste de tous vos enfants

### Commande :
```powershell
$headers = @{"Authorization" = "Bearer $token"}; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers; $response.Content | ConvertFrom-Json
```

### Résultat attendu :
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "pseudo": "Emma",
    "age": 5,
    "level": "maternelle_gs",
    "user_id": "...",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**✅ Vous voyez la liste de tous les enfants créés !**

---

## 🧪 Test 6 : Dashboard (Statistiques pour un enfant)

### Commande :
```powershell
$headers = @{"Authorization" = "Bearer $token"}; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers; $response.Content | ConvertFrom-Json
```

### Résultat attendu :
```json
{
  "child": {
    "id": "...",
    "pseudo": "Emma",
    "age": 5,
    ...
  },
  "stats": {
    "totalSessions": 0,
    "overallScore": 0,
    ...
  },
  "recentSessions": [],
  "progress": []
}
```

**✅ Vous voyez les statistiques de l'enfant !**

---

## 🧪 Test 7 : Déconnexion (Logout)

### Commande :
```powershell
$headers = @{"Authorization" = "Bearer $token"}; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers; $response.Content | ConvertFrom-Json
```

### Résultat attendu :
```json
{
  "message": "Déconnexion réussie"
}
```

**✅ Vous êtes déconnecté !**

---

## 📝 Script Complet (Tout en Une Fois)

**Si vous voulez tout tester d'un coup, copiez-collez ce script :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

Write-Host "=== TEST 1 : Health Check ===" -ForegroundColor Cyan
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
Write-Host ""

Write-Host "=== TEST 2 : Inscription ===" -ForegroundColor Cyan
$body = @{email="test@example.com";password="test123456";name="Parent Test"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$result = $response.Content | ConvertFrom-Json
$token = $result.accessToken
Write-Host "TOKEN OBTENU: $($token.Substring(0, 50))..." -ForegroundColor Green
Write-Host ""

Write-Host "=== TEST 3 : Mon Profil ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== TEST 4 : Creer un Enfant ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$body = @{pseudo="Emma";age=5;level="maternelle_gs"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/child" -Method POST -Headers $headers -Body $body
$child = $response.Content | ConvertFrom-Json
$childId = $child.id
Write-Host "ENFANT CREE - ID: $childId" -ForegroundColor Green
Write-Host ""

Write-Host "=== TEST 5 : Liste des Enfants ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== TEST 6 : Dashboard ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== TEST 7 : Deconnexion ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== TOUS LES TESTS TERMINES ===" -ForegroundColor Green
```

---

## ⚠️ Si vous avez une erreur "Supabase non configuré"

**Vérifiez que le serveur a bien chargé le .env :**

1. Dans le terminal du serveur, vous devez voir :
   ```
   ✅ Fichier .env chargé depuis: ...
   ```

2. Si vous ne voyez pas ça, redémarrez le serveur :
   - Appuyez sur `Ctrl + C` pour arrêter
   - Relancez : `npm run dev`

---

## 📚 Résumé

| Test | Action | Commande |
|------|--------|----------|
| 1 | Vérifier le serveur | Health check |
| 2 | S'inscrire | Inscription → **Obtient le TOKEN** |
| 3 | Voir mon profil | Utilise le token |
| 4 | Créer un enfant | Utilise le token → **Obtient l'ID ENFANT** |
| 5 | Liste des enfants | Utilise le token |
| 6 | Dashboard | Utilise le token + ID enfant |
| 7 | Se déconnecter | Utilise le token |

**Le token est obtenu au Test 2 et utilisé pour tous les tests suivants !**

---

*Guide créé par Agent 4*
