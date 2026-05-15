# Admin Setup Guide

## 🎯 **How the System Works:**

### **For Students (Anyone can signup):**
1. Go to `/signup`
2. Create account with email/password
3. Automatically becomes `student` role
4. Can login at `/login` → redirected to `/student/dashboard`

### **For Admins (Manual creation only):**
1. **No admin signup option** (security feature)
2. Admin must be created manually in database
3. Uses same `/login` page
4. Automatically redirected to `/admin/dashboard`

## 🔧 **How to Create an Admin:**

### **Method 1: Convert existing user**
1. User signs up normally as student
2. Go to Supabase → SQL Editor
3. Run this SQL:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### **Method 2: Check all users**
```sql
-- See all users and their roles
SELECT id, email, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

## 🚀 **Testing the System:**

### **Test as Student:**
1. Go to `/signup`
2. Create account: `student@test.com`
3. Login → should go to `/student/dashboard`

### **Test as Admin:**
1. Convert student to admin using SQL above
2. Login with same credentials
3. Should now go to `/admin/dashboard`

## 🔒 **Security Features:**

✅ **No admin signup** - Prevents unauthorized admin creation
✅ **Single login page** - Clean user experience  
✅ **Role-based redirects** - Automatic routing based on permissions
✅ **Database-only admin creation** - Full control over admin access

## 📋 **Quick Setup Checklist:**

- [ ] Run `database-setup.sql` in Supabase
- [ ] Test student signup/login
- [ ] Create your admin account
- [ ] Test admin login
- [ ] Create test course as admin
- [ ] Test student enrollment

**This is the standard secure approach for admin systems!**