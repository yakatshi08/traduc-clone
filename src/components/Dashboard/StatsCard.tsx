import React, { useState } from "react";
import Header from "./components/Layout/Header";
import StatsCard from "./components/Dashboard/StatsCard";
import "./i18n/config";

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
        onTabChange={(tab) => setActiveTab(tab)}
      />
      <main className="pt-16 p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Test avec StatsCard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Projets totaux"
            value="24"
            change="+12%"
            isPositive={true}
            icon="folder"
          />
        </div>
      </main>
    </div>
  );
}

export default App;