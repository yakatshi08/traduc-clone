import React, { useState } from 'react';
import {
  Video,
  Play,
  Pause,
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
  Clock,
  FileVideo,
  Subtitles,
  Languages,
  Calendar,
  ChevronDown,
  Volume2,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import FileActionsModal from '../components/Modals/FileActionsModal';

interface VideoFile {
  id: string;
  title: string;
  filename: string;
  duration: string;
  size: string;
  format: string;
  resolution: string;
  uploadedAt: string;
  status: 'ready' | 'processing' | 'transcribing' | 'error';
  thumbnail: string;
  language: string;
  transcriptionAvailable: boolean;
  subtitlesAvailable: boolean;
  views: number;
  projectId?: string;
  projectName?: string;
}

const VideosPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Ajouts pour la modal d’actions
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Données de démonstration
  const videos: VideoFile[] = [
    {
      id: '1',
      title: 'Présentation Produit 2025',
      filename: 'presentation_produit_2025.mp4',
      duration: '15:42',
      size: '285 MB',
      format: 'MP4',
      resolution: '1920x1080',
      uploadedAt: '2025-01-08',
      status: 'ready',
      thumbnail: '🎬',
      language: 'Français',
      transcriptionAvailable: true,
      subtitlesAvailable: true,
      views: 234,
      projectId: '1',
      projectName: 'Marketing Q1'
    },
    {
      id: '2',
      title: 'Formation Interne - Module 3',
      filename: 'formation_module3.mp4',
      duration: '45:18',
      size: '1.2 GB',
      format: 'MP4',
      resolution: '1280x720',
      uploadedAt: '2025-01-07',
      status: 'transcribing',
      thumbnail: '📚',
      language: 'Français',
      transcriptionAvailable: false,
      subtitlesAvailable: false,
      views: 89
    },
    {
      id: '3',
      title: 'Interview Client Success Story',
      filename: 'interview_client_john.mov',
      duration: '08:23',
      size: '420 MB',
      format: 'MOV',
      resolution: '4K',
      uploadedAt: '2025-01-06',
      status: 'ready',
      thumbnail: '🎤',
      language: 'Anglais',
      transcriptionAvailable: true,
      subtitlesAvailable: true,
      views: 567,
      projectId: '2',
      projectName: 'Témoignages Clients'
    },
    {
      id: '4',
      title: 'Webinar IA et Traduction',
      filename: 'webinar_ia_translation.mp4',
      duration: '1:23:45',
      size: '2.8 GB',
      format: 'MP4',
      resolution: '1920x1080',
      uploadedAt: '2025-01-05',
      status: 'processing',
      thumbnail: '🤖',
      language: 'Français',
      transcriptionAvailable: false,
      subtitlesAvailable: false,
      views: 1203
    },
    {
      id: '5',
      title: 'Tutoriel Application Mobile',
      filename: 'tuto_app_mobile.mp4',
      duration: '05:12',
      size: '125 MB',
      format: 'MP4',
      resolution: '1080x1920',
      uploadedAt: '2025-01-04',
      status: 'error',
      thumbnail: '📱',
      language: 'Espagnol',
      transcriptionAvailable: false,
      subtitlesAvailable: false,
      views: 45
    }
  ];

  // Statistiques
  const stats = {
    total: videos.length,
    ready: videos.filter(v => v.status === 'ready').length,
    processing: videos.filter(v => v.status === 'processing' || v.status === 'transcribing').length,
    totalDuration: '3h 37min',
    totalSize: '5.03 GB',
    totalViews: videos.reduce((sum, v) => sum + v.views, 0)
  };

  // Filtrage
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'transcribing': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Loader className="w-4 h-4 animate-spin" />;
      case 'transcribing': return <Subtitles className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'processing': return 'Traitement';
      case 'transcribing': return 'Transcription';
      case 'error': return 'Erreur';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vidéos</h1>
        <p className="text-gray-400">Gérez et transcrivez vos contenus vidéo</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Vidéos</p>
            </div>
            <Video className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.ready}</p>
              <p className="text-sm text-gray-400">Prêtes</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.processing}</p>
              <p className="text-sm text-gray-400">En cours</p>
            </div>
            <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalDuration}</p>
              <p className="text-sm text-gray-400">Durée totale</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalSize}</p>
              <p className="text-sm text-gray-400">Stockage</p>
            </div>
            <FileVideo className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Vues</p>
            </div>
            <Eye className="w-8 h-8 text-indigo-500" />
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
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtres */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="ready">Prêtes</option>
            <option value="processing">En traitement</option>
            <option value="transcribing">En transcription</option>
            <option value="error">Erreur</option>
          </select>
        </div>

        <div className="flex gap-4">
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
            Importer une vidéo
          </button>
        </div>
      </div>

      {/* Grille de vidéos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                <span className="text-4xl">{video.thumbnail}</span>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur rounded text-xs">
                  {video.duration}
                </div>
                <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur rounded text-xs ${getStatusColor(video.status)}`}>
                  {getStatusIcon(video.status)}
                  {getStatusText(video.status)}
                </div>
              </div>

              {/* Infos */}
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-1">{video.title}</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>{video.resolution}</span>
                    <span>{video.size}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Languages className="w-4 h-4" />
                      <span>{video.language}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {video.transcriptionAvailable && (
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                        Transcription
                      </span>
                    )}
                    {video.subtitlesAvailable && (
                      <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs">
                        Sous-titres
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                    Voir
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(video);
                      setShowActionsModal(true);
                    }}
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Titre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Durée</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Taille</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Langue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Vues</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => (
                <tr key={video.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{video.thumbnail}</span>
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-gray-400">{video.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{video.duration}</td>
                  <td className="px-4 py-3 text-sm">{video.size}</td>
                  <td className="px-4 py-3 text-sm">{video.language}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${getStatusColor(video.status)}`}>
                      {getStatusIcon(video.status)}
                      <span className="text-sm">{getStatusText(video.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{video.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <Play className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-600 rounded">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-600 rounded"
                        onClick={() => {
                          setSelectedItem(video);
                          setShowActionsModal(true);
                        }}
                      >
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

      {/* Modal Actions */}
      {showActionsModal && selectedItem && (
        <FileActionsModal
          isOpen={showActionsModal}
          onClose={() => setShowActionsModal(false)}
          fileName={selectedItem.title || selectedItem.filename}
          fileType="video"
          onAction={(action: string) => {
            console.log('Action:', action);
          }}
        />
      )}
    </div>
  );
};

export default VideosPage;
