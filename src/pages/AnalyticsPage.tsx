import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  Calendar,
  Download,
  Filter,
  ChevronUp,
  ChevronDown,
  Globe,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileDown,
  Share2,
  Printer,
  FolderOpen,
  Brain,
  Zap,
  Shield,
  Languages,
  Video,
  Music,
  FileVideo,
  Mic,
  Volume2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Cpu,
  Database,
  Server,
  GitBranch,
  Target,
  Layers,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  ComposedChart,
  Scatter
} from 'recharts';
import toast from 'react-hot-toast';

// Types simplifiés pour éviter les erreurs
interface AnalyticsData {
  overview: {
    mau: number;
    uptime: number;
    revenue: number;
  };
  kpis: {
    wer: number;
    latency: number;
    accuracy: number;
    nps: number;
    churn: number;
    conversion: number;
  };
  languages: {
    code: string;
    name: string;
    flag: string;
    transcriptions: number;
    accuracy: number;
  }[];
  content: {
    videos: { total: number; transcribed: number; duration: number };
    audios: { total: number; transcribed: number; duration: number };
    documents: { total: number; translated: number; pages: number };
  };
}

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<'all' | 'video' | 'audio' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'technical'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Données simulées
  const analyticsData: AnalyticsData = {
    overview: {
      mau: 2847,
      uptime: 99.97,
      revenue: 85400
    },
    kpis: {
      wer: 3.2,
      latency: 145,
      accuracy: 96.8,
      nps: 68,
      churn: 4.2,
      conversion: 9.3
    },
    languages: [
      { code: 'fr', name: 'Français', flag: '🇫🇷', transcriptions: 15470, accuracy: 97.2 },
      { code: 'en', name: 'English', flag: '🇬🇧', transcriptions: 13260, accuracy: 96.8 },
      { code: 'es', name: 'Español', flag: '🇪🇸', transcriptions: 6630, accuracy: 96.5 },
      { code: 'it', name: 'Italiano', flag: '🇮🇹', transcriptions: 5304, accuracy: 96.3 },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪', transcriptions: 3536, accuracy: 96.0 }
    ],
    content: {
      videos: { total: 12450, transcribed: 11200, duration: 892800 },
      audios: { total: 18600, transcribed: 17800, duration: 1116000 },
      documents: { total: 8750, translated: 7200, pages: 125000 }
    }
  };

  const kpiCards = [
    {
      title: 'WER',
      value: '3.2%',
      subtitle: 'Objectif < 4%',
      color: 'bg-emerald-500',
      icon: Target,
      trend: -0.3,
      isGood: true
    },
    {
      title: 'Latence API',
      value: '145ms',
      subtitle: 'Objectif < 200ms',
      color: 'bg-violet-500',
      icon: Zap,
      trend: -12,
      isGood: true
    },
    {
      title: 'MAU',
      value: '2.8k',
      subtitle: 'Cible: 20k',
      color: 'bg-blue-500',
      icon: Users,
      trend: 14,
      isGood: true
    },
    {
      title: 'Uptime',
      value: '99.97%',
      subtitle: 'SLA > 99.9%',
      color: 'bg-green-500',
      icon: CheckCircle,
      trend: 0.02,
      isGood: true
    },
    {
      title: 'NPS Score',
      value: '68',
      subtitle: 'Cible > 60',
      color: 'bg-orange-500',
      icon: Award,
      trend: 8,
      isGood: true
    },
    {
      title: 'Churn',
      value: '4.2%',
      subtitle: 'Cible < 5%',
      color: 'bg-red-500',
      icon: AlertTriangle,
      trend: -0.8,
      isGood: true
    },
    {
      title: 'Conversion',
      value: '9.3%',
      subtitle: 'Cible > 8%',
      color: 'bg-purple-500',
      icon: TrendingUp,
      trend: 1.5,
      isGood: true
    },
    {
      title: 'Revenue',
      value: '85.4k€',
      subtitle: 'Cible: 3M€',
      color: 'bg-blue-600',
      icon: TrendingUp,
      trend: 15,
      isGood: true
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }
    return `${hours}h ${minutes}min`;
  };

  const exportData = (format: 'csv' | 'json' | 'pdf' | 'excel') => {
    toast.success(`Export ${format.toUpperCase()} en cours...`);
    
    if (format === 'csv') {
      const csv = kpiCards.map(card => `${card.title},${card.value},${card.subtitle}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${period}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.success(`Export ${format.toUpperCase()} terminé !`);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('✅ Données actualisées !');
    }, 1500);
  };

  const handleFilter = () => {
    const summary = `Vue: ${viewMode} | Période: ${period} | Langue: ${selectedLanguage} | Contenu: ${selectedContent}`;
    toast.success(`🔍 Filtres appliqués`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header optimisé pour éviter le débordement */}
      <div className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/80">
        {/* Ligne 1 - Titre et métriques temps réel */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Analytics Dashboard - TraduckXion V2.7</h1>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Intelligence artificielle
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Transcription multimodale
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {analyticsData.overview.mau.toLocaleString()} utilisateurs actifs
                  </span>
                </div>
              </div>
            </div>
            
            {/* Métriques temps réel */}
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700">
              <div className="text-center">
                <div className="text-xs text-slate-400">WER</div>
                <div className="text-sm font-medium text-emerald-400">{analyticsData.kpis.wer}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">Latence</div>
                <div className="text-sm font-medium text-violet-400">{analyticsData.kpis.latency}ms</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">Uptime</div>
                <div className="text-sm font-medium text-green-400">{analyticsData.overview.uptime}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">Revenue</div>
                <div className="text-sm font-medium text-blue-400">{formatNumber(analyticsData.overview.revenue)}€</div>
              </div>
            </div>
          </div>

          {/* Ligne 2 - Contrôles avec largeurs fixes pour éviter débordement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Vue sélecteur */}
              <div className="flex bg-slate-800/60 rounded-lg p-1 border border-slate-700">
                {(['overview', 'detailed', 'technical'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setViewMode(mode);
                      toast.success(`Vue: ${mode}`);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      viewMode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {mode === 'overview' && 'Vue'}
                    {mode === 'detailed' && 'Détaillé'}
                    {mode === 'technical' && 'Tech'}
                  </button>
                ))}
              </div>

              {/* Période avec largeur fixe */}
              <select 
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value as any);
                  toast.success(`Période: ${e.target.value}`);
                }}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="day">24h</option>
                <option value="week">7j</option>
                <option value="month">30j</option>
                <option value="year">1an</option>
              </select>
            </div>

            {/* Actions avec largeurs fixes calculées */}
            <div className="flex items-center gap-1">
              {/* Langues avec largeur fixe */}
              <select 
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  toast.success(`Langue: ${e.target.value}`);
                }}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">🌍 Toutes</option>
                {analyticsData.languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.code}</option>
                ))}
              </select>

              {/* Contenus avec largeur fixe */}
              <select 
                value={selectedContent}
                onChange={(e) => {
                  setSelectedContent(e.target.value as any);
                  toast.success(`Contenu: ${e.target.value}`);
                }}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">📁 Tous</option>
                <option value="video">📹 Vid</option>
                <option value="audio">🎵 Aud</option>
                <option value="document">📄 Doc</option>
              </select>

              {/* Boutons avec largeurs fixes */}
              <button
                onClick={handleFilter}
                className="flex items-center justify-center w-16 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-all"
                title="Filtrer"
              >
                <Filter className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Filtre</span>
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center w-20 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-all disabled:opacity-50"
                title="Actualiser"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actual</span>
              </button>

              {/* Export avec dropdown */}
              <div className="relative group">
                <button className="flex items-center justify-center w-16 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded text-xs transition-all font-medium">
                  <Download className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Exp</span>
                </button>
                <div className="absolute right-0 mt-1 w-24 bg-slate-800 rounded shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <button onClick={() => exportData('csv')} className="w-full px-2 py-1 text-left hover:bg-slate-700 rounded-t text-xs">CSV</button>
                  <button onClick={() => exportData('json')} className="w-full px-2 py-1 text-left hover:bg-slate-700 text-xs">JSON</button>
                  <button onClick={() => exportData('pdf')} className="w-full px-2 py-1 text-left hover:bg-slate-700 text-xs">PDF</button>
                  <button onClick={() => exportData('excel')} className="w-full px-2 py-1 text-left hover:bg-slate-700 rounded-b text-xs">Excel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4">
        {/* KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  kpi.isGood ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{kpi.value}</h3>
                <p className="text-xs text-slate-400">{kpi.title}</p>
                <p className="text-xs text-slate-500">{kpi.subtitle}</p>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-slate-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${kpi.color} transition-all duration-500`}
                    style={{ 
                      width: kpi.title === 'MAU' ? '14%' : 
                             kpi.title === 'Revenue' ? '2.8%' : 
                             '85%' 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contenu multimodal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Vidéos */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                Vidéos
              </h3>
              <span className="text-lg">📹</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total</span>
                <span className="font-medium">{formatNumber(analyticsData.content.videos.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Transcrites</span>
                <span className="font-medium text-emerald-400">
                  {formatNumber(analyticsData.content.videos.transcribed)} ({Math.round((analyticsData.content.videos.transcribed / analyticsData.content.videos.total) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Durée</span>
                <span className="font-medium">{formatDuration(analyticsData.content.videos.duration)}</span>
              </div>
            </div>
          </div>

          {/* Audios */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Music className="w-4 h-4 text-violet-400" />
                Audios
              </h3>
              <span className="text-lg">🎵</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total</span>
                <span className="font-medium">{formatNumber(analyticsData.content.audios.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Transcrits</span>
                <span className="font-medium text-emerald-400">
                  {formatNumber(analyticsData.content.audios.transcribed)} ({Math.round((analyticsData.content.audios.transcribed / analyticsData.content.audios.total) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Durée</span>
                <span className="font-medium">{formatDuration(analyticsData.content.audios.duration)}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Documents
              </h3>
              <span className="text-lg">📄</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total</span>
                <span className="font-medium">{formatNumber(analyticsData.content.documents.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Traduits</span>
                <span className="font-medium text-emerald-400">
                  {formatNumber(analyticsData.content.documents.translated)} ({Math.round((analyticsData.content.documents.translated / analyticsData.content.documents.total) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Pages</span>
                <span className="font-medium">{formatNumber(analyticsData.content.documents.pages)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance par langue */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5 text-violet-400" />
            Performance multilingue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-400">Langue</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-400">Transcriptions</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-400">Précision</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-400">Statut</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.languages.map((lang, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-2 px-3 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.name}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm">{formatNumber(lang.transcriptions)}</td>
                    <td className="py-2 px-3 text-sm">
                      <span className={lang.accuracy >= 96 ? 'text-emerald-400' : 'text-amber-400'}>
                        {lang.accuracy}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400">
                        Optimal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;