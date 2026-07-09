import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mongoSanitize } from './middleware/sanitize.middleware.js';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.middleware.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────

// Helmet — sets secure HTTP headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// CORS — allow all origins in development, restrict in production
app.use(cors());

// Global rate limiter — 100 requests per 15 minutes per IP
app.use(globalLimiter);

// Standard body parsers with size limits to prevent payload abuse
app.use(json({ limit: '1mb' }));
app.use(urlencoded({ extended: true, limit: '1mb' }));

// Sanitize user input against NoSQL injection ($gt, $ne, etc.)
app.use(mongoSanitize);

// ─── API Routes ─────────────────────────────────────────────────────────────

// Auth routes get a stricter rate limiter (brute-force protection)
app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    message: 'Server is healthy'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the PEP Project API Server!</h1><p>Check health status at <a href="/health">/health</a></p>');
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler — never leak stack traces or internal details to the client
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);

  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({ message });
});

export default app;
