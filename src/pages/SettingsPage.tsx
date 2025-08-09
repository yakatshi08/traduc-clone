import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import PricingPage from './PricingPage';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing' | 'preferences' | 'api';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@traducxion.com',
    phone: '+33 6 12 34 56 78',
    company: 'TraducXion Pro',
    role: 'Administrateur',
    bio: 'Professionnel de la traduction et transcription depuis 5 ans.'
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
    language: 'fr',
    theme: 'dark',
    autoSave: true,
    defaultTranscriptionLanguage: 'fr',
    defaultTranslationLanguage: 'en',
    showTutorials: true
  });

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profil', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'security' as SettingsTab, label: 'Sécurité', icon: Shield },
    { id: 'billing' as SettingsTab, label: 'Facturation & Plans', icon: CreditCard },
    { id: 'preferences' as SettingsTab, label: 'Préférences', icon: Palette },
    { id: 'api' as SettingsTab, label: 'API & Intégrations', icon: Key }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Informations personnelles</h3>
              
              {/* Photo de profil */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">JD</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <h4 className="font-medium mb-1">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-sm text-gray-400">{profileData.role} • {profileData.company}</p>
                  <button className="mt-2 text-sm text-blue-400 hover:text-blue-300">
                    Changer la photo
                  </button>
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
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Rôle
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  Annuler
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
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
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Supprimer mon compte</h4>
                    <p className="text-sm text-gray-400">Cette action est irréversible</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg transition-colors flex items-center gap-2">
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
                      onClick={() => setNotifications({...notifications, [key]: !value})}
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
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
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
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
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Chrome sur Windows</p>
                        <p className="text-sm text-gray-400">Paris, France • Actuelle</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">Application mobile iOS</p>
                        <p className="text-sm text-gray-400">Lyon, France • Il y a 2 jours</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-400 hover:text-red-300">
                      Révoquer
                    </button>
                  </div>
                </div>
                <button className="mt-4 text-sm text-red-400 hover:text-red-300">
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
              
              {/* Langue */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Langue de l'interface
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                </select>
              </div>

              {/* Thème */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Thème
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPreferences({...preferences, theme: 'light'})}
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
                    onClick={() => setPreferences({...preferences, theme: 'dark'})}
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
                    onClick={() => setPreferences({...preferences, theme: 'auto'})}
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
                    onClick={() => setPreferences({...preferences, autoSave: !preferences.autoSave})}
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
                    onClick={() => setPreferences({...preferences, showTutorials: !preferences.showTutorials})}
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
              <h3 className="text-lg font-semibold mb-6">Clés API</h3>
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
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Clé de production</h4>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-800 rounded text-sm font-mono">
                      sk_live_••••••••••••••••••••••••hJ8k
                    </code>
                    <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Créée le 1 janvier 2025 • Dernière utilisation il y a 2 heures
                  </p>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Clé de test</h4>
                    <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded">Inactive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-800 rounded text-sm font-mono">
                      sk_test_••••••••••••••••••••••••nM2p
                    </code>
                    <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Créée le 15 décembre 2024 • Jamais utilisée
                  </p>
                </div>
              </div>

              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Générer une nouvelle clé
              </button>
            </div>

            {/* Webhooks */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-6">Webhooks</h3>
              <p className="text-gray-400 mb-4">
                Recevez des notifications en temps réel lorsque des événements se produisent.
              </p>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Configurer les webhooks
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all">
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
  );
};

export default SettingsPage;