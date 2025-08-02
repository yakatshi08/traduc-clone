import React, { useState } from 'react';
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
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isMenuOpen, onTabChange }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toolsItems = [
    { id: 'cloud-storage', label: 'Cloud Storage', icon: Cloud },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'ai-tools', label: 'API', icon: Sparkles }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">TX</span>
            </div>
            <span className="text-xl font-bold text-white">
              TraducXion <span className="text-xs font-normal text-gray-500">V2.5</span>
            </span>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Boutons principaux */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          {/* Séparateur */}
          <div className="h-6 w-px bg-gray-700 mx-1" />

          {/* Documents, Videos, Audios - Sans le label CATEGORIES */}
          <button
            onClick={() => onTabChange('documents')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </button>

          <button
            onClick={() => onTabChange('videos')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </button>

          <button
            onClick={() => onTabChange('audios')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span>Audios</span>
          </button>

          {/* Séparateur */}
          <div className="h-6 w-px bg-gray-700 mx-1" />

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowToolsDropdown(!showToolsDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span>Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showToolsDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                {toolsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-6 w-px bg-gray-700 mx-1" />

          {/* Settings */}
          <button
            onClick={() => onTabChange('settings')}
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Actions à droite */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language */}
          <button className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white">
            <Globe className="w-4 h-4" />
            <span>FR</span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings icon */}
          <button 
            onClick={() => onTabChange('settings')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Pro Plan</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">JD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 py-4">
          <nav className="space-y-1">
            <button
              onClick={() => { onTabChange('dashboard'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => { onTabChange('projects'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <FolderOpen className="w-5 h-5" />
              Projects
            </button>

            <button
              onClick={() => { onTabChange('analytics'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>

            <div className="h-px bg-gray-700 my-2" />

            <button
              onClick={() => { onTabChange('documents'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>

            <button
              onClick={() => { onTabChange('videos'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <Video className="w-5 h-5" />
              Videos
            </button>

            <button
              onClick={() => { onTabChange('audios'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
            >
              <Headphones className="w-5 h-5" />
              Audios
            </button>

            <div className="h-px bg-gray-700 my-2" />

            {/* Tools section in mobile */}
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Tools</p>
              {toolsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); onMenuClick(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-px bg-gray-700 my-2" />

            <button
              onClick={() => { onTabChange('settings'); onMenuClick(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
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