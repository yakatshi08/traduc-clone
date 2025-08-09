import React, { useState } from 'react';
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

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending' | 'archived';
  progress: number;
  language: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  filesCount: number;
  duration: string;
  owner: string;
  team: string[];
  type: 'transcription' | 'translation' | 'both';
  priority: 'low' | 'medium' | 'high';
}

const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Données de démonstration
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Documentation Technique Q4',
      description: 'Transcription et traduction des manuels techniques pour le client international',
      status: 'active',
      progress: 65,
      language: 'Français',
      targetLanguage: 'Anglais',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-08',
      deadline: '2025-01-20',
      filesCount: 12,
      duration: '8h 30min',
      owner: 'John Doe',
      team: ['Marie L.', 'Pierre D.'],
      type: 'both',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Conférence Médicale 2025',
      description: 'Transcription des enregistrements de la conférence annuelle',
      status: 'completed',
      progress: 100,
      language: 'Anglais',
      targetLanguage: 'Français',
      createdAt: '2024-12-15',
      updatedAt: '2025-01-02',
      deadline: '2025-01-01',
      filesCount: 24,
      duration: '15h 45min',
      owner: 'John Doe',
      team: ['Sophie M.'],
      type: 'transcription',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Podcast Série Business',
      description: 'Transcription de la série complète de podcasts sur l\'entrepreneuriat',
      status: 'pending',
      progress: 0,
      language: 'Français',
      targetLanguage: 'Espagnol',
      createdAt: '2025-01-07',
      updatedAt: '2025-01-07',
      deadline: '2025-02-01',
      filesCount: 8,
      duration: '0h 0min',
      owner: 'John Doe',
      team: [],
      type: 'transcription',
      priority: 'low'
    },
    {
      id: '4',
      name: 'Contrats Juridiques International',
      description: 'Traduction urgente de contrats pour expansion internationale',
      status: 'active',
      progress: 35,
      language: 'Français',
      targetLanguage: 'Allemand',
      createdAt: '2025-01-06',
      updatedAt: '2025-01-08',
      deadline: '2025-01-15',
      filesCount: 5,
      duration: '3h 15min',
      owner: 'John Doe',
      team: ['Klaus W.', 'Marie L.'],
      type: 'translation',
      priority: 'high'
    }
  ]);

  // Statistiques
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    totalHours: projects.reduce((acc, p) => {
      const [hours] = p.duration.split('h');
      return acc + parseInt(hours);
    }, 0)
  };

  // Filtrage des projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

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
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Actifs ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Complétés ({stats.completed})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              En attente ({stats.pending})
            </button>
          </div>
        </div>
      )}

      {/* Liste des projets */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
              <div className="p-6">
                {/* En-tête de carte */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {/* Menu dropdown (à implémenter) */}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                    {project.status === 'active' && 'Actif'}
                    {project.status === 'completed' && 'Complété'}
                    {project.status === 'pending' && 'En attente'}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                    {project.type === 'both' ? 'Transcription + Traduction' : 
                     project.type === 'transcription' ? 'Transcription' : 'Traduction'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority === 'high' && '🔴 Urgent'}
                    {project.priority === 'medium' && '🟡 Normal'}
                    {project.priority === 'low' && '🟢 Faible'}
                  </span>
                </div>

                {/* Progression */}
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

                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>{project.language} → {project.targetLanguage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>{project.filesCount} fichiers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

                {/* Équipe */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {project.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    {project.team.slice(0, 2).map((member, index) => (
                      <div key={index} className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium border-2 border-gray-800">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {project.team.length > 2 && (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium border-2 border-gray-800">
                        +{project.team.length - 2}
                      </div>
                    )}
                  </div>

                  {/* Actions rapides */}
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Langues</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Progression</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Échéance</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-400">{project.filesCount} fichiers • {project.duration}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                      {project.status === 'active' && 'Actif'}
                      {project.status === 'completed' && 'Complété'}
                      {project.status === 'pending' && 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {project.type === 'both' ? 'Transcription + Traduction' : 
                       project.type === 'transcription' ? 'Transcription' : 'Traduction'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {project.language} → {project.targetLanguage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
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

      {/* Modal de création (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Nouveau Projet</h2>
            <p className="text-gray-400 mb-6">
              La création de projet sera implémentée prochainement.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;