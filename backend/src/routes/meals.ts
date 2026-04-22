import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../lib/db.js';
import { authMiddleware } from '../middleware/errorHandler.js';
import { setCache, getCache, deleteCache } from '../lib/redis.js';

const router = Router();

router.use(authMiddleware);

// Get all meals for user
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).userId;
    
    // Try to get from cache first
    const cached = await getCache(`meals:${userId}`);
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query(
      'SELECT * FROM meals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Cache for 1 hour
    await setCache(`meals:${userId}`, result.rows, 3600);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Create meal
router.post('/', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { name, description, protein, carbs, fat, calories, prepDay, servings, imageUrl } = req.body;

    const result = await pool.query(
      `INSERT INTO meals (id, user_id, name, description, protein_grams, carbs_grams, fat_grams, calories, prep_day, servings, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [uuidv4(), userId, name, description, protein, carbs, fat, calories, prepDay, servings, imageUrl]
    );

    // Invalidate cache
    await deleteCache(`meals:${userId}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Update meal
router.put('/:id', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { name, description, protein, carbs, fat, calories, prepDay, servings, imageUrl } = req.body;

    const result = await pool.query(
      `UPDATE meals 
       SET name = $1, description = $2, protein_grams = $3, carbs_grams = $4, fat_grams = $5, 
           calories = $6, prep_day = $7, servings = $8, image_url = $9, updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [name, description, protein, carbs, fat, calories, prepDay, servings, imageUrl, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await deleteCache(`meals:${userId}`);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete meal
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM meals WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await deleteCache(`meals:${userId}`);
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// Get meal schedule for a date range
router.get('/schedule/:startDate/:endDate', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate } = req.params;

    const result = await pool.query(
      `SELECT ms.*, m.name, m.protein_grams, m.carbs_grams, m.fat_grams, m.calories
       FROM meal_schedules ms
       JOIN meals m ON ms.meal_id = m.id
       WHERE ms.user_id = $1 AND ms.scheduled_date BETWEEN $2 AND $3
       ORDER BY ms.scheduled_date, ms.meal_type`,
      [userId, startDate, endDate]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Add meal to schedule
router.post('/schedule', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { mealId, scheduledDate, mealType, servings } = req.body;

    const result = await pool.query(
      `INSERT INTO meal_schedules (id, user_id, meal_id, scheduled_date, meal_type, servings)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), userId, mealId, scheduledDate, mealType, servings || 1]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add meal to schedule' });
  }
});

// Delete meal from schedule
router.delete('/schedule/:id', async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM meal_schedules WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule entry not found' });
    }

    res.json({ message: 'Removed from schedule' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from schedule' });
  }
});

export default router;
