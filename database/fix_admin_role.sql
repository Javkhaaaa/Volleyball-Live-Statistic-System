-- Fix admin user role if it's NULL
UPDATE users 
SET role = 'ADMIN'
WHERE email = 'admin@volleyball.league' AND (role IS NULL OR role = '');

-- Verify
SELECT id, email, role, is_active FROM users WHERE email = 'admin@volleyball.league';

