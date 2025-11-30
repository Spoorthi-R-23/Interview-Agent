import { logger } from '../utils/logger.js';

export async function createInterviewEvent({
  summary,
  description,
  start,
  end,
  attendees = []
}) {
  try {
    logger.info('Mock calendar service: Creating interview event', { summary, start, end });
    
    // Mock event ID
    const mockEventId = `mock-event-${Date.now()}`;
    
    return mockEventId;
  } catch (error) {
    logger.error('Failed to create mock calendar event', { error: error.message });
    throw error;
  }
}

export async function cancelInterviewEvent(eventId) {
  if (!eventId) return;

  try {
    logger.info('Mock calendar service: Cancelling event', { eventId });
  } catch (error) {
    logger.error('Failed to cancel mock calendar event', { error: error.message });
  }
}
