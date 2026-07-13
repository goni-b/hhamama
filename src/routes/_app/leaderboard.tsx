// src/routes/_app/leaderboard.tsx — צמרת החממה (פרק 3.3 §11 + פרק 2.6)
import { createFileRoute, Link } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { RotateCcw, Trophy } from "lucide-react";
import { data } from "../../lib/data";
import { copy } from "../../lib/copy";
import { useSession } from "../../hooks/useSession";
import { EASE, revealUp, staggerContainer, useCountUp, useGatedVariants } from "../../lib/motion";
import { tierName, type LeaderboardRow } from "../../lib/data/types";
import { EmptyState } from "../../components/greenhouse/EmptyState";
import { GrowthRing } from "../../components/greenhouse/GrowthRing";
import { GrowthIcon } from "../../components/greenhouse/GrowthIcons";

export const Route = createFileRoute("/_app/leaderboard")({
  component: LeaderboardPage,
});

type Period = "week" | "month" | "all";

const PERIODS: { id: Period; label: string }[] = [
  { id: "week", label: "השבוע" },
  { id: "month", label: "החודש" },
  { id: "all", label: "כל הזמנים" },
];

/* עיטורי מקומות 1–3 — כולם נגזרות של האקסנט, לא צבעים חדשים (פרק 2.6) */
const MEDAL: Record<1 | 2 | 3, string> = {
  1: "var(--accent)",
  2: "color-mix(in srgb, var(--accent) 30%, var(--ink-2))",
  3: "color-mix(in srgb, var(--accent-2) 55%, var(--muted))",
};

const PEDESTAL: Record<1 | 2 | 3, number> = { 1: 104, 2: 76, 3: 58 };

/* חלון יחסי (פרק 2.6): חמישייה ראשונה + השכנות שלך (3 מעל / 3 מתחת) */
type TableItem = { kind: "row"; row: LeaderboardRow } | { kind: "gap"; id: string };

function buildTableItems(rows: LeaderboardRow[]): TableItem[] {
  if (rows.length === 0) return [];
  const byRank = new Map(rows.map((r) => [r.rank, r]));
  const maxRank = Math.max(...rows.map((r) => r.rank));
  const me = rows.find((r) => r.isCurrentUser) ?? null;

  const wanted = new Set<number>();
  for (let r = 4; r <= Math.min(5, maxRank); r++) wanted.add(r);
  if (me) {
    for (let r = me.rank - 3; r <= me.rank + 3; r++) {
      if (r >= 4 && r <= maxRank) wanted.add(r);
    }
  } else {
    for (let r = 6; r <= Math.min(10, maxRank); r++) wanted.add(r);
  }

  const items: TableItem[] = [];
  let prev = 3;
  for (const rank of [...wanted].sort((a, b) => a - b)) {
    const row = byRank.get(rank);
    if (!row) continue;
    if (rank - prev > 1) items.push({ kind: "gap", id: `gap-${rank}` });
    items.push({ kind: "row", row });
    prev = rank;
  }
  return items;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] ?? "").join("");
}

function fmtXp(xp: number): string {
  return xp.toLocaleString("he-IL");
}

function LeaderboardPage() {
  const { profile } = useSession();
  const [period, setPeriod] = useState<Period>("week");

  /* טוגל תקופה בלי לרוקן את הטבלה (פרק 3.3 §11) */
  const query = useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => data.gamification.getLeaderboard(period),
    placeholderData: keepPreviousData,
  });

  const rows = query.data ?? [];
  const me = rows.find((r) => r.isCurrentUser) ?? null;
  const podium = [
    rows.find((r) => r.rank === 2),
    rows.find((r) => r.rank === 1),
    rows.find((r) => r.rank === 3),
  ].filter((r): r is LeaderboardRow => !!r);
  const tableItems = buildTableItems(rows);

  let body: ReactNode;
  if (query.isLoading) {
    body = (
      <div>
        <div className="mx-auto mb-6 flex w-full max-w-xl items-end justify-center gap-3 md:gap-5">
          <div className="skeleton h-44 w-full max-w-[170px] rounded-t-xl" />
          <div className="skeleton h-56 w-full max-w-[170px] rounded-t-xl" />
          <div className="skeleton h-36 w-full max-w-[170px] rounded-t-xl" />
        </div>
        <div className="surface-card space-y-3 p-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-12 rounded-md" />
          ))}
        </div>
      </div>
    );
  } else if (query.isError) {
    body = (
      <div className="surface-card">
        <EmptyState
          icon={
            <Trophy
              className="h-16 w-16"
              style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
            />
          }
          title={copy["error.generic"]}
          action={
            <button
              onClick={() => void query.refetch()}
              className="btn-secondary inline-flex items-center gap-2 text-small"
            >
              <RotateCcw className="h-4 w-4" />
              נסה שוב
            </button>
          }
        />
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <div className="surface-card">
        <EmptyState
          icon={
            <Trophy
              className="h-16 w-16"
              style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
            />
          }
          title="עוד אין נקודות בתקופה הזו"
          description="כל שיעור שמסתיים, תגובה בקהילה והשקיה יומית מזיזים אותך למעלה בטבלה."
        />
      </div>
    );
  } else {
    body = (
      <div
        className={`transition-opacity duration-300 ${
          query.isFetching && !query.isLoading ? "opacity-70" : "opacity-100"
        }`}
      >
        {/* פודיום טופ-3 — עולה מהרצפה ב-stagger, מספרים ב-count-up */}
        {podium.length > 0 && (
          <motion.section
            aria-label="שלוש המובילות"
            className="mx-auto mb-2 flex w-full max-w-xl items-end justify-center gap-3 md:gap-5"
            variants={staggerContainer(0.14, 0.1)}
            initial="hidden"
            animate="visible"
          >
            {podium.map((r) => (
              <PodiumCard key={r.userId} row={r} />
            ))}
          </motion.section>
        )}

        {tableItems.length > 0 && (
          <>
            <hr className="divider-gold my-6" />
            <section className="surface-card overflow-hidden" aria-label="טבלת הדירוג">
              <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
                <span className="label-mono w-9 shrink-0 text-center">מקום</span>
                <span className="label-mono flex-1">חברה</span>
                <span className="label-mono shrink-0">XP</span>
              </div>
              <motion.ul variants={staggerContainer(0.05, 0.2)} initial="hidden" animate="visible">
                {tableItems.map((item) =>
                  item.kind === "gap" ? (
                    <li
                      key={item.id}
                      aria-hidden="true"
                      className="border-b border-line-soft px-4 py-1 text-center font-mono text-[12px] text-muted-2"
                    >
                      · · ·
                    </li>
                  ) : (
                    <RowItem key={item.row.userId} row={item.row} />
                  ),
                )}
              </motion.ul>
            </section>
          </>
        )}

        {/* המיקום שלך — sticky בתחתית אם את לא בטופ (פרק 3.3 §11) */}
        {me && me.rank > 5 && <MyRankBar row={me} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative mb-6">
        <span className="ghost-number" aria-hidden="true">
          07
        </span>
        <span className="label-mono">{copy["nav.leaderboard"]}</span>
        <h1 className="mt-1 text-h1 text-ink">צמרת החממה</h1>
        <p className="mt-2 max-w-xl text-small text-muted">
          מתחרות רק בתוך הליגה של הדרגה שלך
          {profile ? ` — ליגת ה${tierName(profile.growthStage)}` : ""}, כך שלכל אחת יש סיכוי אמיתי
          להוביל.
        </p>
      </div>

      {/* טוגל תקופה */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => {
          const active = period === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              aria-pressed={active}
              className="rounded-full border px-4 py-1.5 text-small transition-all"
              style={{
                borderColor: active ? "var(--accent)" : "var(--line)",
                background: active ? "var(--accent-faint)" : "transparent",
                color: active ? "var(--accent)" : "var(--ink-2)",
              }}
            >
              {p.label}
            </button>
          );
        })}
        {period === "week" && (
          <span className="ms-auto hidden font-mono text-[11px] text-muted-2 sm:inline">
            מתאפס בכל יום ראשון ב-04:00 — התחלה נקייה
          </span>
        )}
      </div>

      {body}
    </div>
  );
}

/* ---------- פודיום ---------- */

function PodiumCard({ row }: { row: LeaderboardRow }) {
  const gated = useGatedVariants(revealUp);
  const { ref, value } = useCountUp(row.xp, 1.4);
  const place = Math.min(Math.max(row.rank, 1), 3) as 1 | 2 | 3;
  const medal = MEDAL[place];
  const first = place === 1;

  return (
    <motion.div variants={gated} className="flex w-full min-w-0 max-w-[170px] flex-col">
      <Link
        to="/profile/$username"
        params={{ username: row.username }}
        className="group flex w-full flex-col items-center"
        aria-label={`מקום ${row.rank}: ${row.fullName}, ${fmtXp(row.xp)} נקודות צמיחה`}
      >
        {first ? (
          <div
            className="relative flex items-end justify-center"
            style={{ width: 112, height: 78 }}
          >
            <Laurel className="absolute inset-x-0 top-0 mx-auto" />
            <GrowthRing
              size="md"
              tier={row.growthStage}
              progress={0}
              src={row.avatarUrl}
              name={row.fullName}
              breathe
            />
          </div>
        ) : (
          <GrowthRing
            size="sm"
            tier={row.growthStage}
            progress={0}
            src={row.avatarUrl}
            name={row.fullName}
          />
        )}

        <p className="mt-2 w-full truncate text-center text-small font-semibold text-ink transition-colors group-hover:text-accent">
          {row.fullName}
        </p>
        <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-muted">
          <GrowthIcon stage={row.growthStage} size={13} active />
          {tierName(row.growthStage)}
        </p>

        <p
          className={`display-latin mt-1.5 text-xl font-bold ${first ? "gold-text" : "text-ink-2"}`}
        >
          <span ref={ref}>{fmtXp(value)}</span>
        </p>
        <span className="label-mono">XP</span>

        <div
          className="mt-3 flex w-full items-start justify-center rounded-t-xl"
          style={{
            height: PEDESTAL[place],
            borderTop: `2px solid ${medal}`,
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--accent) 10%, var(--panel)) 0%, var(--panel) 75%)",
            boxShadow: "var(--elev-1)",
          }}
        >
          <span className="display-latin mt-2.5 text-lg font-bold" style={{ color: medal }}>
            {place}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* זר עלים SVG למקום הראשון — נגזרות אקסנט בלבד */
function Laurel({ className = "" }: { className?: string }) {
  const branch = (
    <g stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round">
      <path d="M26 8 C12 24 12 46 30 62" fill="none" opacity="0.8" />
      <g fill="var(--accent-faint)">
        <ellipse cx="19" cy="16" rx="2.6" ry="6" transform="rotate(-34 19 16)" />
        <ellipse cx="14" cy="28" rx="2.6" ry="6" transform="rotate(-14 14 28)" />
        <ellipse cx="14" cy="41" rx="2.6" ry="6" transform="rotate(8 14 41)" />
        <ellipse cx="20" cy="53" rx="2.6" ry="6" transform="rotate(32 20 53)" />
      </g>
    </g>
  );
  return (
    <svg
      viewBox="0 0 112 70"
      width={112}
      height={70}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {branch}
      <g transform="translate(112 0) scale(-1 1)">{branch}</g>
    </svg>
  );
}

/* ---------- שורת טבלה ---------- */

function RowItem({ row }: { row: LeaderboardRow }) {
  const gated = useGatedVariants(revealUp);
  return (
    <motion.li
      layout
      variants={gated}
      transition={{ layout: { duration: 0.22, ease: EASE } }}
      className="border-b border-line-soft last:border-b-0"
    >
      <Link
        to="/profile/$username"
        params={{ username: row.username }}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--panel-2)]"
        style={{
          /* RTL: inline-start = הצד הימני — גבול זהב 2px לשורה שלך (פרק 2.6) */
          borderInlineStart: row.isCurrentUser
            ? "2px solid var(--accent)"
            : "2px solid transparent",
          background: row.isCurrentUser
            ? "color-mix(in srgb, var(--accent) 14%, transparent)"
            : undefined,
        }}
      >
        <span className="w-9 shrink-0 text-center font-mono text-[13px] tabular text-muted">
          {row.rank}
        </span>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-panel-2"
          aria-hidden="true"
        >
          {row.avatarUrl ? (
            <img src={row.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[12px] font-semibold text-accent">{initials(row.fullName)}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body text-ink">
            {row.fullName}
            {row.isCurrentUser && (
              <span
                className="ms-2 rounded-full px-2 py-0.5 text-[11px]"
                style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
              >
                אני
              </span>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
            <GrowthIcon stage={row.growthStage} size={13} active />
            {tierName(row.growthStage)}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[13px] tabular text-ink-2">{fmtXp(row.xp)}</span>
      </Link>
    </motion.li>
  );
}

/* ---------- "המיקום שלך" — sticky בתחתית, רקע זהב 10% ---------- */

function MyRankBar({ row }: { row: LeaderboardRow }) {
  return (
    <motion.div
      className="sticky bottom-4 z-10 mt-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
    >
      <Link
        to="/profile/$username"
        params={{ username: row.username }}
        className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{
          background: "color-mix(in srgb, var(--accent) 10%, var(--panel))",
          borderColor: "var(--accent-border)",
          boxShadow: "var(--elev-2)",
        }}
      >
        <span className="label-mono hidden sm:inline">המיקום שלך</span>
        <span className="display-latin shrink-0 text-lg font-bold text-accent">{row.rank}</span>
        <GrowthRing
          size="sm"
          tier={row.growthStage}
          progress={0}
          src={row.avatarUrl}
          name={row.fullName}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-semibold text-ink">{row.fullName}</p>
          <p className="text-[11px] text-muted">{tierName(row.growthStage)}</p>
        </div>
        <span className="shrink-0 font-mono text-[13px] tabular text-ink-2">
          {fmtXp(row.xp)} XP
        </span>
      </Link>
    </motion.div>
  );
}
