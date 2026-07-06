// src/components/greenhouse/StreakBadge.tsx — "להבת-עלה" רצף ההשקיה (פרק 4.4.3)
type State = "active" | "atRisk" | "broken";

function LeafFlame({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* עלה בצורת להבה — path אחד */}
      <path
        d="M12 3 C7 8 6 12 8 16 C9.2 18.4 11 19.5 12 21 C13 19.5 14.8 18.4 16 16 C18 12 17 8 12 3Z"
        fill={color}
      />
      <path
        d="M12 8 C10.5 11 10.5 14 12 18"
        stroke="var(--bg)"
        strokeWidth="1"
        opacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StreakBadge({
  days,
  state = "active",
  freezes = 0,
  className = "",
}: {
  days: number;
  state?: State;
  freezes?: number;
  className?: string;
}) {
  const color =
    state === "active" ? "var(--accent)" : state === "atRisk" ? "var(--warning)" : "var(--muted-2)";
  const title = state === "broken" ? "מתחילים רצף חדש היום" : `רצף השקיה: ${days} ימים`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${className}`}
      style={{
        borderColor: "var(--accent-border)",
        background: "var(--accent-faint)",
      }}
      title={title}
      aria-label={title}
    >
      <span
        className={state === "active" ? "animate-breathe" : undefined}
        style={{ transformOrigin: "center" }}
      >
        <LeafFlame color={color} />
      </span>
      <span className="display-latin text-[13px] font-bold tabular text-ink">{days}</span>
      {freezes > 0 && (
        <span className="flex items-center gap-0.5 opacity-70" aria-label={`${freezes} עלי מגן`}>
          <LeafFlame color="var(--muted)" size={11} />
          <span className="display-latin text-[10px] tabular text-muted">{freezes}</span>
        </span>
      )}
    </span>
  );
}
