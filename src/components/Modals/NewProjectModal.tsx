import React, { useState } from 'react';
import { X, Loader2, FolderPlus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onProjectCreated 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'GENERAL',
    language: 'fr'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('❌ Le nom du projet est requis', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: 'white',
          fontWeight: 'bold'
        }
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Notification de succès améliorée
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-lg font-bold text-white">
                    Projet créé avec succès ! 🎉
                  </p>
                  <p className="mt-1 text-sm text-green-100">
                    "{formData.name}" a été ajouté à votre liste de projets.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-green-400">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none"
              >
                Fermer
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-center'
        });
        
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          description: '',
          type: 'GENERAL',
          language: 'fr'
        });
        
        // Fermer la modal
        onClose();
        
        // Appeler le callback ou rafraîchir
        if (onProjectCreated) {
          setTimeout(() => {
            onProjectCreated();
          }, 500);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        toast.error(`❌ ${data.message || 'Erreur lors de la création du projet'}`, {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#ef4444',
            color: 'white',
            fontWeight: 'bold'
          }
        });
      }
    } catch (error) {
      console.error('❌ Erreur création projet:', error);
      toast.error('❌ Impossible de créer le projet. Vérifiez votre connexion.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'GENERAL',
      language: 'fr'
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Nouveau Projet</h2>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom du projet */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom du projet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="Ex: Transcription Webinar Q4"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
              <span className="text-gray-500 text-xs ml-2">(optionnel)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              placeholder="Description optionnelle du projet..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Type et Langue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de projet
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <option value="GENERAL">📁 Général</option>
                <option value="BUSINESS">💼 Business</option>
                <option value="MEDICAL">🏥 Médical</option>
                <option value="LEGAL">⚖️ Juridique</option>
                <option value="EDUCATION">🎓 Éducation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Langue principale
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>

          {/* Message d'information */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
            <p className="text-xs text-indigo-300">
              💡 Vous pourrez ajouter des fichiers et configurer les paramètres de transcription après la création du projet.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  Créer le projet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Ajouter les animations CSS si nécessaire
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default NewProjectModal;