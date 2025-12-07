# Backend Connection алдаа засах

## Асуудал: ECONNREFUSED

Frontend нь backend-тэй холбогдохгүй байна. Энэ нь backend ажиллахгүй байгаа гэсэн үг.

## Шийдэл:

### 1. Backend ажиллуулах

**Terminal дээр:**
```bash
cd backend
./mvnw spring-boot:run
```

Амжилттай бол:
```
Started VolleyballLeagueApplication in X.XXX seconds
```

### 2. Backend шалгах

```bash
curl http://localhost:8080/api/auth/login
```

Хариу ирэх ёстой (401 эсвэл 400 - энэ нь зөв, backend ажиллаж байна гэсэн үг).

### 3. Port шалгах

```bash
lsof -i:8080
```

Backend process харагдах ёстой.

### 4. Backend зогсоох

```bash
# Ctrl+C terminal дээр
# Эсвэл
./STOP_BACKEND.sh
```

## Хурдан командууд:

### Backend ажиллуулах:
```bash
cd backend && ./mvnw spring-boot:run
```

### Backend background дээр ажиллуулах:
```bash
cd backend && nohup ./mvnw spring-boot:run > ../backend.log 2>&1 &
```

### Backend log харах:
```bash
tail -f backend.log
```

### Backend зогсоох:
```bash
./STOP_BACKEND.sh
```

## Алдаа засах:

### Port 8080 аль хэдийн ашиглагдаж байна:
```bash
lsof -ti:8080 | xargs kill -9
```

### Backend compile алдаа:
```bash
cd backend
./mvnw clean compile
```

### Database холболтын алдаа:
- `application.yml` дээрх database мэдээлэл зөв эсэхийг шалгах
- MySQL ажиллаж байгаа эсэхийг шалгах

