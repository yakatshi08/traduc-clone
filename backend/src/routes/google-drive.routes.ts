// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\routes\google-drive.routes.ts
import { Router } from 'express';
import { googleDriveController } from '../controllers/google-drive.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route publique pour le callback OAuth
router.get('/callback', googleDriveController.callback);

// Routes protégées
router.use(authMiddleware);

router.get('/auth', googleDriveController.auth);
router.get('/files', googleDriveController.listFiles);
router.post('/import', googleDriveController.importFile);
router.get('/status', googleDriveController.status);
router.post('/disconnect', googleDriveController.disconnect);

export default router;