import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProgress } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  updateRomajiMode: (mode: 'full' | 'intermediate' | 'off') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUserData = async () => {
    try {
      if (!token) {
        setUser(null);
        setProgress(null);
        setLoading(false);
        return;
      }
      const [userRes, progressRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/user/progress')
      ]);
      setUser(userRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      console.error('Auth refresh failed', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await refreshUserData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProgress(null);
  };

  const updateRomajiMode = async (mode: 'full' | 'intermediate' | 'off') => {
    try {
      await api.put(`/user/romaji-mode?mode=${mode}`);
      if (progress) {
        setProgress({ ...progress, romaji_mode: mode });
      }
    } catch (err) {
      console.error('Failed to update romaji mode', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, progress, token, loading, login, logout, refreshUserData, updateRomajiMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
