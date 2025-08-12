// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\services\upload.service.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration locale pour stockage temporaire
const localStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtre pour les types de fichiers
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = {
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    audio: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'audio/mp4',
      'audio/x-m4a'
    ],
    video: [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo',
      'video/x-matroska'
    ]
  };

  const allTypes = [...allowedTypes.document, ...allowedTypes.audio, ...allowedTypes.video];
  
  if (allTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non supporté: ${file.mimetype}`), false);
  }
};

// Configuration Multer
export const upload = multer({
  storage: localStorage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB max
  }
});

// Service d'upload
export const uploadService = {
  // Upload vers Cloudinary
  async uploadToCloudinary(filePath: string, options: any = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
        folder: `traducxion/${options.folder || 'documents'}`,
        public_id: options.publicId,
        ...options
      });

      // Supprimer le fichier temporaire
      await fs.unlink(filePath).catch(console.error);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        duration: result.duration // Pour audio/vidéo
      };
    } catch (error) {
      // Supprimer le fichier temporaire en cas d'erreur
      await fs.unlink(filePath).catch(console.error);
      throw error;
    }
  },

  // Upload local (fallback)
  async uploadLocal(file: Express.Multer.File, destination: string) {
    const uploadDir = path.join(process.cwd(), 'uploads', destination);
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
    const finalPath = path.join(uploadDir, filename);
    
    await fs.rename(file.path, finalPath);
    
    return {
      url: `/uploads/${destination}/${filename}`,
      path: finalPath,
      size: file.size
    };
  },

  // Vérifier le quota utilisateur
  async checkUserQuota(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('Utilisateur non trouvé');

    // Récupérer l'usage actuel
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const usage = await prisma.transcription.aggregate({
      where: {
        userId,
        createdAt: {
          gte: currentMonth
        }
      },
      _sum: {
        duration: true
      }
    });

    const usedMinutes = Math.ceil((usage._sum.duration || 0) / 60);

    // Limites par plan
    const quotaLimits: Record<string, number> = {
      free: 60,      // 60 minutes
      pro: 500,      // 500 minutes
      business: 2000, // 2000 minutes
      enterprise: -1  // Illimité
    };

    const limit = quotaLimits[user.plan] || 60;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - usedMinutes);

    return {
      plan: user.plan,
      limit,
      used: usedMinutes,
      remaining,
      percentage: limit === -1 ? 0 : Math.round((usedMinutes / limit) * 100)
    };
  },

  // Supprimer de Cloudinary
  async deleteFromCloudinary(publicId: string, resourceType: string = 'auto') {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error('Erreur suppression Cloudinary:', error);
    }
  },

  // Obtenir l'URL de transformation
  getTransformationUrl(publicId: string, transformations: any) {
    return cloudinary.url(publicId, transformations);
  }
};