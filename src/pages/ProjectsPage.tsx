import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlayCircle,
  Calendar,
  FileText,
  Globe,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Share2,
  Archive,
  TrendingUp,
  Users,
  Languages,
  Timer,
  BarChart3,
  Loader2
} from 'lucide-react';
import NewProjectModal from '../components/Modals/NewProjectModal';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  type: string;
  language: string;
  sector?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  documentsCount?: number;
  _count?: {
    documents: number;
  };
}

const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les projets depuis l'API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      const data = await response.json();
      console.log('Projets reçus:', data);
      
      if (data.success && data.data) {
        setProjects(data.data);
      } else {
        toast.error('Erreur lors du chargement des projets');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les projets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fonction après création de projet
  const handleProjectCreated = () => {
    fetchProjects();
    setShowCreateModal(false);
  };

  // Statistiques
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => p.status === 'PENDING').length,
    totalDocuments: projects.reduce((acc, p) => acc + (p.documentsCount || p._count?.documents || 0), 0)
  };

  // Filtrage des projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'ARCHIVED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'COMPLETED': return 'Complété';
      case 'PENDING': return 'En attente';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  };

  // Fonction pour obtenir l'icône du type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUSINESS': return '💼';
      case 'MEDICAL': return '🏥';
      case 'LEGAL': return '⚖️';
      case 'EDUCATION': return '🎓';
      default: return '📁';
    }
  };

  // Fonction pour obtenir le texte du type
  const getTypeText = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'Général';
      case 'BUSINESS': return 'Business';
      case 'MEDICAL': return 'Médical';
      case 'LEGAL': return 'Juridique';
      case 'EDUCATION': return 'Éducation';
      default: return type;
    }
  };

  // Fonction pour supprimer un projet
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        toast.success('Projet supprimé avec succès');
        fetchProjects();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de supprimer le projet');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
        <p className="text-gray-400">Gérez vos projets de transcription et de traduction</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <FolderOpen className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-gray-400">Projets totaux</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <PlayCircle className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">{stats.active}</span>
          </div>
          <p className="text-gray-400">Projets actifs</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{stats.completed}</span>
          </div>
          <p className="text-gray-400">Complétés</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">{stats.totalDocuments}</span>
          </div>
          <p className="text-gray-400">Documents</p>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        <div className="flex gap-4">
          {/* Vue */}
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Nouveau projet */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Projet
          </button>
        </div>
      </div>

      {/* Filtres étendus */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tous ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Actifs ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'COMPLETED' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Complétés ({stats.completed})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              En attente ({stats.pending})
            </button>
          </div>
        </div>
      )}

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">
            {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre premier projet pour commencer'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Créer un projet
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const documentsCount = project.documentsCount || project._count?.documents || 0;
            
            return (
              <div key={project.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
                <div className="p-6">
                  {/* En-tête de carte */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getTypeIcon(project.type)}</span>
                        <h3 className="text-xl font-semibold">{project.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {project.description || 'Pas de description'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                      {getStatusText(project.status)}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                      {getTypeText(project.type)}
                    </span>
                    {project.sector && (
                      <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-400">
                        {project.sector}
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4" />
                      <span>{project.language?.toUpperCase() || 'FR'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{documentsCount} documents</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vue liste */
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Projet</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Langue</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Documents</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Créé le</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const documentsCount = project.documentsCount || project._count?.documents || 0;
                
                return (
                  <tr key={project.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>{getTypeIcon(project.type)}</span>
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-400">{project.description || 'Pas de description'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                        {getStatusText(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{getTypeText(project.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{project.language?.toUpperCase() || 'FR'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{documentsCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">
                        {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-600 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de création */}
      <NewProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default ProjectsPage;