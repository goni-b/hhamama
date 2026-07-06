// src/components/greenhouse/GrowthRing.tsx — טבעת דרגה סביב avatar (פרק 4.4.1)
import { motion } from "motion/react";
import { EASE } from "../../lib/motion";
import { tierName, type GrowthStage } from "../../lib/data/types";
import { GrowthIcon } from "./GrowthIcons";

const SIZES = { sm: 44, md: 64, lg: 96 } as const;
const C = 2 * Math.PI * 46;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] ?? "").join("");
}

export function GrowthRing({
  progress,
  tier,
  size = "md",
  src,
  name,
  breathe = false,
}: {
  progress: number;
  tier: GrowthStage;
  size?: "sm" | "md" | "lg";
  src?: string | null;
  name: string;
  breathe?: boolean;
}) {
  const px = SIZES[size];
  const clamped = Math.min(1, Math.max(0, progress));
  const badge = Math.round(px * 0.28);

  return (
    <div
      className="relative shrink-0"
      style={{ width: px, height: px }}
      role="img"
      aria-label={`דרגת ${tierName(tier)}, התקדמות ${Math.round(clamped * 100)}%`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`-rotate-90 ${breathe ? "animate-breathe" : ""}`}
        width={px}
        height={px}
      >
        <defs>
          <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-3)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line)" strokeWidth="4" />
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#ringGold)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - clamped) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </svg>

      {/* avatar */}
      <div
        className="absolute inset-[10%] flex items-center justify-center overflow-hidden rounded-full bg-panel-2"
        aria-hidden="true"
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-semibold text-accent" style={{ fontSize: px * 0.3 }}>
            {initials(name)}
          </span>
        )}
      </div>

      {/* תג דרגה בפינה התחתונה-התחלתית (RTL: ימין) */}
      <span
        className="absolute -bottom-0.5 flex items-center justify-center rounded-full border border-line bg-panel shadow-[var(--elev-1)]"
        style={{ width: badge, height: badge, insetInlineStart: 0 }}
        aria-hidden="true"
      >
        <GrowthIcon stage={tier} size={badge * 0.7} active />
      </span>
    </div>
  );
}
