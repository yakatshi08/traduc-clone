import React from 'react';
import { FileText, Globe, Settings, Zap } from 'lucide-react';

interface ProjectSummaryProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  files: any[];
  sourceLanguage: string;
  targetLanguages: string[];
  settings: any;
  onStartTranscription: () => void;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  projectName,
  onProjectNameChange,
  files,
  sourceLanguage,
  targetLanguages,
  settings,
  onStartTranscription,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Nom du projet
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Ex: Conférence Q4 2024"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Fichiers
          </h3>
          <p className="text-gray-400">{files.length} fichier(s) sélectionné(s)</p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-400" />
            Langues
          </h3>
          <p className="text-gray-400">
            {sourceLanguage === 'auto' ? 'Auto-détection' : sourceLanguage.toUpperCase()} → {targetLanguages.join(', ').toUpperCase()}
          </p>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-400" />
          Paramètres
        </h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Moteur: {settings.engine}</p>
          <p>Diarisation: {settings.speakerDiarization ? 'Activée' : 'Désactivée'}</p>
          <p>Horodatage: {settings.timestamps ? 'Activé' : 'Désactivé'}</p>
        </div>
      </div>

      <button
        onClick={onStartTranscription}
        disabled={!projectName.trim()}
        className={`w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          projectName.trim()
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg'
            : 'bg-slate-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Zap className="w-5 h-5" />
        Démarrer la transcription
      </button>
    </div>
  );
};

export default ProjectSummary;
