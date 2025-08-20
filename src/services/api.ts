// src/services/api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import toast from 'react-hot-toast';

// ========================================
// TYPES ET INTERFACES
// ========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'enterprise';
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  preferences: {
    language: string;
    theme: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
  transcriptionsCount: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'document' | 'pdf';
  size: number;
  projectId?: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'transcribed' | 'error';
  transcriptionId?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transcription {
  id: string;
  documentId: string;
  text: string;
  language: string;
  segments: TranscriptionSegment[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  metrics?: {
    accuracy: number;
    confidence: number;
    wer: number;
    wordCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface Translation {
  id: string;
  transcriptionId: string;
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'google' | 'openai' | 'azure';
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Analytics {
  transcriptionMinutes: number;
  translationCharacters: number;
  documentsProcessed: number;
  storageUsed: number;
  apiCalls: number;
  accuracy: number;
  trends: {
    date: string;
    value: number;
  }[];
}

// ========================================
// CONFIGURATION ET HELPERS
// ========================================

class ApiClient {
  private api: AxiosInstance;
  private refreshTokenTimeout?: NodeJS.Timeout;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private webSocket: WebSocket | null = null;
  private performanceMetrics: Map<string, number[]> = new Map();

  constructor() {
    // Créer l'instance Axios
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Configurer les intercepteurs
    this.setupInterceptors();
    
    // Initialiser WebSocket si nécessaire
    this.initWebSocket();
    
    // Nettoyer le cache périodiquement
    setInterval(() => this.cleanCache(), 60000); // Toutes les minutes
  }

  // ========================================
  // INTERCEPTEURS
  // ========================================

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Ajouter le token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Ajouter un ID de requête pour le tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Log en développement
        if (import.meta.env.DEV) {
          console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        // Mesurer les performances
        const startTime = Date.now();
        config.metadata = { startTime };

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Mesurer le temps de réponse
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime;
        if (startTime) {
          const duration = endTime - startTime;
          this.recordPerformance(response.config.url || '', duration);
          
          if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.status} (${duration}ms)`);
          }
        }

        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Gestion des erreurs 401 (non authentifié)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Essayer de rafraîchir le token
          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              this.setToken(newToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Gestion des erreurs 429 (rate limiting)
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter && !originalRequest._retry) {
            originalRequest._retry = true;
            await this.delay(parseInt(retryAfter) * 1000);
            return this.api(originalRequest);
          }
        }

        // Gestion des erreurs réseau
        if (!error.response && error.code === 'ECONNABORTED') {
          toast.error('Timeout - Le serveur met trop de temps à répondre');
        } else if (!error.response) {
          toast.error('Erreur réseau - Vérifiez votre connexion');
        }

        // Log des erreurs
        if (import.meta.env.DEV) {
          console.error('❌ API Error:', {
            url: originalRequest.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
          });
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  // ========================================
  // MÉTHODES UTILITAIRES
  // ========================================

  private getToken(): string | null {
    return localStorage.getItem('traduckxion_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('traduckxion_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('traduckxion_token');
    localStorage.removeItem('traduckxion_user');
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private formatError(error: AxiosError<ApiError>): ApiError {
    return {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue',
      code: error.response?.data?.code || error.code,
      status: error.response?.status,
      details: error.response?.data?.details,
    };
  }

  private handleAuthError(): void {
    this.removeToken();
    window.location.href = '/login';
    toast.error('Session expirée, veuillez vous reconnecter');
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await this.api.post('/api/auth/refresh');
      return response.data.token;
    } catch (error) {
      return null;
    }
  }

  private recordPerformance(endpoint: string, duration: number): void {
    if (!this.performanceMetrics.has(endpoint)) {
      this.performanceMetrics.set(endpoint, []);
    }
    const metrics = this.performanceMetrics.get(endpoint)!;
    metrics.push(duration);
    
    // Garder seulement les 100 dernières mesures
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  // ========================================
  // CACHE
  // ========================================

  private getCacheKey(url: string, params?: any): string {
    return `${url}${params ? JSON.stringify(params) : ''}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      if (import.meta.env.DEV) {
        console.log('📦 Cache hit:', key);
      }
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.requestCache.delete(key);
      }
    }
  }

  // ========================================
  // WEBSOCKET
  // ========================================

  private initWebSocket(): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    
    try {
      this.webSocket = new WebSocket(wsUrl);
      
      this.webSocket.onopen = () => {
        console.log('✅ WebSocket connecté');
        const token = this.getToken();
        if (token) {
          this.webSocket?.send(JSON.stringify({ type: 'auth', token }));
        }
      };

      this.webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };

      this.webSocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.webSocket.onclose = () => {
        console.log('🔴 WebSocket déconnecté');
        // Reconnecter après 5 secondes
        setTimeout(() => this.initWebSocket(), 5000);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private handleWebSocketMessage(data: any): void {
    // Émettre des événements personnalisés selon le type de message
    switch (data.type) {
      case 'transcription_progress':
        window.dispatchEvent(new CustomEvent('transcription:progress', { detail: data }));
        break;
      case 'transcription_complete':
        window.dispatchEvent(new CustomEvent('transcription:complete', { detail: data }));
        toast.success('Transcription terminée !');
        break;
      case 'translation_complete':
        window.dispatchEvent(new CustomEvent('translation:complete', { detail: data }));
        toast.success('Traduction terminée !');
        break;
      default:
        console.log('WebSocket message:', data);
    }
  }

  // ========================================
  // SERVICES AUTH
  // ========================================

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/register', data);
    
    if (response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('traduckxion_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('traduckxion_user', JSON.stringify(response.data.user));
      
      // Programmer le refresh automatique du token
      this.scheduleTokenRefresh();
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/api/auth/logout');
    } finally {
      this.removeToken();
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }
      window.location.href = '/login';
    }
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/api/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.put<User>('/api/auth/profile', data);
    localStorage.setItem('traduckxion_user', JSON.stringify(response.data));
    return response.data;
  }

  private scheduleTokenRefresh(): void {
    // Rafraîchir le token 5 minutes avant expiration
    const refreshIn = 55 * 60 * 1000; // 55 minutes
    
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    
    this.refreshTokenTimeout = setTimeout(async () => {
      try {
        const newToken = await this.refreshToken();
        if (newToken) {
          this.setToken(newToken);
          this.scheduleTokenRefresh();
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }, refreshIn);
  }

  // ========================================
  // SERVICES PROJECTS
  // ========================================

  async getProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Project>> {
    const cacheKey = this.getCacheKey('/api/projects', params);
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.api.get<PaginatedResponse<Project>>('/api/projects', {
      params,
    });
    
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.api.get<Project>(`/api/projects/${id}`);
    return response.data;
  }

  async createProject(data: {
    name: string;
    description?: string;
  }): Promise<Project> {
    const response = await this.api.post<Project>('/api/projects', data);
    this.requestCache.clear(); // Invalider le cache
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.api.put<Project>(`/api/projects/${id}`, data);
    this.requestCache.clear();
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/api/projects/${id}`);
    this.requestCache.clear();
  }

  // ========================================
  // SERVICES DOCUMENTS
  // ========================================

  async getDocuments(params?: {
    projectId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Document>> {
    const response = await this.api.get<PaginatedResponse<Document>>('/api/documents', {
      params,
    });
    return response.data;
  }

  async uploadDocument(
    file: File,
    options: {
      projectId?: string;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.projectId) {
      formData.append('projectId', options.projectId);
    }

    const response = await this.api.post<Document>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress?.(progress);
        }
      },
    });

    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.api.delete(`/api/documents/${id}`);
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await this.api.get(`/api/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // ========================================
  // SERVICES TRANSCRIPTIONS
  // ========================================

  async createTranscription(
    documentId: string,
    options?: {
      language?: string;
      model?: string;
      prompt?: string;
    }
  ): Promise<Transcription> {
    const response = await this.api.post<Transcription>('/api/transcriptions', {
      documentId,
      ...options,
    });
    return response.data;
  }

  async getTranscription(id: string): Promise<Transcription> {
    const response = await this.api.get<Transcription>(`/api/transcriptions/${id}`);
    return response.data;
  }

  async updateTranscription(
    id: string,
    data: {
      text?: string;
      segments?: TranscriptionSegment[];
    }
  ): Promise<Transcription> {
    const response = await this.api.put<Transcription>(`/api/transcriptions/${id}`, data);
    return response.data;
  }

  async exportTranscription(
    id: string,
    format: 'srt' | 'vtt' | 'txt' | 'json' | 'docx' | 'pdf'
  ): Promise<Blob> {
    const response = await this.api.get(`/api/transcriptions/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  }

  // ========================================
  // SERVICES TRANSLATIONS
  // ========================================

  async createTranslation(
    transcriptionId: string,
    targetLanguage: string,
    options?: {
      provider?: 'google' | 'openai' | 'azure';
      sector?: string;
    }
  ): Promise<Translation> {
    const response = await this.api.post<Translation>('/api/translations', {
      transcriptionId,
      targetLanguage,
      ...options,
    });
    return response.data;
  }

  async getTranslation(id: string): Promise<Translation> {
    const response = await this.api.get<Translation>(`/api/translations/${id}`);
    return response.data;
  }

  async getTranslations(transcriptionId: string): Promise<Translation[]> {
    const response = await this.api.get<Translation[]>('/api/translations', {
      params: { transcriptionId },
    });
    return response.data;
  }

  // ========================================
  // SERVICES ANALYTICS
  // ========================================

  async getAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<Analytics> {
    const cacheKey = this.getCacheKey('/api/analytics', { period });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const response = await this.api.get<Analytics>('/api/analytics', {
      params: { period },
    });
    
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  async getUsageStats(): Promise<{
    usage: any;
    limits: any;
    percentage: number;
  }> {
    const response = await this.api.get('/api/analytics/usage');
    return response.data;
  }

  // ========================================
  // MÉTHODES PUBLIQUES UTILITAIRES
  // ========================================

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('traduckxion_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getPerformanceMetrics(): Map<string, number[]> {
    return this.performanceMetrics;
  }

  getAverageResponseTime(endpoint: string): number | null {
    const metrics = this.performanceMetrics.get(endpoint);
    if (!metrics || metrics.length === 0) {
      return null;
    }
    
    const sum = metrics.reduce((a, b) => a + b, 0);
    return Math.round(sum / metrics.length);
  }

  clearCache(): void {
    this.requestCache.clear();
  }

  // Health check
  async checkHealth(): Promise<{
    status: string;
    version: string;
    timestamp: string;
  }> {
    const response = await this.api.get('/api/health');
    return response.data;
  }
}

// Export singleton
const apiClient = new ApiClient();
export default apiClient;

// Export services séparés pour compatibilité
export const authService = {
  register: (data: any) => apiClient.register(data),
  login: (email: string, password: string) => apiClient.login(email, password),
  logout: () => apiClient.logout(),
  me: () => apiClient.getProfile(),
};

export const projectService = {
  getAll: () => apiClient.getProjects(),
  getById: (id: string) => apiClient.getProject(id),
  create: (data: any) => apiClient.createProject(data),
  update: (id: string, data: any) => apiClient.updateProject(id, data),
  delete: (id: string) => apiClient.deleteProject(id),
};

export const documentService = {
  getAll: () => apiClient.getDocuments(),
  upload: (file: File, projectId?: string) => apiClient.uploadDocument(file, { projectId }),
  delete: (id: string) => apiClient.deleteDocument(id),
};

export const transcriptionService = {
  create: (documentId: string, options?: any) => apiClient.createTranscription(documentId, options),
  getById: (id: string) => apiClient.getTranscription(id),
  update: (id: string, content: string) => apiClient.updateTranscription(id, { text: content }),
};

export const analyticsService = {
  getDashboard: (period?: any) => apiClient.getAnalytics(period),
  getUsage: () => apiClient.getUsageStats(),
};