# Postman Testing Guide

## 📥 Import Postman Collection

1. **Buka Postman**
2. **Import Collection:**
   - Click **"Import"** button (top left)
   - Pilih file `postman_collection.json` dari root project folder
   - Collection "Task Management API" akan muncul di sidebar

## 🔧 Setup Environment (Optional)

Anda bisa langsung pakai karena base URL sudah di-set ke `http://localhost:3000`, tapi jika ingin lebih organized:

1. Click ⚙️ (Settings) di kanan atas
2. Pilih **"Environments"**
3. Click **"Create Environment"**
4. Beri nama: **"Local Development"**
5. Tambahkan variables:
   ```
   baseUrl: http://localhost:3000
   projectId: (kosongkan dulu)
   taskId: (kosongkan dulu)
   ```

## 🚀 Testing Workflow

### 1️⃣ Register User

**Path:** `Authentication` → `Register User`

1. Click pada request "Register User"
2. Body sudah terisi dengan contoh data
3. **Klik "Send"**
4. ✅ Response harus `201 Created` dengan data user

**Response Example:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "cm4l2...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-01T..."
  }
}
```

---

### 2️⃣ Login

**Path:** `Authentication` → `Login (Get Session)`

1. Click pada request "Login (Get Session)"
2. Body berisi email dan password dari user yang sudah register
3. **Klik "Send"**
4. ✅ Response harus `200 OK`

> **PENTING:** Setelah login, **Postman akan otomatis menyimpan cookies** (termasuk session token). Semua request selanjutnya akan authenticated.

**Cek Session Cookie:**

- Di tab response, klik **"Cookies"**
- Anda akan lihat cookie `next-auth.session-token`

---

### 3️⃣ Get Current User

**Path:** `Users` → `Get Current User`

1. Click pada request "Get Current User"
2. **Klik "Send"** (tidak perlu setting cookies, Postman auto-handle)
3. ✅ Response harus `200 OK` dengan data user yang sedang login

---

### 4️⃣ Create Project

**Path:** `Projects` → `Create Project`

1. Click pada request "Create Project"
2. Edit body jika perlu (nama, deskripsi, color)
3. **Klik "Send"**
4. ✅ Response harus `201 Created`
5. **COPY** value `id` dari response
6. Set sebagai environment variable `projectId`:
   - Click "Environment quick look" (👁️ icon)
   - Edit environment
   - Paste ID ke variable `projectId`

**Response Example:**

```json
{
  "project": {
    "id": "cm4l3abc...", // ← COPY THIS ID
    "name": "Website Redesign",
    "description": "...",
    "color": "#3b82f6",
    "ownerId": "...",
    "createdAt": "..."
  }
}
```

---

### 5️⃣ Create Task

**Path:** `Tasks` → `Create Task`

1. Click pada request "Create Task"
2. Body sudah menggunakan `{{projectId}}` variable
3. Edit task details jika perlu
4. **Klik "Send"**
5. ✅ Response harus `201 Created`
6. **COPY** value `id` dari response untuk variable `taskId`

---

### 6️⃣ Get All Tasks

**Path:** `Tasks` → `Get All Tasks`

1. Click pada request "Get All Tasks"
2. **Klik "Send"**
3. ✅ Response berisi array semua tasks

---

### 7️⃣ Filter Tasks

**Path:** `Tasks` → `Get Tasks with Filters`

1. Click pada request
2. Lihat tab **"Params"**
3. Enable/disable query parameters yang diinginkan:
   - `status`: TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED
   - `priority`: LOW, MEDIUM, HIGH, URGENT
   - `projectId`: Filter by project
4. **Klik "Send"**

---

### 8️⃣ Update Task

**Path:** `Tasks` → `Update Task` atau `Mark Task as Done`

1. Pastikan `taskId` variable sudah di-set
2. Edit body dengan field yang ingin di-update
3. **Klik "Send"**
4. ✅ Response berisi task yang sudah di-update

> **Note:** Ketika status di-update ke "DONE", field `completedAt` otomatis terisi.

---

### 9️⃣ Delete Task

**Path:** `Tasks` → `Delete Task`

1. Pastikan `taskId` variable sudah di-set
2. **Klik "Send"**
3. ✅ Response: `{ "message": "Task deleted successfully" }`

---

## 💡 Tips & Tricks

### 1. Menggunakan Variables

Di request body, anda bisa pakai:

```json
{
  "projectId": "{{projectId}}",
  "title": "Task for {{projectName}}"
}
```

### 2. Menyimpan Response ke Variable

Setelah create project/task, automasi penyimpanan ID:

1. Di tab request, klik **"Tests"**
2. Tambahkan script:

```javascript
// Save project ID from response
const response = pm.response.json();
if (response.project && response.project.id) {
  pm.collectionVariables.set("projectId", response.project.id);
}

// Save task ID from response
if (response.task && response.task.id) {
  pm.collectionVariables.set("taskId", response.task.id);
}
```

### 3. Melihat Cookies

- Di response, klik tab **"Cookies"**
- Untuk manage cookies: **Settings** → **Cookies**

### 4. Export Collection

Untuk share dengan team:

1. Kanan-klik pada collection
2. **"Export"**
3. Pilih format **"Collection v2.1"**
4. Save file

---

## 🐛 Troubleshooting

### ❌ Error 401 Unauthorized

**Masalah:** Session expired atau belum login

**Solusi:**

1. Jalankan ulang "Login" request
2. Pastikan cookies enabled di Postman
3. Check Settings → General → Enable cookies

### ❌ Error 404 Not Found

**Masalah:** ID tidak valid atau resource tidak ada

**Solusi:**

1. Pastikan `projectId` atau `taskId` variable sudah di-set
2. Cek nilai variable di Environment quick look (👁️)
3. Copy paste ID yang valid dari response create

### ❌ Error 400 Validation Error

**Masalah:** Request body tidak valid

**Solusi:**

1. Check required fields (title, email, password, dll)
2. Pastikan format data benar (email valid, status enum benar)
3. Check response error details

---

## 📊 Testing Checklist

- [x] ✅ Register new user
- [x] ✅ Login and get session
- [x] ✅ Get current user profile
- [x] ✅ Create project
- [x] ✅ Get all projects
- [x] ✅ Create task in project
- [x] ✅ Get all tasks
- [x] ✅ Filter tasks by status/priority
- [x] ✅ Update task
- [x] ✅ Mark task as done
- [x] ✅ Delete task
- [x] ✅ Delete project

---

## 🎯 Next Steps

1. **Explore API** dengan berbagai kombinasi filters
2. **Test edge cases** (invalid data, missing fields)
3. **Monitor Prisma Studio** untuk lihat perubahan di database
4. **Build Frontend** yang consume API ini

Happy Testing! 🚀
