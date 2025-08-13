import { Router } from 'express';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.middleware';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Upload d'un seul fichier
router.post('/single/:projectId', uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier reçu'
      });
    }

    const { projectId } = req.params;
    
    console.log('📤 Fichier reçu:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      // Supprimer le fichier uploadé
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    // Déterminer le type de document
    let documentType: 'AUDIO' | 'VIDEO' | 'DOCUMENT' = 'DOCUMENT';
    if (req.file.mimetype.startsWith('audio/')) {
      documentType = 'AUDIO';
    } else if (req.file.mimetype.startsWith('video/')) {
      documentType = 'VIDEO';
    }

    // Créer l'enregistrement dans la base
    const document = await prisma.document.create({
      data: {
        name: req.file.originalname,
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
        format: path.extname(req.file.originalname).substring(1),
        mimeType: req.file.mimetype,
        type: documentType,
        storageType: 'local',
        status: 'uploaded',
        userId: project.userId,
        projectId: projectId
      }
    });

    res.json({
      success: true,
      message: 'Fichier uploadé avec succès',
      data: {
        id: document.id,
        name: document.name,
        type: document.type,
        size: document.size,
        status: document.status,
        url: document.url
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur upload:', error);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// Upload de plusieurs fichiers
router.post('/multiple/:projectId', uploadMultiple, handleUploadError, async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier reçu'
      });
    }

    const { projectId } = req.params;
    
    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      // Supprimer les fichiers uploadés
      files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {}
      });
      
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    // Créer les enregistrements dans la base
    const documents = await Promise.all(
      files.map(file => {
        // Déterminer le type de document
        let documentType: 'AUDIO' | 'VIDEO' | 'DOCUMENT' = 'DOCUMENT';
        if (file.mimetype.startsWith('audio/')) {
          documentType = 'AUDIO';
        } else if (file.mimetype.startsWith('video/')) {
          documentType = 'VIDEO';
        }

        return prisma.document.create({
          data: {
            name: file.originalname,
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            url: `/uploads/${file.filename}`,
            size: file.size,
            format: path.extname(file.originalname).substring(1),
            mimeType: file.mimetype,
            type: documentType,
            storageType: 'local',
            status: 'uploaded',
            userId: project.userId,
            projectId: projectId
          }
        });
      })
    );

    res.json({
      success: true,
      message: `${documents.length} fichier(s) uploadé(s) avec succès`,
      data: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        status: doc.status,
        url: doc.url
      }))
    });

  } catch (error: any) {
    console.error('❌ Erreur upload multiple:', error);
    
    // Nettoyer les fichiers en cas d'erreur
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {}
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
});

// Obtenir les fichiers d'un projet
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: documents
    });
  } catch (error: any) {
    console.error('❌ Erreur récupération documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents'
    });
  }
});

// Supprimer un fichier
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

    // Supprimer le fichier physique
    if (document.path && fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    // Supprimer de la base
    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({
      success: true,
      message: 'Document supprimé avec succès'
    });
  } catch (error: any) {
    console.error('❌ Erreur suppression document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

export default router;