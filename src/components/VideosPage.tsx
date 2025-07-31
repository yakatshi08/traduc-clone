import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Video, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Play,
  Pause,
  Eye,
  Trash2,
  Edit3,
  MoreVertical,
  FolderOpen,
  Grid,
  List,
  CheckSquare,
  Square,
  FileVideo,
  Clock,
  Globe,
  Mic,
  Youtube,
  Link2,
  Subtitles,
  Languages,
  AlertCircle,
  CheckCircle,
  XCircle,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface VideoFile {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  size: string;
  sizeBytes: number;
  uploadDate: string;
  modifiedDate: string;
  status: 'ready' | 'processing' | 'transcribing' | 'error';
  transcriptionStatus: 'none' | 'pending' | 'completed' | 'error';
  translationStatus: 'none' | 'pending' | 'completed' | 'error';
  languages: string[];
  sourceLanguage: string;
  owner: string;
  source: 'upload' | 'youtube' | 'vimeo' | 'drive' | 'dropbox';
  tags: string[];
  progress?: number;
}

const VideosPage: React.FC = () => {
  const { t } = useTranslation('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  // Données simulées avec les nouvelles spécifications
  const videos: VideoFile[] = [
    {
      id: '1',
      name: 'Présentation_Produit_2024.mp4',
      url: '/videos/presentation.mp4',
      thumbnailUrl: '/thumbnails/presentation.jpg',
      duration: '15:30',
      durationSeconds: 930,
      size: '250 MB',
      sizeBytes: 262144000,
      uploadDate: '2024-12-20',
      modifiedDate: '2024-12-20',
      status: 'ready',
      transcriptionStatus: 'completed',
      translationStatus: 'completed',
      languages: ['FR', 'EN', 'ES'],
      sourceLanguage: 'FR',
      owner: 'Marie Dupont',
      source: 'upload',
      tags: ['présentation', 'produit', '2024']
    },
    {
      id: '2',
      name: 'Formation_IA_Module_1',
      url: 'https://youtube.com/watch?v=abc123',
      thumbnailUrl: '/thumbnails/formation.jpg',
      duration: '45:00',
      durationSeconds: 2700,
      size: '1.2 GB',
      sizeBytes: 1288490188,
      uploadDate: '2024-12-19',
      modifiedDate: '2024-12-19',
      status: 'processing',
      transcriptionStatus: 'pending',
      translationStatus: 'none',
      languages: ['FR'],
      sourceLanguage: 'FR',
      owner: 'Jean Martin',
      source: 'youtube',
      tags: ['formation', 'IA', 'module'],
      progress: 65
    },
    {
      id: '3',
      name: 'Interview_Client_Témoignage.mov',
      url: '/videos/interview.mov',
      thumbnailUrl: '/thumbnails/interview.jpg',
      duration: '8:45',
      durationSeconds: 525,
      size: '180 MB',
      sizeBytes: 188743680,
      uploadDate: '2024-12-18',
      modifiedDate: '2024-12-19',
      status: 'transcribing',
      transcriptionStatus: 'pending',
      translationStatus: 'none',
      languages: ['FR'],
      sourceLanguage: 'FR',
      owner: 'Sophie Bernard',
      source: 'drive',
      tags: ['interview', 'client', 'témoignage'],
      progress: 35
    }
  ];

  // Filtrage et tri
  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
      const matchesSource = filterSource === 'all' || video.source === filterSource;
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'duration':
          comparison = a.durationSeconds - b.durationSeconds;
          break;
        case 'size':
          comparison = a.sizeBytes - b.sizeBytes;
          break;
        case 'uploadDate':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'processing':
      case 'transcribing':
        return <AlertCircle className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'vimeo':
        return <Video className="w-4 h-4" />;
      case 'drive':
      case 'dropbox':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  const handleImportFromUrl = () => {
    console.log('Importing from URL:', importUrl);
    setShowImportModal(false);
    setImportUrl('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title', 'Vidéos')}</h1>
        <p className="text-gray-400">
          {t('subtitle', 'Gérez vos fichiers vidéo et transcriptions')}
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Rechercher une vidéo...')}
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
                showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ backgroundColor: showFilters ? '#6366f1' : undefined }}
            >
              <Filter className="w-4 h-4" />
              {t('filters', 'Filtres')}
            </button>

            {/* Import depuis URL */}
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              <Link2 className="w-4 h-4" />
              {t('importUrl', 'Importer URL')}
            </button>

            {/* Upload */}
            <button 
              onClick={() => {
                console.log('Upload clicked');
                // Ajoutez votre logique d'upload ici
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              style={{ backgroundColor: '#6366f1' }}
            >
              <Upload className="w-4 h-4" />
              {t('upload', 'Téléverser')}
            </button>
          </div>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('status', 'Statut')}</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t('allStatuses', 'Tous les statuts')}</option>
                  <option value="ready">{t('ready', 'Prêt')}</option>
                  <option value="processing">{t('processing', 'En traitement')}</option>
                  <option value="transcribing">{t('transcribing', 'Transcription')}</option>
                  <option value="error">{t('error', 'Erreur')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('source', 'Source')}</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t('allSources', 'Toutes les sources')}</option>
                  <option value="upload">Upload</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="drive">Google Drive</option>
                  <option value="dropbox">Dropbox</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('sortBy', 'Trier par')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="uploadDate">{t('uploadDate', 'Date d\'upload')}</option>
                  <option value="name">{t('name', 'Nom')}</option>
                  <option value="duration">{t('duration', 'Durée')}</option>
                  <option value="size">{t('size', 'Taille')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('order', 'Ordre')}</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-gray-600"
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <SortAsc className="w-4 h-4" />
                      {t('ascending', 'Croissant')}
                    </>
                  ) : (
                    <>
                      <SortDesc className="w-4 h-4" />
                      {t('descending', 'Décroissant')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vue Grille */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all hover:scale-[1.02] cursor-pointer border border-gray-700"
            >
              {/* Thumbnail avec overlay */}
              <div className="relative aspect-video bg-gray-900 group">
                <img
                  src={video.thumbnailUrl}
                  alt={video.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzFmMjkzNyIvPjxwYXRoIGQ9Ik0xNzAgMTAwdjI1bDQwLTE5eiIgZmlsbD0iIzRiNTU2MyIvPjwvc3ZnPg==';
                  }}
                />
                
                {/* Play button overlay - MODIFIÉ */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Play video:', video.name);
                      // Ici vous pourriez ouvrir un modal ou naviguer vers le détail
                    }}
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                  {video.duration}
                </div>

                {/* Source icon */}
                <div className="absolute top-2 left-2 p-1.5 bg-black/70 backdrop-blur-sm rounded">
                  {getSourceIcon(video.source)}
                </div>

                {/* Progress bar si en traitement */}
                {video.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div 
                      className="h-full bg-indigo-600 transition-all"
                      style={{ width: `${video.progress}%`, backgroundColor: '#6366f1' }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-2 truncate">{video.name}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>{video.size}</span>
                  <span>{new Date(video.uploadDate).toLocaleDateString('fr-FR')}</span>
                </div>

                {/* Statuts */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Mic className="w-4 h-4 text-gray-500" />
                    {video.transcriptionStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : video.transcriptionStatus === 'pending' ? (
                      <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Languages className="w-4 h-4 text-gray-500" />
                    {video.translationStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : video.translationStatus === 'pending' ? (
                      <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Langues */}
                {video.languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    {video.languages.map(lang => (
                      <span 
                        key={lang} 
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: lang === video.sourceLanguage ? '#d1fae5' : '#374151',
                          color: lang === video.sourceLanguage ? '#065f46' : '#d1d5db'
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  {/* Bouton "Voir" - MODIFIÉ */}
                  <button 
                    onClick={() => {
                      console.log('View video:', video.name);
                      // Navigation vers la page de détail ou ouverture d'un modal
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {t('view', 'Voir')}
                  </button>
                  
                  {video.status === 'ready' && (
                    <button className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <DropdownMenu videoId={video.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vue Liste (version mise à jour)
        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left w-10">
                  <input type="checkbox" className="rounded border-gray-600" />
                </th>
                <th className="p-4 text-left text-gray-400 font-medium min-w-[200px]">{t('name', 'Nom')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-20">{t('duration', 'Durée')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-20">{t('size', 'Taille')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-32">{t('status', 'Statut')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-32">{t('languages', 'Langues')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-28">{t('source', 'Source')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-24">{t('date', 'Date')}</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => (
                <tr key={video.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-600" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-9 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjM2IiBmaWxsPSIjMWYyOTM3Ii8+PHBhdGggZD0iTTI3IDE0djhsMTAtNXoiIGZpbGw9IiM0YjU1NjMiLz48L3N2Zz4=';
                          }}
                        />
                      </div>
                      <span className="text-white font-medium truncate max-w-[250px]">{video.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{video.duration}</td>
                  <td className="p-4 text-gray-400 text-sm">{video.size}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(video.status)}
                      <span className="text-gray-400 text-sm">{t(video.status, video.status)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {video.languages.map(lang => (
                        <span 
                          key={lang} 
                          className="px-2 py-1 rounded text-xs"
                          style={{ 
                            backgroundColor: lang === video.sourceLanguage ? '#d1fae5' : '#374151',
                            color: lang === video.sourceLanguage ? '#065f46' : '#d1d5db'
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      {getSourceIcon(video.source)}
                      <span className="capitalize">{video.source}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(video.uploadDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <DropdownMenu videoId={video.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message si aucune vidéo */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{t('noVideos', 'Aucune vidéo trouvée')}</p>
          <button 
            className="text-indigo-400 hover:text-indigo-300"
            style={{ color: '#6366f1' }}
          >
            {t('uploadFirst', 'Téléverser votre première vidéo')}
          </button>
        </div>
      )}

      {/* Modal Import URL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {t('importFromUrl', 'Importer depuis une URL')}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                {t('videoUrl', 'URL de la vidéo (YouTube, Vimeo, etc.)')}
              </label>
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportUrl('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {t('cancel', 'Annuler')}
              </button>
              <button
                onClick={handleImportFromUrl}
                className="px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#6366f1' }}
                disabled={!importUrl}
              >
                {t('import', 'Importer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Menu déroulant
const DropdownMenu: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { t } = useTranslation('videos');
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
              <Play className="w-4 h-4" />
              {t('play', 'Lire')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              {t('transcribe', 'Transcrire')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              {t('translate', 'Traduire')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Subtitles className="w-4 h-4" />
              {t('subtitles', 'Sous-titres')}
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t('download', 'Télécharger')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              {t('rename', 'Renommer')}
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              {t('delete', 'Supprimer')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideosPage;