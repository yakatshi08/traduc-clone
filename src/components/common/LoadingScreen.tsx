// src/components/common/LoadingScreen.tsx

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo animé */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl animate-ping opacity-30"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">TX</span>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full animate-loading-bar"></div>
        </div>
        
        {/* Texte */}
        <p className="text-gray-400 animate-pulse">Chargement en cours...</p>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 100%;
            transform: translateX(0);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}