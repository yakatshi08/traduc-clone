# GUIDE DE MIGRATION i18n - TraduckXion V2.5

## 📋 FICHIERS À METTRE À JOUR

### 1. DocumentsPage.tsx
\\\	sx
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
\\\

### 2. TranscriptionPage.tsx
\\\	sx
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
\\\

## ✅ FICHIERS DÉJÀ CONFIGURÉS


## ⚠️ FICHIERS À MODIFIER
DocumentsPage.tsx
TranscriptionPage.tsx
TranslationPage.tsx
ProjectsPage.tsx
AnalyticsPage.tsx
IntegrationsPage.tsx
Dashboard.tsx
