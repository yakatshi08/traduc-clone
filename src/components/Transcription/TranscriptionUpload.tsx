import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  X, 
  Settings,
  Sparkles,
  Globe,
  Target,
  Mic
} from 'lucide-react';
import { aiService, TranscriptionOptions } from '../../services/aiService';

interface TranscriptionUploadProps {
  onTranscriptionStart: (file: File, options: TranscriptionOptions) => void;
}

const TranscriptionUpload: React.FC<TranscriptionUploadProps> = ({ onTranscriptionStart }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<TranscriptionOptions>({
    language: 'fr',
    sector: 'general',
    features: {
      diarization: true,
      punctuation: true,
      timestamps: true,
      summary: false,
      translation: false
    }
  });
  const [selectedEngine, setSelectedEngine] = useState<string | undefined>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxFiles: 1
  });

  const engines = aiService.getEngines();
  const recommendedEngine = selectedFile ? aiService.selectBestEngine(options) : null;

  const handleTranscribe = () => {
    if (selectedFile) {
      const finalOptions = {
        ...options,
        engine: selectedEngine || recommendedEngine?.id
      };
      onTranscriptionStart(selectedFile, finalOptions);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Zone d'upload */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-traduc-indigo bg-traduc-indigo/5' 
              : 'border-traduc-beige-300 dark:border-gray-600 hover:border-traduc-indigo'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 mx-auto mb-4 text-traduc-beige-400 dark:text-gray-500" />
          <h3 className="text-xl font-semibold text-traduc-beige-900 dark:text-white mb-2">
            Glissez votre fichier ici
          </h3>
          <p className="text-traduc-beige-600 dark:text-gray-400 mb-4">
            ou cliquez pour sélectionner
          </p>
          <p className="text-sm text-traduc-beige-500 dark:text-gray-500">
            Formats supportés : MP3, WAV, M4A, MP4, AVI, MOV
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fichier sélectionné */}
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {selectedFile.type.startsWith('audio/') ? (
                  <FileAudio className="w-12 h-12 text-traduc-indigo" />
                ) : (
                  <FileVideo className="w-12 h-12 text-traduc-violet" />
                )}
                <div>
                  <h4 className="font-medium text-traduc-beige-900 dark:text-white">
                    {selectedFile.name}
                  </h4>
                  <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options de transcription */}
            <div className="space-y-4 pt-4 border-t border-traduc-beige-200 dark:border-gray-700">
              <h5 className="font-medium text-traduc-beige-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Options de transcription
              </h5>

              {/* Langue */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Langue source
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => setOptions({...options, language: e.target.value})}
                    className="w-full px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Secteur */}
                <div>
                  <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Secteur
                  </label>
                  <select
                    value={options.sector}
                    onChange={(e) => setOptions({...options, sector: e.target.value as any})}
                    className="w-full px-3 py-2 border border-traduc-beige-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-traduc-beige-900 dark:text-white"
                  >
                    <option value="general">Général</option>
                    <option value="medical">Médical</option>
                    <option value="legal">Juridique</option>
                    <option value="education">Éducation</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              {/* Moteur IA */}
              <div>
                <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Moteur de transcription
                </label>
                <div className="space-y-2">
                  {engines.map((engine) => (
                    <label
                      key={engine.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        (selectedEngine || recommendedEngine?.id) === engine.id
                          ? 'border-traduc-indigo bg-traduc-indigo/5'
                          : 'border-traduc-beige-300 dark:border-gray-600 hover:border-traduc-indigo'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="engine"
                          value={engine.id}
                          checked={(selectedEngine || recommendedEngine?.id) === engine.id}
                          onChange={(e) => setSelectedEngine(e.target.value)}
                          className="text-traduc-indigo"
                        />
                        <div>
                          <p className="font-medium text-traduc-beige-900 dark:text-white">
                            {engine.name}
                            {recommendedEngine?.id === engine.id && !selectedEngine && (
                              <span className="ml-2 text-xs bg-traduc-emerald/20 text-traduc-emerald px-2 py-1 rounded-full">
                                Recommandé
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                            {engine.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-traduc-beige-900 dark:text-white">
                          {engine.accuracy}% précision
                        </p>
                        <p className="text-xs text-traduc-beige-600 dark:text-gray-400">
                          {engine.cost}€/min
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fonctionnalités */}
              <div>
                <label className="block text-sm font-medium text-traduc-beige-700 dark:text-gray-300 mb-2">
                  <Mic className="w-4 h-4 inline mr-1" />
                  Fonctionnalités
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.features?.diarization}
                      onChange={(e) => setOptions({
                        ...options,
                        features: {...options.features, diarization: e.target.checked}
                      })}
                      className="rounded text-traduc-indigo mr-3"
                    />
                    <span className="text-sm text-traduc-beige-700 dark:text-gray-300">
                      Diarisation (identifier les locuteurs)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.features?.summary}
                      onChange={(e) => setOptions({
                        ...options,
                        features: {...options.features, summary: e.target.checked}
                      })}
                      className="rounded text-traduc-indigo mr-3"
                    />
                    <span className="text-sm text-traduc-beige-700 dark:text-gray-300">
                      Générer un résumé automatique
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.features?.translation}
                      onChange={(e) => setOptions({
                        ...options,
                        features: {...options.features, translation: e.target.checked}
                      })}
                      className="rounded text-traduc-indigo mr-3"
                    />
                    <span className="text-sm text-traduc-beige-700 dark:text-gray-300">
                      Traduire le texte
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de transcription */}
          <button
            onClick={handleTranscribe}
            className="w-full py-4 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Lancer la transcription
          </button>
        </div>
      )}
    </div>
  );
};

export default TranscriptionUpload;