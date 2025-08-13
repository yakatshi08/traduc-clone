import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // ✅ Import ajouté
import { uploadSingle, handleUploadError } from './middleware/upload.middleware'; // ✅ Import ajouté
import { PrismaClient } from '@prisma/client'; // ✅ Nécessaire pour prisma

// Init Prisma
const prisma = new PrismaClient();

// Routes imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import transcriptionRoutes from './routes/transcription.routes';
import documentRoutes from './routes/document.routes';
import analyticsRoutes from './routes/analytics.routes';
import uploadRoutes from './routes/upload.routes'; // <-- Ajout de l'import pour les routes upload

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/transcriptions', transcriptionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes); // <-- Ajout des routes upload

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ====================
// ROUTES DE TEST SANS AUTH (pour développement)
// ====================
app.get('/api/projects-test', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { documents: true }
        }
      }
    });

    res.json({
      success: true,
      data: projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        type: p.type,
        status: p.status,
        language: p.language,
        createdAt: p.createdAt,
        documentsCount: p._count.documents
      }))
    });
  } catch (error) {
    console.error('Erreur récupération projets:', error);
    res.json({ success: false, data: [] });
  }
});

app.get('/api/upload-test/project/:projectId', async (req, res) => {
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
  } catch (error) {
    console.error('Erreur récupération documents:', error);
    res.json({ success: false, data: [] });
  }
});

// Route pour upload sans auth (TEST)
app.post(
  '/api/upload-test/single/:projectId',
  uploadSingle,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier reçu'
        });
      }

      const { projectId } = req.params;
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      let documentType: 'AUDIO' | 'VIDEO' | 'DOCUMENT' = 'DOCUMENT';
      if (req.file.mimetype.startsWith('audio/')) {
        documentType = 'AUDIO';
      } else if (req.file.mimetype.startsWith('video/')) {
        documentType = 'VIDEO';
      }

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
        data: document
      });
    } catch (error: any) {
      console.error('Erreur upload:', error);
      if (req.file) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      res.status(500).json({
        success: false,
        message: 'Erreur upload',
        error: error.message
      });
    }
  }
);

// ====================
// FIN ROUTES DE TEST
// ====================

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur TraducXion démarré sur le port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
