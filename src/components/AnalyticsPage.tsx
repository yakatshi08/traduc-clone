// src/pages/AnalyticsPage.tsx

import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  FileText, 
  Users,
  Activity,
  Download,
  Calendar,
  BarChart3,
  Filter,
  RefreshCw,
  FileJson,
  FileSpreadsheet,
  X,
  ChevronDown,
  Loader2
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  // États pour la toolbar
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Refs pour fermer les menus au clic extérieur
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    view: 'Vue',
    period: '30j',
    language: 'Toutes',
    type: 'Tous'
  });

  const [tempFilters, setTempFilters] = useState({
    period: '30j',
    language: 'Toutes',
    type: 'Tous'
  });

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPanel(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculer le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (filters.period !== '30j') count++;
    if (filters.language !== 'Toutes') count++;
    if (filters.type !== 'Tous') count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Données fictives pour l'export
  const analyticsData = [
    { projet: 'Projet Example 1', type: 'Transcription', duree: '45 min', date: '15/12/2024', statut: 'Terminé' },
    { projet: 'Projet Example 2', type: 'Traduction', duree: '30 min', date: '14/12/2024', statut: 'En cours' },
    { projet: 'Projet Example 3', type: 'Transcription', duree: '60 min', date: '13/12/2024', statut: 'Terminé' },
    { projet: 'Projet Example 4', type: 'Audio', duree: '25 min', date: '12/12/2024', statut: 'Terminé' },
    { projet: 'Projet Example 5', type: 'Vidéo', duree: '90 min', date: '11/12/2024', statut: 'En attente' },
  ];

  // Fonction pour afficher un toast (simulé avec alert pour l'instant)
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Créer un élément toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // FONCTIONS D'EXPORT FONCTIONNELLES
  const exportToJSON = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const exportData = {
          exportDate: new Date().toISOString(),
          filters: filters,
          statistics: {
            totalTranscriptions: 1248,
            hoursProcessed: 324,
            documentsTranslated: 892,
            activeUsers: 145
          },
          data: analyticsData
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Export JSON réussi ✓', 'success');
      } catch (error) {
        showToast('Erreur lors de l\'export JSON', 'error');
      } finally {
        setIsExporting(false);
        setShowExportMenu(false);
      }
    }, 500);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        // Ouvrir la boîte de dialogue d'impression
        window.print();
        showToast('Export PDF lancé ✓', 'success');
      } catch (error) {
        showToast('Erreur lors de l\'export PDF', 'error');
      } finally {
        setIsExporting(false);
        setShowExportMenu(false);
      }
    }, 500);
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        // Créer un CSV
        const headers = ['Projet', 'Type', 'Durée', 'Date', 'Statut'];
        const rows = analyticsData.map(row => [
          row.projet,
          row.type,
          row.duree,
          row.date,
          row.statut
        ]);
        
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
          csvContent += row.join(',') + '\n';
        });
        
        const blob = new Blob([csvContent], { 
          type: 'text/csv;charset=utf-8;' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Export Excel réussi ✓', 'success');
      } catch (error) {
        showToast('Erreur lors de l\'export Excel', 'error');
      } finally {
        setIsExporting(false);
        setShowExportMenu(false);
      }
    }, 500);
  };

  // FONCTIONS POUR LES FILTRES
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Données actualisées ✓', 'success');
    }, 1000);
  };

  const handleApplyFilters = () => {
    // Appliquer les filtres temporaires aux filtres principaux
    setFilters({
      ...filters,
      period: tempFilters.period,
      language: tempFilters.language,
      type: tempFilters.type
    });
    
    setShowFilterPanel(false);
    showToast('Filtres appliqués ✓', 'success');
    
    // Ici vous pouvez ajouter la logique pour filtrer réellement les données
    console.log('Filtres appliqués:', tempFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      period: '30j',
      language: 'Toutes',
      type: 'Tous'
    };
    
    setTempFilters(defaultFilters);
    setFilters({
      ...filters,
      ...defaultFilters
    });
    
    showToast('Filtres réinitialisés ✓', 'success');
  };

  return (
    <div className="p-6">
      {/* Header avec Toolbar */}
      <div className="mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics Dashboard - TraduckXion V2.7</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>⚡ Intelligence artificielle</span>
                  <span>📄 Transcription multimodale</span>
                  <span>👥 2,847 utilisateurs actifs</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-400">WER</span>
                <span className="text-white font-bold ml-2">3.2%</span>
              </div>
              <div>
                <span className="text-gray-400">Latence</span>
                <span className="text-white font-bold ml-2">145ms</span>
              </div>
              <div>
                <span className="text-gray-400">Uptime</span>
                <span className="text-white font-bold ml-2">99.97%</span>
              </div>
              <div>
                <span className="text-gray-400">Revenue</span>
                <span className="text-white font-bold ml-2">85.4k€</span>
              </div>
            </div>
          </div>

          {/* TOOLBAR DE CONTRÔLE FONCTIONNELLE */}
          <div className="flex items-center gap-2">
            {/* Groupe de contrôles à gauche */}
            <div className="flex items-center gap-2">
              {/* Sélecteur de vue */}
              <select
                value={filters.view}
                onChange={(e) => setFilters({ ...filters, view: e.target.value })}
                className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 hover:bg-gray-600 cursor-pointer"
              >
                <option>Vue</option>
                <option>Détaillé</option>
                <option>Tech</option>
              </select>

              {/* Période */}
              <select
                value={filters.period}
                onChange={(e) => {
                  setFilters({ ...filters, period: e.target.value });
                  showToast(`Période changée: ${e.target.value}`, 'success');
                }}
                className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 hover:bg-gray-600 cursor-pointer"
              >
                <option value="7j">7j</option>
                <option value="30j">30j</option>
                <option value="90j">90j</option>
                <option value="365j">1 an</option>
              </select>

              {/* Langue */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <select
                  value={filters.language}
                  onChange={(e) => {
                    setFilters({ ...filters, language: e.target.value });
                    showToast(`Langue: ${e.target.value}`, 'success');
                  }}
                  className="bg-transparent text-sm text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option>Toutes</option>
                  <option>FR</option>
                  <option>EN</option>
                  <option>ES</option>
                  <option>IT</option>
                  <option>DE</option>
                </select>
              </div>

              {/* Type */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <select
                  value={filters.type}
                  onChange={(e) => {
                    setFilters({ ...filters, type: e.target.value });
                    showToast(`Type: ${e.target.value}`, 'success');
                  }}
                  className="bg-transparent text-sm text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option>Tous</option>
                  <option>Audio</option>
                  <option>Vidéo</option>
                  <option>Document</option>
                </select>
              </div>

              {/* BOUTON FILTRE FONCTIONNEL */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => {
                    setShowFilterPanel(!showFilterPanel);
                    if (!showFilterPanel) {
                      setTempFilters({
                        period: filters.period,
                        language: filters.language,
                        type: filters.type
                      });
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    activeFiltersCount > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtre</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* PANNEAU DE FILTRES FONCTIONNEL */}
                {showFilterPanel && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Filtres avancés</h3>
                        <button
                          onClick={() => setShowFilterPanel(false)}
                          className="p-1 hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Période</label>
                          <select 
                            value={tempFilters.period}
                            onChange={(e) => setTempFilters({ ...tempFilters, period: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm cursor-pointer"
                          >
                            <option value="7j">7 derniers jours</option>
                            <option value="30j">30 derniers jours</option>
                            <option value="90j">90 derniers jours</option>
                            <option value="365j">1 an</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Langue</label>
                          <select 
                            value={tempFilters.language}
                            onChange={(e) => setTempFilters({ ...tempFilters, language: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm cursor-pointer"
                          >
                            <option value="Toutes">Toutes les langues</option>
                            <option value="FR">Français</option>
                            <option value="EN">Anglais</option>
                            <option value="ES">Espagnol</option>
                            <option value="IT">Italien</option>
                            <option value="DE">Allemand</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Type de contenu</label>
                          <select 
                            value={tempFilters.type}
                            onChange={(e) => setTempFilters({ ...tempFilters, type: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm cursor-pointer"
                          >
                            <option value="Tous">Tous les types</option>
                            <option value="Audio">Audio</option>
                            <option value="Vidéo">Vidéo</option>
                            <option value="Document">Document</option>
                          </select>
                        </div>
                      </div>

                      {/* BOUTONS D'ACTION */}
                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={handleResetFilters}
                          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm cursor-pointer transition-colors"
                        >
                          Réinitialiser
                        </button>
                        <button
                          onClick={handleApplyFilters}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm cursor-pointer transition-colors"
                        >
                          Appliquer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Actualiser */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm border border-gray-600 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            {/* BOUTON EXPORTATION FONCTIONNEL */}
            <div className="ml-auto relative" ref={exportRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={analyticsData.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">Exportation</span>
                <span className="lg:hidden">Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* MENU D'EXPORT FONCTIONNEL */}
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1">
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 text-sm cursor-pointer transition-colors"
                  >
                    <FileJson className="w-4 h-4 text-blue-400" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 text-sm cursor-pointer transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 text-sm cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-400" />
                    <span>Export Excel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESTE DU CONTENU EXISTANT */}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-emerald-400">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">1,248</h3>
          <p className="text-sm text-gray-400">Transcriptions totales</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-emerald-400">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">324h</h3>
          <p className="text-sm text-gray-400">Heures traitées</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-sm text-emerald-400">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">892</h3>
          <p className="text-sm text-gray-400">Documents traduits</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-sm text-red-400">-2.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">145</h3>
          <p className="text-sm text-gray-400">Utilisateurs actifs</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Évolution mensuelle</h3>
            <button className="text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-16 h-16" />
            <span className="ml-4">Graphique des transcriptions</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Répartition par type</h3>
            <button className="text-gray-400 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Activity className="w-16 h-16" />
            <span className="ml-4">Graphique circulaire</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Activité récente</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Projet</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Durée</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Statut</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{item.projet}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{item.type}</td>
                  <td className="py-3 px-4 text-gray-400">{item.duree}</td>
                  <td className="py-3 px-4 text-gray-400">{item.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.statut === 'Terminé' 
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.statut === 'En cours'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;