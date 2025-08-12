import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Interface pour les requêtes authentifiées
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
    plan?: string;
  };
  userId?: string;
}

// Configuration du mode développement
const DEV_CONFIG = {
  // Activer/désactiver le mode développement permissif
  ALLOW_NO_TOKEN: process.env.NODE_ENV === 'development',
  
  // Créer automatiquement un utilisateur de test
  AUTO_CREATE_TEST_USER: true,
  
  // Afficher les logs de debug
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  
  // Utilisateur de test par défaut
  TEST_USER: {
    email: 'test@test.com',
    password: 'Test12345!',
    name: 'Test User',
    role: 'USER',
    plan: 'PRO'
  }
};

/**
 * Créer ou récupérer l'utilisateur de test
 */
async function getOrCreateTestUser() {
  try {
    // Chercher l'utilisateur de test existant
    let testUser = await prisma.user.findUnique({
      where: { email: DEV_CONFIG.TEST_USER.email }
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!testUser && DEV_CONFIG.AUTO_CREATE_TEST_USER) {
      const hashedPassword = await bcrypt.hash(DEV_CONFIG.TEST_USER.password, 10);
      
      testUser = await prisma.user.create({
        data: {
          email: DEV_CONFIG.TEST_USER.email,
          password: hashedPassword,
          name: DEV_CONFIG.TEST_USER.name,
          role: DEV_CONFIG.TEST_USER.role,
          plan: DEV_CONFIG.TEST_USER.plan,
          minutesUsed: 0,
          minutesLimit: 500
        }
      });

      if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
        console.log('✅ [Auth Dev] Utilisateur de test créé:', {
          email: testUser.email,
          id: testUser.id
        });
      }
    }

    return testUser;
  } catch (error) {
    console.error('❌ [Auth Dev] Erreur création utilisateur de test:', error);
    return null;
  }
}

/**
 * Middleware d'authentification pour le développement
 * Plus permissif que la version production
 */
export const authenticateDev = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer le token depuis les headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    // Log de debug
    if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
      console.log('🔍 [Auth Dev] Requête:', {
        method: req.method,
        path: req.path,
        hasToken: !!token,
        headers: req.headers.authorization ? 'Bearer xxx...' : 'none'
      });
    }

    // Si un token est fourni, le vérifier
    if (token) {
      try {
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'traducxion-secret-key-2025'
        ) as any;

        // Extraire les infos utilisateur du token
        const userInfo = {
          id: decoded.id || decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'USER',
          plan: decoded.plan || 'STARTER'
        };

        req.user = userInfo;
        req.userId = userInfo.id;

        if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
          console.log('✅ [Auth Dev] Token valide pour:', userInfo.email);
        }

        return next();
      } catch (tokenError: any) {
        if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
          console.log('⚠️ [Auth Dev] Token invalide:', tokenError.message);
        }

        // En mode développement, continuer avec l'utilisateur de test
        if (!DEV_CONFIG.ALLOW_NO_TOKEN) {
          return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré',
            error: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
          });
        }
      }
    }

    // Si pas de token et mode développement permissif
    if (DEV_CONFIG.ALLOW_NO_TOKEN) {
      const testUser = await getOrCreateTestUser();
      
      if (testUser) {
        req.user = {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name || 'Test User',
          role: testUser.role,
          plan: testUser.plan
        };
        req.userId = testUser.id;

        if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
          console.log('🔓 [Auth Dev] Mode dev - Utilisation utilisateur de test:', {
            email: testUser.email,
            id: testUser.id
          });
        }

        return next();
      }
    }

    // Si on arrive ici, l'authentification a échoué
    return res.status(401).json({
      success: false,
      message: 'Authentication requise',
      hint: process.env.NODE_ENV === 'development' 
        ? 'En développement, utilisez test@test.com / Test12345!' 
        : undefined
    });

  } catch (error: any) {
    console.error('❌ [Auth Dev] Erreur middleware:', error);
    
    // En cas d'erreur critique, essayer de continuer en dev
    if (DEV_CONFIG.ALLOW_NO_TOKEN) {
      const testUser = await getOrCreateTestUser();
      
      if (testUser) {
        req.user = {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name || 'Test User',
          role: testUser.role,
          plan: testUser.plan
        };
        req.userId = testUser.id;
        
        console.log('🔧 [Auth Dev] Récupération après erreur avec utilisateur de test');
        return next();
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware optionnel - Authentification non bloquante
 * Ajoute l'utilisateur si token présent, mais laisse passer sans
 */
export const authenticateOptional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'traducxion-secret-key-2025'
        ) as any;

        req.user = {
          id: decoded.id || decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'USER',
          plan: decoded.plan || 'STARTER'
        };
        req.userId = req.user.id;
      } catch (error) {
        // Ignorer silencieusement les erreurs de token
        if (DEV_CONFIG.ENABLE_DEBUG_LOGS) {
          console.log('⚠️ [Auth Optional] Token invalide ignoré');
        }
      }
    }

    next();
  } catch (error) {
    // Continuer même en cas d'erreur
    next();
  }
};

/**
 * Middleware pour vérifier les rôles
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication requise'
      });
    }

    if (!roles.includes(req.user.role || 'USER')) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier le plan d'abonnement
 */
export const requirePlan = (plans: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication requise'
      });
    }

    if (!plans.includes(req.user.plan || 'STARTER')) {
      return res.status(403).json({
        success: false,
        message: 'Plan insuffisant pour cette fonctionnalité',
        required: plans,
        current: req.user.plan,
        upgrade: true
      });
    }

    next();
  };
};

// Export par défaut du middleware principal
export default authenticateDev;

// Export des utilitaires
export const authUtils = {
  /**
   * Générer un token JWT pour les tests
   */
  generateTestToken: (userId: string = '1', email: string = 'test@test.com') => {
    return jwt.sign(
      {
        id: userId,
        email,
        name: 'Test User',
        role: 'USER',
        plan: 'PRO'
      },
      process.env.JWT_SECRET || 'traducxion-secret-key-2025',
      { expiresIn: '7d' }
    );
  },

  /**
   * Extraire le token d'une requête
   */
  extractToken: (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return authHeader || null;
  },

  /**
   * Décoder un token sans vérification (pour debug)
   */
  decodeToken: (token: string) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
};