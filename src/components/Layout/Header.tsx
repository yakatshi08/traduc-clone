import React from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  Settings, 
  LayoutDashboard,
  User
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">TX</span>
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">
              TraducXion V2.5
            </h1>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium">{t('navigation.dashboard', 'Tableau de bord')}</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          <LanguageSelector />
          
          <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          
          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-slate-700">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Pro Plan</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;