import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Eye,
  Trash2,
  Edit3,
  MoreVertical,
  FolderOpen,
  Grid,
  List,
  CheckSquare,
  Square,
  File,
  FileSpreadsheet,
  FileImage,
  Calendar,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes: number;
  uploadDate: string;
  modifiedDate: string;
  status: 'ready' | 'processing' | 'transcribing' | 'error';
  transcribed: boolean;
  translated: boolean;
  languages: string[];
  owner: string;
  shared: boolean;
  tags: string[];
}

const DocumentsPage: React.FC = () => {
  console.log("DOCUMENTS PAGE LOADED!"); // AJOUT IMPORTANT
  const { t } = useTranslation('documents'); // AJOUT

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données simulées
  const documents: Document[] = [
    {
      id: '1',
      name: 'Rapport_Annuel_2024.pdf',
      type: 'pdf',
      size: '2.4 MB',
      sizeBytes: 2400000,
      uploadDate: '2024-12-15',
      modifiedDate: '2024-12-16',
      status: 'ready',
      transcribed: true,
      translated: true,
      languages: ['FR', 'EN', 'ES'],
      owner: 'Marie Dupont',
      shared: true,
      tags: ['finance', 'rapport', '2024']
    },
    {
      id: '2',
      name: 'Contrat_Client_ABC.docx',
      type: 'docx',
      size: '156 KB',
      sizeBytes: 156000,
      uploadDate: '2024-12-14',
      modifiedDate: '2024-12-14',
      status: 'processing',
      transcribed: false,
      translated: false,
      languages: ['FR'],
      owner: 'Jean Martin',
      shared: false,
      tags: ['contrat', 'juridique']
    },
    {
      id: '3',
      name: 'Présentation_Projet.pptx',
      type: 'pptx',
      size: '8.7 MB',
      sizeBytes: 8700000,
      uploadDate: '2024-12-13',
      modifiedDate: '2024-12-15',
      status: 'ready',
      transcribed: true,
      translated: false,
      languages: ['FR'],
      owner: 'Marie Dupont',
      shared: true,
      tags: ['présentation', 'projet']
    },
    {
      id: '4',
      name: 'Notes_Réunion_Q4.txt',
      type: 'txt',
      size: '24 KB',
      sizeBytes: 24000,
      uploadDate: '2024-12-12',
      modifiedDate: '2024-12-12',
      status: 'ready',
      transcribed: true,
      translated: true,
      languages: ['FR', 'EN'],
      owner: 'Sophie Bernard',
      shared: true,
      tags: ['réunion', 'notes']
    },
    {
      id: '5',
      name: 'Analyse_Marché_2024.xlsx',
      type: 'xlsx',
      size: '1.1 MB',
      sizeBytes: 1100000,
      uploadDate: '2024-12-10',
      modifiedDate: '2024-12-11',
      status: 'transcribing',
      transcribed: false,
      translated: false,
      languages: ['FR'],
      owner: 'Pierre Durand',
      shared: false,
      tags: ['analyse', 'marché', 'données']
    }
  ];

  // Filtrage et tri
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.sizeBytes - b.sizeBytes;
          break;
        case 'uploadDate':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'modifiedDate':
          comparison = new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-400';
      case 'processing':
      case 'transcribing':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return t("ready");
      case 'processing':
        return t("processing");
      case 'transcribing':
        return t("transcribing");
      case 'error':
        return t("error");
      default:
        return status;
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Action ${action} sur ${selectedDocuments.length} documents`);
    // Implémenter les actions en masse
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title', 'Documents')}</h1>
        <p className="text-gray-400">{t('subtitle', 'Gérez vos documents et fichiers texte')}</p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("searchPlaceholder", "Rechercher par nom ou tag...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Vue */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              {t('filters', 'Filtres')}
            </button>

            {/* Upload */}
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Upload className="w-4 h-4" />
              {t('import', 'Importer')}
            </button>
          </div>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t("type")}</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t("allTypes")}</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">Word</option>
                  <option value="xlsx">Excel</option>
                  <option value="txt">{t("text", "Texte")}</option>
                  <option value="pptx">PowerPoint</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t("status")}</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t("allStatuses")}</option>
                  <option value="ready">{t("ready")}</option>
                  <option value="processing">{t("processing")}</option>
                  <option value="transcribing">{t("transcribing")}</option>
                  <option value="error">{t("error")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="uploadDate">Date d'upload</option>
                  <option value="modifiedDate">Date de modification</option>
                  <option value="name">{t("name")}</option>
                  <option value="size">{t("size")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t("order")}</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-gray-600"
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <SortAsc className="w-4 h-4" />
                      Croissant
                    </>
                  ) : (
                    <>
                      <SortDesc className="w-4 h-4" />
                      Décroissant
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions de sélection */}
      {selectedDocuments.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
          <span className="text-blue-400">
            {t('documentsSelected', { count: selectedDocuments.length })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('download')}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
            >
              Télécharger
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Supprimer
            </button>
            <button
              onClick={() => setSelectedDocuments([])}
              className="px-3 py-1 text-gray-400 hover:text-white text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des documents */}
      {viewMode === 'grid' ? (
        // Vue Grille
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all border ${
                selectedDocuments.includes(doc.id) ? 'border-purple-500' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <button
                  onClick={() => toggleDocumentSelection(doc.id)}
                  className="text-gray-400 hover:text-white"
                >
                  {selectedDocuments.includes(doc.id) ? (
                    <CheckSquare className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <DropdownMenu docId={doc.id} />
              </div>

              <div className="flex flex-col items-center text-center mb-4">
                <div className={`p-4 rounded-lg mb-3 ${
                  doc.type === 'pdf' ? 'bg-red-900/20 text-red-400' :
                  doc.type === 'docx' ? 'bg-blue-900/20 text-blue-400' :
                  doc.type === 'xlsx' ? 'bg-green-900/20 text-green-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {getFileIcon(doc.type)}
                </div>
                
                <h3 className="text-white font-medium text-sm mb-1 truncate w-full">
                  {doc.name}
                </h3>
                
                <p className="text-gray-400 text-xs">{doc.size}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t("status")}</span>
                  <span className={getStatusColor(doc.status)}>
                    {getStatusText(doc.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{t("modified")}</span>
                  <span className="text-gray-400">
                    {new Date(doc.modifiedDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {doc.languages.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {doc.languages.map(lang => (
                      <span key={lang} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vue Liste
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left">
                  <button
                    onClick={selectAllDocuments}
                    className="text-gray-400 hover:text-white"
                  >
                    {selectedDocuments.length === filteredDocuments.length ? (
                      <CheckSquare className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("name")}</th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("size")}</th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("status")}</th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("modified")}</th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("languages")}</th>
                <th className="p-4 text-left text-gray-400 font-medium">{t("owner")}</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className={`border-b border-gray-700 hover:bg-gray-750 ${
                    selectedDocuments.includes(doc.id) ? 'bg-gray-750' : ''
                  }`}
                >
                  <td className="p-4">
                    <button
                      onClick={() => toggleDocumentSelection(doc.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedDocuments.includes(doc.id) ? (
                        <CheckSquare className="w-5 h-5 text-purple-500" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${
                        doc.type === 'pdf' ? 'bg-red-900/20 text-red-400' :
                        doc.type === 'docx' ? 'bg-blue-900/20 text-blue-400' :
                        doc.type === 'xlsx' ? 'bg-green-900/20 text-green-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {getFileIcon(doc.type)}
                      </div>
                      <span className="text-white font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{doc.size}</td>
                  <td className="p-4">
                    <span className={`${getStatusColor(doc.status)} text-sm`}>
                      {getStatusText(doc.status)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(doc.modifiedDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {doc.languages.map(lang => (
                        <span key={lang} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{doc.owner}</td>
                  <td className="p-4">
                    <DropdownMenu docId={doc.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message si aucun document */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{t("noDocuments")}</p>
          <button className="text-purple-400 hover:text-purple-300">
            {t("importFirst")}
          </button>
        </div>
      )}
    </div>
  );
};

// Composant Menu déroulant
const DropdownMenu: React.FC<{ docId: string }> = ({ docId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-20">
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Aperçu
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Renommer
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
