import React from 'react';
import { FileText, Video, Headphones, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getTypeIcon = () => {
    switch (project.type) {
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      default:
        return FileText;
    }
  };

  const getStatusIcon = () => {
    switch (project.status) {
      case 'completed':
        return CheckCircle;
      case 'processing':
        return Loader;
      case 'error':
        return AlertCircle;
      case 'ready':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'completed':
        return 'text-emerald-400';
      case 'processing':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      case 'ready':
        return 'text-emerald-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case 'ready':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Prêt
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Terminé
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Erreur
          </span>
        );
      default:
        return null;
    }
  };

  const TypeIcon = getTypeIcon();
  const StatusIcon = getStatusIcon();

  return (
    <div 
      className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer hover:shadow-lg"
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-violet-500/20">
            <TypeIcon className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{project.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(project.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Langue source</span>
          <span className="text-white">{project.language.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Secteur</span>
          <span className="text-white capitalize">{project.sector}</span>
        </div>

        {project.accuracy && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Précision</span>
            <span className="text-emerald-400">{project.accuracy}%</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Statut</span>
          <div className="flex items-center space-x-1">
            <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
            <span className="text-white capitalize">{project.status}</span>
          </div>
        </div>
      </div>

      {project.targetLanguages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-400 mb-2">Langues cibles</p>
          <div className="flex flex-wrap gap-1">
            {project.targetLanguages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300"
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;