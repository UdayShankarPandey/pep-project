import express, { json, urlencoded } from 'express';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

// Standard middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
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

export default app;
