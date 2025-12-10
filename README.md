# System Control Hub

Facility & event management platform with role-based dashboards for students, faculty, and administrators.

## Features
- Role-based access: student, faculty, admin dashboards and navigation.
- Facility browsing and event booking requests with capacity guard.
- Admin review: approve/reject requests, manage facilities, users, and reports.
- Notifications and toasts for request status changes; requester/admin alerts.
- Theming by role (colors) and welcome landing page at `/`.

## Tech Stack
- Frontend: React 18, TypeScript, Wouter, TanStack Query, shadcn/ui + TailwindCSS.
- Backend: Express + TypeScript, Drizzle ORM (PostgreSQL).
- Auth: JWT stored in localStorage; context-driven client auth.
- Tooling: Vite, tsx, Recharts (admin reports), Zod + RHF forms.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database URL (see `.env` template below)

## Environment
Create `.env` in the project root:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SESSION_SECRET=change-me
PORT=5000
```

## Setup & Run
```
npm install
npm run dev
```
- Dev server listens on `PORT` (default 5000) via Express; Vite serves client from the same entry.
- Visit `http://localhost:5000/` for the welcome page; `/login` for auth.

## Useful Scripts
- `npm run dev` – start API + client in dev.
- `npm run build` – bundle for production.
- `npm start` – run built server (`dist/index.cjs`).
- `npm run check` – type-check.
- `npm run seed:admin` – seed an admin user.
- `npm run seed` – seed sample data.
- `npm run db:push` – apply Drizzle schema to DB.

## Project Structure (high level)
```
client/        # React app (src/pages, components, hooks, lib)
server/        # Express server, routes, storage, db bootstrap
shared/        # Shared Drizzle schema & types
script/        # Build and seed scripts
```

## Testing Notes
No automated tests are defined. Run `npm run check` for type safety; exercise key flows manually: auth, booking request, admin approve/reject, notifications, and role redirects.
