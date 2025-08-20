# Script d'internationalisation TraduckXion V2.5
# C:\PROJETS-DEVELOPPEMENT\traduc-clone\update-i18n.ps1

# Configuration
$projectPath = "C:\PROJETS-DEVELOPPEMENT\traduc-clone"
$srcPath = "$projectPath\src"
$localesPath = "$srcPath\locales"
$languages = @("fr", "en", "es", "it", "de")

Write-Host "`n🚀 SCRIPT D'INTERNATIONALISATION TRADUCKXION V2.5" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Créer la structure des dossiers de traduction
Write-Host "`n📁 Création de la structure des traductions..." -ForegroundColor Yellow

foreach ($lang in $languages) {
    $langPath = "$localesPath\$lang"
    if (-not (Test-Path $langPath)) {
        New-Item -ItemType Directory -Path $langPath -Force | Out-Null
        Write-Host "  ✅ Dossier créé: $lang" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️ Dossier existant: $lang" -ForegroundColor Blue
    }
}

# Créer les fichiers JSON de base pour documents.json
Write-Host "`n📄 Création des fichiers documents.json..." -ForegroundColor Yellow

$documentsContent = @{
    "fr" = @'
{
  "title": "Documents TraducXion",
  "subtitle": "Gérez vos fichiers, transcriptions et traductions multilingues",
  "stats": {
    "total": "Total",
    "transcribed": "Transcrits",
    "translated": "Traduits",
    "space": "Espace",
    "precision": "Précision",
    "wer": "WER moy.",
    "audios": "Audios",
    "videos": "Vidéos"
  },
  "upload": {
    "title": "Glissez-déposez vos fichiers ici pour une transcription automatique",
    "formats": "Formats supportés : Audio, Vidéo, PDF, DOCX, TXT • Max 500 MB",
    "button": "Parcourir les fichiers"
  },
  "filters": {
    "search": "Rechercher...",
    "allTypes": "Tous types",
    "allStatus": "Tous statuts",
    "allSectors": "Tous secteurs",
    "allLanguages": "Toutes langues",
    "date": "Date"
  }
}
'@
    "en" = @'
{
  "title": "TraducXion Documents",
  "subtitle": "Manage your files, transcriptions and multilingual translations",
  "stats": {
    "total": "Total",
    "transcribed": "Transcribed",
    "translated": "Translated",
    "space": "Space",
    "precision": "Precision",
    "wer": "Avg. WER",
    "audios": "Audios",
    "videos": "Videos"
  },
  "upload": {
    "title": "Drag and drop your files here for automatic transcription",
    "formats": "Supported formats: Audio, Video, PDF, DOCX, TXT • Max 500 MB",
    "button": "Browse files"
  },
  "filters": {
    "search": "Search...",
    "allTypes": "All types",
    "allStatus": "All statuses",
    "allSectors": "All sectors",
    "allLanguages": "All languages",
    "date": "Date"
  }
}
'@
    "es" = @'
{
  "title": "Documentos TraducXion",
  "subtitle": "Gestiona tus archivos, transcripciones y traducciones multilingües",
  "stats": {
    "total": "Total",
    "transcribed": "Transcritos",
    "translated": "Traducidos",
    "space": "Espacio",
    "precision": "Precisión",
    "wer": "WER prom.",
    "audios": "Audios",
    "videos": "Videos"
  },
  "upload": {
    "title": "Arrastra y suelta tus archivos aquí para transcripción automática",
    "formats": "Formatos soportados: Audio, Video, PDF, DOCX, TXT • Máx 500 MB",
    "button": "Examinar archivos"
  },
  "filters": {
    "search": "Buscar...",
    "allTypes": "Todos los tipos",
    "allStatus": "Todos los estados",
    "allSectors": "Todos los sectores",
    "allLanguages": "Todos los idiomas",
    "date": "Fecha"
  }
}
'@
    "it" = @'
{
  "title": "Documenti TraducXion",
  "subtitle": "Gestisci i tuoi file, trascrizioni e traduzioni multilingue",
  "stats": {
    "total": "Totale",
    "transcribed": "Trascritti",
    "translated": "Tradotti",
    "space": "Spazio",
    "precision": "Precisione",
    "wer": "WER medio",
    "audios": "Audio",
    "videos": "Video"
  },
  "upload": {
    "title": "Trascina qui i tuoi file per la trascrizione automatica",
    "formats": "Formati supportati: Audio, Video, PDF, DOCX, TXT • Max 500 MB",
    "button": "Sfoglia file"
  },
  "filters": {
    "search": "Cerca...",
    "allTypes": "Tutti i tipi",
    "allStatus": "Tutti gli stati",
    "allSectors": "Tutti i settori",
    "allLanguages": "Tutte le lingue",
    "date": "Data"
  }
}
'@
    "de" = @'
{
  "title": "TraducXion Dokumente",
  "subtitle": "Verwalten Sie Ihre Dateien, Transkriptionen und mehrsprachigen Übersetzungen",
  "stats": {
    "total": "Gesamt",
    "transcribed": "Transkribiert",
    "translated": "Übersetzt",
    "space": "Speicher",
    "precision": "Präzision",
    "wer": "Durchschn. WER",
    "audios": "Audios",
    "videos": "Videos"
  },
  "upload": {
    "title": "Ziehen Sie Ihre Dateien hierher für automatische Transkription",
    "formats": "Unterstützte Formate: Audio, Video, PDF, DOCX, TXT • Max 500 MB",
    "button": "Dateien durchsuchen"
  },
  "filters": {
    "search": "Suchen...",
    "allTypes": "Alle Typen",
    "allStatus": "Alle Status",
    "allSectors": "Alle Sektoren",
    "allLanguages": "Alle Sprachen",
    "date": "Datum"
  }
}
'@
}

foreach ($lang in $languages) {
    $filePath = "$localesPath\$lang\documents.json"
    if (-not (Test-Path $filePath)) {
        Set-Content -Path $filePath -Value $documentsContent[$lang] -Encoding UTF8
        Write-Host "  ✅ Créé: $lang/documents.json" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️ Existe déjà: $lang/documents.json" -ForegroundColor Blue
    }
}

# Créer les fichiers JSON pour transcription.json
Write-Host "`n📄 Création des fichiers transcription.json..." -ForegroundColor Yellow

$transcriptionContent = @{
    "fr" = @'
{
  "title": "Éditeur de Transcription IA",
  "precision": "Précision",
  "wer": "WER",
  "duration": "Durée",
  "manual": "Manuel",
  "autoIA": "Auto IA",
  "analyze": "Analyser",
  "save": "Sauvegarder",
  "export": "Exporter",
  "timeline": "Timeline",
  "segments": "Segments",
  "assistant": "Assistant IA",
  "corrections": "Corrections suggérées",
  "templateSector": "Template sectoriel",
  "noCorrections": "Aucune correction suggérée",
  "applyCorrections": "Appliquer les corrections"
}
'@
    "en" = @'
{
  "title": "AI Transcription Editor",
  "precision": "Precision",
  "wer": "WER",
  "duration": "Duration",
  "manual": "Manual",
  "autoIA": "Auto AI",
  "analyze": "Analyze",
  "save": "Save",
  "export": "Export",
  "timeline": "Timeline",
  "segments": "Segments",
  "assistant": "AI Assistant",
  "corrections": "Suggested corrections",
  "templateSector": "Sector template",
  "noCorrections": "No suggested corrections",
  "applyCorrections": "Apply corrections"
}
'@
    "es" = @'
{
  "title": "Editor de Transcripción IA",
  "precision": "Precisión",
  "wer": "WER",
  "duration": "Duración",
  "manual": "Manual",
  "autoIA": "Auto IA",
  "analyze": "Analizar",
  "save": "Guardar",
  "export": "Exportar",
  "timeline": "Línea de tiempo",
  "segments": "Segmentos",
  "assistant": "Asistente IA",
  "corrections": "Correcciones sugeridas",
  "templateSector": "Plantilla sectorial",
  "noCorrections": "Sin correcciones sugeridas",
  "applyCorrections": "Aplicar correcciones"
}
'@
    "it" = @'
{
  "title": "Editor di Trascrizione IA",
  "precision": "Precisione",
  "wer": "WER",
  "duration": "Durata",
  "manual": "Manuale",
  "autoIA": "Auto IA",
  "analyze": "Analizza",
  "save": "Salva",
  "export": "Esporta",
  "timeline": "Timeline",
  "segments": "Segmenti",
  "assistant": "Assistente IA",
  "corrections": "Correzioni suggerite",
  "templateSector": "Template settoriale",
  "noCorrections": "Nessuna correzione suggerita",
  "applyCorrections": "Applica correzioni"
}
'@
    "de" = @'
{
  "title": "KI-Transkriptionseditor",
  "precision": "Präzision",
  "wer": "WER",
  "duration": "Dauer",
  "manual": "Manuell",
  "autoIA": "Auto KI",
  "analyze": "Analysieren",
  "save": "Speichern",
  "export": "Exportieren",
  "timeline": "Zeitleiste",
  "segments": "Segmente",
  "assistant": "KI-Assistent",
  "corrections": "Vorgeschlagene Korrekturen",
  "templateSector": "Branchenvorlage",
  "noCorrections": "Keine vorgeschlagenen Korrekturen",
  "applyCorrections": "Korrekturen anwenden"
}
'@
}

foreach ($lang in $languages) {
    $filePath = "$localesPath\$lang\transcription.json"
    if (-not (Test-Path $filePath)) {
        Set-Content -Path $filePath -Value $transcriptionContent[$lang] -Encoding UTF8
        Write-Host "  ✅ Créé: $lang/transcription.json" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️ Existe déjà: $lang/transcription.json" -ForegroundColor Blue
    }
}

# Vérifier les fichiers React
Write-Host "`n🔍 Analyse des fichiers React..." -ForegroundColor Yellow

$filesToCheck = @(
    "$srcPath\pages\DocumentsPage.tsx",
    "$srcPath\pages\TranscriptionPage.tsx",
    "$srcPath\pages\TranslationPage.tsx",
    "$srcPath\pages\ProjectsPage.tsx",
    "$srcPath\pages\AnalyticsPage.tsx",
    "$srcPath\pages\IntegrationsPage.tsx",
    "$srcPath\components\Dashboard\Dashboard.tsx"
)

$needsUpdate = @()
$alreadyUpdated = @()

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $fileName = Split-Path $file -Leaf
        
        if ($content -match "useTranslation") {
            $alreadyUpdated += $fileName
            Write-Host "  ✅ $fileName - Déjà configuré avec i18n" -ForegroundColor Green
        } else {
            $needsUpdate += $fileName
            Write-Host "  ⚠️ $fileName - Nécessite une mise à jour" -ForegroundColor Yellow
        }
    }
}

# Créer un guide de migration
$guideContent = @"
# GUIDE DE MIGRATION i18n - TraduckXion V2.5

## 📋 FICHIERS À METTRE À JOUR

### 1. DocumentsPage.tsx
\`\`\`tsx
// Ajouter en haut du fichier
import { useTranslation } from 'react-i18next';

// Dans le composant
const DocumentsPage = () => {
  const { t } = useTranslation('documents');
  
  // Remplacer les textes :
  // <h1>Documents TraducXion</h1> → <h1>{t('title')}</h1>
  // <p>Total</p> → <p>{t('stats.total')}</p>
  // <button>Parcourir les fichiers</button> → <button>{t('upload.button')}</button>
}
\`\`\`

### 2. TranscriptionPage.tsx
\`\`\`tsx
// Ajouter en haut du fichier
import { useTranslation } from 'react-i18next';

// Dans le composant
const TranscriptionPage = () => {
  const { t } = useTranslation('transcription');
  
  // Remplacer les textes :
  // "Éditeur de Transcription IA" → {t('title')}
  // "Manuel" → {t('manual')}
  // "Analyser" → {t('analyze')}
  // "Sauvegarder" → {t('save')}
}
\`\`\`

## ✅ FICHIERS DÉJÀ CONFIGURÉS
$($alreadyUpdated -join "`n")

## ⚠️ FICHIERS À MODIFIER
$($needsUpdate -join "`n")
"@

$guidePath = "$projectPath\MIGRATION_GUIDE.md"
Set-Content -Path $guidePath -Value $guideContent -Encoding UTF8

# Rapport final
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    📊 RAPPORT FINAL                        " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📁 Dossiers créés: $($languages.Count)" -ForegroundColor Green
Write-Host "  📄 Fichiers JSON créés: $($languages.Count * 2) (documents + transcription)" -ForegroundColor Green
Write-Host "  ✅ Fichiers React avec i18n: $($alreadyUpdated.Count)" -ForegroundColor Green
Write-Host "  ⚠️ Fichiers React à modifier: $($needsUpdate.Count)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  📖 Guide créé: MIGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n✅ Script terminé avec succès!" -ForegroundColor Green
Write-Host "👉 Consultez MIGRATION_GUIDE.md pour les instructions détaillées" -ForegroundColor Yellow