# Course Purchase Error Fix

## Issue
The course purchase functionality was failing with an empty error object `{}` being logged to the console.

## Root Causes
1. **Poor error handling**: The error object wasn't being properly logged or handled
2. **Missing RLS policies**: Users couldn't insert into `enrollments` and `payments` tables
3. **Missing profile handling**: Users might not have profiles created
4. **Dependency issues**: Enrollment check wasn't running when both user and course were available

## Fixes Applied

### 1. Enhanced Error Handling
- Added proper error logging with detailed messages
- Added specific error handling for duplicate enrollments
- Added profile creation if missing
- Improved error messages for users

### 2. Database Policies (run fix-enrollment-policies.sql)
```sql
-- Allow users to enroll themselves
CREATE POLICY "Users can enroll themselves" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to create their own payments
CREATE POLICY "Users can create their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to create their own profiles
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Profile Management
- Added automatic profile creation if missing during purchase
- Proper error handling for profile operations

### 4. Improved State Management
- Fixed useEffect dependencies
- Separated user check from enrollment check
- Better error handling in enrollment verification

## To Apply the Fix

1. **Run the database policy updates**:
   ```bash
   # Apply the new RLS policies to your Supabase database
   psql -f fix-enrollment-policies.sql
   ```

2. **The course page has been updated** with:
   - Better error handling
   - Profile creation logic
   - Improved state management
   - Clearer error messages

## Testing
1. Try purchasing a course while logged in
2. Check that proper error messages appear if something fails
3. Verify that enrollment works correctly
4. Test with users who don't have profiles yet

## Expected Behavior
- Users can now successfully purchase courses
- Clear error messages if something goes wrong
- Automatic profile creation for new users
- Proper enrollment tracking