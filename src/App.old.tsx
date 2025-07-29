import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Projects from './components/projects/Projects';
import NewProject from './components/new-project/NewProject';
import './i18n/config';

function App() {
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Récupérer le tab depuis l'URL
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'dashboard';
    console.log('[App] Initial tab:', tab);
    return tab;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Gérer les changements de tab
  const handleTabChange = (tab: string) => {
    console.log('[App] Changing tab to:', tab);
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Écouter les changements d'URL
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'dashboard';
      console.log('[App] URL changed, new tab:', tab);
      setActiveTab(tab);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [i18n]);

  // DEBUG: Afficher l'état actuel
  useEffect(() => {
    console.log('[App] Current activeTab:', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    console.log('[App] renderContent called with activeTab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        console.log('[App] Rendering Dashboard');
        return <Dashboard />;
        
      case 'projects':
        console.log('[App] Rendering Projects');
        return <Projects onNavigate={handleTabChange} />;
        
      case 'new-project':
        console.log('[App] Rendering NewProject');
        return <NewProject />;
        
      case 'editor':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Éditeur</h2>
            <p className="text-gray-400">Cette fonctionnalité arrive bientôt...</p>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
            <p className="text-gray-400">Cette fonctionnalité arrive bientôt...</p>
          </div>
        );
        
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Paramètres</h2>
            <p className="text-gray-400">Cette fonctionnalité arrive bientôt...</p>
          </div>
        );
        
      default:
        console.log('[App] Unknown tab, rendering Dashboard');
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* DEBUG BAR - À SUPPRIMER APRÈS DEBUG */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 0, 0.9)',
        color: 'black',
        padding: '5px 20px',
        zIndex: 9999,
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '0 0 10px 10px'
      }}>
        DEBUG: activeTab = "{activeTab}" | URL = {window.location.search}
      </div>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={setSidebarOpen} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <main className="p-6 overflow-x-hidden">
          <div className="animate-fadeIn">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;


