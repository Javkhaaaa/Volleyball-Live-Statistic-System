# Quick Start Guide

## Шаардлага

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

## Хурдан Суулгах

### 1. Database суулгах

```bash
# MySQL руу нэвтрэх
mysql -u root -p

# Database үүсгэх
CREATE DATABASE volleyball_league;

# Schema ажиллуулах
mysql -u root -p volleyball_league < database/schema.sql
```

### 2. Backend тохируулах

`backend/src/main/resources/application.yml` файлыг засах:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/volleyball_league
    username: root  # Өөрийн username
    password: root  # Өөрийн password
```

### 3. Backend ажиллуулах

```bash
cd backend
mvn spring-boot:run
```

Backend нь `http://localhost:8080` дээр ажиллана.

### 4. Frontend ажиллуулах

```bash
cd frontend
npm install
npm run dev
```

Frontend нь `http://localhost:5173` дээр ажиллана.

### 5. Нэвтрэх

Браузер дээр `http://localhost:5173` руу очоод:

- **Имэйл**: admin@volleyball.league
- **Нууц үг**: Admin@123

## Анхны Super Admin Password Hash

Хэрэв super admin-ийн нууц үгийг өөрчлөх шаардлагатай бол:

```java
// Java code
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("YourNewPassword");
// Hash-ийг database-д хадгална
```

Эсвэл Spring Boot application ажиллуулж, BCrypt hash үүсгэх:

```bash
# Terminal дээр
java -cp backend/target/classes org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
```

## Алдаа засах

### Database холболтын алдаа

- MySQL service ажиллаж байгаа эсэхийг шалгах
- `application.yml` дээрх database мэдээлэл зөв эсэхийг шалгах
- Database үүссэн эсэхийг шалгах

### Port аль хэдийн ашиглагдаж байна

- Backend: `application.yml` дээр `server.port` өөрчлөх
- Frontend: `vite.config.js` дээр `server.port` өөрчлөх

### CORS алдаа

- `SecurityConfig.java` дээрх CORS тохиргоог шалгах
- Frontend URL-ийг `allowedOrigins` дээр нэмэх

## Production Deployment

### Backend

```bash
cd backend
mvn clean package
java -jar target/volleyball-league-system-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
# dist/ folder-ийг web server дээр deploy хийх
```

## API Testing

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@volleyball.league","password":"Admin@123"}'
```

**Create User (Admin only):**
```bash
curl -X POST http://localhost:8080/api/admin/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "email":"coach@example.com",
    "password":"Coach@123",
    "firstName":"John",
    "lastName":"Doe",
    "role":"COACH"
  }'
```

**Get Users:**
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer <access_token>"
```


