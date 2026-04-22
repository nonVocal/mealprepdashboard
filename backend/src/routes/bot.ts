import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../lib/db.js';
import { authMiddleware } from '../middleware/errorHandler.js';
import { bot } from '../services/telegramBot.js';

const router = Router();

router.use(authMiddleware);

// Log bot command
router.post('/command', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { command } = req.body;

    const result = await pool.query(
      'INSERT INTO bot_commands (id, user_id, command) VALUES ($1, $2, $3) RETURNING *',
      [uuidv4(), userId, command]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log command' });
  }
});

// Get bot command history
router.get('/commands/history', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const result = await pool.query(
      'SELECT command, executed_at FROM bot_commands WHERE user_id = $1 ORDER BY executed_at DESC LIMIT $2',
      [userId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch command history' });
  }
});

// Send message to user via Telegram
router.post('/send-message', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { message } = req.body as { message?: string };

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user's telegram ID
    const userResult = await pool.query(
      'SELECT telegram_id FROM users WHERE id = $1',
      [userId]
    );

    if (!userResult.rows.length || !userResult.rows[0].telegram_id) {
      return res.status(400).json({ error: 'User has not linked Telegram account' });
    }

    const telegramId = userResult.rows[0].telegram_id as string;

    await bot.telegram.sendMessage(telegramId, message.trim());

    await pool.query(
      'INSERT INTO bot_commands (id, user_id, command) VALUES ($1, $2, $3)',
      [uuidv4(), userId, `send-message: ${message.trim()}`]
    );

    res.json({ 
      success: true, 
      message: 'Message sent' 
    });
  } catch (error: any) {
    const description = error?.response?.description as string | undefined;
    if (description) {
      return res.status(502).json({ error: `Telegram error: ${description}` });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get bot status
router.get('/status', async (req, res) => {
  try {
    const userId = (req as any).userId;

    const userResult = await pool.query(
      'SELECT telegram_id, telegram_username FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    res.json({
      botConnected: !!user.telegram_id,
      telegramId: user.telegram_id,
      telegramUsername: user.telegram_username,
      status: 'online'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bot status' });
  }
});

export default router;
