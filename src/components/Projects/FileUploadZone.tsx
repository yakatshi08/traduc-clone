import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Video,
  Headphones,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive,
  Loader2,
  FileWarning,
  CloudUpload
} from 'lucide-react';

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
  progress?: number;
}

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  uploadedFiles,
  onRemoveFile
}) => {
  const { t } = useTranslation('newProject');
  const [dragActive, setDragActive] = useState(false);

  // Formats supportés selon le cahier des charges
  const acceptedFormats = {
    document: ['.pdf', '.docx', '.doc', '.txt', '.odt', '.rtf'],
    video: ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.m4v', '.flv'],
    audio: ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.wma']
  };

  const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB selon cahier des charges

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Validation des fichiers
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxFileSize) {
        console.error(`File ${file.name} exceeds 2GB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file: any) => {
        console.error(`File ${file.file.name} rejected:`, file.errors);
      });
    }
  }, [onFilesSelected, maxFileSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': acceptedFormats.document,
      'application/msword': acceptedFormats.document,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': acceptedFormats.document,
      'text/plain': acceptedFormats.document,
      'video/*': acceptedFormats.video,
      'audio/*': acceptedFormats.audio
    },
    maxSize: maxFileSize,
    multiple: true
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'text-blue-400 bg-blue-500/20';
      case 'ready':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'error':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getTotalSize = () => {
    return uploadedFiles.reduce((total, file) => total + file.size, 0);
  };

  const getTotalDuration = () => {
    return uploadedFiles
      .filter(file => file.duration)
      .reduce((total, file) => total + (file.duration || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragActive 
            ? 'border-violet-500 bg-violet-500/10 scale-[1.02]' 
            : 'border-slate-600 hover:border-violet-500 hover:bg-slate-800/50'
          }
          ${uploadedFiles.length > 0 ? 'lg:p-8' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`
            p-4 rounded-2xl transition-all duration-300
            ${isDragActive 
              ? 'bg-violet-500/20 scale-110' 
              : 'bg-slate-700/50 group-hover:bg-violet-500/20 group-hover:scale-110'
            }
          `}>
            <Upload className={`
              w-12 h-12 transition-colors
              ${isDragActive ? 'text-violet-400' : 'text-gray-400 group-hover:text-violet-400'}
            `} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isDragActive 
                ? t('upload.dropHere') 
                : t('upload.dragDrop')
              }
            </h3>
            <p className="text-gray-400 mb-4">
              {t('upload.or')} <span className="text-violet-400 hover:text-violet-300 transition-colors">{t('upload.browse')}</span>
            </p>
            <p className="text-sm text-gray-500">
              {t('upload.maxSize')} • {t('upload.supportedFormats')}
            </p>
          </div>

          {/* Cloud Import Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Ouvrir CloudConnector
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            <CloudUpload className="w-4 h-4" />
            {t('upload.importFromCloud')}
          </button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">
              {t('upload.uploadedFiles')} ({uploadedFiles.length})
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <HardDrive className="w-4 h-4" />
                {formatFileSize(getTotalSize())}
              </span>
              {getTotalDuration() > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(getTotalDuration())}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* File Icon */}
                    <div className={`
                      p-3 rounded-lg
                      ${file.type === 'document' ? 'bg-violet-500/20 text-violet-400' :
                        file.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'}
                    `}>
                      {getFileIcon(file.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1">
                      <h5 className="font-medium text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                        {file.name}
                      </h5>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>{formatFileSize(file.size)}</span>
                        {file.duration && (
                          <span>{formatDuration(file.duration)}</span>
                        )}
                        {file.language && file.status === 'ready' && (
                          <span className="flex items-center gap-1">
                            <span className="text-xs">🌐</span>
                            {file.language.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                      ${getStatusColor(file.status)}
                    `}>
                      {getStatusIcon(file.status)}
                      <span>{t(`upload.status.${file.status}`)}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                {file.status === 'analyzing' && file.progress && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                    <FileWarning className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{file.error}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;