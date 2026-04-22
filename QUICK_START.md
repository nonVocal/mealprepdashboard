# Quick Reference Guide

## 🚀 Start the Dashboard

### With Docker (Recommended)
```bash
docker-compose up --build
# Visit: http://localhost:5173
```

### Local Development
```bash
yarn install
yarn dev
```

## 📋 Project Files Created

### Root
- `.gitignore` - Git ignore rules
- `.env.example` - Environment template
- `docker-compose.yml` - Complete service orchestration
- `package.json` - Monorepo workspace configuration
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `QUICK_START.md` - This file

### Backend (`backend/`)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `Dockerfile` - Backend container
- `src/index.ts` - Server entry
- `src/lib/db.ts` - Database
- `src/lib/redis.ts` - Cache
- `src/lib/auth.ts` - Auth logic
- `src/middleware/errorHandler.ts` - Express middleware
- `src/routes/users.ts` - User endpoints
- `src/routes/meals.ts` - Meal endpoints
- `src/routes/bot.ts` - Bot endpoints
- `src/services/telegramBot.ts` - Telegram bot

### Frontend (`frontend/`)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tsconfig.node.json` - Vite TS config
- `vite.config.ts` - Vite configuration
- `Dockerfile` - Frontend container
- `index.html` - HTML entry point
- `src/main.tsx` - React entry
- `src/App.tsx` - Main app
- `src/api.ts` - API client
- `src/store.ts` - State management
- `src/index.css` - Global styles
- `src/pages/LoginPage.tsx` - Auth page
- `src/pages/RegisterPage.tsx` - Register page
- `src/pages/Dashboard.tsx` - Dashboard layout
- `src/pages/MealsPage.tsx` - Meals management
- `src/pages/SchedulePage.tsx` - Weekly schedule
- `src/pages/BotPage.tsx` - Bot control
- `src/pages/ProfilePage.tsx` - User profile
- `src/components/Navigation.tsx` - Nav bar
- `src/components/MealForm.tsx` - Meal form
- 10 CSS files for styling

## 🔧 Configuration

### Get Telegram Bot Token
1. Search @BotFather on Telegram
2. Send `/newbot`
3. Name your bot
4. Copy token to `.env` file

### Configure .env
```env
TELEGRAM_BOT_TOKEN=your_token_here
DATABASE_URL=postgresql://mealprep:mealprep123@localhost:5432/mealprep_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
```

## 📱 Using the Dashboard

### Create Account
1. Go to http://localhost:5173
2. Click "Create Account"
3. Register with email/password

### Add Meals
1. Go to "Meals" section
2. Click "+ Add Meal"
3. Fill in meal details and nutrition
4. Click "Create Meal"

### Plan Your Week
1. Go to "Schedule" section
2. Select a date
3. Choose meal type (breakfast, lunch, dinner, snack)
4. Pick a meal
5. Click "Add to Schedule"

### Link Telegram
1. Go to "Profile"
2. Enter your Telegram ID and username
3. Use bot commands: `/meals`, `/today`, `/stats`, `/help`

## 🗄️ Database Schema

**Users** - Authentication & profiles
**Meals** - Recipes with nutrition data
**Meal Schedules** - Weekly meal plans
**Bot Commands** - Command history

All created automatically on first startup!

## 🤖 Telegram Bot Commands

```
/meals    - Show all your meals
/today    - Today's meal schedule
/schedule - Weekly meal plan
/stats    - Today's nutrition stats
/help     - Show commands
```

## 💾 Important Endpoints

- **Login**: POST /api/users/login
- **Get Meals**: GET /api/meals
- **Add Meal**: POST /api/meals
- **Schedule Meal**: POST /api/meals/schedule
- **Bot Status**: GET /api/bot/status
- **Send Message**: POST /api/bot/send-message

## 🐛 Troubleshooting

### Can't connect to backend
- Ensure backend is running on port 3001
- Check VITE_API_URL in frontend .env

### Bot not working
- Verify TELEGRAM_BOT_TOKEN is correct
- Ensure you linked your Telegram account
- Check bot is active with @BotFather

### Database error
- PostgreSQL must be running
- Check DATABASE_URL in .env
- Verify database credentials

### Port in use
- Change port in docker-compose.yml
- Or kill process using the port

## 📚 More Information

- **Full Setup**: See `SETUP.md`
- **Documentation**: See `README.md`
- **Backend Code**: See `backend/src/`
- **Frontend Code**: See `frontend/src/`

## ✨ Features Summary

✅ User registration & login
✅ Meal management (CRUD)
✅ Weekly scheduling
✅ Nutrition tracking
✅ Telegram bot integration
✅ PostgreSQL database
✅ Redis caching
✅ Responsive UI
✅ Full TypeScript
✅ Docker support

---

**Ready to start? Run `docker-compose up --build` or `yarn dev`!** 🍽️
