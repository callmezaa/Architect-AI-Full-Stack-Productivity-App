import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

/**
 * API Service for communicating with FastAPI Backend.
 */

const getBackendUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:8000`;
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getBackendUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Attach Token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle 401 and 404 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and potentially logout
      await SecureStore.deleteItemAsync('user_token');
      console.log('Auth failed or expired. Token cleared.');
    } else if (error.response?.status === 404) {
      console.warn(`API 404 Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to check if the user is currently authenticated without making a request.
 */
export const isAuthenticated = async () => {
  const token = await SecureStore.getItemAsync('user_token');
  return !!token;
};

// AUTH SERVICE
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (email, password, fullName) => {
    const response = await api.post('/api/auth/register', { 
      email, 
      password, 
      full_name: fullName 
    });
    return response.data;
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('user_token');
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  updateMe: async (data) => {
    const response = await api.patch('/api/auth/me', data);
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/api/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  }
};

// SETTINGS SERVICE (Local Persistence)
export const settingsService = {
  getSettings: async () => {
    try {
      const data = await SecureStore.getItemAsync('user_settings');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    // Defaults
    return {
      darkMode: false,
      notifications: true,
      focusDuration: 25,
      aiFrequency: 'Medium',
      aiPersonalization: true,
      language: 'en'
    };
  },
  saveSettings: async (settings) => {
    try {
      await SecureStore.setItemAsync('user_settings', JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }
};

// TASK SERVICE
export const taskService = {
  getTasks: async () => {
    const response = await api.get('/api/tasks/');
    return response.data;
  },
  createTask: async (title, priority = 'medium') => {
    const response = await api.post('/api/tasks/', { title, priority });
    return response.data;
  },
  updateTask: async (id, data) => {
    if (!id) {
       console.error("updateTask called without ID");
       return null;
    }
    const response = await api.patch(`/api/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id) => {
    if (!id) {
       console.error("deleteTask called without ID");
       return;
    }
    console.log(`Deleting task ${id}...`);
    await api.delete(`/api/tasks/${id}`);
  }
};

// AI SERVICE
export const aiService = {
  chat: async (message) => {
    try {
      const response = await api.post('/api/chat', { message });
      return response.data;
    } catch (error) {
      console.error('API Error (Chat):', error);
      throw error;
    }
  },
  getSuggestions: async () => {
    try {
      const response = await api.get('/api/tasks/suggestions');
      return response.data;
    } catch (error) {
      console.error('API Error (Suggestions):', error);
      throw error;
    }
  },
  checkHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('API Error (Health):', error);
      throw error;
    }
  }
};

// STATS SERVICE
export const statsService = {
  getProductivity: async () => {
    const response = await api.get('/api/stats/productivity');
    return response.data;
  },
  getActivity: async () => {
    const response = await api.get('/api/stats/activity');
    return response.data;
  }
};

export default api;
