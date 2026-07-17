import mongoose from 'mongoose';
import env from '../config/env.js';

export const healthService = {
  checkHealth() {
    return {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV
    };
  },

  checkReadiness() {
    const isDbConnected = mongoose.connection.readyState === 1;

    return {
      status: isDbConnected ? 'READY' : 'NOT_READY',
      database: isDbConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV
    };
  }
};
