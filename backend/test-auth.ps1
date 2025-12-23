# Test d'authentification MiniGénie
# Usage: .\test-auth.ps1

$baseUrl = "http://localhost:3001"

Write-Host "[TEST] Tests d'authentification MiniGenie" -ForegroundColor Cyan
Write-Host ("=" * 50)
Write-Host ""

# 1. Health check
Write-Host "1️⃣  Health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -ErrorAction Stop
    $health = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le serveur est démarré (npm run dev)" -ForegroundColor Yellow
    exit 1
}

# 2. Inscription
Write-Host "`n[2/6] Inscription..." -ForegroundColor Yellow
$email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$body = @{
    email = $email
    password = "test123456"
    name = "Parent Test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    $token = $json.accessToken
    
    if (-not $token) {
        throw "Pas de token reçu"
    }
    
    Write-Host "✅ Inscription réussie" -ForegroundColor Green
    Write-Host "   Email: $email" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Détails: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# 3. Profil utilisateur
Write-Host "`n[3/6] Profil utilisateur..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers -ErrorAction Stop
    $user = $response.Content | ConvertFrom-Json
    Write-Host "[OK] Profil recupere: $($user.email)" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Erreur: $_" -ForegroundColor Red
    exit 1
}

# 4. Créer un enfant
Write-Host "`n[4/6] Creer un enfant..." -ForegroundColor Yellow
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
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/child" -Method POST -Headers $headers -Body $body -ErrorAction Stop
    $json = $response.Content | ConvertFrom-Json
    $childId = $json.id
    
    if (-not $childId) {
        throw "Pas d'ID d'enfant reçu"
    }
    
    Write-Host "[OK] Enfant cree: $($json.pseudo)" -ForegroundColor Green
    Write-Host "   Child ID: $childId" -ForegroundColor Gray
} catch {
    Write-Host "[ERREUR] Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Détails: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# 5. Liste des enfants
Write-Host "`n[5/6] Liste des enfants..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/children" -Method GET -Headers $headers -ErrorAction Stop
    $children = $response.Content | ConvertFrom-Json
    Write-Host "[OK] Enfants recuperes: $($children.Count)" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Erreur: $_" -ForegroundColor Red
    exit 1
}

# 6. Dashboard
Write-Host "`n[6/6] Dashboard..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/dashboard/$childId" -Method GET -Headers $headers -ErrorAction Stop
    $dashboard = $response.Content | ConvertFrom-Json
    Write-Host "✅ Dashboard récupéré" -ForegroundColor Green
    Write-Host "   Enfant: $($dashboard.childName)" -ForegroundColor Gray
    Write-Host "   Score: $($dashboard.overallScore)" -ForegroundColor Gray
    Write-Host "   Sessions: $($dashboard.totalSessions)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Détails: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host ("=" * 50)
Write-Host "[OK] Tous les tests reussis !" -ForegroundColor Green
Write-Host ""
