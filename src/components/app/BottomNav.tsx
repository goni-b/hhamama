// src/components/app/BottomNav.tsx — ניווט תחתון למובייל (פרק 3.2), 5 פריטים
import { Link } from "@tanstack/react-router";
import { Home, Library, Play, Users, Route as RouteIcon } from "lucide-react";

const SIDE = [
  { to: "/", label: "הבית", icon: Home, exact: true },
  { to: "/courses", label: "קורסים", icon: Library, exact: false },
] as const;

const SIDE_2 = [
  { to: "/community", label: "קהילה", icon: Users, exact: false },
  { to: "/achievements", label: "המסע", icon: RouteIcon, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav className="glass-panel fixed inset-x-0 bottom-0 z-30 flex items-end justify-around border-x-0 border-b-0 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 md:hidden">
      {SIDE.map((it) => (
        <NavItem key={it.to} {...it} />
      ))}

      {/* כפתור "המשך" מרכזי */}
      <Link to="/" className="-mt-5 flex flex-col items-center" aria-label="המשך מאיפה שעצרת">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--glow-md)]"
          style={{ background: "var(--grad-gold)" }}
        >
          <Play className="h-6 w-6 translate-x-0.5 fill-[#1a1206] text-[#1a1206]" />
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-ink-2">המשך</span>
      </Link>

      {SIDE_2.map((it) => (
        <NavItem key={it.to} {...it} />
      ))}
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  exact,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  exact: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-muted"
      activeProps={{
        className: "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-accent",
      }}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
