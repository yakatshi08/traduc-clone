import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';

// Configuration S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-3',
});

// Fonction pour générer un nom de fichier unique
const generateFilename = (req: Request, file: Express.Multer.File, cb: Function) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(file.originalname);
  const name = path.basename(file.originalname, extension);
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  cb(null, `${cleanName}-${timestamp}-${random}${extension}`);
};

// Configuration pour S3
export const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'traducxion-uploads',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        userId: (req as any).user?.id || 'anonymous',
      });
    },
    key: generateFilename,
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/webm',
      'audio/ogg',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté: ${file.mimetype}`));
    }
  },
});

// Configuration pour stockage local
export const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: generateFilename,
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB pour local
  },
});

// Configuration pour mémoire (pour Cloudinary)
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Export par défaut basé sur l'environnement
export const upload = process.env.NODE_ENV === 'production' ? uploadS3 : uploadLocal;