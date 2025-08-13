import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  BarChart3
} from 'lucide-react';
// import NewProjectModal from '../components/Modals/NewProjectModal'; // Commenté comme demandé
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'ARCHIVED';
  type: 'GENERAL' | 'BUSINESS' | 'MEDICAL' | 'LEGAL' | 'EDUCATION';
  language: string;
  createdAt: string;
  updatedAt?: string;
  documentsCount?: number;
  progress?: number;
  targetLanguage?: string;
  deadline?: string;
  filesCount?: number;
  duration?: string;
  owner?: string;
  team?: string[];
  priority?: 'low' | 'medium' | 'high';
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les vrais projets depuis l'API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Essayer d'abord avec la route de test (sans auth)
      const response = await fetch('http://localhost:5000/api/projects-test');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Mapper les données de l'API vers notre format
        const mappedProjects = data.data.map((p: any) => ({
          id: p.id,
          name: p.name || 'Projet sans nom',
          description: p.description || '',
          status: p.status || 'ACTIVE',
          type: p.type || 'GENERAL',
          language: p.language || 'fr',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          documentsCount: p.documentsCount || 0,
          progress: Math.floor(Math.random() * 100), // Simulé pour l'instant
          targetLanguage: 'en',
          filesCount: p.documentsCount || 0,
          duration: '0h 0min',
          owner: 'Vous',
          team: [],
          priority: 'medium'
        }));
        
        setProjects(mappedProjects);
      } else {
        // Si l'API ne répond pas, utiliser des données de démo
        setProjects(getDemoProjects());
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      // En cas d'erreur, utiliser des données de démo
      setProjects(getDemoProjects());
    } finally {
      setIsLoading(false);
    }
  };

  // Données de démonstration (fallback)
  const getDemoProjects = (): Project[] => [
    {
      id: '1',
      name: 'Documentation Technique Q4',
      description: 'Transcription et traduction des manuels techniques pour le client international',
      status: 'ACTIVE',
      progress: 65,
      language: 'fr',
      targetLanguage: 'en',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-08',
      deadline: '2025-01-20',
      filesCount: 12,
      duration: '8h 30min',
      owner: 'John Doe',
      team: ['Marie L.', 'Pierre D.'],
      type: 'BUSINESS',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Conférence Médicale 2025',
      description: 'Transcription des enregistrements de la conférence annuelle',
      status: 'COMPLETED',
      progress: 100,
      language: 'en',
      targetLanguage: 'fr',
      createdAt: '2024-12-15',
      updatedAt: '2025-01-02',
      deadline: '2025-01-01',
      filesCount: 24,
      duration: '15h 45min',
      owner: 'John Doe',
      team: ['Sophie M.'],
      type: 'MEDICAL',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Podcast Série Business',
      description: 'Transcription de la série complète de podcasts sur l\'entrepreneuriat',
      status: 'PENDING',
      progress: 0,
      language: 'fr',
      targetLanguage: 'es',
      createdAt: '2025-01-07',
      updatedAt: '2025-01-07',
      deadline: '2025-02-01',
      filesCount: 8,
      duration: '0h 0min',
      owner: 'John Doe',
      team: [],
      type: 'GENERAL',
      priority: 'low'
    }
  ];

  // IMPORTANT : Utiliser la bonne route pour naviguer
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/detail/${projectId}`); // Route corrigée !
  };

  // Callback quand un projet est créé
  const handleProjectCreated = () => {
    setShowCreateModal(false);
    fetchProjects(); // Recharger la liste
    toast.success('Projet créé avec succès !');
  };

  // Statistiques
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => p.status === 'PENDING').length,
    totalHours: projects.reduce((acc, p) => {
      if (p.duration) {
        const [hours] = p.duration.split('h');
        return acc + parseInt(hours) || 0;
      }
      return acc;
    }, 0)
  };

  // Filtrage des projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'ARCHIVED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'Actif';
      case 'COMPLETED': return 'Complété';
      case 'PENDING': return 'En attente';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des projets...</p>
        </div>
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
            <Timer className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">{stats.totalHours}h</span>
          </div>
          <p className="text-gray-400">Heures totales</p>
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

      {/* Liste des projets - Vue grille */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="p-6">
                {/* En-tête de carte */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                    {getStatusText(project.status)}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                    {project.type}
                  </span>
                </div>

                {/* Progression */}
                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Progression</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>{project.language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>{project.documentsCount || 0} fichiers</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-400">{project.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{project.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{project.language.toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{project.documentsCount || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message si aucun projet */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">Aucun projet trouvé</p>
          <p className="text-sm text-gray-500">Créez votre premier projet pour commencer</p>
        </div>
      )}

      {/* Modal de création temporaire */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Nouveau Projet</h2>
            <p className="text-gray-400 mb-6">
              Fonctionnalité en cours de développement...
            </p>
            <button
              onClick={() => {
                setShowCreateModal(false);
                toast.success('Création de projet bientôt disponible !');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;