import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date()
  });
});

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

