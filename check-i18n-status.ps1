# C:\PROJETS-DEVELOPPEMENT\traduc-clone\check-i18n-status.ps1

Write-Host "`n🔍 VÉRIFICATION DU STATUT i18n - TRADUCKXION V2.5" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"

# 1. VÉRIFIER LES FICHIERS DE TRADUCTION
Write-Host "`n📚 FICHIERS DE TRADUCTION:" -ForegroundColor Yellow
$languages = @("fr", "en", "es", "it", "de")
$namespaces = @("common", "dashboard", "documents", "transcription", "translation", "projects", "settings", "analytics", "integrations")

$totalExpected = $languages.Count * $namespaces.Count
$totalFound = 0

foreach ($lang in $languages) {
    Write-Host "`n  [$lang] " -NoNewline -ForegroundColor Cyan
    $found = 0
    foreach ($ns in $namespaces) {
        $file = "$srcPath\locales\$lang\$ns.json"
        if (Test-Path $file) {
            Write-Host "✓" -NoNewline -ForegroundColor Green
            $found++
            $totalFound++
        } else {
            Write-Host "✗" -NoNewline -ForegroundColor Red
        }
    }
    Write-Host " ($found/$($namespaces.Count))"
}

Write-Host "`n  📊 Total: $totalFound/$totalExpected fichiers JSON" -ForegroundColor $(if ($totalFound -eq $totalExpected) { "Green" } else { "Yellow" })

# 2. VÉRIFIER LES COMPOSANTS REACT
Write-Host "`n📄 COMPOSANTS REACT:" -ForegroundColor Yellow

$componentsToCheck = @(
    @{Path="$srcPath\pages\DocumentsPage.tsx"; Namespace="documents"; Status=""},
    @{Path="$srcPath\pages\TranscriptionPage.tsx"; Namespace="transcription"; Status=""},
    @{Path="$srcPath\pages\TranslationPage.tsx"; Namespace="translation"; Status=""},
    @{Path="$srcPath\pages\ProjectsPage.tsx"; Namespace="projects"; Status=""},
    @{Path="$srcPath\pages\AnalyticsPage.tsx"; Namespace="analytics"; Status=""},
    @{Path="$srcPath\pages\IntegrationsPage.tsx"; Namespace="integrations"; Status=""},
    @{Path="$srcPath\pages\SettingsPage.tsx"; Namespace="settings"; Status=""},
    @{Path="$srcPath\components\Dashboard\Dashboard.tsx"; Namespace="dashboard"; Status=""}
)

$readyCount = 0
$needsUpdateCount = 0
$notFoundCount = 0

foreach ($comp in $componentsToCheck) {
    $fileName = Split-Path $comp.Path -Leaf
    Write-Host "`n  📋 $fileName" -ForegroundColor White
    
    if (Test-Path $comp.Path) {
        $content = Get-Content $comp.Path -Raw
        
        # Vérifier les imports
        $hasImport = $content -match "import.*useTranslation.*from.*'react-i18next'"
        $hasHook = $content -match "useTranslation\(['\`"]$($comp.Namespace)['\`"]\)"
        $hasTexts = $content -match '\{t\([''"`][^''"`]+[''"`]\)\}'
        
        Write-Host "    ├─ Import i18n: " -NoNewline
        if ($hasImport) {
            Write-Host "✓" -ForegroundColor Green
        } else {
            Write-Host "✗ (import manquant)" -ForegroundColor Red
        }
        
        Write-Host "    ├─ Hook useTranslation: " -NoNewline
        if ($hasHook) {
            Write-Host "✓ (namespace: $($comp.Namespace))" -ForegroundColor Green
        } else {
            Write-Host "✗ (hook manquant)" -ForegroundColor Red
        }
        
        Write-Host "    ├─ Utilise t(): " -NoNewline
        if ($hasTexts) {
            Write-Host "✓" -ForegroundColor Green
        } else {
            Write-Host "⚠️ (aucun texte traduit trouvé)" -ForegroundColor Yellow
        }
        
        # Détecter les textes hardcodés en français
        $hardcodedTexts = @()
        if ($content -match '>[^<]*(?:Documents|Transcription|Traduction|Gérez|Parcourir|Analyser|Sauvegarder)[^<]*<') {
            $hardcodedTexts += $matches[0]
        }
        
        Write-Host "    └─ Textes hardcodés: " -NoNewline
        if ($hardcodedTexts.Count -gt 0) {
            Write-Host "⚠️ ($($hardcodedTexts.Count) trouvé(s))" -ForegroundColor Yellow
            $needsUpdateCount++
        } else {
            Write-Host "✓ (aucun)" -ForegroundColor Green
            if ($hasImport -and $hasHook -and $hasTexts) {
                $readyCount++
            }
        }
        
    } else {
        Write-Host "    └─ ❌ Fichier non trouvé!" -ForegroundColor Red
        $notFoundCount++
    }
}

# 3. VÉRIFIER LA CONFIGURATION i18n
Write-Host "`n⚙️ CONFIGURATION i18n:" -ForegroundColor Yellow

$i18nConfig = "$srcPath\i18n\config.ts"
if (Test-Path $i18nConfig) {
    Write-Host "  ✅ Fichier config.ts présent" -ForegroundColor Green
    $configContent = Get-Content $i18nConfig -Raw
    
    foreach ($lang in $languages) {
        if ($configContent -match $lang) {
            Write-Host "    ├─ Langue $lang : ✓" -ForegroundColor Green
        } else {
            Write-Host "    ├─ Langue $lang : ✗" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ❌ Fichier config.ts manquant!" -ForegroundColor Red
}

# 4. RAPPORT FINAL
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    📊 RÉSUMÉ DU STATUT                     " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

$totalComponents = $componentsToCheck.Count
$percentReady = [math]::Round(($readyCount / $totalComponents) * 100)

Write-Host "  🌍 Langues configurées: $($languages -join ', ')" -ForegroundColor White
Write-Host "  📚 Fichiers de traduction: $totalFound/$totalExpected" -ForegroundColor $(if ($totalFound -eq $totalExpected) { "Green" } else { "Yellow" })
Write-Host "  ✅ Composants prêts: $readyCount/$totalComponents ($percentReady%)" -ForegroundColor $(if ($percentReady -eq 100) { "Green" } else { "Yellow" })
Write-Host "  ⚠️ Composants à modifier: $needsUpdateCount" -ForegroundColor $(if ($needsUpdateCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "  ❌ Composants introuvables: $notFoundCount" -ForegroundColor $(if ($notFoundCount -eq 0) { "Green" } else { "Red" })

if ($percentReady -eq 100) {
    Write-Host "`n  🎉 FÉLICITATIONS! Tous les composants sont internationalisés!" -ForegroundColor Green
} else {
    Write-Host "`n  💡 Exécutez auto-update-i18n.ps1 pour corriger automatiquement" -ForegroundColor Yellow
}

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan