# Script pour tuer le processus utilisant le port 3001
# Usage: .\KILL_PORT.ps1

$port = 3001

Write-Host "[INFO] Recherche du processus utilisant le port $port..." -ForegroundColor Cyan

# Trouver le processus
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1

if ($process) {
    $pid = $process.OwningProcess
    $processInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
    
    if ($processInfo) {
        Write-Host "[WARN] Processus trouve:" -ForegroundColor Yellow
        Write-Host "   PID: $pid" -ForegroundColor Gray
        Write-Host "   Nom: $($processInfo.ProcessName)" -ForegroundColor Gray
        Write-Host ""
        
        $confirm = Read-Host "Voulez-vous tuer ce processus ? (O/N)"
        
        if ($confirm -eq "O" -or $confirm -eq "o") {
            try {
                Stop-Process -Id $pid -Force
                Write-Host "[OK] Processus tue avec succes !" -ForegroundColor Green
            } catch {
                Write-Host "[ERREUR] Erreur: $_" -ForegroundColor Red
                Write-Host "   Essayez en tant qu'administrateur: taskkill /PID $pid /F" -ForegroundColor Yellow
            }
        } else {
            Write-Host "[ANNULE] Operation annulee" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[WARN] Processus trouve (PID: $pid) mais informations non disponibles" -ForegroundColor Yellow
        Write-Host "   Essayez: taskkill /PID $pid /F" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] Aucun processus n'utilise le port $port" -ForegroundColor Green
}
