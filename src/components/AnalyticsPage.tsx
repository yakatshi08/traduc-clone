import React from 'react';
import { BarChart3, TrendingUp, Users, Globe, Activity, PieChart } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="w-full">
      {/* ESPACE GARANTI EN HAUT - 150px */}
      <div style={{ paddingTop: '20px' }}>
        
        {/* TITRE PRINCIPAL */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Analytiques</h1>
          <p className="text-xl text-gray-400">Analyse détaillée de vos projets de traduction et transcription</p>
        </div>

        {/* CARTES DE STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carte 1 - Projets */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">1,234</h3>
            <p className="text-purple-200">Projets complétés</p>
          </div>

          {/* Carte 2 - Précision */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">+8%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">98.5%</h3>
            <p className="text-blue-200">Précision moyenne</p>
          </div>

          {/* Carte 3 - Utilisateurs */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">+25%</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">523</h3>
            <p className="text-green-200">Utilisateurs actifs</p>
          </div>

          {/* Carte 4 - Langues */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8 opacity-80" />
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">5 actives</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">12</h3>
            <p className="text-yellow-200">Langues supportées</p>
          </div>
        </div>

        {/* SECTION GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique 1 */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Évolution mensuelle</h3>
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Graphique en cours de développement</p>
            </div>
          </div>

          {/* Graphique 2 */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Répartition par type</h3>
              <PieChart className="w-6 h-6 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Graphique en cours de développement</p>
            </div>
          </div>
        </div>

        {/* TABLEAU RÉCENT */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Activité récente</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3">Projet</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Langue</th>
                  <th className="pb-3">Précision</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="py-3">Conférence Q4 2024</td>
                  <td className="py-3">Vidéo</td>
                  <td className="py-3">FR → EN</td>
                  <td className="py-3">98.5%</td>
                  <td className="py-3">Il y a 2h</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Rapport médical</td>
                  <td className="py-3">Document</td>
                  <td className="py-3">EN → ES</td>
                  <td className="py-3">99.2%</td>
                  <td className="py-3">Il y a 5h</td>
                </tr>
                <tr>
                  <td className="py-3">Podcast Interview</td>
                  <td className="py-3">Audio</td>
                  <td className="py-3">ES → FR</td>
                  <td className="py-3">97.8%</td>
                  <td className="py-3">Hier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;