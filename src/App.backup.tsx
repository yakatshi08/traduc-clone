import React, { useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import ProjectsPage from "./components/ProjectsPage";
import NewProject from "./components/new-project/NewProject";
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'yellow',
        color: 'black',
        padding: '10px 20px',
        zIndex: 9999,
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        activeTab = {activeTab}
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
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'projects' && <ProjectsPage onNavigate={handleTabChange} />}
          {activeTab === 'new-project' && <NewProject onNavigate={handleTabChange} />}
          {activeTab === 'analytics' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Analytiques</h1>
              <p className="text-gray-400">Page en cours de développement...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Paramètres</h1>
              <p className="text-gray-400">Page en cours de développement...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;