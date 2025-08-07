import React, { useState } from 'react';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Copy, 
  FileText,
  Subtitles,
  Code,
  Globe,
  Zap,
  ChevronRight
} from 'lucide-react';
import { TranscriptionResult } from '../../services/aiService';

interface TranscriptionResultsProps {
  result: TranscriptionResult;
  onContinueEdit: () => void;
}

const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({ 
  result, 
  onContinueEdit 
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [selectedExport, setSelectedExport] = useState<string>('txt');

  const exportFormats = [
    { id: 'txt', name: 'Texte brut', icon: FileText, extension: '.txt' },
    { id: 'srt', name: 'Sous-titres SRT', icon: Subtitles, extension: '.srt' },
    { id: 'vtt', name: 'WebVTT', icon: Code, extension: '.vtt' },
    { id: 'json', name: 'JSON', icon: Code, extension: '.json' }
  ];

  const handleCopy = (format: string) => {
    let textToCopy = '';
    
    switch (format) {
      case 'text':
        textToCopy = result.text;
        break;
      case 'segments':
        textToCopy = result.segments.map(s => 
          `[${formatTime(s.start)} - ${formatTime(s.end)}] ${s.speaker || 'Speaker'}: ${s.text}`
        ).join('\n');
        break;
      case 'summary':
        textToCopy = result.summary || '';
        break;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExport = () => {
    console.log(`Exporting as ${selectedExport}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-traduc-emerald/10 border border-traduc-emerald/30 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-12 h-12 text-traduc-emerald" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-traduc-beige-900 dark:text-white mb-2">
              Transcription terminée !
            </h2>
            <p className="text-traduc-beige-600 dark:text-gray-400">
              Votre fichier a été transcrit avec succès en {formatTime(result.metadata.processingTime)}
            </p>
          </div>
          <button
            onClick={onContinueEdit}
            className="flex items-center gap-2 px-6 py-3 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg"
          >
            Éditer la transcription
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-4 border border-traduc-beige-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-traduc-violet/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-traduc-violet" />
            </div>
            <div>
              <p className="text-2xl font-bold text-traduc-beige-900 dark:text-white">
                {result.metadata.accuracy}%
              </p>
              <p className="text-sm text-traduc-beige-600 dark:text-gray-400">Précision</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-4 border border-traduc-beige-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-traduc-indigo/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-traduc-indigo" />
            </div>
            <div>
              <p className="text-2xl font-bold text-traduc-beige-900 dark:text-white">
                {result.metadata.wordCount}
              </p>
              <p className="text-sm text-traduc-beige-600 dark:text-gray-400">Mots</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-4 border border-traduc-beige-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-traduc-emerald/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-traduc-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold text-traduc-beige-900 dark:text-white">
                {result.segments.length}
              </p>
              <p className="text-sm text-traduc-beige-600 dark:text-gray-400">Segments</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-4 border border-traduc-beige-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Subtitles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-traduc-beige-900 dark:text-white">
                {formatTime(result.metadata.duration)}
              </p>
              <p className="text-sm text-traduc-beige-600 dark:text-gray-400">Durée</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
                Transcription complète
              </h3>
              <button
                onClick={() => handleCopy('text')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              >
                <Copy className="w-4 h-4" />
                {copiedFormat === 'text' ? 'Copié !' : 'Copier'}
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-traduc-beige-700 dark:text-gray-300 whitespace-pre-wrap">
                {result.text}
              </p>
            </div>
          </div>

          {result.summary && (
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
                  Résumé automatique
                </h3>
                <button
                  onClick={() => handleCopy('summary')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                  {copiedFormat === 'summary' ? 'Copié !' : 'Copier'}
                </button>
              </div>
              
              <p className="text-traduc-beige-700 dark:text-gray-300">
                {result.summary}
              </p>
            </div>
          )}

          {result.translation && (
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
                  Traduction
                </h3>
                <span className="text-sm text-traduc-beige-600 dark:text-gray-400">
                  Anglais
                </span>
              </div>
              
              <p className="text-traduc-beige-700 dark:text-gray-300">
                {result.translation}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
              Exporter
            </h3>
            
            <div className="space-y-3 mb-4">
              {exportFormats.map((format) => (
                <label
                  key={format.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedExport === format.id
                      ? 'border-traduc-indigo bg-traduc-indigo/5'
                      : 'border-traduc-beige-300 dark:border-gray-600 hover:border-traduc-indigo/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="export"
                    value={format.id}
                    checked={selectedExport === format.id}
                    onChange={(e) => setSelectedExport(e.target.value)}
                    className="text-traduc-indigo"
                  />
                  <format.icon className="w-5 h-5 text-traduc-beige-600 dark:text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-traduc-beige-900 dark:text-white">
                      {format.name}
                    </p>
                    <p className="text-xs text-traduc-beige-600 dark:text-gray-400">
                      {format.extension}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-traduc-indigo hover:bg-traduc-indigo/90 text-white rounded-lg"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-6 border border-traduc-beige-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-traduc-beige-900 dark:text-white mb-4">
              Actions rapides
            </h3>
            
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-left">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Partager le projet</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-left">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Traduire dans une autre langue</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-left">
                <Subtitles className="w-4 h-4" />
                <span className="text-sm">Générer des sous-titres</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 beige:bg-traduc-beige-50 rounded-lg p-4 text-sm">
            <p className="text-traduc-beige-600 dark:text-gray-400">
              Transcrit avec <span className="font-medium text-traduc-beige-900 dark:text-white">{result.metadata.engine}</span>
            </p>
            <p className="text-traduc-beige-600 dark:text-gray-400 mt-1">
              Traité en {result.metadata.processingTime}s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionResults;