// project/src/pages/TranscriptionPage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  Settings,
  Languages,
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  FileText,
  Copy,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Type,
  Headphones,
  FileAudio,
  Wand2,
  RefreshCw,
  History,
  MessageSquare,
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Star,
  StarOff,
  BookOpen,
  Target,
  Activity,
  TrendingUp,
  Info,
  HelpCircle,
  Keyboard,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  Shield,
  Award,
  Zap,
  Sliders,
  Tag,
  Hash,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image,
  Paperclip,
  Send,
  Archive,
  FolderOpen,
  Database,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Cpu,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence: number;
  isEdited?: boolean;
  originalText?: string;
  suggestions?: string[];
}

interface Speaker {
  id: string;
  name: string;
  color: string;
  segments: number;
  totalDuration: number;
}

interface TranscriptionProject {
  id: string;
  name: string;
  audioUrl?: string;
  videoUrl?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  status: 'idle' | 'recording' | 'processing' | 'completed' | 'error';
  segments: TranscriptionSegment[];
  speakers: Speaker[];
  accuracy?: number;
  wer?: number;
  sector?: string;
  template?: string;
  glossary?: string[];
  tags: string[];
  starred: boolean;
  autoSave: boolean;
  collaborators: string[];
}

interface AICorrection {
  original: string;
  suggestion: string;
  confidence: number;
  type: 'spelling' | 'grammar' | 'punctuation' | 'terminology';
}

interface Template {
  id: string;
  name: string;
  sector: string;
  format: string;
  glossary: string[];
  shortcuts: { [key: string]: string };
}

// Templates sectoriels
const sectorTemplates: Template[] = [
  {
    id: 'medical',
    name: 'Médical',
    sector: 'medical',
    format: 'consultation',
    glossary: ['diagnostic', 'symptôme', 'traitement', 'prescription', 'anamnèse'],
    shortcuts: {
      'dr': 'Docteur',
      'pat': 'Patient',
      'rx': 'Radiographie',
      'irm': 'IRM'
    }
  },
  {
    id: 'legal',
    name: 'Juridique',
    sector: 'legal',
    format: 'deposition',
    glossary: ['témoin', 'avocat', 'jugement', 'audience', 'plaidoirie'],
    shortcuts: {
      'me': 'Maître',
      'art': 'Article',
      'al': 'Alinéa'
    }
  },
  {
    id: 'business',
    name: 'Business',
    sector: 'business',
    format: 'meeting',
    glossary: ['revenue', 'KPI', 'ROI', 'stratégie', 'objectif'],
    shortcuts: {
      'ceo': 'CEO',
      'cfo': 'CFO',
      'q': 'Quarter'
    }
  }
];

// Composant Éditeur de texte enrichi
const RichTextEditor: React.FC<{
  content: string;
  onChange: (content: string) => void;
  onSegmentClick?: (segmentId: string) => void;
  selectedSegment?: string;
  readOnly?: boolean;
}> = ({ content, onChange, onSegmentClick, selectedSegment, readOnly }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(14);
  const [showToolbar, setShowToolbar] = useState(true);
  const [selection, setSelection] = useState<string>('');

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTextSelection = () => {
    const selected = window.getSelection()?.toString() || '';
    setSelection(selected);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      {showToolbar && !readOnly && (
        <div className="flex items-center gap-2 p-3 bg-gray-900 border-b border-gray-700 flex-wrap">
          {/* Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
            <button
              onClick={() => handleFormat('bold')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Gras"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Italique"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('underline')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Souligné"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
            <button
              onClick={() => handleFormat('justifyLeft')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Aligner à gauche"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('justifyCenter')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Centrer"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('justifyRight')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Aligner à droite"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
            <button
              onClick={() => handleFormat('insertUnorderedList')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Liste à puces"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('insertOrderedList')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Liste numérotée"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2 border-r border-gray-700 pr-2">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="p-2 hover:bg-gray-800 rounded"
              title="Réduire"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm px-2">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-2 hover:bg-gray-800 rounded"
              title="Agrandir"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Special */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFormat('removeFormat')}
              className="p-2 hover:bg-gray-800 rounded"
              title="Effacer le formatage"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        className="flex-1 p-4 overflow-auto focus:outline-none"
        style={{ fontSize: `${fontSize}px` }}
        onInput={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Selection toolbar */}
      {selection && !readOnly && (
        <div className="absolute bg-gray-900 rounded-lg shadow-lg p-2 flex items-center gap-2 z-10">
          <button
            onClick={() => {
              navigator.clipboard.writeText(selection);
              toast.success('Copié !');
              setSelection('');
            }}
            className="p-1 hover:bg-gray-800 rounded"
            title="Copier"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              toast(`Recherche de "${selection}"`, { icon: '🔍' });
              setSelection('');
            }}
            className="p-1 hover:bg-gray-800 rounded"
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              toast.success(`"${selection}" ajouté au glossaire`);
              setSelection('');
            }}
            className="p-1 hover:bg-gray-800 rounded"
            title="Ajouter au glossaire"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Composant Timeline des segments
const SegmentTimeline: React.FC<{
  segments: TranscriptionSegment[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSegmentClick: (segment: TranscriptionSegment) => void;
  speakers: Speaker[];
}> = ({ segments, currentTime, duration, onSeek, onSegmentClick, speakers }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Timeline</h3>
      
      {/* Timeline bar */}
      <div
        ref={timelineRef}
        className="relative h-12 bg-gray-800 rounded-lg cursor-pointer mb-4"
        onClick={handleTimelineClick}
      >
        {/* Segments */}
        {segments.map((segment) => {
          const speaker = speakers.find(s => s.id === segment.speaker);
          const left = (segment.start / duration) * 100;
          const width = ((segment.end - segment.start) / duration) * 100;
          
          return (
            <div
              key={segment.id}
              className="absolute h-full opacity-70 hover:opacity-100 transition-opacity"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: speaker?.color || '#6366f1'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSegmentClick(segment);
              }}
              title={`${speaker?.name || 'Unknown'}: ${segment.text.substring(0, 50)}...`}
            />
          );
        })}
        
        {/* Current position */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Speakers legend */}
      <div className="flex flex-wrap gap-2 mt-4">
        {speakers.map(speaker => (
          <div key={speaker.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: speaker.color }}
            />
            <span className="text-xs">{speaker.name}</span>
            <span className="text-xs text-gray-500">({speaker.segments})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant Principal TranscriptionPage
const TranscriptionPage: React.FC = () => {
  // États
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentProject, setCurrentProject] = useState<TranscriptionProject | null>(null);
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<TranscriptionSegment | null>(null);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [aiCorrections, setAiCorrections] = useState<AICorrection[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [wer, setWer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<'manual' | 'auto'>('manual');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    if (autoSave && currentProject) {
      const interval = setInterval(() => {
        saveProject();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoSave, currentProject, transcriptionText]);

  useEffect(() => {
    loadDemoProject();
  }, []);

  const loadDemoProject = () => {
    const demoProject: TranscriptionProject = {
      id: 'demo_1',
      name: 'Interview_Medical_Demo.mp3',
      audioUrl: undefined, // CORRECTION: Changé de '#' à undefined
      language: 'fr',
      createdAt: new Date(),
      updatedAt: new Date(),
      duration: 180,
      status: 'completed',
      segments: [
        {
          id: 'seg_1',
          start: 0,
          end: 10,
          text: 'Bonjour, comment vous sentez-vous aujourd\'hui ?',
          speaker: 'speaker_1',
          confidence: 0.98
        },
        {
          id: 'seg_2',
          start: 10,
          end: 20,
          text: 'Je me sens beaucoup mieux, merci docteur.',
          speaker: 'speaker_2',
          confidence: 0.95
        },
        {
          id: 'seg_3',
          start: 20,
          end: 35,
          text: 'C\'est une excellente nouvelle. Avez-vous ressenti des effets secondaires avec le nouveau traitement ?',
          speaker: 'speaker_1',
          confidence: 0.97
        }
      ],
      speakers: [
        {
          id: 'speaker_1',
          name: 'Dr. Martin',
          color: '#6366f1',
          segments: 2,
          totalDuration: 25
        },
        {
          id: 'speaker_2',
          name: 'Patient',
          color: '#8b5cf6',
          segments: 1,
          totalDuration: 10
        }
      ],
      accuracy: 97.5,
      wer: 2.5,
      sector: 'medical',
      tags: ['consultation', 'suivi'],
      starred: false,
      autoSave: true,
      collaborators: []
    };

    setCurrentProject(demoProject);
    setSegments(demoProject.segments);
    setDuration(demoProject.duration);
    setConfidence(demoProject.accuracy || 0);
    setWer(demoProject.wer || 0);
    
    const fullText = demoProject.segments
      .map(seg => `<p data-segment="${seg.id}"><strong>${
        demoProject.speakers.find(s => s.id === seg.speaker)?.name || 'Unknown'
      }:</strong> ${seg.text}</p>`)
      .join('');
    setTranscriptionText(fullText);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        processAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.success('Enregistrement démarré');
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      toast.error('Impossible de démarrer l\'enregistrement');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setIsPaused(false);
      toast.success('Enregistrement terminé');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast('Enregistrement repris', { icon: '▶️' });
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast('Enregistrement en pause', { icon: '⏸️' });
      }
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const newSegments: TranscriptionSegment[] = [
        {
          id: `seg_${Date.now()}`,
          start: 0,
          end: 5,
          text: 'Ceci est une transcription automatique de test.',
          confidence: 0.92
        }
      ];
      
      setSegments([...segments, ...newSegments]);
      setIsProcessing(false);
      toast.success('Transcription terminée');
    }, 3000);
  };

  // NOUVELLE FONCTION : Upload de fichier audio
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez MP3, WAV, WEBM ou OGG.');
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    
    const newProject: TranscriptionProject = {
      id: `project_${Date.now()}`,
      name: file.name,
      audioUrl: audioUrl,
      language: selectedLanguage,
      createdAt: new Date(),
      updatedAt: new Date(),
      duration: 0,
      status: 'idle',
      segments: [],
      speakers: [],
      tags: [],
      starred: false,
      autoSave: true,
      collaborators: []
    };

    setCurrentProject(newProject);
    setSegments([]);
    setTranscriptionText('');
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        toast.success(`Fichier "${file.name}" chargé avec succès`);
      };
    }
  };

  // NOUVELLE FONCTION : Basculer favoris
  const toggleStar = () => {
    if (!currentProject) return;
    
    const updatedProject = {
      ...currentProject,
      starred: !currentProject.starred
    };
    
    setCurrentProject(updatedProject);
    
    if (updatedProject.starred) {
      toast.success('Ajouté aux favoris');
    } else {
      toast('Retiré des favoris', { icon: '⭐' });
    }
  };

  // NOUVELLE FONCTION : Traiter avec l'IA
  const processWithAI = async () => {
    if (!currentProject?.audioUrl) {
      toast.error('Aucun fichier audio chargé');
      return;
    }

    setIsProcessing(true);
    toast('Transcription en cours...', { icon: '🔄' });
    
    setTimeout(() => {
      const demoSegments: TranscriptionSegment[] = [
        {
          id: `seg_${Date.now()}_1`,
          start: 0,
          end: 8,
          text: 'Transcription automatique générée par l\'IA.',
          speaker: 'speaker_1',
          confidence: 0.96
        },
        {
          id: `seg_${Date.now()}_2`,
          start: 8,
          end: 15,
          text: 'Le système analyse l\'audio et identifie les locuteurs.',
          speaker: 'speaker_2',
          confidence: 0.94
        }
      ];
      
      const newSpeakers: Speaker[] = [
        {
          id: 'speaker_1',
          name: 'Locuteur 1',
          color: '#6366f1',
          segments: 1,
          totalDuration: 8
        },
        {
          id: 'speaker_2',
          name: 'Locuteur 2',
          color: '#8b5cf6',
          segments: 1,
          totalDuration: 7
        }
      ];

      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          speakers: newSpeakers,
          status: 'completed'
        });
      }
      
      setSegments(demoSegments);
      updateFullText();
      setConfidence(95);
      setWer(5);
      setIsProcessing(false);
      toast.success('Transcription terminée avec succès !');
    }, 4000);
  };

  const handleSegmentEdit = (segmentId: string, newText: string) => {
    setSegments(segments.map(seg => 
      seg.id === segmentId 
        ? { ...seg, text: newText, isEdited: true, originalText: seg.originalText || seg.text }
        : seg
    ));
    updateFullText();
  };

  const updateFullText = () => {
    const fullText = segments
      .map(seg => `<p data-segment="${seg.id}"><strong>${
        currentProject?.speakers.find(s => s.id === seg.speaker)?.name || 'Speaker'
      }:</strong> ${seg.text}</p>`)
      .join('');
    setTranscriptionText(fullText);
  };

  const applyAiCorrection = (correction: AICorrection) => {
    setTranscriptionText(transcriptionText.replace(correction.original, correction.suggestion));
    toast.success('Correction appliquée');
  };

  const generateAiCorrections = () => {
    if (segments.length === 0) {
      toast.error('Aucun segment à analyser');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const corrections: AICorrection[] = [
        {
          original: 'beaucoup mieux',
          suggestion: 'beaucoup mieux',
          confidence: 0.95,
          type: 'grammar'
        },
        {
          original: 'traitement',
          suggestion: 'traitement',
          confidence: 0.98,
          type: 'terminology'
        }
      ];
      
      setAiCorrections(corrections);
      setIsProcessing(false);
      toast.success('Corrections IA générées');
    }, 2000);
  };

  const saveProject = () => {
    if (!currentProject) return;
    
    const projectToSave = {
      ...currentProject,
      segments,
      transcriptionText,
      updatedAt: new Date()
    };
    
    localStorage.setItem(`transcription_${currentProject.id}`, JSON.stringify(projectToSave));
    toast.success('Projet sauvegardé');
  };

  const exportTranscription = (format: 'txt' | 'docx' | 'srt' | 'json') => {
    if (segments.length === 0) {
      toast.error('Aucun contenu à exporter');
      return;
    }

    let content = '';
    let mimeType = '';
    let fileName = `${currentProject?.name || 'transcription'}.${format}`;
    
    switch (format) {
      case 'txt':
        content = segments.map(seg => seg.text).join('\n\n');
        mimeType = 'text/plain';
        break;
      case 'srt':
        content = segments.map((seg, index) => 
          `${index + 1}\n${formatSrtTime(seg.start)} --> ${formatSrtTime(seg.end)}\n${seg.text}\n`
        ).join('\n');
        mimeType = 'text/srt';
        break;
      case 'json':
        content = JSON.stringify({ project: currentProject, segments }, null, 2);
        mimeType = 'application/json';
        break;
      default:
        toast.error('Format non supporté');
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exporté en ${format.toUpperCase()}`);
  };

  const formatSrtTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleTemplateChange = (templateId: string) => {
    const template = sectorTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    if (template) {
      toast.success(`Template ${template.name} appliqué`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header réorganisé sur 2 lignes */}
      <div className="bg-gray-900 border-b border-gray-800">
        {/* Ligne 1 : Titre + Infos + Métriques */}
        <div className="px-4 py-2 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Titre compact */}
              <h1 className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-violet-400" />
                Éditeur de Transcription IA
              </h1>
              
              {/* Infos projet AVEC BOUTON ÉTOILE */}
              {currentProject && (
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-800 rounded">
                    {currentProject.name}
                  </span>
                  <button
                    onClick={toggleStar}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                    title={currentProject.starred ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {currentProject.starred ? (
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-3 h-3 text-gray-400 hover:text-yellow-500" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Métriques temps réel */}
            <div className="flex items-center gap-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                {isRecording && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-red-400">
                      {isPaused ? 'En pause' : 'Enregistrement'}
                    </span>
                  </div>
                )}
                {isProcessing && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-violet-500/20 rounded">
                    <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                    <span className="text-xs text-violet-400">Traitement IA</span>
                  </div>
                )}
              </div>

              {/* Métriques */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-emerald-400" />
                  <span className="text-gray-400">Précision:</span>
                  <span className="font-medium text-emerald-400">{confidence.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-violet-400" />
                  <span className="text-gray-400">WER:</span>
                  <span className="font-medium text-violet-400">{wer.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-400">Durée:</span>
                  <span className="font-medium text-blue-400">
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne 2 : Contrôles et Actions */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Contrôles gauche */}
            <div className="flex items-center gap-2">
              {/* Contrôles d'enregistrement */}
              <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    title="Démarrer l'enregistrement"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="p-2 bg-amber-600 hover:bg-amber-700 rounded transition-colors"
                      title={isPaused ? 'Reprendre' : 'Pause'}
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={stopRecording}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      title="Arrêter"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Upload audio CORRIGÉ */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Importer un fichier audio"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {/* Language selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  const lang = languages.find(l => l.code === e.target.value);
                  toast.success(`Langue: ${lang?.name}`);
                }}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              {/* Template selector */}
              <select
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs"
                defaultValue=""
              >
                <option value="">Template sectoriel</option>
                {sectorTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>

              {/* Edit mode CORRIGÉ */}
              <div className="flex items-center bg-gray-800 rounded overflow-hidden">
                <button
                  onClick={() => {
                    setEditMode('manual');
                    toast('Mode édition manuelle', { icon: '✏️' });
                  }}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    editMode === 'manual' 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Manuel
                </button>
                <button
                  onClick={() => {
                    setEditMode('auto');
                    toast('Mode correction IA', { icon: '🤖' });
                    if (segments.length > 0) {
                      generateAiCorrections();
                    }
                  }}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    editMode === 'auto' 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Auto IA
                </button>
              </div>

              {/* Process with AI button */}
              {currentProject?.audioUrl && segments.length === 0 && (
                <button
                  onClick={processWithAI}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  Transcrire
                </button>
              )}
            </div>

            {/* Actions droite */}
            <div className="flex items-center gap-2">
              {/* Auto-save toggle */}
              <button
                onClick={() => {
                  setAutoSave(!autoSave);
                  toast(autoSave ? 'Sauvegarde auto désactivée' : 'Sauvegarde auto activée', { 
                    icon: autoSave ? '💾❌' : '💾✅' 
                  });
                }}
                className={`p-2 rounded transition-colors ${
                  autoSave ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
                title={autoSave ? 'Sauvegarde auto activée' : 'Sauvegarde auto désactivée'}
              >
                {autoSave ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
              </button>

              {/* Generate AI */}
              <button
                onClick={generateAiCorrections}
                disabled={isProcessing || segments.length === 0}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
              >
                <Brain className="w-4 h-4" />
                Analyser
              </button>

              {/* Save */}
              <button
                onClick={saveProject}
                disabled={!currentProject}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>

              {/* Export dropdown */}
              <div className="relative group">
                <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => exportTranscription('txt')}
                    className="w-full px-3 py-2 text-xs text-left hover:bg-gray-700"
                  >
                    Texte (.txt)
                  </button>
                  <button
                    onClick={() => exportTranscription('srt')}
                    className="w-full px-3 py-2 text-xs text-left hover:bg-gray-700"
                  >
                    Sous-titres (.srt)
                  </button>
                  <button
                    onClick={() => exportTranscription('json')}
                    className="w-full px-3 py-2 text-xs text-left hover:bg-gray-700"
                  >
                    JSON (.json)
                  </button>
                </div>
              </div>

              {/* View toggles */}
              <div className="flex items-center gap-1 border-l border-gray-700 pl-2">
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`p-2 rounded transition-colors ${
                    showTimeline ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                  title="Timeline"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowAiPanel(!showAiPanel)}
                  className={`p-2 rounded transition-colors ${
                    showAiPanel ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                  title="Assistant IA"
                >
                  <Brain className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Audio Player CORRIGÉ avec vérification */}
          {currentProject?.audioUrl && currentProject.audioUrl !== '#' && (
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-400" />
                Lecteur audio
              </h3>
              <audio
                ref={audioRef}
                src={currentProject.audioUrl}
                controls
                className="w-full"
                onTimeUpdate={(e) => {
                  setCurrentTime(e.currentTarget.currentTime);
                }}
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Boutons de contrôle audio */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, currentTime - 5);
                    }
                  }}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                  title="Reculer 5s"
                >
                  -5s
                </button>
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      if (audioRef.current.paused) {
                        audioRef.current.play();
                      } else {
                        audioRef.current.pause();
                      }
                    }
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs flex-1"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(duration, currentTime + 5);
                    }
                  }}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                  title="Avancer 5s"
                >
                  +5s
                </button>
              </div>
            </div>
          )}

          {/* Timeline et Segments */}
          {showTimeline && currentProject && (
            <div className="flex-1 p-4 overflow-y-auto">
              <SegmentTimeline
                segments={segments}
                currentTime={currentTime}
                duration={duration}
                onSeek={(time) => {
                  setCurrentTime(time);
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                  }
                }}
                onSegmentClick={(segment) => {
                  setSelectedSegment(segment);
                  setCurrentTime(segment.start);
                  if (audioRef.current) {
                    audioRef.current.currentTime = segment.start;
                  }
                }}
                speakers={currentProject.speakers}
              />
              
              {/* Segments list */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-3">Segments</h3>
                <div className="space-y-2">
                  {segments.map((segment) => {
                    const speaker = currentProject.speakers.find(s => s.id === segment.speaker);
                    return (
                      <div
                        key={segment.id}
                        onClick={() => {
                          setSelectedSegment(segment);
                          if (audioRef.current) {
                            audioRef.current.currentTime = segment.start;
                          }
                        }}
                        className={`p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-all ${
                          selectedSegment?.id === segment.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: speaker?.color || '#6366f1' }}
                          >
                            {speaker?.name[0] || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">
                                {Math.floor(segment.start)}s - {Math.floor(segment.end)}s
                              </span>
                              {segment.confidence && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  segment.confidence > 0.95 
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : segment.confidence > 0.9
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {(segment.confidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{segment.text}</p>
                            {segment.isEdited && (
                              <span className="text-xs text-blue-400 mt-1 inline-block">
                                Modifié
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center - Text Editor */}
        <div className="flex-1 bg-gray-950 flex flex-col">
          <RichTextEditor
            content={transcriptionText}
            onChange={setTranscriptionText}
            selectedSegment={selectedSegment?.id}
            readOnly={isProcessing}
          />
        </div>

        {/* Right Panel - AI Assistant */}
        {showAiPanel && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                Assistant IA
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Corrections suggérées</h4>
                <button
                  onClick={generateAiCorrections}
                  disabled={isProcessing || segments.length === 0}
                  className="p-1 hover:bg-gray-800 rounded disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {aiCorrections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune correction suggérée</p>
                  {segments.length > 0 && (
                    <button
                      onClick={generateAiCorrections}
                      className="mt-3 px-3 py-1 bg-violet-600 hover:bg-violet-700 rounded text-sm"
                    >
                      Analyser le texte
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {aiCorrections.map((correction, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          correction.type === 'spelling' ? 'bg-red-500/20 text-red-400' :
                          correction.type === 'grammar' ? 'bg-amber-500/20 text-amber-400' :
                          correction.type === 'punctuation' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-violet-500/20 text-violet-400'
                        }`}>
                          {correction.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(correction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-red-400 line-through">{correction.original}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-emerald-400">{correction.suggestion}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => applyAiCorrection(correction)}
                          className="flex-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-xs"
                        >
                          Appliquer
                        </button>
                        <button
                          onClick={() => {
                            setAiCorrections(aiCorrections.filter((_, i) => i !== index));
                          }}
                          className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                        >
                          Ignorer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Glossary */}
            {selectedTemplate && (
              <div className="p-4 border-t border-gray-800">
                <h4 className="text-sm font-medium mb-3">Glossaire {selectedTemplate.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.glossary.map((term, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 rounded text-xs cursor-pointer hover:bg-gray-700"
                      onClick={() => {
                        navigator.clipboard.writeText(term);
                        toast.success(`"${term}" copié`);
                      }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-lg font-medium">Traitement en cours...</p>
            <p className="text-sm text-gray-400 mt-2">Analyse par intelligence artificielle</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionPage;