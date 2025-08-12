// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\analytics.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les analytics
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 0,
      totalProjects: 0,
      totalDocuments: 0,
      totalTranscriptions: 0,
      totalMinutesUsed: 0
    }
  });
});

router.get('/usage', (req, res) => {
  res.json({
    success: true,
    data: {
      daily: [],
      weekly: [],
      monthly: []
    }
  });
});

router.get('/revenue', (req, res) => {
  res.json({
    success: true,
    data: {
      total: 0,
      monthly: 0,
      mrr: 0
    }
  });
});

export default router;