// src/pages/ProfilePage.tsx

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Shield, Bell, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import apiClient from '@/services/api';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences'>('info');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser(formData);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await apiClient.uploadAvatar(formData);
      await updateUser({ avatar: response.url });
      toast.success('Photo de profil mise à jour');
    } catch (error) {
      toast.error('Erreur upload photo');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-gray-400">Gérez vos informations personnelles et vos préférences</p>
      </div>

      {/* Photo de profil */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
                Plan {user?.plan || 'Free'}
              </span>
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                Compte vérifié
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'info'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-5 h-5 inline mr-2" />
          Informations
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'security'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shield className="w-5 h-5 inline mr-2" />
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 px-4 transition-all ${
            activeTab === 'preferences'
              ? 'border-b-2 border-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Palette className="w-5 h-5 inline mr-2" />
          Préférences
        </button>
      </div>

      {/* Contenu */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 bg-gray-700 rounded-lg opacity-50 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Paris, France"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Parlez-nous de vous..."
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Modifier le mot de passe
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Authentification à deux facteurs</h3>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Activer 2FA
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sessions actives</h3>
            <p className="text-gray-400 mb-4">Gérez vos sessions actives sur différents appareils</p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Déconnecter tous les appareils
            </button>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              {['Email', 'Push', 'SMS'].map(type => (
                <label key={type} className="flex items-center justify-between">
                  <span>{type}</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Langue et région</h3>
            <select className="w-full px-4 py-2 bg-gray-700 rounded-lg">
              <option>Français</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Thème</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 bg-gray-700 rounded-lg border-2 border-indigo-500">
                Sombre
              </button>
              <button className="p-4 bg-gray-700 rounded-lg border-2 border-transparent hover:border-gray-600">
                Clair
              </button>
              <button className="p-4 bg-gray-700 rounded-lg border-2 border-transparent hover:border-gray-600">
                Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}