-- =====================================================
-- Migration: Many-to-Many to Single Role Column
-- =====================================================
-- This script migrates from user_roles junction table to role column in users table

-- Step 1: Add role column to users table
ALTER TABLE users 
ADD COLUMN role VARCHAR(50) NULL AFTER phone;

-- Step 2: Migrate existing roles from user_roles to users.role
UPDATE users u
INNER JOIN user_roles ur ON u.id = ur.user_id
INNER JOIN roles r ON ur.role_id = r.id
SET u.role = r.name
WHERE u.role IS NULL;

-- Step 3: Set default role for users without role (if any)
UPDATE users 
SET role = 'COACH' 
WHERE role IS NULL;

-- Step 4: Make role column NOT NULL
ALTER TABLE users 
MODIFY COLUMN role VARCHAR(50) NOT NULL;

-- Step 5: Add constraint to ensure valid roles
ALTER TABLE users 
ADD CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'COACH', 'STATISTICIAN'));

-- Step 6: Add index on role column
ALTER TABLE users 
ADD INDEX idx_role (role);

-- Step 7: Drop user_roles junction table
DROP TABLE IF EXISTS user_roles;

-- Step 8: Verify migration
SELECT id, email, first_name, last_name, role, is_active 
FROM users 
ORDER BY id;

