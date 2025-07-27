import React from 'react';
import { FileText, Video, Headphones, MoreVertical } from 'lucide-react';

interface RecentProjectProps {
  id: number;
  name: string;
  type: 'document' | 'video' | 'audio';
  status: 'completed' | 'processing' | 'ready';
  progress: number;
  date: string;
  size: string;
}

const RecentProject: React.FC<RecentProjectProps> = ({
  name,
  type,
  status,
  progress,
  date,
  size
}) => {
  const getIcon = () => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'processing':
        return 'text-blue-400';
      case 'ready':
        return 'text-violet-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'processing':
        return 'En cours';
      case 'ready':
        return 'Prêt';
    }
  };

  return (
    <div className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">
              {name}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {date} • {size}
            </p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <span className="text-gray-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${
              status === 'completed' 
                ? 'from-emerald-500 to-green-500' 
                : status === 'processing'
                ? 'from-blue-500 to-cyan-500'
                : 'from-violet-500 to-indigo-500'
            } transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecentProject;