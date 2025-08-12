// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\services\google-drive.service.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

const prisma = new PrismaClient();
const pipeline = promisify(stream.pipeline);

// Configuration OAuth2
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes nécessaires
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

export const googleDriveService = {
  // Générer l'URL d'autorisation
  getAuthUrl(state?: string) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state || '',
      prompt: 'consent'
    });
  },

  // Échanger le code contre les tokens
  async getTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  },

  // Créer un client Drive authentifié
  getDriveClient(accessToken: string, refreshToken?: string) {
    const auth = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    return google.drive({ version: 'v3', auth });
  },

  // Lister les fichiers
  async listFiles(accessToken: string, options: any = {}) {
    const drive = this.getDriveClient(accessToken);
    
    const query = [];
    
    // Filtrer par type de fichier
    if (options.mimeType) {
      query.push(`mimeType='${options.mimeType}'`);
    }
    
    // Filtrer par nom
    if (options.name) {
      query.push(`name contains '${options.name}'`);
    }

    // Types de fichiers supportés pour transcription
    const supportedTypes = [
      'application/pdf',
      'application/vnd.google-apps.document',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'text/plain'
    ];

    if (options.onlySupported) {
      const mimeQuery = supportedTypes.map(type => `mimeType='${type}'`).join(' or ');
      query.push(`(${mimeQuery})`);
    }

    const response = await drive.files.list({
      pageSize: options.pageSize || 20,
      pageToken: options.pageToken,
      q: query.length > 0 ? query.join(' and ') : undefined,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, iconLink, webViewLink, parents)',
      orderBy: options.orderBy || 'modifiedTime desc'
    });

    return {
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken
    };
  },

  // Obtenir les détails d'un fichier
  async getFile(fileId: string, accessToken: string) {
    const drive = this.getDriveClient(accessToken);
    
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, modifiedTime, description, iconLink, webViewLink, webContentLink'
    });

    return response.data;
  },

  // Importer un fichier depuis Google Drive
  async importFile(fileId: string, accessToken: string, userId: string, projectId?: string) {
    const drive = this.getDriveClient(accessToken);
    
    try {
      // Obtenir les métadonnées du fichier
      const fileMetadata = await this.getFile(fileId, accessToken);
      
      // Déterminer le type de document
      let type = 'document';
      if (fileMetadata.mimeType?.startsWith('audio/')) {
        type = 'audio';
      } else if (fileMetadata.mimeType?.startsWith('video/')) {
        type = 'video';
      }

      // Créer le dossier de destination
      const uploadDir = path.join(process.cwd(), 'uploads', 'google-drive');
      await fs.promises.mkdir(uploadDir, { recursive: true });
      
      // Nom de fichier unique
      const timestamp = Date.now();
      const safeFileName = fileMetadata.name.replace(/[^a-z0-9.-]/gi, '_');
      const localPath = path.join(uploadDir, `${timestamp}-${safeFileName}`);

      // Gérer les Google Docs (export en PDF)
      let downloadOptions: any = { fileId, alt: 'media' };
      
      if (fileMetadata.mimeType === 'application/vnd.google-apps.document') {
        // Exporter Google Doc en PDF
        const exportResponse = await drive.files.export({
          fileId,
          mimeType: 'application/pdf'
        }, { responseType: 'stream' });
        
        const writer = fs.createWriteStream(localPath + '.pdf');
        await pipeline(exportResponse.data, writer);
        
        // Créer l'entrée en base de données
        const document = await prisma.document.create({
          data: {
            name: fileMetadata.name,
            originalName: fileMetadata.name + '.pdf',
            path: localPath + '.pdf',
            size: 0, // Sera mis à jour après
            mimeType: 'application/pdf',
            type: 'document',
            storageType: 'google-drive',
            googleDriveId: fileId,
            userId,
            projectId
          }
        });

        // Mettre à jour la taille
        const stats = await fs.promises.stat(localPath + '.pdf');
        await prisma.document.update({
          where: { id: document.id },
          data: { size: stats.size }
        });

        return document;
        
      } else {
        // Télécharger le fichier normal
        const response = await drive.files.get(
          downloadOptions,
          { responseType: 'stream' }
        );
        
        const writer = fs.createWriteStream(localPath);
        await pipeline(response.data, writer);
        
        // Obtenir la taille du fichier
        const stats = await fs.promises.stat(localPath);
        
        // Créer l'entrée en base de données
        const document = await prisma.document.create({
          data: {
            name: fileMetadata.name,
            originalName: fileMetadata.name,
            path: localPath,
            size: stats.size,
            mimeType: fileMetadata.mimeType || 'application/octet-stream',
            type,
            storageType: 'google-drive',
            googleDriveId: fileId,
            userId,
            projectId
          }
        });

        return document;
      }
      
    } catch (error) {
      console.error('Error importing from Google Drive:', error);
      throw new Error(`Erreur lors de l'import: ${error.message}`);
    }
  },

  // Sauvegarder les tokens de l'utilisateur
  async saveUserTokens(userId: string, tokens: any) {
    // Sauvegarder les tokens dans la base de données
    // Vous pouvez créer une table UserIntegration pour ça
    await prisma.userIntegration.upsert({
      where: {
        userId_provider: {
          userId,
          provider: 'google-drive'
        }
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + (tokens.expires_in * 1000))
      },
      create: {
        userId,
        provider: 'google-drive',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + (tokens.expires_in * 1000))
      }
    });
  },

  // Obtenir les tokens de l'utilisateur
  async getUserTokens(userId: string) {
    const integration = await prisma.userIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'google-drive'
        }
      }
    });

    if (!integration) {
      return null;
    }

    // Vérifier si le token est expiré
    if (integration.expiresAt < new Date()) {
      // Rafraîchir le token
      oauth2Client.setCredentials({
        refresh_token: integration.refreshToken
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Mettre à jour les tokens
      await this.saveUserTokens(userId, {
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || integration.refreshToken,
        expires_in: credentials.expiry_date 
          ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
          : 3600
      });

      return credentials.access_token;
    }

    return integration.accessToken;
  },

  // Déconnecter Google Drive
  async disconnect(userId: string) {
    await prisma.userIntegration.delete({
      where: {
        userId_provider: {
          userId,
          provider: 'google-drive'
        }
      }
    });
  }
};