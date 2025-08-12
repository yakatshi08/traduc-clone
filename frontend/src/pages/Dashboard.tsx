import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NewProjectModal from '../components/Modals/NewProjectModal';
import { Plus } from 'react-feather';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects(); // Rafraîchir la liste des projets
    setIsNewProjectModalOpen(false); // Fermer la modal
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard - {user?.name}</h1>
      
      <div className="mb-6">
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau Projet
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Mes Projets</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div>
              <p className="text-3xl font-bold mb-4">{projects.length} projet(s)</p>
              {projects.map((project: any) => (
                <div key={project.id} className="mt-2 p-2 bg-slate-700 rounded">
                  {project.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewProjectModal 
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard;