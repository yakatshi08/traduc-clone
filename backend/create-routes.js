// Script pour créer tous les fichiers routes manquants
const fs = require('fs');
const path = require('path');

const files = {
  'src/routes/user.routes.ts': `import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/profile', (req: any, res) => {
  res.json({ success: true, message: 'User profile' });
});

export default router;`,

  'src/routes/analytics.routes.ts': `import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/stats', (req, res) => {
  res.json({ success: true, data: {} });
});

export default router;`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Créé : ${filePath}`);
  }
});

console.log('\n✅ Fichiers routes créés !');