import React, { useState, useEffect } from "react";
import "./i18n/config";

import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import TranscriptionPage from "./pages/TranscriptionPage";
import CloudIntegrationsPage from "./pages/CloudIntegrationsPage";
import SectorConfigPage from "./pages/SectorConfigPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPageV2 from "./components/Auth/LoginPageV2";
import PricingPage from "./pages/PricingPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentsPage from "./pages/DocumentsPage"; // Nouvel import
import VideosPage from "./pages/VideosPage"; // Nouvel import
import AudiosPage from "./pages/AudiosPage"; // Nouvel import

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('authProvider');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleTabChange = (newTab: string) => {
    console.log('🔄 Changement de tab:', activeTab, '->', newTab);
    
    // Si c'est une déconnexion via le header
    if (newTab === 'logout') {
      handleLogout();
    } else {
      setActiveTab(newTab);
    }
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-traduc-violet to-traduc-indigo rounded-xl flex items-center justify-center shadow-2xl mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-2xl">TX</span>
          </div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, afficher la page de login
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPageV2 onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    console.log('📄 Page active:', activeTab);
    
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
        
      case 'projects':
        return <ProjectsPage />;
        
      case 'transcription':
        return <TranscriptionPage />;
        
      case 'cloud-integrations':
        return <CloudIntegrationsPage />;
        
      case 'ai-tools':
        return <SectorConfigPage />;
        
      case 'analytics':
        return <AnalyticsPage />;
        
      case 'pricing':
        return <PricingPage />;
        
      case 'documents':
        return <DocumentsPage />; // Nouvelle page
        
      case 'videos':
        return <VideosPage />; // Nouvelle page
        
      case 'audios':
        return <AudiosPage />; // Nouvelle page
        
      case 'collaboration':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Collaboration</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Outils de collaboration - En développement</p>
            </div>
          </div>
        );
        
      case 'settings':
        return <SettingsPage />;
        
      default:
        return (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">{activeTab}</h1>
              <p className="text-gray-400">Page non trouvée</p>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
          isMenuOpen={isMenuOpen}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            {/* Barre d'info utilisateur */}
            <div className="mb-6 p-3 bg-gray-800/50 backdrop-blur rounded-lg flex items-center justify-between border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {localStorage.getItem('userEmail')?.split('@')[0]?.slice(0, 2).toUpperCase() || 'US'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {localStorage.getItem('userEmail') || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Plan Pro • Connecté via {localStorage.getItem('authProvider') || 'Email'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg text-sm transition-all border border-red-600/50"
              >
                Déconnexion
              </button>
            </div>
            
            {/* Contenu de la page */}
            {renderPage()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;