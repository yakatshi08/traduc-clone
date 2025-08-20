// src/components/common/OfflineIndicator.tsx

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Masquer le message après 3 secondes
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier périodiquement la connexion
    const interval = setInterval(() => {
      fetch('/api/health', { method: 'HEAD' })
        .then(() => {
          if (!isOnline) handleOnline();
        })
        .catch(() => {
          if (isOnline) handleOffline();
        });
    }, 30000); // Toutes les 30 secondes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  return (
    <>
      {/* Indicateur hors ligne */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-50 bg-red-600 text-white py-3 px-4"
          >
            <div className="container mx-auto flex items-center justify-center gap-3">
              <WifiOff className="w-5 h-5 animate-pulse" />
              <span className="font-medium">
                Vous êtes hors ligne
              </span>
              <span className="text-red-200 text-sm">
                • Certaines fonctionnalités peuvent être limitées
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de reconnexion */}
      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className="bg-green-600 text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
              <Wifi className="w-5 h-5" />
              <span>Connexion rétablie</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur permanent en bas */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-gray-800 border border-red-600 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-white">Mode hors ligne</p>
              <p className="text-xs text-gray-400">
                Les données sont en cache local
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}