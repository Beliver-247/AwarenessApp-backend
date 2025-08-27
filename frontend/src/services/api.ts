import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    });
    
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.clear();
      console.log('🔒 Token expired, cleared storage');
      // You might want to trigger a logout event here
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('🔐 Making login request to:', `${config.API_BASE_URL}/users/login`);
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    console.log('📝 Making register request to:', `${config.API_BASE_URL}/users/register`);
    const response = await api.post('/users/register', { name, email, password });
    return response.data;
  },
  getProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  updateProfile: async (userId: string, userData: any) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
};

// Events API calls
export const eventsAPI = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  join: async (id: string) => {
    const response = await api.post(`/events/${id}/join`);
    return response.data;
  },
};

// Challenges API calls
export const challengesAPI = {
  getAll: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },
  join: async (id: string) => {
    const response = await api.post(`/challenges/${id}/join`);
    return response.data;
  },
};

// Volunteer Opportunities API calls
export const volunteerAPI = {
  getAll: async () => {
    const response = await api.get('/volunteers');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data;
  },
  register: async (id: string) => {
    const response = await api.post(`/volunteers/${id}/register`);
    return response.data;
  },
};

// Achievements API calls
export const achievementsAPI = {
  getAll: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/achievements/leaderboard');
    return response.data;
  },
};

export default api;
