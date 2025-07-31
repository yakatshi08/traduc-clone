import React from 'react';
import { 
  FolderOpen, 
  BarChart3, 
  Settings, 
  FileText, 
  Video, 
  Headphones,
  Cloud,
  Users,
  Zap,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen }) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard', 'Tableau de bord'),
      icon: LayoutDashboard,
      color: 'from-violet-600 to-indigo-600'
    },
    {
      id: 'projects',
      label: t('navigation.projects', 'Projets'),
      icon: FolderOpen,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'analytics',
      label: t('navigation.analytics', 'Analytiques'),
      icon: BarChart3,
      color: 'from-emerald-600 to-green-600'
    }
  ];

  const categoryItems = [
    {
      id: 'documents',
      label: t('navigation.documents', 'Documents'),
      icon: FileText,
      color: 'text-violet-400'
    },
    {
      id: 'videos',
      label: t('navigation.videos', 'Vidéos'),
      icon: Video,
      color: 'text-violet-400'
    },
    {
      id: 'audios',
      label: t('navigation.audios', 'Audios'),
      icon: Headphones,
      color: 'text-violet-400'
    }
  ];

  const toolItems = [
    {
      id: 'cloud',
      label: t('navigation.cloudStorage', 'Cloud Storage'),
      icon: Cloud,
      color: 'text-blue-400'
    },
    {
      id: 'collaboration',
      label: t('navigation.collaboration', 'Collaboration'),
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: 'ai-tools',
      label: t('navigation.aiTools', 'Outils IA'),
      icon: Zap,
      color: 'text-yellow-400'
    }
    // SUPPRIMÉ le bouton settings d'ici car il est déjà en bas
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => onTabChange(activeTab)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 bottom-0 z-40
        bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
        overflow-y-auto overflow-x-hidden
      `}>
        <div className={`p-4 pb-20 ${!isOpen && 'lg:p-2 lg:pb-20'} h-full flex flex-col`}>
          {/* Main Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group relative
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }
                    ${!isOpen && 'lg:justify-center lg:px-2'}
                  `}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${!isOpen && 'lg:w-6 lg:h-6'}`} />
                  {isOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isActive && !isOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Categories - VISIBLE MÊME QUAND COLLAPSED */}
          <div className="mt-8">
            {isOpen && (
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  {t('categories', 'Catégories')}
                </h3>
              </div>
            )}
            <nav className="space-y-1">
              {categoryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-violet-600/20 text-violet-400' 
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }
                      ${!isOpen && 'lg:justify-center lg:px-2'}
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className={`w-4 h-4 ${item.color} ${!isOpen && 'lg:w-5 lg:h-5'}`} />
                    {isOpen && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tools - VISIBLE MÊME QUAND COLLAPSED */}
          <div className="mt-8">
            {isOpen && (
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                  {t('tools', 'Outils')}
                </h3>
              </div>
            )}
            <nav className="space-y-1">
              {toolItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-slate-600 text-white' 
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                      }
                      ${!isOpen && 'lg:justify-center lg:px-2'}
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className={`w-4 h-4 ${item.color} ${!isOpen && 'lg:w-5 lg:h-5'}`} />
                    {isOpen && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Spacer pour pousser Settings en bas */}
          <div className="flex-grow"></div>

          {/* Settings - TOUJOURS VISIBLE */}
          <div className={`${isOpen ? 'mt-8 pt-8 border-t border-slate-700' : 'mt-8'}`}>
            <button
              onClick={() => onTabChange('settings')}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${activeTab === 'settings'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                }
                ${!isOpen && 'lg:justify-center lg:px-2'}
              `}
              title={!isOpen ? t('navigation.settings', 'Paramètres') : ''}
            >
              <Settings className={`w-5 h-5 ${!isOpen && 'lg:w-6 lg:h-6'}`} />
              {isOpen && (
                <span className="font-medium">{t('navigation.settings', 'Paramètres')}</span>
              )}
              {activeTab === 'settings' && !isOpen && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;