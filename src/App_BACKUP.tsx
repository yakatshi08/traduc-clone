import React, { useState } from "react";
import Header from "./components/Layout/Header";
import "./i18n/config";

function App() {
  const [error, setError] = useState<string>("");

  try {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onMenuClick={() => console.log('Menu click')}
          isMenuOpen={false}
          onTabChange={(tab) => console.log('Tab:', tab)}
        />
        <main className="pt-16 p-6">
          <h1 className="text-white text-2xl">Test avec Header uniquement</h1>
        </main>
      </div>
    );
  } catch (err) {
    return (
      <div className="p-6 bg-red-900 text-white">
        <h1>Erreur:</h1>
        <pre>{err?.toString()}</pre>
      </div>
    );
  }
}

export default App;