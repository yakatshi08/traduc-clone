import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  FileText, 
  Video, 
  Headphones,
  Cloud,
  Users,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const menuItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      color: 'text-violet-400'
    },
    {
      id: 'projects',
      label: t('nav.projects'),
      icon: FolderOpen,
      color: 'text-indigo-400'
    },
    {
      id: 'analytics',
      label: t('nav.analytics'),
      icon: BarChart3,
      color: 'text-emerald-400'
    }
  ];

  const categoryItems = [
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      color: 'text-violet-400'
    },
    {
      id: 'videos',
      label: 'Vidéos',
      icon: Video,
      color: 'text-violet-400'
    },
    {
      id: 'audios',
      label: 'Audios',
      icon: Headphones,
      color: 'text-violet-400'
    }
  ];

  const toolItems = [
    {
      id: 'cloud',
      label: 'Cloud Storage',
      icon: Cloud,
      color: 'text-blue-400'
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 'ai-tools',
      label: 'Outils IA',
      icon: Zap,
      color: 'text-yellow-400'
    }
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 h-full overflow-y-auto">
      <div className="p-6">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Categories Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Catégories
          </h3>
          <nav className="space-y-1">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-violet-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tools Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Outils
          </h3>
          <nav className="space-y-1">
            {toolItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-slate-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-slate-600 text-white'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{t('nav.settings')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;