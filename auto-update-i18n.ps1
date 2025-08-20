# C:\PROJETS-DEVELOPPEMENT\traduc-clone\auto-update-i18n.ps1

Write-Host "`n🚀 MISE À JOUR AUTOMATIQUE i18n - TRADUCKXION V2.5" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"

# Fonction principale de mise à jour
function Update-ReactComponentComplete {
    param(
        [string]$FilePath,
        [string]$Namespace
    )
    
    $fileName = Split-Path $FilePath -Leaf
    Write-Host "`n📝 Traitement de $fileName..." -ForegroundColor Yellow
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "  ❌ Fichier non trouvé!" -ForegroundColor Red
        return $false
    }
    
    # Créer un backup
    $backupPath = "$FilePath.backup"
    if (-not (Test-Path $backupPath)) {
        Copy-Item $FilePath $backupPath
        Write-Host "  📋 Backup créé" -ForegroundColor Gray
    }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $modified = $false
    
    # 1. AJOUTER L'IMPORT i18next
    if ($content -notmatch "import.*useTranslation.*from.*'react-i18next'") {
        Write-Host "  ➕ Ajout de l'import i18n..." -ForegroundColor Cyan
        
        # Chercher le dernier import React
        if ($content -match "(import React[^;]*;)") {
            $reactImport = $matches[0]
            $newImport = "$reactImport`nimport { useTranslation } from 'react-i18next';"
            $content = $content -replace [regex]::Escape($reactImport), $newImport
            $modified = $true
            Write-Host "    ✅ Import ajouté après React" -ForegroundColor Green
        }
        # Sinon chercher n'importe quel import
        elseif ($content -match "(import [^;]+;)[\r\n]") {
            $lastImport = $matches[1]
            $newImport = "$lastImport`nimport { useTranslation } from 'react-i18next';"
            $content = $content -replace [regex]::Escape($lastImport), $newImport
            $modified = $true
            Write-Host "    ✅ Import ajouté" -ForegroundColor Green
        }
    } else {
        Write-Host "  ✓ Import déjà présent" -ForegroundColor Green
    }
    
    # 2. AJOUTER LE HOOK useTranslation
    if ($content -notmatch "useTranslation\(['\`"]$Namespace['\`"]\)") {
        Write-Host "  ➕ Ajout du hook useTranslation..." -ForegroundColor Cyan
        
        # Pattern pour trouver le début du composant
        $componentPatterns = @(
            "const\s+$([System.IO.Path]::GetFileNameWithoutExtension($fileName))[^=]*=\s*\(\)\s*=>\s*\{",
            "const\s+$([System.IO.Path]::GetFileNameWithoutExtension($fileName)):\s*React\.FC\s*=\s*\(\)\s*=>\s*\{",
            "function\s+$([System.IO.Path]::GetFileNameWithoutExtension($fileName))\s*\(\)\s*\{",
            "export\s+default\s+function[^{]*\{"
        )
        
        foreach ($pattern in $componentPatterns) {
            if ($content -match $pattern) {
                $componentStart = $matches[0]
                $hookLine = "`n  const { t } = useTranslation('$Namespace');"
                $replacement = "$componentStart$hookLine"
                $content = $content -replace [regex]::Escape($componentStart), $replacement
                $modified = $true
                Write-Host "    ✅ Hook ajouté" -ForegroundColor Green
                break
            }
        }
    } else {
        Write-Host "  ✓ Hook déjà présent" -ForegroundColor Green
    }
    
    # 3. REMPLACER LES TEXTES HARDCODÉS
    Write-Host "  🔄 Remplacement des textes hardcodés..." -ForegroundColor Cyan
    $replacements = Get-TextReplacements -Namespace $Namespace
    $replacedCount = 0
    
    foreach ($original in $replacements.Keys) {
        $translationKey = $replacements[$original]
        
        # Différents patterns de remplacement
        $patterns = @(
            @{Pattern = ">$original<"; Replacement = ">{t('$translationKey')}<"},
            @{Pattern = "`"$original`""; Replacement = "{t('$translationKey')}"},
            @{Pattern = "'$original'"; Replacement = "{t('$translationKey')}"},
            @{Pattern = "placeholder=`"$original`""; Replacement = "placeholder={t('$translationKey')}"},
            @{Pattern = "title=`"$original`""; Replacement = "title={t('$translationKey')}"},
            @{Pattern = "label=`"$original`""; Replacement = "label={t('$translationKey')}"}
        )
        
        foreach ($p in $patterns) {
            if ($content -match [regex]::Escape($p.Pattern)) {
                $content = $content -replace [regex]::Escape($p.Pattern), $p.Replacement
                $replacedCount++
                $modified = $true
            }
        }
    }
    
    if ($replacedCount -gt 0) {
        Write-Host "    ✅ $replacedCount texte(s) remplacé(s)" -ForegroundColor Green
    } else {
        Write-Host "    ℹ️ Aucun texte à remplacer" -ForegroundColor Blue
    }
    
    # 4. SAUVEGARDER SI MODIFIÉ
    if ($modified) {
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        Write-Host "  💾 Fichier sauvegardé avec succès!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ℹ️ Aucune modification nécessaire" -ForegroundColor Blue
        return $false
    }
}

# Fonction pour obtenir les remplacements selon le namespace
function Get-TextReplacements {
    param([string]$Namespace)
    
    $replacements = @{}
    
    switch ($Namespace) {
        "documents" {
            $replacements = @{
                "Documents TraducXion" = "title"
                "Gérez vos fichiers, transcriptions et traductions multilingues" = "subtitle"
                "Total" = "stats.total"
                "Transcrits" = "stats.transcribed"
                "Traduits" = "stats.translated"
                "Espace" = "stats.space"
                "Précision" = "stats.precision"
                "WER moy." = "stats.wer"
                "Audios" = "stats.audios"
                "Vidéos" = "stats.videos"
                "Parcourir les fichiers" = "upload.button"
                "Glissez-déposez vos fichiers ici pour une transcription automatique" = "upload.title"
                "Rechercher..." = "filters.search"
                "Tous types" = "filters.allTypes"
                "Tous statuts" = "filters.allStatus"
                "Tous secteurs" = "filters.allSectors"
                "Toutes langues" = "filters.allLanguages"
                "Date" = "filters.date"
            }
        }
        "transcription" {
            $replacements = @{
                "Éditeur de Transcription IA" = "title"
                "Transcription" = "title"
                "Précision" = "precision"
                "WER" = "wer"
                "Durée" = "duration"
                "Manuel" = "manual"
                "Auto IA" = "autoIA"
                "Analyser" = "analyze"
                "Sauvegarder" = "save"
                "Exporter" = "export"
                "Timeline" = "timeline"
                "Segments" = "segments"
                "Assistant IA" = "assistant"
                "Corrections suggérées" = "corrections"
                "Template sectoriel" = "templateSector"
                "Aucune correction suggérée" = "noCorrections"
                "Appliquer les corrections" = "applyCorrections"
            }
        }
        "translation" {
            $replacements = @{
                "Traduction" = "title"
                "Interface de traduction" = "subtitle"
                "Traduire" = "translate"
                "Langue source" = "sourceLanguage"
                "Langue cible" = "targetLanguage"
                "Texte original" = "originalText"
                "Texte traduit" = "translatedText"
                "Historique" = "history"
                "Glossaire" = "glossary"
                "Sauvegarder" = "save"
                "Exporter" = "export"
                "Copier" = "copy"
                "Coller" = "paste"
            }
        }
        "projects" {
            $replacements = @{
                "Projets" = "title"
                "Mes projets" = "title"
                "Nouveau projet" = "newProject"
                "Rechercher" = "search"
                "Filtrer" = "filter"
                "Tous les projets" = "allProjects"
                "En cours" = "inProgress"
                "Terminés" = "completed"
                "Archivés" = "archived"
                "Créer" = "create"
                "Modifier" = "edit"
                "Supprimer" = "delete"
                "Partager" = "share"
            }
        }
        "analytics" {
            $replacements = @{
                "Analytique" = "title"
                "Tableau de bord analytique" = "subtitle"
                "Statistiques" = "statistics"
                "Performance" = "performance"
                "Utilisation" = "usage"
                "Tendances" = "trends"
                "Exporter" = "export"
                "Période" = "period"
                "Cette semaine" = "thisWeek"
                "Ce mois" = "thisMonth"
                "Cette année" = "thisYear"
            }
        }
        "integrations" {
            $replacements = @{
                "Intégrations" = "title"
                "Connectez vos outils" = "subtitle"
                "Connecter" = "connect"
                "Déconnecter" = "disconnect"
                "Configurer" = "configure"
                "Actif" = "active"
                "Inactif" = "inactive"
                "Google Drive" = "googleDrive"
                "Dropbox" = "dropbox"
                "OneDrive" = "oneDrive"
                "Slack" = "slack"
                "Teams" = "teams"
            }
        }
        "dashboard" {
            $replacements = @{
                "Tableau de bord" = "title"
                "Dashboard" = "title"
                "Vue d'ensemble" = "overview"
                "Activité récente" = "recentActivity"
                "Statistiques" = "statistics"
                "Projets actifs" = "activeProjects"
                "Minutes utilisées" = "minutesUsed"
                "Espace utilisé" = "storageUsed"
                "Notifications" = "notifications"
                "Voir tout" = "viewAll"
                "Actualiser" = "refresh"
            }
        }
        default {
            $replacements = @{
                "Sauvegarder" = "common.save"
                "Annuler" = "common.cancel"
                "Supprimer" = "common.delete"
                "Modifier" = "common.edit"
                "Ajouter" = "common.add"
                "Rechercher" = "common.search"
                "Filtrer" = "common.filter"
                "Exporter" = "common.export"
                "Importer" = "common.import"
            }
        }
    }
    
    return $replacements
}

# LISTE DES COMPOSANTS À METTRE À JOUR
$components = @(
    @{Path = "$srcPath\pages\DocumentsPage.tsx"; Namespace = "documents"},
    @{Path = "$srcPath\pages\TranscriptionPage.tsx"; Namespace = "transcription"},
    @{Path = "$srcPath\pages\TranslationPage.tsx"; Namespace = "translation"},
    @{Path = "$srcPath\pages\ProjectsPage.tsx"; Namespace = "projects"},
    @{Path = "$srcPath\pages\AnalyticsPage.tsx"; Namespace = "analytics"},
    @{Path = "$srcPath\pages\IntegrationsPage.tsx"; Namespace = "integrations"},
    @{Path = "$srcPath\components\Dashboard\Dashboard.tsx"; Namespace = "dashboard"}
)

# EXÉCUTER LA MISE À JOUR
$totalUpdated = 0
$totalSkipped = 0

foreach ($component in $components) {
    $result = Update-ReactComponentComplete -FilePath $component.Path -Namespace $component.Namespace
    if ($result) {
        $totalUpdated++
    } else {
        $totalSkipped++
    }
}

# RAPPORT FINAL
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    ✅ MISE À JOUR TERMINÉE                 " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📊 Composants mis à jour: $totalUpdated" -ForegroundColor Green
Write-Host "  ℹ️ Composants non modifiés: $totalSkipped" -ForegroundColor Blue
Write-Host ""
Write-Host "  💡 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "     1. Exécutez check-i18n-status.ps1 pour vérifier" -ForegroundColor White
Write-Host "     2. Testez l'application avec npm run dev" -ForegroundColor White
Write-Host "     3. Changez la langue dans les paramètres" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Nettoyer les anciens backups si tout s'est bien passé
Write-Host "`n🧹 Nettoyage des backups ? (y/n): " -NoNewline -ForegroundColor Yellow
$cleanup = Read-Host
if ($cleanup -eq 'y') {
    Get-ChildItem -Path $srcPath -Filter "*.backup" -Recurse | Remove-Item
    Write-Host "✅ Backups supprimés" -ForegroundColor Green
}