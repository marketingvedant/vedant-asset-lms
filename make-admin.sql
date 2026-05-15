-- Make your current user an admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'mukherjeeabhishek207@gmail.com';

-- Verify the change
SELECT id, email, role FROM profiles WHERE email = 'mukherjeeabhishek207@gmail.com';