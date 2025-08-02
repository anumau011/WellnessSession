import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthResponse } from '../types';
import { authAPI } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('wellness_token');
    const savedUser = localStorage.getItem('wellness_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('wellness_token');
        localStorage.removeItem('wellness_user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authAPI.login({ email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('wellness_token', response.token);
      localStorage.setItem('wellness_user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await authAPI.register({ username, email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('wellness_token', response.token);
      localStorage.setItem('wellness_user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wellness_token');
    localStorage.removeItem('wellness_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
