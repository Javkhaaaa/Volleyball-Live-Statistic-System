#!/bin/bash

# Database-г дахин үүсгэх script
# Usage: ./reset_database.sh

DB_NAME="volleyball_league"
DB_USER="root"
DB_PASS="password"

echo "Database-г дахин үүсгэж байна..."

# Database-г устгах
mysql -u $DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS $DB_NAME;"

# Database-г үүсгэх
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Schema ажиллуулах
mysql -u $DB_USER -p$DB_PASS $DB_NAME < database/schema.sql

# Өгөгдөл нэмэх
mysql -u $DB_USER -p$DB_PASS $DB_NAME < database/insert_initial_data.sql

echo "✅ Database амжилттай дахин үүсгэгдлээ!"
echo ""
echo "Admin нэвтрэх мэдээлэл:"
echo "  Email: admin@volleyball.league"
echo "  Password: Admin@123"


