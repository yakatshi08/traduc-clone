// src/hooks/useTranscription.ts

import { useState, useCallback, useEffect } from 'react';
import apiClient, { Transcription, TranscriptionSegment } from '@/services/api';
import toast from 'react-hot-toast';

export function useTranscription(documentId?: string) {
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const createTranscription = useCallback(async (
    docId: string,
    options?: {
      language?: string;
      model?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const result = await apiClient.createTranscription(docId, options);
      setTranscription(result);
      toast.success('Transcription démarrée');
      return result;
    } catch (err: any) {
      setError(err);
      toast.error(err.message || 'Erreur transcription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTranscription = useCallback(async (
    id: string,
    updates: {
      text?: string;
      segments?: TranscriptionSegment[];
    }
  ) => {
    try {
      const updated = await apiClient.updateTranscription(id, updates);
      setTranscription(updated);
      toast.success('Transcription mise à jour');
      return updated;
    } catch (error: any) {
      toast.error(error.message || 'Erreur mise à jour');
      throw error;
    }
  }, []);

  const exportTranscription = useCallback(async (
    id: string,
    format: 'srt' | 'vtt' | 'txt' | 'json' | 'docx' | 'pdf'
  ) => {
    try {
      const blob = await apiClient.exportTranscription(id, format);
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Export ${format.toUpperCase()} réussi`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur export');
      throw error;
    }
  }, []);

  // Écouter les événements WebSocket de progression
  useEffect(() => {
    const handleProgress = (event: CustomEvent) => {
      if (event.detail.documentId === documentId) {
        setProgress(event.detail.progress);
      }
    };

    const handleComplete = (event: CustomEvent) => {
      if (event.detail.documentId === documentId) {
        setTranscription(event.detail.transcription);
        setProgress(100);
        setLoading(false);
      }
    };

    window.addEventListener('transcription:progress', handleProgress);
    window.addEventListener('transcription:complete', handleComplete);
    
    return () => {
      window.removeEventListener('transcription:progress', handleProgress);
      window.removeEventListener('transcription:complete', handleComplete);
    };
  }, [documentId]);

  return {
    transcription,
    loading,
    progress,
    error,
    createTranscription,
    updateTranscription,
    exportTranscription,
  };
}