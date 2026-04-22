# 🍽️ Meal Prep Dashboard

A comprehensive meal planning and preparation dashboard with Telegram bot integration. Manage your meals, track nutrition, plan weekly schedules, and control everything via Telegram bot.

## ✨ Features

- **👤 User Authentication**: Secure registration and login
- **🍽️ Meal Management**: Create, edit, and manage meal recipes with detailed nutrition info
- **📅 Weekly Scheduling**: Plan meals for each day of the week
- **📊 Nutrition Tracking**: Monitor calories, protein, carbs, and fat intake
- **🤖 Telegram Bot Integration**: Control your meal prep and check schedules via Telegram
- **☁️ Cloud-based**: PostgreSQL database for reliable data storage
- **⚡ Real-time Updates**: Redis caching for fast performance
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

This is a full-stack monorepo project with:

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL
- **Cache**: Redis
- **Bot**: Telegraf (Telegram bot framework)

## 📋 Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose (optional, for containerized setup)
- Telegram Bot Token (from @BotFather)
- PostgreSQL 15+ (if not using Docker)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   cd mealprepdashboard
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Add your Telegram Bot Token to `.env`**
   ```bash
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

4. **Start all services**
   ```bash
   docker-compose up --build
   ```

5. **Access the dashboard**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database: localhost:5432 (mealprep / mealprep123)

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Setup database**
   ```bash
   createdb mealprep_db -U postgres
   ```

4. **Create `.env` file**
   ```bash
   cp ../.env.example .env
   ```

5. **Update `.env` with your settings**

6. **Start backend**
   ```bash
   yarn dev
   ```

#### Frontend Setup

1. **In a new terminal, navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

4. **Open browser**
   - http://localhost:5173

## 🤖 Telegram Bot Setup

### Getting Your Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the token provided

### Linking Your Account

1. Register/Login on the dashboard
2. Go to Profile → Telegram Connection
3. Find your Telegram ID:
   - Search for **@userinfobot** on Telegram
   - Send it any message
   - Copy your numeric ID from the response
4. Enter your ID and username
5. Save and start using bot commands!

### Available Bot Commands

- `/meals` - View your meal recipes
- `/today` - View today's meal schedule
- `/schedule` - View this week's schedule
- `/stats` - View today's nutrition stats
- `/help` - Show available commands

## 📝 API Endpoints

### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get user profile
- `POST /api/users/link-telegram` - Link Telegram account

### Meals
- `GET /api/meals` - Get all meals
- `POST /api/meals` - Create meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `GET /api/meals/schedule/:startDate/:endDate` - Get scheduled meals
- `POST /api/meals/schedule` - Add meal to schedule
- `DELETE /api/meals/schedule/:id` - Remove from schedule

### Bot
- `GET /api/bot/status` - Get bot connection status
- `POST /api/bot/send-message` - Send message via bot
- `GET /api/bot/commands/history` - Get command history
- `POST /api/bot/command` - Log bot command

## 📊 Database Schema

### Users Table
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR)
- telegram_id (VARCHAR)
- telegram_username (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

### Meals Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- name (VARCHAR)
- description (TEXT)
- protein_grams, carbs_grams, fat_grams, calories (DECIMAL)
- prep_day (VARCHAR)
- servings (INT)
- image_url (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

### Meal Schedules Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- meal_id (UUID, FK)
- scheduled_date (DATE)
- meal_type (VARCHAR: breakfast, lunch, dinner, snack)
- servings (INT)
- created_at (TIMESTAMP)
```

### Bot Commands Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- command (VARCHAR)
- executed_at (TIMESTAMP)
```

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# JWT
JWT_SECRET=your_jwt_secret

# API
API_PORT=3001
API_URL=http://localhost:3001

# Frontend
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

## 🛠️ Development

### Building

```bash
# Build all
yarn build

# Build specific workspace
yarn workspace @mealprep/backend build
yarn workspace @mealprep/frontend build
```

### Running Tests

```bash
# Type checking
yarn typecheck
```

### Code Structure

```
mealprepdashboard/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── lib/              # Utilities (db, redis, auth)
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── services/         # Business logic (telegram bot)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx          # React entry point
│   │   ├── App.tsx           # Main app component
│   │   ├── api.ts            # API client
│   │   ├── store.ts          # Zustand store
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── index.css         # Global styles
│   │   └── vite.config.ts    # Vite configuration
│   ├── package.json
│   └── index.html
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env
```

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials

### Telegram Bot Not Responding
- Verify TELEGRAM_BOT_TOKEN is correct
- Ensure bot has been properly started
- Check network connectivity

### Frontend Can't Reach Backend
- Verify API_URL in frontend .env
- Check VITE_API_URL matches backend URL
- Ensure backend is running on correct port

## 📦 Deployment

### Production Build

```bash
# Build frontend
cd frontend
yarn build

# Build backend
cd ../backend
yarn build
```

### Docker Deployment

```bash
# Build image
docker build -t mealprep-dashboard .

# Run container
docker run -p 3001:3001 --env-file .env mealprep-dashboard
```

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Happy Meal Prepping! 🍽️**

