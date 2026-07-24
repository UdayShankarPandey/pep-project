import { logger } from './utils/logger.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './db.js';
import app from './app.js';

const PORT = env.PORT;

let server;

// Connect to Database first, then start the server
connectDB().then(() => {
  server = app.listen(PORT, () => {
    logger.info(`Server is running and listening on http://localhost:${PORT}`);
  });
});

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (!server) {
    disconnectDB().finally(() => process.exit(0));
    return;
  }

  server.close(async () => {
    logger.info('HTTP server closed.');

    await disconnectDB();

    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
