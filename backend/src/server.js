import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env, validateEnv } from './config/env.js';
import { logger } from './utils/logger.js';
import { configureSocket } from './utils/socket.js';

async function bootstrap() {
  try {
    validateEnv();
    await connectDatabase();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: env.clientUrl,
        methods: ['GET', 'POST']
      }
    });

    configureSocket(io);

    server.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down server.`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Bootstrap failure', { error: error.message });
    process.exit(1);
  }
}

bootstrap();
