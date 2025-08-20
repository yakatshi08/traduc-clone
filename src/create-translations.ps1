// C:\PROJETS-DEVELOPPEMENT\traduc-clone\src\hooks\usePageTranslation.ts

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export const usePageTranslation = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);
  const location = useLocation();

  useEffect(() => {
    // Forcer le rechargement des traductions au changement de langue
    const handleLanguageChange = () => {
      // Déclencher un re-render de la page
      window.dispatchEvent(new Event('languageChanged'));
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Retourner les fonctions de traduction enrichies
  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: async (lang: string) => {
      await i18n.changeLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  };
};