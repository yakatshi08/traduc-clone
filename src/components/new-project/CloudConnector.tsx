import React, { useState } from 'react';
import { X, Cloud, FolderOpen } from 'lucide-react';

interface CloudConnectorProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: any[]) => void;
  provider: string;
}

const CloudConnector: React.FC<CloudConnectorProps> = ({
  isOpen,
  onClose,
  onFilesSelected,
  provider
}) => {
  const [isConnected] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-6 h-6 text-violet-400" />
            Connexion à {provider}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-6">
              Connectez-vous à {provider} pour accéder à vos fichiers
            </p>
            <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
              Se connecter
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400">Liste des fichiers...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudConnector;
