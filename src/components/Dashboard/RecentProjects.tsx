import React from 'react';
import { useTranslation } from 'react-i18next';
import StatsCard from './StatsCard';
import ActivityChart from './ActivityChart';
import ProgressChart from './ProgressChart';
import RecentProjects from './RecentProjects';
import QuickActions from './QuickActions';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard');
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('welcome')}</h1>
        <p className="text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t('stats.totalProjects')}
          value="24"
          change="+12%"
          isPositive={true}
          icon="folder"
        />
        <StatsCard
          title={t('stats.hoursTranscribed')}
          value="156h"
          change="+8%"
          isPositive={true}
          icon="clock"
        />
        <StatsCard
          title={t('stats.accuracy')}
          value="98.5%"
          change="+2%"
          isPositive={true}
          icon="target"
        />
        <StatsCard
          title={t('stats.activeTasks')}
          value="7"
          change="-3%"
          isPositive={false}
          icon="activity"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivityChart />
        <ProgressChart />
      </div>

      {/* Bottom Row - Layout optimisé */}
      <div className="grid grid-cols-1 gap-6">
        {/* Si pas de projets récents, Quick Actions prend toute la largeur */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentProjects />
          </div>
          <div className="xl:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;