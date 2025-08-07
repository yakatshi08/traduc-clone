export interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  quota?: {
    used: number;
    total: number;
  };
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
}

class CloudIntegrationService {
  private providers: CloudProvider[] = [
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: '🔷',
      connected: false,
      quota: { used: 0, total: 15 * 1024 * 1024 * 1024 } // 15GB
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '💧',
      connected: false,
      quota: { used: 0, total: 2 * 1024 * 1024 * 1024 } // 2GB
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: false,
      quota: { used: 0, total: 5 * 1024 * 1024 * 1024 } // 5GB
    }
  ];

  // OAuth2 Flow Simulation
  async connectProvider(providerId: string): Promise<boolean> {
    // Simuler OAuth2
    console.log(`Initiating OAuth2 for ${providerId}`);
    
    // Dans la vraie app, ça ouvrirait une fenêtre OAuth
    return new Promise((resolve) => {
      setTimeout(() => {
        const provider = this.providers.find(p => p.id === providerId);
        if (provider) {
          provider.connected = true;
        }
        resolve(true);
      }, 2000);
    });
  }

  async disconnectProvider(providerId: string): Promise<void> {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.connected = false;
    }
  }

  async listFiles(providerId: string, path: string = '/'): Promise<CloudFile[]> {
    // Simuler la récupération des fichiers
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockFiles: CloudFile[] = [
      {
        id: '1',
        name: 'Réunion_Equipe_2024.mp4',
        type: 'video/mp4',
        size: 256 * 1024 * 1024,
        modifiedAt: new Date('2024-12-15'),
        provider: providerId,
        path: path
      },
      {
        id: '2',
        name: 'Podcast_Episode_12.mp3',
        type: 'audio/mp3',
        size: 45 * 1024 * 1024,
        modifiedAt: new Date('2024-12-10'),
        provider: providerId,
        path: path
      },
      {
        id: '3',
        name: 'Conference_Keynote.wav',
        type: 'audio/wav',
        size: 180 * 1024 * 1024,
        modifiedAt: new Date('2024-12-08'),
        provider: providerId,
        path: path
      }
    ];

    return mockFiles;
  }

  async importFile(file: CloudFile): Promise<File> {
    // Simuler le téléchargement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Créer un File object simulé
    const blob = new Blob([''], { type: file.type });
    return new File([blob], file.name, { type: file.type });
  }

  async exportToCloud(
    file: File, 
    providerId: string, 
    path: string = '/'
  ): Promise<CloudFile> {
    // Simuler l'upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      modifiedAt: new Date(),
      provider: providerId,
      path: path
    };
  }

  getProviders(): CloudProvider[] {
    return this.providers;
  }

  isConnected(providerId: string): boolean {
    const provider = this.providers.find(p => p.id === providerId);
    return provider?.connected || false;
  }
}

export const cloudIntegrationService = new CloudIntegrationService();

// API Service
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
}

class APIService {
  private apiKeys: APIKey[] = [];

  generateAPIKey(name: string): APIKey {
    const key: APIKey = {
      id: Date.now().toString(),
      name,
      key: `tk_${this.generateRandomString(32)}`,
      createdAt: new Date(),
      usage: { calls: 0, minutes: 0 },
      limit: { minutes: 100 } // 100 minutes gratuits
    };

    this.apiKeys.push(key);
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

  async validateAPIKey(key: string): Promise<boolean> {
    return this.apiKeys.some(k => k.key === key);
  }

  getAPIKeys(): APIKey[] {
    return this.apiKeys;
  }

  revokeAPIKey(id: string): void {
    this.apiKeys = this.apiKeys.filter(k => k.id !== id);
  }
}

export const apiService = new APIService();