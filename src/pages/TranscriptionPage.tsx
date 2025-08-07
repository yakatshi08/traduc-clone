import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sparkles } from 'lucide-react';
import TranscriptionUpload from '../components/Transcription/TranscriptionUpload';
import TranscriptionEditor from '../components/Transcription/TranscriptionEditor';
import TranscriptionResults from '../components/Transcription/TranscriptionResults';
import { aiService, TranscriptionOptions, TranscriptionResult } from '../services/aiService';

type TranscriptionStep = 'upload' | 'processing' | 'results' | 'editor';

const TranscriptionPage: React.FC = () => {
  const { t } = useTranslation('transcription');
  const [currentStep, setCurrentStep] = useState<TranscriptionStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleTranscriptionStart = async (file: File, options: TranscriptionOptions) => {
    setSelectedFile(file);
    setCurrentStep('processing');
    
    // Simuler la progression
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const result = await aiService.transcribe(file, options);
      setTranscriptionResult(result);
      setProcessingProgress(100);
      
      setTimeout(() => {
        setCurrentStep('results');
      }, 500);
    } catch (error) {
      console.error('Transcription error:', error);
      // Gérer l'erreur
    }
  };

  const handleSaveTranscription = (updatedResult: TranscriptionResult) => {
    setTranscriptionResult(updatedResult);
    // Sauvegarder dans la base de données ou localStorage
    console.log('Saving transcription:', updatedResult);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-traduc-indigo/10 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-traduc-indigo" />
              </div>
              <h1 className="text-3xl font-bold text-traduc-beige-900 dark:text-white mb-2">
                Nouvelle transcription
              </h1>
              <p className="text-traduc-beige-600 dark:text-gray-400">
                Téléchargez votre fichier audio ou vidéo pour commencer
              </p>
            </div>
            
            <TranscriptionUpload onTranscriptionStart={handleTranscriptionStart} />
          </div>
        );

      case 'processing':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 rounded-lg p-12 border border-traduc-beige-300 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-traduc-indigo/10 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-traduc-indigo" />
              </div>
              
              <h2 className="text-2xl font-bold text-traduc-beige-900 dark:text-white mb-4">
                Transcription en cours...
              </h2>
              
              <div className="w-full bg-traduc-beige-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-traduc-indigo h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              
              <p className="text-sm text-traduc-beige-600 dark:text-gray-400">
                {processingProgress}% - Analyse du fichier {selectedFile?.name}
              </p>
              
              <div className="mt-8 space-y-2">
                <p className="text-xs text-traduc-beige-500 dark:text-gray-500">
                  ✓ Détection de la langue
                </p>
                <p className="text-xs text-traduc-beige-500 dark:text-gray-500">
                  ✓ Optimisation audio
                </p>
                <p className="text-xs text-traduc-beige-500 dark:text-gray-500">
                  {processingProgress > 50 ? '✓' : '○'} Transcription IA
                </p>
                <p className="text-xs text-traduc-beige-500 dark:text-gray-500">
                  {processingProgress > 80 ? '✓' : '○'} Post-traitement
                </p>
              </div>
            </div>
          </div>
        );

      case 'results':
        return transcriptionResult && (
          <TranscriptionResults 
            result={transcriptionResult}
            onContinueEdit={() => setCurrentStep('editor')}
          />
        );

      case 'editor':
        return transcriptionResult && (
          <TranscriptionEditor
            result={transcriptionResult}
            audioUrl={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
            onSave={handleSaveTranscription}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header de navigation */}
      <div className="bg-white dark:bg-gray-800 beige:bg-traduc-beige-100 border-b border-traduc-beige-300 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentStep !== 'upload' && (
              <button
                onClick={() => {
                  if (currentStep === 'editor') {
                    setCurrentStep('results');
                  } else if (currentStep === 'results') {
                    setCurrentStep('upload');
                  }
                }}
                className="p-2 hover:bg-traduc-beige-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-traduc-beige-900 dark:text-white">
              {currentStep === 'upload' && 'Nouvelle transcription'}
              {currentStep === 'processing' && 'Traitement en cours'}
              {currentStep === 'results' && 'Résultats'}
              {currentStep === 'editor' && 'Éditeur de transcription'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Indicateur d'étape */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                currentStep === 'upload' ? 'bg-traduc-indigo' : 'bg-traduc-emerald'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                ['processing', 'results', 'editor'].includes(currentStep) 
                  ? 'bg-traduc-indigo' 
                  : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                ['results', 'editor'].includes(currentStep) 
                  ? 'bg-traduc-indigo' 
                  : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                currentStep === 'editor' ? 'bg-traduc-indigo' : 'bg-gray-300'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default TranscriptionPage;