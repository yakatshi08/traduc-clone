import React, { useEffect, useState } from 'react';
import { Clock, Folder, MoreVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  lastModified?: string;
  status?: string;
}

const RecentProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setProjects(data.data);
          console.log('Projets chargés depuis API:', data.data);
        }
      }
    } catch (error) {
      console.error('Erreur API, utilisation des données mockées:', error);
      // Données mockées en fallback
      setProjects([
        { 
          id: '1', 
          name: 'Documentation Technique Q4',
          description: 'Documentation technique du Q4',
          progress: 75,
          lastModified: '2 heures',
          status: 'En cours'
        },
        { 
          id: '2', 
          name: 'Conférence Médicale 2025',
          description: 'Transcription de la conférence',
          progress: 45,
          lastModified: '5 heures',
          status: 'En cours'
        },
        { 
          id: '3', 
          name: 'Podcast Série Business',
          description: 'Série de podcasts business',
          progress: 90,
          lastModified: '1 jour',
          status: 'Presque terminé'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Projets Récents</h2>
        <button className="text-gray-400 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucun projet trouvé</p>
          <p className="text-gray-500 text-sm mt-1">Créez votre premier projet pour commencer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                  )}
                </div>
                {project.progress !== undefined && (
                  <span className="text-purple-400 text-sm font-medium ml-4">
                    {project.progress}%
                  </span>
                )}
              </div>
              
              {project.progress !== undefined && (
                <div className="w-full bg-slate-600 rounded-full h-1.5 mb-3">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>{project.lastModified || 'Récemment'}</span>
                {project.status && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{project.status}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          Voir tous les projets →
        </button>
      </div>
    </div>
  );
};

export default RecentProjects;
