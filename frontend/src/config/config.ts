export const config = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: 'Awareness App',
  APP_VERSION: '1.0.0',
  
  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
  },
  
  // UI Configuration
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#4CAF50',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9800',
    ERROR: '#F44336',
    INFO: '#2196F3',
    LIGHT: '#f5f5f5',
    DARK: '#333',
    GRAY: '#666',
    LIGHT_GRAY: '#e0e0e0',
  },
  
  // Timeouts
  TIMEOUTS: {
    API_REQUEST: 10000, // 10 seconds
    AUTH_CHECK: 1000,   // 1 second
  },
};

