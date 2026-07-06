// src/routes/admin/index.tsx — דשבורד KPI לניהול (פרק 3.4 §17)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Users, Clock, GraduationCap, AlertTriangle } from "lucide-react";
import { data } from "../../lib/data";
import { useCountUp } from "../../lib/motion";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const MEMBERS_6M = [
  { m: "פבר", v: 62 },
  { m: "מרץ", v: 78 },
  { m: "אפר", v: 95 },
  { m: "מאי", v: 108 },
  { m: "יוני", v: 118 },
  { m: "יולי", v: 128 },
];
const WATCH_WEEK = [
  { d: "א", v: 480 },
  { d: "ב", v: 520 },
  { d: "ג", v: 610 },
  { d: "ד", v: 470 },
  { d: "ה", v: 560 },
  { d: "ו", v: 300 },
  { d: "ש", v: 180 },
];

function AdminDashboard() {
  const { data: kpis } = useQuery({
    queryKey: ["admin", "kpis"],
    queryFn: () => data.admin.kpis(),
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <span className="label-mono">דשבורד</span>
        <h1 className="mt-1 text-h1 text-ink">תמונת מצב</h1>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={<Users className="h-4 w-4" />}
          label="מנויים פעילים"
          value={kpis?.activeMembers.value ?? 0}
          delta={kpis?.activeMembers.deltaPct ?? 0}
        />
        <StatTile
          icon={<Clock className="h-4 w-4" />}
          label="דקות צפייה השבוע"
          value={kpis?.weeklyWatchMinutes.value ?? 0}
          delta={kpis?.weeklyWatchMinutes.deltaPct ?? 0}
        />
        <StatTile
          icon={<GraduationCap className="h-4 w-4" />}
          label="שיעור השלמה"
          value={kpis?.completionRate.value ?? 0}
          suffix="%"
          delta={kpis?.completionRate.deltaPct ?? 0}
        />
        <StatTile
          icon={<TrendingDown className="h-4 w-4" />}
          label="Churn חודשי"
          value={kpis?.churnRate.value ?? 0}
          suffix="%"
          delta={kpis?.churnRate.deltaPct ?? 0}
          invert
        />
      </div>

      {/* גרפים */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <span className="label-mono">מנויים לאורך 6 חודשים</span>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MEMBERS_6M} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="m"
                  reversed
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    color: "var(--ink)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  fill="url(#gGold)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="surface-card p-5">
          <span className="label-mono">דקות צפייה לפי יום</span>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WATCH_WEEK} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
                <XAxis
                  dataKey="d"
                  reversed
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--panel-2)" }}
                  contentStyle={{
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    color: "var(--ink)",
                  }}
                />
                <Bar dataKey="v" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* התור שלך */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="label-mono">חברים בסיכון (14 יום ללא פעילות)</span>
          </div>
          <ul className="space-y-2.5">
            {["מיכל שרון", "יעל דהן", "אבי כהן"].map((n) => (
              <li key={n} className="flex items-center justify-between">
                <span className="text-small text-ink-2">{n}</span>
                <button className="btn-ghost text-[12px]">שלחי תזכורת</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-5">
          <span className="label-mono">התור שלך</span>
          <div className="mt-3 space-y-2">
            <Link
              to="/admin/submissions"
              className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 transition-colors hover:border-[color:var(--accent-border)]"
            >
              <span className="text-small text-ink-2">הגשות ממתינות לבדיקה</span>
              <span className="font-mono text-h3 tabular text-accent">0</span>
            </Link>
            <Link
              to="/admin/members"
              className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 transition-colors hover:border-[color:var(--accent-border)]"
            >
              <span className="text-small text-ink-2">ניהול חברים</span>
              <span className="font-mono text-small tabular text-muted">מעבר</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  suffix = "",
  delta,
  invert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  invert?: boolean;
}) {
  const { ref, value: shown } = useCountUp(value);
  const good = invert ? delta < 0 : delta > 0;
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <span className="label-mono">{label}</span>
      </div>
      <div className="mt-2 display-latin text-h1 tabular text-ink">
        <span ref={ref}>{shown.toLocaleString("en-US")}</span>
        {suffix}
      </div>
      <div
        className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] tabular"
        style={{ color: good ? "var(--success)" : "var(--danger)" }}
      >
        {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(delta)}%
      </div>
    </div>
  );
}
