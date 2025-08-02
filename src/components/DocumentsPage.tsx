import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Upload,
  Grid,
  List,
  Download,
  Eye,
  Trash2,
  Edit,
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
  MoreVertical,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  X,
  FolderOpen
} from 'lucide-react';

const DocumentsPage: React.FC = () => {
  const { t } = useTranslation('documents');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const documents = [
    {
      id: 1,
      name: "Rapport Annuel 2024.pdf",
      type: "pdf",
      size: "2.4 MB",
      date: "15/12/2024",
      author: "Marie Dupont",
      status: "completed",
      tags: ["finance", "annuel"]
    },
    {
      id: 2,
      name: "Présentation Client.pptx",
      type: "presentation",
      size: "5.8 MB",
      date: "14/12/2024",
      author: "Jean Martin",
      status: "processing",
      tags: ["client", "vente"]
    },
    {
      id: 3,
      name: "Données Analytiques.xlsx",
      type: "spreadsheet",
      size: "1.2 MB",
      date: "13/12/2024",
      author: "Sophie Bernard",
      status: "completed",
      tags: ["data", "analytics"]
    },
    {
      id: 4,
      name: "Contrat_Service_2024.docx",
      type: "document",
      size: "890 KB",
      date: "12/12/2024",
      author: "Pierre Leroy",
      status: "completed",
      tags: ["legal", "contrat"]
    },
    {
      id: 5,
      name: "Mockup_Application.png",
      type: "image",
      size: "3.2 MB",
      date: "11/12/2024",
      author: "Laura Chen",
      status: "completed",
      tags: ["design", "ui"]
    },
    {
      id: 6,
      name: "Guide_Utilisateur.pdf",
      type: "pdf",
      size: "4.5 MB",
      date: "10/12/2024",
      author: "Thomas Petit",
      status: "processing",
      tags: ["documentation", "guide"]
    }
  ];

  // Fonction getFileIcon mise à jour selon la consigne
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-8 h-8 text-red-400" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
      case 'image':
        return <FileImage className="w-8 h-8 text-blue-400" />;
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-emerald-500/20 text-emerald-400' 
      : 'bg-blue-500/20 text-blue-400';
  };

  const toggleDocSelection = (docId: number) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleAllSelection = () => {
    setSelectedDocs(
      selectedDocs.length === documents.length 
        ? [] 
        : documents.map(doc => doc.id)
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t('filters')}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* Upload Button */}
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#6366f1' }}
          >
            <Upload className="w-4 h-4" />
            {t('upload')}
          </button>
        </div>
      </div>

      {/* Selection Info Bar */}
      {selectedDocs.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAllSelection}
              className="w-5 h-5 rounded border-2 border-gray-600 flex items-center justify-center"
            >
              {selectedDocs.length === documents.length && (
                <Check className="w-3 h-3 text-indigo-400" />
              )}
            </button>
            <span className="text-gray-300">
              {t('selectedCount', { count: selectedDocs.length })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
              <FolderOpen className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`bg-gray-800 rounded-lg p-6 border transition-all cursor-pointer ${
                selectedDocs.includes(doc.id) 
                  ? 'border-indigo-500 bg-gray-750' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => toggleDocSelection(doc.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="w-5 h-5 rounded border-2 border-gray-600 flex items-center justify-center">
                    {selectedDocs.includes(doc.id) && (
                      <Check className="w-3 h-3 text-indigo-400" />
                    )}
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <h3 className="font-medium text-white mb-2 truncate">{doc.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('size')}:</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('date')}:</span>
                  <span>{doc.date}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('author')}:</span>
                  <span>{doc.author}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  {doc.status === 'completed' ? t('status.completed') : t('status.processing')}
                </span>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-white rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white rounded">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="w-10 px-6 py-3">
                  <button
                    onClick={toggleAllSelection}
                    className="w-5 h-5 rounded border-2 border-gray-600 flex items-center justify-center"
                  >
                    {selectedDocs.length === documents.length && (
                      <Check className="w-3 h-3 text-indigo-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('size')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('author')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredDocuments.map((doc) => (
                <tr 
                  key={doc.id}
                  className={`hover:bg-gray-750 transition-colors ${
                    selectedDocs.includes(doc.id) ? 'bg-gray-750' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDocSelection(doc.id)}
                      className="w-5 h-5 rounded border-2 border-gray-600 flex items-center justify-center"
                    >
                      {selectedDocs.includes(doc.id) && (
                        <Check className="w-3 h-3 text-indigo-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8">{getFileIcon(doc.type)}</div>
                      <span className="text-white font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{doc.type}</td>
                  <td className="px-6 py-4 text-gray-400">{doc.size}</td>
                  <td className="px-6 py-4 text-gray-400">{doc.date}</td>
                  <td className="px-6 py-4 text-gray-400">{doc.author}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status === 'completed' ? t('status.completed') : t('status.processing')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{t('uploadDocument')}</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">{t('dragDropText')}</p>
              <p className="text-sm text-gray-500 mb-4">{t('orText')}</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                {t('browseFiles')}
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>{t('supportedFormats')}: PDF, DOCX, XLSX, PPTX, PNG, JPG</p>
              <p>{t('maxSize')}: 50MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;