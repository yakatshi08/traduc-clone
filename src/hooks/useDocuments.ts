// src/hooks/useDocuments.ts

import { useState, useEffect, useCallback } from 'react';
import apiClient, { Document, PaginatedResponse } from '@/services/api';
import toast from 'react-hot-toast';

export function useDocuments(projectId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchDocuments = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getDocuments({
        projectId,
        page,
        limit: 20,
      });
      
      setDocuments(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const uploadDocument = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    try {
      const document = await apiClient.uploadDocument(file, {
        projectId,
        onProgress,
      });
      
      // Ajouter le nouveau document à la liste
      setDocuments(prev => [document, ...prev]);
      toast.success('Document uploadé avec succès');
      
      return document;
    } catch (error: any) {
      toast.error(error.message || 'Erreur upload');
      throw error;
    }
  }, [projectId]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await apiClient.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document supprimé');
    } catch (error: any) {
      toast.error(error.message || 'Erreur suppression');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Écouter les événements WebSocket
  useEffect(() => {
    const handleDocumentUpdate = (event: CustomEvent) => {
      const { documentId, status } = event.detail;
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId ? { ...doc, status } : doc
        )
      );
    };

    window.addEventListener('document:update', handleDocumentUpdate);
    
    return () => {
      window.removeEventListener('document:update', handleDocumentUpdate);
    };
  }, []);

  return {
    documents,
    loading,
    error,
    pagination,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    refresh: () => fetchDocuments(pagination.page),
  };
}