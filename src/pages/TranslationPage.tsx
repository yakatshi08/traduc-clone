import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Save, 
  Play, 
  Plus, 
  ChevronDown,
  Copy,
  Download,
  RotateCcw,
  Settings,
  BookOpen,
  Database,
  Brain,
  Zap,
  Target,
  Clock,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Volume2,
  Lightbulb,
  Shield,
  Globe,
  Cpu,
  BarChart3,
  FileText,
  MessageSquare,
  Layers,
  Filter,
  Search,
  History
} from 'lucide-react';

const TranslationPage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('FR');
  const [targetLang, setTargetLang] = useState('EN');
  const [selectedSector, setSelectedSector] = useState('Business');
  const [selectedModel, setSelectedModel] = useState('TraducXion AI Pro');
  const [activeSection, setActiveSection] = useState('glossaire');
  const [isTranslating, setIsTranslating] = useState(false);
  const [confidence, setConfidence] = useState(96);
  const [translationTime, setTranslationTime] = useState(0);
  const [realTimeStats, setRealTimeStats] = useState({
    wer: 3.2,
    bleu: 94.7,
    latency: 180,
    tokensPerSec: 245
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const languages = [
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const sectors = [
    { id: 'business', name: 'Business', color: 'bg-blue-500', expertise: 98 },
    { id: 'medical', name: 'Médical', color: 'bg-red-500', expertise: 95 },
    { id: 'legal', name: 'Juridique', color: 'bg-purple-500', expertise: 92 },
    { id: 'education', name: 'Éducation', color: 'bg-green-500', expertise: 89 },
    { id: 'technical', name: 'Technique', color: 'bg-orange-500', expertise: 94 }
  ];

  const models = [
    { id: 'tradux-pro', name: 'TraducXion AI Pro', speed: 'Ultra', quality: 98, cost: 'Premium' },
    { id: 'tradux-fast', name: 'TraducXion Fast', speed: 'Rapide', quality: 92, cost: 'Standard' },
    { id: 'openai-gpt4', name: 'OpenAI GPT-4', speed: 'Modéré', quality: 95, cost: 'Élevé' },
    { id: 'deepl-pro', name: 'DeepL Pro', speed: 'Rapide', quality: 94, cost: 'Moyen' }
  ];

  const recentProjects = [
    {
      name: 'Documentation API Enterprise',
      langs: 'FR → EN',
      progress: 87,
      words: 12547,
      status: 'translating',
      priority: 'high',
      deadline: '2j',
      team: ['Alice M.', 'Bob L.'],
      lastEdit: '5 min',
      confidence: 94
    },
    {
      name: 'Contrats Partenariat EU',
      langs: 'EN → FR', 
      progress: 100,
      words: 8934,
      status: 'completed',
      priority: 'urgent',
      deadline: 'Terminé',
      team: ['Claire D.'],
      lastEdit: '1h',
      confidence: 98
    },
    {
      name: 'Manuel Utilisateur v3.2',
      langs: 'DE → FR',
      progress: 45,
      words: 15672,
      status: 'review',
      priority: 'medium',
      deadline: '1 sem',
      team: ['David K.', 'Emma S.'],
      lastEdit: '2h',
      confidence: 91
    },
    {
      name: 'Présentation Investors Q4',
      langs: 'FR → EN',
      progress: 23,
      words: 3421,
      status: 'draft',
      priority: 'high',
      deadline: '3j',
      team: ['Frank R.'],
      lastEdit: '30 min',
      confidence: 89
    }
  ];

  const glossaryTerms = [
    { source: 'API REST', target: 'REST API', confidence: 99, usage: 847, sector: 'Tech' },
    { source: 'Intelligence Artificielle', target: 'Artificial Intelligence', confidence: 98, usage: 1203, sector: 'Tech' },
    { source: 'Apprentissage automatique', target: 'Machine Learning', confidence: 97, usage: 592, sector: 'Tech' },
    { source: 'Modèle de langage', target: 'Language Model', confidence: 96, usage: 356, sector: 'Tech' },
    { source: 'Traitement du langage naturel', target: 'Natural Language Processing', confidence: 99, usage: 428, sector: 'Tech' }
  ];

  const translationMemory = [
    { source: 'L\'API permet d\'intégrer facilement...', target: 'The API allows easy integration...', match: 95, lastUsed: '2j' },
    { source: 'Cette fonctionnalité améliore les performances...', target: 'This feature improves performance...', match: 89, lastUsed: '5j' },
    { source: 'Pour configurer le système...', target: 'To configure the system...', match: 92, lastUsed: '1 sem' }
  ];

  const aiInsights = [
    { type: 'warning', message: 'Terme technique détecté sans équivalent dans le glossaire', confidence: 85 },
    { type: 'success', message: 'Cohérence terminologique excellente', confidence: 96 },
    { type: 'info', message: 'Style adapté au secteur Business détecté', confidence: 92 },
    { type: 'suggestion', message: 'Suggestion: Utiliser "implement" plutôt que "execute"', confidence: 88 }
  ];

  // Simulation temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        wer: prev.wer + (Math.random() - 0.5) * 0.1,
        bleu: prev.bleu + (Math.random() - 0.5) * 0.2,
        latency: prev.latency + (Math.random() - 0.5) * 10,
        tokensPerSec: prev.tokensPerSec + (Math.random() - 0.5) * 20
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const handleTranslate = async () => {
    // Vérification du texte source
    if (!sourceText.trim()) {
      alert('⚠️ Veuillez saisir un texte à traduire dans la zone source');
      return;
    }
    
    setIsTranslating(true);
    setTranslationTime(0);
    
    const timer = setInterval(() => {
      setTranslationTime(prev => prev + 0.1);
    }, 100);

    // Simulation traduction avancée
    setTimeout(() => {
      const translatedText = `[${selectedModel}] Traduction professionnelle ${sourceLang} → ${targetLang}:\n\n${sourceText}\n\n--- Traitement IA Avancé Terminé ---\n\nSecteur détecté: ${selectedSector}\nConfiance: ${confidence}%\nTemps de traitement: ${translationTime.toFixed(1)}s`;
      
      setTargetText(translatedText);
      setConfidence(Math.floor(Math.random() * 10) + 90);
      setIsTranslating(false);
      clearInterval(timer);
      
      // Notification de succès
      alert(`✅ Traduction terminée avec ${confidence}% de confiance !`);
    }, 2500);
  };

  // Fonctions d'action pour les boutons
  const handleSave = () => {
    if (sourceText || targetText) {
      alert('✅ Projet sauvegardé avec succès !');
      console.log('Sauvegarde:', { sourceText, targetText, sourceLang, targetLang });
    } else {
      alert('⚠️ Aucun contenu à sauvegarder');
    }
  };

  const handleNewProject = () => {
    setShowNewProjectModal(true);
  };

  const handleCreateProject = () => {
    const projectName = prompt('Nom du nouveau projet:');
    if (projectName) {
      alert(`✅ Projet "${projectName}" créé avec succès !`);
      setShowNewProjectModal(false);
      // Ici vous pourriez ajouter le projet à la liste
    }
  };

  const handleOpenProject = (project: any) => {
    setSelectedProject(project);
    setSourceText(`Contenu du projet: ${project.name}`);
    setTargetText('');
    alert(`📁 Projet "${project.name}" ouvert`);
  };

  const handleCopySource = () => {
    if (sourceText) {
      navigator.clipboard.writeText(sourceText);
      alert('📋 Texte source copié !');
    }
  };

  const handleCopyTarget = () => {
    if (targetText) {
      navigator.clipboard.writeText(targetText);
      alert('📋 Traduction copiée !');
    }
  };

  const handleResetSource = () => {
    if (confirm('⚠️ Effacer le texte source ?')) {
      setSourceText('');
    }
  };

  const handleDownloadTranslation = () => {
    if (targetText) {
      const blob = new Blob([targetText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traduction_${sourceLang}_${targetLang}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      alert('📥 Traduction téléchargée !');
    } else {
      alert('⚠️ Aucune traduction à télécharger');
    }
  };

  const handlePlayAudio = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'FR' ? 'fr-FR' : lang === 'EN' ? 'en-US' : 'en-US';
      speechSynthesis.speak(utterance);
      alert(`🔊 Lecture audio en ${lang}`);
    } else {
      alert('❌ Synthèse vocale non supportée');
    }
  };

  const handleAddTerm = () => {
    setShowAddTermModal(true);
  };

  const handleCreateTerm = () => {
    const sourceTerme = prompt('Terme source:');
    const targetTerme = prompt('Terme cible:');
    if (sourceTerme && targetTerme) {
      alert(`✅ Terme ajouté: "${sourceTerme}" → "${targetTerme}"`);
      setShowAddTermModal(false);
      // Ici vous pourriez ajouter le terme au glossaire
    }
  };

  const handleImportGlossary = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.txt,.json';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`📂 Import de "${file.name}" en cours...`);
        // Ici vous pourriez traiter le fichier
      }
    };
    fileInput.click();
  };

  const handleFilter = () => {
    const filter = prompt('Filtrer par secteur:', 'Tech');
    if (filter) {
      alert(`🔍 Filtre appliqué: ${filter}`);
    }
  };

  const handleSearch = () => {
    const query = prompt('Rechercher dans les projets:');
    if (query) {
      alert(`🔍 Recherche: "${query}"`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-emerald-400 bg-emerald-900/20';
      case 'translating': return 'text-blue-400 bg-blue-900/20';
      case 'review': return 'text-yellow-400 bg-yellow-900/20';
      case 'draft': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header Professionnel Compact */}
      <div className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-800/80">
        {/* Ligne 1 - Titre et métriques temps réel */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Traduction Multilingue IA</h1>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {selectedModel.split(' ')[0]}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {confidence}%
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {translationTime.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>
          
          {/* Métriques Temps Réel Compactes */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-slate-700">
            <div className="text-center">
              <div className="text-xs text-slate-400">WER</div>
              <div className="text-sm font-medium text-emerald-400">{realTimeStats.wer.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">BLEU</div>
              <div className="text-sm font-medium text-blue-400">{realTimeStats.bleu.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Latence</div>
              <div className="text-sm font-medium text-yellow-400">{Math.round(realTimeStats.latency)}ms</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Tokens/s</div>
              <div className="text-sm font-medium text-purple-400">{Math.round(realTimeStats.tokensPerSec)}</div>
            </div>
          </div>
        </div>

        {/* Ligne 2 - Contrôles et actions */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            {/* Sélecteurs de langues compacts */}
            <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-1.5 border border-slate-700">
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.code}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={swapLanguages}
                className="p-1.5 hover:bg-slate-700 rounded transition-all duration-200"
              >
                <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              </button>
              
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteurs compacts */}
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {sectors.map(sector => (
                <option key={sector.id} value={sector.name}>
                  🎯 {sector.name} ({sector.expertise}%)
                </option>
              ))}
            </select>

            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-48"
            >
              {models.map(model => (
                <option key={model.id} value={model.name}>
                  ⚡ {model.name} (Q:{model.quality}%)
                </option>
              ))}
            </select>
          </div>

          {/* Actions visibles */}
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded text-sm transition-all duration-200 font-medium disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Traduction...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Traduire Pro
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Layout Principal Avancé */}
      <div className="flex h-[calc(100vh-160px)]">
        {/* Colonne gauche - Projets et Outils Avancés */}
        <div className="w-96 border-r border-slate-700 bg-slate-800/20">
          {/* Header Projets */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                Projets Enterprise
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={handleFilter}
                  className="p-1.5 hover:bg-slate-700 rounded"
                >
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={handleSearch}
                  className="p-1.5 hover:bg-slate-700 rounded"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleNewProject}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg transition-all duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouveau Projet Pro
            </button>
          </div>

          {/* Liste Projets Avancée */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
            {recentProjects.map((project, index) => (
              <div 
                key={index} 
                onClick={() => handleOpenProject(project)}
                className="group p-4 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white truncate mb-1">{project.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {project.langs}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {project.words.toLocaleString()} mots
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}></div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                      {project.status === 'completed' ? 'Terminé' : 
                       project.status === 'translating' ? 'En cours' :
                       project.status === 'review' ? 'Révision' : 'Brouillon'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {project.team.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <History className="w-3 h-3" />
                      {project.lastEdit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span className="text-emerald-400">{project.confidence}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Progression</span>
                    <span className="text-xs font-medium text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex -space-x-1">
                    {project.team.map((member, i) => (
                      <div key={i} className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-slate-700 rounded">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded">
                      <MessageSquare className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonnes centrales - Zones de traduction professionnelles */}
        <div className="flex-1 flex">
          {/* Zone source avancée */}
          <div className="flex-1 p-4 border-r border-slate-700">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    {languages.find(l => l.code === sourceLang)?.flag} {languages.find(l => l.code === sourceLang)?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      Détection auto
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Analyse contexte
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handlePlayAudio(sourceText, sourceLang)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={handleCopySource}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={handleResetSource}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Saisissez votre texte professionnel ici... L'IA TraduckXion analysera automatiquement le contexte, le secteur d'activité et optimisera la traduction en fonction de votre domaine d'expertise."
                className="flex-1 w-full bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              
              <div className="flex items-center justify-between mt-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {sourceText.length} caractères
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {sourceText.split(/\s+/).filter(w => w.length > 0).length} mots
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Complexité: {sourceText.length > 500 ? 'Élevée' : sourceText.length > 200 ? 'Moyenne' : 'Simple'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400">IA Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zone cible avancée */}
          <div className="flex-1 p-4">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    {languages.find(l => l.code === targetLang)?.flag} {languages.find(l => l.code === targetLang)?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>Confiance: {confidence}%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handlePlayAudio(targetText, targetLang)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={handleCopyTarget}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={handleDownloadTranslation}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="relative flex-1">
                <textarea
                  value={targetText}
                  onChange={(e) => setTargetText(e.target.value)}
                  placeholder="La traduction professionnelle apparaîtra ici avec analyse contextuelle, terminologie spécialisée et suggestions d'amélioration..."
                  className="w-full h-full bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {isTranslating && (
                  <div className="absolute inset-0 bg-slate-800/80 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-sm text-indigo-400 font-medium">Traduction en cours...</p>
                      <p className="text-xs text-slate-400 mt-1">Analyse contextuelle • Optimisation terminologique</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {targetText.length} caractères
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {targetText.split(/\s+/).filter(w => w.length > 0).length} mots
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Qualité: Premium
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400">{translationTime.toFixed(1)}s</span>
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections avancées du bas */}
      <div className="border-t border-slate-700 bg-gradient-to-r from-slate-800/40 to-slate-800/20">
        {/* Onglets professionnels */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'glossaire', label: 'Glossaire Intelligent', icon: BookOpen, count: glossaryTerms.length },
            { id: 'memoire', label: 'Mémoire de Traduction', icon: Database, count: translationMemory.length },
            { id: 'analyse', label: 'Analyse IA Avancée', icon: Brain, count: aiInsights.length }
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeSection === id
                  ? 'border-indigo-500 text-indigo-400 bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{count}</span>
            </button>
          ))}
        </div>

        {/* Contenu des onglets avancés */}
        <div className="h-56 p-6">
          {activeSection === 'glossaire' && (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">Terminologie Spécialisée</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddTerm}
                    className="px-3 py-1 bg-violet-600 hover:bg-violet-700 rounded text-xs transition-colors"
                  >
                    + Ajouter terme
                  </button>
                  <button 
                    onClick={handleImportGlossary}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
                  >
                    Importer
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-44">
                {glossaryTerms.map((term, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white">{term.source}</span>
                        <ArrowLeftRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300">{term.target}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {term.confidence}% confiance
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {term.usage} utilisations
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          term.sector === 'Tech' ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-900/20 text-gray-400'
                        }`}>
                          {term.sector}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-slate-700 rounded">
                        <Settings className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'memoire' && (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">Réutilisation Intelligente</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Correspondances automatiques activées</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-44">
                {translationMemory.map((memory, index) => (
                  <div key={index} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-slate-300 line-clamp-1">{memory.source}</p>
                        <p className="text-sm text-slate-400 line-clamp-1">{memory.target}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          memory.match >= 95 ? 'bg-emerald-900/20 text-emerald-400' :
                          memory.match >= 90 ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-red-900/20 text-red-400'
                        }`}>
                          {memory.match}% match
                        </span>
                        <span className="text-xs text-slate-500">{memory.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'analyse' && (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">Intelligence Artificielle Avancée</h4>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Lightbulb className="w-3 h-3" />
                  <span>Analyse temps réel activée</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 h-44">
                <div className="space-y-3 overflow-y-auto">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      insight.type === 'warning' ? 'bg-yellow-900/10 border-yellow-800 text-yellow-400' :
                      insight.type === 'success' ? 'bg-emerald-900/10 border-emerald-800 text-emerald-400' :
                      insight.type === 'info' ? 'bg-blue-900/10 border-blue-800 text-blue-400' :
                      'bg-purple-900/10 border-purple-800 text-purple-400'
                    }`}>
                      <div className="flex items-start gap-2">
                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {insight.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {insight.type === 'info' && <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {insight.type === 'suggestion' && <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-xs leading-relaxed">{insight.message}</p>
                          <div className="text-xs opacity-75 mt-1">Confiance: {insight.confidence}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Score Global</div>
                    <div className="text-2xl font-bold text-emerald-400">{confidence}%</div>
                    <div className="text-xs text-emerald-400">Excellence</div>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Complexité</div>
                    <div className="text-2xl font-bold text-yellow-400">7.2</div>
                    <div className="text-xs text-yellow-400">Modérée</div>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Secteur</div>
                    <div className="text-lg font-bold text-blue-400">Tech</div>
                    <div className="text-xs text-blue-400">Détecté</div>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Optimisation</div>
                    <div className="text-lg font-bold text-purple-400">Auto</div>
                    <div className="text-xs text-purple-400">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouveau Projet */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Créer un Nouveau Projet</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nom du projet"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
              <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                <option>Business</option>
                <option>Médical</option>
                <option>Juridique</option>
                <option>Technique</option>
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={handleCreateProject}
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white transition-colors"
                >
                  Créer
                </button>
                <button 
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Terme */}
      {showAddTermModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Ajouter un Terme</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Terme source (français)"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
              <input 
                type="text" 
                placeholder="Terme cible (anglais)"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
              <select className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                <option>Tech</option>
                <option>Business</option>
                <option>Médical</option>
                <option>Juridique</option>
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={handleCreateTerm}
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white transition-colors"
                >
                  Ajouter
                </button>
                <button 
                  onClick={() => setShowAddTermModal(false)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationPage;