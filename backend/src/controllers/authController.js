const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../services/emailService');
const { validateEmail, validatePassword } = require('../utils/validators');
const redis = require('../config/redis');

const prisma = new PrismaClient();

class AuthController {
  // Inscription
  async register(req, res) {
    try {
      const { email, password, name, company } = req.body;

      // Validation
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email invalide'
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
        });
      }

      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer le token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          company,
          verificationToken,
          isVerified: false,
          settings: {
            create: {
              language: 'fr',
              theme: 'dark',
              notifications: true
            }
          }
        }
      });

      // Envoyer l'email de vérification
      await sendEmail({
        to: email,
        subject: 'Vérifiez votre compte TraducXion',
        template: 'verification',
        data: {
          name,
          verificationLink: `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`
        }
      });

      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès. Vérifiez votre email.',
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Erreur register:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du compte'
      });
    }
  }

  // Connexion
  async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;

      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          settings: true,
          subscription: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        // Incrémenter les tentatives échouées
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            failedLoginAttempts: { increment: 1 },
            lastFailedLogin: new Date()
          }
        });

        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier si le compte est vérifié
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Veuillez vérifier votre email avant de vous connecter'
        });
      }

      // Vérifier si le compte est bloqué
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Votre compte a été bloqué. Contactez le support.'
        });
      }

      // Générer les tokens
      const tokenExpiry = rememberMe ? '30d' : '7d';
      const accessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscription?.tier || 'free'
        },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiry }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
      );

      // Sauvegarder le refresh token dans Redis
      await redis.setex(
        `refresh_token:${user.id}`,
        30 * 24 * 60 * 60, // 30 jours
        refreshToken
      );

      // Mettre à jour les infos de connexion
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          failedLoginAttempts: 0
        }
      });

      // Créer une session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          userAgent: req.headers['user-agent'] || '',
          ipAddress: req.ip,
          expiresAt: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000)
        }
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
            settings: user.settings,
            subscription: user.subscription
          },
          accessToken,
          refreshToken,
          sessionId: session.id
        }
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion'
      });
    }
  }

  // Refresh Token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token manquant'
        });
      }

      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Vérifier dans Redis
      const storedToken = await redis.get(`refresh_token:${decoded.id}`);
      
      if (storedToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token invalide'
        });
      }

      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { subscription: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Générer un nouveau access token
      const newAccessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscription?.tier || 'free'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      console.error('Erreur refresh token:', error);
      res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  }

  // Déconnexion
  async logout(req, res) {
    try {
      const { sessionId } = req.body;
      const userId = req.user.id;

      // Supprimer la session
      if (sessionId) {
        await prisma.session.delete({
          where: { id: sessionId }
        });
      }

      // Supprimer le refresh token de Redis
      await redis.del(`refresh_token:${userId}`);

      res.json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      console.error('Erreur logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion'
      });
    }
  }

  // Vérification email
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      const user = await prisma.user.findFirst({
        where: { verificationToken: token }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Token de vérification invalide'
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
          emailVerifiedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      });
    } catch (error) {
      console.error('Erreur verify email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification'
      });
    }
  }

  // Mot de passe oublié
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Ne pas révéler si l'email existe
        return res.json({
          success: true,
          message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
        });
      }

      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry
        }
      });

      // Envoyer l'email
      await sendEmail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        template: 'reset-password',
        data: {
          name: user.name,
          resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        }
      });

      res.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      });
    } catch (error) {
      console.error('Erreur forgot password:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la demande de réinitialisation'
      });
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe ne respecte pas les critères de sécurité'
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gte: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      });

      // Invalider toutes les sessions
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      console.error('Erreur reset password:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation'
      });
    }
  }

  // Obtenir le profil
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          settings: true,
          subscription: true,
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            },
            take: 5,
            orderBy: { updatedAt: 'desc' }
          },
          _count: {
            select: {
              projects: true,
              sessions: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Calculer les statistiques
      const stats = await prisma.transcription.aggregate({
        where: {
          document: {
            project: {
              userId: userId
            }
          }
        },
        _count: true,
        _sum: {
          duration: true
        }
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company,
            avatar: user.avatar,
            role: user.role,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            settings: user.settings,
            subscription: user.subscription,
            recentProjects: user.projects,
            stats: {
              projectsCount: user._count.projects,
              sessionsCount: user._count.sessions,
              transcriptionsCount: stats._count,
              totalDuration: stats._sum.duration || 0
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur get profile:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }

  // Mettre à jour le profil
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, company, avatar, settings } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (company !== undefined) updateData.company = company;
      if (avatar !== undefined) updateData.avatar = avatar;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          settings: true
        }
      });

      // Mettre à jour les settings si fournis
      if (settings) {
        await prisma.userSettings.update({
          where: { userId: userId },
          data: settings
        });
      }

      res.json({
        success: true,
        message: 'Profil mis à jour',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company,
            avatar: user.avatar,
            settings: user.settings
          }
        }
      });
    } catch (error) {
      console.error('Erreur update profile:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  }

  // Changer le mot de passe
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          message: 'Le nouveau mot de passe ne respecte pas les critères de sécurité'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordChangedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      console.error('Erreur change password:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de mot de passe'
      });
    }
  }

  // Supprimer le compte
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      const { password, confirmation } = req.body;

      if (confirmation !== 'DELETE') {
        return res.status(400).json({
          success: false,
          message: 'Confirmation incorrecte'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe incorrect'
        });
      }

      // Soft delete
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          email: `deleted_${Date.now()}_${user.email}`,
          isDeleted: true
        }
      });

      res.json({
        success: true,
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur delete account:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du compte'
      });
    }
  }
}

module.exports = new AuthController();