import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

import {
  completeSession,
  respond,
  respondWithAudio,
  startSession,
  submitFeedback,
  getSessions,
  getSession
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { env } from '../config/env.js';

const router = Router();

const uploadsDir = env.uploadDir;
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.wav';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/start', authenticate, startSession);
router.post('/respond', authenticate, respond);
router.post('/respond-audio', authenticate, upload.single('audio'), respondWithAudio);
router.post('/complete', authenticate, completeSession);
router.post('/feedback', authenticate, submitFeedback);
router.get('/sessions', authenticate, getSessions);
router.get('/:sessionId', authenticate, getSession);

export default router;
