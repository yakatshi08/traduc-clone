import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  bgColor
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 bg-gradient-to-r ${color} text-transparent bg-clip-text`} />
        </div>
        <span className={`text-sm font-medium bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
          {change}
        </span>
      </div>
      
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{changeLabel}</p>
    </div>
  );
};

export default StatsCard;