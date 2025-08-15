import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Upload,
  Download,
  Trash2,
  Share2,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  FileAudio,
  Activity,
  Plus,
  X,
  Loader2,
  Brain,
  Languages,
  Globe,
  Target,
  Star,
  StarOff,
  ChevronUp,
  ChevronDown,
  Repeat,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types simplifiés
interface Audio {
  id: string;
  name: string;
  url: string;
  size: number;
  duration: number;
  format: string;
  bitrate: number;
  sampleRate: number;
  channels: number;
  createdAt: Date;
  updatedAt: Date;
  projectName?: string;
  status: 'pending' | 'processing' | 'transcribed' | 'error';
  transcription?: string;
  language?: string;
  tags: string[];
  starred: boolean;
  accuracy?: number;
  wer?: number;
  confidence?: number;
}

interface AudioStats {
  total: number;
  transcribed: number;
  totalDuration: number;
  totalSize: number;
  averageAccuracy: number;
  averageWER: number;
}

// Composant Player Audio simplifié (sans WaveSurfer pour l'instant)
const AudioPlayer: React.FC<{
  audio: Audio;
  onTranscribe: () => void;
  onClose: () => void;
}> = ({ audio, onTranscribe, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    audioElement.addEventListener('timeupdate', updateTime);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{audio.name}</h2>
                <p className="text-sm text-gray-400">
                  {formatTime(audio.duration)} • {audio.format.toUpperCase()} • {audio.bitrate} kbps
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={audio.url}
          className="hidden"
        />

        {/* Simple Progress Bar */}
        <div className="p-6">
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${(currentTime / audio.duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audio.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>

            {!audio.transcription && (
              <button
                onClick={onTranscribe}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Transcrire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal AudiosPage
const AudiosPage: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<AudioStats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAudios();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [audios]);

  const loadAudios = async () => {
    setIsLoading(true);
    try {
      // Données de démonstration
      const demoAudios: Audio[] = [
        {
          id: 'audio_1',
          name: 'Interview_Patient_Dr_Martin.mp3',
          url: '#',
          size: 15728640,
          duration: 1800,
          format: 'mp3',
          bitrate: 192,
          sampleRate: 44100,
          channels: 2,
          createdAt: new Date('2025-01-10'),
          updatedAt: new Date('2025-01-10'),
          projectName: 'Consultations Médicales',
          status: 'transcribed',
          language: 'fr',
          transcription: 'Transcription complète de l\'interview médicale...',
          tags: ['médical', 'consultation'],
          starred: true,
          accuracy: 98.5,
          wer: 2.5,
          confidence: 0.98
        },
        {
          id: 'audio_2',
          name: 'Podcast_Marketing_Digital.mp3',
          url: '#',
          size: 52428800,
          duration: 2400,
          format: 'mp3',
          bitrate: 256,
          sampleRate: 48000,
          channels: 2,
          createdAt: new Date('2025-01-11'),
          updatedAt: new Date('2025-01-11'),
          projectName: 'Podcasts Business',
          status: 'transcribed',
          language: 'en',
          transcription: 'Welcome to our digital marketing podcast...',
          tags: ['podcast', 'marketing'],
          starred: false,
          accuracy: 96.8,
          wer: 3.2,
          confidence: 0.95
        },
        {
          id: 'audio_3',
          name: 'Cours_Droit_Commercial.m4a',
          url: '#',
          size: 31457280,
          duration: 3600,
          format: 'm4a',
          bitrate: 256,
          sampleRate: 44100,
          channels: 1,
          createdAt: new Date('2025-01-09'),
          updatedAt: new Date('2025-01-09'),
          projectName: 'Cours Universitaires',
          status: 'processing',
          language: 'fr',
          tags: ['cours', 'droit'],
          starred: false
        }
      ];

      setAudios(demoAudios);
    } catch (error) {
      console.error('Erreur lors du chargement des audios:', error);
      toast.error('Erreur lors du chargement des audios');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (audios.length === 0) {
      setStats(null);
      return;
    }

    const stats: AudioStats = {
      total: audios.length,
      transcribed: audios.filter(a => a.status === 'transcribed').length,
      totalDuration: audios.reduce((acc, a) => acc + a.duration, 0),
      totalSize: audios.reduce((acc, a) => acc + a.size, 0),
      averageAccuracy: audios.filter(a => a.accuracy).reduce((acc, a) => acc + (a.accuracy || 0), 0) / audios.filter(a => a.accuracy).length || 0,
      averageWER: audios.filter(a => a.wer).reduce((acc, a) => acc + (a.wer || 0), 0) / audios.filter(a => a.wer).length || 0
    };

    setStats(stats);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    toast.success(`${files.length} audio(s) uploadé(s)`);
  };

  const handleTranscribe = (audio: Audio) => {
    setAudios(prev => prev.map(a => 
      a.id === audio.id 
        ? { ...a, status: 'processing' as const }
        : a
    ));

    setTimeout(() => {
      setAudios(prev => prev.map(a => 
        a.id === audio.id 
          ? { 
              ...a, 
              status: 'transcribed' as const,
              transcription: 'Transcription automatique générée...',
              language: 'fr',
              accuracy: 95 + Math.random() * 4,
              wer: 2 + Math.random() * 2
            }
          : a
      ));
      
      toast.success(`${audio.name} transcrit avec succès`);
    }, 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transcribed': return 'bg-emerald-500';
      case 'processing': return 'bg-indigo-500';
      case 'pending': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleStar = (audioId: string) => {
    setAudios(audios.map(a => 
      a.id === audioId ? { ...a, starred: !a.starred } : a
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement des audios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Audios TraduckXion
            </h1>
            <p className="text-gray-400">
              Gérez vos fichiers audio et transcriptions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importer
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Music className="w-5 h-5 text-violet-400" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-400">Total audios</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span className="text-2xl font-bold">{stats.transcribed}</span>
            </div>
            <p className="text-sm text-gray-400">Transcrits</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-xl font-bold">{Math.floor(stats.totalDuration / 3600)}h</span>
            </div>
            <p className="text-sm text-gray-400">Durée totale</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold">{stats.averageAccuracy.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-gray-400">Précision moy.</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-red-400" />
              <span className="text-2xl font-bold">{stats.averageWER.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-gray-400">WER moyen</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <FileAudio className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold">{formatFileSize(stats.totalSize)}</span>
            </div>
            <p className="text-sm text-gray-400">Espace utilisé</p>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des audios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des audios */}
      {audios.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aucun audio trouvé</p>
          <p className="text-sm text-gray-500">
            Importez vos premiers fichiers audio pour commencer
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audios.map(audio => (
            <div
              key={audio.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <button
                  onClick={() => toggleStar(audio.id)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {audio.starred ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <h3 className="font-medium mb-1 truncate">{audio.name}</h3>
              {audio.projectName && (
                <p className="text-sm text-gray-400 mb-3">{audio.projectName}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>{formatDuration(audio.duration)}</span>
                <span>•</span>
                <span>{audio.format.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(audio.size)}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(audio.status)}`} />
                <span className="text-xs text-gray-400">{audio.status}</span>
                
                {audio.accuracy && (
                  <span className="text-xs text-emerald-400 ml-auto">
                    {audio.accuracy.toFixed(1)}%
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAudio(audio);
                    setShowPlayer(true);
                  }}
                  className="flex-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Écouter
                </button>
                
                {!audio.transcription && (
                  <button
                    onClick={() => handleTranscribe(audio)}
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-sm"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Durée</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {audios.map(audio => (
                <tr key={audio.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded flex items-center justify-center">
                        <Music className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{audio.name}</div>
                        {audio.projectName && (
                          <div className="text-xs text-gray-400">{audio.projectName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDuration(audio.duration)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                      {audio.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${getStatusColor(audio.status)}`} />
                    <span className="ml-2 text-sm">{audio.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAudio(audio);
                          setShowPlayer(true);
                        }}
                        className="p-1 hover:bg-gray-600 rounded"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      {!audio.transcription && (
                        <button
                          onClick={() => handleTranscribe(audio)}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          <Brain className="w-4 h-4 text-violet-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Player Modal */}
      {showPlayer && selectedAudio && (
        <AudioPlayer
          audio={selectedAudio}
          onTranscribe={() => handleTranscribe(selectedAudio)}
          onClose={() => {
            setShowPlayer(false);
            setSelectedAudio(null);
          }}
        />
      )}
    </div>
  );
};

export default AudiosPage;