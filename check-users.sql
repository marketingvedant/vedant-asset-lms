-- Check existing profiles
SELECT * FROM profiles;

-- Check if we have any users at all
SELECT count(*) as profile_count FROM profiles;

-- Create an admin user profile (replace with actual user ID from auth.users)
-- First, you need to sign up a user, then run this to make them admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Or insert a profile manually if you know the user ID:
-- INSERT INTO profiles (id, email, role, full_name, created_at, updated_at)
-- VALUES ('your-user-id-here', 'admin@example.com', 'admin', 'Admin User', now(), now())
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';