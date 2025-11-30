import { Router } from 'express';

import { cancel, schedule } from '../controllers/calendarController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/schedule', authenticate, schedule);
router.delete('/schedule/:eventId', authenticate, cancel);

export default router;
