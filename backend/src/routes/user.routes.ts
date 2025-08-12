// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\user.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes utilisateur nécessitent une authentification
router.use(authenticate);

// Route placeholder pour le profil
router.get('/profile', (_req: any, res) => {
  res.json({
    success: true,
    message: 'User profile endpoint'
  });
});

// Route placeholder pour mettre à jour le profil
router.put('/profile', (_req: any, res) => {
  res.json({
    success: true,
    message: 'Profile update endpoint'
  });
});

// Route pour obtenir les statistiques de l'utilisateur
router.get('/stats', (_req: any, res) => {
  res.json({
    success: true,
    data: {
      minutesUsed: 0,
      minutesLimit: 60,
      documentsCount: 0,
      transcriptionsCount: 0
    }
  });
});

export default router;