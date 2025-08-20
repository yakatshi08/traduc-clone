// src/components/common/ErrorFallback.tsx

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: Props) {
  const isDev = process.env.NODE_ENV === 'development';

  const handleReport = () => {
    // Envoyer le rapport d'erreur à votre service de monitoring
    console.error('Error reported:', error);
    // En production : Sentry, LogRocket, etc.
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Oops! Une erreur est survenue
          </h1>
          
          <p className="text-gray-400 mb-6">
            {error.message || "Une erreur inattendue s'est produite. Nous avons été notifiés et travaillons sur une solution."}
          </p>
          
          {isDev && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-400 text-sm">
                Détails techniques (Dev only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-400 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              Accueil
            </button>
            
            {!isDev && (
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Bug className="w-4 h-4" />
                Signaler
              </button>
            )}
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Si le problème persiste, contactez le support
        </p>
      </div>
    </div>
  );
}