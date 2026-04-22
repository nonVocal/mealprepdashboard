import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './lib/db.js';
import { initializeRedis } from './lib/redis.js';
import mealRoutes from './routes/meals.js';
import userRoutes from './routes/users.js';
import botRoutes from './routes/bot.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startTelegramBot } from './services/telegramBot.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meals', mealRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bot', botRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await initializeDatabase();
    await initializeRedis();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      if (process.env.TELEGRAM_BOT_TOKEN) {
        startTelegramBot().catch((error) => {
          console.error('❌ Telegram bot failed to start:', error);
        });
      } else {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN is not set; bot is disabled');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
