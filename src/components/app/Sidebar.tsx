// src/components/app/Sidebar.tsx — סרגל צד ימני קבוע (פרק 3.2)
import { Link } from "@tanstack/react-router";
import {
  Home,
  Library,
  Users,
  Radio,
  Route as RouteIcon,
  Trophy,
  Shield,
  LogOut,
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { GrowthRing } from "../greenhouse/GrowthRing";
import { copy } from "../../lib/copy";
import { tierName, tierProgress, type Profile } from "../../lib/data/types";

export const NAV_ITEMS = [
  { to: "/", label: copy["nav.dashboard"], icon: Home },
  { to: "/courses", label: copy["nav.library"], icon: Library },
  { to: "/community", label: copy["nav.community"], icon: Users },
  { to: "/events", label: copy["nav.lives"], icon: Radio },
  { to: "/achievements", label: copy["nav.journey"], icon: RouteIcon },
  { to: "/leaderboard", label: copy["nav.leaderboard"], icon: Trophy },
] as const;

export function Sidebar({ profile, onSignOut }: { profile: Profile; onSignOut: () => void }) {
  const { progress, toNext, nextName } = tierProgress(profile.xpTotal);
  const isStaff = profile.role !== "student";

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-s border-line bg-bg-2 md:flex">
      <div className="flex items-center px-5 py-5">
        <Logo variant="full" size={36} animated />
      </div>

      {/* כרטיס משתמש + דרגה */}
      <Link
        to="/account"
        className="mx-3 flex items-center gap-3 rounded-lg border border-line bg-panel px-3 py-3 transition-colors hover:border-[color:var(--accent-border)]"
      >
        <GrowthRing
          size="sm"
          tier={profile.growthStage}
          progress={progress}
          name={profile.fullName}
          src={profile.avatarUrl}
        />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium text-ink">{profile.fullName}</div>
          <div className="truncate text-[12px] text-muted">
            דרגת {tierName(profile.growthStage)}
            {nextName ? ` · עוד ${toNext.toLocaleString("en-US")} XP` : ""}
          </div>
        </div>
      </Link>

      <nav className="mt-5 flex-1 px-3">
        <div className="px-3 pb-2">
          <span className="label-mono">ניווט</span>
        </div>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-line-soft hover:text-ink"
                  activeProps={{
                    className:
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-accent bg-[color:var(--accent-faint)]",
                  }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {isStaff && (
          <>
            <div className="px-3 pb-2 pt-6">
              <span className="label-mono">מערכת</span>
            </div>
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-line-soft hover:text-ink"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-accent bg-[color:var(--accent-faint)]",
              }}
            >
              <Shield className="h-[18px] w-[18px]" />
              <span>מעבר לניהול</span>
            </Link>
          </>
        )}
      </nav>

      <div className="border-t border-line-soft p-3">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted transition-colors hover:text-ink"
        >
          <LogOut className="rtl-flip h-4 w-4" />
          <span>{copy["auth.logout"]}</span>
        </button>
      </div>
    </aside>
  );
}
