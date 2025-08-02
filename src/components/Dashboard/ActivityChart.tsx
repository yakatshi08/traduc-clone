import React from 'react';
import { Download } from 'lucide-react';

const ActivityChart: React.FC = () => {
  const data = [
    { day: 'Lun', transcriptions: 12, translations: 8 },
    { day: 'Mar', transcriptions: 19, translations: 12 },
    { day: 'Mer', transcriptions: 15, translations: 10 },
    { day: 'Jeu', transcriptions: 25, translations: 18 },
    { day: 'Ven', transcriptions: 22, translations: 15 },
    { day: 'Sam', transcriptions: 8, translations: 5 },
    { day: 'Dim', transcriptions: 5, translations: 3 }
  ];

  const maxValue = Math.max(...data.flatMap(d => [d.transcriptions, d.translations]));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Activité hebdomadaire</h3>
        <button className="text-gray-400 hover:text-white">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end h-40">
              <div 
                className="flex-1 bg-gradient-to-t from-violet-600 to-indigo-600 rounded-t"
                style={{ height: `${(item.transcriptions / maxValue) * 100}%` }}
              />
              <div 
                className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t"
                style={{ height: `${(item.translations / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-violet-600 to-indigo-600" />
          <span className="text-sm text-gray-400">Transcriptions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-600 to-cyan-600" />
          <span className="text-sm text-gray-400">Traductions</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;