import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Video,
  Headphones,
  Globe,
  Settings,
  Sparkles,
  Clock,
  Users,
  Shield,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Zap,
  Target,
  Mic,
  Languages
} from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import LanguageSelector from './LanguageSelector';
import TranscriptionSettings from './TranscriptionSettings';
import ProjectSummary from './ProjectSummary';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'document' | 'video' | 'audio';
  status: 'pending' | 'analyzing' | 'ready' | 'error';
  duration?: number;
  language?: string;
  error?: string;
}

const NewProject: React.FC = () => {
  const { t } = useTranslation(['newProject', 'common']);
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [transcriptionSettings, setTranscriptionSettings] = useState({
    engine: 'auto',
    quality: 'balanced',
    speakerDiarization: true,
    punctuation: true,
    timestamps: true,
    summarization: false,
    sectorVocabulary: 'general',
    confidenceThreshold: 0.8
  });

  const steps = [
    { id: 1, label: t('newProject:steps.upload'), icon: Upload },
    { id: 2, label: t('newProject:steps.languages'), icon: Languages },
    { id: 3, label: t('newProject:steps.settings'), icon: Settings },
    { id: 4, label: t('newProject:steps.review'), icon: Check }
  ];

  const handleFilesSelected = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: getFileType(file),
      status: 'analyzing' as const
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simuler l'analyse des fichiers
    newFiles.forEach((uploadedFile) => {
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { 
                  ...f, 
                  status: 'ready',
                  duration: Math.floor(Math.random() * 3600) + 300,
                  language: detectLanguage()
                }
              : f
          )
        );
      }, 2000);
    });
  };

  const getFileType = (file: File): 'document' | 'video' | 'audio' => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
    
    if (videoExtensions.includes(extension || '')) return 'video';
    if (audioExtensions.includes(extension || '')) return 'audio';
    return 'document';
  };

  const detectLanguage = () => {
    const languages = ['fr', 'en', 'es', 'it', 'de'];
    return languages[Math.floor(Math.random() * languages.length)];
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'ready');
      case 2:
        return targetLanguages.length > 0;
      case 3:
        return true;
      case 4:
        return projectName.trim() !== '';
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep() && step < 4) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStartTranscription = () => {
    // Logique pour démarrer la transcription
    console.log('Starting transcription with:', {
      projectName,
      files: uploadedFiles,
      sourceLanguage,
      targetLanguages,
      settings: transcriptionSettings
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {t('newProject:title')}
                </h1>
                <p className="text-sm text-gray-400">
                  {t('newProject:subtitle')}
                </p>
              </div>
            </div>
            
            {/* Steps Progress */}
            <div className="hidden lg:flex items-center gap-8">
              {steps.map((s, index) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full transition-all
                      ${step >= s.id 
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                        : 'bg-slate-800 text-gray-400'
                      }
                    `}>
                      {step > s.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      step >= s.id ? 'text-white' : 'text-gray-500'
                    }`}>
                      {s.label}
                    </span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-600 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mobile Steps */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`
                  flex-1 h-2 rounded-full mx-1 transition-all
                  ${step >= s.id 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600' 
                    : 'bg-slate-800'
                  }
                `}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">
            {t('newProject:step')} {step} / {steps.length}: {steps[step - 1].label}
          </p>
        </div>

        {/* Step Content */}
        <div className="animate-fadeIn">
          {step === 1 && (
            <div className="space-y-6">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
              />
              
              {/* File Type Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="font-medium text-white">
                      {t('newProject:fileTypes.documents.title')}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('newProject:fileTypes.documents.formats')}
                  </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Video className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-medium text-white">
                      {t('newProject:fileTypes.videos.title')}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('newProject:fileTypes.videos.formats')}
                  </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Headphones className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-medium text-white">
                      {t('newProject:fileTypes.audio.title')}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('newProject:fileTypes.audio.formats')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <LanguageSelector
              sourceLanguage={sourceLanguage}
              targetLanguages={targetLanguages}
              onSourceLanguageChange={setSourceLanguage}
              onTargetLanguagesChange={setTargetLanguages}
              detectedLanguages={uploadedFiles.map(f => ({ 
                fileName: f.name, 
                language: f.language || 'unknown' 
              }))}
            />
          )}

          {step === 3 && (
            <TranscriptionSettings
              settings={transcriptionSettings}
              onSettingsChange={setTranscriptionSettings}
              fileTypes={[...new Set(uploadedFiles.map(f => f.type))]}
            />
          )}

          {step === 4 && (
            <ProjectSummary
              projectName={projectName}
              onProjectNameChange={setProjectName}
              files={uploadedFiles}
              sourceLanguage={sourceLanguage}
              targetLanguages={targetLanguages}
              settings={transcriptionSettings}
              onStartTranscription={handleStartTranscription}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${step === 1 
                ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('newProject:navigation.previous')}
          </button>

          <div className="flex items-center gap-4">
            {/* Cancel button */}
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              {t('newProject:navigation.cancel')}
            </button>

            {/* Next/Start button */}
            {step < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={!canProceedToNextStep()}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                  ${canProceedToNextStep()
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg' 
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {t('newProject:navigation.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartTranscription}
                disabled={!canProceedToNextStep()}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                  ${canProceedToNextStep()
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg' 
                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Zap className="w-4 h-4" />
                {t('newProject:navigation.start')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;