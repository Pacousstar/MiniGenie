# 🧪 Commandes Exactes pour Tests d'Authentification

## ✅ Option 1 : Script Automatique (RECOMMANDÉ)

**Dans un nouveau terminal PowerShell :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
.\test-auth.ps1
```

**OU avec npm :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm run test:auth:ps1
```

---

## ✅ Option 2 : Commandes Manuelles (Copier-Coller)

**Ouvrez un nouveau terminal PowerShell et copiez-collez ces commandes une par une :**

### 1. Aller dans le dossier backend

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
```

---

### 2. Test Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

**Résultat attendu :** `{"status":"ok","message":"MiniGénie Backend API"}`

---

### 3. Test Inscription

```powershell
$body = @{email="test@example.com";password="test123456";name="Parent Test"} | ConvertTo-Json; $response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"; $result = $response.Content | ConvertFrom-Json; $token = $result.accessToken; Write-Host "Token: $token"
```

**OU en plusieurs lignes (plus lisible) :**

```powershell
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$result = $response.Content | ConvertFrom-Json
$token = $result.accessToken
Write-Host "Token obtenu: $($token.Substring(0, 30))..."
```

**⚠️ IMPORTANT : Copiez le token affiché pour les tests suivants !**

---

### 4. Test Profil Utilisateur (Me)

**Remplacez `VOTRE_TOKEN` par le token obtenu à l'étape 3 :**

```powershell
$token = "VOTRE_TOKEN"
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

---

### 5. Test Créer un Enfant

**Remplacez `VOTRE_TOKEN` par votre token :**

```powershell
$token = "VOTRE_TOKEN"
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
Write-Host "Enfant cree avec ID: $childId"
```

**⚠️ IMPORTANT : Copiez l'ID de l'enfant pour le test suivant !**

---

### 6. Test Liste des Enfants

```powershell
$token = "VOTRE_TOKEN"
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

---

### 7. Test Dashboard

**Remplacez `VOTRE_TOKEN` et `ID_ENFANT` :**

```powershell
$token = "VOTRE_TOKEN"
$childId = "ID_ENFANT"
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
```

---

### 8. Test Déconnexion

```powershell
$token = "VOTRE_TOKEN"
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers
$response.Content | ConvertFrom-Json
```

---

## 📝 Script Complet (Tout en Une Fois)

**Copiez-collez ce script complet dans PowerShell :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

Write-Host "=== Test 1 : Health Check ===" -ForegroundColor Cyan
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
Write-Host ""

Write-Host "=== Test 2 : Inscription ===" -ForegroundColor Cyan
$body = @{email="test@example.com";password="test123456";name="Parent Test"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$result = $response.Content | ConvertFrom-Json
$token = $result.accessToken
Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Green
Write-Host ""

Write-Host "=== Test 3 : Me ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== Test 4 : Creer enfant ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$body = @{pseudo="Emma";age=5;level="maternelle_gs"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/child" -Method POST -Headers $headers -Body $body
$child = $response.Content | ConvertFrom-Json
$childId = $child.id
Write-Host "Enfant ID: $childId" -ForegroundColor Green
Write-Host ""

Write-Host "=== Test 5 : Liste enfants ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/children" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== Test 6 : Dashboard ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== Test 7 : Logout ===" -ForegroundColor Cyan
$headers = @{"Authorization" = "Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/logout" -Method POST -Headers $headers
$response.Content | ConvertFrom-Json
Write-Host ""

Write-Host "=== Tous les tests termines ===" -ForegroundColor Green
```

---

## ⚠️ Notes Importantes

1. **Le serveur doit être démarré** dans un autre terminal avec `npm run dev`
2. **Utilisez le script automatique** (`.\test-auth.ps1`) pour éviter les erreurs de copier-coller
3. **Les tokens expirent** - si un test échoue, relancez depuis l'inscription
4. **Les emails doivent être uniques** - si vous testez plusieurs fois, changez l'email

---

*Guide créé par Agent 4*
