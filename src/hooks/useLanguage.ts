import { useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'it' | 'es' | 'de';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
    it: 'Dashboard',
    es: 'Panel de control',
    de: 'Dashboard'
  },
  'nav.projects': {
    fr: 'Projets',
    en: 'Projects',
    it: 'Progetti',
    es: 'Proyectos',
    de: 'Projekte'
  },
  'nav.analytics': {
    fr: 'Analytiques',
    en: 'Analytics',
    it: 'Analisi',
    es: 'Analíticas',
    de: 'Analytik'
  },
  'nav.settings': {
    fr: 'Paramètres',
    en: 'Settings',
    it: 'Impostazioni',
    es: 'Configuración',
    de: 'Einstellungen'
  },
  
  // Main content
  'welcome.title': {
    fr: 'Bienvenue sur TraducXion V2.5',
    en: 'Welcome to TraducXion V2.5',
    it: 'Benvenuto in TraducXion V2.5',
    es: 'Bienvenido a TraducXion V2.5',
    de: 'Willkommen bei TraducXion V2.5'
  },
  'welcome.subtitle': {
    fr: 'Plateforme intelligente de transcription et traduction',
    en: 'Intelligent transcription and translation platform',
    it: 'Piattaforma intelligente di trascrizione e traduzione',
    es: 'Plataforma inteligente de transcripción y traducción',
    de: 'Intelligente Transkriptions- und Übersetzungsplattform'
  },
  
  // Buttons
  'button.upload': {
    fr: 'Télécharger un fichier',
    en: 'Upload file',
    it: 'Carica file',
    es: 'Subir archivo',
    de: 'Datei hochladen'
  },
  'button.validate': {
    fr: 'Valider',
    en: 'Validate',
    it: 'Convalida',
    es: 'Validar',
    de: 'Validieren'
  },
  'button.generate': {
    fr: 'Générer XBRL',
    en: 'Generate XBRL',
    it: 'Genera XBRL',
    es: 'Generar XBRL',
    de: 'XBRL generieren'
  },
  
  // Status
  'status.ready': {
    fr: 'Prêt',
    en: 'Ready',
    it: 'Pronto',
    es: 'Listo',
    de: 'Bereit'
  },
  'status.processing': {
    fr: 'En cours',
    en: 'Processing',
    it: 'In elaborazione',
    es: 'Procesando',
    de: 'Verarbeitung'
  },
  'status.completed': {
    fr: 'Terminé',
    en: 'Completed',
    it: 'Completato',
    es: 'Completado',
    de: 'Abgeschlossen'
  },
  'status.error': {
    fr: 'Erreur',
    en: 'Error',
    it: 'Errore',
    es: 'Error',
    de: 'Fehler'
  }
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage] || key;
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('traducxion-language', lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('traducxion-language') as Language;
    if (savedLang && ['fr', 'en', 'it', 'es', 'de'].includes(savedLang)) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  return { currentLanguage, t, changeLanguage };
};