# Хэрэглэгчийн Заавар (Монгол)

## Эхлэх алхмууд

### 1. Database суулгах

```bash
cd "/Users/bayarjavkhlanmunkhsaikhan/Documents/Volleyball Live Statistic System"
./database/reset_database.sh
```

Эсвэл manual:
```bash
mysql -u root -p'password' -e "DROP DATABASE IF EXISTS volleyball_league;"
mysql -u root -p'password' -e "CREATE DATABASE volleyball_league CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p'password' volleyball_league < database/schema.sql
mysql -u root -p'password' volleyball_league < database/insert_initial_data.sql
```

### 2. Backend ажиллуулах

**Terminal 1 дээр:**
```bash
cd "/Users/bayarjavkhlanmunkhsaikhan/Documents/Volleyball Live Statistic System/backend"
./mvnw spring-boot:run
```

Амжилттай бол:
```
Started VolleyballLeagueApplication in X.XXX seconds
```

Backend нь `http://localhost:8080` дээр ажиллана.

### 3. Frontend ажиллуулах

**Terminal 2 дээр (шинэ terminal):**
```bash
cd "/Users/bayarjavkhlanmunkhsaikhan/Documents/Volleyball Live Statistic System/frontend"
npm install  # Зөвхөн анх удаа
npm run dev
```

Frontend нь `http://localhost:5173` дээр ажиллана.

---

## Системд нэвтрэх

### 1. Браузер дээр нээх

Браузер дээр дараах URL руу очно:
```
http://localhost:5173
```

### 2. Нэвтрэх хуудас

Нэвтрэх хуудас харагдана. Дараах мэдээллээр нэвтэрнэ:

- **Имэйл:** `admin@volleyball.league`
- **Нууц үг:** `Admin@123`

### 3. Нэвтрэх товч дарах

"Нэвтрэх" товч дарахад:
- ✅ Амжилттай бол → Админ самбар руу шилжинэ
- ❌ Алдаа гарвал → Алдааны мессеж харагдана

---

## Админ Самбар ашиглах

### 1. Хэрэглэгчдийн жагсаалт харах

Админ самбар дээр бүх бүртгэлтэй хэрэглэгчдийн жагсаалт харагдана:
- ID
- Имэйл
- Нэр, Овог
- Утас
- Эрх (ADMIN, COACH, STATISTICIAN)
- Төлөв (Идэвхтэй/Идэвхгүй)

### 2. Шинэ хэрэглэгч бүртгэх

**Алхам:**
1. "+ Шинэ хэрэглэгч бүртгэх" товч дарах
2. Форм бөглөх:
   - **Имэйл:** (жишээ: `coach1@example.com`)
   - **Нууц үг:** (жишээ: `Coach@123`)
   - **Нэр:** (жишээ: `Бат`)
   - **Овог:** (жишээ: `Дорж`)
   - **Утас:** (сонголттой, жишээ: `+97612345678`)
   - **Эрх:** COACH эсвэл STATISTICIAN сонгох
3. "Бүртгэх" товч дарах
4. ✅ Амжилттай бол → Жагсаалтад шинэ хэрэглэгч харагдана

**Анхаар:**
- Зөвхөн COACH болон STATISTICIAN бүртгэх боломжтой
- ADMIN бүртгэх боломжгүй (зөвхөн super admin байна)
- Имэйл давхардсан байх ёсгүй

### 3. Хэрэглэгч устгах

**Алхам:**
1. Хэрэглэгчийн мөрний "Устгах" товч дарах
2. Баталгаажуулах: "Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?"
3. "OK" дарах
4. ✅ Хэрэглэгч устгагдлаа

**Анхаар:**
- Өөрийн дансыг устгах боломжгүй
- Устгасан хэрэглэгчийг сэргээх боломжгүй

### 4. Гарах

Баруун дээд буланд "Гарах" товч дарахад:
- Token устгагдана
- Нэвтрэх хуудас руу буцна

---

## Жишээ: Дасгалжуулагч бүртгэх

1. Нэвтрэх: `admin@volleyball.league` / `Admin@123`
2. "+ Шинэ хэрэглэгч бүртгэх" товч дарах
3. Форм бөглөх:
   ```
   Имэйл: coach.bat@volleyball.league
   Нууц үг: Coach@123
   Нэр: Бат
   Овог: Дорж
   Утас: +97699112233
   Эрх: COACH
   ```
4. "Бүртгэх" дарах
5. ✅ Жагсаалтад шинэ хэрэглэгч харагдана

---

## Жишээ: Статистикч бүртгэх

1. Нэвтрэх: `admin@volleyball.league` / `Admin@123`
2. "+ Шинэ хэрэглэгч бүртгэх" товч дарах
3. Форм бөглөх:
   ```
   Имэйл: stat.munkh@volleyball.league
   Нууц үг: Stat@123
   Нэр: Мөнх
   Овог: Болд
   Утас: +97699223344
   Эрх: STATISTICIAN
   ```
4. "Бүртгэх" дарах
5. ✅ Жагсаалтад шинэ хэрэглэгч харагдана

---

## Бүртгэсэн хэрэглэгч нэвтрэх

Бүртгэсэн хэрэглэгч (COACH эсвэл STATISTICIAN) нэвтрэх:

1. Браузер дээр `http://localhost:5173` руу очно
2. Бүртгэсэн имэйл болон нууц үгээр нэвтэрнэ
3. ⚠️ **Одоогоор зөвхөн ADMIN dashboard байна**
4. COACH болон STATISTICIAN dashboard-ууд ирээдүйд нэмэгдэнэ

---

## API тест хийх (cURL)

### Нэвтрэх:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@volleyball.league","password":"Admin@123"}'
```

### Хэрэглэгчдийн жагсаалт авах:
```bash
# Эхлээд login хийж token авах
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@volleyball.league","password":"Admin@123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Token ашиглан хэрэглэгчдийн жагсаалт авах
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## Алдаа засах

### "Login failed" алдаа:
1. Database-д хэрэглэгч байгаа эсэхийг шалгах:
   ```bash
   mysql -u root -p'password' volleyball_league -e "SELECT email FROM users;"
   ```
2. Хэрэв байхгүй бол өгөгдөл нэмэх:
   ```bash
   mysql -u root -p'password' volleyball_league < database/insert_initial_data.sql
   ```

### Backend ажиллахгүй:
1. Port 8080 чөлөөтэй эсэхийг шалгах
2. Database холболт зөв эсэхийг шалгах
3. `application.yml` дээрх мэдээлэл зөв эсэхийг шалгах

### Frontend ажиллахгүй:
1. `npm install` ажиллуулсан эсэхийг шалгах
2. Port 5173 чөлөөтэй эсэхийг шалгах
3. Backend ажиллаж байгаа эсэхийг шалгах

---

## Одоогийн функцүүд

✅ **Бэлэн:**
- Нэвтрэх (JWT authentication)
- Админ самбар
- Хэрэглэгч бүртгэх (COACH, STATISTICIAN)
- Хэрэглэгчдийн жагсаалт харах
- Хэрэглэгч устгах
- Account locking (5 удаа буруу нууц үг)
- Audit logging

⏳ **Ирээдүйд:**
- COACH dashboard
- STATISTICIAN dashboard
- Тоглолтын статистик бүртгэх
- Багийн мэдээлэл удирдах
- Тайлан үүсгэх

---

## Холбоо барих

Асуулт эсвэл алдаа гарвал:
- Backend terminal дээрх log шалгах
- Browser console (F12) шалгах
- `docs/TROUBLESHOOTING.md` файл унших

