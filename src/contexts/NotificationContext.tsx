// src/contexts/NotificationContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from './WebSocketContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { subscribe } = useWebSocket();

  // Charger les notifications du localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('traduckxion_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('traduckxion_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // S'abonner aux notifications WebSocket
  useEffect(() => {
    const unsubscribe = subscribe('notification', (data) => {
      addNotification({
        type: data.type || 'info',
        title: data.title,
        message: data.message,
        action: data.action,
        persistent: data.persistent
      });
    });

    return unsubscribe;
  }, [subscribe]);

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Garder max 50 notifications

    // Auto-suppression après 10 secondes si non persistante
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('traduckxion_notifications');
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
      <NotificationToasts notifications={notifications} />
    </NotificationContext.Provider>
  );
}

// Composant pour afficher les toasts de notification
function NotificationToasts({ notifications }: { notifications: Notification[] }) {
  const recentNotifications = notifications
    .filter(n => !n.read && Date.now() - n.timestamp.getTime() < 10000)
    .slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {recentNotifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`
              max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-lg border
              ${notification.type === 'error' 
                ? 'bg-red-900/90 border-red-700' 
                : notification.type === 'warning'
                ? 'bg-amber-900/90 border-amber-700'
                : notification.type === 'success'
                ? 'bg-green-900/90 border-green-700'
                : 'bg-gray-800/90 border-gray-700'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'error' ? (
                  <X className="w-5 h-5 text-red-400" />
                ) : notification.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : notification.type === 'success' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Info className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                )}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="text-sm text-indigo-400 hover:text-indigo-300 mt-2"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}