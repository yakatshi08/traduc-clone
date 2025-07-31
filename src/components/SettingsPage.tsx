import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Palette,
  Lock,
  Bell,
  CreditCard,
  Key,
  Shield,
  Trash2,
  Save,
  Camera,
  Sun,
  Moon,
  Monitor,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Activity,
  Calendar,
  Volume2,
  Video,
  ToggleLeft,
  ToggleRight,
  Download
} from 'lucide-react';

type TabType = 'profile' | 'account' | 'preferences' | 'billing' | 'api' | 'security' | 'notifications';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@traduckxion.com',
    phone: '+33 6 12 34 56 78',
    company: 'TraduckXion SAS',
    role: 'Pro Plan',
    bio: 'Passionné par l\'IA et la transcription automatique.'
  });

  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    transcriptionComplete: true,
    translationComplete: true
  });

  const [preferences, setPreferences] = useState({
    language: i18n.language,
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    audioQuality: 'high',
    videoQuality: '1080p',
    autoSave: true,
    autoTranscribe: false
  });

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setPreferences({ ...preferences, language: lang });
  };

  const tabs = [
    { id: 'profile' as TabType, label: t('profile'), icon: User },
    { id: 'account' as TabType, label: t('account'), icon: Building },
    { id: 'preferences' as TabType, label: t('preferences'), icon: Globe },
    { id: 'billing' as TabType, label: t('billing'), icon: CreditCard },
    { id: 'api' as TabType, label: t('api'), icon: Key },
    { id: 'security' as TabType, label: t('security'), icon: Shield },
    { id: 'notifications' as TabType, label: t('notifications'), icon: Bell }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400">{t('subtitle')}</p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-400">{t('success')}</span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-800 rounded-lg p-4">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                style={{ 
                  backgroundColor: activeTab === tab.id ? '#6366f1' : undefined 
                }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('profile')}</h2>
              
              {/* Avatar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('avatar')}</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                  <button 
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {t('changeAvatar')}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('name')}</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('email')}</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('phone')}</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('company')}</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('bio')}</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  style={{ backgroundColor: '#6366f1' }}
                >
                  <Save className="w-4 h-4" />
                  {t('saveChanges')}
                </button>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('account')}</h2>
              
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">{t('currentPlan')}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">Pro Plan</p>
                    <p className="text-gray-400">29€ / mois</p>
                  </div>
                  <button 
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    style={{ backgroundColor: '#8b5cf6' }}
                  >
                    {t('upgradePlan')}
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">{t('usage')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">{t('minutesUsed')}</span>
                      <span className="text-white font-medium">235 / 500 min</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: '47%', backgroundColor: '#6366f1' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">{t('storageUsed')}</span>
                      <span className="text-white font-medium">8.2 GB / 50 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: '16.4%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('preferences')}</h2>
              
              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('language')}</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('theme')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'light' 
                          ? 'border-indigo-500 bg-gray-700' 
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">{t('lightTheme')}</span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'dark' 
                          ? 'border-indigo-500 bg-gray-700' 
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">{t('darkTheme')}</span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === 'system' 
                          ? 'border-indigo-500 bg-gray-700' 
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <Monitor className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">{t('systemTheme')}</span>
                    </button>
                  </div>
                </div>

                {/* Other Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('timezone')}</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('dateFormat')}</label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('audioQuality')}</label>
                    <select
                      value={preferences.audioQuality}
                      onChange={(e) => setPreferences({ ...preferences, audioQuality: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="low">128 kbps</option>
                      <option value="medium">192 kbps</option>
                      <option value="high">320 kbps</option>
                      <option value="lossless">FLAC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('videoQuality')}</label>
                    <select
                      value={preferences.videoQuality}
                      onChange={(e) => setPreferences({ ...preferences, videoQuality: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4k">4K</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('autoSave')}</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, autoSave: !preferences.autoSave })}
                      className="text-gray-400 hover:text-white"
                    >
                      {preferences.autoSave ? (
                        <ToggleRight className="w-8 h-8 text-indigo-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t('autoTranscribe')}</span>
                    <button
                      onClick={() => setPreferences({ ...preferences, autoTranscribe: !preferences.autoTranscribe })}
                      className="text-gray-400 hover:text-white"
                    >
                      {preferences.autoTranscribe ? (
                        <ToggleRight className="w-8 h-8 text-indigo-500" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  style={{ backgroundColor: '#6366f1' }}
                >
                  <Save className="w-4 h-4" />
                  {t('saveChanges')}
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('billing')}</h2>
              
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Méthode de paiement</h3>
                <div className="flex items-center gap-4">
                  <CreditCard className="w-12 h-8 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-white">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-400">Expire 12/2025</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                    Modifier
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Historique de facturation</h3>
                <div className="space-y-3">
                  {[
                    { date: '01/12/2024', amount: '29€', status: 'Payé' },
                    { date: '01/11/2024', amount: '29€', status: 'Payé' },
                    { date: '01/10/2024', amount: '29€', status: 'Payé' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-white">{invoice.date}</p>
                        <p className="text-sm text-gray-400">Pro Plan - Mensuel</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">{invoice.amount}</span>
                        <span className="px-3 py-1 bg-emerald-900/20 text-emerald-400 rounded-full text-sm">
                          {invoice.status}
                        </span>
                        <button className="text-gray-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('api')}</h2>
              
              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">{t('apiKey')}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm text-gray-400">
                    sk_live_••••••••••••••••••••••••••••••••
                  </div>
                  <button 
                    className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                    title={t('copyKey')}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                    title={t('generateNewKey')}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    title={t('deleteKey')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Utilisation API</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">12,543</p>
                    <p className="text-sm text-gray-400">Appels ce mois</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">235</p>
                    <p className="text-sm text-gray-400">Minutes transcrites</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">99.8%</p>
                    <p className="text-sm text-gray-400">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('security')}</h2>
              
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">{t('changePassword')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('currentPassword')}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('newPassword')}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('confirmPassword')}</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      style={{ backgroundColor: '#6366f1' }}
                    >
                      {t('changePassword')}
                    </button>
                  </div>
                </div>

                {/* Two Factor */}
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">{t('twoFactorAuth')}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Ajoutez une couche de sécurité supplémentaire à votre compte
                      </p>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className="text-gray-400 hover:text-white"
                    >
                      {twoFactorEnabled ? (
                        <ToggleRight className="w-10 h-10 text-indigo-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-red-400 mb-2">{t('deleteAccount')}</h3>
                  <p className="text-sm text-gray-400 mb-4">{t('deleteAccountWarning')}</p>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    {t('deleteAccount')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">{t('notifications')}</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">{t('emailNotifications')}</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-300">{t(key)}</span>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className="text-gray-400 hover:text-white"
                        >
                          {value ? (
                            <ToggleRight className="w-8 h-8 text-indigo-500" />
                          ) : (
                            <ToggleLeft className="w-8 h-8" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    style={{ backgroundColor: '#6366f1' }}
                  >
                    <Save className="w-4 h-4" />
                    {t('saveChanges')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;