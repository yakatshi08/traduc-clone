import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import frCommon from '../locales/fr/common.json';
import frDashboard from '../locales/fr/dashboard.json';
import frProjects from '../locales/fr/projects.json';
import frNewProject from '../locales/fr/newProject.json'; // Ajouté

import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enProjects from '../locales/en/projects.json';
import enNewProject from '../locales/en/newProject.json'; // Ajouté

import esCommon from '../locales/es/common.json';
import esDashboard from '../locales/es/dashboard.json';
import esProjects from '../locales/es/projects.json';
import esNewProject from '../locales/es/newProject.json'; // Ajouté

import itCommon from '../locales/it/common.json';
import itDashboard from '../locales/it/dashboard.json';
import itProjects from '../locales/it/projects.json';
import itNewProject from '../locales/it/newProject.json'; // Ajouté

import deCommon from '../locales/de/common.json';
import deDashboard from '../locales/de/dashboard.json';
import deProjects from '../locales/de/projects.json';
import deNewProject from '../locales/de/newProject.json'; // Ajouté

const resources = {
  fr: {
    common: frCommon,
    dashboard: frDashboard,
    projects: frProjects,
    newProject: frNewProject // Ajouté
  },
  en: {
    common: enCommon,
    dashboard: enDashboard,
    projects: enProjects,
    newProject: enNewProject // Ajouté
  },
  es: {
    common: esCommon,
    dashboard: esDashboard,
    projects: esProjects,
    newProject: esNewProject // Ajouté
  },
  it: {
    common: itCommon,
    dashboard: itDashboard,
    projects: itProjects,
    newProject: itNewProject // Ajouté
  },
  de: {
    common: deCommon,
    dashboard: deDashboard,
    projects: deProjects,
    newProject: deNewProject // Ajouté
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    ns: ['common', 'dashboard', 'projects', 'newProject'], // Modifié
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Forcer le chargement de la langue sauvegardée ou FR par défaut
const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
i18n.changeLanguage(savedLanguage);

export default i18n;