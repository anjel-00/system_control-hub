# Flowchart

```mermaid
flowchart TD
  Landing[/Visit "/"/]
  Login[/Visit "/login"/]
  Register[/Visit "/register"/]

  Landing -->|CTA| Login
  Landing -->|CTA| Register
  Login -->|JWT| AppShell
  Register -->|JWT| AppShell

  AppShell[AppShell (Auth load + Router)]
  AppShell -->|Role=student| StudentDash[/"/dashboard"/]
  AppShell -->|Role=faculty| FacultyDash[/"/faculty-dashboard"/]
  AppShell -->|Role=admin| AdminDash[/"/admin"/]
  AppShell -->|Unauthed| Landing

  subgraph Student/Faculty
    StudentDash --> MyBookings[/"/my-bookings"/]
    StudentDash --> Facilities[/"/facilities"/]
    StudentDash --> Request[/"/request"/]
    FacultyDash --> MyBookings
    FacultyDash --> Facilities
    FacultyDash --> Request
  end

  Request -->|POST /api/bookings| AdminQueue[Admin review]
  AdminQueue -->|Approve| NotifyApproved[Notify requester]
  AdminQueue -->|Reject| NotifyRejected[Notify requester]

  subgraph Admin
    AdminDash --> AdminBookings[/"/admin/bookings"/]
    AdminDash --> AdminFacilities[/"/admin/facilities"/]
    AdminDash --> AdminUsers[/"/admin/users"/]
    AdminDash --> AdminReports[/"/admin/reports"/]
    AdminBookings --> AdminQueue
  end

  NotifyApproved --> MyBookings
  NotifyRejected --> MyBookings
```
