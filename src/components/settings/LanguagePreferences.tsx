// project/src/components/settings/LanguagePreferences.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguagePreferences: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isSaving, setIsSaving] = useState(false);

  const languages: LanguageOption[] = [
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    // Charger la langue depuis localStorage ou l'API
    const savedLanguage = localStorage.getItem('preferredLanguage') || i18n.language;
    setSelectedLanguage(savedLanguage);
  }, [i18n.language]);

  const handleSaveLanguage = async () => {
    setIsSaving(true);
    
    try {
      // Sauvegarder dans localStorage
      localStorage.setItem('preferredLanguage', selectedLanguage);
      
      // Changer la langue dans i18next
      await i18n.changeLanguage(selectedLanguage);
      
      // TODO: Appel API pour persister côté serveur
      // await api.patch('/me/preferences', { uiLanguage: selectedLanguage });
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'language_changed', {
          from_language: i18n.language,
          to_language: selectedLanguage,
          source: 'settings_preferences'
        });
      }
      
      toast.success(t('settings.language.saveSuccess'));
    } catch (error) {
      console.error('Error saving language preference:', error);
      toast.error(t('settings.language.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('settings.language.title')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('settings.language.description')}
          </p>
        </div>
      </div>

      {/* Sélection de langue */}
      <div className="space-y-3">
        {languages.map((language) => (
          <label
            key={language.code}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedLanguage === language.code
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="language"
                value={language.code}
                checked={selectedLanguage === language.code}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                aria-label={`${t('settings.language.select')} ${language.nativeName}`}
              />
              <span className="text-2xl">{language.flag}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {language.nativeName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language.name}
                </p>
              </div>
            </div>
            {selectedLanguage === language.code && (
              <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </label>
        ))}
      </div>

      {/* Aperçu */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t('settings.language.preview')}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">{t('header.dashboard')}:</span> {t('header.dashboard', { lng: selectedLanguage })}
          </p>
          <p className="text-sm">
            <span className="font-medium">{t('header.settings')}:</span> {t('header.settings', { lng: selectedLanguage })}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('settings.language.currentLanguage')}: <span className="font-medium">{currentLanguage?.nativeName}</span>
        </p>
        
        <button
          onClick={handleSaveLanguage}
          disabled={isSaving || selectedLanguage === i18n.language}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedLanguage === i18n.language
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('settings.language.saving')}
            </>
          ) : (
            t('settings.language.save')
          )}
        </button>
      </div>
    </div>
  );
};

export default LanguagePreferences;