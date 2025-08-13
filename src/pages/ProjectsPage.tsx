import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Search, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'GENERAL',
    language: 'fr'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    // Charger d'abord les projets locaux depuis localStorage
    let localProjects = [];
    try {
      const stored = localStorage.getItem('localProjects');
      if (stored) {
        localProjects = JSON.parse(stored);
        console.log('📂 Projets locaux chargés:', localProjects.length);
      }
    } catch (error) {
      console.log('Pas de projets locaux sauvegardés');
    }

    // Ensuite charger les projets depuis l'API
    fetch('http://localhost:5000/api/projects-test')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Fusionner les projets de l'API avec les projets locaux
          const apiProjects = data.data;
          const allProjects = [...apiProjects, ...localProjects];
          
          // Éliminer les doublons basés sur l'ID
          const uniqueProjects = allProjects.filter((project, index, self) =>
            index === self.findIndex((p) => p.id === project.id)
          );
          
          setProjects(uniqueProjects);
          console.log('✅ Total projets:', uniqueProjects.length);
        } else {
          // Si l'API ne répond pas, utiliser seulement les projets locaux
          setProjects(localProjects);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // En cas d'erreur API, utiliser seulement les projets locaux
        console.log('API non disponible, utilisation des projets locaux');
        setProjects(localProjects);
        setIsLoading(false);
      });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Le nom du projet est requis');
      return;
    }

    setIsCreating(true);
    console.log('🚀 Création locale du projet:', formData);

    // Créer le nouveau projet avec un ID unique
    const newProject = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      description: formData.description || '',
      type: formData.type,
      language: formData.language,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentsCount: 0
    };

    // Ajouter le projet à la liste actuelle
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);

    // Sauvegarder dans localStorage
    try {
      // Récupérer les projets locaux existants
      const existingLocal = JSON.parse(localStorage.getItem('localProjects') || '[]');
      
      // Ajouter le nouveau projet
      const updatedLocal = [...existingLocal, newProject];
      
      // Sauvegarder
      localStorage.setItem('localProjects', JSON.stringify(updatedLocal));
      console.log('💾 Projet sauvegardé localement');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }

    // Essayer quand même de créer sur le serveur (sans bloquer)
    try {
      const response = await fetch('http://localhost:5000/api/projects-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || '',
          type: formData.type,
          language: formData.language,
          status: 'ACTIVE'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Projet également créé sur le serveur:', data);
        
        // Recharger la liste pour synchroniser
        setTimeout(() => fetchProjects(), 1000);
      }
    } catch (error) {
      console.log('⚠️ API non disponible, projet créé localement uniquement');
    }

    // Fermer la modal et réinitialiser
    setShowModal(false);
    setFormData({ name: '', description: '', type: 'GENERAL', language: 'fr' });
    toast.success('Projet créé avec succès !');
    
    setIsCreating(false);
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
        <p className="text-gray-400">Cliquez sur un projet pour voir les détails</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/detail/${project.id}`)}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all relative"
          >
            {/* Badge pour les projets locaux */}
            {project.id.startsWith('local_') && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-600/20 text-yellow-500 text-xs rounded">
                Local
              </span>
            )}
            
            <h3 className="text-xl font-semibold mb-2 text-white">{project.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description || 'Pas de description'}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type: {project.type}</span>
              <span className="text-gray-500">Langue: {project.language?.toUpperCase() || 'FR'}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">Aucun projet trouvé</p>
          <p className="text-sm text-gray-500">
            {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Créez votre premier projet pour commencer'}
          </p>
        </div>
      )}

      {/* Modal de création de projet */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Nouveau Projet</h2>
              <button
                type="button"
                onClick={() => {
                  if (!isCreating) {
                    setShowModal(false);
                    setFormData({ name: '', description: '', type: 'GENERAL', language: 'fr' });
                  }
                }}
                disabled={isCreating}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Ex: Transcription Webinar"
                  disabled={isCreating}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="Description optionnelle..."
                  rows={3}
                  disabled={isCreating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    disabled={isCreating}
                  >
                    <option value="GENERAL">Général</option>
                    <option value="BUSINESS">Business</option>
                    <option value="MEDICAL">Médical</option>
                    <option value="LEGAL">Juridique</option>
                    <option value="EDUCATION">Éducation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Langue
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    disabled={isCreating}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isCreating) {
                      setShowModal(false);
                      setFormData({ name: '', description: '', type: 'GENERAL', language: 'fr' });
                    }
                  }}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Créer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;