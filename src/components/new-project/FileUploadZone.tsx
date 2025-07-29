import React, { useState } from 'react';
import { Upload, X, FileText, Video, Headphones } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploadedFiles: any[];
  onRemoveFile: (fileId: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFilesSelected, 
  uploadedFiles, 
  onRemoveFile 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-slate-600 hover:border-violet-500'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Glissez-déposez vos fichiers ici
        </h3>
        <p className="text-gray-400 mb-4">ou</p>
        <label className="cursor-pointer">
          <span className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors inline-block">
            Parcourir
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.mp4,.avi,.mov,.mp3,.wav,.m4a"
          />
        </label>
        <p className="text-sm text-gray-500 mt-4">
          Formats supportés: PDF, DOCX, MP4, MP3, etc. • Max 2GB par fichier
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">Fichiers uploadés ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">{file.status}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
