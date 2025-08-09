import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  FileText,
  Users,
  Clock,
  Globe,
  DollarSign,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronDown,
  FileSpreadsheet,
  File,
  Printer,
  Share2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

type Period = '7d' | '30d' | '90d' | '12m' | 'custom';
type ChartType = 'revenue' | 'usage' | 'projects' | 'languages';

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('30d');
  const [activeChart, setActiveChart] = useState<ChartType>('revenue');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Données de démonstration
  const revenueData = [
    { date: '01 Jan', revenue: 4500, projets: 12 },
    { date: '05 Jan', revenue: 5200, projets: 15 },
    { date: '10 Jan', revenue: 4800, projets: 13 },
    { date: '15 Jan', revenue: 6100, projets: 18 },
    { date: '20 Jan', revenue: 5900, projets: 17 },
    { date: '25 Jan', revenue: 7200, projets: 22 },
    { date: '30 Jan', revenue: 6800, projets: 20 }
  ];

  const usageData = [
    { name: 'Transcription', heures: 156, pourcentage: 65 },
    { name: 'Traduction', caracteres: 850000, pourcentage: 35 }
  ];

  const languagesData = [
    { langue: 'Français', projets: 45, couleur: '#3B82F6' },
    { langue: 'Anglais', projets: 38, couleur: '#8B5CF6' },
    { langue: 'Espagnol', projets: 22, couleur: '#10B981' },
    { langue: 'Allemand', projets: 18, couleur: '#F59E0B' },
    { langue: 'Italien', projets: 12, couleur: '#EF4444' },
    { langue: 'Autres', projets: 15, couleur: '#6B7280' }
  ];

  const projectsData = [
    { mois: 'Août', completés: 32, enCours: 8, nouveaux: 15 },
    { mois: 'Sept', completés: 28, enCours: 12, nouveaux: 18 },
    { mois: 'Oct', completés: 35, enCours: 10, nouveaux: 20 },
    { mois: 'Nov', completés: 42, enCours: 15, nouveaux: 25 },
    { mois: 'Déc', completés: 38, enCours: 13, nouveaux: 22 },
    { mois: 'Jan', completés: 45, enCours: 18, nouveaux: 28 }
  ];

  // KPIs
  const kpis = {
    revenue: {
      current: 38400,
      previous: 32100,
      change: 19.6,
      trend: 'up'
    },
    projects: {
      current: 150,
      previous: 118,
      change: 27.1,
      trend: 'up'
    },
    avgDuration: {
      current: '3h 24min',
      previous: '4h 12min',
      change: -19.0,
      trend: 'down'
    },
    satisfaction: {
      current: 4.8,
      previous: 4.6,
      change: 4.3,
      trend: 'up'
    }
  };

  // Fonction pour obtenir la couleur selon la tendance
  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  // Fonction d'export
  const handleExport = (format: 'csv' | 'pdf' | 'print') => {
    console.log(`Export en ${format}`);
    setShowExportMenu(false);
    // Implémenter la logique d'export ici
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-400">Analysez vos performances et tendances</p>
        </div>

        <div className="flex gap-4">
          {/* Sélecteur de période */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
              <Calendar className="w-4 h-4" />
              <span>
                {selectedPeriod === '7d' && '7 derniers jours'}
                {selectedPeriod === '30d' && '30 derniers jours'}
                {selectedPeriod === '90d' && '90 derniers jours'}
                {selectedPeriod === '12m' && '12 derniers mois'}
                {selectedPeriod === 'custom' && 'Personnalisé'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Bouton rafraîchir */}
          <button className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Menu export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-10">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                >
                  <File className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(kpis.revenue.trend)}`}>
              {getTrendIcon(kpis.revenue.trend)}
              <span className="text-sm font-medium">+{kpis.revenue.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{kpis.revenue.current.toLocaleString()}€</h3>
          <p className="text-sm text-gray-400">Revenus totaux</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(kpis.projects.trend)}`}>
              {getTrendIcon(kpis.projects.trend)}
              <span className="text-sm font-medium">+{kpis.projects.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{kpis.projects.current}</h3>
          <p className="text-sm text-gray-400">Projets complétés</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(kpis.avgDuration.trend)}`}>
              {getTrendIcon(kpis.avgDuration.trend)}
              <span className="text-sm font-medium">{kpis.avgDuration.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{kpis.avgDuration.current}</h3>
          <p className="text-sm text-gray-400">Durée moyenne</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor(kpis.satisfaction.trend)}`}>
              {getTrendIcon(kpis.satisfaction.trend)}
              <span className="text-sm font-medium">+{kpis.satisfaction.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{kpis.satisfaction.current}/5</h3>
          <p className="text-sm text-gray-400">Satisfaction client</p>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique principal (2 colonnes) */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Évolution des revenus</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChart('revenue')}
                className={`px-3 py-1 rounded text-sm ${
                  activeChart === 'revenue' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Revenus
              </button>
              <button
                onClick={() => setActiveChart('projects')}
                className={`px-3 py-1 rounded text-sm ${
                  activeChart === 'projects' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Projets
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Area
                type="monotone"
                dataKey={activeChart === 'revenue' ? 'revenue' : 'projets'}
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par langue - VERSION AMÉLIORÉE */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Langues populaires</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={languagesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ langue, projets }) => `${langue}: ${projets}`}
                outerRadius={100}  // Augmentation du rayon
                fill="#8884d8"
                dataKey="projets"
              >
                {languagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => `${value} projets`}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
                formatter={(value, entry: any) => `${value}: ${entry.payload.projets}`}
                wrapperStyle={{
                  paddingLeft: '20px',
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation des services */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Utilisation des services</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Transcription</span>
                <span className="font-medium">{usageData[0].heures}h ({usageData[0].pourcentage}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${usageData[0].pourcentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Traduction</span>
                <span className="font-medium">{(usageData[1].caracteres / 1000).toFixed(0)}k car. ({usageData[1].pourcentage}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: `${usageData[1].pourcentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-medium mb-4">Top utilisateurs</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                    JD
                  </div>
                  <span className="text-sm">John Doe</span>
                </div>
                <span className="text-sm text-gray-400">42 projets</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
                    ML
                  </div>
                  <span className="text-sm">Marie Laurent</span>
                </div>
                <span className="text-sm text-gray-400">38 projets</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm">
                    PD
                  </div>
                  <span className="text-sm">Pierre Dupont</span>
                </div>
                <span className="text-sm text-gray-400">35 projets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Évolution des projets */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Évolution des projets</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mois" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="completés" fill="#10B981" />
              <Bar dataKey="enCours" fill="#F59E0B" />
              <Bar dataKey="nouveaux" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">45</p>
              <p className="text-sm text-gray-400">Complétés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">18</p>
              <p className="text-sm text-gray-400">En cours</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">28</p>
              <p className="text-sm text-gray-400">Nouveaux</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-600/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Générer un rapport personnalisé
            </h3>
            <p className="text-gray-400">
              Créez des rapports détaillés avec vos métriques préférées
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Partager
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Créer un rapport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;