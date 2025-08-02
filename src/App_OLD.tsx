import React, { useState } from "react";
import Header from "./components/Layout/Header";
import "./i18n/config";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
        onTabChange={(tab) => console.log('Tab:', tab)}
      />
      <main className="pt-16 p-6">
        <h1 className="text-white text-2xl">Juste le Header - Pas de boucle</h1>
      </main>
    </div>
  );
}

export default App;