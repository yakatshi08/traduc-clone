# C:\PROJETS-DEVELOPPEMENT\traduc-clone\repair-syntax.ps1

Write-Host "`n🚑 RÉPARATION D'URGENCE - CORRECTION DES ERREURS DE SYNTAXE" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red

$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"

# 1. RESTAURER LES BACKUPS SI DISPONIBLES
Write-Host "`n📋 Recherche des backups..." -ForegroundColor Yellow

$backups = Get-ChildItem -Path $srcPath -Filter "*.backup" -Recurse
if ($backups.Count -gt 0) {
    Write-Host "  ✅ $($backups.Count) backup(s) trouvé(s)" -ForegroundColor Green
    
    Write-Host "`n⚠️ Voulez-vous restaurer les backups ? (y/n): " -NoNewline -ForegroundColor Yellow
    $restore = Read-Host
    
    if ($restore -eq 'y') {
        foreach ($backup in $backups) {
            $originalFile = $backup.FullName -replace '\.backup$', ''
            Copy-Item $backup.FullName $originalFile -Force
            Write-Host "  ✅ Restauré: $(Split-Path $originalFile -Leaf)" -ForegroundColor Green
        }
        
        Write-Host "`n✅ Tous les fichiers ont été restaurés!" -ForegroundColor Green
        Write-Host "👉 Relancez npm run dev" -ForegroundColor Yellow
        exit
    }
}

# 2. CORRIGER MANUELLEMENT LES ERREURS
Write-Host "`n🔧 Correction manuelle des erreurs..." -ForegroundColor Cyan

# Corriger Dashboard.tsx
$dashboardFile = "$srcPath\components\Dashboard\Dashboard.tsx"
if (Test-Path $dashboardFile) {
    Write-Host "  📝 Correction de Dashboard.tsx..." -ForegroundColor Yellow
    
    $content = Get-Content $dashboardFile -Raw
    
    # Rechercher et corriger les erreurs de syntaxe communes
    # Supprimer les lignes dupliquées ou mal formatées
    $content = $content -replace 'Write-Host[^`n]*`n', ''
    $content = $content -replace '✅[^`n]*`n', ''
    $content = $content -replace '\$\w+\s*=', ''
    
    # S'assurer que les hooks sont correctement placés
    if ($content -match "const Dashboard.*?{([^}]*)}") {
        $componentContent = $matches[1]
        
        # Vérifier que le hook i18n est bien formaté
        if ($componentContent -notmatch "const\s*{\s*t\s*}\s*=\s*useTranslation") {
            $content = $content -replace "(const Dashboard[^{]*{)", "`$1`n  const { t } = useTranslation('dashboard');"
        }
    }
    
    Set-Content -Path $dashboardFile -Value $content -Encoding UTF8
    Write-Host "    ✅ Dashboard.tsx corrigé" -ForegroundColor Green
}

# Corriger TranscriptionPage.tsx
$transcriptionFile = "$srcPath\pages\TranscriptionPage.tsx"
if (Test-Path $transcriptionFile) {
    Write-Host "  📝 Correction de TranscriptionPage.tsx..." -ForegroundColor Yellow
    
    $content = Get-Content $transcriptionFile -Raw
    
    # Supprimer les insertions incorrectes
    $content = $content -replace 'Write[^`n]*`n', ''
    $content = $content -replace '✅[^`n]*`n', ''
    
    Set-Content -Path $transcriptionFile -Value $content -Encoding UTF8
    Write-Host "    ✅ TranscriptionPage.tsx corrigé" -ForegroundColor Green
}

Write-Host "`n✅ Corrections appliquées!" -ForegroundColor Green
Write-Host "👉 Relancez npm run dev pour tester" -ForegroundColor Yellow