// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName) newErrors.lastName = 'Nom requis';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            TraduckXion
          </h1>
          <p className="text-gray-400 mt-2">
            Transcription et traduction par IA
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center rounded-l-lg transition-colors ${
                isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center rounded-r-lg transition-colors ${
                !isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                isLogin ? 'Se connecter' : "S'inscrire"
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              En continuant, vous acceptez nos{' '}
              <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
                Conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>

        {/* Démo */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setFormData({
                ...formData,
                email: 'demo@traduckxion.com',
                password: 'Demo123!',
              });
              setIsLogin(true);
            }}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Utiliser le compte démo
          </button>
        </div>
      </motion.div>
    </div>
  );
}