# Суулгах Заавар (Монгол)

## Шаардлага

- Java 17 эсвэл дээш
- Maven 3.8+ 
- Node.js 18+
- MySQL 8.0+
- Git

## Алхам алхмаар заавар

### 1. Database суулгах

```bash
# MySQL руу нэвтрэх
mysql -u root -p

# Database үүсгэх
CREATE DATABASE volleyball_league CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Гарах
exit;

# Schema файлыг ажиллуулах
mysql -u root -p volleyball_league < database/schema.sql
```

**Анхаар:** Хэрэв super admin-ийн нууц үгийг өөрчлөх шаардлагатай бол:

1. Backend application ажиллуулах
2. Дараах код ашиглан hash үүсгэх:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("YourPassword");
System.out.println(hash);
```

3. `database/schema.sql` файл дээрх password_hash-ийг шинэчлэх

### 2. Backend тохируулах

`backend/src/main/resources/application.yml` файлыг нээж, database мэдээллээ засах:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/volleyball_league
    username: root  # Өөрийн MySQL username
    password: root  # Өөрийн MySQL password
```

### 3. Backend ажиллуулах

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Амжилттай бол дараах мессеж харагдана:
```
Started VolleyballLeagueApplication in X.XXX seconds
```

Backend нь `http://localhost:8080` дээр ажиллана.

### 4. Frontend суулгах

```bash
cd frontend
npm install
```

### 5. Frontend ажиллуулах

```bash
npm run dev
```

Frontend нь `http://localhost:5173` дээр ажиллана.

### 6. Системд нэвтрэх

1. Браузер дээр `http://localhost:5173` руу очно
2. Дараах мэдээллээр нэвтэрнэ:
   - **Имэйл**: admin@volleyball.league
   - **Нууц үг**: Admin@123

3. Амжилттай нэвтэрсэн бол Админ самбар руу шилжинэ

## Алдаа засах

### Database холболтын алдаа

**Алдаа:** `Communications link failure` эсвэл `Access denied`

**Шийдэл:**
1. MySQL service ажиллаж байгаа эсэхийг шалгах:
   ```bash
   # macOS/Linux
   sudo systemctl status mysql
   # эсвэл
   brew services list
   ```

2. Database үүссэн эсэхийг шалгах:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

3. `application.yml` дээрх мэдээлэл зөв эсэхийг шалгах

### Port аль хэдийн ашиглагдаж байна

**Алдаа:** `Port 8080 is already in use`

**Шийдэл:**
1. Backend port өөрчлөх: `application.yml` дээр:
   ```yaml
   server:
     port: 8081  # Өөр port сонгох
   ```

2. Frontend proxy тохируулах: `vite.config.js` дээр:
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:8081',  // Шинэ port
     }
   }
   ```

### CORS алдаа

**Алдаа:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Шийдэл:**
`backend/src/main/java/com/volleyball/security/SecurityConfig.java` файл дээр:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174"  // Хэрэв өөр port ашиглаж байвал
));
```

### Maven алдаа

**Алдаа:** `Could not resolve dependencies`

**Шийдэл:**
```bash
cd backend
mvn clean
mvn dependency:resolve
mvn install
```

### npm алдаа

**Алдаа:** `npm ERR!`

**Шийдэл:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Production Deployment

### Backend

1. JAR файл үүсгэх:
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. JAR файл ажиллуулах:
   ```bash
   java -jar target/volleyball-league-system-1.0.0.jar
   ```

3. Systemd service үүсгэх (Linux):
   ```ini
   [Unit]
   Description=Volleyball League Backend
   After=network.target

   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/backend
   ExecStart=/usr/bin/java -jar target/volleyball-league-system-1.0.0.jar
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

### Frontend

1. Build хийх:
   ```bash
   cd frontend
   npm run build
   ```

2. `dist/` folder-ийг web server дээр deploy хийх (Nginx, Apache, эсвэл CDN)

3. Nginx тохиргоо жишээ:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       root /path/to/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Production Security Checklist

- [ ] JWT secret key-г production-д өөрчлөх
- [ ] Database password-ийг хүчтэй болгох
- [ ] HTTPS идэвхжүүлэх
- [ ] CORS тохиргоог зөв хийх
- [ ] Environment variables ашиглах (.env файл)
- [ ] Logging тохируулах
- [ ] Database backup тохируулах
- [ ] Rate limiting нэмэх
- [ ] HttpOnly cookies ашиглах (optional)

## Дэмжлэг

Асуулт эсвэл алдаа гарвал GitHub Issues дээр мэдэгдэх эсвэл email илгээх.


