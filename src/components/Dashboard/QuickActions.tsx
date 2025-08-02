import React from 'react';
import { 
  Upload, 
  Mic, 
  Link2, 
  FolderOpen,
  Video,
  ArrowRight
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: Upload,
      label: 'Télécharger un fichier',
      description: 'Glissez-déposez ou parcourez',
      color: 'from-violet-600 to-indigo-600'
    },
    {
      icon: Mic,
      label: 'Enregistrer audio',
      description: 'Commencer un nouvel enregistrement',
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: Link2,
      label: 'Importer depuis URL',
      description: 'YouTube, Vimeo, etc.',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: FolderOpen,
      label: 'Parcourir les projets',
      description: 'Voir tous vos projets',
      color: 'from-emerald-600 to-green-600'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-6">Actions rapides</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {action.label}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">{action.description}</p>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg p-4 border border-indigo-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-5 h-5 text-indigo-400" />
            <h4 className="font-medium text-white">Nouvelle fonctionnalité !</h4>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Découvrez notre outil de sous-titrage automatique avec synchronisation IA.
          </p>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            En savoir plus
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;