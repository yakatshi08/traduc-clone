import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
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

// Types avancés pour TraduckXion
interface TranscriptionMetrics {
  wer: number; // Word Error Rate
  latency: number; // Latence API en ms
  confidence: number; // Niveau de confiance IA
  accuracy: number; // Précision globale
  realTimeLatency: number; // Latence temps réel
  asyncLatency: number; // Latence asynchrone
}

interface ContentAnalytics {
  videos: {
    total: number;
    duration: number;
    transcribed: number;
    subtitled: number;
    formats: { [key: string]: number };
  };
  audios: {
    total: number;
    duration: number;
    transcribed: number;
    formats: { [key: string]: number };
  };
  documents: {
    total: number;
    pages: number;
    translated: number;
    formats: { [key: string]: number };
  };
}

interface SectorMetrics {
  name: string;
  code: string;
  projects: number;
  minutes: number;
  accuracy: number;
  wer: number;
  vocabulary: number; // Vocabulaire spécialisé
  domainAdaptation: number; // Score d'adaptation
  growth: number;
}

interface ExplainableAI {
  feature: string;
  impact: number;
  confidence: number;
  shapValue: number;
  limeScore: number;
  description: string;
}

interface LanguageMetrics {
  code: string;
  name: string;
  flag: string;
  transcriptions: number;
  translations: number;
  duration: number;
  accuracy: number;
  wer: number;
  nmt_quality: number; // Neural Machine Translation quality
}

interface MLModelMetrics {
  model: string;
  version: string;
  accuracy: number;
  latency: number;
  usage: number;
  errorRate: number;
  lastUpdate: string;
}

interface AdvancedAnalyticsData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    totalTranscriptions: number;
    totalTranslations: number;
    totalDuration: number;
    totalSize: number;
    mau: number; // Monthly Active Users
    revenue: number; // Revenue tracking
    apiCalls: number;
    uptime: number;
  };
  kpis: {
    wer: number;
    latency: number;
    accuracy: number;
    nps: number;
    churn: number;
    conversion: number;
    mau_target: number;
    revenue_target: number;
  };
  content: ContentAnalytics;
  languages: LanguageMetrics[];
  sectors: SectorMetrics[];
  explainableAI: ExplainableAI[];
  models: MLModelMetrics[];
  realTimeMetrics: {
    activeTranscriptions: number;
    queueSize: number;
    processingSpeed: number;
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage: number;
  };
  trends: {
    hourly: any[];
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
}

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<'all' | 'video' | 'audio' | 'document'>('all');
  const [analyticsData, setAnalyticsData] = useState<AdvancedAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplainableAI, setShowExplainableAI] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'transcriptions' | 'duration' | 'accuracy' | 'wer'>('transcriptions');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'technical'>('overview');

  // Données pour TraduckXion V2.7
  const generateAdvancedAnalytics = (): AdvancedAnalyticsData => {
    // Générer des tendances temporelles
    const generateTrends = (points: number) => {
      return Array.from({ length: points }, (_, i) => ({
        time: period === 'day' ? `${i}h` : period === 'week' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i] : `Jour ${i + 1}`,
        transcriptions: Math.floor(Math.random() * 100) + 50,
        translations: Math.floor(Math.random() * 80) + 30,
        videos: Math.floor(Math.random() * 30) + 10,
        audios: Math.floor(Math.random() * 40) + 15,
        documents: Math.floor(Math.random() * 25) + 5,
        wer: 3.0 + Math.random() * 1.5,
        latency: 120 + Math.random() * 60,
        accuracy: 94 + Math.random() * 4,
        confidence: 90 + Math.random() * 8
      }));
    };

    return {
      overview: {
        totalProjects: 245,
        activeProjects: 127,
        totalTranscriptions: 44200,
        totalTranslations: 28500,
        totalDuration: 2652000, // en secondes
        totalSize: 52428800000, // en bytes
        mau: 2847,
        revenue: 85410, // en euros
        apiCalls: 1250000,
        uptime: 99.97
      },
      kpis: {
        wer: 3.2, // < 4% objectif atteint
        latency: 145, // < 200ms objectif atteint
        accuracy: 96.8,
        nps: 68, // > 60 objectif atteint
        churn: 4.2, // < 5% objectif atteint
        conversion: 9.3, // > 8% objectif atteint
        mau_target: 20000,
        revenue_target: 3000000
      },
      content: {
        videos: {
          total: 12450,
          duration: 892800, // secondes
          transcribed: 11200,
          subtitled: 8900,
          formats: { 'mp4': 8200, 'avi': 2100, 'mov': 1500, 'webm': 650 }
        },
        audios: {
          total: 18600,
          duration: 1116000, // secondes
          transcribed: 17800,
          formats: { 'mp3': 12000, 'wav': 4200, 'm4a': 1800, 'flac': 600 }
        },
        documents: {
          total: 8750,
          pages: 125000,
          translated: 7200,
          formats: { 'pdf': 5200, 'docx': 2100, 'txt': 900, 'srt': 550 }
        }
      },
      languages: [
        { code: 'fr', name: 'Français', flag: '🇫🇷', transcriptions: 15470, translations: 9282, duration: 530280, accuracy: 97.2, wer: 3.0, nmt_quality: 94.5 },
        { code: 'en', name: 'English', flag: '🇬🇧', transcriptions: 13260, translations: 7956, duration: 454320, accuracy: 96.8, wer: 3.2, nmt_quality: 93.8 },
        { code: 'es', name: 'Español', flag: '🇪🇸', transcriptions: 6630, translations: 3978, duration: 227160, accuracy: 96.5, wer: 3.3, nmt_quality: 92.5 },
        { code: 'it', name: 'Italiano', flag: '🇮🇹', transcriptions: 5304, translations: 3182, duration: 181680, accuracy: 96.3, wer: 3.4, nmt_quality: 92.0 },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', transcriptions: 3536, translations: 2102, duration: 121080, accuracy: 96.0, wer: 3.5, nmt_quality: 91.5 }
      ],
      sectors: [
        { name: 'Médical', code: 'medical', projects: 45, minutes: 136667, accuracy: 97.2, wer: 2.8, vocabulary: 12500, domainAdaptation: 95, growth: 12 },
        { name: 'Juridique', code: 'legal', projects: 38, minutes: 113333, accuracy: 96.8, wer: 3.0, vocabulary: 8900, domainAdaptation: 92, growth: 8 },
        { name: 'Business', code: 'business', projects: 62, minutes: 206667, accuracy: 96.5, wer: 3.2, vocabulary: 6500, domainAdaptation: 88, growth: 15 },
        { name: 'Éducation', code: 'education', projects: 54, minutes: 160000, accuracy: 96.9, wer: 3.1, vocabulary: 5200, domainAdaptation: 90, growth: 20 },
        { name: 'Média', code: 'media', projects: 41, minutes: 120000, accuracy: 96.4, wer: 3.3, vocabulary: 4800, domainAdaptation: 85, growth: 5 }
      ],
      explainableAI: [
        { feature: 'Qualité audio', impact: 85, confidence: 92, shapValue: 0.82, limeScore: 0.88, description: 'Impact majeur sur la précision de transcription' },
        { feature: 'Langue source', impact: 78, confidence: 90, shapValue: 0.75, limeScore: 0.80, description: 'Détermine le modèle IA optimal' },
        { feature: 'Vocabulaire technique', impact: 72, confidence: 88, shapValue: 0.70, limeScore: 0.74, description: 'Nécessite adaptation domaine' },
        { feature: 'Vitesse élocution', impact: 65, confidence: 85, shapValue: 0.63, limeScore: 0.67, description: 'Affecte la segmentation' },
        { feature: 'Accent régional', impact: 60, confidence: 83, shapValue: 0.58, limeScore: 0.62, description: 'Requiert fine-tuning' },
        { feature: 'Bruit de fond', impact: 55, confidence: 80, shapValue: 0.53, limeScore: 0.57, description: 'Nécessite débruitage' }
      ],
      models: [
        { model: 'Whisper v3', version: '3.0.1', accuracy: 97.2, latency: 120, usage: 45, errorRate: 2.8, lastUpdate: '2025-01-10' },
        { model: 'Deepgram', version: '2.5.0', accuracy: 96.5, latency: 95, usage: 25, errorRate: 3.5, lastUpdate: '2025-01-08' },
        { model: 'Custom NMT', version: '1.8.2', accuracy: 94.8, latency: 150, usage: 20, errorRate: 5.2, lastUpdate: '2025-01-12' },
        { model: 'ElevenLabs', version: '1.2.0', accuracy: 95.5, latency: 180, usage: 10, errorRate: 4.5, lastUpdate: '2025-01-05' }
      ],
      realTimeMetrics: {
        activeTranscriptions: 42,
        queueSize: 127,
        processingSpeed: 2.5, // x faster than real-time
        cpuUsage: 68,
        memoryUsage: 72,
        gpuUsage: 85
      },
      trends: {
        hourly: generateTrends(24),
        daily: generateTrends(7),
        weekly: generateTrends(4),
        monthly: generateTrends(12)
      }
    };
  };

  useEffect(() => {
    loadAnalyticsData();
    // Mise à jour temps réel toutes les 30 secondes
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [period, selectedLanguage, selectedSector, selectedContent]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement depuis l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateAdvancedAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'json' | 'pdf' | 'excel') => {
    if (!analyticsData) return;
    
    toast.loading(`Export ${format.toUpperCase()} en cours...`);
    
    try {
      switch (format) {
        case 'csv':
          exportToCSV();
          break;
        case 'json':
          exportToJSON();
          break;
        case 'pdf':
          exportToPDF();
          break;
        case 'excel':
          exportToExcel();
          break;
      }
      toast.success(`Export ${format.toUpperCase()} réussi`);
    } catch (error) {
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
    }
  };

  const exportToCSV = () => {
    if (!analyticsData) return;
    
    const headers = [
      'Métrique', 'Valeur', 'Objectif', 'Statut'
    ];
    
    const rows = [
      ['WER', `${analyticsData.kpis.wer}%`, '< 4%', analyticsData.kpis.wer < 4 ? '✅' : '❌'],
      ['Latence API', `${analyticsData.kpis.latency}ms`, '< 200ms', analyticsData.kpis.latency < 200 ? '✅' : '❌'],
      ['Précision', `${analyticsData.kpis.accuracy}%`, '> 95%', analyticsData.kpis.accuracy > 95 ? '✅' : '❌'],
      ['MAU', analyticsData.overview.mau.toString(), '20000', analyticsData.overview.mau > 20000 ? '✅' : '⏳'],
      ['NPS', analyticsData.kpis.nps.toString(), '> 60', analyticsData.kpis.nps > 60 ? '✅' : '❌'],
      ['Churn', `${analyticsData.kpis.churn}%`, '< 5%', analyticsData.kpis.churn < 5 ? '✅' : '❌'],
      ['Uptime', `${analyticsData.overview.uptime}%`, '> 99.9%', analyticsData.overview.uptime > 99.9 ? '✅' : '❌']
    ];
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traducxion-analytics-${period}-${Date.now()}.csv`;
    a.click();
  };

  const exportToJSON = () => {
    if (!analyticsData) return;
    
    const json = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traducxion-analytics-${period}-${Date.now()}.json`;
    a.click();
  };

  const exportToPDF = () => {
    // Implémentation avec jsPDF ou similaire
    toast.info('Export PDF complet disponible en version Pro');
  };

  const exportToExcel = () => {
    // Implémentation avec SheetJS ou similaire
    toast.info('Export Excel complet disponible en version Enterprise');
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

  const formatSize = (bytes: number): string => {
    const tb = bytes / (1024 ** 4);
    if (tb >= 1) return `${tb.toFixed(2)} TB`;
    const gb = bytes / (1024 ** 3);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 ** 2);
    return `${mb.toFixed(2)} MB`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getStatusColor = (value: number, target: number, inverse: boolean = false): string => {
    const success = inverse ? value < target : value > target;
    return success ? 'text-emerald-400' : 'text-amber-400';
  };

  const getStatusIcon = (value: number, target: number, inverse: boolean = false) => {
    const success = inverse ? value < target : value > target;
    return success ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-400 mt-4">Chargement des analytics TraduckXion...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12 bg-slate-900 min-h-screen">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-400">Erreur de chargement des données</p>
        <button 
          onClick={loadAnalyticsData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header Avancé */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Analytics Dashboard - TraduckXion V2.7
            </h1>
            <p className="text-slate-400">
              Intelligence artificielle • Transcription multimodale • {analyticsData.overview.mau} utilisateurs actifs
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sélecteur de vue */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              {(['overview', 'detailed', 'technical'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded transition-all ${
                    viewMode === mode
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode === 'overview' && 'Vue d\'ensemble'}
                  {mode === 'detailed' && 'Détaillé'}
                  {mode === 'technical' && 'Technique'}
                </button>
              ))}
            </div>

            {/* Période */}
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="day">24 heures</option>
              <option value="week">7 jours</option>
              <option value="month">30 jours</option>
              <option value="year">12 mois</option>
            </select>

            {/* Filtres */}
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">Toutes langues</option>
              {analyticsData.languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>

            <select 
              value={selectedContent}
              onChange={(e) => setSelectedContent(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tous contenus</option>
              <option value="video">📹 Vidéos</option>
              <option value="audio">🎵 Audios</option>
              <option value="document">📄 Documents</option>
            </select>

            {/* Actions */}
            <button
              onClick={loadAnalyticsData}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <div className="relative group">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button onClick={() => exportData('csv')} className="w-full px-4 py-2 text-left hover:bg-slate-700 rounded-t-lg flex items-center gap-2">
                  <FileDown className="w-4 h-4" /> CSV
                </button>
                <button onClick={() => exportData('json')} className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2">
                  <FileDown className="w-4 h-4" /> JSON
                </button>
                <button onClick={() => exportData('pdf')} className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2">
                  <FileDown className="w-4 h-4" /> PDF
                </button>
                <button onClick={() => exportData('excel')} className="w-full px-4 py-2 text-left hover:bg-slate-700 rounded-b-lg flex items-center gap-2">
                  <FileDown className="w-4 h-4" /> Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Principaux - Alignés cahier des charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
        {/* WER < 4% */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-6 h-6 text-emerald-100" />
              {getStatusIcon(4, analyticsData.kpis.wer, true)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.kpis.wer}%</div>
            <div className="text-sm text-emerald-100">WER</div>
            <div className="text-xs text-emerald-200 mt-1">Objectif &lt; 4%</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500 rounded-full opacity-20"></div>
        </div>

        {/* Latence < 200ms */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-violet-100" />
              {getStatusIcon(200, analyticsData.kpis.latency, true)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.kpis.latency}ms</div>
            <div className="text-sm text-violet-100">Latence API</div>
            <div className="text-xs text-violet-200 mt-1">Objectif &lt; 200ms</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-violet-500 rounded-full opacity-20"></div>
        </div>

        {/* MAU */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-indigo-100" />
              <span className="text-xs text-indigo-200">
                {((analyticsData.overview.mau / analyticsData.kpis.mau_target) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.mau)}</div>
            <div className="text-sm text-indigo-100">MAU</div>
            <div className="text-xs text-indigo-200 mt-1">Cible: 20k</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500 rounded-full opacity-20"></div>
        </div>

        {/* Uptime */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Server className="w-6 h-6 text-green-100" />
              {getStatusIcon(analyticsData.overview.uptime, 99.9)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.overview.uptime}%</div>
            <div className="text-sm text-green-100">Uptime</div>
            <div className="text-xs text-green-200 mt-1">SLA &gt; 99.9%</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500 rounded-full opacity-20"></div>
        </div>

        {/* NPS */}
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-amber-100" />
              {getStatusIcon(analyticsData.kpis.nps, 60)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.kpis.nps}</div>
            <div className="text-sm text-amber-100">NPS Score</div>
            <div className="text-xs text-amber-200 mt-1">Cible &gt; 60</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500 rounded-full opacity-20"></div>
        </div>

        {/* Churn */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-6 h-6 text-red-100" />
              {getStatusIcon(5, analyticsData.kpis.churn, true)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.kpis.churn}%</div>
            <div className="text-sm text-red-100">Churn</div>
            <div className="text-xs text-red-200 mt-1">Cible &lt; 5%</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500 rounded-full opacity-20"></div>
        </div>

        {/* Conversion */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-purple-100" />
              {getStatusIcon(analyticsData.kpis.conversion, 8)}
            </div>
            <div className="text-2xl font-bold">{analyticsData.kpis.conversion}%</div>
            <div className="text-sm text-purple-100">Conversion</div>
            <div className="text-xs text-purple-200 mt-1">Cible &gt; 8%</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500 rounded-full opacity-20"></div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-blue-100" />
              <span className="text-xs text-blue-200">+15%</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.revenue)}€</div>
            <div className="text-sm text-blue-100">Revenue</div>
            <div className="text-xs text-blue-200 mt-1">Cible: 3M€/an</div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Métriques de contenu multimodal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Vidéos */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" />
              Vidéos
            </h3>
            <span className="text-2xl">📹</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold">{formatNumber(analyticsData.content.videos.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transcrites</span>
              <span className="font-semibold text-emerald-400">
                {formatNumber(analyticsData.content.videos.transcribed)} ({((analyticsData.content.videos.transcribed / analyticsData.content.videos.total) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sous-titrées</span>
              <span className="font-semibold text-indigo-400">
                {formatNumber(analyticsData.content.videos.subtitled)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Durée totale</span>
              <span className="font-semibold">{formatDuration(analyticsData.content.videos.duration)}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Formats</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analyticsData.content.videos.formats).map(([format, count]) => (
                  <div key={format} className="flex justify-between text-xs">
                    <span className="text-slate-500">.{format}</span>
                    <span>{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audios */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music className="w-5 h-5 text-violet-400" />
              Audios
            </h3>
            <span className="text-2xl">🎵</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold">{formatNumber(analyticsData.content.audios.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transcrits</span>
              <span className="font-semibold text-emerald-400">
                {formatNumber(analyticsData.content.audios.transcribed)} ({((analyticsData.content.audios.transcribed / analyticsData.content.audios.total) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Durée totale</span>
              <span className="font-semibold">{formatDuration(analyticsData.content.audios.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vitesse moy.</span>
              <span className="font-semibold">2.5x temps réel</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Formats</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analyticsData.content.audios.formats).map(([format, count]) => (
                  <div key={format} className="flex justify-between text-xs">
                    <span className="text-slate-500">.{format}</span>
                    <span>{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Documents
            </h3>
            <span className="text-2xl">📄</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold">{formatNumber(analyticsData.content.documents.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Traduits</span>
              <span className="font-semibold text-emerald-400">
                {formatNumber(analyticsData.content.documents.translated)} ({((analyticsData.content.documents.translated / analyticsData.content.documents.total) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pages totales</span>
              <span className="font-semibold">{formatNumber(analyticsData.content.documents.pages)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Moy. pages/doc</span>
              <span className="font-semibold">{Math.round(analyticsData.content.documents.pages / analyticsData.content.documents.total)}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Formats</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(analyticsData.content.documents.formats).map(([format, count]) => (
                  <div key={format} className="flex justify-between text-xs">
                    <span className="text-slate-500">.{format}</span>
                    <span>{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tendances multimétriques */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Évolution des métriques clés
            </h3>
            <div className="flex gap-2">
              {(['transcriptions', 'wer', 'latency', 'accuracy'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    selectedMetric === metric
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {metric === 'transcriptions' && 'Volume'}
                  {metric === 'wer' && 'WER'}
                  {metric === 'latency' && 'Latence'}
                  {metric === 'accuracy' && 'Précision'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={analyticsData.trends.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              {selectedMetric === 'transcriptions' && (
                <>
                  <Bar dataKey="videos" stackId="a" fill="#6366f1" name="Vidéos" />
                  <Bar dataKey="audios" stackId="a" fill="#8b5cf6" name="Audios" />
                  <Bar dataKey="documents" stackId="a" fill="#10b981" name="Documents" />
                </>
              )}
              {selectedMetric === 'wer' && (
                <Line type="monotone" dataKey="wer" stroke="#ef4444" name="WER (%)" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              )}
              {selectedMetric === 'latency' && (
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" name="Latence (ms)" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              )}
              {selectedMetric === 'accuracy' && (
                <Area type="monotone" dataKey="accuracy" fill="#10b981" stroke="#10b981" fillOpacity={0.3} name="Précision (%)" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition linguistique avancée */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Languages className="w-5 h-5 text-violet-400" />
              Performance multilingue
            </h3>
            <button
              onClick={() => setShowExplainableAI(!showExplainableAI)}
              className="text-xs px-2 py-1 bg-slate-700 rounded hover:bg-slate-600"
            >
              {showExplainableAI ? 'Masquer IA' : 'Voir Explainable AI'}
            </button>
          </div>
          
          {!showExplainableAI ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analyticsData.languages}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name="Précision" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Radar name="Qualité NMT" dataKey="nmt_quality" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="space-y-3">
              {analyticsData.explainableAI.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{item.feature}</span>
                    <span className="text-xs text-slate-500">{item.impact}% impact</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">SHAP</span>
                        <span>{(item.shapValue * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                          style={{ width: `${item.shapValue * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">LIME</span>
                        <span>{(item.limeScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-violet-400"
                          style={{ width: `${item.limeScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analyse sectorielle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance par secteur */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Performance par secteur d'activité
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analyticsData.sectors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="projects" fill="#6366f1" name="Projets" />
              <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" name="Précision (%)" />
              <Bar yAxisId="left" dataKey="domainAdaptation" fill="#8b5cf6" name="Adaptation (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Modèles IA en production */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            Modèles IA en production
          </h3>
          <div className="space-y-4">
            {analyticsData.models.map((model, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{model.model}</span>
                    <span className="text-xs text-slate-500 ml-2">v{model.version}</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                    {model.usage}% usage
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Précision:</span>
                    <span className="ml-1 font-medium">{model.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Latence:</span>
                    <span className="ml-1 font-medium">{model.latency}ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Erreurs:</span>
                    <span className="ml-1 font-medium text-amber-400">{model.errorRate}%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Dernière mise à jour: {model.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques temps réel */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Métriques temps réel
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{analyticsData.realTimeMetrics.activeTranscriptions}</div>
            <div className="text-sm text-slate-400">Transcriptions actives</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{analyticsData.realTimeMetrics.queueSize}</div>
            <div className="text-sm text-slate-400">File d'attente</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">{analyticsData.realTimeMetrics.processingSpeed}x</div>
            <div className="text-sm text-slate-400">Vitesse traitement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-400">{analyticsData.realTimeMetrics.cpuUsage}%</div>
            <div className="text-sm text-slate-400">CPU</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{analyticsData.realTimeMetrics.memoryUsage}%</div>
            <div className="text-sm text-slate-400">RAM</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{analyticsData.realTimeMetrics.gpuUsage}%</div>
            <div className="text-sm text-slate-400">GPU</div>
          </div>
        </div>
      </div>

      {/* Tableau de synthèse détaillé */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Synthèse détaillée par langue et secteur</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Langue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Transcriptions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Traductions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Durée</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">WER</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Précision</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">NMT Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.languages.map((lang, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{lang.flag}</span>
                      {lang.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{formatNumber(lang.transcriptions)}</td>
                  <td className="py-3 px-4 text-sm">{formatNumber(lang.translations)}</td>
                  <td className="py-3 px-4 text-sm">{formatDuration(lang.duration)}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={lang.wer <= 3.2 ? 'text-emerald-400' : 'text-amber-400'}>
                      {lang.wer}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={lang.accuracy >= 96 ? 'text-emerald-400' : 'text-amber-400'}>
                      {lang.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{lang.nmt_quality}%</td>
                  <td className="py-3 px-4 text-sm">
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
  );
};

export default AnalyticsPage;