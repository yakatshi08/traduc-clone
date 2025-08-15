import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Play,
  Pause,
  Download,
  Trash2,
  Edit,
  Share2,
  Eye,
  MoreVertical,
  Clock,
  Calendar,
  Globe,
  FileText,
  Mic,
  Subtitles,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Volume2,
  Maximize2,
  Settings,
  Copy,
  Link2,
  Mail,
  ChevronDown,
  Film,
  PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoFile {
  id: string;
  name: string;
  url?: string;
  file?: File;
  size: number;
  duration: number;
  resolution: string;
  language: string;
  status: 'ready' | 'transcription' | 'processing' | 'error';
  transcription?: string;
  subtitles?: boolean;
  views: number;
  createdAt: string;
  thumbnail?: string;
}

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les vidéos de démonstration
  useEffect(() => {
    loadDemoVideos();
  }, []);

  const loadDemoVideos = () => {
    const demoVideos: VideoFile[] = [
      {
        id: '1',
        name: 'Présentation Produit 2025',
        size: 299040768, // 285 MB
        duration: 942, // 15:42
        resolution: '1920x1080',
        language: 'fr',
        status: 'ready',
        transcription: 'Bienvenue à notre présentation produit 2025. Aujourd\'hui, nous allons explorer les nouvelles fonctionnalités innovantes de notre plateforme de transcription et de traduction automatique...',
        subtitles: true,
        views: 234,
        createdAt: '2025-01-10T10:00:00Z'
      },
      {
        id: '2',
        name: 'Formation Interne - Module 3',
        size: 1288490188, // 1.2 GB
        duration: 2718, // 45:18
        resolution: '1280x720',
        language: 'fr',
        status: 'transcription',
        transcription: 'Module 3 de la formation interne en cours de transcription...', // AJOUTÉ
        subtitles: false,
        views: 90,
        createdAt: '2025-01-08T14:00:00Z'
      },
      {
        id: '3',
        name: 'Interview Client Success Story',
        size: 440401920, // 420 MB
        duration: 503, // 08:23
        resolution: '4K',
        language: 'en',
        status: 'ready',
        transcription: 'Thank you for joining us today. Can you tell us about your experience with our transcription platform? Well, it has completely transformed our workflow...',
        subtitles: true,
        views: 567,
        createdAt: '2025-01-12T09:00:00Z'
      },
      {
        id: '4',
        name: 'Webinar IA et Traduction',
        size: 3006477107, // 2.8 GB
        duration: 5025, // 1:23:45
        resolution: '1920x1080',
        language: 'fr',
        status: 'processing',
        transcription: 'Traitement de la vidéo en cours. La transcription sera disponible une fois le traitement terminé...', // AJOUTÉ
        subtitles: false,
        views: 1204,
        createdAt: '2025-01-14T16:00:00Z'
      }
    ];
    
    setVideos(demoVideos);
  };

  // Fonction pour importer une vidéo
  const handleImportVideo = () => {
    setShowUploadModal(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('video/')) {
      toast.error('Veuillez sélectionner un fichier vidéo');
      return;
    }

    // Vérifier la taille (max 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > maxSize) {
      toast.error('La vidéo ne doit pas dépasser 5GB');
      return;
    }

    setIsLoading(true);

    // Créer un objet vidéo
    const newVideo: VideoFile = {
      id: `video_${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      file: file,
      size: file.size,
      duration: 0, // À calculer avec l'API
      resolution: '1920x1080', // À détecter
      language: 'fr',
      status: 'processing',
      views: 0,
      createdAt: new Date().toISOString()
    };

    // Créer une URL temporaire pour la preview
    const videoUrl = URL.createObjectURL(file);
    newVideo.url = videoUrl;

    // Ajouter la vidéo à la liste
    setVideos(prev => [newVideo, ...prev]);
    setShowUploadModal(false);
    
    // Simuler le traitement
    setTimeout(() => {
      setVideos(prev => prev.map(v => 
        v.id === newVideo.id 
          ? { ...v, status: 'ready', duration: Math.floor(Math.random() * 3600) }
          : v
      ));
      toast.success(`Vidéo "${newVideo.name}" importée avec succès !`);
    }, 3000);

    setIsLoading(false);
    
    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fonction pour voir une vidéo
  const handleViewVideo = (video: VideoFile) => {
    setSelectedVideo(video);
    setShowPreviewModal(true);
    
    // Incrémenter les vues
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, views: v.views + 1 } : v
    ));
  };

  // Fonction pour télécharger une vidéo
  const handleDownloadVideo = (video: VideoFile) => {
    if (video.url) {
      const a = document.createElement('a');
      a.href = video.url;
      a.download = `${video.name}.mp4`;
      a.click();
      toast.success('Téléchargement démarré');
    } else {
      toast.error('Vidéo non disponible pour le téléchargement');
    }
  };

  // Fonction pour supprimer une vidéo
  const handleDeleteVideo = (videoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;
    
    setVideos(prev => prev.filter(v => v.id !== videoId));
    toast.success('Vidéo supprimée');
  };

  // Fonction pour partager une vidéo
  const handleShareVideo = (video: VideoFile) => {
    const shareUrl = `${window.location.origin}/videos/${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Lien copié dans le presse-papier !');
    });
  };

  // Fonction pour transcrire une vidéo
  const handleTranscribeVideo = (video: VideoFile) => {
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, status: 'transcription' } : v
    ));
    
    toast.info('Transcription en cours...');
    
    // Simuler la transcription
    setTimeout(() => {
      setVideos(prev => prev.map(v => 
        v.id === video.id 
          ? { 
              ...v, 
              status: 'ready', 
              transcription: 'Voici la transcription automatique de la vidéo. Le contenu a été transcrit avec succès et est maintenant disponible pour l\'édition et l\'export...',
              subtitles: true
            } 
          : v
      ));
      toast.success('Transcription terminée !');
    }, 5000);
  };

  // Statistiques
  const stats = {
    total: videos.length,
    ready: videos.filter(v => v.status === 'ready').length,
    processing: videos.filter(v => v.status === 'processing' || v.status === 'transcription').length,
    totalDuration: videos.reduce((acc, v) => acc + v.duration, 0),
    totalSize: videos.reduce((acc, v) => acc + v.size, 0),
    totalViews: videos.reduce((acc, v) => acc + v.views, 0)
  };

  // Filtrage
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'ready' && video.status === 'ready') ||
                         (filterStatus === 'processing' && (video.status === 'processing' || video.status === 'transcription'));
    return matchesSearch && matchesFilter;
  });

  // Helpers
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'transcription': return <Mic className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  // Fonction pour générer un gradient de couleur basé sur l'index
  const getThumbnailGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-purple-600 to-blue-600',
      'bg-gradient-to-br from-green-600 to-teal-600',
      'bg-gradient-to-br from-pink-600 to-rose-600',
      'bg-gradient-to-br from-indigo-600 to-purple-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vidéos</h1>
        <p className="text-gray-400">Gérez et transcrivez vos contenus vidéo</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Vidéos</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold">{stats.ready}</span>
          </div>
          <p className="text-gray-400 text-sm">Prêtes</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Loader2 className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold">{stats.processing}</span>
          </div>
          <p className="text-gray-400 text-sm">En cours</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</span>
          </div>
          <p className="text-gray-400 text-sm">Durée totale</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Film className="w-6 h-6 text-gray-400" />
            <span className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</span>
          </div>
          <p className="text-gray-400 text-sm">Stockage</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-6 h-6 text-indigo-500" />
            <span className="text-2xl font-bold">{stats.totalViews}</span>
          </div>
          <p className="text-gray-400 text-sm">Vues</p>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="ready">Prêt</option>
            <option value="processing">En cours</option>
          </select>
        </div>

        <div className="flex gap-4">
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

          <button
            onClick={handleImportVideo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importer une vidéo
          </button>
        </div>
      </div>

      {/* Liste des vidéos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((video, index) => (
          <div key={video.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 group">
              {/* Placeholder avec gradient coloré et icône */}
              <div className={`w-full h-full ${getThumbnailGradient(index)} flex items-center justify-center`}>
                <PlayCircle className="w-16 h-16 text-white/30" />
              </div>
              
              {/* Overlay au hover avec bouton play */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleViewVideo(video)}
                  className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
                >
                  <Play className="w-8 h-8 text-white" />
                </button>
              </div>

              {/* Badge statut */}
              <div className="absolute top-2 left-2">
                {getStatusIcon(video.status)}
              </div>

              {/* Durée */}
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Infos */}
            <div className="p-4">
              <h3 className="font-medium mb-2 truncate" title={video.name}>
                {video.name}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>{video.resolution}</span>
                <span>{formatFileSize(video.size)}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{video.language === 'fr' ? 'Français' : video.language === 'en' ? 'Anglais' : video.language.toUpperCase()}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-3 min-h-[24px]">
                {video.transcription && (
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                    Transcription
                  </span>
                )}
                {video.subtitles && (
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                    Sous-titres
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewVideo(video)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
                >
                  Voir
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowOptionsMenu(showOptionsMenu === video.id ? null : video.id)}
                    className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {showOptionsMenu === video.id && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          handleTranscribeVideo(video);
                          setShowOptionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-600 rounded-t-lg flex items-center gap-2 text-sm"
                      >
                        <Mic className="w-4 h-4" />
                        Transcrire
                      </button>
                      <button
                        onClick={() => {
                          handleDownloadVideo(video);
                          setShowOptionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </button>
                      <button
                        onClick={() => {
                          handleShareVideo(video);
                          setShowOptionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-2 text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        Partager
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteVideo(video.id);
                          setShowOptionsMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-600 rounded-b-lg flex items-center gap-2 text-red-400 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Importer une vidéo</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Glissez-déposez votre vidéo ici</p>
              <p className="text-sm text-gray-500 mb-4">ou</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Parcourir les fichiers
              </button>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Formats supportés : MP4, AVI, MOV, MKV, WebM</p>
                <p>Taille max : 5 GB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de preview - CORRIGÉ AVEC TRANSCRIPTION TOUJOURS VISIBLE */}
      {showPreviewModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative mt-16">
            {/* Header du modal */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
              <h2 className="text-xl font-bold text-white pr-4 flex-1" style={{ wordBreak: 'break-word' }}>
                {selectedVideo.name}
              </h2>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedVideo(null);
                }}
                className="p-2 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Zone vidéo */}
              <div className="aspect-video bg-black">
                {selectedVideo.url ? (
                  <video 
                    controls 
                    className="w-full h-full"
                    src={selectedVideo.url}
                    autoPlay={false}
                  >
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <div className="text-center">
                      <PlayCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Aperçu vidéo non disponible</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Transcription - TOUJOURS VISIBLE */}
              <div className="p-6 border-t border-gray-700 bg-gray-800/50">
                <h3 className="font-semibold mb-3 text-white text-lg">Transcription</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  {selectedVideo.transcription ? (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedVideo.transcription}
                    </p>
                  ) : selectedVideo.status === 'transcription' ? (
                    <div className="flex items-center gap-3 text-blue-400">
                      <Mic className="w-5 h-5 animate-pulse" />
                      <p className="text-sm">Transcription en cours de traitement...</p>
                    </div>
                  ) : selectedVideo.status === 'processing' ? (
                    <div className="flex items-center gap-3 text-yellow-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <p className="text-sm">Traitement de la vidéo en cours...</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      Aucune transcription disponible pour cette vidéo. Cliquez sur "Transcrire" dans le menu pour démarrer la transcription.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;