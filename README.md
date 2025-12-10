# System Control Hub

Facility & event management platform with role-based dashboards for students, faculty, and administrators.

## Feature Coverage (current)
- ✅ Registration & login (student/faculty/admin); JWT-based auth stored client-side.
- ✅ Role-based routing and themed UI; welcome screen at `/`.
- ✅ Dashboard per role (student/faculty/admin) with stats and recent requests.
- ✅ Facilities browse with status and capacity; booking request form with capacity guard and success modal.
- ✅ Admin approvals: approve/reject bookings with notes; admin toasts/badges for new requests.
- ✅ Notifications: requester and admin notifications on submit/approve/reject; mark read/mark all.
- ✅ Delete confirmations (my bookings, admin users); rejection modal surfaced on requester dashboards.
- ✅ Basic reports charts (admin) for booking/facility stats.

### Not Yet Implemented
- Password reset via email.
- File/document uploads for requests.
- Real-time calendar view and time-block visualization.
- Email delivery for notifications; current system notifications only.
- CSV/PDF export for reports.

## Screen Map
- Welcome: public landing, single CTA to continue/login.
- Login/Register: auth forms with role selection (register).
- Student/Faculty: dashboard, facilities, request event, my bookings, notifications, profile.
- Admin: dashboard, booking requests, facilities, users, reports, notifications, profile.
- Not Found: fallback 404.

## Tech Stack
- Frontend: React 18, TypeScript, Wouter, TanStack Query, shadcn/ui + TailwindCSS.
- Backend: Express + TypeScript, Drizzle ORM (PostgreSQL).
- Auth: JWT stored in localStorage; client context.
- Tooling: Vite, tsx, Recharts (admin reports), Zod + React Hook Form.

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
No automated tests are defined. Run `npm run check` for type safety; manually verify: auth, booking submit with capacity guard, admin approve/reject, notifications flow, rejection modal, and role redirects.
