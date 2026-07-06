// src/routes/admin.tsx — layout route של מערך הניהול (פרק 3.4) + guard תפקיד
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { AdminShell } from "../components/admin/AdminShell";
import { AmbientBackground } from "../components/greenhouse/AmbientBackground";
import { Logo } from "../components/brand/Logo";
import { useSession } from "../hooks/useSession";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { profile, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!profile) {
      router.navigate({ to: "/login" });
      return;
    }
    if (profile.role === "student") {
      toast.error("אין לך הרשאה למערך הניהול");
      router.navigate({ to: "/" });
    }
  }, [isLoading, profile, router]);

  if (isLoading || !profile || profile.role === "student") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Logo variant="mark" size={48} animated />
      </div>
    );
  }

  return (
    <>
      <AmbientBackground />
      <AdminShell>
        <Outlet />
      </AdminShell>
    </>
  );
}
