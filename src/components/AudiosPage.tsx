import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Music, 
  Upload, 
  Search, 
  Filter, 
  Download,
  Play,
  Pause,
  Trash2,
  Edit3,
  MoreVertical,
  Grid,
  List,
  CheckSquare,
  Square,
  Mic,
  Headphones,
  Radio,
  Disc,
  FileAudio,
  Languages,
  AlertCircle,
  CheckCircle,
  XCircle,
  SortAsc,
  SortDesc,
  Activity,
  Scissors,
  Sparkles,
  Volume2,
  Clock
} from 'lucide-react';

interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: string;
  durationSeconds: number;
  size: string;
  sizeBytes: number;
  format: string;
  bitrate: string;
  sampleRate: string;
  channels: 'mono' | 'stereo';
  uploadDate: string;
  modifiedDate: string;
  status: 'ready' | 'processing' | 'transcribing' | 'error';
  transcriptionStatus: 'none' | 'pending' | 'completed' | 'error';
  translationStatus: 'none' | 'pending' | 'completed' | 'error';
  languages: string[];
  sourceLanguage: string;
  owner: string;
  type: 'podcast' | 'recording' | 'music' | 'voiceNote' | 'audiobook';
  tags: string[];
  waveformData?: number[];
  progress?: number;
}

const AudiosPage: React.FC = () => {
  const { t } = useTranslation('audios');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudios, setSelectedAudios] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Données simulées
  const audios: AudioFile[] = [
    {
      id: '1',
      name: 'Podcast_Episode_42_Innovation_IA.mp3',
      url: '/audios/podcast-42.mp3',
      duration: '45:30',
      durationSeconds: 2730,
      size: '65 MB',
      sizeBytes: 68157440,
      format: 'MP3',
      bitrate: '320 kbps',
      sampleRate: '44.1 kHz',
      channels: 'stereo',
      uploadDate: '2024-12-22',
      modifiedDate: '2024-12-22',
      status: 'ready',
      transcriptionStatus: 'completed',
      translationStatus: 'completed',
      languages: ['FR', 'EN', 'ES'],
      sourceLanguage: 'FR',
      owner: 'Marie Dupont',
      type: 'podcast',
      tags: ['podcast', 'IA', 'innovation'],
      waveformData: Array.from({length: 100}, () => Math.random())
    },
    {
      id: '2',
      name: 'Réunion_Client_20241220.wav',
      url: '/audios/reunion.wav',
      duration: '1:23:45',
      durationSeconds: 5025,
      size: '850 MB',
      sizeBytes: 891289600,
      format: 'WAV',
      bitrate: '1411 kbps',
      sampleRate: '48 kHz',
      channels: 'stereo',
      uploadDate: '2024-12-20',
      modifiedDate: '2024-12-21',
      status: 'processing',
      transcriptionStatus: 'pending',
      translationStatus: 'none',
      languages: ['FR'],
      sourceLanguage: 'FR',
      owner: 'Jean Martin',
      type: 'recording',
      tags: ['réunion', 'client', 'projet'],
      progress: 45
    },
    {
      id: '3',
      name: 'Note_Vocale_Idée_Produit.m4a',
      url: '/audios/note-vocale.m4a',
      duration: '3:15',
      durationSeconds: 195,
      size: '4.2 MB',
      sizeBytes: 4404019,
      format: 'M4A',
      bitrate: '256 kbps',
      sampleRate: '44.1 kHz',
      channels: 'mono',
      uploadDate: '2024-12-19',
      modifiedDate: '2024-12-19',
      status: 'transcribing',
      transcriptionStatus: 'pending',
      translationStatus: 'none',
      languages: ['FR'],
      sourceLanguage: 'FR',
      owner: 'Sophie Bernard',
      type: 'voiceNote',
      tags: ['note', 'idée', 'produit'],
      progress: 75
    },
    {
      id: '4',
      name: 'Livre_Audio_Chapitre_1.mp3',
      url: '/audios/audiobook.mp3',
      duration: '28:00',
      durationSeconds: 1680,
      size: '40 MB',
      sizeBytes: 41943040,
      format: 'MP3',
      bitrate: '192 kbps',
      sampleRate: '44.1 kHz',
      channels: 'stereo',
      uploadDate: '2024-12-18',
      modifiedDate: '2024-12-18',
      status: 'ready',
      transcriptionStatus: 'completed',
      translationStatus: 'none',
      languages: ['FR'],
      sourceLanguage: 'FR',
      owner: 'Pierre Durand',
      type: 'audiobook',
      tags: ['livre', 'audio', 'chapitre']
    }
  ];

  // Filtrage et tri
  const filteredAudios = audios
    .filter(audio => {
      const matchesSearch = audio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          audio.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || audio.status === filterStatus;
      const matchesType = filterType === 'all' || audio.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return <Radio className="w-5 h-5" />;
      case 'recording':
        return <Mic className="w-5 h-5" />;
      case 'music':
        return <Music className="w-5 h-5" />;
      case 'voiceNote':
        return <Headphones className="w-5 h-5" />;
      case 'audiobook':
        return <Disc className="w-5 h-5" />;
      default:
        return <FileAudio className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'bg-purple-900/20 text-purple-400';
      case 'recording':
        return 'bg-red-900/20 text-red-400';
      case 'music':
        return 'bg-blue-900/20 text-blue-400';
      case 'voiceNote':
        return 'bg-green-900/20 text-green-400';
      case 'audiobook':
        return 'bg-orange-900/20 text-orange-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const togglePlay = (audioId: string) => {
    setPlayingId(playingId === audioId ? null : audioId);
  };

  const Waveform: React.FC<{ data?: number[], isPlaying?: boolean }> = ({ data = [], isPlaying }) => {
    const bars = data.length > 0 ? data : Array.from({length: 50}, () => Math.random());
    
    return (
      <div className="flex items-center justify-center h-16 gap-[2px] px-2">
        {bars.slice(0, 50).map((height, i) => (
          <div
            key={i}
            className={`bg-gradient-to-t from-indigo-600 to-purple-600 rounded-full transition-all ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${height * 100}%`,
              width: '2px',
              animationDelay: isPlaying ? `${i * 0.05}s` : '0s'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
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
              {t('filters')}
            </button>

            {/* Enregistrer */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Mic className="w-4 h-4" />
              {t('record')}
            </button>

            {/* Upload */}
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              style={{ backgroundColor: '#6366f1' }}
            >
              <Upload className="w-4 h-4" />
              {t('upload')}
            </button>
          </div>
        </div>

        {/* Filtres étendus */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('type')}</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t('allTypes')}</option>
                  <option value="podcast">{t('podcast')}</option>
                  <option value="recording">{t('recording')}</option>
                  <option value="music">{t('music')}</option>
                  <option value="voiceNote">{t('voiceNote')}</option>
                  <option value="audiobook">{t('audiobook')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('status')}</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="ready">{t('ready')}</option>
                  <option value="processing">{t('processing')}</option>
                  <option value="transcribing">{t('transcribing')}</option>
                  <option value="error">{t('error')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="uploadDate">{t('uploadDate')}</option>
                  <option value="name">{t('name')}</option>
                  <option value="duration">{t('duration')}</option>
                  <option value="size">{t('size')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">{t('order')}</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-gray-600"
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <SortAsc className="w-4 h-4" />
                      {t('ascending')}
                    </>
                  ) : (
                    <>
                      <SortDesc className="w-4 h-4" />
                      {t('descending')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudios.map((audio) => (
            <div
              key={audio.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all border border-gray-700"
            >
              {/* Waveform ou Type Icon */}
              <div className="relative h-32 bg-gray-900 p-4">
                {audio.waveformData ? (
                  <Waveform data={audio.waveformData} isPlaying={playingId === audio.id} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className={`p-6 rounded-full ${getTypeColor(audio.type)}`}>
                      {getTypeIcon(audio.type)}
                    </div>
                  </div>
                )}
                
                {/* Progress bar si en traitement */}
                {audio.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div 
                      className="h-full bg-indigo-600 transition-all"
                      style={{ width: `${audio.progress}%`, backgroundColor: '#6366f1' }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-2 truncate">{audio.name}</h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{audio.duration}</span>
                  </div>
                  <span>{audio.size}</span>
                </div>

                {/* Détails techniques */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>{audio.format}</span>
                  <span>•</span>
                  <span>{audio.bitrate}</span>
                  <span>•</span>
                  <span>{t(audio.channels)}</span>
                </div>

                {/* Statuts */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Mic className="w-4 h-4 text-gray-500" />
                    {audio.transcriptionStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : audio.transcriptionStatus === 'pending' ? (
                      <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Languages className="w-4 h-4 text-gray-500" />
                    {audio.translationStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : audio.translationStatus === 'pending' ? (
                      <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Langues */}
                {audio.languages.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    {audio.languages.map(lang => (
                      <span 
                        key={lang} 
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: lang === audio.sourceLanguage ? '#d1fae5' : '#374151',
                          color: lang === audio.sourceLanguage ? '#065f46' : '#d1d5db'
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlay(audio.id)}
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm flex items-center justify-center gap-2"
                  >
                    {playingId === audio.id ? (
                      <>
                        <Pause className="w-4 h-4" />
                        {t('pause')}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        {t('play')}
                      </>
                    )}
                  </button>
                  {audio.status === 'ready' && (
                    <>
                      <button className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600" title={t('edit')}>
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600" title={t('download')}>
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <DropdownMenu audioId={audio.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vue Liste
        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left w-10">
                  <input type="checkbox" className="rounded border-gray-600" />
                </th>
                <th className="p-4 text-left text-gray-400 font-medium min-w-[250px]">{t('name')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-24">{t('type')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-20">{t('duration')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-20">{t('size')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-24">{t('format')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-32">{t('status')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-32">{t('languages')}</th>
                <th className="p-4 text-left text-gray-400 font-medium w-24">{t('date')}</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAudios.map((audio) => (
                <tr key={audio.id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-gray-600" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlay(audio.id)}
                        className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      >
                        {playingId === audio.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <div>
                        <p className="text-white font-medium truncate max-w-[300px]">{audio.name}</p>
                        <p className="text-xs text-gray-500">{audio.bitrate} • {audio.sampleRate} • {t(audio.channels)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${getTypeColor(audio.type)}`}>
                        {getTypeIcon(audio.type)}
                      </div>
                      <span className="text-gray-400 text-sm">{t(audio.type)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{audio.duration}</td>
                  <td className="p-4 text-gray-400 text-sm">{audio.size}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {audio.format}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Mic className="w-4 h-4 text-gray-500" />
                        {audio.transcriptionStatus === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : audio.transcriptionStatus === 'pending' ? (
                          <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="w-4 h-4 text-gray-500" />
                        {audio.translationStatus === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : audio.translationStatus === 'pending' ? (
                          <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {audio.languages.map(lang => (
                        <span 
                          key={lang} 
                          className="px-2 py-1 rounded text-xs"
                          style={{ 
                            backgroundColor: lang === audio.sourceLanguage ? '#d1fae5' : '#374151',
                            color: lang === audio.sourceLanguage ? '#065f46' : '#d1d5db'
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(audio.uploadDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <DropdownMenu audioId={audio.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message si aucun audio */}
      {filteredAudios.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{t('noAudios')}</p>
          <button 
            className="text-indigo-400 hover:text-indigo-300"
            style={{ color: '#6366f1' }}
          >
            {t('uploadFirst')}
          </button>
        </div>
      )}
    </div>
  );
};

// Composant Menu déroulant
const DropdownMenu: React.FC<{ audioId: string }> = ({ audioId }) => {
  const { t } = useTranslation('audios');
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
              <Activity className="w-4 h-4" />
              {t('waveform')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              {t('trim')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('enhance')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {t('removeNoise')}
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              {t('transcribe')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              {t('translate')}
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t('download')}
            </button>
            <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              {t('rename')}
            </button>
            <hr className="my-1 border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              {t('delete')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AudiosPage;