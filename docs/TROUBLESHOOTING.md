# Login алдаа засах заавар

## "Login failed" алдаа гарвал

### 1. Database-д хэрэглэгч байгаа эсэхийг шалгах

```bash
mysql -u root -p volleyball_league < database/check_user.sql
```

Эсвэл MySQL руу нэвтрээд:

```sql
SELECT * FROM users WHERE email = 'admin@volleyball.league';
```

### 2. Password hash шинэчлэх

Хэрэв хэрэглэгч байгаа боловч нэвтрэхгүй бол:

```bash
# 1. Шинэ hash үүсгэх
cd backend
./mvnw exec:java -Dexec.mainClass="com.volleyball.util.PasswordHashGenerator" -Dexec.classpathScope=compile

# 2. Database-д шинэчлэх
mysql -u root -p volleyball_league < database/update_admin_password.sql
```

### 3. Database-г дахин үүсгэх

Хэрэв хэрэглэгч байхгүй бол:

```bash
# Database-г устгах
mysql -u root -p -e "DROP DATABASE IF EXISTS volleyball_league;"

# Дахин үүсгэх
mysql -u root -p < database/schema.sql
```

### 4. Backend log шалгах

Backend ажиллаж байгаа terminal дээр алдааны мессежийг шалгах:

- `Invalid email or password` - Email эсвэл password буруу
- `Account is locked` - Данс түгжигдсэн
- `Account is inactive` - Данс идэвхгүй

### 5. Common Issues

#### Issue: Password hash doesn't match
**Шийдэл:** `update_admin_password.sql` ажиллуулах

#### Issue: User doesn't exist
**Шийдэл:** `schema.sql` дахин ажиллуулах

#### Issue: Account is locked
**Шийдэл:**
```sql
UPDATE users 
SET is_locked = FALSE, 
    locked_until = NULL, 
    failed_login_attempts = 0 
WHERE email = 'admin@volleyball.league';
```

#### Issue: Database connection error
**Шийдэл:** `application.yml` дээрх database мэдээлэл зөв эсэхийг шалгах

### 6. Test Login with cURL

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@volleyball.league","password":"Admin@123"}'
```

Амжилттай бол access token буцаана.

### 7. Frontend-ээс шалгах

Browser console (F12) дээр network tab-аас:
- Request payload зөв эсэхийг шалгах
- Response status code шалгах
- Error message унших


