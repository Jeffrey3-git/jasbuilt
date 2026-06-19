import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Helmet configured safely to prevent blocking local assets/CDNs
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, 
}));

// Middleware Setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 2. Body parser with strict sizing limits to prevent payload bombs
app.use(express.json({ limit: '10kb' }));

// 3. Configure Rate Limiting to prevent API abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Do not rate-limit preflight requests
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date()
  });
});

// Apply the rate limiter selectively to protected API routes
app.use('/api/', apiLimiter);

// Route Mount Blocks
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 JASBuilt API Server executing on port ${PORT}`);
});
