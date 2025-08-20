# fix-all-i18n.ps1 - Script de correction finale i18n

Write-Host "`n🔥 CORRECTION FINALE i18n - TRADUCKXION V2.5" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta

$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"

# Fonction pour corriger TranscriptionPage
function Fix-TranscriptionPage {
    $file = "$srcPath\pages\TranscriptionPage.tsx"
    Write-Host "`n📝 Correction de TranscriptionPage.tsx..." -ForegroundColor Yellow
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Ajouter le hook si manquant
        if ($content -notmatch "const\s*{\s*t\s*}\s*=\s*useTranslation") {
            if ($content -match "(const\s+\[isPlaying[^{]*useState)") {
                $firstState = $matches[0]
                $hookLine = "  const { t } = useTranslation('transcription');`n  "
                $content = $content -replace [regex]::Escape($firstState), "$hookLine$firstState"
                Write-Host "  ✅ Hook ajouté" -ForegroundColor Green
            }
        }
        
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "  ✅ TranscriptionPage corrigé" -ForegroundColor Green
    }
}

# Fonction pour corriger Dashboard
function Fix-Dashboard {
    $file = "$srcPath\components\Dashboard\Dashboard.tsx"
    Write-Host "`n📝 Correction de Dashboard.tsx..." -ForegroundColor Yellow
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Ajouter le hook si manquant
        if ($content -notmatch "const\s*{\s*t\s*}\s*=\s*useTranslation") {
            if ($content -match "(const\s+Dashboard[^{]*{)") {
                $componentStart = $matches[0]
                $hookLine = "`n  const { t } = useTranslation('dashboard');`n"
                $content = $content -replace [regex]::Escape($componentStart), "$componentStart$hookLine"
                Write-Host "  ✅ Hook ajouté" -ForegroundColor Green
            }
        }
        
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "  ✅ Dashboard corrigé" -ForegroundColor Green
    }
}

# Fonction pour remplacer tous les textes hardcodés
function Replace-HardcodedTexts {
    param([string]$FilePath, [string]$Namespace)
    
    if (-not (Test-Path $FilePath)) {
        return
    }
    
    $fileName = Split-Path $FilePath -Leaf
    Write-Host "`n🔄 Remplacement des textes dans $fileName..." -ForegroundColor Cyan
    
    $content = Get-Content $FilePath -Raw
    $replacements = 0
    
    # Liste des remplacements communs
    $commonReplacements = @{
        ">Tableau de bord<" = ">{t('title')}<"
        ">Dashboard<" = ">{t('title')}<"
        ">Analytique<" = ">{t('title')}<"
        ">Statistiques<" = ">{t('statistics')}<"
        ">Performance<" = ">{t('performance')}<"
        ">Exporter<" = ">{t('export')}<"
        ">Sauvegarder<" = ">{t('save')}<"
        ">Annuler<" = ">{t('cancel')}<"
        ">Modifier<" = ">{t('edit')}<"
        ">Supprimer<" = ">{t('delete')}<"
        ">Ajouter<" = ">{t('add')}<"
        ">Rechercher<" = ">{t('search')}<"
        ">Filtrer<" = ">{t('filter')}<"
        ">Actualiser<" = ">{t('refresh')}<"
        ">Voir tout<" = ">{t('viewAll')}<"
    }
    
    foreach ($old in $commonReplacements.Keys) {
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $commonReplacements[$old]
            $replacements++
        }
    }
    
    if ($replacements -gt 0) {
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        Write-Host "  ✅ $replacements texte(s) remplacé(s)" -ForegroundColor Green
    }
}

# EXÉCUTION DES CORRECTIONS
Write-Host "`n🚀 Démarrage des corrections..." -ForegroundColor Cyan

# 1. Corriger les hooks manquants
Fix-TranscriptionPage
Fix-Dashboard

# 2. Remplacer les textes dans tous les fichiers
$files = @(
    "$srcPath\pages\DocumentsPage.tsx",
    "$srcPath\pages\TranscriptionPage.tsx",
    "$srcPath\pages\TranslationPage.tsx",
    "$srcPath\pages\ProjectsPage.tsx",
    "$srcPath\pages\AnalyticsPage.tsx",
    "$srcPath\pages\IntegrationsPage.tsx",
    "$srcPath\pages\SettingsPage.tsx",
    "$srcPath\components\Dashboard\Dashboard.tsx"
)

foreach ($file in $files) {
    $namespace = switch (Split-Path $file -Leaf) {
        "DocumentsPage.tsx" { "documents" }
        "TranscriptionPage.tsx" { "transcription" }
        "TranslationPage.tsx" { "translation" }
        "ProjectsPage.tsx" { "projects" }
        "AnalyticsPage.tsx" { "analytics" }
        "IntegrationsPage.tsx" { "integrations" }
        "SettingsPage.tsx" { "settings" }
        "Dashboard.tsx" { "dashboard" }
        default { "common" }
    }
    
    Replace-HardcodedTexts -FilePath $file -Namespace $namespace
}

Write-Host "`n✅ CORRECTIONS TERMINÉES!" -ForegroundColor Green
Write-Host "👉 Relancez check-i18n-status.ps1 pour vérifier" -ForegroundColor Yellow