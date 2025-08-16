// project/src/components/Header.tsx

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
  ChevronRight
} from 'lucide-react';

// Composant Tooltip
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
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
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
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
  const { t, i18n } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showMediasDropdown, setShowMediasDropdown] = useState(false);
  const [showLanguesDropdown, setShowLanguesDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mediasRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const languesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    { id: 'cloud-integrations', label: 'Cloud & API', icon: Cloud },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
  ];

  const mediasItems = [
    { 
      id: 'documents', 
      label: t('header.documents'),
      icon: FileText,
      description: t('header.descriptions.documents'),
      color: 'text-blue-500 dark:text-blue-400'
    },
    { 
      id: 'videos', 
      label: t('header.videos'),
      icon: Video,
      description: t('header.descriptions.videos'),
      color: 'text-purple-500 dark:text-purple-400'
    },
    { 
      id: 'audios', 
      label: t('header.audios'),
      icon: Music,
      description: t('header.descriptions.audios'),
      color: 'text-green-500 dark:text-green-400'
    }
  ];

  const languesItems = [
    { 
      id: 'transcription', 
      label: t('header.transcription'),
      icon: Mic,
      description: t('header.descriptions.transcription'),
      color: 'text-indigo-500 dark:text-indigo-400'
    },
    { 
      id: 'translation', 
      label: t('header.translation'),
      icon: Globe2,
      description: t('header.descriptions.translation'),
      color: 'text-cyan-500 dark:text-cyan-400'
    }
  ];

  const isMediaActive = mediasItems.some(item => item.id === activeTab);
  const isLanguesActive = languesItems.some(item => item.id === activeTab);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 beige:bg-traduc-beige-100 border-b border-traduc-beige-300 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label={isMenuOpen ? t('actions.closeMenu') : t('actions.openMenu')}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-10 h-10 bg-traduc-violet rounded-xl flex items-center justify-center shadow-lg">
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
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('header.dashboard')}</span>
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'projects' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{t('header.projects')}</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'analytics' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('header.analytics')}</span>
          </button>

          {/* Menu Langues */}
          <div ref={languesRef} className="relative">
            <button
              onClick={() => setShowLanguesDropdown(!showLanguesDropdown)}
              onMouseEnter={() => setShowLanguesDropdown(true)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
                isLanguesActive || showLanguesDropdown
                  ? 'bg-traduc-indigo text-white' 
                  : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t('header.languages')}</span>
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
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{t('header.integrations')}</span>
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
                  : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>{t('header.medias')}</span>
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
                activeTab === 'cloud-integrations' || 
                activeTab === 'collaboration' || 
                activeTab === 'ai-tools'
                  ? 'bg-traduc-indigo text-white' 
                  : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
            >
              <span>{t('header.tools')}</span>
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

        {/* Actions à droite */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Tooltip text={theme === 'dark' ? t('header.theme.light') : t('header.theme.dark')}>
            <button
              onClick={toggleTheme}
              className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={theme === 'dark' ? t('header.theme.light') : t('header.theme.dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </Tooltip>

          {/* Notifications */}
          <Tooltip text={t('header.notifications')}>
            <button 
              className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={t('header.notifications')}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </Tooltip>

          {/* Settings */}
          <Tooltip text={t('header.settings')}>
            <button 
              onClick={() => onTabChange('settings')}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                activeTab === 'settings'
                  ? 'bg-traduc-indigo text-white'
                  : 'text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
              }`}
              aria-label={t('header.settings')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* User Profile avec menu dropdown */}
          <div ref={userMenuRef} className="relative ml-3 pl-3 border-l border-traduc-beige-300 dark:border-gray-700">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 px-2 py-1 rounded-lg transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-traduc-beige-900 dark:text-white beige:text-traduc-beige-900">John Doe</p>
                <p className="text-xs text-traduc-beige-600 dark:text-gray-400 beige:text-traduc-beige-600">Pro Plan</p>
              </div>
              <div className="w-8 h-8 bg-traduc-indigo rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <ChevronDown className={`w-3 h-3 text-traduc-beige-600 dark:text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu utilisateur dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-lg border border-traduc-beige-300 dark:border-gray-700 py-2">
                <div className="px-4 py-2 border-b border-traduc-beige-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-traduc-beige-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-traduc-beige-600 dark:text-gray-400">demo@traduckxion.com</p>
                </div>
                
                <button
                  onClick={() => {
                    onTabChange('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 text-traduc-beige-900 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  {t('header.user.profile')}
                </button>

                <button
                  onClick={() => {
                    onTabChange('settings/preferences');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 text-traduc-beige-900 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  <Globe className="w-4 h-4" />
                  {t('header.user.preferencesLanguage')}
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </button>

                <div className="h-px bg-traduc-beige-200 dark:bg-gray-700 my-2" />

                <button
                  onClick={() => {
                    // Logique de déconnexion
                    console.log('Logout');
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {t('header.user.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;