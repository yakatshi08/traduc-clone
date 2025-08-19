// src/components/Layout/Header.tsx

import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  FileText,
  Video,
  Cloud,
  Users,
  Sparkles,
  Settings,
  Bell,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Languages,
  Library,
  Music,
  Mic,
  Globe2,
  User,
  LogOut,
  ChevronRight,
  CreditCard
} from 'lucide-react';

// Composant Tooltip (reste identique)
const Tooltip: React.FC<{ text: string; children: React.ReactNode; position?: 'top' | 'bottom' }> = ({ 
  text, 
  children, 
  position = 'bottom' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute ${
          position === 'bottom' 
            ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' 
            : 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
        } px-3 py-1.5 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap z-[9999] shadow-lg border border-gray-700`}>
          {text}
          <div className={`absolute ${
            position === 'bottom' 
              ? 'bottom-full left-1/2 transform -translate-x-1/2' 
              : 'top-full left-1/2 transform -translate-x-1/2'
          } w-0 h-0 border-l-4 border-r-4 ${
            position === 'bottom' 
              ? 'border-b-4 border-l-transparent border-r-transparent border-b-gray-900' 
              : 'border-t-4 border-l-transparent border-r-transparent border-t-gray-900'
          }`} />
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  onTabChange: (tab: string) => void;
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  isMenuOpen, 
  onTabChange,
  activeTab 
}) => {
  const { t, i18n } = useTranslation('common'); // ⚠️ CHANGÉ: Utiliser seulement 'common'
  const { theme, toggleTheme } = useTheme();
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showMediasDropdown, setShowMediasDropdown] = useState(false);
  const [showLanguesDropdown, setShowLanguesDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mediasRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const languesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Forcer le re-render quand la langue change
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Header: Langue changée vers', i18n.language);
      forceUpdate();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mediasRef.current && !mediasRef.current.contains(event.target as Node)) {
        setShowMediasDropdown(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
      if (languesRef.current && !languesRef.current.contains(event.target as Node)) {
        setShowLanguesDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolsItems = [
    { id: 'cloud-integrations', label: 'Cloud & API', icon: Cloud }, // À traduire plus tard
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
  ];

  const mediasItems = [
    { 
      id: 'documents', 
      label: t('navigation.documents', 'Documents'), // ⚠️ CHANGÉ
      icon: FileText,
      description: 'Gérez vos documents',
      color: 'text-blue-500 dark:text-blue-400'
    },
    { 
      id: 'videos', 
      label: t('navigation.videos', 'Vidéos'), // ⚠️ CHANGÉ
      icon: Video,
      description: 'Bibliothèque vidéo',
      color: 'text-purple-500 dark:text-purple-400'
    },
    { 
      id: 'audios', 
      label: t('navigation.audios', 'Audios'), // ⚠️ CHANGÉ
      icon: Music,
      description: 'Fichiers audio',
      color: 'text-green-500 dark:text-green-400'
    }
  ];

  const languesItems = [
    { 
      id: 'transcription', 
      label: 'Transcription', // À traduire plus tard
      icon: Mic,
      description: 'Transcrire audio/vidéo',
      color: 'text-indigo-500 dark:text-indigo-400'
    },
    { 
      id: 'translation', 
      label: 'Traduction', // À traduire plus tard
      icon: Globe2,
      description: 'Traduire du contenu',
      color: 'text-cyan-500 dark:text-cyan-400'
    }
  ];

  const isMediaActive = mediasItems.some(item => item.id === activeTab);
  const isLanguesActive = languesItems.some(item => item.id === activeTab);

  // Gestion de l'état du plan utilisateur
  const [userPlan] = useState('Pro');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 beige:bg-traduc-beige-100 border-b border-traduc-beige-300 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">TX</span>
            </div>
            <span className="text-xl font-bold text-traduc-beige-900 dark:text-white beige:text-traduc-beige-900">
              TraducXion <span className="text-xs font-normal text-traduc-beige-500 dark:text-gray-500 beige:text-traduc-beige-500">V2.5</span>
            </span>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'dashboard' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('navigation.dashboard')}</span> {/* ⚠️ CHANGÉ */}
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'projects' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{t('navigation.projects')}</span> {/* ⚠️ CHANGÉ */}
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'analytics' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('navigation.analytics')}</span> {/* ⚠️ CHANGÉ */}
          </button>

          {/* Menu Langues */}
          <div ref={languesRef} className="relative">
            <button
              onClick={() => setShowLanguesDropdown(!showLanguesDropdown)}
              onMouseEnter={() => setShowLanguesDropdown(true)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                isLanguesActive || showLanguesDropdown
                  ? 'bg-traduc-indigo text-white' 
                  : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t('categories', 'Langues')}</span> {/* ⚠️ CHANGÉ */}
              <ChevronDown className={`w-3 h-3 transition-transform ${showLanguesDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguesDropdown && (
              <div 
                className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-xl border border-traduc-beige-300 dark:border-gray-700 overflow-hidden"
                onMouseLeave={() => setShowLanguesDropdown(false)}
              >
                <div className="py-2">
                  {languesItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setShowLanguesDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-start gap-3 transition-colors ${
                          activeTab === item.id
                            ? 'bg-traduc-beige-200 dark:bg-gray-700'
                            : 'hover:bg-traduc-beige-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-traduc-beige-900 dark:text-white text-sm">
                            {item.label}
                          </div>
                          <div className="text-xs text-traduc-beige-600 dark:text-gray-400 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onTabChange('integrations')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'integrations' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Intégrations</span> {/* À traduire plus tard */}
          </button>

          <div className="h-5 w-px bg-traduc-beige-300 dark:bg-gray-700 mx-1" />

          {/* Menu Médias */}
          <div ref={mediasRef} className="relative">
            <button
              onClick={() => setShowMediasDropdown(!showMediasDropdown)}
              onMouseEnter={() => setShowMediasDropdown(true)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                isMediaActive || showMediasDropdown
                  ? 'bg-traduc-indigo text-white' 
                  : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>Médias</span> {/* À traduire plus tard */}
              <ChevronDown className={`w-3 h-3 transition-transform ${showMediasDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showMediasDropdown && (
              <div 
                className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-xl border border-traduc-beige-300 dark:border-gray-700 overflow-hidden"
                onMouseLeave={() => setShowMediasDropdown(false)}
              >
                <div className="py-2">
                  {mediasItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setShowMediasDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-start gap-3 transition-colors ${
                          activeTab === item.id
                            ? 'bg-traduc-beige-200 dark:bg-gray-700'
                            : 'hover:bg-traduc-beige-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-traduc-beige-900 dark:text-white text-sm">
                            {item.label}
                          </div>
                          <div className="text-xs text-traduc-beige-600 dark:text-gray-400 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-traduc-beige-300 dark:bg-gray-700 mx-1" />

          {/* Tools */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setShowToolsDropdown(!showToolsDropdown)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                toolsItems.some(item => item.id === activeTab) || showToolsDropdown
                  ? 'bg-traduc-indigo text-white' 
                  : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <span>{t('tools', 'Outils')}</span> {/* ⚠️ CHANGÉ */}
              <ChevronDown className={`w-3 h-3 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showToolsDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-lg border border-traduc-beige-300 dark:border-gray-700 py-2">
                {toolsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-traduc-beige-900 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Actions à droite - reste identique */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Tooltip text={theme === 'dark' ? 'Mode clair' : 'Mode sombre'} position="bottom">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </Tooltip>

          {/* Notifications */}
          <Tooltip text="Notifications" position="bottom">
            <button 
              className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </Tooltip>

          {/* Settings */}
          <Tooltip text="Paramètres" position="bottom">
            <button 
              onClick={() => onTabChange('settings')}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                activeTab === 'settings'
                  ? 'bg-traduc-indigo text-white'
                  : 'text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
              aria-label="Paramètres"
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* User Profile - reste identique */}
          <div ref={userMenuRef} className="relative ml-3 pl-3 border-l border-traduc-beige-300 dark:border-gray-700">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 px-2 py-1 rounded-lg transition-colors max-w-[180px]"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              
              <div className="hidden sm:flex flex-col items-start min-w-0 flex-1">
                <span className="font-medium text-traduc-beige-900 dark:text-white text-sm truncate w-full">
                  John Doe
                </span>
                <span className="text-xs text-traduc-beige-600 dark:text-gray-400">
                  Plan {userPlan}
                </span>
              </div>

              <ChevronDown className={`w-3 h-3 text-traduc-beige-600 dark:text-gray-400 transition-transform flex-shrink-0 ${
                showUserMenu ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Menu dropdown reste identique */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-xl border border-traduc-beige-300 dark:border-gray-700 overflow-hidden z-[9999]">
                {/* ... reste du menu utilisateur ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;