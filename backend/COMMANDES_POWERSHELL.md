# 🪟 Commandes PowerShell pour MiniGénie Backend

## 📋 Commandes de Base

### 1. Aller dans le dossier backend

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
```

**Note :** Les guillemets sont nécessaires à cause des espaces dans le chemin.

---

### 2. Installer les dépendances

```powershell
npm install
```

---

### 3. Créer le fichier .env

```powershell
node create-env.js
```

---

### 4. Démarrer le serveur

```powershell
npm run dev
```

---

### 5. Tester l'authentification (script automatique)

**Dans un nouveau terminal :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm run test:auth
```

---

## 🧪 Tests Manuels avec PowerShell

### Test 1 : Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -ExpandProperty Content
```

---

### Test 2 : Inscription

```powershell
$body = @{
    email = "test@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$json = $response.Content | ConvertFrom-Json
$json | ConvertTo-Json -Depth 10
```

**Pour sauvegarder le token :**

```powershell
$token = $json.accessToken
Write-Host "Token: $token"
```

---

### Test 3 : Créer un enfant

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
$json = $response.Content | ConvertFrom-Json
$json | ConvertTo-Json -Depth 10

# Sauvegarder l'ID de l'enfant
$childId = $json.id
Write-Host "Child ID: $childId"
```

---

### Test 4 : Dashboard

```powershell
$token = "VOTRE_TOKEN_ICI"
$childId = "ID_ENFANT_ICI"
$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/dashboard/$childId" -Method GET -Headers $headers
$json = $response.Content | ConvertFrom-Json
$json | ConvertTo-Json -Depth 10
```

---

## 🔍 Vérifications

### Vérifier que le fichier .env existe

```powershell
Test-Path "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

**Résultat attendu :** `True`

---

### Voir le contenu du .env (sans les valeurs sensibles)

```powershell
Get-Content "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env" | Select-String -Pattern "^[^=]+="
```

---

### Vérifier les variables d'environnement chargées

Dans le code, ajoutez temporairement :

```typescript
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configuré' : '❌ Manquant');
```

---

## 🐛 Dépannage

### Erreur "tsx n'est pas reconnu"

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm install
```

---

### Erreur "Supabase non configuré"

1. Vérifiez que le fichier .env existe :
```powershell
Test-Path "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"
```

2. Si False, créez-le :
```powershell
node create-env.js
```

3. Redémarrez le serveur (Ctrl+C puis `npm run dev`)

---

### Erreur "Cannot find module"

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm install
```

---

## 📝 Script PowerShell Complet

Créez un fichier `test-auth.ps1` :

```powershell
# Test d'authentification MiniGénie
$baseUrl = "http://localhost:3001"

Write-Host "🧪 Tests d'authentification MiniGénie`n"

# 1. Health check
Write-Host "1️⃣  Health check..."
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

# 2. Inscription
Write-Host "`n2️⃣  Inscription..."
$body = @{
    email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    $json = $response.Content | ConvertFrom-Json
    $token = $json.accessToken
    Write-Host "✅ Inscription réussie" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

# 3. Créer un enfant
Write-Host "`n3️⃣  Créer un enfant..."
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    pseudo = "Emma"
    age = 5
    level = "maternelle_gs"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/child" -Method POST -Headers $headers -Body $body
    $json = $response.Content | ConvertFrom-Json
    $childId = $json.id
    Write-Host "✅ Enfant créé: $($json.pseudo)" -ForegroundColor Green
    Write-Host "   Child ID: $childId" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

# 4. Dashboard
Write-Host "`n4️⃣  Dashboard..."
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/dashboard/$childId" -Method GET -Headers $headers
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ Dashboard récupéré" -ForegroundColor Green
    Write-Host "   Enfant: $($json.childName)" -ForegroundColor Gray
    Write-Host "   Score: $($json.overallScore)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Tous les tests réussis ! 🎉`n" -ForegroundColor Green
```

**Exécuter :**

```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
.\test-auth.ps1
```

---

*Guide PowerShell créé par Agent 4*
