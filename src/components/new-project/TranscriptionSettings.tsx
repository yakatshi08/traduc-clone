import React from 'react';
import { Settings, Zap, Users, Clock } from 'lucide-react';

interface TranscriptionSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  fileTypes: string[];
}

const TranscriptionSettings: React.FC<TranscriptionSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleChange = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          Moteur de transcription
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['auto', 'whisper-v3', 'deepgram'].map((engine) => (
            <button
              key={engine}
              onClick={() => handleChange('engine', engine)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.engine === engine
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <h4 className="font-medium text-white mb-1">
                {engine === 'auto' ? 'Automatique' : engine.toUpperCase()}
              </h4>
              <p className="text-sm text-gray-400">
                {engine === 'auto' ? 'Sélection intelligente' : 'Optimisé pour la précision'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Options avancées
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white">Diarisation des locuteurs</p>
                <p className="text-sm text-gray-400">Identifier les différents intervenants</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.speakerDiarization}
              onChange={(e) => handleChange('speakerDiarization', e.target.checked)}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white">Horodatage</p>
                <p className="text-sm text-gray-400">Ajouter les marqueurs temporels</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.timestamps}
              onChange={(e) => handleChange('timestamps', e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionSettings;
