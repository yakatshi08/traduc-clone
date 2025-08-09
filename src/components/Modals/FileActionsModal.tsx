import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Edit,
  Trash2,
  Copy,
  Move,
  Archive,
  Link,
  Mail,
  Users,
  CheckCircle
} from 'lucide-react';

interface FileActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: 'document' | 'video' | 'audio';
  onAction: (action: string) => void;
}

const FileActionsModal: React.FC<FileActionsModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileType,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'share'>('actions');
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAction = (action: string) => {
    onAction(action);
    // Simuler l'action
    if (action === 'download') {
      // Simuler le téléchargement
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();
    }
    setTimeout(() => onClose(), 500);
  };

  const handleCopyLink = () => {
    // Simuler la copie du lien
    navigator.clipboard.writeText(`https://traducxion.com/share/${fileName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    console.log('Partage avec:', shareEmail, shareMessage);
    onAction('share');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Actions</h2>
              <p className="text-sm text-gray-400 mt-1">{fileName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'actions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Actions
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'share'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Partager
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'actions' && (
            <div className="space-y-2">
              <button
                onClick={() => handleAction('view')}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <Edit className="w-5 h-5 text-gray-400" />
                <span>Ouvrir dans l'éditeur</span>
              </button>

              <button
                onClick={() => handleAction('download')}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <Download className="w-5 h-5 text-gray-400" />
                <span>Télécharger</span>
              </button>

              <button
                onClick={() => handleAction('duplicate')}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <Copy className="w-5 h-5 text-gray-400" />
                <span>Dupliquer</span>
              </button>

              <button
                onClick={() => handleAction('move')}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <Move className="w-5 h-5 text-gray-400" />
                <span>Déplacer vers un projet</span>
              </button>

              <button
                onClick={() => handleAction('archive')}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3"
              >
                <Archive className="w-5 h-5 text-gray-400" />
                <span>Archiver</span>
              </button>

              <div className="pt-2 mt-2 border-t border-gray-700">
                <button
                  onClick={() => handleAction('delete')}
                  className="w-full p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              {/* Lien de partage */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Lien de partage
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`https://traducxion.com/share/${fileName.replace(/\s+/g, '-')}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Partage par email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Partager par email
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Ajouter un message..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleShare}
                disabled={!shareEmail}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Envoyer
              </button>

              {/* Permissions */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Personnes ayant accès
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                        JD
                      </div>
                      <span className="text-sm">John Doe (vous)</span>
                    </div>
                    <span className="text-xs text-gray-400">Propriétaire</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileActionsModal;