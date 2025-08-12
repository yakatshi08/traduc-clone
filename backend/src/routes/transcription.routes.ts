// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\transcription.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes placeholder pour les transcriptions
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Transcriptions list'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Transcription details'
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Transcription created',
    data: { id: 'temp-id' }
  });
});

export default router;