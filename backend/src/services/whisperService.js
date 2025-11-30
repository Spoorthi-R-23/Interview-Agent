import fs from 'fs';

import { logger } from '../utils/logger.js';

export async function transcribeAudio(filePath) {
  try {
    // Mock transcription service - replace with actual speech-to-text service
    logger.warn('Using mock transcription service. Configure a real STT service for production.');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return "This is a mock transcription. The audio upload feature is working, but you need to integrate a real speech-to-text service.";
  } catch (error) {
    logger.error('Mock transcription failed', { error: error.message });
    throw error;
  } finally {
    // Clean up uploaded file
    fs.unlink(filePath, () => {});
  }
}
