import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import { User, AuthContextType } from '../types';
import { config } from '../config/config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(config.STORAGE_KEYS.TOKEN);
      const storedUser = await AsyncStorage.getItem(config.STORAGE_KEYS.USER);
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process...');
      setIsLoading(true);
      
      console.log('📡 Making API call to login...');
      const response = await authAPI.login(email, password);
      console.log('✅ Login API response received:', response);
      
      if (response.token && response._id) {
        console.log('🔑 Token and user data received, storing in AsyncStorage...');
        await AsyncStorage.setItem(config.STORAGE_KEYS.TOKEN, response.token);
        await AsyncStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(response));
        
        console.log('💾 Data stored, updating state...');
        setToken(response.token);
        setUser(response);
        console.log('✅ Login successful! User state updated.');
      } else {
        console.error('❌ Invalid response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    } finally {
      setIsLoading(false);
      console.log('🏁 Login process completed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(name, email, password);
      
      if (response.token && response._id) {
        await AsyncStorage.setItem(config.STORAGE_KEYS.TOKEN, response.token);
        await AsyncStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(response));
        
        setToken(response.token);
        setUser(response);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
