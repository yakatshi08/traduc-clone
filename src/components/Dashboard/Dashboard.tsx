import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenue sur votre tableau de bord</h1>
        <p className="text-gray-400">Gérez vos projets de transcription et de traduction</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <span className="text-green-400 text-sm">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">24</h3>
          <p className="text-gray-400">Projets totaux</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <span className="text-green-400 text-sm">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">156h</h3>
          <p className="text-gray-400">Heures transcrites</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <span className="text-green-400 text-sm">+2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">98.5%</h3>
          <p className="text-gray-400">Précision moyenne</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-red-400 text-sm">-3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">7</h3>
          <p className="text-gray-400">Tâches actives</p>
        </div>
      </div>

      {/* Projets récents */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Projets récents</h3>
          <p className="text-gray-400">Les projets récents apparaîtront ici...</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-3">
              <span>📤</span> Télécharger un fichier
            </button>
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-3">
              <span>🎤</span> Enregistrer audio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;