-- Check if admin user exists and verify password hash
SELECT 
    id,
    email,
    password_hash,
    first_name,
    last_name,
    is_active,
    is_locked,
    failed_login_attempts
FROM users 
WHERE email = 'admin@volleyball.league';

-- Check user roles
SELECT 
    u.email,
    r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@volleyball.league';


