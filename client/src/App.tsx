import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { UserLayout } from "@/components/user-layout";
import { Building2, Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import UserDashboard from "@/pages/user-dashboard";
import FacultyDashboard from "@/pages/faculty-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Welcome from "@/pages/welcome";
import Facilities from "@/pages/facilities";
import EventRequest from "@/pages/event-request";
import MyBookings from "@/pages/my-bookings";
import AdminBookings from "@/pages/admin-bookings";
import AdminFacilities from "@/pages/admin-facilities";
import AdminUsers from "@/pages/admin-users";
import AdminReports from "@/pages/admin-reports";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary  30">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <div> 
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Facility Hub</p>
          <h1 className="text-2xl font-semibold text-foreground">Loading your experience…</h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Preparing your dashboard</span>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Router />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/dashboard">
        <UserLayout>
          <UserDashboard />
        </UserLayout>
      </Route>
      
      <Route path="/faculty-dashboard">
        <UserLayout requireFaculty>
          <FacultyDashboard />
        </UserLayout>
      </Route>
      
      <Route path="/facilities">
        <UserLayout>
          <Facilities />
        </UserLayout>
      </Route>
      
      <Route path="/request-event">
        <UserLayout>
          <EventRequest />
        </UserLayout>
      </Route>
      
      <Route path="/request">
        <UserLayout>
          <EventRequest />
        </UserLayout>
      </Route>
      
      <Route path="/my-bookings">
        <UserLayout>
          <MyBookings />
        </UserLayout>
      </Route>
      
      <Route path="/profile">
        <UserLayout>
          <Profile />
        </UserLayout>
      </Route>
      
      <Route path="/notifications">
        <UserLayout>
          <Notifications />
        </UserLayout>
      </Route>
      
      <Route path="/admin">
        <UserLayout requireAdmin>
          <AdminDashboard />
        </UserLayout>
      </Route>
      
      <Route path="/admin/bookings">
        <UserLayout requireAdmin>
          <AdminBookings />
        </UserLayout>
      </Route>
      
      <Route path="/admin/facilities">
        <UserLayout requireAdmin>
          <AdminFacilities />
        </UserLayout>
      </Route>
      
      <Route path="/admin/users">
        <UserLayout requireAdmin>
          <AdminUsers />
        </UserLayout>
      </Route>
      
      <Route path="/admin/reports">
        <UserLayout requireAdmin>
          <AdminReports />
        </UserLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppShell />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
