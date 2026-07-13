// src/components/app/AppShell.tsx — שלד האפליקציה (פרק 3.2)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { CommandPalette } from "./CommandPalette";
import { useIsMobile } from "../../hooks/use-mobile";
import { data, type Profile } from "../../lib/data";

export function AppShell({ profile, children }: { profile: Profile; children: ReactNode }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: unread = 0 } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => data.notifications.unreadCount(),
    staleTime: 30_000,
  });

  const signOut = useMutation({
    mutationFn: () => data.auth.signOut(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      router.navigate({ to: "/login" });
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile} onSignOut={() => signOut.mutate()} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          profile={profile}
          unreadCount={unread}
          onOpenSearch={() => (isMobile ? router.navigate({ to: "/search" }) : setSearchOpen(true))}
        />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 lg:px-10">{children}</main>
      </div>
      <BottomNav />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
