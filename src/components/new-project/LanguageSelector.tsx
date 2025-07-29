import React from 'react';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  sourceLanguage: string;
  targetLanguages: string[];
  onSourceLanguageChange: (lang: string) => void;
  onTargetLanguagesChange: (langs: string[]) => void;
  detectedLanguages?: { fileName: string; language: string }[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  targetLanguages,
  onSourceLanguageChange,
  onTargetLanguagesChange,
}) => {
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const handleTargetToggle = (code: string) => {
    if (targetLanguages.includes(code)) {
      onTargetLanguagesChange(targetLanguages.filter(l => l !== code));
    } else {
      onTargetLanguagesChange([...targetLanguages, code]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-violet-400" />
          Langue source
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => onSourceLanguageChange('auto')}
            className={`p-4 rounded-lg border-2 transition-all ${
              sourceLanguage === 'auto'
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-2xl">🌐</span>
            <p className="text-white mt-2">Auto-détection</p>
          </button>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => onSourceLanguageChange(lang.code)}
              className={`p-4 rounded-lg border-2 transition-all ${
                sourceLanguage === lang.code
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <p className="text-white mt-2">{lang.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Langues cibles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {languages.map(lang => {
            const isSelected = targetLanguages.includes(lang.code);
            const isDisabled = sourceLanguage === lang.code;
            
            return (
              <button
                key={lang.code}
                onClick={() => !isDisabled && handleTargetToggle(lang.code)}
                disabled={isDisabled}
                className={`p-4 rounded-lg border-2 transition-all relative ${
                  isDisabled
                    ? 'border-slate-800 bg-slate-800/50 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <p className="text-white mt-2 text-sm">{lang.name}</p>
                {isSelected && (
                  <Check className="absolute top-2 right-2 w-4 h-4 text-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
