import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import './i18n/config';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useTranslation();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-white mb-4">{t('pages.projects.title', 'Projets')}</h1>
            <p className="text-gray-400">{t('pages.projects.description', 'Gérez vos projets de transcription et traduction')}</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-white mb-4">{t('pages.analytics.title', 'Analytiques')}</h1>
            <p className="text-gray-400">{t('pages.analytics.description', 'Visualisez vos statistiques détaillées')}</p>
          </div>
        );
      case 'settings':
        return (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-white mb-4">{t('pages.settings.title', 'Paramètres')}</h1>
            <p className="text-gray-400">{t('pages.settings.description', 'Configurez votre espace de travail')}</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Layout */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
        />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} overflow-y-auto`}>
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;