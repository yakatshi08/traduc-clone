// src/components/common/UpdateNotification.tsx

import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{
    version: string;
    features: string[];
  } | null>(null);

  useEffect(() => {
    // Vérifier les mises à jour toutes les heures
    const checkForUpdates = async () => {
      try {
        // Simuler une vérification de mise à jour
        // En production, appeler votre API
        const currentVersion = '2.5.0';
        const latestVersion = '2.5.1'; // Depuis API
        
        if (currentVersion !== latestVersion) {
          setUpdateAvailable(true);
          setUpdateInfo({
            version: latestVersion,
            features: [
              'Amélioration des performances',
              'Nouveaux modèles IA',
              'Corrections de bugs'
            ]
          });
        }
      } catch (error) {
        console.error('Erreur vérification mise à jour:', error);
      }
    };

    // Vérifier au chargement
    checkForUpdates();

    // Vérifier toutes les heures
    const interval = setInterval(checkForUpdates, 3600000);

    // Service Worker pour les mises à jour PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    // Recharger pour appliquer la mise à jour
    window.location.reload();
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    // Sauvegarder le dismiss pour 24h
    localStorage.setItem('update_dismissed', Date.now().toString());
  };

  // Vérifier si déjà dismissé récemment
  useEffect(() => {
    const dismissed = localStorage.getItem('update_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const hoursSinceDismiss = (now - dismissedTime) / (1000 * 60 * 60);
      
      if (hoursSinceDismiss < 24) {
        setUpdateAvailable(false);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {updateAvailable && updateInfo && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg p-4 shadow-xl">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">
                  Mise à jour disponible
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-3">
              Version {updateInfo.version} est disponible avec :
            </p>
            
            <ul className="text-white/80 text-xs space-y-1 mb-4">
              {updateInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 px-3 py-2 bg-white text-indigo-600 rounded font-medium text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Mettre à jour
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-white/20 text-white rounded text-sm hover:bg-white/30 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}