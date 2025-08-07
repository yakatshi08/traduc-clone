import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Edit3,
  Save,
  Download,
  Users,
  Clock,
  MessageSquare,
  Check
} from 'lucide-react';
import { TranscriptionResult, TranscriptionSegment } from '../../services/aiService';

interface TranscriptionEditorProps {
  result: TranscriptionResult;
  audioUrl?: string;
  onSave: (updatedResult: TranscriptionResult) => void;
}

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = ({ 
  result, 
  audioUrl,
  onSave 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [editingSegment, setEditingSegment] = useState<string | null>(null);
  const [segments, setSegments] = useState(result.segments);
  const [showSummary, setShowSummary] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Synchronisation audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      
      // Highlight segment actuel
      const currentSegment = segments.find(
        seg => audio.currentTime >= seg.start && audio.currentTime <= seg.end
      );
      if (currentSegment) {
        setSelectedSegment(currentSegment.id);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [segments]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSegmentClick = (segment: TranscriptionSegment) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = segment.start;
      setSelectedSegment(segment.id);
    }
  };

  const handleSegmentEdit = (segmentId: string, newText: string) => {
    setSegments(segments.map(seg => 
      seg.id === segmentId ? { ...seg, text: newText } : seg
    ));
    setEditingSegment(null);
  };

  const handleSave = () => {
    const updatedResult: TranscriptionResult = {
      ...result,
      segments,
      text: segments.map(s => s.text).join(' ')
    };
    onSave(updatedResult);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakers = Array.from(new Set(segments.map(s => s.speaker).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Éditeur */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player audio */}
          {audioUrl && (
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <audio ref={audioRef} src={audioUrl} />
              
              {/* Contrôles */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
                  }}
                  className="p-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-full"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                  }}
                  className="p-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 h-2 bg-traduc-beige-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-traduc-indigo transition-all"
                      style={{ width: `${(currentTime / result.metadata.duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    {formatTime(result.metadata.duration)}
                  </span>
                </div>
                
                <Volume2 className="w-5 h-5 text-traduc-beige-600 dark:text-gray-400" />
              </div>

              {/* Timeline visuelle */}
              <div className="relative h-16 bg-traduc-beige-50 dark:bg-gray-900 rounded-lg p-2">
                {segments.map((segment) => {
                  const left = (segment.start / result.metadata.duration) * 100;
                  const width = ((segment.end - segment.start) / result.metadata.duration) * 100;
                  
                  return (
                    <div
                      key={segment.id}
                      className={`absolute top-2 h-12 rounded cursor-pointer transition-all ${
                        selectedSegment === segment.id
                          ? 'bg-traduc-indigo ring-2 ring-traduc-indigo ring-offset-2'
                          : 'bg-traduc-violet/30 hover:bg-traduc-violet/50'
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      onClick={() => handleSegmentClick(segment)}
                    />
                  );
                })}
                
                {/* Curseur de lecture */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-traduc-red"
                  style={{ left: `${(currentTime / result.metadata.duration) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Segments de transcription */}
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
                Transcription
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-traduc-emerald hover:bg-traduc-emerald/90 text-white rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedSegment === segment.id
                      ? 'border-traduc-indigo bg-traduc-indigo/5'
                      : 'border-traduc-beige-200 dark:border-gray-700 hover:border-traduc-indigo/50'
                  }`}
                  onClick={() => handleSegmentClick(segment)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-xs text-traduc-beige-600 dark:text-gray-400 mb-1">
                        {formatTime(segment.start)} - {formatTime(segment.end)}
                      </div>
                      {segment.speaker && (
                        <div className="flex items-center gap-1 text-xs text-traduc-indigo">
                          <Users className="w-3 h-3" />
                          {segment.speaker}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {editingSegment === segment.id ? (
                        <div className="flex items-start gap-2">
                          <textarea
                            value={segment.text}
                            onChange={(e) => handleSegmentEdit(segment.id, e.target.value)}
                            className="flex-1 p-2 border border-traduc-beige-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                            rows={3}
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingSegment(null)}
                            className="p-2 bg-traduc-emerald hover:bg-traduc-emerald/90 text-white rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <p 
                          className="text-traduc-beige-900 dark:text-white cursor-text"
                          onDoubleClick={() => setEditingSegment(segment.id)}
                        >
                          {segment.text}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-traduc-beige-500 dark:text-gray-500">
                          Confiance: {Math.round(segment.confidence * 100)}%
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSegment(segment.id);
                          }}
                          className="text-xs text-traduc-indigo hover:text-traduc-indigo/80 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Éditer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne latérale - Métadonnées */}
        <div className="space-y-6">
          {/* Informations */}
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
              Informations
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-traduc-beige-600 dark:text-gray-400">Durée</span>
                <span className="text-sm font-medium text-traduc-beige-900 dark:text-white">
                  {formatTime(result.metadata.duration)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-traduc-beige-600 dark:text-gray-400">Mots</span>
                <span className="text-sm font-medium text-traduc-beige-900 dark:text-white">
                  {result.metadata.wordCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-traduc-beige-600 dark:text-gray-400">Précision</span>
                <span className="text-sm font-medium text-traduc-emerald">
                  {result.metadata.accuracy}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-traduc-beige-600 dark:text-gray-400">Moteur</span>
                <span className="text-sm font-medium text-traduc-beige-900 dark:text-white">
                  {result.metadata.engine}
                </span>
              </div>
            </div>
          </div>

          {/* Locuteurs */}
          {speakers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Locuteurs
              </h3>
              
              <div className="space-y-2">
                {speakers.map((speaker) => (
                  <div key={speaker} className="flex items-center justify-between p-2 bg-traduc-beige-50 dark:bg-gray-900 rounded">
                    <span className="text-sm text-traduc-beige-900 dark:text-white">{speaker}</span>
                    <span className="text-xs text-traduc-beige-600 dark:text-gray-400">
                      {segments.filter(s => s.speaker === speaker).length} segments
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résumé */}
          {result.summary && (
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Résumé
              </h3>
              <p className="text-sm text-traduc-beige-700 dark:text-gray-300">
                {result.summary}
              </p>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
              Actions
            </h3>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-traduc-violet hover:bg-traduc-violet/90 text-white rounded-lg text-sm">
                Générer des sous-titres
              </button>
              <button className="w-full px-4 py-2 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg text-sm">
                Traduire en anglais
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm">
                Partager le projet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionEditor;