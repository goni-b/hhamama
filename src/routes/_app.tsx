// src/routes/_app.tsx — layout route שעוטף את כל עמודי האפליקציה (פרק 3.2)
// Guard (פרק 3.1): אין סשן ← /login · חייב איפוס סיסמה ← /auth/reset-password · לא סיים onboarding ← /welcome
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "../components/app/AppShell";
import { AmbientBackground } from "../components/greenhouse/AmbientBackground";
import { Logo } from "../components/brand/Logo";
import { copy } from "../lib/copy";
import { useSession } from "../hooks/useSession";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Logo variant="mark" size={56} animated />
      <span className="label-mono">{copy["state.loading"]}</span>
    </div>
  );
}

function AppLayout() {
  const { profile, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!profile) {
      router.navigate({ to: "/login" });
      return;
    }
    if (profile.mustResetPassword) {
      router.navigate({ to: "/auth/reset-password" });
      return;
    }
    if (!profile.onboardingCompleted) {
      router.navigate({ to: "/welcome" });
    }
  }, [isLoading, profile, router]);

  if (isLoading || !profile) return <FullScreenLoader />;
  if (profile.mustResetPassword || !profile.onboardingCompleted) return <FullScreenLoader />;

  return (
    <>
      <AmbientBackground />
      <AppShell profile={profile}>
        <Outlet />
      </AppShell>
    </>
  );
}
