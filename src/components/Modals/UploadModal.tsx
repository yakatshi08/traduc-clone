import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  File, 
  FileVideo, 
  FileAudio, 
  FileText,
  Cloud,
  HardDrive,
  Link,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'document' | 'video' | 'audio';
  onUpload: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, type, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'local' | 'cloud' | 'url'>('local');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const acceptedFormats = {
    document: '.pdf,.doc,.docx,.txt,.rtf,.odt',
    video: '.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm',
    audio: '.mp3,.wav,.flac,.aac,.ogg,.wma,.m4a'
  };

  const maxFileSize = {
    document: 50 * 1024 * 1024, // 50 MB
    video: 5 * 1024 * 1024 * 1024, // 5 GB
    audio: 500 * 1024 * 1024 // 500 MB
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize[type]) {
        alert(`${file.name} est trop volumineux. Taille max: ${formatFileSize(maxFileSize[type])}`);
        return false;
      }
      return true;
    });
    setSelectedFiles(validFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = async () => {
    setUploadStatus('uploading');
    
    for (const file of selectedFiles) {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      // Simuler le progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(prev => ({ ...prev, [file.name]: i }));
      }
    }
    
    setUploadStatus('success');
    setTimeout(() => {
      onUpload(selectedFiles);
      onClose();
    }, 1500);
  };

  const handleUrlUpload = () => {
    if (!url.trim()) return;
    
    // Simuler la récupération d'un fichier depuis URL
    const fakeFile = new File([''], url.split('/').pop() || 'file', { type: 'application/octet-stream' });
    setSelectedFiles([fakeFile]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getIcon = () => {
    switch (type) {
      case 'document': return <FileText className="w-12 h-12 text-blue-400" />;
      case 'video': return <FileVideo className="w-12 h-12 text-purple-400" />;
      case 'audio': return <FileAudio className="w-12 h-12 text-green-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Importer {type === 'document' ? 'des documents' : type === 'video' ? 'des vidéos' : 'des fichiers audio'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Méthodes d'upload */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setUploadMethod('local')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                uploadMethod === 'local' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              Fichier local
            </button>
            <button
              onClick={() => setUploadMethod('cloud')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                uploadMethod === 'cloud' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Cloud className="w-4 h-4" />
              Cloud
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                uploadMethod === 'url' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Link className="w-4 h-4" />
              URL
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {uploadStatus === 'idle' && (
            <>
              {uploadMethod === 'local' && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedFormats[type]}
                    onChange={handleChange}
                    className="hidden"
                  />
                  
                  {getIcon()}
                  
                  <p className="text-gray-300 mt-4 mb-2">
                    Glissez vos fichiers ici ou
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Parcourir
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Formats acceptés: {acceptedFormats[type].replace(/\./g, '').replace(/,/g, ', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Taille max: {formatFileSize(maxFileSize[type])}
                  </p>
                </div>
              )}

              {uploadMethod === 'cloud' && (
                <div className="space-y-4">
                  <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7.71,3.5L1.15,10L7.71,16.5V12.7C15.91,12.7 20.85,17.65 20.85,25.85C20.85,20.91 16.82,14.35 7.71,14.35V10.5L7.71,3.5Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Google Drive</p>
                      <p className="text-sm text-gray-400">Connectez votre compte Google Drive</p>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Dropbox</p>
                      <p className="text-sm text-gray-400">Importez depuis Dropbox</p>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">OneDrive</p>
                      <p className="text-sm text-gray-400">Accédez à vos fichiers OneDrive</p>
                    </div>
                  </button>
                </div>
              )}

              {uploadMethod === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      URL du fichier
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/file.mp4"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleUrlUpload}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Ajouter depuis l'URL
                  </button>
                </div>
              )}

              {/* Fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Fichiers sélectionnés ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-600 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Upload en cours */}
          {uploadStatus === 'uploading' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Loader className="w-5 h-5 animate-spin text-blue-400" />
                <p className="font-medium">Upload en cours...</p>
              </div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{file.name}</span>
                    <span>{uploadProgress[file.name] || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress[file.name] || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload réussi */}
          {uploadStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Upload réussi !</h3>
              <p className="text-gray-400">
                {selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''} importé{selectedFiles.length > 1 ? 's' : ''}
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
              Annuler
            </button>
            {uploadStatus === 'idle' && selectedFiles.length > 0 && (
              <button
                onClick={simulateUpload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Importer ({selectedFiles.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;