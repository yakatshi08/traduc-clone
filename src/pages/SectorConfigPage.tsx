import React, { useState } from 'react';
import { 
  Briefcase, 
  Heart, 
  Scale, 
  GraduationCap,
  Settings,
  Save,
  Plus,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { aiService } from '../services/aiService';

interface SectorConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  keywords: string[];
  customDictionary: { [lang: string]: string[] };
  aiPrompt: string;
}

const SectorConfigPage: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('medical');
  const [sectorConfigs, setSectorConfigs] = useState<SectorConfig[]>([
    {
      id: 'medical',
      name: 'Médical',
      icon: Heart,
      color: 'red',
      description: 'Optimisé pour la terminologie médicale et les rapports cliniques',
      keywords: ['diagnostic', 'traitement', 'patient', 'symptôme'],
      customDictionary: aiService.getSectorDictionaries().medical,
      aiPrompt: 'Transcription médicale avec terminologie spécialisée'
    },
    {
      id: 'legal',
      name: 'Juridique',
      icon: Scale,
      color: 'indigo',
      description: 'Adapté aux documents juridiques et procédures légales',
      keywords: ['jurisprudence', 'plaidoirie', 'tribunal', 'article'],
      customDictionary: aiService.getSectorDictionaries().legal,
      aiPrompt: 'Transcription juridique avec précision des termes légaux'
    },
    {
      id: 'education',
      name: 'Éducation',
      icon: GraduationCap,
      color: 'emerald',
      description: 'Parfait pour les cours, conférences et contenus éducatifs',
      keywords: ['cours', 'étudiant', 'exercice', 'évaluation'],
      customDictionary: aiService.getSectorDictionaries().education,
      aiPrompt: 'Transcription éducative avec structure pédagogique'
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      color: 'violet',
      description: 'Idéal pour réunions, présentations et rapports d\'entreprise',
      keywords: ['stratégie', 'objectif', 'revenue', 'KPI'],
      customDictionary: aiService.getSectorDictionaries().business,
      aiPrompt: 'Transcription business avec focus sur les points clés'
    }
  ]);

  const [newTerm, setNewTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const currentConfig = sectorConfigs.find(s => s.id === selectedSector);

  const handleAddTerm = () => {
    if (newTerm && currentConfig) {
      const updatedConfigs = sectorConfigs.map(config => {
        if (config.id === selectedSector) {
          const dict = { ...config.customDictionary };
          if (!dict[selectedLanguage]) {
            dict[selectedLanguage] = [];
          }
          dict[selectedLanguage].push(newTerm);
          return { ...config, customDictionary: dict };
        }
        return config;
      });
      setSectorConfigs(updatedConfigs);
      setNewTerm('');
    }
  };

  const handleRemoveTerm = (term: string) => {
    if (currentConfig) {
      const updatedConfigs = sectorConfigs.map(config => {
        if (config.id === selectedSector) {
          const dict = { ...config.customDictionary };
          dict[selectedLanguage] = dict[selectedLanguage].filter(t => t !== term);
          return { ...config, customDictionary: dict };
        }
        return config;
      });
      setSectorConfigs(updatedConfigs);
    }
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage ou envoyer au backend
    localStorage.setItem('sectorConfigs', JSON.stringify(sectorConfigs));
    alert('Configuration sauvegardée !');
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600',
      indigo: 'bg-traduc-indigo/10 text-traduc-indigo',
      emerald: 'bg-traduc-emerald/10 text-traduc-emerald',
      violet: 'bg-traduc-violet/10 text-traduc-violet'
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-traduc-beige-900 dark:text-white mb-2">
          Configuration Sectorielle
        </h1>
        <p className="text-traduc-beige-600 dark:text-gray-400">
          Personnalisez les modèles IA et dictionnaires pour chaque secteur
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste des secteurs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg border border-traduc-beige-300 dark:border-gray-700">
            <div className="p-4 border-b border-traduc-beige-300 dark:border-gray-700">
              <h3 className="font-semibold text-traduc-beige-900 dark:text-white">
                Secteurs
              </h3>
            </div>
            
            <div className="p-2">
              {sectorConfigs.map((sector) => {
                const Icon = sector.icon;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedSector === sector.id
                        ? 'bg-traduc-indigo/10 text-traduc-indigo'
                        : 'hover:bg-traduc-beige-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(sector.color)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-left font-medium">
                      {sector.name}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Configuration du secteur */}
        {currentConfig && (
          <div className="lg:col-span-3 space-y-6">
            {/* Informations générales */}
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(currentConfig.color)}`}>
                  <currentConfig.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-traduc-beige-900 dark:text-white">
                    {currentConfig.name}
                  </h2>
                  <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    {currentConfig.description}
                  </p>
                </div>
              </div>

              {/* Prompt IA */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                  Prompt IA personnalisé
                </label>
                <textarea
                  value={currentConfig.aiPrompt}
                  onChange={(e) => {
                    const updatedConfigs = sectorConfigs.map(config =>
                      config.id === selectedSector
                        ? { ...config, aiPrompt: e.target.value }
                        : config
                    );
                    setSectorConfigs(updatedConfigs);
                  }}
                  className="w-full px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Mots-clés */}
              <div>
                <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                  Mots-clés prioritaires
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentConfig.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-traduc-beige-100 dark:bg-gray-700 text-traduc-beige-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dictionnaire personnalisé */}
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
                Dictionnaire personnalisé
              </h3>

              {/* Sélecteur de langue */}
              <div className="flex items-center gap-4 mb-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="it">Italiano</option>
                  <option value="de">Deutsch</option>
                </select>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Ajouter un terme..."
                    className="flex-1 px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTerm()}
                  />
                  <button
                    onClick={handleAddTerm}
                    className="px-4 py-2 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Liste des termes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {currentConfig.customDictionary[selectedLanguage]?.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-traduc-beige-50 dark:bg-gray-900 rounded-lg group"
                  >
                    <span className="text-sm text-traduc-beige-700 dark:text-gray-300">
                      {term}
                    </span>
                    <button
                      onClick={() => handleRemoveTerm(term)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates de documents */}
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
                Templates de documents
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-traduc-beige-200 dark:border-gray-700 rounded-lg hover:border-traduc-indigo cursor-pointer">
                  <h4 className="font-medium text-traduc-beige-900 dark:text-white mb-2">
                    Rapport standard
                  </h4>
                  <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    Format type pour les rapports {currentConfig.name.toLowerCase()}s
                  </p>
                </div>
                
                <div className="p-4 border border-traduc-beige-200 dark:border-gray-700 rounded-lg hover:border-traduc-indigo cursor-pointer">
                  <h4 className="font-medium text-traduc-beige-900 dark:text-white mb-2">
                    Synthèse
                  </h4>
                  <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    Modèle de synthèse adapté au secteur
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-traduc-emerald hover:bg-traduc-emerald/90 text-white rounded-lg"
              >
                <Save className="w-5 h-5" />
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorConfigPage;