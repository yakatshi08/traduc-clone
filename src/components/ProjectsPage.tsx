import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, FileText, Video, Headphones, X } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate?: (page: string, projectId?: number) => void; // Modifié pour accepter projectId
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Données de démonstration améliorées
  const projects = [
    {
      id: 1,
      name: 'Conférence Q4 2024',
      type: 'video',
      status: 'Terminé',
      statusKey: 'completed',
      statusColor: 'text-green-400',
      date: '15/12/2024',
      accuracy: '98.5%',
      duration: '45 min',
      icon: Video
    },
    {
      id: 2,
      name: 'Rapport médical',
      type: 'document',
      status: 'En cours',
      statusKey: 'processing',
      statusColor: 'text-blue-400',
      date: '14/12/2024',
      accuracy: '-',
      duration: '12 pages',
      icon: FileText
    },
    {
      id: 3,
      name: 'Podcast Interview',
      type: 'audio',
      status: 'Prêt',
      statusKey: 'ready',
      statusColor: 'text-yellow-400',
      date: '13/12/2024',
      accuracy: '96.2%',
      duration: '1h 23min',
      icon: Headphones
    },
    {
      id: 4,
      name: 'Présentation client',
      type: 'video',
      status: 'Terminé',
      statusKey: 'completed',
      statusColor: 'text-green-400',
      date: '12/12/2024',
      accuracy: '97.8%',
      duration: '30 min',
      icon: Video
    },
    {
      id: 5,
      name: 'Transcription légale',
      type: 'document',
      status: 'En cours',
      statusKey: 'processing',
      statusColor: 'text-blue-400',
      date: '11/12/2024',
      accuracy: '-',
      duration: '25 pages',
      icon: FileText
    },
    {
      id: 6,
      name: 'Enregistrement formation',
      type: 'audio',
      status: 'Terminé',
      statusKey: 'completed',
      statusColor: 'text-green-400',
      date: '10/12/2024',
      accuracy: '99.1%',
      duration: '2h 15min',
      icon: Headphones
    }
  ];

  // Filtrage avec useMemo pour optimiser les performances
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.statusKey === filterStatus;
      const matchesType = filterType === 'all' || project.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, filterStatus, filterType]);

  // Compteur de filtres actifs
  const activeFiltersCount = [
    filterStatus !== 'all',
    filterType !== 'all'
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setFilterStatus('all');
    setFilterType('all');
    setSearchQuery('');
  };

  return (
    <div className="p-6 pt-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Projets</h1>
        <p className="text-gray-400">{filteredProjects.length} projets trouvés</p>
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
            showFilters 
              ? 'bg-purple-600 border-purple-600 text-white' 
              : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-purple-500 rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
        
        <button 
          onClick={() => onNavigate?.('new-project')}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700" 
             style={{ animation: 'slideDown 0.3s ease-out' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filtres avancés</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Réinitialiser tout
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Statut
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminé</option>
                <option value="processing">En cours</option>
                <option value="ready">Prêt</option>
              </select>
            </div>
            
            {/* Filtre par type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="all">Tous les types</option>
                <option value="document">Document</option>
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grille de projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const Icon = project.icon;
          return (
            <div 
              key={project.id} 
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all hover:scale-[1.02] cursor-pointer border border-gray-700"
              onClick={() => onNavigate?.('project-detail', project.id)} // Modifié pour la navigation
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.date}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Durée:</span>
                  <span className="text-gray-300">{project.duration}</span>
                </div>
                {project.accuracy !== '-' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Précision:</span>
                    <span className="text-gray-300">{project.accuracy}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${project.statusColor}`}>
                  {project.status}
                </span>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Aucun projet trouvé</p>
          <button
            onClick={handleResetFilters}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;