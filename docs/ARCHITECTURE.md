# Системийн Архитектур

## 1. Authentication Architecture

### 1.1 Login Flow

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌─────────┐
│ Client  │────────>│ Auth API │────────>│   JWT    │────────>│ Database│
│(React)  │         │(Spring)  │         │  Util    │         │ (MySQL) │
└─────────┘         └──────────┘         └──────────┘         └─────────┘
     │                    │                    │                   │
     │ 1. POST /login     │                    │                   │
     │───────────────────>│                    │                   │
     │                    │ 2. Validate user  │                   │
     │                    │───────────────────>│                   │
     │                    │                    │ 3. Check DB       │
     │                    │                    │───────────────────>│
     │                    │                    │<───────────────────│
     │                    │ 4. Generate tokens│                   │
     │                    │<───────────────────│                   │
     │ 5. Return tokens   │                    │                   │
     │<───────────────────│                    │                   │
```

**Дэлгэрэнгүй үйл явц:**

1. **Client Request**: React frontend нь email болон password-ийг `/api/auth/login` endpoint руу илгээнэ
2. **Authentication**: Spring Security AuthenticationManager нь credentials-ийг шалгана
3. **User Validation**: 
   - Email байгаа эсэхийг шалгана
   - Account lock-логдсон эсэхийг шалгана
   - Account active эсэхийг шалгана
4. **Password Verification**: BCrypt ашиглан password-ийг шалгана
5. **Token Generation**: 
   - Access Token (15 минут) үүсгэнэ
   - Refresh Token (7 хоног) үүсгэнэ
6. **Audit Logging**: Нэвтрэлтийн үйлдлийг audit_logs хүснэгтэд бүртгэнэ
7. **Response**: Tokens болон user мэдээллийг буцаана

### 1.2 Token Issuance

**Access Token Structure:**
```json
{
  "sub": "user@example.com",
  "userId": 1,
  "role": "ADMIN",
  "iat": 1704067200,
  "exp": 1704068100
}
```

**Refresh Token Structure:**
```json
{
  "sub": "user@example.com",
  "userId": 1,
  "type": "refresh",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### 1.3 Token Refresh Flow

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│ Client  │────────>│ Auth API │────────>│   JWT    │
│(React)  │         │(Spring)  │         │  Util    │
└─────────┘         └──────────┘         └──────────┘
     │                    │                    │
     │ 1. POST /refresh   │                    │
     │    (refreshToken) │                    │
     │───────────────────>│                    │
     │                    │ 2. Validate       │
     │                    │    refresh token  │
     │                    │───────────────────>│
     │                    │<───────────────────│
     │                    │ 3. Generate new   │
     │                    │    access token   │
     │ 4. Return new tokens│                   │
     │<───────────────────│                    │
```

### 1.4 Role-Based Access Control Architecture

```
┌──────────────┐
│   Request    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ JWT Auth Filter  │ ← Extract token from Authorization header
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Validate Token   │ ← Check signature, expiration
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Load UserDetails │ ← Get user roles from database
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Security Context │ ← Set authentication
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Method Security  │ ← @PreAuthorize("hasRole('ADMIN')")
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Controller     │
└──────────────────┘
```

## 2. MySQL Database Schema

### 2.1 Users Table

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

**Тайлбар:**
- `password_hash`: BCrypt hash хэлбэрээр хадгалагдана
- `is_locked`: 5 удаа буруу нууц үг оруулбал true болно
- `locked_until`: Түгжигдсэн хугацаа
- `created_by`: Энэ хэрэглэгчийг хэн бүртгэснийг заана

### 2.2 Roles Table

```sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Default Roles:**
- ADMIN
- COACH
- STATISTICIAN

### 2.3 User Roles Junction Table

```sql
CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_by BIGINT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);
```

**Тайлбар:**
- Many-to-Many relationship
- Нэг хэрэглэгч олон role-тэй байж болно
- `assigned_by`: Энэ role-ийг хэн оноосныг заана

### 2.4 Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NULL,
    details JSON NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Audit Actions:**
- LOGIN_SUCCESS
- LOGIN_FAILED
- USER_CREATED
- USER_DELETED
- USER_UPDATED

## 3. Roles & Permissions Matrix

| Permission | ADMIN | COACH | STATISTICIAN |
|------------|-------|-------|--------------|
| Нэвтрэх | ✅ | ✅ | ✅ |
| Өөрийн мэдээлэл харах | ✅ | ✅ | ✅ |
| Хэрэглэгч бүртгэх | ✅ | ❌ | ❌ |
| Хэрэглэгч устгах | ✅ | ❌ | ❌ |
| Бүх хэрэглэгч харах | ✅ | ❌ | ❌ |
| COACH бүртгэх | ✅ | ❌ | ❌ |
| STATISTICIAN бүртгэх | ✅ | ❌ | ❌ |
| Багийн статистик харах | ✅ | ✅ | ❌ |
| Тоглолтын статистик бүртгэх | ✅ | ❌ | ✅ |

## 4. REST API Нарийвчилсан Тодорхойлолт

### 4.1 POST /api/auth/login

**Request:**
```json
{
  "email": "admin@volleyball.league",
  "password": "Admin@123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900000,
    "user": {
      "id": 1,
      "email": "admin@volleyball.league",
      "firstName": "Super",
      "lastName": "Admin",
      "roles": ["ADMIN"]
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Error Cases:**
- Invalid credentials → 401
- Account locked → 423
- Account inactive → 401

### 4.2 POST /api/admin/create-user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "email": "coach@example.com",
  "password": "Coach@123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+97612345678",
  "role": "COACH"
}
```

**Validation Rules:**
- Email: Required, valid email format, unique
- Password: Required, min 8 chars, must contain uppercase, lowercase, number, special char
- FirstName: Required, max 100 chars
- LastName: Required, max 100 chars
- Phone: Optional, valid phone format
- Role: Required, must be "COACH" or "STATISTICIAN"

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "coach@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+97612345678",
    "isActive": true,
    "isLocked": false,
    "roles": ["COACH"],
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "User with email coach@example.com already exists"
}
```

**Role Restrictions:**
- Only ADMIN can access
- Can only create COACH or STATISTICIAN roles

### 4.3 GET /api/admin/users

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@volleyball.league",
      "firstName": "Super",
      "lastName": "Admin",
      "phone": null,
      "isActive": true,
      "isLocked": false,
      "lastLoginAt": "2024-01-01T09:00:00",
      "roles": ["ADMIN"],
      "createdAt": "2024-01-01T08:00:00"
    }
  ]
}
```

**Role Restrictions:**
- Only ADMIN can access

### 4.4 DELETE /api/admin/users/:id

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Cases:**
- User not found → 404
- Cannot delete own account → 400
- Only ADMIN can access → 403

### 4.5 GET /api/me

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@volleyball.league",
    "firstName": "Super",
    "lastName": "Admin",
    "phone": null,
    "isActive": true,
    "isLocked": false,
    "lastLoginAt": "2024-01-01T09:00:00",
    "roles": ["ADMIN"],
    "createdAt": "2024-01-01T08:00:00"
  }
}
```

**Role Restrictions:**
- Any authenticated user

## 5. Backend Middleware Flow

### 5.1 JWT Authentication Filter

```java
1. Extract token from "Authorization: Bearer <token>" header
2. Validate token signature and expiration
3. Extract username from token
4. Load UserDetails from database
5. Set Authentication in SecurityContext
6. Continue filter chain
```

### 5.2 Role Authorization Filter

```java
1. Check SecurityContext for Authentication
2. Extract authorities (roles) from Authentication
3. Compare with @PreAuthorize annotation
4. Allow or deny access
```

### 5.3 Controller Flow

```
Request → JwtAuthenticationFilter → SecurityContext → 
@PreAuthorize → Controller → Service → Repository → Database
```

## 6. Frontend Flow (React)

### 6.1 Login UI Flow

```
1. User enters email and password
2. Form validation (react-hook-form)
3. POST /api/auth/login
4. Store tokens in localStorage
5. Store user info in AuthContext
6. Redirect based on role:
   - ADMIN → /admin
   - COACH → /coach
   - STATISTICIAN → /statistician
```

### 6.2 Dashboard Redirect (Role-Based Routing)

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 6.3 Protected Routes Organization

- `/login` - Public
- `/admin` - ADMIN only
- `/coach` - COACH only
- `/statistician` - STATISTICIAN only

### 6.4 Axios Interceptor (Token Refresh Logic)

```javascript
// Request interceptor: Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.post('/api/auth/refresh', { refreshToken })
      // Update tokens and retry original request
    }
  }
)
```

## 7. Нууцлал ба Хамгаалалтын Зөвлөмж

### 7.1 BCrypt Hashing

- Password strength: Min 8 characters, uppercase, lowercase, number, special char
- BCrypt rounds: 10 (default)
- Salt automatically generated

### 7.2 Token Expiration Policy

- Access Token: 15 minutes
- Refresh Token: 7 days
- Automatic refresh on 401 response

### 7.3 Invalid Login Attempt → Lock Account

- Max attempts: 5
- Lock duration: 30 minutes
- Automatic unlock after lock period expires

### 7.4 SameSite / HttpOnly Cookie Сонголт

**Одоогийн байдал:** Tokens localStorage-д хадгалагдана

**Production зөвлөмж:**
- HttpOnly cookies ашиглах (XSS хамгаалалт)
- SameSite=Strict (CSRF хамгаалалт)
- Secure flag (HTTPS only)

### 7.5 Admin User Creation Hardening

- Only ADMIN role can create users
- Can only create COACH or STATISTICIAN
- Email uniqueness validation
- Password strength validation
- Audit logging for all user creation

## 8. Sequence Diagrams

### 8.1 Login Sequence

```
User          Frontend         Backend          Database
 │               │                │                │
 │ 1. Enter      │                │                │
 │    credentials│                │                │
 │──────────────>│                │                │
 │               │ 2. POST /login │                │
 │               │───────────────>│                │
 │               │                │ 3. Find user   │
 │               │                │───────────────>│
 │               │                │<───────────────│
 │               │                │ 4. Validate    │
 │               │                │    password    │
 │               │                │ 5. Generate    │
 │               │                │    tokens      │
 │               │                │ 6. Log audit   │
 │               │                │───────────────>│
 │               │                │<───────────────│
 │               │ 7. Return      │                │
 │               │    tokens      │                │
 │               │<───────────────│                │
 │ 8. Store      │                │                │
 │    tokens     │                │                │
 │<──────────────│                │                │
 │ 9. Redirect   │                │                │
 │──────────────>│                │                │
```

### 8.2 Admin → Create Coach/Statistician Sequence

```
Admin         Frontend         Backend          Database
 │               │                │                │
 │ 1. Fill form  │                │                │
 │──────────────>│                │                │
 │               │ 2. POST        │                │
 │               │    /create-user│                │
 │               │    (with token)│                │
 │               │───────────────>│                │
 │               │                │ 3. Validate    │
 │               │                │    token       │
 │               │                │ 4. Check role  │
 │               │                │    (ADMIN)     │
 │               │                │ 5. Check email │
 │               │                │    exists      │
 │               │                │───────────────>│
 │               │                │<───────────────│
 │               │                │ 6. Hash       │
 │               │                │    password   │
 │               │                │ 7. Create user│
 │               │                │───────────────>│
 │               │                │ 8. Assign role│
 │               │                │───────────────>│
 │               │                │ 9. Log audit   │
 │               │                │───────────────>│
 │               │                │<───────────────│
 │               │ 10. Return     │                │
 │               │     user data  │                │
 │               │<───────────────│                │
 │ 11. Show      │                │                │
 │     success   │                │                │
 │<──────────────│                │                │
```

## 9. MySQL Save Process Transaction Flow

### 9.1 Admin Create User

```java
@Transactional
public UserResponse createUser(CreateUserRequest request, Long createdByUserId) {
    // 1. Start transaction
    
    // 2. Check email exists (SELECT)
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new IllegalArgumentException("Email exists");
    }
    
    // 3. Validate role (SELECT)
    Role role = roleRepository.findByName(request.getRole())
        .orElseThrow(() -> new IllegalArgumentException("Invalid role"));
    
    // 4. Get creator (SELECT)
    User creator = userRepository.findById(createdByUserId)
        .orElseThrow(() -> new IllegalArgumentException("Creator not found"));
    
    // 5. Create user (INSERT)
    User user = new User();
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    // ... set other fields
    user = userRepository.save(user);
    
    // 6. Assign role (INSERT into user_roles)
    user.getRoles().add(role);
    userRepository.save(user);
    
    // 7. Log audit (INSERT)
    AuditLog auditLog = new AuditLog();
    // ... set audit log fields
    auditLogRepository.save(auditLog);
    
    // 8. Commit transaction
    return mapToUserResponse(user);
}
```

### 9.2 Duplicate Email Validation

```java
// Before transaction
if (userRepository.existsByEmail(email)) {
    throw new IllegalArgumentException("Email already exists");
}

// Transaction ensures atomicity
@Transactional
public UserResponse createUser(...) {
    // All operations succeed or all fail
}
```

### 9.3 Transaction Commit / Rollback

**Commit Scenario:**
1. All validations pass
2. User created successfully
3. Role assigned successfully
4. Audit log created successfully
5. Transaction commits

**Rollback Scenario:**
1. Email validation fails → Rollback
2. Role not found → Rollback
3. Database constraint violation → Rollback
4. Any exception → Rollback

**Transaction Isolation:**
- Default: READ_COMMITTED
- Prevents dirty reads
- Ensures data consistency


