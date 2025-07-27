import React, { useState } from 'react';
import { useLanguage } from './hooks/useLanguage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import { Project } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t } = useLanguage();

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    // You could navigate to a project detail view here
    console.log('Selected project:', project);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onProjectSelect={handleProjectSelect} />;
      case 'projects':
        return (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Projets</h1>
            <p>Vue détaillée des projets à venir...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Analytiques</h1>
            <p>Tableaux de bord analytiques à venir...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
            <p>Configuration de l'application à venir...</p>
          </div>
        );
      default:
        return <Dashboard onProjectSelect={handleProjectSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden h-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto h-full">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;