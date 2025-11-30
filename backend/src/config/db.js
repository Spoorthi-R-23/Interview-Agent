import mongoose from 'mongoose';

import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase() {
  if (!env.mongoUri || env.mongoUri.includes('demo') || env.mongoUri.includes('localhost')) {
    logger.warn('MongoDB not configured or using demo/localhost - skipping connection');
    return;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      dbName: 'interview_agent',
      autoIndex: env.nodeEnv !== 'production'
    });
    logger.info('MongoDB connection established');
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    logger.warn('Continuing without database connection - some features may not work');
  }
}
