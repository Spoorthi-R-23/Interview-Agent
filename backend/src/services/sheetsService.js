import { logger } from '../utils/logger.js';

export async function appendInterviewSummary({
  candidate,
  mode,
  score,
  maxScore,
  percentage,
  highlights,
  sessionId,
  timestamp
}) {
  try {
    logger.info('Mock sheets service: Appending interview summary', {
      candidate,
      mode,
      score,
      maxScore,
      percentage,
      sessionId,
      timestamp
    });

    // Mock range response
    const mockRange = `Sheet1!A${Math.floor(Math.random() * 1000) + 2}:H${Math.floor(Math.random() * 1000) + 2}`;
    
    return mockRange;
  } catch (error) {
    logger.error('Failed to append to mock sheets service', { error: error.message });
    throw error;
  }
}
