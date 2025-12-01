# API Testing Collection

## Base URL

```
http://localhost:3000
```

## 1. Register User

**Endpoint:** `POST /api/auth/register`

**Body:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

---

## 2. Login

**Endpoint:** `POST /api/auth/callback/credentials`

**Body:**

```json
{
  "email": "test@example.com",
  "password": "password123",
  "redirect": false
}
```

> **Note:** After login, save the session cookie for subsequent requests

---

## 3. Get Current User

**Endpoint:** `GET /api/users/me`

**Headers:**

```
Cookie: next-auth.session-token=<your_session_token>
```

---

## 4. Create Project

**Endpoint:** `POST /api/projects`

**Headers:**

```
Content-Type: application/json
Cookie: next-auth.session-token=<your_session_token>
```

**Body:**

```json
{
  "name": "Website Redesign",
  "description": "Redesign company website with modern UI",
  "color": "#3b82f6"
}
```

**Expected Response (201):**

```json
{
  "project": {
    "id": "...",
    "name": "Website Redesign",
    "description": "Redesign company website with modern UI",
    "color": "#3b82f6",
    "ownerId": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "owner": { ... }
  }
}
```

---

## 5. Get All Projects

**Endpoint:** `GET /api/projects`

**Headers:**

```
Cookie: next-auth.session-token=<your_session_token>
```

---

## 6. Create Task

**Endpoint:** `POST /api/tasks`

**Headers:**

```
Content-Type: application/json
Cookie: next-auth.session-token=<your_session_token>
```

**Body:**

```json
{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockup for the new homepage",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2025-12-15T10:00:00Z",
  "projectId": "<project_id_from_step_4>"
}
```

---

## 7. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Headers:**

```
Cookie: next-auth.session-token=<your_session_token>
```

**Query Parameters (optional):**

- `status` - Filter by status (TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED)
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `projectId` - Filter by project ID
- `assigneeId` - Filter by assignee ID

**Examples:**

```
GET /api/tasks?status=TODO
GET /api/tasks?priority=HIGH&status=IN_PROGRESS
GET /api/tasks?projectId=<project_id>
```

---

## 8. Get Task Detail

**Endpoint:** `GET /api/tasks/:id`

**Headers:**

```
Cookie: next-auth.session-token=<your_session_token>
```

---

## 9. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Headers:**

```
Content-Type: application/json
Cookie: next-auth.session-token=<your_session_token>
```

**Body (all fields optional):**

```json
{
  "title": "Updated title",
  "status": "IN_PROGRESS",
  "priority": "URGENT",
  "dueDate": "2025-12-20T10:00:00Z"
}
```

> **Note:** When status is changed to "DONE", `completedAt` is automatically set

---

## 10. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Headers:**

```
Cookie: next-auth.session-token=<your_session_token>
```

**Expected Response (200):**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

### 400 Validation Error

```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### 404 Not Found

```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Testing Workflow

1. **Register** a new user
2. **Login** to get session cookie
3. **Create** a project
4. **Create** tasks in that project
5. **List** tasks with various filters
6. **Update** task status
7. **Delete** completed tasks

---

## cURL Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{"title":"New task","status":"TODO","priority":"HIGH"}'
```

### Get Tasks

```bash
curl http://localhost:3000/api/tasks \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```
