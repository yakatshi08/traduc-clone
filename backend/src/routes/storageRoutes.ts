import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { uploadMemory } from '../config/multer';
import { storageService } from '../services/storageService';

const router = Router();

// Upload de fichier
router.post('/upload', 
  authenticate, 
  uploadMemory.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
      }

      const result = await storageService.upload(req.file, {
        userId: req.user.id,
        projectId: req.body.projectId,
        folder: req.body.folder || `users/${req.user.id}`,
        public: req.body.public === 'true',
        generateThumbnail: req.body.generateThumbnail === 'true',
        provider: req.body.provider || process.env.DEFAULT_STORAGE_PROVIDER,
        metadata: {
          uploadedBy: req.user.email,
          originalName: req.file.originalname,
          ...req.body.metadata
        }
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload',
        error: error.message
      });
    }
  }
);

// Upload multiple
router.post('/upload-multiple',
  authenticate,
  uploadMemory.array('files', 10),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
      }

      const results = await Promise.all(
        files.map(file => 
          storageService.upload(file, {
            userId: req.user.id,
            projectId: req.body.projectId,
            folder: req.body.folder || `users/${req.user.id}`,
            provider: req.body.provider
          })
        )
      );

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload multiple'
      });
    }
  }
);

// Obtenir l'URL d'un fichier
router.get('/url/:fileId', authenticate, async (req, res) => {
  try {
    const url = await storageService.getUrl(req.params.fileId, {
      provider: req.query.provider as string,
      download: req.query.download === 'true',
      expiresIn: parseInt(req.query.expiresIn as string) || 3600
    });

    res.json({
      success: true,
      data: { url }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'URL'
    });
  }
});

// Supprimer un fichier
router.delete('/:fileId', authenticate, async (req, res) => {
  try {
    const success = await storageService.delete(
      req.params.fileId,
      req.query.provider as string
    );

    if (success) {
      res.json({
        success: true,
        message: 'Fichier supprimé'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

// Lister les fichiers
router.get('/list', authenticate, async (req, res) => {
  try {
    const files = await storageService.list(
      req.query.prefix as string,
      req.query.provider as string
    );

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des fichiers'
    });
  }
});

export default router;