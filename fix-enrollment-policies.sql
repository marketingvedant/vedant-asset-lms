-- Fix RLS policies to allow users to enroll themselves and create payments

-- Allow users to insert their own enrollments
CREATE POLICY "Users can enroll themselves" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own payments
CREATE POLICY "Users can create their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own profiles (for signup)
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);