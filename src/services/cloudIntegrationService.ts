import axios from 'axios';

export interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  quota?: {
    used: number;
    total: number;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface CloudFile {
  id: string;
  name: string;
  type: string;
  size: number;
  modifiedAt: Date;
  provider: string;
  path: string;
  thumbnail?: string;
  downloadUrl?: string;
}

// Configuration OAuth2
const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/drive.file'
  },
  dropbox: {
    clientId: import.meta.env.VITE_DROPBOX_APP_KEY || '',
    redirectUri: `${window.location.origin}/auth/dropbox/callback`,
    authUrl: 'https://www.dropbox.com/oauth2/authorize',
    tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    scope: 'files.read files.write'
  },
  onedrive: {
    clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/onedrive/callback`,
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: 'files.readwrite'
  }
};

class CloudIntegrationService {
  private providers: CloudProvider[] = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: '🔷',
      connected: false,
      quota: { used: 0, total: 15 * 1024 * 1024 * 1024 }
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '💧',
      connected: false,
      quota: { used: 0, total: 2 * 1024 * 1024 * 1024 }
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: false,
      quota: { used: 0, total: 5 * 1024 * 1024 * 1024 }
    }
  ];

  constructor() {
    // Charger les tokens depuis localStorage
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.providers.forEach(provider => {
      const tokens = localStorage.getItem(`${provider.id}_tokens`);
      if (tokens) {
        const parsed = JSON.parse(tokens);
        provider.accessToken = parsed.accessToken;
        provider.refreshToken = parsed.refreshToken;
        provider.connected = true;
      }
    });
  }

  // OAuth2 Flow
  async connectProvider(providerId: string): Promise<boolean> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) return false;

    const config = OAUTH_CONFIG[providerId.replace('-drive', '')];
    if (!config) return false;

    // Construire l'URL d'autorisation
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `${config.authUrl}?${params}`;

    // Ouvrir la fenêtre OAuth
    const authWindow = window.open(
      authUrl,
      'oauth2',
      'width=500,height=600,menubar=no,toolbar=no'
    );

    // Attendre le callback
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        try {
          if (authWindow?.closed) {
            clearInterval(checkInterval);
            // Vérifier si les tokens ont été sauvegardés
            const tokens = localStorage.getItem(`${providerId}_tokens`);
            if (tokens) {
              const parsed = JSON.parse(tokens);
              provider.accessToken = parsed.accessToken;
              provider.refreshToken = parsed.refreshToken;
              provider.connected = true;
              resolve(true);
            } else {
              resolve(false);
            }
          }
        } catch (e) {
          // Ignorer les erreurs cross-origin
        }
      }, 1000);
    });
  }

  // Échanger le code contre un token
  async handleOAuthCallback(providerId: string, code: string): Promise<void> {
    const config = OAUTH_CONFIG[providerId.replace('-drive', '')];
    if (!config) throw new Error('Provider not configured');

    const params = new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: import.meta.env[`VITE_${providerId.toUpperCase().replace('-', '_')}_CLIENT_SECRET`] || '',
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await axios.post(config.tokenUrl, params);
    const { access_token, refresh_token } = response.data;

    // Sauvegarder les tokens
    localStorage.setItem(`${providerId}_tokens`, JSON.stringify({
      accessToken: access_token,
      refreshToken: refresh_token
    }));

    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.accessToken = access_token;
      provider.refreshToken = refresh_token;
      provider.connected = true;
    }
  }

  async disconnectProvider(providerId: string): Promise<void> {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.connected = false;
      provider.accessToken = undefined;
      provider.refreshToken = undefined;
      localStorage.removeItem(`${providerId}_tokens`);
    }
  }

  // Google Drive API
  async listGoogleDriveFiles(path: string = 'root'): Promise<CloudFile[]> {
    const provider = this.providers.find(p => p.id === 'google-drive');
    if (!provider?.accessToken) throw new Error('Not authenticated');

    const response = await axios.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        headers: {
          'Authorization': `Bearer ${provider.accessToken}`
        },
        params: {
          q: `'${path}' in parents and (mimeType contains 'audio/' or mimeType contains 'video/')`,
          fields: 'files(id,name,mimeType,size,modifiedTime,thumbnailLink,webContentLink)',
          pageSize: 100
        }
      }
    );

    return response.data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      size: parseInt(file.size || '0'),
      modifiedAt: new Date(file.modifiedTime),
      provider: 'google-drive',
      path: path,
      thumbnail: file.thumbnailLink,
      downloadUrl: file.webContentLink
    }));
  }

  // Dropbox API
  async listDropboxFiles(path: string = ''): Promise<CloudFile[]> {
    const provider = this.providers.find(p => p.id === 'dropbox');
    if (!provider?.accessToken) throw new Error('Not authenticated');

    const response = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        path: path || '',
        recursive: false,
        include_media_info: true
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.entries
      .filter((entry: any) => entry['.tag'] === 'file' && 
        (entry.name.match(/\.(mp3|wav|mp4|avi|mov)$/i)))
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        type: this.getMimeType(file.name),
        size: file.size,
        modifiedAt: new Date(file.client_modified),
        provider: 'dropbox',
        path: file.path_display,
        downloadUrl: file.id
      }));
  }

  // OneDrive API
  async listOneDriveFiles(path: string = 'root'): Promise<CloudFile[]> {
    const provider = this.providers.find(p => p.id === 'onedrive');
    if (!provider?.accessToken) throw new Error('Not authenticated');

    const endpoint = path === 'root' 
      ? 'https://graph.microsoft.com/v1.0/me/drive/root/children'
      : `https://graph.microsoft.com/v1.0/me/drive/items/${path}/children`;

    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${provider.accessToken}`
      },
      params: {
        '$filter': "file/mimeType eq 'audio/mpeg' or file/mimeType eq 'video/mp4'"
      }
    });

    return response.data.value.map((file: any) => ({
      id: file.id,
      name: file.name,
      type: file.file?.mimeType || 'application/octet-stream',
      size: file.size,
      modifiedAt: new Date(file.lastModifiedDateTime),
      provider: 'onedrive',
      path: path,
      thumbnail: file.thumbnails?.[0]?.medium?.url,
      downloadUrl: file['@microsoft.graph.downloadUrl']
    }));
  }

  async listFiles(providerId: string, path: string = '/'): Promise<CloudFile[]> {
    switch (providerId) {
      case 'google-drive':
        return this.listGoogleDriveFiles(path === '/' ? 'root' : path);
      case 'dropbox':
        return this.listDropboxFiles(path);
      case 'onedrive':
        return this.listOneDriveFiles(path === '/' ? 'root' : path);
      default:
        throw new Error(`Provider ${providerId} not supported`);
    }
  }

  async importFile(file: CloudFile): Promise<File> {
    const provider = this.providers.find(p => p.id === file.provider);
    if (!provider?.accessToken) throw new Error('Not authenticated');

    let fileData: ArrayBuffer;

    switch (file.provider) {
      case 'google-drive':
        const googleResponse = await axios.get(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              'Authorization': `Bearer ${provider.accessToken}`
            },
            responseType: 'arraybuffer'
          }
        );
        fileData = googleResponse.data;
        break;

      case 'dropbox':
        const dropboxResponse = await axios.post(
          'https://content.dropboxapi.com/2/files/download',
          null,
          {
            headers: {
              'Authorization': `Bearer ${provider.accessToken}`,
              'Dropbox-API-Arg': JSON.stringify({ path: file.path })
            },
            responseType: 'arraybuffer'
          }
        );
        fileData = dropboxResponse.data;
        break;

      case 'onedrive':
        const onedriveResponse = await axios.get(
          file.downloadUrl!,
          {
            headers: {
              'Authorization': `Bearer ${provider.accessToken}`
            },
            responseType: 'arraybuffer'
          }
        );
        fileData = onedriveResponse.data;
        break;

      default:
        throw new Error(`Provider ${file.provider} not supported`);
    }

    const blob = new Blob([fileData], { type: file.type });
    return new File([blob], file.name, { type: file.type });
  }

  async exportToCloud(
    file: File, 
    providerId: string, 
    path: string = '/'
  ): Promise<CloudFile> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider?.accessToken) throw new Error('Not authenticated');

    switch (providerId) {
      case 'google-drive':
        return this.uploadToGoogleDrive(file, provider.accessToken, path);
      case 'dropbox':
        return this.uploadToDropbox(file, provider.accessToken, path);
      case 'onedrive':
        return this.uploadToOneDrive(file, provider.accessToken, path);
      default:
        throw new Error(`Provider ${providerId} not supported`);
    }
  }

  private async uploadToGoogleDrive(file: File, accessToken: string, parentId: string): Promise<CloudFile> {
    // Créer les métadonnées
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [parentId === '/' ? 'root' : parentId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      form,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return {
      id: response.data.id,
      name: response.data.name,
      type: response.data.mimeType,
      size: file.size,
      modifiedAt: new Date(),
      provider: 'google-drive',
      path: parentId
    };
  }

  private async uploadToDropbox(file: File, accessToken: string, path: string): Promise<CloudFile> {
    const fileData = await file.arrayBuffer();

    const response = await axios.post(
      'https://content.dropboxapi.com/2/files/upload',
      fileData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: `${path}/${file.name}`,
            mode: 'add',
            autorename: true
          }),
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    return {
      id: response.data.id,
      name: response.data.name,
      type: file.type,
      size: response.data.size,
      modifiedAt: new Date(response.data.client_modified),
      provider: 'dropbox',
      path: response.data.path_display
    };
  }

  private async uploadToOneDrive(file: File, accessToken: string, parentId: string): Promise<CloudFile> {
    const endpoint = parentId === '/' 
      ? `https://graph.microsoft.com/v1.0/me/drive/root:/${file.name}:/content`
      : `https://graph.microsoft.com/v1.0/me/drive/items/${parentId}:/${file.name}:/content`;

    const response = await axios.put(
      endpoint,
      file,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type
        }
      }
    );

    return {
      id: response.data.id,
      name: response.data.name,
      type: response.data.file?.mimeType || file.type,
      size: response.data.size,
      modifiedAt: new Date(response.data.lastModifiedDateTime),
      provider: 'onedrive',
      path: parentId
    };
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  getProviders(): CloudProvider[] {
    return this.providers;
  }

  isConnected(providerId: string): boolean {
    const provider = this.providers.find(p => p.id === providerId);
    return provider?.connected || false;
  }

  async updateQuota(providerId: string): Promise<void> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider?.accessToken) return;

    try {
      switch (providerId) {
        case 'google-drive':
          const googleResponse = await axios.get(
            'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
            {
              headers: {
                'Authorization': `Bearer ${provider.accessToken}`
              }
            }
          );
          provider.quota = {
            used: parseInt(googleResponse.data.storageQuota.usage),
            total: parseInt(googleResponse.data.storageQuota.limit)
          };
          break;

        case 'dropbox':
          const dropboxResponse = await axios.post(
            'https://api.dropboxapi.com/2/users/get_space_usage',
            null,
            {
              headers: {
                'Authorization': `Bearer ${provider.accessToken}`
              }
            }
          );
          provider.quota = {
            used: dropboxResponse.data.used,
            total: dropboxResponse.data.allocation.allocated
          };
          break;

        case 'onedrive':
          const onedriveResponse = await axios.get(
            'https://graph.microsoft.com/v1.0/me/drive',
            {
              headers: {
                'Authorization': `Bearer ${provider.accessToken}`
              }
            }
          );
          provider.quota = {
            used: onedriveResponse.data.quota.used,
            total: onedriveResponse.data.quota.total
          };
          break;
      }
    } catch (error) {
      console.error(`Error updating quota for ${providerId}:`, error);
    }
  }
}

export const cloudIntegrationService = new CloudIntegrationService();

// API Service pour les développeurs
export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  usage: {
    calls: number;
    minutes: number;
  };
  limit?: {
    calls?: number;
    minutes?: number;
  };
  scopes: string[];
}

class APIService {
  private apiKeys: APIKey[] = [];
  private webhooks: Map<string, string[]> = new Map();

  constructor() {
    // Charger les clés API depuis localStorage
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      this.apiKeys = JSON.parse(savedKeys);
    }
  }

  generateAPIKey(name: string, scopes: string[] = ['transcription', 'translation']): APIKey {
    const key: APIKey = {
      id: Date.now().toString(),
      name,
      key: `tk_${this.generateRandomString(32)}`,
      createdAt: new Date(),
      usage: { calls: 0, minutes: 0 },
      limit: { minutes: 100, calls: 1000 },
      scopes
    };

    this.apiKeys.push(key);
    this.saveKeys();
    return key;
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async validateAPIKey(key: string): Promise<APIKey | null> {
    const apiKey = this.apiKeys.find(k => k.key === key);
    if (apiKey) {
      apiKey.lastUsed = new Date();
      this.saveKeys();
    }
    return apiKey || null;
  }

  updateUsage(keyId: string, minutes: number = 0, calls: number = 1): void {
    const key = this.apiKeys.find(k => k.id === keyId);
    if (key) {
      key.usage.calls += calls;
      key.usage.minutes += minutes;
      this.saveKeys();
    }
  }

  getAPIKeys(): APIKey[] {
    return this.apiKeys;
  }

  revokeAPIKey(id: string): void {
    this.apiKeys = this.apiKeys.filter(k => k.id !== id);
    this.saveKeys();
  }

  private saveKeys(): void {
    localStorage.setItem('api_keys', JSON.stringify(this.apiKeys));
  }

  // Webhooks
  registerWebhook(event: string, url: string): void {
    if (!this.webhooks.has(event)) {
      this.webhooks.set(event, []);
    }
    this.webhooks.get(event)!.push(url);
  }

  async triggerWebhook(event: string, data: any): Promise<void> {
    const urls = this.webhooks.get(event) || [];
    
    for (const url of urls) {
      try {
        await axios.post(url, {
          event,
          timestamp: new Date().toISOString(),
          data
        });
      } catch (error) {
        console.error(`Webhook failed for ${url}:`, error);
      }
    }
  }

  getWebhooks(): { [event: string]: string[] } {
    return Object.fromEntries(this.webhooks);
  }

  removeWebhook(event: string, url: string): void {
    const urls = this.webhooks.get(event);
    if (urls) {
      const index = urls.indexOf(url);
      if (index > -1) {
        urls.splice(index, 1);
      }
    }
  }
}

export const apiService = new APIService();