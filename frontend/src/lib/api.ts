import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wellness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('wellness_token');
      localStorage.removeItem('wellness_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Sessions API
export const sessionsAPI = {
  // Get all published sessions (public)
  getPublicSessions: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string;
    search?: string;
  }) => {
    const response = await api.get('/sessions', { params });
    return response.data;
  },

  // Get user's sessions (protected)
  getMySessions: async (params?: {
    status?: 'draft' | 'published';
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/sessions/my-sessions', { params });
    return response.data;
  },

  // Get single session
  getSession: async (id: string) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  // Create session
  createSession: async (sessionData: {
    title: string;
    description?: string;
    tags?: string[];
    jsonUrl?: string;
    category?: string;
    difficulty?: string;
    duration?: number;
    status?: 'draft' | 'published';
    content?: any;
  }) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  // Update session
  updateSession: async (id: string, sessionData: any) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  // Auto-save session
  autoSaveSession: async (id: string, data: any) => {
    const response = await api.patch(`/sessions/${id}/autosave`, data);
    return response.data;
  },

  // Publish session
  publishSession: async (id: string) => {
    const response = await api.patch(`/sessions/${id}/publish`);
    return response.data;
  },

  // Delete session
  deleteSession: async (id: string) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },
};

export default api;
