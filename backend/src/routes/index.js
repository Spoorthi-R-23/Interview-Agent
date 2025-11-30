import { Router } from 'express';

import authRoutes from './authRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import sheetsRoutes from './sheetsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/interview', interviewRoutes);
router.use('/calendar', calendarRoutes);
router.use('/sheets', sheetsRoutes);

export default router;
