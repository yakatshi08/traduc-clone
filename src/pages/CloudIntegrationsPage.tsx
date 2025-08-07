import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cloud, 
  Link2, 
  Unlink, 
  FolderOpen,
  Download,
  Upload,
  RefreshCw,
  Key,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { cloudIntegrationService, apiService, CloudProvider, CloudFile, APIKey } from '../services/cloudIntegrationService';

const CloudIntegrationsPage: React.FC = () => {
  const { t } = useTranslation('integrations');
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewApiKeyModal, setShowNewApiKeyModal] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');

  useEffect(() => {
    setProviders(cloudIntegrationService.getProviders());
    setApiKeys(apiService.getAPIKeys());
  }, []);

  const handleConnect = async (providerId: string) => {
    setIsLoading(true);
    try {
      await cloudIntegrationService.connectProvider(providerId);
      setProviders(cloudIntegrationService.getProviders());
    } catch (error) {
      console.error('Connection error:', error);
    }
    setIsLoading(false);
  };

  const handleDisconnect = async (providerId: string) => {
    await cloudIntegrationService.disconnectProvider(providerId);
    setProviders(cloudIntegrationService.getProviders());
    if (selectedProvider === providerId) {
      setSelectedProvider(null);
      setCloudFiles([]);
    }
  };

  const loadFiles = async (providerId: string) => {
    setIsLoading(true);
    setSelectedProvider(providerId);
    try {
      const files = await cloudIntegrationService.listFiles(providerId);
      setCloudFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    }
    setIsLoading(false);
  };

  const handleImportFile = async (file: CloudFile) => {
    setIsLoading(true);
    try {
      const importedFile = await cloudIntegrationService.importFile(file);
      console.log('File imported:', importedFile);
      // Rediriger vers la page de transcription avec le fichier
    } catch (error) {
      console.error('Import error:', error);
    }
    setIsLoading(false);
  };

  const handleGenerateApiKey = () => {
    if (newApiKeyName) {
      const newKey = apiService.generateAPIKey(newApiKeyName);
      setApiKeys([...apiKeys, newKey]);
      setNewApiKeyName('');
      setShowNewApiKeyModal(false);
      
      // Copier automatiquement la clé
      navigator.clipboard.writeText(newKey.key);
    }
  };

  const handleRevokeApiKey = (keyId: string) => {
    apiService.revokeAPIKey(keyId);
    setApiKeys(apiKeys.filter(k => k.id !== keyId));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-traduc-beige-900 dark:text-white mb-2">
          Intégrations & API
        </h1>
        <p className="text-traduc-beige-600 dark:text-gray-400">
          Connectez vos services cloud et gérez vos clés API
        </p>
      </div>

      {/* Services Cloud */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-traduc-beige-900 dark:text-white mb-6">
          Services Cloud
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {providers.map((provider) => (
            <div 
              key={provider.id}
              className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{provider.icon}</span>
                  <h3 className="font-semibold text-traduc-beige-900 dark:text-white">
                    {provider.name}
                  </h3>
                </div>
                {provider.connected ? (
                  <span className="px-2 py-1 bg-traduc-emerald/10 text-traduc-emerald text-xs rounded-full">
                    Connecté
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                    Non connecté
                  </span>
                )}
              </div>

              {provider.connected && provider.quota && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-traduc-beige-600 dark:text-gray-400 mb-1">
                    <span>Espace utilisé</span>
                    <span>
                      {(provider.quota.used / 1024 / 1024 / 1024).toFixed(1)} GB / 
                      {(provider.quota.total / 1024 / 1024 / 1024).toFixed(0)} GB
                    </span>
                  </div>
                  <div className="w-full bg-traduc-beige-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-traduc-indigo h-2 rounded-full"
                      style={{ width: `${(provider.quota.used / provider.quota.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {provider.connected ? (
                  <>
                    <button
                      onClick={() => loadFiles(provider.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Parcourir
                    </button>
                    <button
                      onClick={() => handleDisconnect(provider.id)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(provider.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg disabled:opacity-50"
                  >
                    <Link2 className="w-4 h-4" />
                    Connecter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fichiers cloud */}
        {selectedProvider && cloudFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg border border-traduc-beige-300 dark:border-gray-700">
            <div className="p-4 border-b border-traduc-beige-300 dark:border-gray-700">
              <h3 className="font-semibold text-traduc-beige-900 dark:text-white">
                Fichiers disponibles
              </h3>
            </div>
            
            <div className="divide-y divide-traduc-beige-200 dark:divide-gray-700">
              {cloudFiles.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between hover:bg-traduc-beige-50 dark:hover:bg-gray-900">
                  <div>
                    <p className="font-medium text-traduc-beige-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • 
                      Modifié le {file.modifiedAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleImportFile(file)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-traduc-violet hover:bg-traduc-violet/90 text-white rounded-lg disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Importer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clés API */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-traduc-beige-900 dark:text-white">
            Clés API
          </h2>
          <button
            onClick={() => setShowNewApiKeyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-traduc-emerald hover:bg-traduc-emerald/90 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Nouvelle clé
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="bg-traduc-beige-50 dark:bg-gray-900 rounded-lg p-8 text-center">
            <Key className="w-12 h-12 mx-auto mb-4 text-traduc-beige-400 dark:text-gray-600" />
            <p className="text-traduc-beige-600 dark:text-gray-400">
              Aucune clé API créée. Créez votre première clé pour commencer.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg border border-traduc-beige-300 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-traduc-beige-300 dark:border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-traduc-beige-700 dark:text-gray-300">
                    Nom
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-traduc-beige-700 dark:text-gray-300">
                    Clé
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-traduc-beige-700 dark:text-gray-300">
                    Utilisation
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-traduc-beige-700 dark:text-gray-300">
                    Créée le
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b border-traduc-beige-200 dark:border-gray-700">
                    <td className="p-4">
                      <p className="font-medium text-traduc-beige-900 dark:text-white">
                        {apiKey.name}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {apiKey.key.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(apiKey.key)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                        {apiKey.usage.minutes} / {apiKey.limit?.minutes || '∞'} min
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                        {apiKey.createdAt.toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRevokeApiKey(apiKey.id)}
                        className="p-2 text-traduc-red hover:bg-traduc-red/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nouvelle clé API */}
      {showNewApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
              Créer une nouvelle clé API
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                Nom de la clé
              </label>
              <input
                type="text"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                className="w-full px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                placeholder="Ma clé de production"
              />
            </div>
            
            <div className="bg-traduc-info-bg border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-traduc-info-blue">
                💡 Votre clé API aura accès à 100 minutes gratuites de transcription.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewApiKeyModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleGenerateApiKey}
                disabled={!newApiKeyName}
                className="flex-1 px-4 py-2 bg-traduc-emerald hover:bg-traduc-emerald/90 text-white rounded-lg disabled:opacity-50"
              >
                Créer la clé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudIntegrationsPage;