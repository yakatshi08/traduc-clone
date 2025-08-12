// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\controllers\google-drive.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { googleDriveService } from '../services/google-drive.service';

export const googleDriveController = {
  // Initier l'authentification OAuth2
  async auth(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      // Générer l'URL d'autorisation avec l'ID utilisateur dans le state
      const authUrl = googleDriveService.getAuthUrl(userId);

      res.json({
        success: true,
        authUrl
      });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de l\'URL d\'autorisation'
      });
    }
  },

  // Callback OAuth2
  async callback(req: AuthRequest, res: Response) {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Code d\'autorisation manquant'
        });
      }

      // Échanger le code contre les tokens
      const tokens = await googleDriveService.getTokens(code as string);
      
      // Sauvegarder les tokens pour l'utilisateur (state contient l'userId)
      const userId = state as string || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non identifié'
        });
      }

      await googleDriveService.saveUserTokens(userId, tokens);

      // Rediriger vers le frontend avec succès
      res.redirect(`${process.env.FRONTEND_URL}/settings?googleDrive=connected`);
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/settings?googleDrive=error`);
    }
  },

  // Lister les fichiers Google Drive
  async listFiles(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { pageToken, search, mimeType, onlySupported } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      // Obtenir le token de l'utilisateur
      const accessToken = await googleDriveService.getUserTokens(userId);
      
      if (!accessToken) {
        return res.status(403).json({
          success: false,
          message: 'Google Drive non connecté',
          needsAuth: true
        });
      }

      // Lister les fichiers
      const result = await googleDriveService.listFiles(accessToken, {
        pageToken,
        name: search,
        mimeType,
        onlySupported: onlySupported === 'true'
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error listing files:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des fichiers'
      });
    }
  },

  // Importer un fichier depuis Google Drive
  async importFile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { fileId, projectId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: 'ID de fichier requis'
        });
      }

      // Obtenir le token de l'utilisateur
      const accessToken = await googleDriveService.getUserTokens(userId);
      
      if (!accessToken) {
        return res.status(403).json({
          success: false,
          message: 'Google Drive non connecté',
          needsAuth: true
        });
      }

      // Importer le fichier
      const document = await googleDriveService.importFile(
        fileId,
        accessToken,
        userId,
        projectId
      );

      res.json({
        success: true,
        data: document,
        message: 'Fichier importé avec succès'
      });
    } catch (error) {
      console.error('Error importing file:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'import du fichier'
      });
    }
  },

  // Vérifier le statut de connexion
  async status(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      const tokens = await googleDriveService.getUserTokens(userId);

      res.json({
        success: true,
        connected: !!tokens
      });
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification du statut'
      });
    }
  },

  // Déconnecter Google Drive
  async disconnect(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non authentifié'
        });
      }

      await googleDriveService.disconnect(userId);

      res.json({
        success: true,
        message: 'Google Drive déconnecté'
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion'
      });
    }
  }
};