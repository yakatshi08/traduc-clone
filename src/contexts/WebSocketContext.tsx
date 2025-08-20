// src/contexts/WebSocketContext.tsx

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (type: string, data: any) => void;
  subscribe: (event: string, callback: (data: any) => void) => () => void;
  lastMessage: WebSocketMessage | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const listeners = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<WebSocketContextType['connectionStatus']>('disconnected');
  
  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

  // Connexion WebSocket
  const connect = useCallback(() => {
    if (!isAuthenticated || ws.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    
    try {
      ws.current = new WebSocket(WS_URL);
      
      ws.current.onopen = () => {
        console.log('✅ WebSocket connecté');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Authentifier la connexion
        const token = localStorage.getItem('traduckxion_token');
        if (token) {
          ws.current?.send(JSON.stringify({
            type: 'auth',
            token,
            userId: user?.id
          }));
        }
        
        // Clear reconnect timeout
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Dispatcher aux listeners
          const eventListeners = listeners.current.get(message.type);
          if (eventListeners) {
            eventListeners.forEach(callback => callback(message.data));
          }
          
          // Notifications spécifiques
          handleWebSocketNotifications(message);
        } catch (error) {
          console.error('Erreur parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket erreur:', error);
        setConnectionStatus('error');
      };

      ws.current.onclose = () => {
        console.log('🔴 WebSocket déconnecté');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Reconnexion automatique après 5 secondes
        if (isAuthenticated) {
          reconnectTimeout.current = setTimeout(() => {
            console.log('🔄 Tentative de reconnexion...');
            connect();
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Erreur création WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [isAuthenticated, user, WS_URL]);

  // Déconnexion
  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Envoyer un message
  const sendMessage = useCallback((type: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('WebSocket non connecté, impossible d\'envoyer le message');
    }
  }, []);

  // S'abonner à un événement
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event)!.add(callback);
    
    // Retourner une fonction de désinscription
    return () => {
      const eventListeners = listeners.current.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          listeners.current.delete(event);
        }
      }
    };
  }, []);

  // Gérer les notifications WebSocket
  const handleWebSocketNotifications = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'transcription:started':
        toast.loading(`Transcription démarrée pour ${message.data.fileName}`, { id: `trans-${message.data.id}` });
        break;
        
      case 'transcription:progress':
        toast.loading(`Transcription en cours: ${message.data.progress}%`, { id: `trans-${message.data.id}` });
        break;
        
      case 'transcription:completed':
        toast.success(`Transcription terminée !`, { id: `trans-${message.data.id}` });
        break;
        
      case 'transcription:error':
        toast.error(`Erreur transcription: ${message.data.error}`, { id: `trans-${message.data.id}` });
        break;
        
      case 'translation:completed':
        toast.success(`Traduction terminée en ${message.data.targetLanguage}`);
        break;
        
      case 'notification':
        if (message.data.type === 'success') toast.success(message.data.message);
        else if (message.data.type === 'error') toast.error(message.data.message);
        else toast(message.data.message);
        break;
    }
  };

  // Connexion/déconnexion selon l'état d'authentification
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        subscribe,
        lastMessage,
        connectionStatus
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}