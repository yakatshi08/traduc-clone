import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Zap,
  Upload,
  FolderOpen,
  Clock,
  CheckCircle,
  Activity,
  FileText,
  Video,
  Headphones,
  MoreVertical
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentProject from './RecentProject';
import ActivityChart from './ActivityChart';

const Dashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common']);

  const stats = [
    {
      title: t('dashboard:cards.totalProjects.title'),
      value: '1,247',
      change: '+12%',
      changeLabel: t('dashboard:cards.totalProjects.change', { value: 12 }),
      icon: FolderOpen,
      color: 'from-violet-600 to-indigo-600',
      bgColor: 'bg-violet-500/10'
    },
    {
      title: t('dashboard:cards.inProgress.title'),
      value: '23',
      change: '5',
      changeLabel: t('dashboard:cards.inProgress.subtitle', { count: 5 }),
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: t('dashboard:cards.completed.title'),
      value: '1,224',
      change: '+8%',
      changeLabel: t('dashboard:cards.completed.change', { value: 8 }),
      icon: CheckCircle,
      color: 'from-emerald-600 to-green-600',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: t('dashboard:cards.accuracy.title'),
      value: '96.2%',
      change: '+0.3%',
      changeLabel: t('dashboard:cards.accuracy.change', { value: 0.3 }),
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Conférence Q4 2024',
      type: 'video' as const,
      status: 'completed' as const,
      progress: 100,
      date: '15 Dec 2024',
      size: '125 MB'
    },
    {
      id: 2,
      name: 'Interview Client ABC',
      type: 'audio' as const,
      status: 'processing' as const,
      progress: 65,
      date: '14 Dec 2024',
      size: '45 MB'
    },
    {
      id: 3,
      name: 'Rapport médical 2024',
      type: 'document' as const,
      status: 'ready' as const,
      progress: 100,
      date: '13 Dec 2024',
      size: '2.5 MB'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            {t('dashboard:welcome.title')}
          </h1>
          <p className="text-violet-100 text-lg mb-6 max-w-2xl">
            {t('dashboard:welcome.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{t('dashboard:welcome.stats.users', { count: '20K' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>{t('dashboard:welcome.stats.languages', { count: 5 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>{t('dashboard:welcome.stats.accuracy', { value: 4 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-violet-500 transition-colors group">
            <div className="w-16 h-16 mx-auto mb-4 bg-violet-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('dashboard:upload.title', 'Glissez vos fichiers ici')}
            </h3>
            <p className="text-gray-400 mb-4">
              {t('dashboard:upload.subtitle', 'ou cliquez pour parcourir')}
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
              {t('dashboard:upload.button', 'Sélectionner des fichiers')}
            </button>
          </div>

          {/* Activity Chart */}
          <ActivityChart />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('dashboard:quickActions.title')}
            </h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 rounded-xl text-left transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t('dashboard:quickActions.newTranscription')}</p>
                    <p className="text-sm text-gray-400">{t('dashboard:quickActions.transcriptionDesc', 'Commencer une nouvelle transcription')}</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 rounded-xl text-left transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t('dashboard:quickActions.connectDrive')}</p>
                    <p className="text-sm text-gray-400">{t('dashboard:quickActions.cloudProviders')}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t('dashboard:quickActions.recentProjects')}
              </h3>
              <button className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <RecentProject key={project.id} {...project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;