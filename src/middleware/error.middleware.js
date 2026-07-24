import env from '../config/env.js';
import { logger } from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.statusCode >= 500) {
    logger.error(
      `[${req.requestId || '-'}] ${req.method} ${req.originalUrl} - ${err.message}`
    );
  }

  const message =
    env.NODE_ENV === 'production' && err.statusCode >= 500
      ? 'Internal server error'
      : err.message;

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message,
  });
};

export default errorMiddleware;
