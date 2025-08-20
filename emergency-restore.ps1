# C:\PROJETS-DEVELOPPEMENT\traduc-clone\emergency-restore.ps1

Write-Host "`n🚨 RESTAURATION D'URGENCE - RÉPARATION COMPLÈTE" -ForegroundColor Red
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red

$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"

# 1. ARRÊTER LE SERVEUR DE DEV SI NÉCESSAIRE
Write-Host "`n⚠️ Assurez-vous que le serveur de dev est arrêté (Ctrl+C dans le terminal npm)" -ForegroundColor Yellow
Write-Host "Appuyez sur Entrée pour continuer..." -ForegroundColor Yellow
Read-Host

# 2. RESTAURER TOUS LES BACKUPS
Write-Host "`n📋 Restauration de tous les fichiers depuis les backups..." -ForegroundColor Cyan

$backups = Get-ChildItem -Path $srcPath -Filter "*.backup" -Recurse
$restored = 0
$failed = 0

if ($backups.Count -eq 0) {
    Write-Host "  ❌ AUCUN BACKUP TROUVÉ !" -ForegroundColor Red
    Write-Host "  💡 Solution : Récupérer depuis Git" -ForegroundColor Yellow
    
    Write-Host "`n📦 Voulez-vous restaurer depuis Git ? (y/n): " -NoNewline -ForegroundColor Yellow
    $gitRestore = Read-Host
    
    if ($gitRestore -eq 'y') {
        # Restaurer depuis Git
        Set-Location $projectPath
        
        # Voir les fichiers modifiés
        Write-Host "`n📝 Fichiers modifiés:" -ForegroundColor Cyan
        git status --short
        
        Write-Host "`n⚠️ ATTENTION: Ceci va annuler TOUTES les modifications locales!" -ForegroundColor Red
        Write-Host "Continuer ? (y/n): " -NoNewline -ForegroundColor Yellow
        $confirm = Read-Host
        
        if ($confirm -eq 'y') {
            # Restaurer les fichiers cassés
            git checkout -- src/pages/IntegrationsPage.tsx
            git checkout -- src/pages/DocumentsPage.tsx
            git checkout -- src/pages/TranscriptionPage.tsx
            git checkout -- src/pages/TranslationPage.tsx
            git checkout -- src/components/Dashboard/Dashboard.tsx
            
            Write-Host "`n✅ Fichiers restaurés depuis Git!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  📦 $($backups.Count) backup(s) trouvé(s)" -ForegroundColor Cyan
    
    foreach ($backup in $backups) {
        $originalFile = $backup.FullName -replace '\.backup$', ''
        $fileName = Split-Path $originalFile -Leaf
        
        try {
            Copy-Item $backup.FullName $originalFile -Force
            Write-Host "  ✅ Restauré: $fileName" -ForegroundColor Green
            $restored++
        } catch {
            Write-Host "  ❌ Échec: $fileName - $_" -ForegroundColor Red
            $failed++
        }
    }
    
    Write-Host "`n📊 Résumé: $restored restauré(s), $failed échec(s)" -ForegroundColor Cyan
}

# 3. NETTOYER LES FICHIERS CORROMPUS (si pas de backup)
Write-Host "`n🧹 Nettoyage des fichiers corrompus..." -ForegroundColor Yellow

$filesToClean = @(
    "$srcPath\pages\IntegrationsPage.tsx",
    "$srcPath\pages\DocumentsPage.tsx",
    "$srcPath\pages\TranscriptionPage.tsx",
    "$srcPath\pages\TranslationPage.tsx",
    "$srcPath\components\Dashboard\Dashboard.tsx"
)

foreach ($file in $filesToClean) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
        
        if ($content -match "Write-Host|Write\s|✅|📝|\$\w+\s*=") {
            Write-Host "  🔧 Nettoyage de $(Split-Path $file -Leaf)..." -ForegroundColor Yellow
            
            # Supprimer les lignes PowerShell injectées
            $lines = Get-Content $file
            $cleanLines = $lines | Where-Object { 
                $_ -notmatch "Write-Host|Write\s|✅|📝|📋|💾|ℹ️|\$\w+\s*=" -and
                $_ -notmatch "ForegroundColor|BackgroundColor" -and
                $_ -notmatch "^\s*#\s*" -and
                $_ -notmatch "Get-Content|Set-Content|Test-Path"
            }
            
            Set-Content -Path $file -Value $cleanLines -Encoding UTF8
            Write-Host "    ✅ Nettoyé" -ForegroundColor Green
        }
    }
}

# 4. VÉRIFIER L'ÉTAT DES FICHIERS
Write-Host "`n🔍 Vérification de l'état des fichiers..." -ForegroundColor Cyan

$errors = 0
foreach ($file in $filesToClean) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
        $fileName = Split-Path $file -Leaf
        
        # Vérifier si le fichier contient encore des erreurs
        if ($content -match "Write-Host|\$\w+\s*=") {
            Write-Host "  ❌ $fileName - Contient encore des erreurs PowerShell" -ForegroundColor Red
            $errors++
        } elseif ($content -match "import React") {
            Write-Host "  ✅ $fileName - Semble correct" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ $fileName - État inconnu" -ForegroundColor Yellow
        }
    }
}

# 5. RAPPORT FINAL
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    📊 RAPPORT DE RESTAURATION              " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host "`n  ✅ SUCCÈS ! Tous les fichiers ont été restaurés" -ForegroundColor Green
    Write-Host "`n  👉 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "     1. Relancez: npm run dev" -ForegroundColor White
    Write-Host "     2. Vérifiez que l'application fonctionne" -ForegroundColor White
    Write-Host "     3. Faites les modifications i18n MANUELLEMENT" -ForegroundColor White
} else {
    Write-Host "`n  ⚠️ ATTENTION ! $errors fichier(s) nécessitent une intervention manuelle" -ForegroundColor Yellow
    Write-Host "`n  💡 Solutions:" -ForegroundColor Cyan
    Write-Host "     1. Restaurer depuis Git: git checkout -- <fichier>" -ForegroundColor White
    Write-Host "     2. Télécharger les fichiers originaux depuis GitHub" -ForegroundColor White
    Write-Host "     3. Recréer les fichiers manuellement" -ForegroundColor White
}

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# 6. SUPPRIMER LES BACKUPS ?
Write-Host "`n🗑️ Voulez-vous supprimer les fichiers .backup ? (y/n): " -NoNewline -ForegroundColor Yellow
$deleteBackups = Read-Host

if ($deleteBackups -eq 'y') {
    Get-ChildItem -Path $srcPath -Filter "*.backup" -Recurse | Remove-Item -Force
    Write-Host "  ✅ Backups supprimés" -ForegroundColor Green
}

Write-Host "`n✅ Restauration terminée!" -ForegroundColor Green