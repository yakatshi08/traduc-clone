import React from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';

const ProgressChart: React.FC = () => {
  const progressData = [
    { name: 'Transcriptions', completed: 78, total: 100, color: 'from-violet-600 to-indigo-600' },
    { name: 'Traductions', completed: 45, total: 60, color: 'from-blue-600 to-cyan-600' },
    { name: 'Sous-titres', completed: 32, total: 40, color: 'from-emerald-600 to-green-600' },
    { name: 'Révisions', completed: 15, total: 25, color: 'from-orange-600 to-amber-600' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Vue d'ensemble des progrès</h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {progressData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">{item.name}</span>
              <span className="text-sm text-gray-400">
                {item.completed}/{item.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                style={{ width: `${(item.completed / item.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-gray-400">Taux de complétion</span>
          </div>
          <span className="text-lg font-semibold text-white">68%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;