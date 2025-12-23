# 🧪 Tests d'Authentification - Commandes PowerShell Exactes

## ✅ Prérequis

Le serveur doit être démarré et fonctionner :
```
✅ Fichier .env chargé depuis: ...
🚀 Serveur MiniGénie démarré sur le port 3001
```

---

## 📋 Test 1 : Health Check

**Commande :**
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

**Résultat attendu :**
```json
{"status":"ok","message":"MiniGénie Backend API"}
```

---

## 📋 Test 2 : Inscription (Register)

**Commande :**
```powershell
$body = @{email="test@example.com";password="test123456";name="Parent Test"} | ConvertTo-Json; Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**OU en plusieurs lignes (plus lisible) :**
```powershell
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json
```

**Résultat attendu :**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

**⚠️ IMPORTANT : Copiez le `accessToken` pour les tests suivants !**

---

## 📋 Test 3 : Obtenir l'utilisateur (Me)

**Remplacez `VOTRE_TOKEN_ICI` par le token obtenu à l'étape 2 :**

```powershell
$token = "VOTRE_TOKEN_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

**Résultat attendu :**
```json
{
  "id": "...",
  "email": "test@example.com",
  "name": "Parent Test"
}
```

---

## 📋 Test 4 : Créer un profil enfant

**Remplacez `VOTRE_TOKEN_ICI` par votre token :**

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

**Résultat attendu :**
```json
{
  "id": "uuid-de-l-enfant",
  "pseudo": "Emma",
  "age": 5,
  "level": "maternelle_gs",
  ...
}
```

**⚠️ IMPORTANT : Copiez l'`id` de l'enfant pour le test suivant !**

---

## 📋 Test 5 : Obtenir tous les enfants

```powershell
$token = "VOTRE_TOKEN_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

**Résultat attendu :**
```json
[
  {
    "id": "...",
    "pseudo": "Emma",
    "age": 5,
    ...
  }
]
```

---

## 📋 Test 6 : Dashboard (données pour un enfant)

**Remplacez `VOTRE_TOKEN_ICI` et `ID_ENFANT_ICI` :**

```powershell
$token = "VOTRE_TOKEN_ICI"
$childId = "ID_ENFANT_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

**Résultat attendu :**
```json
{
  "child": { ... },
  "stats": { ... },
  "recentSessions": [ ... ],
  "progress": [ ... ]
}
```

---

## 📋 Test 7 : Déconnexion (Logout)

```powershell
$token = "VOTRE_TOKEN_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers
$response.Content | ConvertFrom-Json
```

**Résultat attendu :**
```json
{
  "message": "Déconnexion réussie"
}
```

---

## 🚀 Script Automatique (Recommandé)

**Utilisez le script PowerShell automatique :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
.\test-auth.ps1
```

**OU avec npm :**

```powershell
npm run test:auth:ps1
```

---

## 📝 Exemple Complet (Copier-Coller)

**Dans un nouveau terminal PowerShell :**

```powershell
# Aller dans le dossier backend
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

# Test 1 : Health Check
Write-Host "=== Test 1 : Health Check ===" -ForegroundColor Cyan
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
Write-Host ""

# Test 2 : Inscription
Write-Host "=== Test 2 : Inscription ===" -ForegroundColor Cyan
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$result = $response.Content | ConvertFrom-Json
$token = $result.accessToken
Write-Host "Token obtenu: $($token.Substring(0, 20))..." -ForegroundColor Green
Write-Host ""

# Test 3 : Me
Write-Host "=== Test 3 : Me ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

# Test 4 : Créer enfant
Write-Host "=== Test 4 : Créer enfant ===" -ForegroundColor Cyan
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
$child = $response.Content | ConvertFrom-Json
$childId = $child.id
Write-Host "Enfant créé avec ID: $childId" -ForegroundColor Green
Write-Host ""

# Test 5 : Liste enfants
Write-Host "=== Test 5 : Liste enfants ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

# Test 6 : Dashboard
Write-Host "=== Test 6 : Dashboard ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

# Test 7 : Logout
Write-Host "=== Test 7 : Logout ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== Tous les tests terminés ===" -ForegroundColor Green
```

---

*Guide créé par Agent 4*
