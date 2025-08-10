import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, refreshToken, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// Inscription
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('name').optional().trim().isLength({ min: 2 }),
  validateRequest
], register);

// Connexion
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest
], login);

// Déconnexion
router.post('/logout', authenticate, logout);

// Refresh token
router.post('/refresh', refreshToken);

// Profil utilisateur actuel
router.get('/me', authenticate, me);

export default router;