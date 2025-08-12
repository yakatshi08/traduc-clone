// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\middleware\auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token manquant' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    // Support des deux formats de token
    if (decoded.id) {
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      req.userId = decoded.id;
    } else if (decoded.userId) {
      req.user = {
        id: decoded.userId
      };
      req.userId = decoded.userId;
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token invalide' 
    });
  }
};

// Alias pour compatibilité
export const authMiddleware = authenticate;

// Export par défaut
export default authenticate;