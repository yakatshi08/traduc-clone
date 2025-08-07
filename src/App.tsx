import React, { useState } from "react";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectsPage from "./components/ProjectsPage";
import NewProject from "./components/new-project/NewProject";
import AnalyticsPage from "./components/AnalyticsPage";
import ProjectDetail from "./components/ProjectDetail";
import DocumentsPage from "./components/DocumentsPage";
import VideosPage from "./components/VideosPage";
import AudiosPage from "./components/AudiosPage";
import SettingsPage from "./components/SettingsPage";
import TranscriptionPage from "./pages/TranscriptionPage";
import CloudIntegrationsPage from "./pages/CloudIntegrationsPage";
import "./i18n/config";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string, projectId?: number) => {
    console.log("Changing tab to:", tab, projectId);
    if (tab === 'project-detail' && projectId) {
      setSelectedProjectId(projectId);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-traduc-beige-50 dark:bg-traduc-slate-900 transition-colors duration-300">
      <Header 
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
      
      {/* Contenu principal - Full Width sans sidebar */}
      <main className="pt-16 p-6 overflow-x-hidden">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'projects' && (
          <ProjectsPage 
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'new-project' && <NewProject onNavigate={handleTabChange} />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'project-detail' && selectedProjectId && (
          <ProjectDetail 
            projectId={selectedProjectId} 
            onNavigate={handleTabChange} 
          />
        )}
        
        {activeTab === 'documents' && <DocumentsPage />}
        {activeTab === 'videos' && <VideosPage />}
        {activeTab === 'audios' && <AudiosPage />}
        
        {activeTab === 'cloud-storage' && (
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-traduc-beige-900 dark:text-white mb-4">Cloud Storage</h1>
            <p className="text-traduc-beige-700 dark:text-gray-400">Intégration cloud</p>
          </div>
        )}
        {activeTab === 'collaboration' && (
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-traduc-beige-900 dark:text-white mb-4">Collaboration</h1>
            <p className="text-traduc-beige-700 dark:text-gray-400">Outils collaboratifs</p>
          </div>
        )}
        {activeTab === 'ai-tools' && (
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-traduc-beige-900 dark:text-white mb-4">Outils IA</h1>
            <p className="text-traduc-beige-700 dark:text-gray-400">Intelligence artificielle</p>
          </div>
        )}
        {activeTab === 'transcription' && <TranscriptionPage />}
        {activeTab === 'cloud-integrations' && <CloudIntegrationsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

export default App;