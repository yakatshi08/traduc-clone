import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Edit,
  Share2,
  Eye,
  Copy,
  MoreVertical,
  Upload,
  FolderOpen,
  File,
  FileAudio,
  FileVideo,
  Image,
  Plus,
  X,
  Check,
  Clock,
  Users,
  Lock,
  Unlock,
  Star,
  StarOff,
  Tag,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  Link,
  Mail,
  MessageSquare,
  History,
  RefreshCw,
  Archive,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileEdit,
  Maximize2,
  Brain,
  Languages,
  Globe,
  Zap,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  Newspaper,
  Activity,
  TrendingUp,
  Database,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types améliorés pour TraduckXion
interface Document {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'document' | 'image' | 'transcription' | 'pdf' | 'docx' | 'txt' | 'srt' | 'vtt' | 'xlsx' | 'pptx';
  size: number;
  projectId: string;
  projectName: string;
  folderId?: string;
  createdAt: string;
  modifiedAt: string;
  status: 'transcribed' | 'processing' | 'pending' | 'error' | 'ready' | 'translating';
  language?: string;
  targetLanguages?: string[]; // Pour les traductions
  duration?: number;
  transcription?: string;
  translation?: { [key: string]: string }; // Traductions par langue
  url?: string;
  thumbnail?: string;
  tags: string[];
  starred: boolean;
  shared: boolean;
  sharedWith: string[];
  version: number;
  versions: DocumentVersion[];
  comments: Comment[];
  permissions: 'view' | 'edit' | 'admin';
  // Nouveaux champs TraduckXion
  sector?: 'medical' | 'legal' | 'business' | 'education' | 'media';
  accuracy?: number; // Précision de transcription
  wer?: number; // Word Error Rate
  confidence?: number; // Niveau de confiance IA
  aiModel?: string; // Modèle IA utilisé
  pages?: number; // Pour les documents PDF/DOCX
}

interface DocumentVersion {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
  size: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  documentsCount: number;
  expanded: boolean;
  color?: string; // Couleur par secteur
  sector?: string;
}

interface DocumentStats {
  total: number;
  transcribed: number;
  translated: number;
  audio: number;
  video: number;
  documents: number;
  totalSize: number;
  totalPages: number;
  averageAccuracy: number;
  averageWER: number;
  bySector: { [key: string]: number };
  byLanguage: { [key: string]: number };
}

// Composants existants conservés
interface ShareModalProps {
  document: Document;
  onClose: () => void;
  onShare: (emails: string[], permission: string) => void;
}

interface PreviewModalProps {
  document: Document;
  onClose: () => void;
  onEdit: () => void;
  onTranscribe?: () => void;
  onTranslate?: () => void;
}

// Modal de Partage (conservé et amélioré)
const ShareModal: React.FC<ShareModalProps> = ({ document, onClose, onShare }) => {
  const [emails, setEmails] = useState('');
  const [permission, setPermission] = useState('view');
  const [message, setMessage] = useState('');
  const [copyLink, setCopyLink] = useState(false);

  const handleShare = () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
    if (emailList.length === 0 && !copyLink) {
      toast.error('Veuillez entrer au moins une adresse email ou copier le lien');
      return;
    }
    
    if (copyLink) {
      const shareUrl = `${window.location.origin}/shared/${document.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Lien copié dans le presse-papier');
    }
    
    if (emailList.length > 0) {
      onShare(emailList, permission);
      toast.success('Document partagé avec succès');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Partager "{document.name}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Adresses email</label>
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="view">Lecture seule</option>
              <option value="edit">Modification</option>
              <option value="admin">Administration</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="copyLink"
              checked={copyLink}
              onChange={(e) => setCopyLink(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="copyLink" className="text-sm">
              Copier le lien de partage
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ajouter un message..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Preview amélioré avec IA
const PreviewModal: React.FC<PreviewModalProps> = ({ document, onClose, onEdit, onTranscribe, onTranslate }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'versions' | 'comments' | 'ai'>('preview');
  const [comment, setComment] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success('Commentaire ajouté');
    setComment('');
  };

  const handleTranslate = () => {
    if (selectedLanguages.length === 0) {
      toast.error('Sélectionnez au moins une langue');
      return;
    }
    if (onTranslate) {
      onTranslate();
      toast.success(`Traduction lancée vers ${selectedLanguages.length} langue(s)`);
    }
  };

  const availableLanguages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Header amélioré */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-indigo-500" />
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {document.name}
                {document.sector && (
                  <span className="text-xs px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded">
                    {document.sector}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span>{document.projectName}</span>
                {document.accuracy && (
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {document.accuracy.toFixed(1)}% précision
                  </span>
                )}
                {document.wer && (
                  <span className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    WER {document.wer.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {document.status === 'pending' && onTranscribe && (
              <button
                onClick={onTranscribe}
                className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Transcrire
              </button>
            )}
            {document.transcription && !document.translation && onTranslate && (
              <button
                onClick={handleTranslate}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                Traduire
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Éditer"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.open(document.url, '_blank')}
              className="p-2 hover:bg-gray-700 rounded-lg"
              title="Ouvrir dans un nouvel onglet"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs avec nouvel onglet IA */}
        <div className="flex border-b border-gray-700">
          {(['preview', 'details', 'ai', 'versions', 'comments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 transition-colors ${
                activeTab === tab
                  ? 'bg-gray-700 border-b-2 border-indigo-500'
                  : 'hover:bg-gray-700/50'
              }`}
            >
              {tab === 'preview' && 'Aperçu'}
              {tab === 'details' && 'Détails'}
              {tab === 'ai' && (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Intelligence IA
                </span>
              )}
              {tab === 'versions' && `Versions (${document.versions.length})`}
              {tab === 'comments' && `Commentaires (${document.comments.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {document.type === 'transcription' || document.transcription ? (
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-violet-400" />
                    Transcription
                    {document.language && (
                      <span className="text-sm text-gray-400">
                        ({availableLanguages.find(l => l.code === document.language)?.flag} {document.language.toUpperCase()})
                      </span>
                    )}
                  </h3>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {document.transcription || 'Transcription en cours de traitement...'}
                  </p>
                  
                  {document.translation && Object.keys(document.translation).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-md font-semibold mb-3">Traductions disponibles</h4>
                      <div className="space-y-3">
                        {Object.entries(document.translation).map(([lang, text]) => (
                          <div key={lang} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {availableLanguages.find(l => l.code === lang)?.flag}
                              </span>
                              <span className="font-medium">
                                {availableLanguages.find(l => l.code === lang)?.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : document.type === 'audio' ? (
                <div className="bg-gray-900 rounded-lg p-6">
                  <audio controls className="w-full">
                    <source src={document.url} type="audio/mpeg" />
                    Votre navigateur ne supporte pas l'audio.
                  </audio>
                  {document.duration && (
                    <p className="text-sm text-gray-400 mt-2">
                      Durée : {Math.floor(document.duration / 60)}min {document.duration % 60}s
                    </p>
                  )}
                </div>
              ) : document.type === 'video' ? (
                <div className="bg-gray-900 rounded-lg p-6">
                  <video controls className="w-full rounded-lg">
                    <source src={document.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                </div>
              ) : document.type === 'image' ? (
                <div className="bg-gray-900 rounded-lg p-6">
                  <img src={document.url} alt={document.name} className="w-full rounded-lg" />
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-6 text-center">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Aperçu non disponible pour ce type de fichier</p>
                  <button
                    onClick={() => window.open(document.url, '_blank')}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Télécharger le fichier
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Type</label>
                  <p className="font-medium">{document.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Taille</label>
                  <p className="font-medium">{formatFileSize(document.size)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Langue source</label>
                  <p className="font-medium">
                    {document.language ? (
                      <>
                        {availableLanguages.find(l => l.code === document.language)?.flag}{' '}
                        {availableLanguages.find(l => l.code === document.language)?.name}
                      </>
                    ) : 'Non définie'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Durée</label>
                  <p className="font-medium">{formatDuration(document.duration)}</p>
                </div>
                {document.pages && (
                  <div>
                    <label className="text-sm text-gray-400">Pages</label>
                    <p className="font-medium">{document.pages}</p>
                  </div>
                )}
                {document.sector && (
                  <div>
                    <label className="text-sm text-gray-400">Secteur</label>
                    <p className="font-medium flex items-center gap-2">
                      {getSectorIcon(document.sector)}
                      {document.sector}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-400">Créé le</label>
                  <p className="font-medium">{new Date(document.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Modifié le</label>
                  <p className="font-medium">{new Date(document.modifiedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {document.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                  <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {document.targetLanguages && document.targetLanguages.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400">Langues de traduction</label>
                  <div className="flex gap-2 mt-2">
                    {document.targetLanguages.map((lang) => (
                      <span key={lang} className="text-2xl">
                        {availableLanguages.find(l => l.code === lang)?.flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm text-gray-400">Partagé avec</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {document.sharedWith.map((email, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded text-sm">
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nouvel onglet IA */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Métriques IA */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-400" />
                  Métriques d'Intelligence Artificielle
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <span className="text-2xl font-bold">
                        {document.accuracy ? `${document.accuracy.toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Précision</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-5 h-5 text-indigo-400" />
                      <span className="text-2xl font-bold">
                        {document.wer ? `${document.wer.toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">WER</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span className="text-2xl font-bold">
                        {document.confidence ? `${(document.confidence * 100).toFixed(0)}%` : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Confiance</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-bold">
                        {document.aiModel || 'Whisper V3'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Modèle IA</p>
                  </div>
                </div>
              </div>

              {/* Suggestions d'amélioration */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Suggestions d'amélioration IA
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Qualité audio excellente</p>
                      <p className="text-sm text-gray-400">Le fichier audio est clair avec peu de bruit de fond</p>
                    </div>
                  </div>
                  
                  {document.wer && document.wer > 4 && (
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div>
                        <p className="font-medium">WER élevé détecté</p>
                        <p className="text-sm text-gray-400">
                          Envisagez d'utiliser un modèle spécialisé pour le secteur {document.sector}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!document.translation && document.transcription && (
                    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                      <Languages className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Traduction disponible</p>
                        <p className="text-sm text-gray-400">
                          Ce document peut être traduit en 5 langues avec une précision de 94%+
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sélection des langues pour traduction */}
              {document.transcription && !document.translation && (
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Traduire le document</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {availableLanguages
                      .filter(lang => lang.code !== document.language)
                      .map(lang => (
                        <label
                          key={lang.code}
                          className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            value={lang.code}
                            checked={selectedLanguages.includes(lang.code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLanguages([...selectedLanguages, lang.code]);
                              } else {
                                setSelectedLanguages(selectedLanguages.filter(l => l !== lang.code));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm">{lang.name}</span>
                        </label>
                      ))}
                  </div>
                  <button
                    onClick={handleTranslate}
                    disabled={selectedLanguages.length === 0}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Lancer la traduction
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-2">
              {document.versions.map((version) => (
                <div key={version.id} className="p-4 bg-gray-900 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">Version {version.version}</div>
                    <div className="text-sm text-gray-400">
                      {version.changes} • Par {version.createdBy}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(version.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Envoyer
                </button>
              </div>
              
              <div className="space-y-2">
                {document.comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                    {comment.resolved && (
                      <span className="text-xs text-emerald-400 mt-2 inline-block">
                        ✓ Résolu
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helpers
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getSectorIcon = (sector?: string) => {
  switch (sector) {
    case 'medical': return <Heart className="w-4 h-4 text-red-400" />;
    case 'legal': return <Briefcase className="w-4 h-4 text-amber-400" />;
    case 'business': return <Target className="w-4 h-4 text-green-400" />;
    case 'education': return <GraduationCap className="w-4 h-4 text-blue-400" />;
    case 'media': return <Newspaper className="w-4 h-4 text-purple-400" />;
    default: return null;
  }
};

// Composant principal DocumentsPage (fusion)
const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
    loadFolders();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [documents]);

  const calculateStats = () => {
    if (documents.length === 0) {
      setStats(null);
      return;
    }

    const stats: DocumentStats = {
      total: documents.length,
      transcribed: documents.filter(d => d.status === 'transcribed' || d.transcription).length,
      translated: documents.filter(d => d.translation && Object.keys(d.translation).length > 0).length,
      audio: documents.filter(d => d.type === 'audio').length,
      video: documents.filter(d => d.type === 'video').length,
      documents: documents.filter(d => ['document', 'pdf', 'docx', 'txt'].includes(d.type)).length,
      totalSize: documents.reduce((acc, d) => acc + d.size, 0),
      totalPages: documents.reduce((acc, d) => acc + (d.pages || 0), 0),
      averageAccuracy: documents.filter(d => d.accuracy).reduce((acc, d) => acc + (d.accuracy || 0), 0) / documents.filter(d => d.accuracy).length || 0,
      averageWER: documents.filter(d => d.wer).reduce((acc, d) => acc + (d.wer || 0), 0) / documents.filter(d => d.wer).length || 0,
      bySector: {
        medical: documents.filter(d => d.sector === 'medical').length,
        legal: documents.filter(d => d.sector === 'legal').length,
        business: documents.filter(d => d.sector === 'business').length,
        education: documents.filter(d => d.sector === 'education').length,
        media: documents.filter(d => d.sector === 'media').length
      },
      byLanguage: {
        fr: documents.filter(d => d.language === 'fr').length,
        en: documents.filter(d => d.language === 'en').length,
        es: documents.filter(d => d.language === 'es').length,
        it: documents.filter(d => d.language === 'it').length,
        de: documents.filter(d => d.language === 'de').length
      }
    };

    setStats(stats);
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      // Charger depuis l'API ou localStorage (conservé du code existant)
      const projects = JSON.parse(localStorage.getItem('localProjects') || '[]');
      const transcriptions = JSON.parse(localStorage.getItem('transcriptionHistory') || '[]');
      
      const docs: Document[] = [];
      
      // Ajouter les transcriptions comme documents (conservé)
      transcriptions.forEach((trans: any, index: number) => {
        docs.push({
          id: `trans_${index}`,
          name: trans.fileName || `Transcription ${index + 1}`,
          type: 'transcription',
          size: trans.text?.length || 1000,
          projectId: 'transcriptions',
          projectName: 'Transcriptions',
          createdAt: trans.timestamp || new Date().toISOString(),
          modifiedAt: trans.timestamp || new Date().toISOString(),
          status: 'ready',
          language: trans.language || 'fr',
          duration: trans.duration,
          transcription: trans.text,
          accuracy: 95 + Math.random() * 4,
          wer: 2 + Math.random() * 2,
          confidence: 0.9 + Math.random() * 0.1,
          tags: [],
          starred: false,
          shared: false,
          sharedWith: [],
          version: 1,
          versions: [{
            id: `v_${index}_1`,
            version: 1,
            createdAt: trans.timestamp || new Date().toISOString(),
            createdBy: 'Vous',
            changes: 'Version initiale',
            size: trans.text?.length || 1000
          }],
          comments: [],
          permissions: 'admin'
        });
      });
      
      // Ajouter des documents de démonstration améliorés pour TraduckXion
      const demoDocuments: Document[] = [
        {
          id: 'demo_1',
          name: 'Rapport_Medical_Patient_2025.pdf',
          type: 'pdf',
          size: 2457600,
          pages: 45,
          projectId: 'proj_medical',
          projectName: 'Dossiers Médicaux',
          folderId: 'folder_medical',
          createdAt: '2025-01-10T10:00:00Z',
          modifiedAt: '2025-01-10T11:30:00Z',
          status: 'transcribed',
          language: 'fr',
          targetLanguages: ['en', 'es'],
          transcription: 'Rapport médical complet du patient...',
          translation: {
            en: 'Complete medical report of the patient...',
            es: 'Informe médico completo del paciente...'
          },
          tags: ['médical', 'urgent', 'confidentiel'],
          starred: true,
          shared: false,
          sharedWith: [],
          version: 2,
          versions: [
            {
              id: 'v1',
              version: 1,
              createdAt: '2025-01-10T10:00:00Z',
              createdBy: 'Dr. Martin',
              changes: 'Version initiale',
              size: 2457600
            },
            {
              id: 'v2',
              version: 2,
              createdAt: '2025-01-10T11:30:00Z',
              createdBy: 'Dr. Martin',
              changes: 'Ajout des résultats d\'analyse',
              size: 2457600
            }
          ],
          comments: [],
          permissions: 'admin',
          sector: 'medical',
          accuracy: 98.2,
          wer: 2.8,
          confidence: 0.98,
          aiModel: 'Whisper V3 Medical'
        },
        {
          id: 'demo_2',
          name: 'Contrat_Commercial_2025.docx',
          type: 'docx',
          size: 1048576,
          pages: 12,
          projectId: 'proj_legal',
          projectName: 'Documents Juridiques',
          folderId: 'folder_legal',
          createdAt: '2025-01-11T14:00:00Z',
          modifiedAt: '2025-01-11T16:00:00Z',
          status: 'processing',
          language: 'fr',
          tags: ['contrat', 'juridique', 'commercial'],
          starred: false,
          shared: true,
          sharedWith: ['avocat@cabinet.com'],
          version: 1,
          versions: [{
            id: 'v3',
            version: 1,
            createdAt: '2025-01-11T14:00:00Z',
            createdBy: 'Me. Dubois',
            changes: 'Version initiale',
            size: 1048576
          }],
          comments: [
            {
              id: 'c1',
              userId: 'user1',
              userName: 'Me. Dupont',
              text: 'À revoir clause 3.2',
              createdAt: '2025-01-11T15:00:00Z',
              resolved: false
            }
          ],
          permissions: 'edit',
          sector: 'legal',
          accuracy: 97.5,
          wer: 3.0,
          confidence: 0.95
        },
        {
          id: 'demo_3',
          name: 'Webinar_Marketing_Digital.mp4',
          type: 'video',
          size: 104857600,
          projectId: 'proj_business',
          projectName: 'Webinars Business',
          createdAt: '2025-01-08T14:00:00Z',
          modifiedAt: '2025-01-09T09:00:00Z',
          status: 'transcribed',
          language: 'en',
          targetLanguages: ['fr', 'de'],
          duration: 3600,
          transcription: 'Welcome to our digital marketing webinar...',
          translation: {
            fr: 'Bienvenue à notre webinaire de marketing digital...',
            de: 'Willkommen zu unserem Digital-Marketing-Webinar...'
          },
          tags: ['webinar', 'marketing', 'business'],
          starred: true,
          shared: true,
          sharedWith: ['team@company.com'],
          version: 1,
          versions: [{
            id: 'v4',
            version: 1,
            createdAt: '2025-01-08T14:00:00Z',
            createdBy: 'Marketing Team',
            changes: 'Upload initial',
            size: 104857600
          }],
          comments: [],
          permissions: 'admin',
          sector: 'business',
          accuracy: 96.8,
          wer: 3.2,
          confidence: 0.93,
          aiModel: 'Whisper V3'
        }
      ];
      
      setDocuments([...docs, ...demoDocuments]);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = () => {
    // Dossiers améliorés avec secteurs
    const demoFolders: Folder[] = [
      {
        id: 'folder_medical',
        name: 'Médical',
        createdAt: '2025-01-01T00:00:00Z',
        documentsCount: 12,
        expanded: true,
        color: '#ef4444',
        sector: 'medical'
      },
      {
        id: 'folder_legal',
        name: 'Juridique',
        createdAt: '2025-01-01T00:00:00Z',
        documentsCount: 8,
        expanded: false,
        color: '#f59e0b',
        sector: 'legal'
      },
      {
        id: 'folder_business',
        name: 'Business',
        createdAt: '2025-01-01T00:00:00Z',
        documentsCount: 15,
        expanded: false,
        color: '#10b981',
        sector: 'business'
      },
      {
        id: 'folder_education',
        name: 'Éducation',
        createdAt: '2025-01-01T00:00:00Z',
        documentsCount: 20,
        expanded: false,
        color: '#3b82f6',
        sector: 'education'
      },
      {
        id: 'folder_media',
        name: 'Média',
        createdAt: '2025-01-01T00:00:00Z',
        documentsCount: 18,
        expanded: false,
        color: '#8b5cf6',
        sector: 'media'
      }
    ];
    
    setFolders(demoFolders);
  };

  // Gestion du drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    
    if ('dataTransfer' in e) {
      files = e.dataTransfer.files;
    } else if ('target' in e && e.target.files) {
      files = e.target.files;
    }
    
    if (!files || files.length === 0) return;
    
    const uploadPromises = Array.from(files).map(async (file) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDoc: Document = {
            id: `doc_${Date.now()}_${Math.random()}`,
            name: file.name,
            type: getFileType(file.type),
            size: file.size,
            projectId: 'uploads',
            projectName: 'Uploads',
            folderId: selectedFolder || undefined,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            status: 'pending',
            tags: [],
            starred: false,
            shared: false,
            sharedWith: [],
            version: 1,
            versions: [{
              id: `v_new_1`,
              version: 1,
              createdAt: new Date().toISOString(),
              createdBy: 'Vous',
              changes: 'Upload initial',
              size: file.size
            }],
            comments: [],
            permissions: 'admin'
          };
          
          setDocuments(prev => [...prev, newDoc]);
          
          // Simuler le traitement automatique
          setTimeout(() => {
            handleTranscribe(newDoc);
          }, 2000);
          
          resolve(newDoc);
        }, 1000);
      });
    });
    
    toast.promise(
      Promise.all(uploadPromises),
      {
        loading: 'Upload en cours...',
        success: `${files.length} fichier(s) uploadé(s)`,
        error: 'Erreur lors de l\'upload'
      }
    );
  };

  const getFileType = (mimeType: string): Document['type'] => {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'docx';
    if (mimeType.includes('text')) return 'txt';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return FileAudio;
      case 'video': return FileVideo;
      case 'image': return Image;
      case 'transcription': return FileEdit;
      case 'pdf': return FileText;
      case 'docx': return FileText;
      default: return File;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transcribed':
      case 'ready': return 'bg-emerald-500';
      case 'processing': return 'bg-indigo-500';
      case 'translating': return 'bg-violet-500';
      case 'pending': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTranscribe = (doc: Document) => {
    setDocuments(prev => prev.map(d => 
      d.id === doc.id 
        ? { 
            ...d, 
            status: 'processing' as const
          } 
        : d
    ));
    
    // Simuler la transcription
    setTimeout(() => {
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { 
              ...d, 
              status: 'transcribed' as const,
              transcription: 'Transcription automatique générée par IA...',
              accuracy: 95 + Math.random() * 4,
              wer: 2 + Math.random() * 2,
              confidence: 0.9 + Math.random() * 0.1,
              aiModel: 'Whisper V3',
              language: 'fr'
            } 
          : d
      ));
      toast.success('Transcription terminée');
    }, 3000);
  };

  const handleTranslate = (doc: Document, languages?: string[]) => {
    const targetLangs = languages || ['en', 'es'];
    
    setDocuments(prev => prev.map(d => 
      d.id === doc.id 
        ? { 
            ...d, 
            status: 'translating' as const,
            targetLanguages: targetLangs
          } 
        : d
    ));
    
    // Simuler la traduction
    setTimeout(() => {
      const translations: { [key: string]: string } = {};
      targetLangs.forEach(lang => {
        translations[lang] = `Traduction en ${lang} du document...`;
      });
      
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { 
              ...d, 
              status: 'ready' as const,
              translation: translations
            } 
          : d
      ));
      toast.success(`Document traduit en ${targetLangs.length} langue(s)`);
    }, 3000);
  };

  const handleDelete = (docIds: string[]) => {
    if (!confirm(`Voulez-vous vraiment supprimer ${docIds.length} document(s) ?`)) return;
    
    setDocuments(documents.filter(d => !docIds.includes(d.id)));
    setSelectedDocuments([]);
    toast.success(`${docIds.length} document(s) supprimé(s)`);
  };

  const handleDownload = (docs: Document[]) => {
    docs.forEach(doc => {
      if (doc.url) {
        window.open(doc.url, '_blank');
      } else if (doc.transcription) {
        const blob = new Blob([doc.transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.name}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
    toast.success(`${docs.length} document(s) téléchargé(s)`);
  };

  const handleShare = (emails: string[], permission: string) => {
    if (!currentDocument) return;
    
    const updatedDoc = {
      ...currentDocument,
      shared: true,
      sharedWith: [...new Set([...currentDocument.sharedWith, ...emails])]
    };
    
    setDocuments(documents.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setCurrentDocument(updatedDoc);
  };

  const toggleStar = (docId: string) => {
    setDocuments(documents.map(d => 
      d.id === docId ? { ...d, starred: !d.starred } : d
    ));
  };

  const toggleFolderExpand = (folderId: string) => {
    setFolders(folders.map(f => 
      f.id === folderId ? { ...f, expanded: !f.expanded } : f
    ));
  };

  const createFolder = () => {
    const name = prompt('Nom du nouveau dossier :');
    if (!name) return;
    
    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      documentsCount: 0,
      expanded: true
    };
    
    setFolders([...folders, newFolder]);
    toast.success('Dossier créé');
  };

  // Filtrage et tri améliorés
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchesSector = filterSector === 'all' || doc.sector === filterSector;
      const matchesLanguage = filterLanguage === 'all' || doc.language === filterLanguage;
      const matchesFolder = !selectedFolder || doc.folderId === selectedFolder;
      
      return matchesSearch && matchesType && matchesStatus && matchesSector && matchesLanguage && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
          break;
        case 'size':
          comparison = b.size - a.size;
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Documents TraduckXion
        </h1>
        <p className="text-gray-400">
          Gérez vos fichiers, transcriptions et traductions multilingues
        </p>
      </div>

      {/* Stats Cards améliorées */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <FileText className="w-6 h-6 text-indigo-500" />
              <span className="text-xl font-bold">{stats.total}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Total</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <Brain className="w-6 h-6 text-violet-500" />
              <span className="text-xl font-bold">{stats.transcribed}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Transcrits</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <Languages className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold">{stats.translated}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Traduits</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <Database className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-bold">{formatFileSize(stats.totalSize)}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Espace</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <Target className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold">{stats.averageAccuracy.toFixed(1)}%</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Précision</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-red-500" />
              <span className="text-xl font-bold">{stats.averageWER.toFixed(1)}%</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">WER moy.</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <FileAudio className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">{stats.audio}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Audios</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <FileVideo className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-bold">{stats.video}</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Vidéos</p>
          </div>
        </div>
      )}

      {/* Zone de drop améliorée */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-3 ${dragActive ? 'text-indigo-400' : 'text-gray-400'}`} />
        <p className="text-gray-400 mb-2">
          Glissez-déposez vos fichiers ici pour une transcription automatique
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Formats supportés : Audio, Vidéo, PDF, DOCX, TXT • Max 500 MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleUpload}
          className="hidden"
          accept="audio/*,video/*,.pdf,.docx,.txt,.srt,.vtt"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Parcourir les fichiers
        </button>
      </div>

      {/* Barre de filtres améliorée (code conservé avec ajouts) */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 flex flex-wrap gap-2">
          {/* Recherche */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtres */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="all">Tous types</option>
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
            <option value="document">Document</option>
            <option value="pdf">PDF</option>
            <option value="transcription">Transcription</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="all">Tous statuts</option>
            <option value="ready">Prêt</option>
            <option value="transcribed">Transcrit</option>
            <option value="processing">En cours</option>
            <option value="translating">Traduction</option>
            <option value="pending">En attente</option>
          </select>

          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="all">Tous secteurs</option>
            <option value="medical">Médical</option>
            <option value="legal">Juridique</option>
            <option value="business">Business</option>
            <option value="education">Éducation</option>
            <option value="media">Média</option>
          </select>

          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="all">Toutes langues</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="date">Date</option>
            <option value="name">Nom</option>
            <option value="size">Taille</option>
          </select>

          {/* Actions groupées (conservées) */}
          {selectedDocuments.length > 0 && (
            <>
              <button
                onClick={() => {
                  const docs = documents.filter(d => selectedDocuments.includes(d.id));
                  docs.forEach(doc => {
                    if (!doc.transcription) handleTranscribe(doc);
                  });
                }}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Brain className="w-4 h-4" />
                Transcrire ({selectedDocuments.length})
              </button>
              
              <button
                onClick={() => handleDownload(documents.filter(d => selectedDocuments.includes(d.id)))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Télécharger ({selectedDocuments.length})
              </button>
              
              <button
                onClick={() => handleDelete(selectedDocuments)}
                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer ({selectedDocuments.length})
              </button>
            </>
          )}
        </div>

        {/* Actions permanentes */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={createFolder}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            title="Nouveau dossier"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenu principal (conservé avec améliorations) */}
      <div className="flex gap-6">
        {/* Sidebar - Folders avec secteurs */}
        <div className="w-64 bg-gray-800 rounded-lg p-4 border border-gray-700 h-fit">
          <h3 className="font-semibold mb-4">Dossiers par secteur</h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                !selectedFolder ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>Tous les documents</span>
              </div>
            </button>
            
            {folders.map((folder) => (
              <div key={folder.id}>
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                    selectedFolder === folder.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolderExpand(folder.id);
                        }}
                      >
                        {folder.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      {folder.color && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color }} />
                      )}
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{folder.documentsCount}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Grid/List (conservé avec améliorations) */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedDocuments.map(doc => {
                const Icon = getFileIcon(doc.type);
                const isSelected = selectedDocuments.includes(doc.id);
                
                return (
                  <div
                    key={doc.id}
                    className={`bg-gray-800 rounded-lg p-4 border transition-all ${
                      isSelected ? 'border-indigo-500 bg-gray-700' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments([...selectedDocuments, doc.id]);
                            } else {
                              setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <Icon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleStar(doc.id)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          {doc.starred ? (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-medium mb-1 truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-3">{doc.projectName}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                      <div className="flex items-center gap-2">
                        {doc.sector && getSectorIcon(doc.sector)}
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`} />
                      </div>
                    </div>
                    
                    {/* Métriques IA */}
                    {doc.accuracy && (
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-emerald-400" />
                          {doc.accuracy.toFixed(1)}%
                        </span>
                        {doc.wer && (
                          <span className="flex items-center gap-1">
                            <Brain className="w-3 h-3 text-violet-400" />
                            WER {doc.wer.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    )}
                    
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {doc.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                            +{doc.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentDocument(doc);
                          setShowPreviewModal(true);
                        }}
                        className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      {!doc.transcription && (doc.type === 'audio' || doc.type === 'video') && (
                        <button
                          onClick={() => handleTranscribe(doc)}
                          className="flex-1 p-2 bg-violet-600 hover:bg-violet-700 rounded text-sm"
                        >
                          <Brain className="w-4 h-4 mx-auto text-white" />
                        </button>
                      )}
                      {doc.transcription && !doc.translation && (
                        <button
                          onClick={() => handleTranslate(doc)}
                          className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                        >
                          <Languages className="w-4 h-4 mx-auto text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCurrentDocument(doc);
                          setShowShareModal(true);
                        }}
                        className="flex-1 p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        <Share2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Vue liste (conservée avec améliorations)
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocuments(filteredAndSortedDocuments.map(d => d.id));
                          } else {
                            setSelectedDocuments([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Nom</th>
                    <th className="px-6 py-4 text-left">Secteur</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Taille</th>
                    <th className="px-6 py-4 text-left">Métriques</th>
                    <th className="px-6 py-4 text-left">Statut</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedDocuments.map(doc => {
                    const Icon = getFileIcon(doc.type);
                    const isSelected = selectedDocuments.includes(doc.id);
                    
                    return (
                      <tr key={doc.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                        isSelected ? 'bg-gray-700/30' : ''
                      }`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocuments([...selectedDocuments, doc.id]);
                              } else {
                                setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="truncate max-w-xs">{doc.name}</span>
                              {doc.starred && (
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 inline-block ml-2" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {doc.sector && (
                            <div className="flex items-center gap-2">
                              {getSectorIcon(doc.sector)}
                              <span className="text-sm">{doc.sector}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">{formatFileSize(doc.size)}</td>
                        <td className="px-6 py-4">
                          {doc.accuracy && (
                            <div className="flex items-center gap-2 text-xs">
                              <span title="Précision">{doc.accuracy.toFixed(1)}%</span>
                              {doc.wer && (
                                <span title="WER" className="text-gray-400">
                                  WER {doc.wer.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`w-2 h-2 rounded-full inline-block ${getStatusColor(doc.status)}`} />
                          <span className="ml-2 text-sm">{doc.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCurrentDocument(doc);
                                setShowPreviewModal(true);
                              }}
                              className="p-1 hover:bg-gray-600 rounded"
                              title="Aperçu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!doc.transcription && (doc.type === 'audio' || doc.type === 'video') && (
                              <button
                                onClick={() => handleTranscribe(doc)}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Transcrire"
                              >
                                <Brain className="w-4 h-4 text-violet-400" />
                              </button>
                            )}
                            {doc.transcription && !doc.translation && (
                              <button
                                onClick={() => handleTranslate(doc)}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Traduire"
                              >
                                <Languages className="w-4 h-4 text-indigo-400" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDownload([doc])}
                              className="p-1 hover:bg-gray-600 rounded"
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentDocument(doc);
                                setShowShareModal(true);
                              }}
                              className="p-1 hover:bg-gray-600 rounded"
                              title="Partager"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete([doc.id])}
                              className="p-1 hover:bg-gray-600 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showShareModal && currentDocument && (
        <ShareModal
          document={currentDocument}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
      
      {showPreviewModal && currentDocument && (
        <PreviewModal
          document={currentDocument}
          onClose={() => setShowPreviewModal(false)}
          onEdit={() => {
            toast.info('Éditeur en cours de développement');
          }}
          onTranscribe={() => handleTranscribe(currentDocument)}
          onTranslate={() => handleTranslate(currentDocument)}
        />
      )}
    </div>
  );
};

export default DocumentsPage;