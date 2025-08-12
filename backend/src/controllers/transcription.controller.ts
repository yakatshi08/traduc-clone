// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\controllers\transcription.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { transcriptionService } from '../services/transcription.service';
import { PrismaClient, TranscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const transcriptionController = {
  // Créer une nouvelle transcription
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { documentId, language, engine, domain } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message: 'Document ID requis'
        });
      }

      // Créer la transcription
      const transcription = await transcriptionService.createTranscription(
        documentId,
        userId,
        {
          language: language || 'fr',
          engine: engine || 'whisper',
          domain
        }
      );

      res.status(201).json({
        success: true,
        data: transcription,
        message: 'Transcription démarrée'
      });
    } catch (error: any) {
      console.error('Error creating transcription:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la création de la transcription'
      });
    }
  },

  // Obtenir toutes les transcriptions de l'utilisateur
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { 
        page = 1, 
        limit = 10, 
        projectId, 
        status,
        documentId 
      } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { userId };

      if (projectId) {
        where.projectId = projectId;
      }

      if (documentId) {
        where.documentId = documentId;
      }

      if (status) {
        where.status = status as TranscriptionStatus;
      }

      const [transcriptions, total] = await Promise.all([
        prisma.transcription.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            document: {
              select: {
                id: true,
                name: true,
                type: true,
                mimeType: true
              }
            },
            project: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.transcription.count({ where })
      ]);

      res.json({
        success: true,
        data: transcriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des transcriptions'
      });
    }
  },

  // Obtenir une transcription par ID
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const transcription = await prisma.transcription.findFirst({
        where: {
          id,
          userId
        },
        include: {
          document: {
            select: {
              id: true,
              name: true,
              type: true,
              mimeType: true,
              size: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (!transcription) {
        return res.status(404).json({
          success: false,
          message: 'Transcription non trouvée'
        });
      }

      res.json({
        success: true,
        data: transcription
      });
    } catch (error) {
      console.error('Error fetching transcription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la transcription'
      });
    }
  },

  // Obtenir le statut d'une transcription
  async getStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const transcription = await prisma.transcription.findFirst({
        where: {
          id,
          userId
        },
        select: {
          id: true,
          status: true,
          accuracy: true,
          duration: true,
          wordCount: true,
          createdAt: true,
          startedAt: true,
          completedAt: true,
          error: true
        }
      });

      if (!transcription) {
        return res.status(404).json({
          success: false,
          message: 'Transcription non trouvée'
        });
      }

      res.json({
        success: true,
        data: transcription
      });
    } catch (error) {
      console.error('Error fetching status:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du statut'
      });
    }
  },

  // Effectuer une QA sur la transcription
  async performQA(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      // Vérifier que la transcription appartient à l'utilisateur
      const transcription = await prisma.transcription.findFirst({
        where: {
          id,
          userId,
          status: TranscriptionStatus.COMPLETED
        }
      });

      if (!transcription) {
        return res.status(404).json({
          success: false,
          message: 'Transcription non trouvée ou non complétée'
        });
      }

      const qaResults = await transcriptionService.performQualityAssurance(id);

      res.json({
        success: true,
        data: qaResults
      });
    } catch (error) {
      console.error('Error performing QA:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'analyse qualité'
      });
    }
  },

  // Annuler une transcription
  async cancel(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const transcription = await transcriptionService.cancelTranscription(id, userId);

      res.json({
        success: true,
        data: transcription,
        message: 'Transcription annulée'
      });
    } catch (error: any) {
      console.error('Error cancelling transcription:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'annulation'
      });
    }
  },

  // Supprimer une transcription
  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      // Vérifier que la transcription appartient à l'utilisateur
      const transcription = await prisma.transcription.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!transcription) {
        return res.status(404).json({
          success: false,
          message: 'Transcription non trouvée'
        });
      }

      // Supprimer la transcription
      await prisma.transcription.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Transcription supprimée'
      });
    } catch (error) {
      console.error('Error deleting transcription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
  }
};

export default transcriptionController;