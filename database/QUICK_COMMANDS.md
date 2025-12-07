# Database Quick Commands

## 1. Database-г бүрэн дахин үүсгэх (Schema + Data)

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

## 2. Зөвхөн өгөгдөл нэмэх (хүснэгт байгаа бол)

```bash
mysql -u root -p'password' volleyball_league < database/insert_initial_data.sql
```

## 3. Schema дахин ажиллуулах (хүснэгтүүдийг дахин үүсгэх)

```bash
mysql -u root -p'password' volleyball_league < database/schema.sql
mysql -u root -p'password' volleyball_league < database/insert_initial_data.sql
```

## 4. Хэрэглэгч шалгах

```bash
mysql -u root -p'password' volleyball_league -e "SELECT id, email, first_name, last_name, is_active FROM users;"
```

## 5. Role шалгах

```bash
mysql -u root -p'password' volleyball_league -e "SELECT * FROM roles;"
```

## 6. User-Role холбоо шалгах

```bash
mysql -u root -p'password' volleyball_league -e "SELECT u.email, r.name as role FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id;"
```

## 7. Admin password шинэчлэх

```bash
mysql -u root -p'password' volleyball_league < database/update_admin_password.sql
```

## 8. Account lock цэвэрлэх

```bash
mysql -u root -p'password' volleyball_league -e "UPDATE users SET is_locked = FALSE, locked_until = NULL, failed_login_attempts = 0 WHERE email = 'admin@volleyball.league';"
```

## 9. Бүх хүснэгтийн өгөгдөл устгах (хүснэгтүүдийг хадгалах)

```bash
mysql -u root -p'password' volleyball_league -e "DELETE FROM audit_logs; DELETE FROM user_roles; DELETE FROM users; DELETE FROM roles;"
```

## 10. Migration ажиллуулах (audit_logs.details TEXT болгох)

```bash
mysql -u root -p'password' volleyball_league < database/migration_fix_audit_logs.sql
```

## Password өөрчлөх

Хэрэв MySQL password өөр бол дээрх командууд дээр `-p'password'` хэсгийг өөрийн password-оор солих эсвэл зөвхөн `-p` ашиглаж password-ийг асуух:

```bash
mysql -u root -p volleyball_league < database/insert_initial_data.sql
```


