#!/bin/bash

# Backend зогсоох script

if [ -f "backend.pid" ]; then
    PID=$(cat backend.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "Backend зогсоож байна (PID: $PID)..."
        kill $PID
        rm backend.pid
        echo "✅ Backend зогссон"
    else
        echo "Backend аль хэдийн зогссон байна"
        rm backend.pid
    fi
else
    echo "Backend PID файл олдсонгүй"
    echo "Port 8080 дээрх процесс устгаж байна..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null
    echo "✅ Port 8080 чөлөөтэй болсон"
fi

