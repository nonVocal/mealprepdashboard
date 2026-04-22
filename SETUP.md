# 🔧 Detailed Setup Guide

This guide provides step-by-step instructions to set up the Meal Prep Dashboard.

## Prerequisites

- **Node.js** 18.0 or higher
- **Yarn** 3.6 or higher (or npm 9+)
- **PostgreSQL** 15 or higher (if not using Docker)
- **Redis** 7 or higher (if not using Docker)
- **Git**

## Step 1: Environment Setup

### On Windows

1. **Install Node.js**
   - Download from https://nodejs.org
   - Install LTS version
   - Verify: `node --version` and `npm --version`

2. **Install Yarn**
   ```bash
   npm install -g yarn
   yarn --version
   ```

3. **Install PostgreSQL** (optional if using Docker)
   - Download from https://www.postgresql.org/download
   - Install and remember the password
   - Add to PATH

4. **Install Redis** (optional if using Docker)
   - Download from https://github.com/microsoftarchive/redis/releases
   - Or use WSL: `wsl --install` and `apt install redis-server`

### On macOS

```bash
# Using Homebrew
brew install node yarn
brew install postgresql redis

# Verify installations
node --version
yarn --version
```

### On Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Install PostgreSQL and Redis
sudo apt-get install -y postgresql postgresql-contrib redis-server
```

## Step 2: Get Telegram Bot Token

This is required for bot functionality.

1. **Create Bot**
   - Open Telegram
   - Search for @BotFather
   - Send: `/newbot`
   - Follow prompts to name your bot
   - Copy the token (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

2. **Enable Commands**
   - Send: `/setcommands` to @BotFather
   - When asked for bot, select your bot
   - Send the following:
   ```
   meals - View meal recipes
   today - View today's meals
   schedule - View weekly schedule
   stats - Show nutrition stats
   help - Show available commands
   ```

## Step 3: Clone and Setup Project

```bash
# Navigate to your projects folder
cd ~/projects
# or
cd C:\projects  # Windows

# The folder should already exist: mealprepdashboard
cd mealprepdashboard

# Initialize git (if needed)
git init
git add .
git commit -m "Initial commit"
```

## Step 4: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
# On Windows: notepad .env
# On Mac/Linux: nano .env
# Or use your IDE
```

**Update these values:**
```env
# Add your Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_token_here

# Database (if using local PostgreSQL)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mealprep_db

# Keep other values as default for local development
```

## Step 5: Install Dependencies

Using Docker (Recommended):

```bash
# Just ensure Docker and Docker Compose are installed
docker --version
docker-compose --version
```

Or locally:

```bash
# Install all dependencies
yarn install

# This will install for both backend and frontend
```

## Step 6: Setup Database

### Option A: Docker Compose (Automatic)

```bash
docker-compose up -d postgres redis
```

The database will be created automatically when the backend starts.

### Option B: Manual PostgreSQL Setup

```bash
# Create database
createdb -U postgres mealprep_db
# Or in PostgreSQL:
# CREATE DATABASE mealprep_db;

# The tables will be created automatically when backend starts
```

## Step 7: Start Development

### Using Docker Compose

```bash
# Start all services
docker-compose up --build

# In another terminal, you can view logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

Terminal 1 - Backend:
```bash
cd backend
yarn dev
# Should print: 🚀 Server running on port 3001
```

Terminal 2 - Frontend:
```bash
cd frontend
yarn dev
# Should print: ➜  Local: http://localhost:5173/
```

Terminal 3 - Telegram Bot (from backend directory):
```bash
# The bot starts automatically with the backend
# Check logs for: ✅ Telegram bot is running
```

## Step 8: Access the Dashboard

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:3001
3. **API Health Check**: http://localhost:3001/health

## Step 9: Create Account and Setup

1. **Register**
   - Click "Create Account"
   - Enter email and password
   - Click Register

2. **Link Telegram** (Optional but recommended)
   - Go to Profile
   - Click "Link Your Telegram Account"
   - Get your Telegram ID:
     - Open Telegram
     - Search for @userinfobot
     - Send any message
     - Copy your ID number
   - Enter your ID and username
   - Save

3. **Create Your First Meal**
   - Go to Meals section
   - Click "+ Add Meal"
   - Fill in meal details
   - Click "Create Meal"

4. **Schedule a Meal**
   - Go to Schedule section
   - Select a date and meal type
   - Select your meal
   - Click "Add to Schedule"

5. **Test Telegram Bot** (if linked)
   - Open Telegram
   - Find your bot in your bot list
   - Send: `/today`
   - Should see today's meals!

## Troubleshooting

### "Port already in use"
```bash
# Find process using port
# Windows:
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3001

# Kill the process or change port in .env
```

### "Cannot connect to PostgreSQL"
```bash
# Verify PostgreSQL is running
# Windows: services.msc
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Check connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/mealprep_db
```

### "Telegram Bot not working"
- Verify TELEGRAM_BOT_TOKEN in .env is correct
- Check bot is active with @BotFather
- Verify network connection
- Check backend logs for errors

### "Frontend shows blank page"
- Check browser console for errors (F12)
- Verify VITE_API_URL points to correct backend
- Ensure backend is running on http://localhost:3001

### Clearing Docker

```bash
# Stop all containers
docker-compose down

# Remove volumes (careful - loses data!)
docker-compose down -v

# Rebuild everything
docker-compose up --build
```

## Next Steps

1. ✅ Dashboard setup complete
2. Create meals and meal plans
3. Link your Telegram account for bot access
4. Use Telegram bot for quick meal checking
5. Plan your weekly meal prep
6. Track nutrition intake

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs backend`
2. Verify all ports are available
3. Ensure PostgreSQL/Redis are running
4. Check .env configuration
5. Review the main README.md

## Performance Tips

- Use Docker Compose for best performance
- Redis caching speeds up meal queries
- Frontend is optimized with Vite
- Backend uses connection pooling

## Security Notes

- Change JWT_SECRET in production
- Use strong database passwords
- Keep TELEGRAM_BOT_TOKEN private
- Use HTTPS in production
- Implement rate limiting for API

Good luck with your meal prep! 🍽️
