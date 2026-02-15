# Bookmark Manager (Next.js + Supabase)

A simple full-stack bookmark manager that allows users to securely save and manage personal bookmarks using Google authentication. The application supports real-time updates across multiple tabs and ensures user-specific data privacy.

## 🚀 Live Demo

Live URL: [https://YOUR-VERCEL-URL.vercel.app](https://YOUR-VERCEL-URL.vercel.app)

## 📦 GitHub Repository

[https://github.com/YOUR_USERNAME/YOUR_REPO](https://github.com/YOUR_USERNAME/YOUR_REPO)

---

# ✨ Features

* Google OAuth authentication (no email/password login)
* Add bookmarks (title + URL)
* Delete bookmarks
* User-specific private bookmarks
* Real-time updates across browser tabs
* Secure database access using Row Level Security (RLS)
* Clean and responsive UI using Tailwind CSS
* Fully deployed on Vercel

---

# 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend / Infrastructure

* Supabase Authentication (Google OAuth)
* Supabase PostgreSQL Database
* Supabase Realtime
* Row Level Security (RLS)

### Deployment

* Vercel

---

# 🧠 Architecture Overview

```
Next.js Client → Supabase Auth → Google OAuth
             ↓
      Supabase Database (PostgreSQL)
             ↓
      Supabase Realtime → UI updates
```

### Authentication Flow

1. User logs in with Google.
2. Supabase handles OAuth and session management.
3. Session stored securely in browser.
4. Dashboard accessible only to authenticated users.

### Data Security

* Each bookmark contains a `user_id`.
* Row Level Security ensures users can only access their own data.
* Database policies enforce authorization at the database level.

### Realtime Updates

* Supabase Realtime listens to database changes.
* UI updates automatically when data changes.

---

# 🔐 Database Schema

## Bookmarks Table

* id (uuid, primary key)
* user_id (references auth.users)
* title (text)
* url (text)
* created_at (timestamp)

---

# 🛠️ Local Setup Instructions

## 1. Clone repository

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO
cd YOUR_REPO
```

## 2. Install dependencies

```
npm install
```

## 3. Create environment file

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Run development server

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

# ⚙️ Supabase Configuration

## Required Setup

* Create Supabase project
* Enable Google OAuth provider
* Create bookmarks table
* Enable Row Level Security
* Add security policies for select, insert, and delete
* Enable realtime replication for bookmarks table

---

# 🚧 Challenges Faced & Solutions

## 1. Row Level Security blocking inserts

**Problem:** Database rejected insert operations.
**Solution:** Added proper RLS policies with `auth.uid() = user_id`.

## 2. Google OAuth redirect mismatch

**Problem:** Login failed due to incorrect callback URLs.
**Solution:** Configured redirect URLs in Supabase and Google Cloud Console.

## 3. Realtime updates not triggering

**Problem:** Changes were not reflected across tabs.
**Solution:** Enabled replication for bookmarks table in Supabase.

## 4. TypeScript build error during deployment

**Problem:** `useEffect` cleanup returned a Promise causing Vercel build failure.
**Solution:** Wrapped cleanup function to return void.

## 5. Tailwind styles not loading initially

**Problem:** UI appeared unstyled.
**Solution:** Ensured Tailwind directives were included and imported correctly.

---

# 📈 Future Improvements

* Edit bookmark functionality
* URL validation
* Favicon preview for bookmarks
* Dark mode support
* Better error handling and notifications
* Middleware-based route protection
* Server-side session handling

---

# 🎯 Design Decisions

* Used Supabase for full backend to simplify infrastructure.
* Used App Router for modern Next.js architecture.
* Implemented database-level security using RLS.
* Chose Tailwind CSS for fast and consistent UI development.
* Implemented realtime updates for better UX.

---

# 📄 License

This project is for assessment/demo purposes.

---
