-- How to create an admin user:

-- Step 1: First, the person needs to signup normally as a student
-- Step 2: Then run this SQL to make them admin:

-- Replace 'admin@example.com' with the actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- OR if you know the user ID:
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = 'user-uuid-here';

-- To check all users and their roles:
SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;