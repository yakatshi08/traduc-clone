import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Upload,
  Grid,
  List,
  Play,
  Pause,
  Download,
  Trash2,
  Edit,
  MoreVertical,
  Mic,
  Square,
  Languages,
  Headphones,
  Music,
  Radio,
  FileAudio,
  Activity,
  Clock,
  Calendar,
  ChevronDown,
  X,
  Volume2,
  Waveform
} from 'lucide-react';

const AudiosPage: React.FC = () => {
  const { t } = useTranslation('audios');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const audios = [
    {
      id: 1,
      name: "Podcast_Episode_42_Innovation.mp3",
      type: "podcast",
      duration: "45:30",
      size: "65 MB",
      date: "20/12/2024",
      status: "ready",
      accuracy: 97.8,
      format: "MP3",
      bitrate: "320 kbps",
      sampleRate: "44.1 kHz",
      channels: "stereo",
      languages: ["FR", "EN"],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    },
    {
      id: 2,
      name: "Réunion_Client_20241220.wav",
      type: "voiceNote",
      duration: "1:23:45",
      size: "850 MB",
      date: "20/12/2024",
      status: "processing",
      progress: 45,
      format: "WAV",
      bitrate: "1411 kbps",
      sampleRate: "48 kHz",
      channels: "stereo",
      languages: ["FR"],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    },
    {
      id: 3,
      name: "Note_Vocale_Idée_Produit.m4a",
      type: "voiceNote",
      duration: "3:15",
      size: "4.2 MB",
      date: "19/12/2024",
      status: "ready",
      accuracy: 95.2,
      format: "M4A",
      bitrate: "256 kbps",
      sampleRate: "44.1 kHz",
      channels: "mono",
      languages: ["FR"],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    },
    {
      id: 4,
      name: "Musique_Ambiance_Projet.mp3",
      type: "music",
      duration: "4:22",
      size: "8.5 MB",
      date: "18/12/2024",
      status: "ready",
      format: "MP3",
      bitrate: "320 kbps",
      sampleRate: "44.1 kHz",
      channels: "stereo",
      languages: [],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    },
    {
      id: 5,
      name: "Interview_Radio_CEO.flac",
      type: "podcast",
      duration: "32:10",
      size: "245 MB",
      date: "17/12/2024",
      status: "transcribing",
      progress: 78,
      format: "FLAC",
      bitrate: "1411 kbps",
      sampleRate: "96 kHz",
      channels: "stereo",
      languages: ["EN"],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    },
    {
      id: 6,
      name: "Audiobook_Chapitre_1.mp3",
      type: "audiobook",
      duration: "58:42",
      size: "112 MB",
      date: "16/12/2024",
      status: "ready",
      accuracy: 99.1,
      format: "MP3",
      bitrate: "192 kbps",
      sampleRate: "44.1 kHz",
      channels: "mono",
      languages: ["FR"],
      waveform: Array(50).fill(0).map(() => Math.random() * 100)
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return <Radio className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      case 'voiceNote':
        return <Mic className="w-5 h-5" />;
      case 'audiobook':
        return <Headphones className="w-5 h-5" />;
      default:
        return <FileAudio className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'text-purple-400 bg-purple-500/20';
      case 'music':
        return 'text-pink-400 bg-pink-500/20';
      case 'voiceNote':
        return 'text-blue-400 bg-blue-500/20';
      case 'audiobook':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'transcribing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const togglePlayPause = (audioId: number) => {
    setPlayingAudio(playingAudio === audioId ? null : audioId);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  const filteredAudios = audios.filter(audio => {
    const matchesSearch = audio.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || audio.status === filterStatus;
    const matchesType = filterType === 'all' || audio.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6"> {/* SUPPRIMÉ ml-64 */}
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
          {/* View Mode */}
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

          {/* Filters */}
          <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('filters')}
          </button>
          
          {/* Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" />
                <span>{t('recording')} {formatTime(recordingTime)}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{t('record')}</span>
              </>
            )}
          </button>
          
          {/* Upload */}
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: '#6366f1' }}
          >
            <Upload className="w-4 h-4" />
            {t('upload')}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{t('status')}:</span>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="ready">{t('ready')}</option>
            <option value="processing">{t('processing')}</option>
            <option value="transcribing">{t('transcribing')}</option>
            <option value="error">{t('error')}</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{t('type')}:</span>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="podcast">{t('podcast')}</option>
            <option value="music">{t('music')}</option>
            <option value="voiceNote">{t('voiceNote')}</option>
            <option value="audiobook">{t('audiobook')}</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-400">{t('sortBy')}:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="date">{t('uploadDate')}</option>
            <option value="name">{t('name')}</option>
            <option value="duration">{t('duration')}</option>
            <option value="size">{t('size')}</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 text-gray-400 hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audios Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudios.map((audio) => (
            <div
              key={audio.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(audio.type).split(' ')[1]}`}>
                    {getTypeIcon(audio.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white truncate max-w-[200px]" title={audio.name}>
                      {audio.name}
                    </h3>
                    <p className="text-sm text-gray-400">{audio.date}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Waveform */}
              <div className="mb-4 h-16 flex items-end gap-1">
                {audio.waveform.map((height, index) => (
                  <div
                    key={index}
                    className={`flex-1 bg-gradient-to-t transition-all ${
                      playingAudio === audio.id 
                        ? 'from-indigo-600 to-violet-600 opacity-80' 
                        : 'from-gray-600 to-gray-500 opacity-60'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      animation: playingAudio === audio.id ? 'pulse 1s infinite' : 'none'
                    }}
                  />
                ))}
              </div>

              {/* Progress bar pour processing */}
              {(audio.status === 'processing' || audio.status === 'transcribing') && audio.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{t(audio.status)}</span>
                    <span>{audio.progress}%</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: `${audio.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('duration')}:</span>
                  <span className="text-white">{audio.duration}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('size')}:</span>
                  <span className="text-white">{audio.size}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>{t('bitrate')}:</span>
                  <span className="text-white">{audio.bitrate}</span>
                </div>
                {audio.accuracy && (
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Précision:</span>
                    <span className="text-emerald-400">{audio.accuracy}%</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <button
                    onClick={() => togglePlayPause(audio.id)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {playingAudio === audio.id ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  {/* Languages */}
                  {audio.languages.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Languages className="w-4 h-4 text-gray-500" />
                      {audio.languages.map(lang => (
                        <span key={lang} className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(audio.status)}`}>
                  {t(audio.status)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <button className="flex-1 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  {t('transcribe')}
                </button>
                <button className="flex-1 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  {t('download')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('duration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('size')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAudios.map((audio) => (
                <tr key={audio.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlayPause(audio.id)}
                        className="p-1.5 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        {playingAudio === audio.id ? (
                          <Pause className="w-3 h-3 text-white" />
                        ) : (
                          <Play className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <div>
                        <div className="text-white font-medium">{audio.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {audio.format} • {audio.bitrate} • {audio.channels}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 ${getTypeColor(audio.type).split(' ')[0]}`}>
                      {getTypeIcon(audio.type)}
                      <span className="text-sm">{t(audio.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{audio.duration}</td>
                  <td className="px-6 py-4 text-gray-400">{audio.size}</td>
                  <td className="px-6 py-4 text-gray-400">{audio.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(audio.status)}`}>
                      {t(audio.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <Languages className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white rounded">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{t('uploadAudio')}</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
              <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">{t('dragDropOrClick')}</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Parcourir
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              <p>Formats supportés: MP3, WAV, M4A, FLAC, OGG</p>
              <p>Taille maximale: 500 MB</p>
            </div>
          </div>
        </div>
      )}

      {/* No results */}
      {filteredAudios.length === 0 && (
        <div className="text-center py-12">
          <FileAudio className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">{t('noAudios')}</h3>
          <p className="text-gray-400">{t('uploadFirst')}</p>
        </div>
      )}
    </div>
  );
};

export default AudiosPage;