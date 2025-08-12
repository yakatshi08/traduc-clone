// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\document.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes placeholder pour les documents
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Documents list'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Document details'
  });
});

router.post('/upload', (req, res) => {
  res.json({
    success: true,
    message: 'Document uploaded',
    data: { id: 'temp-id' }
  });
});

router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Document deleted'
  });
});

export default router;