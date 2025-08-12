// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\controllers\project.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/auth.types';

const prisma = new PrismaClient();

export const projectController = {
  // Obtenir tous les projets de l'utilisateur
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const userId = req.user?.id;

      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        userId,
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' as const } },
            { description: { contains: String(search), mode: 'insensitive' as const } }
          ]
        })
      };

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            _count: {
              select: {
                documents: true,
                transcriptions: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.project.count({ where })
      ]);

      res.json({
        success: true,
        data: projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des projets' 
      });
    }
  },

  // Obtenir un projet par ID
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const project = await prisma.project.findFirst({
        where: {
          id,
          userId
        },
        include: {
          documents: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          transcriptions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              documents: true,
              transcriptions: true
            }
          }
        }
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du projet'
      });
    }
  },

  // Créer un nouveau projet
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, description, language, type } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du projet est requis'
        });
      }

      const project = await prisma.project.create({
        data: {
          name,
          description,
          language: language || 'fr',
          type: type || 'general',
          userId
        }
      });

      res.status(201).json({
        success: true,
        data: project,
        message: 'Projet créé avec succès'
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du projet'
      });
    }
  },

  // Mettre à jour un projet
  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { name, description, language, type, status } = req.body;

      // Vérifier que le projet appartient à l'utilisateur
      const existingProject = await prisma.project.findFirst({
        where: { id, userId }
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(language && { language }),
          ...(type && { type }),
          ...(status && { status })
        }
      });

      res.json({
        success: true,
        data: project,
        message: 'Projet mis à jour avec succès'
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du projet'
      });
    }
  },

  // Supprimer un projet
  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Vérifier que le projet appartient à l'utilisateur
      const project = await prisma.project.findFirst({
        where: { id, userId }
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      // Supprimer le projet (les documents et transcriptions seront supprimés en cascade)
      await prisma.project.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Projet supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du projet'
      });
    }
  },

  // Obtenir les statistiques des projets
  async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const [
        totalProjects,
        activeProjects,
        totalDocuments,
        totalTranscriptions,
        recentProjects
      ] = await Promise.all([
        prisma.project.count({ where: { userId } }),
        prisma.project.count({ where: { userId, status: 'active' } }),
        prisma.document.count({ where: { project: { userId } } }),
        prisma.transcription.count({ where: { project: { userId } } }),
        prisma.project.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            _count: {
              select: {
                documents: true,
                transcriptions: true
              }
            }
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalProjects,
          activeProjects,
          totalDocuments,
          totalTranscriptions,
          recentProjects
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }
};