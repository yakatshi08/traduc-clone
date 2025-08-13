import React, { useState, useEffect } from "react";
import "./i18n/config";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

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
import DocumentsPage from "./pages/DocumentsPage";
import VideosPage from "./pages/VideosPage";
import AudiosPage from "./pages/AudiosPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

// Composant pour gérer le layout avec navigation
function AppLayout({ onLogout }: { onLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Déterminer l'onglet actif basé sur l'URL
  const getActiveTab = () => {
    const path = location.pathname.slice(1).split('/')[0] || 'dashboard';
    return path;
  };

  const handleTabChange = (newTab: string) => {
    console.log('🔄 Changement de tab:', newTab);
    
    if (newTab === 'logout') {
      onLogout();
    } else if (newTab === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${newTab}`);
    }
  };

  return (
    <>
      <Header 
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
        isMenuOpen={isMenuOpen}
        onTabChange={handleTabChange}
        activeTab={getActiveTab()}
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
              onClick={onLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg text-sm transition-all border border-red-600/50"
            >
              Déconnexion
            </button>
          </div>
          
          {/* Routes configurées correctement */}
          <Routes>
            {/* Routes principales */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/transcription" element={<TranscriptionPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/audios" element={<AudiosPage />} />
            <Route path="/cloud-integrations" element={<CloudIntegrationsPage />} />
            <Route path="/ai-tools" element={<SectorConfigPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/collaboration" element={
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Collaboration</h1>
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-gray-400">Outils de collaboration - En développement</p>
                </div>
              </div>
            } />
            
            {/* Route pour les détails de projet - ATTENTION: chemin spécifique */}
            <Route path="/projects/detail/:id" element={<ProjectDetailPage />} />
            
            {/* Route 404 - doit être en dernier */}
            <Route path="*" element={
              <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <h1 className="text-3xl font-bold mb-4">404</h1>
                  <p className="text-gray-400">Page non trouvée</p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </>
  );
}

function App() {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('authProvider');
    setIsAuthenticated(false);
    // Rediriger vers la page de login
    window.location.href = '/';
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

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <AppLayout onLogout={handleLogout} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;