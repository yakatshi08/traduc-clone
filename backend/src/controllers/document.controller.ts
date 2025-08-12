// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\controllers\document.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/auth.types';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { uploadService } from '../services/upload.service';

const prisma = new PrismaClient();

// Configuration Multer pour l'upload (garde la config existante)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'temp'); // Changé en temp
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Types de fichiers acceptés (garder existant + ajouter quelques types)
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB max
  }
});

export const documentController = {
  // Garder getAll existant (pas de changement)
  async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { 
        page = 1, 
        limit = 10, 
        projectId, 
        type, 
        search = '' 
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {
        userId // Changé de project: { userId } à userId direct
      };

      if (projectId) {
        where.projectId = projectId;
      }

      if (type) {
        where.type = type;
      }

      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { originalName: { contains: String(search), mode: 'insensitive' } }
        ];
      }

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            project: {
              select: {
                id: true,
                name: true
              }
            },
            transcriptions: {
              select: {
                id: true,
                status: true,
                createdAt: true
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.document.count({ where })
      ]);

      res.json({
        success: true,
        data: documents,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des documents'
      });
    }
  },

  // Garder getById existant (ajuster la requête where)
  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const document = await prisma.document.findFirst({
        where: {
          id,
          userId // Changé de project: { userId } à userId direct
        },
        include: {
          project: true,
          transcriptions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du document'
      });
    }
  },

  // Upload AMÉLIORÉ avec Cloudinary et quotas
  async upload(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { projectId, useCloudinary = 'false' } = req.body;
      const file = req.file;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
      }

      // Vérifier le quota utilisateur
      const quota = await uploadService.checkUserQuota(userId);
      
      // Pour les fichiers audio/vidéo, vérifier si le quota est suffisant
      const isMediaFile = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/');
      
      if (isMediaFile && quota.remaining !== -1 && quota.remaining <= 0) {
        // Supprimer le fichier temporaire
        await fs.unlink(file.path).catch(console.error);
        return res.status(403).json({
          success: false,
          message: 'Quota mensuel dépassé',
          quota
        });
      }

      // Vérifier que le projet existe et appartient à l'utilisateur
      if (projectId) {
        const project = await prisma.project.findFirst({
          where: { id: projectId, userId }
        });

        if (!project) {
          // Supprimer le fichier uploadé
          await fs.unlink(file.path).catch(console.error);
          return res.status(404).json({
            success: false,
            message: 'Projet non trouvé'
          });
        }
      }

      // Déterminer le type de document
      let type = 'document';
      let folder = 'documents';
      
      if (file.mimetype.startsWith('audio/')) {
        type = 'audio';
        folder = 'audios';
      } else if (file.mimetype.startsWith('video/')) {
        type = 'video';
        folder = 'videos';
      }

      let uploadResult: any = {};
      let finalPath = file.path;
      let publicId = null;
      let storageType = 'local';

      // Upload vers Cloudinary ou déplacer en local
      if (useCloudinary === 'true' && process.env.CLOUDINARY_API_KEY) {
        try {
          uploadResult = await uploadService.uploadToCloudinary(file.path, {
            folder: `traducxion/${folder}`,
            resource_type: 'auto'
          });
          finalPath = uploadResult.url;
          publicId = uploadResult.publicId;
          storageType = 'cloudinary';
        } catch (cloudinaryError) {
          console.error('Cloudinary upload failed, falling back to local:', cloudinaryError);
          // Fallback sur stockage local
          uploadResult = await uploadService.uploadLocal(file, folder);
          finalPath = uploadResult.path;
        }
      } else {
        // Déplacer le fichier du dossier temp vers le dossier final
        const destinationDir = path.join(process.cwd(), 'uploads', folder);
        await fs.mkdir(destinationDir, { recursive: true });
        const newPath = path.join(destinationDir, path.basename(file.path));
        await fs.rename(file.path, newPath);
        finalPath = newPath;
      }

      // Créer l'entrée en base de données
      const document = await prisma.document.create({
        data: {
          name: path.parse(file.originalname).name,
          originalName: file.originalname,
          path: finalPath,
          publicId: publicId,
          size: file.size,
          mimeType: file.mimetype,
          type,
          duration: uploadResult.duration || null,
          storageType,
          userId,
          projectId
        },
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: document,
        quota: isMediaFile ? quota : undefined,
        message: 'Document uploadé avec succès'
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      // Supprimer le fichier en cas d'erreur
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload du document'
      });
    }
  },

  // Garder update existant (pas de changement)
  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { name, projectId } = req.body;

      // Vérifier que le document appartient à l'utilisateur
      const existingDocument = await prisma.document.findFirst({
        where: {
          id,
          userId // Changé de project: { userId } à userId direct
        }
      });

      if (!existingDocument) {
        return res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
      }

      // Si changement de projet, vérifier que le nouveau projet appartient à l'utilisateur
      if (projectId && projectId !== existingDocument.projectId) {
        const project = await prisma.project.findFirst({
          where: { id: projectId, userId }
        });

        if (!project) {
          return res.status(404).json({
            success: false,
            message: 'Projet non trouvé'
          });
        }
      }

      const document = await prisma.document.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(projectId && { projectId })
        }
      });

      res.json({
        success: true,
        data: document,
        message: 'Document mis à jour avec succès'
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du document'
      });
    }
  },

  // Delete AMÉLIORÉ avec support Cloudinary
  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Vérifier que le document appartient à l'utilisateur
      const document = await prisma.document.findFirst({
        where: {
          id,
          userId // Changé de project: { userId } à userId direct
        }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
      }

      // Supprimer de Cloudinary si nécessaire
      if (document.storageType === 'cloudinary' && document.publicId) {
        await uploadService.deleteFromCloudinary(document.publicId);
      } else {
        // Supprimer le fichier physique local
        try {
          await fs.unlink(document.path);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }

      // Supprimer l'entrée en base de données
      await prisma.document.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Document supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du document'
      });
    }
  },

  // Garder download existant (avec petite amélioration pour Cloudinary)
  async download(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const document = await prisma.document.findFirst({
        where: {
          id,
          userId // Changé de project: { userId } à userId direct
        }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
      }

      // Si c'est un fichier Cloudinary, rediriger vers l'URL
      if (document.storageType === 'cloudinary') {
        return res.redirect(document.path);
      }

      // Sinon, télécharger le fichier local
      try {
        await fs.access(document.path);
      } catch {
        return res.status(404).json({
          success: false,
          message: 'Fichier non trouvé sur le serveur'
        });
      }

      res.download(document.path, document.originalName);
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement du document'
      });
    }
  },

  // NOUVELLE MÉTHODE : Obtenir les statistiques d'usage
  async getUsageStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const quota = await uploadService.checkUserQuota(userId);

      // Statistiques par type
      const stats = await prisma.document.groupBy({
        by: ['type'],
        where: { userId },
        _count: {
          _all: true
        },
        _sum: {
          size: true
        }
      });

      // Total storage used
      const totalStorage = await prisma.document.aggregate({
        where: { userId },
        _sum: {
          size: true
        },
        _count: {
          _all: true
        }
      });

      res.json({
        success: true,
        data: {
          quota,
          storage: {
            total: totalStorage._sum.size || 0,
            totalFiles: totalStorage._count._all || 0,
            byType: stats.map(s => ({
              type: s.type,
              count: s._count._all,
              totalSize: s._sum.size || 0
            }))
          }
        }
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }
};