-- Fix admin password hash if needed
-- First, generate a new hash using PasswordHashGenerator.java
-- Then update this file with the new hash and run it

-- Example (replace with actual hash from PasswordHashGenerator):
-- UPDATE users 
-- SET password_hash = '$2a$10$YOUR_NEW_HASH_HERE'
-- WHERE email = 'admin@volleyball.league';

-- Reset login attempts if account is locked
UPDATE users 
SET is_locked = FALSE,
    locked_until = NULL,
    failed_login_attempts = 0
WHERE email = 'admin@volleyball.league';


