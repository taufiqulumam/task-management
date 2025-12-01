# Task Management Backend

Full-stack task management application built with Next.js, Prisma, PostgreSQL, and NextAuth.js.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Installation

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL database**

   ```bash
   docker compose up -d
   ```

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open Prisma Studio (optional)**
   ```bash
   npx prisma studio
   ```

The application will be running at:

- **App:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555

## 📚 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma
- **Authentication:** NextAuth.js with JWT
- **Validation:** Zod
- **UI:** Radix UI, Tailwind CSS

## 🗄️ Database Schema

- **User** - User accounts and authentication
- **Project** - Project containers for tasks
- **Task** - Individual tasks with status, priority, due dates
- **Team** - Teams for collaboration
- **TeamMember** - Team membership and roles
- **Comment** - Task comments
- **Label** - Task labels/tags

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Users

- `GET /api/users/me` - Get current user

### Tasks

- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task detail
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project detail
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

See [API_TESTING.md](./API_TESTING.md) for detailed API documentation and examples.

## 🔧 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://taskmanager:taskmanager_password@localhost:5432/taskmanagement?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

## 📖 Useful Commands

### Docker

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs -f postgres
```

### Prisma

```bash
# Open Prisma Studio
npx prisma studio

# Generate client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (caution!)
npx prisma migrate reset
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── tasks/        # Task CRUD endpoints
│   │   ├── projects/     # Project CRUD endpoints
│   │   └── users/        # User endpoints
│   └── ...               # Frontend pages
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   └── api-middleware.ts # API utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── types/
│   └── next-auth.d.ts    # TypeScript declarations
└── docker-compose.yml    # PostgreSQL Docker setup
```

## 🧪 Testing the API

Use the provided [API_TESTING.md](./API_TESTING.md) file to test all endpoints with cURL or your favorite API client.

## 📝 License

MIT
