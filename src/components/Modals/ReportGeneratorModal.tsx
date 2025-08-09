import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Download,
  Mail,
  Loader,
  CheckCircle
} from 'lucide-react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'projects']);
  const [period, setPeriod] = useState('30d');
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [emailReport, setEmailReport] = useState(false);
  const [email, setEmail] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!isOpen) return null;

  const metrics = [
    { id: 'revenue', label: 'Revenus', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'projects', label: 'Projets', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
    { id: 'languages', label: 'Langues', icon: <Globe className="w-4 h-4" /> },
    { id: 'usage', label: 'Utilisation', icon: <PieChart className="w-4 h-4" /> }
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Simuler la génération
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGenerating(false);
    setGenerated(true);
    
    // Télécharger automatiquement après 1 seconde
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `rapport-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      
      if (!emailReport) {
        setTimeout(() => onClose(), 500);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              Générer un rapport personnalisé
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!generating && !generated ? (
            <div className="space-y-6">
              {/* Période */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Période du rapport
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: '7d', label: '7 jours' },
                    { value: '30d', label: '30 jours' },
                    { value: '90d', label: '90 jours' },
                    { value: '12m', label: '12 mois' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPeriod(option.value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        period === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Métriques */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Métriques à inclure
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map(metric => (
                    <button
                      key={metric.id}
                      onClick={() => toggleMetric(metric.id)}
                      className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedMetrics.includes(metric.id)
                          ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {metric.icon}
                      <span>{metric.label}</span>
                      {selectedMetrics.includes(metric.id) && (
                        <CheckCircle className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Options du rapport
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Inclure les graphiques</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailReport}
                      onChange={(e) => setEmailReport(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>Envoyer par email</span>
                  </label>
                </div>
              </div>

              {/* Email */}
              {emailReport && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rapport@example.com"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Format d'export
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'pdf', label: 'PDF' },
                    { value: 'xlsx', label: 'Excel' },
                    { value: 'csv', label: 'CSV' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFormat(option.value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        format === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : generating ? (
            <div className="text-center py-12">
              <Loader className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Génération en cours...</h3>
              <p className="text-gray-400">Cela peut prendre quelques instants</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Rapport généré avec succès !</h3>
              <p className="text-gray-400">
                {emailReport 
                  ? `Le rapport a été envoyé à ${email}`
                  : 'Le téléchargement va commencer automatiquement'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {generated ? 'Fermer' : 'Annuler'}
            </button>
            {!generating && !generated && (
              <button
                onClick={handleGenerate}
                disabled={selectedMetrics.length === 0 || (emailReport && !email)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Générer le rapport
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorModal;