// src/contexts/LanguageContext.tsx (À CRÉER)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'fr';
  });

  const availableLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      document.documentElement.lang = lang;
      
      // Force re-render
      window.dispatchEvent(new Event('languagechange'));
      
      console.log(`Langue changée vers : ${lang}`);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
      if (i18n.language !== savedLang) {
        await i18n.changeLanguage(savedLang);
        setCurrentLanguage(savedLang);
        document.documentElement.lang = savedLang;
      }
    };
    
    initLanguage();
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};