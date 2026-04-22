# Project Structure

```
mealprepdashboard/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICK_START.md               # Quick reference guide
├── 📄 SETUP.md                     # Detailed setup instructions
├── 📄 package.json                 # Monorepo workspace config
├── 📄 docker-compose.yml           # Docker services orchestration
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 backend/                     # Node.js Express API
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 Dockerfile
│   │
│   └── 📁 src/
│       ├── 📄 index.ts             # Server entry point
│       │
│       ├── 📁 lib/
│       │   ├── 📄 db.ts            # PostgreSQL connection & initialization
│       │   ├── 📄 redis.ts         # Redis client & cache functions
│       │   └── 📄 auth.ts          # JWT token utilities
│       │
│       ├── 📁 middleware/
│       │   └── 📄 errorHandler.ts  # Express error handling middleware
│       │
│       ├── 📁 routes/
│       │   ├── 📄 users.ts         # User auth & profile endpoints
│       │   ├── 📄 meals.ts         # Meal CRUD & scheduling endpoints
│       │   └── 📄 bot.ts           # Telegram bot control endpoints
│       │
│       └── 📁 services/
│           └── 📄 telegramBot.ts   # Telegram bot implementation
│
└── 📁 frontend/                    # React Vite Application
    ├── 📄 package.json
    ├── 📄 tsconfig.json
    ├── 📄 tsconfig.node.json
    ├── 📄 vite.config.ts
    ├── 📄 Dockerfile
    ├── 📄 index.html               # HTML entry point
    │
    └── 📁 src/
        ├── 📄 main.tsx             # React entry point
        ├── 📄 App.tsx              # Main app component
        ├── 📄 api.ts               # Axios API client
        ├── 📄 store.ts             # Zustand state management
        ├── 📄 index.css            # Global styles
        │
        ├── 📁 pages/
        │   ├── 📄 LoginPage.tsx      # Login page
        │   ├── 📄 LoginPage.css
        │   ├── 📄 RegisterPage.tsx   # Registration page
        │   ├── 📄 RegisterPage.css
        │   ├── 📄 Dashboard.tsx      # Dashboard layout
        │   ├── 📄 Dashboard.css
        │   ├── 📄 MealsPage.tsx      # Meal management
        │   ├── 📄 MealsPage.css
        │   ├── 📄 SchedulePage.tsx   # Weekly scheduling
        │   ├── 📄 SchedulePage.css
        │   ├── 📄 BotPage.tsx        # Telegram bot control
        │   ├── 📄 BotPage.css
        │   ├── 📄 ProfilePage.tsx    # User profile
        │   └── 📄 ProfilePage.css
        │
        └── 📁 components/
            ├── 📄 Navigation.tsx     # Navigation bar
            ├── 📄 Navigation.css
            ├── 📄 MealForm.tsx       # Meal form component
            └── 📄 MealForm.css
```

## File Statistics

- **Total Files**: 45+
- **TypeScript Files**: 20
- **CSS Files**: 10
- **Configuration Files**: 6
- **Documentation Files**: 3
- **Docker Files**: 2

## Technology Stack

```
Backend:
├── Runtime: Node.js 18+
├── Framework: Express.js
├── Language: TypeScript
├── Database: PostgreSQL 15+
├── Cache: Redis 7+
├── Bot: Telegraf
├── Auth: JWT + bcryptjs
└── Validation: Zod

Frontend:
├── Library: React 18
├── Language: TypeScript
├── Build Tool: Vite
├── State: Zustand
├── HTTP: Axios
├── Routing: React Router
├── UI Framework: CSS3 (custom)
├── Utilities: date-fns, recharts
└── Package Manager: Yarn

DevOps:
├── Containerization: Docker
├── Orchestration: Docker Compose
└── Version Control: Git
```

## Database Schema

```sql
users (id, email, password, telegram_id, telegram_username, created_at, updated_at)
meals (id, user_id, name, description, protein_grams, carbs_grams, fat_grams, calories, prep_day, servings, image_url, created_at, updated_at)
meal_schedules (id, user_id, meal_id, scheduled_date, meal_type, servings, created_at)
bot_commands (id, user_id, command, executed_at)
```

## API Routes

```
Auth
├── POST   /api/users/register
├── POST   /api/users/login
├── GET    /api/users/profile
└── POST   /api/users/link-telegram

Meals
├── GET    /api/meals
├── POST   /api/meals
├── PUT    /api/meals/:id
└── DELETE /api/meals/:id

Scheduling
├── GET    /api/meals/schedule/:startDate/:endDate
├── POST   /api/meals/schedule
└── DELETE /api/meals/schedule/:id

Bot Control
├── GET    /api/bot/status
├── POST   /api/bot/send-message
├── GET    /api/bot/commands/history
└── POST   /api/bot/command

Health
└── GET    /health
```

## Telegram Bot Commands

```
/start    - Welcome message
/help     - Show available commands
/meals    - List all user meals
/today    - Today's meal schedule
/schedule - Weekly meal plan
/stats    - Today's nutrition statistics
```

## Environment Variables

```
TELEGRAM_BOT_TOKEN     # Telegram bot token from @BotFather
DATABASE_URL           # PostgreSQL connection string
REDIS_URL              # Redis connection URL
JWT_SECRET             # Secret for JWT signing
API_PORT               # Backend port (default: 3001)
API_URL                # Backend URL
FRONTEND_URL           # Frontend URL
NODE_ENV               # development/production
```

## Key Features

✨ Full-stack TypeScript application
✨ User authentication with JWT
✨ Meal recipe management
✨ Weekly meal scheduling
✨ Nutrition tracking (calories, macros)
✨ Telegram bot integration
✨ PostgreSQL with Redis caching
✨ Responsive design (mobile, tablet, desktop)
✨ Docker containerization
✨ RESTful API design
✨ State management with Zustand
✨ Real-time command logging

## Development Workflow

```bash
# Install dependencies
yarn install

# Development (runs backend and frontend)
yarn dev

# Build for production
yarn build

# Docker setup
docker-compose up --build
```

---

**Project Status**: ✅ Complete and Ready for Use

Created: April 22, 2026
