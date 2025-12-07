#!/bin/bash

# Бүх системийг ажиллуулах script

echo "=========================================="
echo "Volleyball League System - Startup Script"
echo "=========================================="
echo ""

# Check if MySQL is running
echo "1. MySQL шалгаж байна..."
if ! mysql -u root -p'password' -e "SELECT 1" &>/dev/null; then
    echo "   ⚠️  MySQL ажиллахгүй байна. MySQL-ийг эхлүүлнэ үү."
    exit 1
fi
echo "   ✅ MySQL ажиллаж байна"
echo ""

# Check database
echo "2. Database шалгаж байна..."
DB_EXISTS=$(mysql -u root -p'password' -e "SHOW DATABASES LIKE 'volleyball_league';" 2>/dev/null | grep -c volleyball_league)
if [ "$DB_EXISTS" -eq 0 ]; then
    echo "   ⚠️  Database байхгүй. Database үүсгэж байна..."
    mysql -u root -p'password' -e "CREATE DATABASE volleyball_league CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    mysql -u root -p'password' volleyball_league < database/schema.sql 2>/dev/null
    mysql -u root -p'password' volleyball_league < database/insert_initial_data.sql 2>/dev/null
    echo "   ✅ Database үүсгэгдлээ"
else
    echo "   ✅ Database байна"
fi
echo ""

# Start Backend
echo "3. Backend ажиллуулж байна..."
cd backend
if [ ! -f "./mvnw" ]; then
    echo "   ⚠️  Maven Wrapper олдсонгүй"
    exit 1
fi

# Check if backend is already running
if lsof -ti:8080 &>/dev/null; then
    echo "   ⚠️  Port 8080 аль хэдийн ашиглагдаж байна"
    echo "   Backend аль хэдийн ажиллаж байгаа байж магадгүй"
else
    echo "   Backend ажиллуулж байна (background)..."
    ./mvnw spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    echo "   Backend PID: $BACKEND_PID"
    echo "   Log файл: backend.log"
    
    # Wait for backend to start
    echo "   Backend эхлэхийг хүлэж байна..."
    sleep 10
    
    # Check if backend started
    if curl -s http://localhost:8080/api/auth/login > /dev/null 2>&1; then
        echo "   ✅ Backend амжилттай эхэлсэн"
    else
        echo "   ⚠️  Backend эхлэхэд асуудал гарлаа. backend.log файлыг шалгана уу"
    fi
fi
cd ..
echo ""

# Start Frontend
echo "4. Frontend ажиллуулж байна..."
cd frontend
if [ ! -f "package.json" ]; then
    echo "   ⚠️  Frontend файлууд олдсонгүй"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "   npm install хийж байна..."
    npm install
fi

echo "   Frontend ажиллуулж байна..."
echo "   Browser дээр http://localhost:5173 эсвэл http://localhost:5174 руу очно уу"
echo ""
echo "=========================================="
echo "Систем ажиллаж байна!"
echo "=========================================="
echo ""
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173 (эсвэл 5174)"
echo ""
echo "Нэвтрэх мэдээлэл:"
echo "  Email: admin@volleyball.league"
echo "  Password: Admin@123"
echo ""
echo "Backend зогсоох: kill \$(cat ../backend.pid)"
echo "=========================================="

npm run dev

