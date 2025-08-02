import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload,
  Grid,
  List,
  Play,
  Download,
  MoreVertical,
  Clock,
  Calendar,
  Eye,
  Link2
} from 'lucide-react';

const VideosPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const videos = [
    {
      id: 1,
      name: "Présentation_Produit_2024.mp4",
      thumbnail: "/api/placeholder/320/180",
      duration: "15:30",
      size: "245 MB",
      date: "Il y a 2 heures",
      status: "completed",
      views: 156,
      transcription: true
    },
    {
      id: 2,
      name: "Formation_IA_Module_1",
      thumbnail: "/api/placeholder/320/180",
      duration: "45:00",
      size: "1.2 GB",
      date: "Il y a 5 heures",
      status: "processing",
      progress: 65,
      views: 0,
      transcription: false
    },
    {
      id: 3,
      name: "Interview_Client_Témoignage.mp4",
      thumbnail: "/api/placeholder/320/180",
      duration: "8:45",
      size: "156 MB",
      date: "Hier",
      status: "ready",
      views: 89,
      transcription: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'processing':
        return 'En cours';
      case 'ready':
        return 'Prêt';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vidéos</h1>
        <p className="text-gray-400">Gérez vos fichiers vidéo et leurs transcriptions</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une vidéo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
            <Grid className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
            <List className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            <Link2 className="w-4 h-4" />
            <span>Importer URL</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            <Upload className="w-4 h-4" />
            <span>Téléverser</span>
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all cursor-pointer">
            {/* Thumbnail Container */}
            <div className="relative aspect-video bg-gray-900 group">
              {/* Thumbnail Image */}
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-500" />
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>
              
              {/* Status Badge - Top Left */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                  {getStatusLabel(video.status)}
                </span>
              </div>
              
              {/* Duration - Bottom Right */}
              <div className="absolute bottom-2 right-2 z-10">
                <span className="bg-black/75 px-2 py-1 rounded text-xs text-white">
                  {video.duration}
                </span>
              </div>

              {/* Progress Bar for processing videos */}
              {video.status === 'processing' && video.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-medium text-white truncate mb-2">
                {video.name}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {video.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                </div>
                
                <button className="p-1 hover:bg-gray-700 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{video.size}</span>
                {video.transcription && (
                  <span className="text-xs text-green-400">Transcrit</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosPage;