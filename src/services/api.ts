import axios from 'axios';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post('/api/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Services projets
export const projectService = {
  getAll: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
};

// Services documents
export const documentService = {
  getAll: async () => {
    const response = await api.get('/api/documents');
    return response.data;
  },

  upload: async (file: File, projectId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  },
};

// Services transcriptions
export const transcriptionService = {
  create: async (documentId: string, options?: any) => {
    const response = await api.post('/api/transcriptions', {
      documentId,
      ...options,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/transcriptions/${id}`);
    return response.data;
  },

  update: async (id: string, content: string) => {
    const response = await api.put(`/api/transcriptions/${id}`, { content });
    return response.data;
  },
};

// Services analytics
export const analyticsService = {
  getDashboard: async (period: string = '30d') => {
    const response = await api.get(`/api/analytics/dashboard?period=${period}`);
    return response.data;
  },

  getUsage: async () => {
    const response = await api.get('/api/analytics/usage');
    return response.data;
  },
};

export default api;