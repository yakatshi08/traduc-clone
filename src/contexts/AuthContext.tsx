// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { User, AuthResponse } from '@/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      if (apiClient.isAuthenticated()) {
        const profile = await apiClient.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      setUser(response.user);
      toast.success(`Bienvenue ${response.user.firstName} !`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion');
      throw error;
    }
  }, [navigate]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await apiClient.register(data);
      setUser(response.user);
      toast.success('Inscription réussie ! Bienvenue sur TraduckXion');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Erreur d'inscription");
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
      setUser(null);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout même en cas d'erreur
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const updatedUser = await apiClient.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profil mis à jour');
    } catch (error: any) {
      toast.error(error.message || 'Erreur de mise à jour');
      throw error;
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}