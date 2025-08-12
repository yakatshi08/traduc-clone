// C:\PROJETS-DEVELOPPEMENT\traduc-clone\frontend\src\services\api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Fonction de login unique (à utiliser partout dans l'app)
 * Usage : const data = await login(email, password)
 */
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

// Services d'authentification (sans .login)
export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put('/auth/profile', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }
};

// Services pour Projects
export const projectService = {
  async getAll(params?: { page?: number; limit?: number; search?: string }) {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/projects/stats');
    return response.data;
  }
};

// Services pour Documents
export const documentService = {
  async getAll(params?: any) {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  async upload(file: File, projectId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};

// Services pour Transcriptions
export const transcriptionService = {
  async create(documentId: string, options?: any) {
    const response = await api.post('/transcriptions', { documentId, ...options });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/transcriptions/${id}`);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/transcriptions/${id}`, data);
    return response.data;
  },

  async getStatus(id: string) {
    const response = await api.get(`/transcriptions/${id}/status`);
    return response.data;
  },

  async export(id: string, format: 'srt' | 'vtt' | 'txt' | 'pdf') {
    const response = await api.get(`/transcriptions/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default api;
