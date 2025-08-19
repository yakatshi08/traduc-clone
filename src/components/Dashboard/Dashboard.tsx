import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
  Activity,
  Brain,
  Languages,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Mic,
  Video,
  Music,
  FileAudio,
  FileVideo,
  Files,
  Download,
  Upload,
  Settings,
  Bell,
  Star,
  Calendar,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Filter,
  ChevronRight,
  Sparkles,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Server,
  Shield,
  Award,
  TrendingDown,
  Eye,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  RadarChartProps,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { format, startOfWeek, endOfWeek, subDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Types
interface DashboardStats {
  totalProjects: number;
  activeTranscriptions: number;
  completedToday: number;
  accuracy: number;
  processingTime: number;
  totalAudioHours: number;
  totalVideoHours: number;
  totalDocuments: number;
  storageUsed: number;
  storageTotal: number;
  apiCalls: number;
  successRate: number;
  averageWER: number;
  languagesProcessed: string[];
  topSectors: { name: string; value: number; color: string }[];
}

interface Activity {
  id: string;
  type: 'transcription' | 'translation' | 'upload' | 'export' | 'error';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
  user?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface PerformanceMetric {
  timestamp: Date;
  cpu: number;
  memory: number;
  network: number;
  activeJobs: number;
}

// Composant Widget réutilisable
const StatsWidget: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}> = ({ title, value, change, icon, color, trend, onClick }) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${
        onClick ? 'cursor-pointer hover:border-gray-600 transition-all' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-emerald-400' : 
            trend === 'down' ? 'text-red-400' : 
            'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : 
             trend === 'down' ? <ArrowDown className="w-4 h-4" /> : 
             <ArrowRight className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  );
};

// Composant Centre de Notifications
const NotificationCenter: React.FC<{
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}> = ({ notifications, onMarkAsRead, onClearAll }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          Notifications
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-gray-400 hover:text-white"
          >
            Tout effacer
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucune notification
          </p>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg ${
                notif.read ? 'bg-gray-700/50' : 'bg-gray-700'
              } hover:bg-gray-600 cursor-pointer transition-all`}
              onClick={() => onMarkAsRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notif.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(notif.timestamp, 'HH:mm', { locale: fr })}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Composant Principal Dashboard
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Données pour les graphiques
  const [transcriptionData, setTranscriptionData] = useState<any[]>([]);
  const [languageData, setLanguageData] = useState<any[]>([]);
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [processingData, setProcessingData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = isAutoRefresh ? setInterval(loadDashboardData, 30000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh, selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stats générales
      const dashboardStats: DashboardStats = {
        totalProjects: 42,
        activeTranscriptions: 5,
        completedToday: 23,
        accuracy: 97.3,
        processingTime: 2.4,
        totalAudioHours: 1247,
        totalVideoHours: 856,
        totalDocuments: 3492,
        storageUsed: 42.7,
        storageTotal: 100,
        apiCalls: 15823,
        successRate: 99.2,
        averageWER: 2.8,
        languagesProcessed: ['fr', 'en', 'es', 'it', 'de'],
        topSectors: [
          { name: 'Médical', value: 35, color: '#ef4444' },
          { name: 'Juridique', value: 25, color: '#f59e0b' },
          { name: 'Business', value: 20, color: '#10b981' },
          { name: 'Éducation', value: 15, color: '#3b82f6' },
          { name: 'Média', value: 5, color: '#8b5cf6' }
        ]
      };

      // Données de transcription (7 derniers jours)
      const transcriptions = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        transcriptions.push({
          date: format(date, 'dd/MM'),
          audio: Math.floor(Math.random() * 50) + 20,
          video: Math.floor(Math.random() * 30) + 10,
          documents: Math.floor(Math.random() * 40) + 15,
          total: 0
        });
        transcriptions[transcriptions.length - 1].total = 
          transcriptions[transcriptions.length - 1].audio + 
          transcriptions[transcriptions.length - 1].video + 
          transcriptions[transcriptions.length - 1].documents;
      }

      // Données par langue
      const languages = [
        { name: 'Français', value: 45, flag: '🇫🇷' },
        { name: 'English', value: 30, flag: '🇬🇧' },
        { name: 'Español', value: 15, flag: '🇪🇸' },
        { name: 'Italiano', value: 7, flag: '🇮🇹' },
        { name: 'Deutsch', value: 3, flag: '🇩🇪' }
      ];

      // Données de performance
      const performance = [];
      for (let i = 23; i >= 0; i--) {
        performance.push({
          time: `${i}:00`,
          cpu: Math.random() * 40 + 30,
          memory: Math.random() * 30 + 50,
          network: Math.random() * 100,
          jobs: Math.floor(Math.random() * 10)
        });
      }

      // Activités récentes
      const recentActivities: Activity[] = [
        {
          id: '1',
          type: 'transcription',
          title: 'Transcription terminée',
          description: 'Interview_Medical_2025.mp3',
          timestamp: new Date(),
          status: 'success',
          user: 'Dr. Martin'
        },
        {
          id: '2',
          type: 'translation',
          title: 'Traduction en cours',
          description: 'Contract_Legal.pdf → EN, ES',
          timestamp: subDays(new Date(), 0),
          status: 'pending'
        },
        {
          id: '3',
          type: 'upload',
          title: 'Nouveau fichier',
          description: 'Conference_Tech_2025.mp4',
          timestamp: subDays(new Date(), 0),
          status: 'success',
          user: 'Admin'
        },
        {
          id: '4',
          type: 'error',
          title: 'Erreur de traitement',
          description: 'Fichier corrompu: data_backup.zip',
          timestamp: subDays(new Date(), 0),
          status: 'error'
        }
      ];

      // Notifications
      const recentNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Transcription réussie',
          message: '5 nouveaux fichiers transcrits avec succès',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'Espace de stockage',
          message: 'Il reste moins de 20% d\'espace disponible',
          timestamp: subDays(new Date(), 0),
          read: false
        },
        {
          id: '3',
          type: 'info',
          title: 'Mise à jour système',
          message: 'Nouvelle version de Whisper V3 disponible',
          timestamp: subDays(new Date(), 0),
          read: true
        }
      ];

      setStats(dashboardStats);
      setTranscriptionData(transcriptions);
      setLanguageData(languages);
      setSectorData(dashboardStats.topSectors);
      setProcessingData(performance);
      setActivities(recentActivities);
      setNotifications(recentNotifications);
      setPerformanceData(performance.map(p => ({
        timestamp: new Date(),
        cpu: p.cpu,
        memory: p.memory,
        network: p.network,
        activeJobs: p.jobs
      })));

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success('Notifications effacées');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transcription': return <FileText className="w-4 h-4" />;
      case 'translation': return <Languages className="w-4 h-4" />;
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400';
      case 'pending': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Couleurs pour les graphiques
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tableau de Bord TraduckXion
          </h1>
          <p className="text-gray-400">
            Vue d'ensemble de votre activité • {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sélecteur de période */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          
          {/* Auto-refresh */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`p-2 rounded-lg transition-colors ${
              isAutoRefresh 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
            }`}
            title={isAutoRefresh ? 'Désactiver l\'actualisation' : 'Activer l\'actualisation'}
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Bouton refresh manuel */}
          <button
            onClick={loadDashboardData}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          title="Projets actifs"
          value={stats?.totalProjects || 0}
          change={12}
          trend="up"
          icon={<Sparkles className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        
        <StatsWidget
          title="Transcriptions actives"
          value={stats?.activeTranscriptions || 0}
          change={5}
          trend="up"
          icon={<Brain className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-violet-500 to-pink-600"
        />
        
        <StatsWidget
          title="Complétées aujourd'hui"
          value={stats?.completedToday || 0}
          change={23}
          trend="up"
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        
        <StatsWidget
          title="Précision moyenne"
          value={`${stats?.accuracy.toFixed(1)}%` || '0%'}
          change={2.3}
          trend="up"
          icon={<Target className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de transcriptions */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Transcriptions par type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transcriptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Legend />
              <Area type="monotone" dataKey="audio" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Area type="monotone" dataKey="video" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="documents" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique des langues */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            Répartition par langue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métriques IA et Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métriques IA */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            Métriques IA
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">WER moyen</span>
                <span className="font-medium">{stats?.averageWER.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                  style={{ width: `${100 - (stats?.averageWER || 0)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Temps de traitement</span>
                <span className="font-medium">{stats?.processingTime}s</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Taux de succès</span>
                <span className="font-medium">{stats?.successRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full"
                  style={{ width: `${stats?.successRate}%` }}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Modèle IA</span>
                <span className="text-sm font-medium">Whisper V3</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-400">API Calls</span>
                <span className="text-sm font-medium">{stats?.apiCalls.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition par secteur - VERSION CORRIGÉE */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {/* Header avec titre et total */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">
              Répartition des projets par secteur d'activité
            </h3>
            <span className="text-sm text-gray-400">
              Total: <span className="font-semibold text-white">
                {sectorData.reduce((sum, d) => sum + d.value, 0)}
              </span>
            </span>
          </div>

          {/* Graphique Donut centré */}
          <div className="flex justify-center items-center py-4">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value: number, name: string) => {
                    const total = sectorData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = ((value / total) * 100).toFixed(0);
                    return [`${value} (${percentage}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Légende en bas sur 2 lignes */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-4">
            {sectorData.map((item, index) => {
              const total = sectorData.reduce((sum, d) => sum + d.value, 0);
              const percentage = ((item.value / total) * 100).toFixed(0);
              return (
                <div 
                  key={item.name}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">
                    {item.name}{' '}
                    <span className="font-semibold text-white">{item.value}</span>
                    <span className="text-gray-500 text-xs"> · {percentage}%</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Note d'aide */}
          <p className="mt-4 pt-3 border-t border-gray-700/50 text-xs text-gray-500">
            Astuce : survolez un secteur pour voir la valeur exacte et son pourcentage. Les couleurs correspondent à la légende.
          </p>
        </div>

        {/* Stockage et ressources */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            Ressources système
          </h3>
          <div className="space-y-4">
            {/* Stockage */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Stockage</span>
                <span className="font-medium">
                  {stats?.storageUsed.toFixed(1)} / {stats?.storageTotal} GB
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  style={{ width: `${(stats?.storageUsed || 0) / (stats?.storageTotal || 100) * 100}%` }}
                />
              </div>
            </div>
            
            {/* CPU */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">CPU</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  style={{ width: '42%' }}
                />
              </div>
            </div>
            
            {/* Mémoire */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Mémoire</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                  style={{ width: '68%' }}
                />
              </div>
            </div>
            
            {/* Stats totales */}
            <div className="pt-4 border-t border-gray-700 grid grid-cols-2 gap-2">
              <div>
                <p className="text-2xl font-bold">{stats?.totalAudioHours}</p>
                <p className="text-xs text-gray-400">Heures audio</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalVideoHours}</p>
                <p className="text-xs text-gray-400">Heures vidéo</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalDocuments}</p>
                <p className="text-xs text-gray-400">Documents</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.languagesProcessed.length}
                </p>
                <p className="text-xs text-gray-400">Langues</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activités et Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Activités récentes
          </h3>
          <div className="space-y-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
              >
                <div className={`mt-0.5 ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {format(activity.timestamp, 'HH:mm', { locale: fr })}
                    </span>
                    {activity.user && (
                      <>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
                {activity.status === 'pending' && (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                )}
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
            Voir toutes les activités
          </button>
        </div>

        {/* Centre de notifications */}
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onClearAll={handleClearAllNotifications}
        />
      </div>

      {/* Graphique de performance (ligne du bas) */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Performance système (24h)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={processingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="network" stroke="#ec4899" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;