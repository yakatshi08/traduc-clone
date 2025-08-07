import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Download, TrendingUp } from 'lucide-react';

const ActivityChart: React.FC = () => {
  const { t } = useTranslation('dashboard');

  const data = [
    { day: 'Lun', transcriptions: 45, traductions: 30 },
    { day: 'Mar', transcriptions: 52, traductions: 38 },
    { day: 'Mer', transcriptions: 61, traductions: 42 },
    { day: 'Jeu', transcriptions: 58, traductions: 45 },
    { day: 'Ven', transcriptions: 72, traductions: 51 },
    { day: 'Sam', transcriptions: 65, traductions: 48 },
    { day: 'Dim', transcriptions: 43, traductions: 35 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 dark:bg-gray-800 beige:bg-traduc-beige-200 p-3 rounded-lg shadow-lg border border-gray-700 dark:border-gray-600 beige:border-traduc-beige-300">
          <p className="text-sm font-medium text-white dark:text-white beige:text-traduc-beige-900 mb-2">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-traduc-violet">
              Transcriptions: <span className="font-medium">{payload[0].value}</span>
            </p>
            <p className="text-xs text-traduc-indigo">
              Traductions: <span className="font-medium">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
            {t('charts.weeklyActivity', 'Activité hebdomadaire')}
          </h3>
          <p className="text-sm text-traduc-beige-600 dark:text-gray-400 mt-1">
            Transcriptions et traductions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-traduc-emerald">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+18.2%</span>
          </div>
          <button className="p-2 text-traduc-beige-600 dark:text-gray-400 hover:text-traduc-beige-900 dark:hover:text-white hover:bg-traduc-beige-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTranscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorTraductions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0d0b8" 
              className="dark:stroke-gray-700 beige:stroke-traduc-beige-300" 
              opacity={0.5} 
            />
            <XAxis 
              dataKey="day" 
              stroke="#9ca3af"
              className="dark:stroke-gray-400 beige:stroke-traduc-beige-600"
              fontSize={12}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              stroke="#9ca3af"
              className="dark:stroke-gray-400 beige:stroke-traduc-beige-600"
              fontSize={12}
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="transcriptions"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorTranscriptions)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="traductions"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorTraductions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-traduc-violet rounded-full"></div>
          <span className="text-sm text-traduc-beige-600 dark:text-gray-400">
            {t('labels.transcriptions', 'Transcriptions')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-traduc-indigo rounded-full"></div>
          <span className="text-sm text-traduc-beige-600 dark:text-gray-400">
            {t('labels.translations', 'Traductions')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;