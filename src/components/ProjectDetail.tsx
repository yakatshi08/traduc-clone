import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Edit3, 
  Trash2, 
  Play, 
  Pause,
  FileText,
  Video,
  Headphones,
  Globe,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  MoreVertical
} from 'lucide-react';

interface ProjectDetailProps {
  projectId: number;
  onNavigate?: (page: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('transcription');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Données simulées du projet (normalement récupérées via API)
  const project = {
    id: projectId,
    name: 'Conférence Q4 2024',
    type: 'video',
    status: 'Terminé',
    statusColor: 'text-green-400',
    date: '15/12/2024',
    accuracy: '98.5%',
    duration: '45 min',
    fileSize: '1.2 GB',
    language: 'Français',
    targetLanguages: ['Anglais', 'Espagnol'],
    createdBy: 'Marie Dupont',
    lastModified: '16/12/2024 à 14:30',
    transcriptionEngine: 'Whisper v3',
    icon: Video,
    videoUrl: 'https://example.com/video.mp4', // URL simulée
    transcription: {
      text: `Bienvenue à notre conférence trimestrielle. Aujourd'hui, nous allons examiner les résultats du quatrième trimestre 2024 et discuter de nos objectifs pour l'année à venir.

Comme vous pouvez le voir sur le graphique, nos revenus ont augmenté de 23% par rapport au trimestre précédent. Cette croissance est principalement due à l'expansion de notre présence sur le marché européen et au lancement réussi de notre nouvelle gamme de produits.

Les points clés à retenir de ce trimestre sont :
- Une augmentation de 23% du chiffre d'affaires
- L'acquisition de 15 000 nouveaux clients
- Un taux de satisfaction client de 94%
- Le lancement réussi dans 3 nouveaux pays

Pour le prochain trimestre, nous prévoyons de continuer cette trajectoire de croissance en nous concentrant sur l'innovation produit et l'amélioration de l'expérience client.`,
      timestamps: [
        { time: '00:00', text: 'Introduction et bienvenue' },
        { time: '02:15', text: 'Résultats financiers Q4' },
        { time: '10:30', text: 'Expansion marché européen' },
        { time: '18:45', text: 'Nouveaux produits' },
        { time: '25:00', text: 'Satisfaction client' },
        { time: '35:00', text: 'Objectifs Q1 2025' },
        { time: '42:00', text: 'Questions et réponses' }
      ]
    },
    translations: {
      en: `Welcome to our quarterly conference. Today, we will review the fourth quarter 2024 results and discuss our goals for the coming year...`,
      es: `Bienvenidos a nuestra conferencia trimestral. Hoy revisaremos los resultados del cuarto trimestre de 2024 y discutiremos nuestros objetivos para el próximo año...`
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const Icon = getTypeIcon(project.type);

  const tabs = [
    { id: 'transcription', label: 'Transcription', count: null },
    { id: 'translations', label: 'Traductions', count: project.targetLanguages.length },
    { id: 'timeline', label: 'Timeline', count: project.transcription.timestamps.length },
    { id: 'info', label: 'Informations', count: null }
  ];

  const handleDownload = (type: string) => {
    console.log(`Téléchargement ${type}`);
    // Logique de téléchargement
  };

  const handleShare = () => {
    console.log('Partager le projet');
    // Logique de partage
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      console.log('Suppression du projet');
      onNavigate?.('projects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate?.('projects')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{project.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className={project.statusColor}>{project.status}</span>
                    <span>•</span>
                    <span>{project.duration}</span>
                    <span>•</span>
                    <span>{project.fileSize}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload('all')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Dupliquer
                    </button>
                    <hr className="my-1 border-gray-700" />
                    <button 
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"
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
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== null && (
                    <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Media Player pour vidéo/audio */}
        {(project.type === 'video' || project.type === 'audio') && (
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              {project.type === 'video' ? (
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <Headphones className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-white"
                  >
                    {isPlaying ? 'Pause' : 'Écouter'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'transcription' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Transcription originale</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                      {project.language}
                    </span>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleDownload('transcription')}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {project.transcription.text}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'translations' && (
              <div className="space-y-6">
                {project.targetLanguages.map((lang, index) => (
                  <div key={lang} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        Traduction en {lang}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDownload(`translation-${lang}`)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {lang === 'Anglais' ? project.translations.en : project.translations.es}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Timeline</h2>
                <div className="space-y-4">
                  {project.transcription.timestamps.map((timestamp, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-purple-400 font-mono text-sm w-16">
                        {timestamp.time}
                      </span>
                      <span className="text-gray-300">{timestamp.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Informations du projet</h2>
                <dl className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <dt className="text-gray-400">Créé par</dt>
                    <dd className="text-white">{project.createdBy}</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <dt className="text-gray-400">Date de création</dt>
                    <dd className="text-white">{project.date}</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <dt className="text-gray-400">Dernière modification</dt>
                    <dd className="text-white">{project.lastModified}</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <dt className="text-gray-400">Moteur de transcription</dt>
                    <dd className="text-white">{project.transcriptionEngine}</dd>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-700">
                    <dt className="text-gray-400">Précision</dt>
                    <dd className="text-white">{project.accuracy}</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-gray-400">Langues cibles</dt>
                    <dd className="text-white">{project.targetLanguages.join(', ')}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Précision</span>
                    <span className="text-white">{project.accuracy}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: project.accuracy }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Mots transcrits</span>
                    <span className="text-white font-medium">3,245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Temps de traitement</span>
                    <span className="text-white font-medium">12 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Coût estimé</span>
                    <span className="text-white font-medium">5.50 €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-left flex items-center gap-3 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  Éditer la transcription
                </button>
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-left flex items-center gap-3 transition-colors">
                  <Globe className="w-4 h-4" />
                  Ajouter une langue
                </button>
                <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-left flex items-center gap-3 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Exporter vers...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;