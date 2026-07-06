// src/components/greenhouse/XPBar.tsx — פס נקודות צמיחה (פרק 4.4.2)
import { motion } from "motion/react";
import { EASE } from "../../lib/motion";
import { GROWTH_TIERS, tierProgress, stageForXp } from "../../lib/data/types";

export function XPBar({ xp, showLabels = true }: { xp: number; showLabels?: boolean }) {
  const stage = stageForXp(xp);
  const tierIdx = GROWTH_TIERS.findIndex((t) => t.stage === stage);
  const { progress, nextName } = tierProgress(xp);
  const next = GROWTH_TIERS[tierIdx + 1];
  const target = next ? next.min : GROWTH_TIERS[tierIdx].min;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={nextName ? `התקדמות לדרגת ${nextName}` : "דרגה מקסימלית"}
    >
      {showLabels && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="label-mono">LEVEL {tierIdx + 1}</span>
          <span className="display-latin text-[12px] tabular text-ink-2">
            {xp.toLocaleString("en-US")}
            {next ? ` / ${target.toLocaleString("en-US")}` : ""} XP
          </span>
        </div>
      )}
      <div
        className="h-2 overflow-hidden rounded-full border"
        style={{ background: "var(--panel-2)", borderColor: "var(--line-soft)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--grad-gold)", transformOrigin: "right", width: "100%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: progress }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
      </div>
    </div>
  );
}
