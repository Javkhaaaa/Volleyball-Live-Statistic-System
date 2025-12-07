-- =====================================================
-- Insert Initial Data (Roles and Admin User)
-- =====================================================

-- Insert Default Roles (if not exists)
INSERT INTO roles (name, description) 
SELECT 'ADMIN', 'System Administrator - Full access to manage users and system settings'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ADMIN');

INSERT INTO roles (name, description) 
SELECT 'COACH', 'Coach - Can manage team statistics and view game data'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'COACH');

INSERT INTO roles (name, description) 
SELECT 'STATISTICIAN', 'Statistician - Can record and manage game statistics'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'STATISTICIAN');

-- Insert Super Admin User (if not exists)
-- Password: Admin@123
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_locked, failed_login_attempts, created_by)
SELECT 'admin@volleyball.league', 
       '$2a$10$N9y.DBMErGifj9sevmFp7ui9G01/NrHK4mFfmZqQjM7xaSQNktNtq', 
       'Super', 
       'Admin',
       'ADMIN',
       TRUE, 
       FALSE,
       0,
       NULL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@volleyball.league');

-- Verify the data
SELECT 'Admin User:' as info;
SELECT id, email, first_name, last_name, role, is_active, is_locked FROM users WHERE email = 'admin@volleyball.league';

