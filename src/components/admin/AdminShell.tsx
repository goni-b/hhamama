// src/components/admin/AdminShell.tsx — שלד מערך הניהול (פרק 3.4)
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Users, BookOpen, ClipboardCheck, ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { Logo } from "../brand/Logo";

const NAV = [
  { to: "/admin", label: "דשבורד", icon: LayoutDashboard, exact: true },
  { to: "/admin/members", label: "ניהול חברים", icon: Users, exact: false },
  { to: "/admin/courses", label: "ניהול קורסים", icon: BookOpen, exact: false },
  { to: "/admin/submissions", label: "בדיקת הגשות", icon: ClipboardCheck, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[240px] shrink-0 flex-col border-s border-line bg-bg-2 md:flex">
        <div className="px-5 py-5">
          <Logo variant="full" size={34} />
        </div>
        <nav className="flex-1 px-3">
          <div className="px-3 pb-2">
            <span className="label-mono">ניהול</span>
          </div>
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
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
        </nav>
        <div className="border-t border-line-soft p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted transition-colors hover:text-ink"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לחממה
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex items-center justify-between border-b px-6 py-2"
          style={{ background: "var(--accent-faint)", borderColor: "var(--accent-border)" }}
        >
          <span className="label-mono" style={{ color: "var(--accent)" }}>
            מצב ניהול
          </span>
          <Link to="/" className="text-[12px] text-accent md:hidden">
            חזרה לחממה
          </Link>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
