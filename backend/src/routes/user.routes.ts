import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Route en construction' }));
export default router;
