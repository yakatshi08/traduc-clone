// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\project.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { projectController } from '../controllers/project.controller';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes CRUD pour les projets
router.get('/', projectController.getAll);
router.get('/stats', projectController.getStats);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;