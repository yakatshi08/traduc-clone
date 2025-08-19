// src/components/Layout/LanguageSelector.tsx (CORRIGÉ)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe, Check } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      setCurrentLanguage(langCode);
      setIsOpen(false);
      
      // Force update de tous les composants
      window.dispatchEvent(new Event('languageChanged'));
      
      console.log(`✅ Langue changée vers: ${langCode}`);
    } catch (error) {
      console.error('❌ Erreur changement langue:', error);
    }
  };

  // Écouter les changements de langue
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all group"
      >
        <Globe className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        <span className="text-xl">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:block">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-20">
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${lang.code === currentLanguage 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                      : 'hover:bg-slate-700 text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {lang.code === currentLanguage && (
                    <Check className="ml-auto w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;