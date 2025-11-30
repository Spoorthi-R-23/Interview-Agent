import { logger } from './logger.js';
import { processCandidateMessage } from '../services/interviewService.js';

export function configureSocket(io) {
  io.on('connection', (socket) => {
    logger.info('Socket connected', { socketId: socket.id });

    socket.on('interview:join', ({ sessionId }) => {
      socket.join(sessionId);
      io.to(sessionId).emit('interview:status', { status: 'joined', sessionId });
    });

    socket.on('interview:message', async ({ sessionId, message }) => {
      try {
        const result = await processCandidateMessage({ sessionId, message });
        io.to(sessionId).emit('interview:update', { sessionId, ...result });
      } catch (error) {
        socket.emit('interview:error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected', { socketId: socket.id });
    });
  });
}
