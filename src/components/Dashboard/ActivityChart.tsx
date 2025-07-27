import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ActivityChart: React.FC = () => {
  const { t } = useTranslation('dashboard');

  // Données simulées pour le graphique
  const data = [
    { day: 'Lun', transcriptions: 45, translations: 32 },
    { day: 'Mar', transcriptions: 52, translations: 38 },
    { day: 'Mer', transcriptions: 48, translations: 42 },
    { day: 'Jeu', transcriptions: 70, translations: 55 },
    { day: 'Ven', transcriptions: 65, translations: 48 },
    { day: 'Sam', transcriptions: 42, translations: 35 },
    { day: 'Dim', transcriptions: 38, translations: 28 }
  ];

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.transcriptions, d.translations))
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t('activity.title', 'Activité de la semaine')}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {t('activity.subtitle', 'Transcriptions et traductions')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+24%</span>
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
          <span className="text-sm text-gray-400">
            {t('activity.chart.transcriptions', 'Transcriptions')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          <span className="text-sm text-gray-400">
            {t('activity.chart.translations', 'Traductions')}
          </span>
        </div>
      </div>

      {/* Graphique en barres */}
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 items-end h-40">
                {/* Barre Transcriptions */}
                <div className="flex-1 relative group">
                  <div
                    className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(item.transcriptions / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.transcriptions}
                  </div>
                </div>
                
                {/* Barre Traductions */}
                <div className="flex-1 relative group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(item.translations / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.translations}
                  </div>
                </div>
              </div>
              
              <span className="text-xs text-gray-400">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats résumé */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div>
          <p className="text-sm text-gray-400">Total cette semaine</p>
          <p className="text-2xl font-bold text-white mt-1">387</p>
          <p className="text-xs text-emerald-400 mt-1">+15% vs semaine dernière</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Moyenne quotidienne</p>
          <p className="text-2xl font-bold text-white mt-1">55.3</p>
          <p className="text-xs text-blue-400 mt-1">Objectif : 50/jour</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;