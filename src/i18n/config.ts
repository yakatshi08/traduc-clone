// src/i18n/config.ts (VERSION CORRIGÉE)

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import frCommon from '../locales/fr/common.json';
import frDashboard from '../locales/fr/dashboard.json';
import frProjects from '../locales/fr/projects.json';
import frNewProject from '../locales/fr/newProject.json';
import frAudios from '../locales/fr/audios.json';
import frVideos from '../locales/fr/videos.json';
import frSettings from '../locales/fr/settings.json';

import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enProjects from '../locales/en/projects.json';
import enNewProject from '../locales/en/newProject.json';
import enAudios from '../locales/en/audios.json';
import enVideos from '../locales/en/videos.json';
import enSettings from '../locales/en/settings.json';

import esCommon from '../locales/es/common.json';
import esDashboard from '../locales/es/dashboard.json';
import esProjects from '../locales/es/projects.json';
import esNewProject from '../locales/es/newProject.json';
import esAudios from '../locales/es/audios.json';
import esVideos from '../locales/es/videos.json';
import esSettings from '../locales/es/settings.json';

import itCommon from '../locales/it/common.json';
import itDashboard from '../locales/it/dashboard.json';
import itProjects from '../locales/it/projects.json';
import itNewProject from '../locales/it/newProject.json';
import itAudios from '../locales/it/audios.json';
import itVideos from '../locales/it/videos.json';
import itSettings from '../locales/it/settings.json';

import deCommon from '../locales/de/common.json';
import deDashboard from '../locales/de/dashboard.json';
import deProjects from '../locales/de/projects.json';
import deNewProject from '../locales/de/newProject.json';
import deAudios from '../locales/de/audios.json';
import deVideos from '../locales/de/videos.json';
import deSettings from '../locales/de/settings.json';

const resources = {
  fr: {
    common: frCommon,
    dashboard: frDashboard,
    projects: frProjects,
    newProject: frNewProject,
    audios: frAudios,
    videos: frVideos,
    settings: frSettings
  },
  en: {
    common: enCommon,
    dashboard: enDashboard,
    projects: enProjects,
    newProject: enNewProject,
    audios: enAudios,
    videos: enVideos,
    settings: enSettings
  },
  es: {
    common: esCommon,
    dashboard: esDashboard,
    projects: esProjects,
    newProject: esNewProject,
    audios: esAudios,
    videos: esVideos,
    settings: esSettings
  },
  it: {
    common: itCommon,
    dashboard: itDashboard,
    projects: itProjects,
    newProject: itNewProject,
    audios: itAudios,
    videos: itVideos,
    settings: itSettings
  },
  de: {
    common: deCommon,
    dashboard: deDashboard,
    projects: deProjects,
    newProject: deNewProject,
    audios: deAudios,
    videos: deVideos,
    settings: deSettings
  }
};

// Récupérer la langue sauvegardée AVANT l'initialisation
const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
console.log('🌍 Initialisation i18n avec langue:', savedLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // ⚠️ IMPORTANT: Forcer la langue dès le début
    fallbackLng: 'fr',
    ns: ['common', 'dashboard', 'projects', 'newProject', 'audios', 'videos', 'settings'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage', // ⚠️ IMPORTANT: Utiliser la bonne clé
      caches: ['localStorage']
    },
    
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    
    debug: true // ⚠️ IMPORTANT: Activer les logs pour debug
  });

// Ajouter un listener pour sauvegarder les changements
i18n.on('languageChanged', (lng) => {
  console.log('✅ Langue changée vers:', lng);
  localStorage.setItem('preferredLanguage', lng);
  document.documentElement.lang = lng;
});

// Exposer i18n globalement pour debug
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
  console.log('🔧 i18n exposé dans window.i18n pour debug');
  console.log('📝 Langues disponibles:', Object.keys(resources));
  console.log('🌍 Langue actuelle:', i18n.language);
}

export default i18n;