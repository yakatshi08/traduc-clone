import React, { useState } from "react";
import "./i18n/config";

import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";

// Import de toutes les pages développées
import TranscriptionPage from "./pages/TranscriptionPage";
import CloudIntegrationsPage from "./pages/CloudIntegrationsPage";
import SectorConfigPage from "./pages/SectorConfigPage";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (newTab: string) => {
    console.log('🔄 Changement de tab:', activeTab, '->', newTab);
    setActiveTab(newTab);
  };

  const renderPage = () => {
    console.log('📄 Page active:', activeTab);
    
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
        
      case 'transcription':
        return <TranscriptionPage />;
        
      case 'projects':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mes Projets</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Page des projets - En développement</p>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Analytics</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Page Analytics - En développement</p>
            </div>
          </div>
        );
        
      case 'documents':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Documents</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Gérez vos documents ici</p>
            </div>
          </div>
        );
        
      case 'videos':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Vidéos</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Gérez vos vidéos ici</p>
            </div>
          </div>
        );
        
      case 'audios':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Audios</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Gérez vos audios ici</p>
            </div>
          </div>
        );
        
      case 'cloud-integrations':
        return <CloudIntegrationsPage />;
        
      case 'collaboration':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Collaboration</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Outils de collaboration - En développement</p>
            </div>
          </div>
        );
        
      case 'ai-tools':
        return <SectorConfigPage />;
        
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">Paramètres du compte - En développement</p>
            </div>
          </div>
        );
        
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
            {renderPage()}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;