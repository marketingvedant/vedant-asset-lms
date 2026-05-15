# Minimal LMS Architecture (MVP Version)

## Project Goal

Build a very simple LMS platform with:

### Admin Side

* Login
* Create courses
* Add lessons
* Upload videos
* Add simple quizzes
* Publish courses

### Student Side

* Signup/Login
* Browse courses
* Purchase courses
* Watch lessons
* Attempt quizzes

This is NOT an enterprise LMS.

Focus only on:

* Speed
* Simplicity
* Working product
* Clean UI
* Fast development

Do not overengineer anything.

---

# Tech Stack

## Frontend

* Next.js 15 App Router
* Tailwind CSS
* Shadcn UI

## Backend

* Supabase

## Auth

* Supabase Auth

## Database

* PostgreSQL (Supabase)

## Storage

* Supabase Storage

## Payments

* Razorpay or Stripe

## Deployment

* Vercel

---

# Core Features Only

## Admin

* Admin login
* Create/edit/delete courses
* Upload lessons
* Upload video links
* Add quizzes
* Publish/unpublish courses

## Student

* Signup/login
* Buy course
* Access purchased courses
* Watch lessons
* Complete quizzes

---

# Folder Structure

```txt id="m1"
/app
    /(website)
        page.tsx
        courses/
        course/[slug]/

    /(auth)
        login/
        signup/

    /(student)
        dashboard/
        my-courses/
        lesson/[id]/

    /(admin)
        admin/
            dashboard/
            courses/
            quizzes/

    /api
        webhook/

/components
/lib
/types
```

Keep the project small and clean.

Do not create unnecessary folders.

---

# Database Tables

## profiles

```sql id="m2"
id uuid primary key
email text
role text
created_at timestamp
```

Role:

* admin
* student

---

## courses

```sql id="m3"
id uuid primary key
title text
slug text
description text
thumbnail text
price numeric
published boolean
created_at timestamp
```

---

## lessons

```sql id="m4"
id uuid primary key
course_id uuid
title text
video_url text
content text
position integer
```

---

## quizzes

```sql id="m5"
id uuid primary key
course_id uuid
question text
option_a text
option_b text
option_c text
option_d text
correct_answer text
```

Keep quiz system simple.

No advanced quiz engine needed.

---

## enrollments

```sql id="m6"
id uuid primary key
user_id uuid
course_id uuid
created_at timestamp
```

---

## payments

```sql id="m7"
id uuid primary key
user_id uuid
course_id uuid
amount numeric
status text
provider text
created_at timestamp
```

---

# Authentication Flow

Use Supabase Auth.

## Signup

* Email
* Password

## Login

* Email
* Password

No OAuth needed for MVP.

---

# Admin Access

Simple role-based auth.

If:

```txt id="m8"
role === "admin"
```

Allow access to:

```txt id="m9"
/admin/*
```

Otherwise redirect.

---

# Course Flow

## Admin

```txt id="m10"
Create Course
    ↓
Add Lessons
    ↓
Add Quiz
    ↓
Publish
```

---

# Student Flow

```txt id="m11"
Signup/Login
    ↓
Browse Courses
    ↓
Purchase Course
    ↓
Enrollment Created
    ↓
Watch Lessons
```

---

# Payment Flow

Use:

* Razorpay (recommended for India)

Flow:

```txt id="m12"
User clicks Buy
    ↓
Payment Gateway
    ↓
Success
    ↓
Create Enrollment
```

No subscriptions.

Only one-time purchase.

---

# Video Handling

For MVP:

* Store video URL only

Options:

* YouTube Unlisted
* Vimeo
* Cloudinary

Avoid building custom streaming.

---

# UI Pages

## Public

* Home
* Courses
* Course Details
* Login
* Signup

## Student

* Dashboard
* My Courses
* Lesson Page

## Admin

* Dashboard
* Create Course
* Edit Course
* Manage Lessons

---

# Important Rules

## DO NOT BUILD

* Community
* Certificates
* AI features
* Chat system
* Notes system
* Realtime
* Mobile app
* Advanced analytics
* Multi instructors
* Complex RBAC
* Course completion engine

Keep everything simple.

---

# Minimal RLS Policies

## Public can view published courses

```sql id="m13"
published = true
```

---

## Students can see own enrollments

```sql id="m14"
auth.uid() = user_id
```

---

## Admin full access

```sql id="m15"
role = 'admin'
```

---

# Recommended Packages

```bash id="m16"
npm install @supabase/supabase-js
npm install @supabase/ssr
npm install razorpay
npm install react-hook-form
npm install zod
npm install lucide-react
```

---

# Environment Variables

```env id="m17"
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

# Deployment

## Frontend

Deploy on:

* Vercel

## Backend

Use:

* Supabase

No separate backend server needed.

---

# UI Style

Build modern clean UI similar to:

* Graphy
* Kajabi
* Skool

Use:

* Dark/light mode
* Clean cards
* Simple dashboard
* Responsive layout

Do not overdesign.

---

# Final Instructions for Claude

Build this LMS as a SIMPLE MVP.

Priority:

1. Working auth
2. Course management
3. Payments
4. Lesson access

Ignore unnecessary enterprise features.

Requirements:

* Use Next.js App Router
* Use Supabase
* Use Tailwind + Shadcn
* Use TypeScript
* Use server actions where useful
* Use clean reusable components
* Make responsive UI
* Generate all SQL tables
* Generate middleware
* Generate auth flow
* Generate payment integration
* Generate admin dashboard
* Generate student dashboard
* Generate deployment steps

Keep codebase small, simple, and maintainable.

Do not overengineer anything.
