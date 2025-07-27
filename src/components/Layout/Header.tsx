import React from 'react';
import { Globe, User, Settings, Bell } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'it' as const, name: 'Italiano', flag: '🇮🇹' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TX</span>
            </div>
            <h1 className="text-xl font-bold text-white">TraducXion V2.5</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
              <Globe className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-gray-300">
                {languages.find(l => l.code === currentLanguage)?.flag}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    currentLanguage === lang.code ? 'bg-slate-600' : ''
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm text-gray-300">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;