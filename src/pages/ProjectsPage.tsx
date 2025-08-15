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
  Loader2,
  FolderPlus,
  X,
  Copy,
  Check,
  Link2,
  Mail
} from 'lucide-react';
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
  userId?: string;
  documentsCount?: number;
  _count?: {
    documents: number;
  };
}

interface NewProjectData {
  name: string;
  description: string;
  type: string;
  language: string;
}

// Composant Modal de Création
const CreateProjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}> = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState<NewProjectData>({
    name: '',
    description: '',
    type: 'GENERAL',
    language: 'fr'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Le nom du projet est obligatoire');
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            onProjectCreated(data.data);
            toast.success(`Projet "${formData.name}" créé avec succès !`);
            setFormData({ name: '', description: '', type: 'GENERAL', language: 'fr' });
            onClose();
            return;
          }
        }
      }

      // Si l'API échoue, créer localement
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        language: formData.language,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documentsCount: 0
      };

      const existingProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      const updatedProjects = [newProject, ...existingProjects];
      localStorage.setItem('localProjects', JSON.stringify(updatedProjects));

      onProjectCreated(newProject);
      toast.success(`Projet "${formData.name}" créé avec succès !`);
      setFormData({ name: '', description: '', type: 'GENERAL', language: 'fr' });
      onClose();

    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du projet');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Nouveau Projet</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Interviews Clients 2025"
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && formData.name.trim()) {
                  handleCreate();
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-gray-500 text-xs">(optionnel)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre projet..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de projet</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GENERAL">📁 Général</option>
                <option value="MEDICAL">🏥 Médical</option>
                <option value="LEGAL">⚖️ Juridique</option>
                <option value="EDUCATION">🎓 Éducation</option>
                <option value="BUSINESS">💼 Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Langue principale</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="pt">🇵🇹 Português</option>
                <option value="auto">🌍 Détection auto</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <span className="text-lg">💡</span>
              Vous pourrez ajouter des fichiers et configurer les paramètres de transcription après la création du projet.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!formData.name.trim() || isCreating}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              formData.name.trim() && !isCreating
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                Créer le projet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Modal d'Édition
const EditProjectModal: React.FC<{
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
}> = ({ isOpen, project, onClose, onProjectUpdated }) => {
  const [formData, setFormData] = useState<NewProjectData>({
    name: '',
    description: '',
    type: 'GENERAL',
    language: 'fr'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        type: project.type,
        language: project.language
      });
    }
  }, [project]);

  const handleUpdate = async () => {
    if (!formData.name.trim() || !project) {
      toast.error('Le nom du projet est obligatoire');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedProject: Project = {
        ...project,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour dans localStorage
      const localProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      const updatedProjects = localProjects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      );
      localStorage.setItem('localProjects', JSON.stringify(updatedProjects));

      onProjectUpdated(updatedProject);
      toast.success(`Projet "${formData.name}" mis à jour avec succès !`);
      onClose();

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du projet');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Éditer le Projet</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-gray-500 text-xs">(optionnel)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de projet</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="GENERAL">📁 Général</option>
                <option value="MEDICAL">🏥 Médical</option>
                <option value="LEGAL">⚖️ Juridique</option>
                <option value="EDUCATION">🎓 Éducation</option>
                <option value="BUSINESS">💼 Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Langue principale</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="pt">🇵🇹 Português</option>
                <option value="auto">🌍 Détection auto</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            disabled={!formData.name.trim() || isUpdating}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              formData.name.trim() && !isUpdating
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Modal de Partage
const ShareProjectModal: React.FC<{
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}> = ({ isOpen, project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link');
  const [email, setEmail] = useState('');

  if (!isOpen || !project) return null;

  const shareUrl = `${window.location.origin}/projects/${project.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success('Lien copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      toast.error('Impossible de copier le lien');
    });
  };

  const handleEmailShare = () => {
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    const subject = encodeURIComponent(`Projet partagé : ${project.name}`);
    const body = encodeURIComponent(`Bonjour,\n\nJe souhaite partager avec vous le projet "${project.name}".\n\nLien d'accès : ${shareUrl}\n\nCordialement`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    
    toast.success('Email de partage ouvert !');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Partager le Projet</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">{project.name}</h3>
          <p className="text-sm text-gray-400">{project.description || 'Pas de description'}</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShareMethod('link')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              shareMethod === 'link' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Lien
          </button>
          <button
            onClick={() => setShareMethod('email')}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              shareMethod === 'email' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>

        {shareMethod === 'link' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lien de partage</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
              <p className="text-sm text-blue-400">
                💡 Ce lien permet d'accéder au projet en lecture seule
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={handleEmailShare}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Envoyer par email
            </button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Principal
const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les projets depuis l'API ou localStorage
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/projects', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setProjects(data.data);
              return;
            }
          }
        } catch (apiError) {
          console.log('API non disponible, utilisation du mode local');
        }
      }

      // Fallback sur localStorage
      const localProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      setProjects(localProjects);
      
    } catch (error) {
      console.error('Erreur:', error);
      const localProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      setProjects(localProjects);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fonction après création de projet
  const handleProjectCreated = (newProject: Project) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setShowCreateModal(false);
  };

  // Fonction après mise à jour de projet
  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    setShowEditModal(false);
    setSelectedProject(null);
  };

  // Fonction pour éditer un projet
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  // Fonction pour partager un projet
  const handleShareProject = (project: Project) => {
    setSelectedProject(project);
    setShowShareModal(true);
  };

  // Fonction pour supprimer un projet
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
            toast.success('Projet supprimé avec succès');
            return;
          }
        } catch (apiError) {
          console.log('Suppression via API échouée, suppression locale');
        }
      }

      // Suppression locale
      const localProjects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      const updatedProjects = localProjects.filter((p: Project) => p.id !== projectId);
      localStorage.setItem('localProjects', JSON.stringify(updatedProjects));
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      toast.success('Projet supprimé avec succès');
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de supprimer le projet');
    }
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

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'ARCHIVED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'COMPLETED': return 'Complété';
      case 'PENDING': return 'En attente';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUSINESS': return '💼';
      case 'MEDICAL': return '🏥';
      case 'LEGAL': return '⚖️';
      case 'EDUCATION': return '🎓';
      default: return '📁';
    }
  };

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

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        <div className="flex gap-4">
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
                      className="p-1 hover:bg-gray-700 rounded group"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                    </button>
                  </div>

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

                  {/* Actions CORRIGÉES */}
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                      title="Éditer"
                    >
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                    <button 
                      onClick={() => handleShareProject(project)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                      title="Partager"
                    >
                      <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
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
                        <button 
                          onClick={() => handleEditProject(project)}
                          className="p-1 hover:bg-gray-600 rounded group"
                          title="Éditer"
                        >
                          <Edit className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleShareProject(project)}
                          className="p-1 hover:bg-gray-600 rounded group"
                          title="Partager"
                        >
                          <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1 hover:bg-gray-600 rounded"
                          title="Supprimer"
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

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />

      <EditProjectModal
        isOpen={showEditModal}
        project={selectedProject}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        onProjectUpdated={handleProjectUpdated}
      />

      <ShareProjectModal
        isOpen={showShareModal}
        project={selectedProject}
        onClose={() => {
          setShowShareModal(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default ProjectsPage;