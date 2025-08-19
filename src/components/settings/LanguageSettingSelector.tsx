// src/pages/SettingsPage.tsx

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // ⚠️ AJOUT IMPORTANT
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Palette, 
  Key,
  Mail,
  Phone,
  Building,
  Camera,
  Download,
  Trash2,
  Check,
  AlertCircle,
  ChevronRight,
  Save,
  LogOut,
  Loader2,
  Copy,
  RefreshCw,
  CheckCircle,
  X,
  Plus,
  Eye,
  EyeOff,
  MapPin,
  Monitor,
  Smartphone,
  Lock,
  ExternalLink,
  Code,
  Webhook
} from 'lucide-react';
import PricingPage from './PricingPage';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing' | 'preferences' | 'api';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation('settings'); // ⚠️ AJOUT IMPORTANT
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateApiModal, setShowCreateApiModal] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@traducxion.com',
    phone: '+33 6 12 34 56 78',
    company: 'TraducXion Pro',
    role: 'Administrateur',
    bio: 'Professionnel de la traduction et transcription depuis 5 ans.',
    location: 'Paris, France'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    teamInvites: true,
    marketingEmails: false,
    weeklyReports: true,
    instantAlerts: true
  });

  const [preferences, setPreferences] = useState({
    language: i18n.language, // ⚠️ MODIFIÉ: Utiliser la langue actuelle de i18n
    theme: 'dark',
    autoSave: true,
    defaultTranscriptionLanguage: 'fr',
    defaultTranslationLanguage: 'en',
    showTutorials: true
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 'production', name: 'Clé de production', key: 'process.env.VITE_STRIPE_KEY••••••••••••••••••••••••hJ8k', created: '1 janvier 2025', lastUsed: '2 heures', active: true },
    { id: 'test', name: 'Clé de test', key: 'process.env.VITE_STRIPE_KEY••••••••••••••••••••••••nM2p', created: '15 décembre 2024', lastUsed: 'Jamais', active: false }
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome sur Windows', location: 'Paris, France', current: true, lastActive: 'Actuelle' },
    { id: 2, device: 'Application mobile iOS', location: 'Lyon, France', current: false, lastActive: 'Il y a 2 jours' },
    { id: 3, device: 'Firefox sur MacOS', location: 'Marseille, France', current: false, lastActive: 'Il y a 5 jours' }
  ]);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profil', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'security' as SettingsTab, label: 'Sécurité', icon: Shield },
    { id: 'billing' as SettingsTab, label: 'Facturation & Plans', icon: CreditCard },
    { id: 'preferences' as SettingsTab, label: 'Préférences', icon: Palette },
    { id: 'api' as SettingsTab, label: 'API & Intégrations', icon: Key }
  ];

  // ⚠️ AJOUT: Fonction pour changer la langue avec i18n
  const handleLanguageChange = async (newLang: string) => {
    try {
      await i18n.changeLanguage(newLang);
      localStorage.setItem('preferredLanguage', newLang);
      setPreferences({...preferences, language: newLang});
      showToast('Langue mise à jour avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
      showToast('Erreur lors du changement de langue', 'error');
    }
  };

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 animate-fade-in ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Gestion de l'upload d'avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        showToast('Photo de profil mise à jour', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarde du profil
  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulation de sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      showToast('Profil mis à jour avec succès', 'success');
    }, 1500);
  };

  // Copier une clé API
  const handleCopyApiKey = (key: string, keyId: string) => {
    // Pour la démo, on copie une vraie clé fictive
    const fullKey = keyId === 'production' 
      ? 'process.env.VITE_STRIPE_KEY1234567890abcdefghijklmnopqrstuvwxyz' 
      : 'process.env.VITE_STRIPE_KEY0987654321zyxwvutsrqponmlkjihgfedcba';
    
    navigator.clipboard.writeText(fullKey);
    setCopiedKey(keyId);
    showToast('Clé API copiée dans le presse-papiers', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Créer une nouvelle clé API
  const handleCreateApiKey = () => {
    if (!newApiKeyName.trim()) {
      showToast('Veuillez entrer un nom pour la clé', 'error');
      return;
    }
    
    const newKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 15)}••••••••`,
      created: new Date().toLocaleDateString('fr-FR'),
      lastUsed: 'Jamais',
      active: true
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewApiKeyName('');
    setShowCreateApiModal(false);
    showToast('Nouvelle clé API créée avec succès', 'success');
  };

  // Supprimer une clé API
  const handleDeleteApiKey = (keyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette clé API ? Cette action est irréversible.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      showToast('Clé API supprimée', 'success');
    }
  };

  // Révoquer une session
  const handleRevokeSession = (sessionId: number) => {
    if (confirm('Voulez-vous vraiment révoquer cette session ?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      showToast('Session révoquée', 'success');
    }
  };

  // Export des données
  const handleExportData = () => {
    const dataToExport = {
      profile: profileData,
      preferences: preferences,
      notifications: notifications,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traducxion-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Données exportées avec succès', 'success');
  };

  // Suppression du compte
  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.')) {
      if (confirm('Dernière confirmation : Voulez-vous vraiment supprimer votre compte ?')) {
        showToast('Compte supprimé. Redirection...', 'success');
        // Logique de suppression
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Informations personnelles</h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Modifier
                    </>
                  )}
                </button>
              </div>
              
              {/* Photo de profil */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">JD</span>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-1">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-sm text-gray-400">{profileData.role} • {profileData.company}</p>
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                    >
                      Changer la photo
                    </button>
                  )}
                </div>
              </div>

              {/* Formulaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-6">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Zone danger */}
            <div className="bg-red-900/20 rounded-lg p-6 border border-red-900/50">
              <h3 className="text-lg font-semibold mb-4 text-red-400">Zone danger</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Exporter mes données</h4>
                    <p className="text-sm text-gray-400">Téléchargez toutes vos données au format JSON</p>
                  </div>
                  <button 
                    onClick={handleExportData}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Supprimer mon compte</h4>
                    <p className="text-sm text-gray-400">Cette action est irréversible</p>
                  </div>
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Préférences de notification</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                    <div>
                      <h4 className="font-medium">
                        {key === 'emailNotifications' && 'Notifications par email'}
                        {key === 'projectUpdates' && 'Mises à jour des projets'}
                        {key === 'teamInvites' && 'Invitations d\'équipe'}
                        {key === 'marketingEmails' && 'Emails marketing'}
                        {key === 'weeklyReports' && 'Rapports hebdomadaires'}
                        {key === 'instantAlerts' && 'Alertes instantanées'}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {key === 'emailNotifications' && 'Recevez des notifications importantes par email'}
                        {key === 'projectUpdates' && 'Soyez informé des changements sur vos projets'}
                        {key === 'teamInvites' && 'Recevez les invitations à rejoindre des équipes'}
                        {key === 'marketingEmails' && 'Nouvelles fonctionnalités et offres spéciales'}
                        {key === 'weeklyReports' && 'Résumé hebdomadaire de votre activité'}
                        {key === 'instantAlerts' && 'Notifications en temps réel dans l\'application'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications({...notifications, [key]: !value});
                        showToast(value ? 'Notifications désactivées' : 'Notifications activées', 'success');
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Sécurité du compte</h3>
              
              {/* Mot de passe */}
              <div className="mb-6">
                <h4 className="font-medium mb-4">Changer le mot de passe</h4>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                      <button
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    onClick={() => showToast('Mot de passe mis à jour', 'success')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </div>

              {/* Authentification à deux facteurs */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-400">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                    Activée
                  </span>
                </div>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Configurer
                </button>
              </div>

              {/* Sessions actives */}
              <div className="pt-6 border-t border-gray-700">
                <h4 className="font-medium mb-4">Sessions actives</h4>
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${session.current ? 'bg-blue-600/20' : 'bg-gray-700'} rounded-lg flex items-center justify-center`}>
                          {session.device.includes('mobile') ? (
                            <Smartphone className={`w-5 h-5 ${session.current ? 'text-blue-400' : 'text-gray-400'}`} />
                          ) : (
                            <Monitor className={`w-5 h-5 ${session.current ? 'text-blue-400' : 'text-gray-400'}`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-gray-400">
                            {session.location} • {session.lastActive}
                            {session.current && (
                              <span className="ml-2 text-green-400">(Session actuelle)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <button 
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setSessions(sessions.filter(s => s.current));
                    showToast('Toutes les autres sessions ont été révoquées', 'success');
                  }}
                  className="mt-4 text-sm text-red-400 hover:text-red-300"
                >
                  Déconnecter toutes les autres sessions
                </button>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return <PricingPage />;

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Préférences de l'application</h3>
              
              {/* ⚠️ SECTION MODIFIÉE: Langue avec i18n */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Langue de l'interface
                </label>
                <select
                  value={i18n.language} // ⚠️ IMPORTANT: Utiliser i18n.language
                  onChange={(e) => handleLanguageChange(e.target.value)} // ⚠️ IMPORTANT: Utiliser la nouvelle fonction
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
                
                {/* ⚠️ AJOUT: Indicateur visuel de la langue actuelle */}
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">
                    Langue actuelle : <span className="text-white font-medium">
                      {i18n.language === 'fr' && 'Français'}
                      {i18n.language === 'en' && 'English'}
                      {i18n.language === 'es' && 'Español'}
                      {i18n.language === 'de' && 'Deutsch'}
                      {i18n.language === 'it' && 'Italiano'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Thème */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Thème
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setPreferences({...preferences, theme: 'light'});
                      showToast('Thème clair activé', 'success');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.theme === 'light' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="w-full h-20 bg-white rounded mb-2"></div>
                    <p className="text-sm">Clair</p>
                  </button>
                  <button
                    onClick={() => {
                      setPreferences({...preferences, theme: 'dark'});
                      showToast('Thème sombre activé', 'success');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.theme === 'dark' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
                    <p className="text-sm">Sombre</p>
                  </button>
                  <button
                    onClick={() => {
                      setPreferences({...preferences, theme: 'auto'});
                      showToast('Thème automatique activé', 'success');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      preferences.theme === 'auto' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                    <p className="text-sm">Auto</p>
                  </button>
                </div>
              </div>

              {/* Autres préférences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <h4 className="font-medium">Sauvegarde automatique</h4>
                    <p className="text-sm text-gray-400">Enregistrer automatiquement vos modifications</p>
                  </div>
                  <button
                    onClick={() => {
                      setPreferences({...preferences, autoSave: !preferences.autoSave});
                      showToast(preferences.autoSave ? 'Sauvegarde automatique désactivée' : 'Sauvegarde automatique activée', 'success');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700">
                  <div>
                    <h4 className="font-medium">Afficher les tutoriels</h4>
                    <p className="text-sm text-gray-400">Aide contextuelle pour les nouvelles fonctionnalités</p>
                  </div>
                  <button
                    onClick={() => {
                      setPreferences({...preferences, showTutorials: !preferences.showTutorials});
                      showToast(preferences.showTutorials ? 'Tutoriels désactivés' : 'Tutoriels activés', 'success');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.showTutorials ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.showTutorials ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Langue par défaut pour la transcription
                  </label>
                  <select
                    value={preferences.defaultTranscriptionLanguage}
                    onChange={(e) => setPreferences({...preferences, defaultTranscriptionLanguage: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Langue cible par défaut pour la traduction
                  </label>
                  <select
                    value={preferences.defaultTranslationLanguage}
                    onChange={(e) => setPreferences({...preferences, defaultTranslationLanguage: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">Anglais</option>
                    <option value="fr">Français</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Clés API</h3>
                <button
                  onClick={() => setShowCreateApiModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle clé
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-1">Attention</h4>
                    <p className="text-sm text-gray-300">
                      Gardez vos clés API secrètes. Ne les partagez jamais publiquement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className={`p-4 bg-gray-900 rounded-lg ${!key.active && 'opacity-60'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{key.name}</h4>
                      <span className={`px-2 py-1 ${key.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'} text-xs rounded`}>
                        {key.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-800 rounded text-sm font-mono">
                        {key.key}
                      </code>
                      <button 
                        onClick={() => handleCopyApiKey(key.key, key.id)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-2"
                      >
                        {copiedKey === key.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm">Copiée!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copier</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteApiKey(key.id)}
                        className="p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Créée le {key.created} • Dernière utilisation: {key.lastUsed}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhooks */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Webhooks</h3>
              <p className="text-gray-400 mb-4">
                Recevez des notifications en temps réel lorsque des événements se produisent.
              </p>
              <div className="space-y-3 mb-4">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Transcription terminée</h4>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Actif</span>
                  </div>
                  <code className="text-sm text-gray-400">https://api.example.com/webhooks/transcription</code>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Configurer les webhooks
              </button>
            </div>

            {/* Utilisation API */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Utilisation API</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold">15,823</p>
                  <p className="text-sm text-gray-400">Requêtes ce mois</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold">2.3ms</p>
                  <p className="text-sm text-gray-400">Latence moyenne</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-gray-400">Disponibilité</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Limite: 50,000 requêtes/mois</p>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  Voir la documentation API
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-400">Gérez votre compte et vos préférences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'billing' && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <button 
                onClick={() => {
                  showToast('Déconnexion...', 'success');
                  // Logique de déconnexion
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal création de clé API */}
      {showCreateApiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Créer une nouvelle clé API</h3>
              <button
                onClick={() => {
                  setShowCreateApiModal(false);
                  setNewApiKeyName('');
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nom de la clé
              </label>
              <input
                type="text"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                placeholder="Ex: Production Server"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCreateApiKey}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Créer
              </button>
              <button
                onClick={() => {
                  setShowCreateApiModal(false);
                  setNewApiKeyName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-out {
          animation: fade-out 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SettingsPage;