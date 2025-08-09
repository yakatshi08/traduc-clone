import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Edit,
  Share2,
  Eye,
  MoreVertical,
  Folder,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileX,
  ChevronDown,
  X,
  Copy,
  Move,
  Archive
} from 'lucide-react';
import UploadModal from '../components/Modals/UploadModal';
import FileActionsModal from '../components/Modals/FileActionsModal'; // AJOUT IMPORT

interface Document {
  id: string;
  name: string;
  type: 'transcription' | 'translation' | 'original';
  format: string;
  size: string;
  createdAt: string;
  modifiedAt: string;
  status: 'completed' | 'processing' | 'error';
  language: string;
  duration?: string;
  wordCount?: number;
  projectId?: string;
  projectName?: string;
  sharedWith?: string[];
}

const DocumentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false); // AJOUT ÉTAT
  const [selectedFile, setSelectedFile] = useState<Document | null>(null); // AJOUT ÉTAT

  // Données de démonstration
  const documents: Document[] = [
    {
      id: '1',
      name: 'Rapport_Q4_2024_Transcription.docx',
      type: 'transcription',
      format: 'DOCX',
      size: '2.4 MB',
      createdAt: '2025-01-08',
      modifiedAt: '2025-01-08',
      status: 'completed',
      language: 'Français',
      duration: '45:32',
      wordCount: 8543,
      projectId: '1',
      projectName: 'Documentation Technique Q4'
    },
    {
      id: '2',
      name: 'Conference_Medicale_EN.pdf',
      type: 'translation',
      format: 'PDF',
      size: '5.8 MB',
      createdAt: '2025-01-07',
      modifiedAt: '2025-01-07',
      status: 'completed',
      language: 'Anglais',
      wordCount: 12890,
      projectId: '2',
      projectName: 'Conférence Médicale 2025'
    },
    {
      id: '3',
      name: 'Podcast_Episode_15.txt',
      type: 'transcription',
      format: 'TXT',
      size: '156 KB',
      createdAt: '2025-01-06',
      modifiedAt: '2025-01-06',
      status: 'processing',
      language: 'Français',
      duration: '32:18'
    },
    {
      id: '4',
      name: 'Contrat_Client_DE.docx',
      type: 'original',
      format: 'DOCX',
      size: '890 KB',
      createdAt: '2025-01-05',
      modifiedAt: '2025-01-06',
      status: 'completed',
      language: 'Allemand',
      wordCount: 3456,
      sharedWith: ['marie.laurent@company.com', 'pierre.dupont@company.com']
    },
    {
      id: '5',
      name: 'Video_Formation_Subtitles.srt',
      type: 'transcription',
      format: 'SRT',
      size: '45 KB',
      createdAt: '2025-01-04',
      modifiedAt: '2025-01-04',
      status: 'error',
      language: 'Espagnol',
      duration: '1:23:45'
    }
  ];

  // Statistiques
  const stats = {
    total: documents.length,
    transcriptions: documents.filter(d => d.type === 'transcription').length,
    translations: documents.filter(d => d.type === 'translation').length,
    totalSize: '125.6 MB',
    recentlyModified: documents.filter(d => {
      const modDate = new Date(d.modifiedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return modDate > weekAgo;
    }).length
  };

  // Filtrage
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  // Fonctions
  const handleSelectDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map(d => d.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transcription': return 'bg-blue-600/20 text-blue-400';
      case 'translation': return 'bg-purple-600/20 text-purple-400';
      case 'original': return 'bg-gray-600/20 text-gray-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-gray-400">Gérez tous vos documents transcrits et traduits</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Documents totaux</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.transcriptions}</p>
              <p className="text-sm text-gray-400">Transcriptions</p>
            </div>
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.translations}</p>
              <p className="text-sm text-gray-400">Traductions</p>
            </div>
            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalSize}</p>
              <p className="text-sm text-gray-400">Espace utilisé</p>
            </div>
            <Folder className="w-8 h-8 text-gray-500" />
          </div>
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
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtres */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="transcription">Transcriptions</option>
            <option value="translation">Traductions</option>
            <option value="original">Originaux</option>
          </select>
        </div>

        <div className="flex gap-4">
          {/* Actions groupées */}
          {selectedDocs.length > 0 && (
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="px-3 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

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

          {/* Upload */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Importer
          </button>
        </div>
      </div>

      {/* Selection bar */}
      {selectedDocs.length > 0 && (
        <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/50 rounded-lg flex items-center justify-between">
          <span className="text-sm">
            {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} sélectionné{selectedDocs.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setSelectedDocs([])}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Désélectionner tout
          </button>
        </div>
      )}

      {/* Liste des documents */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className={`bg-gray-800 rounded-lg border ${
                selectedDocs.includes(doc.id) ? 'border-blue-500' : 'border-gray-700'
              } hover:border-gray-600 transition-all`}
            >
              <div className="p-4">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => handleSelectDoc(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{doc.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(doc.type)}`}>
                          {doc.type === 'transcription' ? 'Transcription' : 
                           doc.type === 'translation' ? 'Traduction' : 'Original'}
                        </span>
                        <span className="text-xs text-gray-500">{doc.format}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Infos */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Taille</span>
                    <span>{doc.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Langue</span>
                    <span>{doc.language}</span>
                  </div>
                  {doc.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Durée</span>
                      <span>{doc.duration}</span>
                    </div>
                  )}
                  {doc.wordCount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Mots</span>
                      <span>{doc.wordCount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Statut</span>
                    <div className={`flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      <span className="text-sm">
                        {doc.status === 'completed' && 'Terminé'}
                        {doc.status === 'processing' && 'En cours'}
                        {doc.status === 'error' && 'Erreur'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projet */}
                {doc.projectName && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400">Projet</p>
                    <p className="text-sm text-blue-400">{doc.projectName}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedFile(doc);
                      setShowActionsModal(true);
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors flex items-center justify-center gap-1">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
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
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === filteredDocuments.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Taille</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Modifié</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => handleSelectDoc(doc.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      {doc.projectName && (
                        <p className="text-sm text-gray-400">{doc.projectName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(doc.type)}`}>
                      {doc.type === 'transcription' ? 'Transcription' : 
                       doc.type === 'translation' ? 'Traduction' : 'Original'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{doc.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(doc.modifiedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      <span className="text-sm">
                        {doc.status === 'completed' && 'Terminé'}
                        {doc.status === 'processing' && 'En cours'}
                        {doc.status === 'error' && 'Erreur'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedFile(doc);
                          setShowActionsModal(true);
                        }}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
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

      {/* Message vide */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">Aucun document trouvé</p>
          <p className="text-sm text-gray-500">Importez vos premiers documents pour commencer</p>
        </div>
      )}

      {/* MODAL UPLOAD FONCTIONNEL */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="document"
        onUpload={(files) => {
          console.log('Fichiers uploadés:', files);
          // Ici vous pouvez ajouter la logique pour traiter les fichiers
          // Par exemple, les ajouter à la liste des documents
        }}
      />

      {/* MODAL ACTIONS */}
      {showActionsModal && selectedFile && (
        <FileActionsModal
          isOpen={showActionsModal}
          onClose={() => setShowActionsModal(false)}
          fileName={selectedFile.name}
          fileType="document"
          onAction={(action) => {
            console.log('Action:', action);
            // Ici vous pouvez gérer les différentes actions
          }}
        />
      )}
    </div>
  );
};

export default DocumentsPage;