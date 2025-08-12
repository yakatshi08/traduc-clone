// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\controllers\auth.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authController = {
  // Inscription
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          createdAt: true
        }
      });

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  },

  // Connexion
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  },

  // Déconnexion
  async logout(_req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  },

  // Rafraîchir le token
  async refreshToken(req: any, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token manquant'
        });
      }

      // Vérifier le token actuel
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }
      
      // Générer un nouveau token
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Récupérer l'utilisateur mis à jour
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          language: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        token: newToken,
        user
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du rafraîchissement du token'
      });
    }
  },

  // Obtenir l'utilisateur actuel
  async getCurrentUser(req: any, res: Response) {
    try {
      const userId = req.user?.id || req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          language: true,
          minutesUsed: true,
          minutesLimit: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur'
      });
    }
  },

  // Mettre à jour le profil
  async updateProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id || req.userId;
      const { name, language, avatar } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(language && { language }),
          ...(avatar && { avatar })
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          language: true,
          avatar: true
        }
      });

      res.json({
        success: true,
        user,
        message: 'Profil mis à jour avec succès'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  }
};

// Exports individuels pour compatibilité - TOUS LES EXPORTS NÉCESSAIRES
export const register = authController.register;
export const login = authController.login;
export const logout = authController.logout;
export const refreshToken = authController.refreshToken;
export const getCurrentUser = authController.getCurrentUser;
export const updateProfile = authController.updateProfile;

// Export par défaut
export default authController;