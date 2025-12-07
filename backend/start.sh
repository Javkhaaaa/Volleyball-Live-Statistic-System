#!/bin/bash

# Backend ажиллуулах script
# Usage: ./start.sh

echo "Backend ажиллуулж байна..."
echo ""

cd "$(dirname "$0")"

# Maven Wrapper ашиглан ажиллуулах
./mvnw spring-boot:run


