// src/components/UploadZone.tsx

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function UploadZone({ projectId }: { projectId?: string }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument } = useDocuments(projectId);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = useCallback(async (fileList: File[]) => {
    // Créer les objets UploadFile
    const newFiles: UploadFile[] = fileList.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Uploader chaque fichier
    for (const uploadFile of newFiles) {
      try {
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'uploading' as const }
              : f
          )
        );
        
        await uploadDocument(uploadFile.file, (progress) => {
          setFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, progress }
                : f
            )
          );
        });
        
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'success' as const, progress: 100 }
              : f
          )
        );
      } catch (error: any) {
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, status: 'error' as const, error: error.message }
              : f
          )
        );
      }
    }
    
    // Nettoyer après 5 secondes
    setTimeout(() => {
      setFiles(prev => prev.filter(f => f.status === 'uploading'));
    }, 5000);
  }, [uploadDocument]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 transform
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="hidden"
          accept="audio/*,video/*,.pdf,.docx,.txt,.srt,.vtt"
        />
        
        <Upload className={`
          w-12 h-12 mx-auto mb-4 transition-colors
          ${dragActive ? 'text-indigo-400' : 'text-gray-400'}
        `} />
        
        <p className="text-lg font-medium mb-2">
          {dragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
        </p>
        
        <p className="text-sm text-gray-500">
          ou <span className="text-indigo-400">parcourez</span> pour sélectionner
        </p>
        
        <p className="text-xs text-gray-600 mt-4">
          Formats: Audio, Vidéo, PDF, DOCX, TXT, SRT, VTT • Max 500MB
        </p>
      </div>

      {/* Liste des fichiers */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {files.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4"
              >
                <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {file.file.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                    </span>
                  </div>
                  
                  {file.status === 'uploading' && (
                    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                  
                  {file.error && (
                    <p className="text-xs text-red-400 mt-1">{file.error}</p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  {file.status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                  )}
                  
                  {file.status === 'uploading' && (
                    <div className="relative">
                      <svg className="w-5 h-5 animate-spin text-indigo-500" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs">
                        {file.progress}%
                      </span>
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  
                  {file.status === 'error' && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}