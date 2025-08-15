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
  Cpu
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
        <div className="absolute bg-gray-900 rounded-lg shadow-lg p-2 flex items-center gap-2">
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
              // Rechercher dans le glossaire
              toast.info(`Recherche de "${selection}"`);
              setSelection('');
            }}
            className="p-1 hover:bg-gray-800 rounded"
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              // Ajouter au glossaire
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

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    // Auto-save
    if (autoSave && currentProject) {
      const interval = setInterval(() => {
        saveProject();
      }, 30000); // Save every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoSave, currentProject, transcriptionText]);

  useEffect(() => {
    // Charger un projet de démonstration
    loadDemoProject();
  }, []);

  const loadDemoProject = () => {
    const demoProject: TranscriptionProject = {
      id: 'demo_1',
      name: 'Interview_Medical_Demo.mp3',
      audioUrl: '#',
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
    
    // Générer le texte complet
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
        toast.info('Enregistrement repris');
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast.info('Enregistrement en pause');
      }
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    
    // Simuler le traitement
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

  const handleSegmentEdit = (segmentId: string, newText: string) => {
    setSegments(segments.map(seg => 
      seg.id === segmentId 
        ? { ...seg, text: newText, isEdited: true, originalText: seg.originalText || seg.text }
        : seg
    ));
    
    // Mettre à jour le texte complet
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
    setIsProcessing(true);
    
    // Simuler la génération de corrections IA
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
    
    // Sauvegarder dans localStorage ou API
    localStorage.setItem(`transcription_${currentProject.id}`, JSON.stringify(projectToSave));
    toast.success('Projet sauvegardé');
  };

  const exportTranscription = (format: 'txt' | 'docx' | 'srt' | 'json') => {
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Éditeur de Transcription IA
            </h1>
            {currentProject && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{currentProject.name}</span>
                {currentProject.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
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
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">Choisir un template</option>
              {sectorTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            
            {/* Auto-save toggle */}
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`p-2 rounded-lg transition-colors ${
                autoSave ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
              title={autoSave ? 'Sauvegarde auto activée' : 'Sauvegarde auto désactivée'}
            >
              {autoSave ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
            </button>
            
            {/* Save button */}
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            
            {/* Export menu */}
            <div className="relative group">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => exportTranscription('txt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-t-lg"
                >
                  Texte (.txt)
                </button>
                <button
                  onClick={() => exportTranscription('srt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  Sous-titres (.srt)
                </button>
                <button
                  onClick={() => exportTranscription('json')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded-b-lg"
                >
                  JSON (.json)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Recording Controls & Timeline */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Recording Controls */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-400" />
              Contrôles d'enregistrement
            </h3>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <Mic className="w-6 h-6" />
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseRecording}
                    className="p-3 bg-amber-600 hover:bg-amber-700 rounded-full transition-colors"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            {isRecording && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">
                    {isPaused ? 'En pause' : 'Enregistrement...'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Audio player */}
            {currentProject?.audioUrl && (
              <div className="mt-4">
                <audio
                  ref={audioRef}
                  src={currentProject.audioUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Timeline */}
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
                        onClick={() => setSelectedSegment(segment)}
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
            {/* AI Header */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                Assistant IA
              </h3>
            </div>

            {/* AI Metrics */}
            <div className="p-4 border-b border-gray-800">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Précision</span>
                    <span className="font-medium">{confidence.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">WER</span>
                    <span className="font-medium">{wer.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full"
                      style={{ width: `${100 - wer}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Corrections */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Corrections suggérées</h4>
                <button
                  onClick={generateAiCorrections}
                  disabled={isProcessing}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {aiCorrections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune correction suggérée</p>
                  <button
                    onClick={generateAiCorrections}
                    className="mt-3 px-3 py-1 bg-violet-600 hover:bg-violet-700 rounded text-sm"
                  >
                    Analyser le texte
                  </button>
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

            {/* Collaborators */}
            {collaborators.length > 0 && (
              <div className="p-4 border-t border-gray-800">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Collaborateurs ({collaborators.length})
                </h4>
                <div className="flex -space-x-2">
                  {collaborators.map((collab, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                      title={collab}
                    >
                      {collab[0].toUpperCase()}
                    </div>
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