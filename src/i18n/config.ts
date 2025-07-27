import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import frCommon from '../locales/fr/common.json';
import frDashboard from '../locales/fr/dashboard.json';

import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';

import esCommon from '../locales/es/common.json';
import esDashboard from '../locales/es/dashboard.json';

import itCommon from '../locales/it/common.json';
import itDashboard from '../locales/it/dashboard.json';

import deCommon from '../locales/de/common.json';
import deDashboard from '../locales/de/dashboard.json';

const resources = {
  fr: {
    common: frCommon,
    dashboard: frDashboard
  },
  en: {
    common: enCommon,
    dashboard: enDashboard
  },
  es: {
    common: esCommon,
    dashboard: esDashboard
  },
  it: {
    common: itCommon,
    dashboard: itDashboard
  },
  de: {
    common: deCommon,
    dashboard: deDashboard
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    ns: ['common', 'dashboard'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;