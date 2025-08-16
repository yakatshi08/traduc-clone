// project/src/pages/IntegrationsPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudOff,
  FolderOpen,
  HardDrive,
  Server,
  Database,
  Shield,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Download,
  Upload,
  Link2,
  Unlink,
  ExternalLink,
  Activity,
  Zap,
  Loader2,
  Info,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Users,
  Building,
  Briefcase,
  FileText,
  FolderPlus,
  Share2,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  Square,
  Circle,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Globe,
  Wifi,
  WifiOff,
  Cpu,
  Monitor,
  Smartphone,
  Code,
  Terminal,
  GitBranch,
  GitCommit,
  GitMerge,
  Package,
  Box,
  Archive,
  Save,
  FilePlus,
  FileX,
  Folder,
  Award,
  Star,
  Bell,
  Mail,
  MessageSquare,
  Video,
  Mic,
  Camera,
  Image,
  Music,
  FileAudio,
  FileVideo,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface Integration {
  id: string;
  name: string;
  type: 'cloud' | 'communication' | 'productivity' | 'ai' | 'developer';
  provider: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  description: string;
  features: string[];
  lastSync?: Date;
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'manual';
  usage?: IntegrationUsage;
  permissions?: string[];
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  webhookUrl?: string;
  settings?: IntegrationSettings;
  stats?: IntegrationStats;
}

interface IntegrationUsage {
  storage?: {
    used: number;
    total: number;
    unit: 'GB' | 'TB';
  };
  files?: number;
  folders?: number;
  bandwidth?: {
    used: number;
    total: number;
    unit: 'GB' | 'TB';
  };
  apiCalls?: {
    used: number;
    total: number;
    resetDate: Date;
  };
}

interface IntegrationSettings {
  autoSync: boolean;
  syncFolders: string[];
  fileTypes: string[];
  maxFileSize: number;
  notifications: boolean;
  webhooks: boolean;
  encryption: boolean;
  compression: boolean;
}

interface IntegrationStats {
  totalFiles: number;
  totalFolders: number;
  syncedToday: number;
  failedSyncs: number;
  lastActivity: Date;
  avgSyncTime: number;
  successRate: number;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
  rateLimit: number;
  usage: number;
  status: 'active' | 'inactive' | 'expired';
  expiresAt?: Date;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
  secret?: string;
}

// Intégrations disponibles
const availableIntegrations: Integration[] = [
  {
    id: 'google_drive',
    name: 'Google Drive',
    type: 'cloud',
    provider: 'Google',
    icon: FolderOpen,
    color: '#4285F4',
    status: 'disconnected',
    description: 'Stockage cloud et collaboration en temps réel',
    features: [
      'Import/Export automatique',
      'Synchronisation bidirectionnelle',
      'Partage de fichiers',
      'Collaboration temps réel',
      'Versioning automatique'
    ],
    syncFrequency: 'realtime',
    permissions: ['read', 'write', 'delete', 'share']
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'cloud',
    provider: 'Dropbox',
    icon: Box,
    color: '#0061FF',
    status: 'disconnected',
    description: 'Stockage cloud sécurisé et synchronisation',
    features: [
      'Synchronisation automatique',
      'Partage sécurisé',
      'Historique des versions',
      'Récupération de fichiers',
      'Smart Sync'
    ],
    syncFrequency: 'hourly',
    permissions: ['read', 'write', 'share']
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    type: 'cloud',
    provider: 'Microsoft',
    icon: Cloud,
    color: '#0078D4',
    status: 'disconnected',
    description: 'Stockage cloud Microsoft intégré',
    features: [
      'Intégration Office 365',
      'Co-authoring',
      'Vault personnel',
      'Scan de documents',
      'Partage avancé'
    ],
    syncFrequency: 'realtime',
    permissions: ['read', 'write', 'delete', 'share']
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'communication',
    provider: 'Slack',
    icon: MessageSquare,
    color: '#4A154B',
    status: 'disconnected',
    description: 'Communication d\'équipe et notifications',
    features: [
      'Notifications en temps réel',
      'Partage de transcriptions',
      'Commandes slash',
      'Workflows automatisés',
      'Threads de discussion'
    ]
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    type: 'communication',
    provider: 'Microsoft',
    icon: Users,
    color: '#5059C9',
    status: 'disconnected',
    description: 'Collaboration et communication Microsoft',
    features: [
      'Réunions intégrées',
      'Transcription en direct',
      'Partage d\'écran',
      'Chat persistant',
      'Apps intégrées'
    ]
  },
  {
    id: 'zoom',
    name: 'Zoom',
    type: 'communication',
    provider: 'Zoom',
    icon: Video,
    color: '#2D8CFF',
    status: 'disconnected',
    description: 'Visioconférence et enregistrement',
    features: [
      'Enregistrement cloud',
      'Transcription automatique',
      'Sous-titres en direct',
      'Webinaires',
      'Breakout rooms'
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    type: 'productivity',
    provider: 'Notion',
    icon: FileText,
    color: '#000000',
    status: 'disconnected',
    description: 'Espace de travail tout-en-un',
    features: [
      'Base de connaissances',
      'Export automatique',
      'Templates personnalisés',
      'Database sync',
      'API bidirectionnelle'
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'ai',
    provider: 'OpenAI',
    icon: Cpu,
    color: '#10A37F',
    status: 'disconnected',
    description: 'Intelligence artificielle avancée',
    features: [
      'GPT-4 integration',
      'Whisper API',
      'DALL-E generation',
      'Fine-tuning',
      'Embeddings'
    ]
  },
  {
    id: 'github',
    name: 'GitHub',
    type: 'developer',
    provider: 'GitHub',
    icon: GitBranch,
    color: '#181717',
    status: 'disconnected',
    description: 'Versioning et collaboration code',
    features: [
      'Webhooks',
      'CI/CD integration',
      'Issue tracking',
      'Pull requests',
      'Actions automation'
    ]
  }
];

// Composant carte d'intégration
const IntegrationCard: React.FC<{
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure: () => void;
  onSync: () => void;
}> = ({ integration, onConnect, onDisconnect, onConfigure, onSync }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const getStatusColor = () => {
    switch (integration.status) {
      case 'connected': return 'text-emerald-400 bg-emerald-400/20';
      case 'disconnected': return 'text-gray-400 bg-gray-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'syncing': return 'text-amber-400 bg-amber-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'syncing': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    onSync();
    // Simuler la synchronisation
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(`${integration.name} synchronisé`);
    }, 2000);
  };

  // CORRECTION: Fonction pour rendre l'icône de manière sécurisée
  const renderIcon = () => {
    if (!integration.icon) {
      return <Box className="w-6 h-6" style={{ color: integration.color }} />;
    }
    
    const IconComponent = integration.icon;
    
    // Vérifier que c'est bien un composant React valide
    if (typeof IconComponent !== 'function') {
      console.warn(`Invalid icon for integration ${integration.name}`);
      return <Box className="w-6 h-6" style={{ color: integration.color }} />;
    }
    
    return <IconComponent className="w-6 h-6" style={{ color: integration.color }} />;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              {/* CORRECTION: Utiliser la fonction renderIcon */}
              {renderIcon()}
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {integration.name}
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  {integration.status}
                </span>
              </h3>
              <p className="text-sm text-gray-400 mt-1">{integration.provider}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-4">{integration.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {integration.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-gray-700 rounded">
              {feature}
            </span>
          ))}
          {integration.features.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-700 rounded">
              +{integration.features.length - 3} autres
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {integration.status === 'connected' ? (
            <>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Synchroniser
                  </>
                )}
              </button>
              <button
                onClick={onConfigure}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onDisconnect}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg"
              >
                <Unlink className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Connecter
            </button>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && integration.status === 'connected' && (
        <div className="px-6 pb-6 border-t border-gray-700 pt-4">
          {/* Usage stats */}
          {integration.usage && (
            <div className="space-y-3 mb-4">
              {integration.usage.storage && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Stockage</span>
                    <span>
                      {integration.usage.storage.used} / {integration.usage.storage.total} {integration.usage.storage.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${(integration.usage.storage.used / integration.usage.storage.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {integration.usage.apiCalls && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">API Calls</span>
                    <span>
                      {integration.usage.apiCalls.used.toLocaleString()} / {integration.usage.apiCalls.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                      style={{ width: `${(integration.usage.apiCalls.used / integration.usage.apiCalls.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {integration.lastSync && (
              <div>
                <span className="text-gray-400">Dernière sync</span>
                <p className="font-medium">{new Date(integration.lastSync).toLocaleString()}</p>
              </div>
            )}
            {integration.syncFrequency && (
              <div>
                <span className="text-gray-400">Fréquence</span>
                <p className="font-medium capitalize">{integration.syncFrequency}</p>
              </div>
            )}
            {integration.stats?.totalFiles && (
              <div>
                <span className="text-gray-400">Fichiers</span>
                <p className="font-medium">{integration.stats.totalFiles.toLocaleString()}</p>
              </div>
            )}
            {integration.stats?.successRate && (
              <div>
                <span className="text-gray-400">Taux de succès</span>
                <p className="font-medium">{integration.stats.successRate}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant gestion des API Keys
const APIKeysManager: React.FC<{
  apiKeys: APIKey[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}> = ({ apiKeys, onAdd, onDelete, onToggle }) => {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Clé API copiée');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          Clés API
        </h3>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle clé
        </button>
      </div>

      <div className="space-y-3">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune clé API configurée</p>
            <p className="text-sm mt-2">Créez une clé pour commencer à utiliser l'API</p>
          </div>
        ) : (
          apiKeys.map(apiKey => (
            <div
              key={apiKey.id}
              className="p-4 bg-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {apiKey.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      apiKey.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : apiKey.status === 'expired'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-600 text-gray-400'
                    }`}>
                      {apiKey.status}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Créée le {apiKey.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggle(apiKey.id)}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    {apiKey.status === 'active' ? 
                      <Lock className="w-4 h-4 text-emerald-400" /> : 
                      <Unlock className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                  <button
                    onClick={() => onDelete(apiKey.id)}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* API Key display */}
              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 px-3 py-2 bg-gray-900 rounded text-xs font-mono">
                  {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="p-2 hover:bg-gray-600 rounded"
                >
                  {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyKey(apiKey.key)}
                  className="p-2 hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap gap-1 mb-3">
                {apiKey.permissions.map((perm, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-gray-600 rounded">
                    {perm}
                  </span>
                ))}
              </div>

              {/* Usage stats */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Utilisations</span>
                  <p className="font-medium">{apiKey.usage.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Limite</span>
                  <p className="font-medium">{apiKey.rateLimit}/min</p>
                </div>
                {apiKey.lastUsed && (
                  <div>
                    <span className="text-gray-400">Dernière utilisation</span>
                    <p className="font-medium">{new Date(apiKey.lastUsed).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Composant principal IntegrationsPage
const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadIntegrations();
    loadAPIKeys();
    loadWebhooks();
  }, []);

  const loadIntegrations = () => {
    // Simuler le chargement des intégrations avec leur statut actuel
    const savedIntegrations = localStorage.getItem('integrations');
    if (savedIntegrations) {
      const parsed = JSON.parse(savedIntegrations);
      setIntegrations(parsed);
    }
  };

  const loadAPIKeys = () => {
    // Charger les clés API de démonstration
    const demoKeys: APIKey[] = [
      {
        id: 'key_1',
        name: 'Production API Key',
        key: 'sk-prod-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: new Date('2025-01-01'),
        lastUsed: new Date('2025-01-15'),
        permissions: ['read', 'write', 'delete'],
        rateLimit: 1000,
        usage: 45823,
        status: 'active'
      },
      {
        id: 'key_2',
        name: 'Development API Key',
        key: 'sk-dev-yyyyyyyyyyyyyyyyyyyyyyyyyyyy',
        createdAt: new Date('2025-01-10'),
        permissions: ['read'],
        rateLimit: 100,
        usage: 2341,
        status: 'active'
      }
    ];
    setApiKeys(demoKeys);
  };

  const loadWebhooks = () => {
    // Charger les webhooks de démonstration
    const demoWebhooks: Webhook[] = [
      {
        id: 'webhook_1',
        url: 'https://api.traduckxion.com/webhooks/transcription',
        events: ['transcription.completed', 'transcription.failed'],
        status: 'active',
        lastTriggered: new Date('2025-01-15'),
        successCount: 156,
        failureCount: 2
      }
    ];
    setWebhooks(demoWebhooks);
  };

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(true);
    setSelectedIntegration(integration);

    // Simuler l'OAuth flow
    setTimeout(() => {
      // Simuler la connexion réussie
      const updatedIntegrations = integrations.map(int => 
        int.id === integration.id 
          ? { 
              ...int, 
              status: 'connected' as const,
              lastSync: new Date(),
              usage: {
                storage: { used: 12.5, total: 100, unit: 'GB' as const },
                files: 1234,
                folders: 56,
                apiCalls: { used: 5432, total: 10000, resetDate: new Date() }
              },
              stats: {
                totalFiles: 1234,
                totalFolders: 56,
                syncedToday: 45,
                failedSyncs: 2,
                lastActivity: new Date(),
                avgSyncTime: 2.5,
                successRate: 98
              }
            }
          : int
      );
      
      setIntegrations(updatedIntegrations);
      localStorage.setItem('integrations', JSON.stringify(updatedIntegrations));
      
      setIsConnecting(false);
      toast.success(`${integration.name} connecté avec succès`);
    }, 2000);
  };

  const handleDisconnect = (integration: Integration) => {
    if (!confirm(`Déconnecter ${integration.name} ?`)) return;

    const updatedIntegrations = integrations.map(int => 
      int.id === integration.id 
        ? { ...int, status: 'disconnected' as const, usage: undefined, stats: undefined }
        : int
    );
    
    setIntegrations(updatedIntegrations);
    localStorage.setItem('integrations', JSON.stringify(updatedIntegrations));
    
    toast.success(`${integration.name} déconnecté`);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleSync = (integration: Integration) => {
    // La synchronisation est gérée dans le composant IntegrationCard
    console.log('Syncing', integration.name);
  };

  const handleAddAPIKey = () => {
    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: `New API Key ${apiKeys.length + 1}`,
      key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      permissions: ['read'],
      rateLimit: 100,
      usage: 0,
      status: 'active'
    };
    
    setApiKeys([...apiKeys, newKey]);
    toast.success('Nouvelle clé API créée');
  };

  const handleDeleteAPIKey = (id: string) => {
    if (!confirm('Supprimer cette clé API ?')) return;
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success('Clé API supprimée');
  };

  const handleToggleAPIKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id 
        ? { ...key, status: key.status === 'active' ? 'inactive' as const : 'active' as const }
        : key
    ));
  };

  // Filtrer les intégrations
  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.type === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Compter les intégrations connectées
  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const categories = [
    { id: 'all', name: 'Toutes', icon: Globe },
    { id: 'cloud', name: 'Cloud', icon: Cloud },
    { id: 'communication', name: 'Communication', icon: MessageSquare },
    { id: 'productivity', name: 'Productivité', icon: Briefcase },
    { id: 'ai', name: 'IA', icon: Cpu },
    { id: 'developer', name: 'Développeur', icon: Code }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Intégrations & API
            </h1>
            <p className="text-gray-400">
              Connectez TraduckXion à vos outils préférés
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold">{connectedCount}/{integrations.length}</p>
              <p className="text-sm text-gray-400">Intégrations actives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <span className="text-2xl font-bold">{integrations.filter(i => i.type === 'cloud' && i.status === 'connected').length}</span>
          </div>
          <p className="text-sm text-gray-400">Services Cloud</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Key className="w-5 h-5 text-amber-400" />
            <span className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</span>
          </div>
          <p className="text-sm text-gray-400">Clés API actives</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-violet-400" />
            <span className="text-2xl font-bold">{webhooks.filter(w => w.status === 'active').length}</span>
          </div>
          <p className="text-sm text-gray-400">Webhooks actifs</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-bold">
              {apiKeys.reduce((acc, key) => acc + key.usage, 0).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-400">Appels API ce mois</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher une intégration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Category filters */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredIntegrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => handleConnect(integration)}
            onDisconnect={() => handleDisconnect(integration)}
            onConfigure={() => handleConfigure(integration)}
            onSync={() => handleSync(integration)}
          />
        ))}
      </div>

      {/* API Keys Manager */}
      <APIKeysManager
        apiKeys={apiKeys}
        onAdd={handleAddAPIKey}
        onDelete={handleDeleteAPIKey}
        onToggle={handleToggleAPIKey}
      />

      {/* Webhooks section */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" />
            Webhooks
          </h3>
          <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un webhook
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.map(webhook => (
            <div key={webhook.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono text-sm">{webhook.url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {webhook.events.map((event, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-gray-600 rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  webhook.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {webhook.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <span className="text-gray-400">Succès</span>
                  <p className="font-medium text-emerald-400">{webhook.successCount}</p>
                </div>
                <div>
                  <span className="text-gray-400">Échecs</span>
                  <p className="font-medium text-red-400">{webhook.failureCount}</p>
                </div>
                {webhook.lastTriggered && (
                  <div>
                    <span className="text-gray-400">Dernier appel</span>
                    <p className="font-medium">{new Date(webhook.lastTriggered).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OAuth Connect Modal */}
      {isConnecting && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* CORRECTION: Gestion sécurisée de l'icône dans le modal */}
                {(() => {
                  if (!selectedIntegration.icon || typeof selectedIntegration.icon !== 'function') {
                    return <Box className="w-8 h-8 text-indigo-400" />;
                  }
                  const ModalIcon = selectedIntegration.icon;
                  return <ModalIcon className="w-8 h-8 text-indigo-400" />;
                })()}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connexion à {selectedIntegration.name}
              </h3>
              <p className="text-gray-400 mb-6">
                Redirection vers {selectedIntegration.provider} pour autorisation...
              </p>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;