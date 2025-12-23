# Script pour vérifier la configuration .env
# Usage: .\VERIFIER_ENV.ps1

$envPath = "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env"

Write-Host "[INFO] Verification du fichier .env" -ForegroundColor Cyan
Write-Host ("=" * 50)
Write-Host ""

# Vérifier si le fichier existe
if (Test-Path $envPath) {
    Write-Host "[OK] Fichier .env trouve" -ForegroundColor Green
    Write-Host "   Chemin: $envPath" -ForegroundColor Gray
    Write-Host ""
    
    # Lire le contenu
    $content = Get-Content $envPath
    
    # Vérifier les variables importantes
    $requiredVars = @("SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY")
    $foundVars = @()
    
    foreach ($line in $content) {
        if ($line -match '^([^#][^=]+)=(.+)$') {
            $varName = $matches[1].Trim()
            $varValue = $matches[2].Trim()
            
            if ($requiredVars -contains $varName) {
                $foundVars += $varName
                $displayValue = if ($varValue.Length -gt 30) { $varValue.Substring(0, 30) + "..." } else { $varValue }
                Write-Host "   [OK] $varName = $displayValue" -ForegroundColor Green
            }
        }
    }
    
    Write-Host ""
    
    # Vérifier si toutes les variables sont présentes
    $missing = $requiredVars | Where-Object { $foundVars -notcontains $_ }
    
    if ($missing.Count -eq 0) {
        Write-Host "[OK] Toutes les variables requises sont presentes !" -ForegroundColor Green
    } else {
        Write-Host "[ERREUR] Variables manquantes:" -ForegroundColor Red
        foreach ($var in $missing) {
            Write-Host "   - $var" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "[INFO] Executez: node create-env.js" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "[ERREUR] Fichier .env non trouve !" -ForegroundColor Red
    Write-Host "   Chemin recherche: $envPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "[INFO] Executez: node create-env.js" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 50)
