import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  FileText, 
  Users,
  Activity,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6"> {/* SUPPRIMÉ ml-64 */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytiques</h1>
        <p className="text-gray-400">Suivez vos performances et statistiques</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-emerald-400">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">1,248</h3>
          <p className="text-sm text-gray-400">Transcriptions totales</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-emerald-400">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">324h</h3>
          <p className="text-sm text-gray-400">Heures traitées</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-sm text-emerald-400">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">892</h3>
          <p className="text-sm text-gray-400">Documents traduits</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-sm text-red-400">-2.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">145</h3>
          <p className="text-sm text-gray-400">Utilisateurs actifs</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Évolution mensuelle</h3>
            <button className="text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-16 h-16" />
            <span className="ml-4">Graphique des transcriptions</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Répartition par type</h3>
            <button className="text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Activity className="w-16 h-16" />
            <span className="ml-4">Graphique circulaire</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Activité récente</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Projet</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Durée</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">Projet Example {item}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">Transcription</td>
                  <td className="py-3 px-4 text-gray-400">45 min</td>
                  <td className="py-3 px-4 text-gray-400">15/12/2024</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      Terminé
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;