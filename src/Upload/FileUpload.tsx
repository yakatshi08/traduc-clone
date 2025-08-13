import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  projectId: string;
  onUploadComplete?: (files: any[]) => void;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  projectId, 
  onUploadComplete,
  multiple = true 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = '.mp3,.wav,.ogg,.flac,.m4a,.mp4,.avi,.mkv,.mov,.webm';

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-blue-400" />;
    if (file.type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-400" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Vérifier la taille max (500MB)
    const maxSize = 500 * 1024 * 1024;
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} est trop volumineux (max 500MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Aucun fichier sélectionné');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await fetch(
          `http://localhost:5000/api/upload/multiple/${projectId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: formData
          }
        );

        const data = await response.json();

        if (data.success) {
          toast.success(`${files.length} fichier(s) uploadé(s) avec succès !`);
          setFiles([]);
          if (onUploadComplete) {
            onUploadComplete(data.data);
          }
        } else {
          toast.error(data.message || 'Erreur lors de l\'upload');
        }
      } else {
        // Upload single file
        formData.append('file', files[0]);
        
        const response = await fetch(
          `http://localhost:5000/api/upload/single/${projectId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: formData
          }
        );

        const data = await response.json();

        if (data.success) {
          toast.success('Fichier uploadé avec succès !');
          setFiles([]);
          if (onUploadComplete) {
            onUploadComplete([data.data]);
          }
        } else {
          toast.error(data.message || 'Erreur lors de l\'upload');
        }
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload des fichiers');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="w-full">
      {/* Zone de drop */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-800/50"
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          Cliquez ou glissez vos fichiers ici
        </p>
        <p className="text-sm text-gray-400">
          Formats supportés: MP3, WAV, MP4, AVI, MKV, etc. (Max 500MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-800 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              {!uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              
              {uploadProgress[file.name] !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    {uploadProgress[file.name]}%
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Bouton upload */}
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Uploader {files.length} fichier(s)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;