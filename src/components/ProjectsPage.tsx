import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Plus,
  Grid,
  List,
  Calendar,
  Clock,
  FileText,
  MoreVertical
} from 'lucide-react';

interface ProjectsPageProps {
  onProjectClick: (projectId: number) => void;
  onNewProject: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onProjectClick, onNewProject }) => {
  const { t } = useTranslation('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: 1,
      name: "Conférence Q4 2024",
      date: "15/12/2024",
      duration: "45 min",
      status: "completed",
      accuracy: 98.5,
      type: "video"
    },
    {
      id: 2,
      name: "Rapport médical",
      date: "14/12/2024",
      pages: 12,
      status: "processing",
      type: "document"
    },
    {
      id: 3,
      name: "Podcast Interview",
      date: "13/12/2024",
      duration: "1h 23min",
      status: "ready",
      accuracy: 96.2,
      type: "audio"
    },
    {
      id: 4,
      name: "Présentation client",
      date: "12/12/2024",
      duration: "30 min",
      status: "completed",
      accuracy: 99.1,
      type: "video"
    },
    {
      id: 5,
      name: "Transcription légale",
      date: "11/12/2024",
      pages: 45,
      status: "processing",
      type: "document"
    },
    {
      id: 6,
      name: "Enregistrement formation",
      date: "10/12/2024",
      duration: "2h 15min",
      status: "ready",
      accuracy: 97.8,
      type: "audio"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return t('status.completed');
      case 'processing':
        return t('status.processing');
      case 'ready':
        return t('status.ready');
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6"> {/* SUPPRIMÉ ml-64 */}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">{t('projectsFound', { count: filteredProjects.length })}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('filters')}
          </button>
          
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={onNewProject}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#8b5cf6' }}
          >
            <Plus className="w-4 h-4" />
            {t('newProject')}
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onProjectClick(project.id)}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    project.type === 'video' ? 'bg-blue-500/20' :
                    project.type === 'audio' ? 'bg-purple-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      project.type === 'video' ? 'text-blue-400' :
                      project.type === 'audio' ? 'text-purple-400' :
                      'text-orange-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.date}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{t('duration')}:</span>
                  <span className="text-white">{project.duration || `${project.pages} pages`}</span>
                </div>
                
                {project.accuracy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t('accuracy')}:</span>
                    <span className="text-white">{project.accuracy}%</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-700">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('duration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('accuracy')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id}
                  onClick={() => onProjectClick(project.id)}
                  className="hover:bg-gray-750 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{project.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{project.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{project.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {project.duration || `${project.pages} pages`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {project.accuracy ? `${project.accuracy}%` : '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;