// src/components/app/TopBar.tsx — סרגל עליון דביק (פרק 3.2)
import { Link } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";
import { StreakBadge } from "../greenhouse/StreakBadge";
import { Logo } from "../brand/Logo";
import type { Profile } from "../../lib/data/types";

function streakState(days: number): "active" | "atRisk" | "broken" {
  if (days <= 0) return "broken";
  return "active";
}

export function TopBar({
  profile,
  unreadCount = 0,
  onOpenSearch,
}: {
  profile: Profile;
  unreadCount?: number;
  onOpenSearch?: () => void;
}) {
  return (
    <header className="glass-panel sticky top-0 z-20 flex items-center gap-3 border-x-0 border-t-0 px-4 py-3 md:px-6">
      {/* לוגו mark למובייל (הסיידבר מוסתר) */}
      <div className="md:hidden">
        <Logo variant="mark" size={30} />
      </div>

      {/* חיפוש */}
      <button
        onClick={onOpenSearch}
        className="mx-auto flex w-full max-w-md items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2 text-sm text-muted transition-colors hover:border-[color:var(--accent-border)]"
        aria-label="חיפוש בחממה"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-start text-muted-2">חיפוש קורס, שיעור, פוסט...</span>
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted-2 md:inline-block">
          Ctrl K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <StreakBadge
          days={profile.streakDays}
          state={streakState(profile.streakDays)}
          className="hidden sm:inline-flex"
        />

        <Link
          to="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:text-ink"
          aria-label="פתיחת התראות"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold tabular text-[#1a1206]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
