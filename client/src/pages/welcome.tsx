import { Link } from "wouter";
import { Building2, CalendarRange, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

function useDashboardPath() {
  const { user } = useAuth();

  if (!user) return "/login";
  if (user.role === "admin") return "/admin";
  if (user.role === "faculty") return "/faculty-dashboard";
  return "/dashboard";
}

export default function Welcome() {
  const { user } = useAuth();
  const dashboardPath = useDashboardPath();
  const isAuthed = Boolean(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 text-foreground text-base md:text-[17px]">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_center,white,transparent_65%)]" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-10 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">System Control Hub</p>
            <p className="text-xl font-semibold">Facilities & Events</p>
          </div>
        </div>
        <div />
      </header>

      <main className="relative mx-auto flex max-w-7xl flex-col gap-14 px-8 pb-20 md:flex-row md:items-center md:gap-20 md:px-10">
        <div className="flex-1 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Welcome — start here</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              Orchestrate campus facilities with clarity.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Request spaces, track approvals, and keep every event aligned. Begin from the welcome screen, then log in when
              you&apos;re ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={dashboardPath}>
              <Button size="lg" className="shadow-lg shadow-primary/30 px-6 py-6 text-base md:text-lg">
                {isAuthed ? "Continue to your dashboard" : "Start with the welcome"}
              </Button>
            </Link>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            You&apos;ll always land on this welcome page first. Sign in when you need to manage requests.
          </p>
        </div>

        <div className="flex-1 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="border-primary/20 bg-background/60 backdrop-blur">
              <CardContent className="space-y-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarRange className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg md:text-xl font-semibold">Plan with confidence</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Submit event requests, respect capacity rules, and keep timelines visible for every stakeholder.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-background/60 backdrop-blur">
              <CardContent className="space-y-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg md:text-xl font-semibold">Roles that stay aligned</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Students, faculty, and admins get tailored dashboards—everyone starts from the same welcome screen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="border-dashed border-primary/30 bg-primary/5 backdrop-blur">
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base md:text-lg font-semibold">Ready when you are</p>
                <p className="text-sm md:text-base text-muted-foreground">
                  Visit /login any time, but you&apos;ll always touch down at the welcome page first.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
