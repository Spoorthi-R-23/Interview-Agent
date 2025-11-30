import { Router } from 'express';

import { publish } from '../controllers/sheetsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/publish', authenticate, publish);

export default router;
