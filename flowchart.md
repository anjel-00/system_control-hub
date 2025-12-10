# Future Flow - System Flowcharts

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Student/Faculty User Flow](#studentfaculty-user-flow)
4. [Admin User Flow](#admin-user-flow)
5. [Booking Request Flow](#booking-request-flow)
6. [Notification Flow](#notification-flow)
7. [Database Schema Relationships](#database-schema-relationships)
8. [API Request Flow](#api-request-flow)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│  React + TypeScript + Vite                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Wouter     │  │ TanStack     │  │  RHF + Zod   │      │
│  │   Routing    │  │   Query      │  │  Validation  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │   shadcn/ui + Radix UI + Tailwind CSS            │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js)                          │
├─────────────────────────────────────────────────────────────┤
│  Express.js + TypeScript                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  JWT Auth    │  │  Routes      │  │  Validation  │      │
│  │  Middleware  │  │  Handlers    │  │  (Zod)       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │   Drizzle ORM (storage.ts)                       │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│  Tables: users, facilities, bookings, notifications          │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
START
  │
  ├─→ User visits "/"
  │     │
  │     ├─→ AuthProvider loads localStorage token + user
  │     └─→ If no user → show Welcome (public)
  │
  ├─→ Login (/login)
  │     │
  │     ├─→ User enters email + password
  │     ├─→ POST /api/auth/login
  │     │     ├─→ Validate credentials (bcrypt)
  │     │     ├─→ Issue JWT (7d) + return user
  │     │     └─→ Client stores token + user in localStorage
  │     └─→ Redirect by role:
  │           - admin → /admin
  │           - faculty → /faculty-dashboard
  │           - student → /dashboard
  │
  ├─→ Register (/register)
  │     │
  │     ├─→ User enters profile + role (student/faculty)
  │     ├─→ POST /api/auth/register
  │     │     ├─→ Hash password, create user
  │     │     └─→ Return JWT + user → store in localStorage
  │     └─→ Redirect by role
  │
  ├─→ Protected route access (UserLayout)
  │     │
  │     ├─→ Check auth context
  │     ├─→ If no user → Redirect to "/"
  │     ├─→ If requireAdmin and not admin → /dashboard
  │     └─→ If requireFaculty and not faculty → /dashboard or /admin
  │
  └─→ Logout
        │
        ├─→ Clear localStorage (token, user)
        └─→ Redirect to "/"
```

---

## Student/Faculty User Flow

```
WELCOME (/) → CTA to login/register
  │
  ├─→ Dashboard (/dashboard or /faculty-dashboard)
  │     │
  │     ├─→ View stats (available facilities, pending, approved)
  │     ├─→ See recent bookings
  │     └─→ If any booking.status === rejected and not dismissed → show rejection modal
  │
  ├─→ Facilities (/facilities)
  │     │
  │     ├─→ Browse/filter facilities
  │     └─→ View capacity/status per facility
  │
  ├─→ Request Event (/request or /request-event)
  │     │
  │     ├─→ Fill form (facility, date, time, purpose, attendees)
  │     ├─→ Capacity guard modal if attendees exceed facility capacity
  │     ├─→ POST /api/bookings
  │     │     ├─→ Creates booking (pending)
  │     │     └─→ Creates notifications:
  │     │           - requester: "submitted"
  │     │           - all admins: "new booking request"
  │     └─→ Success modal and invalidates queries
  │
  └─→ My Bookings (/my-bookings)
        │
        ├─→ List user bookings with status badges
        ├─→ Pending bookings: can delete
        └─→ Delete confirmation dialog before removing
```

---

## Admin User Flow

```
ADMIN DASHBOARD (/admin)
  │
  ├─→ Metrics (pending/approved/rejected counts, facilities/users)
  ├─→ Recent requests list
  └─→ Unread notifications toast + badge when new requests arrive

BOOKING REVIEW (/admin/bookings)
  │
  ├─→ Filter/search bookings
  ├─→ Approve → PATCH /api/admin/bookings/:id/approve
  │     └─→ Notify requester "approved"
  └─→ Reject → PATCH /api/admin/bookings/:id/reject (notes optional)
        └─→ Notify requester "rejected" with notes

FACILITIES (/admin/facilities)
  │
  ├─→ Create/update/delete facilities (capacity, status, location)
  └─→ Changes affect request capacity checks

USERS (/admin/users)
  │
  ├─→ View/search/filter users by role
  ├─→ Change role (student/faculty/admin)
  └─→ Delete user (confirmation) with FK-safe cleanup on server

REPORTS (/admin/reports)
  └─→ Charts for booking status distribution and facility stats
```

---

## Booking Request Flow

```
START: Student/Faculty submits booking form
  │
  ├─→ Validate client form (Zod + RHF)
  ├─→ Capacity check against selected facility
  │     ├─→ If over capacity → show modal, block submit
  │     └─→ Else proceed
  ├─→ POST /api/bookings with token
  │     ├─→ Server validates body (insertBookingSchema)
  │     ├─→ Inserts booking (status=pending)
  │     ├─→ Create notification for requester (info)
  │     └─→ Create notifications for all admins (warning)
  ├─→ Client success modal
  └─→ Invalidate queries: /api/bookings/my, /api/notifications, /api/admin/bookings (if admin view)
```

---

## Notification Flow

```
EVENTS
  ├─ Booking submitted → notify requester + all admins
  ├─ Booking approved → notify requester (success)
  ├─ Booking rejected → notify requester (error, includes notes)

DELIVERY
  ├─ Stored in notifications table (status=unread)
  ├─ Fetched via GET /api/notifications (per user)
  ├─ Mark single read: PATCH /api/notifications/:id/read
  └─ Mark all read: PATCH /api/notifications/read-all

UI
  ├─ Admin dashboard: toast + badge on unread
  ├─ Requesters: see unread list; rejection modal on dashboards for fresh rejects
  └─ Notifications page groups by date with type-specific icons
```

---

## Database Schema Relationships

```
users
  ├─ id (PK)
  ├─ role (student|faculty|admin)
  └─ has many bookings, notifications

facilities
  ├─ id (PK)
  └─ has many bookings

bookings
  ├─ id (PK)
  ├─ userId (FK → users.id)
  ├─ facilityId (FK → facilities.id)
  ├─ reviewedBy (FK → users.id, nullable)
  └─ has many notifications (via relatedBookingId)

notifications
  ├─ id (PK)
  ├─ userId (FK → users.id)
  └─ relatedBookingId (FK → bookings.id, nullable)
```

```
┌──────────────┐          ┌──────────────┐
│    users     │1        N│   bookings   │
│──────────────│◄─────────┤──────────────│
│ id (PK)      │          │ id (PK)      │
│ role         │          │ userId (FK)  │
└─────┬────────┘          │ facilityId(FK)
      │                   │ reviewedBy(FK)
      │1                  └─────┬────────┘
      │                         │N
      │                         │
      │                   ┌─────▼────────┐
      │                   │ facilities   │
      │                   │──────────────│
      │                   │ id (PK)      │
      │                   └──────────────┘
      │
      │1
      │
┌─────▼────────┐
│notifications │
│──────────────│
│ id (PK)      │
│ userId (FK)  │
│ relatedBookingId (FK) │
└──────────────┘
```

---

## API Request Flow

```
CLIENT REQUEST
  │
  ├─→ useQuery/useMutation → fetch /api/* with Authorization: Bearer <token>
  │
  ▼
MIDDLEWARE
  │
  ├─→ express.json()
  ├─→ authenticateToken (JWT) for protected routes
  └─→ requireAdmin / role checks where needed
  │
  ▼
ROUTE HANDLER (routes.ts)
  ├─→ Parse params/body
  ├─→ Validate with Zod schemas (shared/schema)
  ├─→ Call storage layer
  │
  ▼
STORAGE (storage.ts, Drizzle)
  ├─→ Build and execute SQL
  └─→ Return typed data
  │
  ▼
RESPONSE
  ├─→ JSON payload + status
  └─→ Client caches via TanStack Query
  │
  ▼
CLIENT UI
  ├─→ Cache update triggers render
  └─→ Toasts/modals when applicable (e.g., capacity/reject/success)
```
