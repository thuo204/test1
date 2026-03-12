# LearnHub — Production Learning Platform

A full-stack learning management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- **Auth** — JWT-based login/register with secure httpOnly cookies
- **Courses** — Browse, enroll, and track progress through lessons
- **Blog** — Full blog with author profiles and view tracking
- **Admin Dashboard** — Manage courses, users, blog posts, and ads
- **Analytics** — Page view tracking and top-path reporting
- **Advertising** — Configurable ad slots with impression/click tracking
- **SEO** — Dynamic metadata, sitemap, robots.txt

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Animation**: Framer Motion
- **State**: Zustand
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (jose) + bcryptjs

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Push schema and seed
npx prisma db push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Admin credentials** (after seed): `admin@learnhub.dev` / `admin123`

## Docker

```bash
docker-compose up -d
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`)
4. Deploy — Vercel runs `prisma generate && next build` automatically

## Deploy to Railway

1. Create a PostgreSQL service in Railway
2. Copy `DATABASE_URL` from Railway
3. Add repo, set env vars, deploy

## Project Structure

```
src/
  app/
    (main)/          # Public pages with Navbar + Footer
    admin/           # Admin dashboard (ADMIN role only)
    api/             # REST API routes
    auth/            # Login / Register pages
    learn/           # Lesson viewer
  components/
    admin/           # Admin UI components
    ads/             # Ad banner
    analytics/       # Charts
    auth/            # Auth forms
    blog/            # Blog cards
    courses/         # Course cards, lesson list, viewer
    layout/          # Navbar, Footer, Hero
    ui/              # Radix-based design system
  lib/               # db, auth, utils, validations
  store/             # Zustand stores
  styles/            # globals.css
```

