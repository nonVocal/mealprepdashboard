import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { pool } from '../lib/db.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

interface MealData {
  name: string;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  calories: number;
}

async function getUserIdByTelegramId(telegramId: string): Promise<string | null> {
  const result = await pool.query('SELECT id FROM users WHERE telegram_id = $1', [telegramId]);
  return result.rows.length ? result.rows[0].id : null;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Start command
bot.start(async (ctx) => {
  const firstName = ctx.from?.first_name || 'User';
  const username = ctx.from?.username;
  
  try {
    // Check if user exists and link telegram
    const result = await pool.query(
      'SELECT id FROM users WHERE telegram_id = $1',
      [ctx.from?.id.toString()]
    );

    if (result.rows.length === 0) {
      ctx.reply(
        `👋 Welcome ${firstName}!\n\n` +
        `I'm your Meal Prep Bot. Please link your account first:\n` +
        `Visit: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n\n` +
        `Then use /link <code> to connect your dashboard.`,
        { parse_mode: 'HTML' }
      );
    } else {
      ctx.reply(
        `👋 Welcome back ${firstName}!\n\n` +
        `Your meal prep assistant is ready. Use /help to see available commands.`
      );
    }
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Sorry, something went wrong. Please try again later.');
  }
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    `📋 Available Commands:\n\n` +
    `/meals - View your meal recipes\n` +
    `/schedule - View this week's meal schedule\n` +
    `/today - View today's meals\n` +
    `/stats - View nutrition stats\n` +
    `/link - Show how to link your dashboard account\n` +
    `/help - Show this message`
  );
});

// View meals command
bot.command('meals', async (ctx) => {
  try {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      await ctx.reply('Could not detect your Telegram ID. Please try again.');
      return;
    }

    const userId = await getUserIdByTelegramId(telegramId);
    if (!userId) {
      await ctx.reply('🔗 Your Telegram account is not linked yet. Open the dashboard Profile page and save your Telegram ID/username first.');
      return;
    }
    
    const result = await pool.query(
      'SELECT id, name, calories, protein_grams, carbs_grams, fat_grams FROM meals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    if (result.rows.length === 0) {
      ctx.reply('📭 You have no meals yet. Add some on the dashboard!');
      return;
    }

    let message = '🍽️ Your Meals:\n\n';
    result.rows.forEach((meal: MealData) => {
      message += `<b>${meal.name}</b>\n`;
      message += `  🔥 ${meal.calories} cal | 🥚 ${meal.protein_grams}g | 🌾 ${meal.carbs_grams}g | 🥑 ${meal.fat_grams}g\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in meals command:', error);
    await ctx.reply('Failed to fetch meals. Try again later.');
  }
});

// View today's schedule
bot.command('today', async (ctx) => {
  try {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      await ctx.reply('Could not detect your Telegram ID. Please try again.');
      return;
    }

    const userId = await getUserIdByTelegramId(telegramId);
    if (!userId) {
      await ctx.reply('🔗 Your Telegram account is not linked yet. Open the dashboard Profile page and save your Telegram ID/username first.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT ms.meal_type, m.name, m.calories, m.protein_grams, m.carbs_grams, m.fat_grams
       FROM meal_schedules ms
       JOIN meals m ON ms.meal_id = m.id
       WHERE ms.user_id = $1 AND ms.scheduled_date = $2
       ORDER BY CASE ms.meal_type 
         WHEN 'breakfast' THEN 1
         WHEN 'lunch' THEN 2
         WHEN 'dinner' THEN 3
         WHEN 'snack' THEN 4
         ELSE 5
       END`,
      [userId, today]
    );

    if (result.rows.length === 0) {
      await ctx.reply('📭 No meals scheduled for today. Plan your meals on the dashboard!');
      return;
    }

    let message = `📅 Today's Meals (${today}):\n\n`;
    result.rows.forEach((meal: any) => {
      message += `<b>${meal.meal_type.toUpperCase()}</b>\n`;
      message += `  ${meal.name}\n`;
      message += `  🔥 ${meal.calories} cal | 🥚 ${meal.protein_grams}g | 🌾 ${meal.carbs_grams}g | 🥑 ${meal.fat_grams}g\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in today command:', error);
    await ctx.reply('Failed to fetch today\'s schedule.');
  }
});

// Stats command
bot.command('stats', async (ctx) => {
  try {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      await ctx.reply('Could not detect your Telegram ID. Please try again.');
      return;
    }

    const userId = await getUserIdByTelegramId(telegramId);
    if (!userId) {
      await ctx.reply('🔗 Your Telegram account is not linked yet. Open the dashboard Profile page and save your Telegram ID/username first.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT 
        SUM(m.calories) as total_calories,
        SUM(m.protein_grams) as total_protein,
        SUM(m.carbs_grams) as total_carbs,
        SUM(m.fat_grams) as total_fat,
        COUNT(*) as meal_count
       FROM meal_schedules ms
       JOIN meals m ON ms.meal_id = m.id
         WHERE ms.user_id = $1 AND ms.scheduled_date = $2`,
      [userId, today]
    );

    const stats = result.rows[0];

    if (!stats || stats.meal_count === 0) {
      await ctx.reply('📭 No meals scheduled for today.');
      return;
    }

    await ctx.reply(
      `📊 Today's Nutrition Stats:\n\n` +
      `🔥 Calories: ${Math.round(stats.total_calories || 0)}\n` +
      `🥚 Protein: ${Math.round(stats.total_protein || 0)}g\n` +
      `🌾 Carbs: ${Math.round(stats.total_carbs || 0)}g\n` +
      `🥑 Fat: ${Math.round(stats.total_fat || 0)}g\n` +
      `🍽️ Meals: ${stats.meal_count}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Error in stats command:', error);
    await ctx.reply('Failed to calculate stats.');
  }
});

bot.command('schedule', async (ctx) => {
  try {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      await ctx.reply('Could not detect your Telegram ID. Please try again.');
      return;
    }

    const userId = await getUserIdByTelegramId(telegramId);
    if (!userId) {
      await ctx.reply('🔗 Your Telegram account is not linked yet. Open the dashboard Profile page and save your Telegram ID/username first.');
      return;
    }

    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + 6);
    const startDate = toDateString(today);
    const endDate = toDateString(end);

    const result = await pool.query(
      `SELECT ms.scheduled_date, ms.meal_type, m.name
       FROM meal_schedules ms
       JOIN meals m ON ms.meal_id = m.id
       WHERE ms.user_id = $1 AND ms.scheduled_date BETWEEN $2 AND $3
       ORDER BY ms.scheduled_date ASC,
       CASE ms.meal_type
         WHEN 'breakfast' THEN 1
         WHEN 'lunch' THEN 2
         WHEN 'dinner' THEN 3
         WHEN 'snack' THEN 4
         ELSE 5
       END`,
      [userId, startDate, endDate]
    );

    if (result.rows.length === 0) {
      await ctx.reply('📭 No meals scheduled for the next 7 days.');
      return;
    }

    let message = '🗓️ Your Next 7 Days:\n\n';
    for (const row of result.rows) {
      message += `<b>${row.scheduled_date}</b> - ${row.meal_type}: ${row.name}\n`;
    }

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in schedule command:', error);
    await ctx.reply('Failed to fetch weekly schedule.');
  }
});

bot.command('link', async (ctx) => {
  await ctx.reply(
    `🔗 To link your account:\n\n` +
      `1. Open ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n` +
      `2. Go to Profile\n` +
      `3. Enter your Telegram ID: <b>${ctx.from?.id}</b>\n` +
      `4. Save your Telegram username without @`,
    { parse_mode: 'HTML' }
  );
});

// Handle text messages
bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();

  if (text.includes('hello') || text.includes('hi')) {
    ctx.reply('👋 Hey there! Type /help to see what I can do.');
  } else {
    ctx.reply(
      'I didn\'t understand that command. Type /help for available commands.'
    );
  }
});

export async function startTelegramBot() {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt === 1) {
        console.log('🤖 Starting Telegram bot...');
      } else {
        console.log(`🤖 Retrying Telegram bot startup (${attempt}/${maxRetries})...`);
      }

      await bot.launch({ dropPendingUpdates: true });
      console.log('✅ Telegram bot is running');

      // Handle graceful shutdown
      process.once('SIGINT', () => bot.stop('SIGINT'));
      process.once('SIGTERM', () => bot.stop('SIGTERM'));
      return;
    } catch (error: any) {
      const description = error?.response?.description || '';
      const isConflict = String(description).includes('terminated by other getUpdates request');

      if (!isConflict || attempt === maxRetries) {
        console.error('❌ Failed to start Telegram bot:', error);
        throw error;
      }

      console.warn('⚠️ Telegram bot conflict detected (another instance is polling). Retrying in 3 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

export { bot };
