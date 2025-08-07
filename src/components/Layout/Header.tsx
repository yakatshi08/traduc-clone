import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  FileText,
  Video,
  Headphones,
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
  ChevronDown
} from 'lucide-react';

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
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
    setShowLanguageDropdown(false);
  };

  const toolsItems = [
    { id: 'cloud-integrations', label: 'Cloud & API', icon: Cloud },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 beige:bg-traduc-beige-100 border-b border-traduc-beige-300 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors lg:hidden"
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
          {/* Boutons principaux avec taille réduite */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'dashboard' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
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
            <span>Projects</span>
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
            <span>Analytics</span>
          </button>

          {/* Bouton Transcription ajouté ici */}
          <button
            onClick={() => onTabChange('transcription')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'transcription' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transcription</span>
          </button>

          {/* Séparateur plus fin */}
          <div className="h-5 w-px bg-traduc-beige-300 dark:bg-gray-700 mx-1" />

          {/* Documents, Videos, Audios */}
          <button
            onClick={() => onTabChange('documents')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'documents' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents</span>
          </button>

          <button
            onClick={() => onTabChange('videos')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'videos' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>

          <button
            onClick={() => onTabChange('audios')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'audios' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Audios</span>
          </button>

          {/* Séparateur */}
          <div className="h-5 w-px bg-traduc-beige-300 dark:bg-gray-700 mx-1" />

          {/* Tools Dropdown */}
          <div className="relative">
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
              <span>Tools</span>
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

          {/* Séparateur */}
          <div className="h-5 w-px bg-traduc-beige-300 dark:bg-gray-700 mx-1" />

          {/* Settings */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-sm ${
              activeTab === 'settings' 
                ? 'bg-traduc-indigo text-white' 
                : 'text-traduc-beige-800 dark:text-gray-300 beige:hover:bg-traduc-beige-200 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Actions à droite */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors"
            title={theme === 'dark' ? 'Mode Beige' : 'Mode Sombre'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language avec plus d'espace */}
          <div className="relative ml-3">
            <button 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 border border-traduc-beige-300 dark:border-gray-700 text-traduc-beige-800 dark:text-gray-300 hover:text-traduc-beige-900 dark:hover:text-white hover:border-traduc-beige-400 dark:hover:border-gray-600 rounded-lg transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{i18n.language.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg shadow-lg border border-traduc-beige-300 dark:border-gray-700 py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                      i18n.language === lang.code 
                        ? 'bg-traduc-beige-200 dark:bg-gray-700 text-traduc-beige-900 dark:text-white' 
                        : 'text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors relative ml-2">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings icon */}
          <button 
            onClick={() => onTabChange('settings')}
            className="p-1.5 text-traduc-beige-700 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg hover:bg-traduc-beige-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-traduc-beige-300 dark:border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-traduc-beige-900 dark:text-white beige:text-traduc-beige-900">John Doe</p>
              <p className="text-xs text-traduc-beige-600 dark:text-gray-400 beige:text-traduc-beige-600">Pro Plan</p>
            </div>
            <div className="w-8 h-8 bg-traduc-indigo rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 beige:bg-traduc-beige-100 border-t border-traduc-beige-300 dark:border-gray-800 px-4 py-4">
          <nav className="space-y-1">
            <button
              onClick={() => { onTabChange('dashboard'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => { onTabChange('projects'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <FolderOpen className="w-5 h-5" />
              Projects
            </button>

            <button
              onClick={() => { onTabChange('analytics'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>

            {/* Bouton Transcription pour mobile */}
            <button
              onClick={() => { onTabChange('transcription'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <Sparkles className="w-5 h-5" />
              Transcription
            </button>

            <div className="h-px bg-traduc-beige-300 dark:bg-gray-700 my-2" />

            <button
              onClick={() => { onTabChange('documents'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>

            <button
              onClick={() => { onTabChange('videos'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <Video className="w-5 h-5" />
              Videos
            </button>

            <button
              onClick={() => { onTabChange('audios'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <Headphones className="w-5 h-5" />
              Audios
            </button>

            <div className="h-px bg-traduc-beige-300 dark:bg-gray-700 my-2" />

            {/* Tools section in mobile */}
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-traduc-beige-600 dark:text-gray-500 uppercase">
                Tools
              </p>
              {toolsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); onMenuClick(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-px bg-traduc-beige-300 dark:bg-gray-700 my-2" />

            <button
              onClick={() => { onTabChange('settings'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-traduc-beige-800 dark:text-gray-300 hover:bg-traduc-beige-200 dark:hover:bg-gray-800 hover:text-traduc-beige-900 dark:hover:text-white rounded-lg"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;