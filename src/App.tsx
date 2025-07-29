import React, { useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectsPage from "./components/ProjectsPage";
import NewProject from "./components/new-project/NewProject";
import AnalyticsPage from "./components/AnalyticsPage";
import "./i18n/config";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tab: string) => {
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={setSidebarOpen} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        
        {/* Espace pour le header fixe */}
        <div className="h-16"></div>
        
        <main className="p-6 overflow-x-hidden">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'projects' && <ProjectsPage onNavigate={handleTabChange} />}
          {activeTab === 'new-project' && <NewProject onNavigate={handleTabChange} />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Paramètres</h1>
              <p className="text-gray-400">Configuration de l'application</p>
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Documents</h1>
              <p className="text-gray-400">Gestion des documents</p>
            </div>
          )}
          {activeTab === 'videos' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Vidéos</h1>
              <p className="text-gray-400">Gestion des vidéos</p>
            </div>
          )}
          {activeTab === 'audios' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Audios</h1>
              <p className="text-gray-400">Gestion des fichiers audio</p>
            </div>
          )}
          {activeTab === 'cloud-storage' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Cloud Storage</h1>
              <p className="text-gray-400">Intégration cloud</p>
            </div>
          )}
          {activeTab === 'collaboration' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Collaboration</h1>
              <p className="text-gray-400">Outils collaboratifs</p>
            </div>
          )}
          {activeTab === 'ai-tools' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Outils IA</h1>
              <p className="text-gray-400">Intelligence artificielle</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;