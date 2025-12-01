# Backend Setup - Task Management Application

## ✅ What Was Completed

I've successfully set up a complete fullstack backend for your task management application with the following components:

### 🗄️ Database Layer

- **PostgreSQL** running in Docker container
- **Prisma ORM** with comprehensive schema including:
  - User authentication models (User, Account, Session, VerificationToken)
  - Task management models (Task, Project, Team, TeamMember)
  - Collaboration features (Comment, Label, TaskLabel)
  - Full relations and indexes for performance

### 🔐 Authentication

- **NextAuth.js** with JWT strategy
- Credentials provider (email/password)
- Password hashing with bcryptjs
- Secure session management
- Registration endpoint with validation

### 🚀 REST API Endpoints

All endpoints are protected with authentication and include proper error handling:

#### Authentication

```
POST /api/auth/register     # Register new user
POST /api/auth/signin       # Login (NextAuth)
POST /api/auth/signout      # Logout (NextAuth)
GET  /api/auth/session      # Get current session
```

#### Users

```
GET  /api/users/me          # Get current user profile
```

#### Tasks

```
GET    /api/tasks           # List all tasks (with filters: status, priority, projectId, assigneeId)
POST   /api/tasks           # Create new task
GET    /api/tasks/:id       # Get task detail with comments
PUT    /api/tasks/:id       # Update task (auto-sets completedAt when status=DONE)
DELETE /api/tasks/:id       # Delete task
```

#### Projects

```
GET    /api/projects        # List all user's projects
POST   /api/projects        # Create new project
GET    /api/projects/:id    # Get project detail with all tasks
PUT    /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
```

---

## 🧪 Testing the Backend

### 1. Database Connection ✅

**Prisma Studio is running at:** http://localhost:5555

![Prisma Studio](/Users/taufiqulmam/.gemini/antigravity/brain/7f24611a-e0f1-4ded-a89e-adff78f2f077/prisma_studio_screenshot.png)

You can:

- View all database tables
- Browse, create, edit, and delete records
- Test relationships between models

### 2. Test API with cURL

#### Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "redirect": false
  }'
```

#### Create a Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "My First Project",
    "description": "This is a test project",
    "color": "#3b82f6"
  }'
```

#### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "Complete backend setup",
    "description": "Finished setting up the backend!",
    "status": "DONE",
    "priority": "HIGH",
    "projectId": "PROJECT_ID_FROM_ABOVE"
  }'
```

#### Get All Tasks

```bash
curl http://localhost:3000/api/tasks \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

#### Filter Tasks by Status

```bash
curl "http://localhost:3000/api/tasks?status=TODO&priority=HIGH" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### 3. Test with Thunder Client / Postman

You can import these endpoints into Thunder Client or Postman for easier testing.

**Environment variables:**

```
BASE_URL: http://localhost:3000
```

---

## 📁 Project Structure

```
task-management-frontend/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/
│       │   │   └── route.ts       # NextAuth handler
│       │   └── register/
│       │       └── route.ts       # User registration
│       ├── tasks/
│       │   ├── route.ts           # GET, POST tasks
│       │   └── [id]/
│       │       └── route.ts       # GET, PUT, DELETE specific task
│       ├── projects/
│       │   ├── route.ts           # GET, POST projects
│       │   └── [id]/
│       │       └── route.ts       # GET, PUT, DELETE specific project
│       └── users/
│           └── me/
│               └── route.ts       # GET current user
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # NextAuth configuration
│   └── api-middleware.ts          # API utilities & auth middleware
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── types/
│   └── next-auth.d.ts            # NextAuth type extensions
├── docker-compose.yml            # PostgreSQL Docker setup
├── prisma.config.ts              # Prisma 7 configuration
└── .env                          # Environment variables
```

---

## 🔧 Useful Commands

### Docker Commands

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# View logs
docker compose logs -f postgres

# Remove database (caution!)
docker compose down -v
```

### Prisma Commands

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Create migration (after schema changes)
npx prisma migrate dev --name migration_name

# Reset database (caution!)
npx prisma migrate reset

# Push schema without migration (development only)
npx prisma db push
```

### Development

```bash
# Run Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎯 Next Steps

### 1. **Frontend Integration**

Now you can integrate these APIs into your frontend:

```typescript
// Example: Fetch tasks
const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  const data = await response.json();
  return data.tasks;
};

// Example: Create task
const createTask = async (taskData) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return response.json();
};
```

### 2. **Add More Features**

Consider adding:

- Task comments endpoint (`POST /api/tasks/:id/comments`)
- Labels endpoint (`GET/POST /api/labels`)
- Team management endpoints
- File uploads for task attachments
- Real-time updates with WebSockets
- Email notifications

### 3. **UI Components**

Create frontend components:

- Login/Register forms
- Task list with filters
- Task detail view
- Project dashboard
- User profile

### 4. **Testing**

Add tests:

- Unit tests for API routes
- Integration tests for database operations
- E2E tests with Playwright

---

## 📊 Database Schema Overview

```mermaid
erDiagram
    User ||--o{ Task : creates
    User ||--o{ Project : owns
    User ||--o{ Comment : writes

    Project ||--o{ Task : contains

    Task ||--o{ Comment : has
    Task ||--o{ TaskLabel : has

    Label ||--o{ TaskLabel : "used in"

    User {
        string id PK
        string email UK
        string name
        string password
    }

    Project {
        string id PK
        string name
        string ownerId FK
    }

    Task {
        string id PK
        string title
        enum status
        enum priority
        datetime dueDate
        string projectId FK
        string assigneeId FK
        string createdById FK
    }
```

---

## ⚙️ Environment Variables

Your `.env` file contains:

```env
DATABASE_URL="postgresql://taskmanager:taskmanager_password@localhost:5432/taskmanagement?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
```

> [!IMPORTANT] > **Production:** Generate secure secrets before deploying:
>
> ```bash
> openssl rand -base64 32
> ```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker compose restart postgres
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset and resync database
npx prisma migrate reset
```

### Authentication Issues

- Check that `NEXTAUTH_SECRET` is set
- Verify session cookies are being set
- Check browser console for CORS errors

---

## 🎉 Summary

Your backend is now fully functional with:

- ✅ PostgreSQL database running in Docker
- ✅ Prisma ORM with complete schema
- ✅ NextAuth.js authentication with JWT
- ✅ Full REST API for tasks, projects, and users
- ✅ Proper error handling and validation
- ✅ Type-safe API routes with TypeScript

You can now start building your frontend UI and connect it to these APIs! 🚀
