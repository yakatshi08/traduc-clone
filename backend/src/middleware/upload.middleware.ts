import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../../uploads');
const tempDir = path.join(uploadDir, 'temp');
const audioDir = path.join(uploadDir, 'audio');
const videoDir = path.join(uploadDir, 'video');
const documentsDir = path.join(uploadDir, 'documents');

// Créer les dossiers
[uploadDir, tempDir, audioDir, videoDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Dossier créé: ${dir}`);
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = tempDir;
    
    // Déterminer le dossier selon le type MIME
    if (file.mimetype.startsWith('audio/')) {
      uploadPath = audioDir;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = videoDir;
    } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      uploadPath = documentsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtre des fichiers
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Types de fichiers acceptés
  const allowedMimeTypes = [
    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'audio/x-m4a',
    'audio/mp4',
    'audio/aac',
    
    // Video
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/x-flv',
    'video/avi',
    
    // Documents (optionnel)
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Extensions autorisées
  const allowedExtensions = [
    '.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac', '.wma', '.opus',
    '.mp4', '.avi', '.mkv', '.mov', '.webm', '.flv', '.wmv',
    '.pdf', '.doc', '.docx'
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non supporté: ${file.mimetype} (${ext})`));
  }
};

// Configuration Multer
export const uploadConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max
    files: 10 // Max 10 fichiers à la fois
  }
});

// Middleware pour gérer les erreurs Multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux (max 500MB)'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers (max 10)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erreur upload: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload'
    });
  }
  next();
};

// Types d'export
export const uploadSingle = uploadConfig.single('file');
export const uploadMultiple = uploadConfig.array('files', 10);
export const uploadFields = uploadConfig.fields([
  { name: 'audio', maxCount: 5 },
  { name: 'video', maxCount: 5 },
  { name: 'document', maxCount: 10 }
]);