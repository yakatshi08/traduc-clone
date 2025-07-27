import React from 'react';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Globe,
  Zap,
  HardDrive
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import StatsCard from './StatsCard';
import ProjectCard from './ProjectCard';
import UploadZone from './UploadZone';
import { Project } from '../../types';

interface DashboardProps {
  onProjectSelect: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProjectSelect }) => {
  const { t } = useLanguage();

  // Mock data
  const stats = [
    {
      title: 'Projets totaux',
      value: '1,247',
      change: '+12% ce mois',
      changeType: 'positive' as const,
      icon: FolderOpen,
      iconColor: 'text-violet-400'
    },
    {
      title: 'En cours',
      value: '23',
      change: '5 terminés aujourd\'hui',
      changeType: 'positive' as const,
      icon: Clock,
      iconColor: 'text-blue-400'
    },
    {
      title: 'Terminés',
      value: '1,224',
      change: '+8% ce mois',
      changeType: 'positive' as const,
      icon: CheckCircle,
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Précision moyenne',
      value: '96.2%',
      change: '+0.3% ce mois',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-green-400'
    }
  ];

  const recentProjects: Project[] = [
    {
      id: '1',
      name: 'Conférence Q4 2024',
      type: 'video',
      status: 'completed',
      language: 'fr',
      targetLanguages: ['en', 'es'],
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15'),
      fileSize: 125000000,
      accuracy: 97.5,
      sector: 'business'
    },
    {
      id: '2',
      name: 'Interview Client ABC',
      type: 'audio',
      status: 'processing',
      language: 'en',
      targetLanguages: ['fr', 'de'],
      createdAt: new Date('2024-12-14'),
      updatedAt: new Date('2024-12-14'),
      fileSize: 45000000,
      sector: 'business'
    },
    {
      id: '3',
      name: 'Rapport médical 2024',
      type: 'document',
      status: 'ready',
      language: 'fr',
      targetLanguages: ['en'],
      createdAt: new Date('2024-12-13'),
      updatedAt: new Date('2024-12-13'),
      fileSize: 2500000,
      accuracy: 98.1,
      sector: 'medical'
    },
    {
      id: '4',
      name: 'Formation juridique',
      type: 'video',
      status: 'error',
      language: 'fr',
      targetLanguages: ['en', 'it'],
      createdAt: new Date('2024-12-12'),
      updatedAt: new Date('2024-12-12'),
      fileSize: 890000000,
      sector: 'legal'
    }
  ];

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    // Here you would typically send files to your backend
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('welcome.title')}</h1>
            <p className="text-violet-100 text-lg">{t('welcome.subtitle')}</p>
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>20K+ utilisateurs actifs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>5 langues supportées</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>WER &lt; 4%</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UploadZone onFileUpload={handleFileUpload} />
        </div>
        
        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Générer XBRL</p>
                <p className="text-xs text-gray-400">Exporter au format XBRL</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Connecter Drive</p>
                <p className="text-xs text-gray-400">Google Drive, Dropbox</p>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <HardDrive className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Mode Offline</p>
                <p className="text-xs text-gray-400">Synchronisation cloud</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Projets récents</h2>
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            Voir tous les projets →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onProjectSelect}
            />
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              Moteur IA Hybride Nouvelle Génération
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              TraducXion V2.5 utilise une combinaison avancée de Whisper, Deepgram, ElevenLabs et OpenAI 
              avec des modèles fine-tunés pour atteindre une précision de transcription exceptionnelle. 
              Notre système de diarisation avancée et d'analyse contextuelle garantit des résultats 
              professionnels pour tous vos contenus multimédias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;