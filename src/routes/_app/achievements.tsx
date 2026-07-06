// src/routes/_app/achievements.tsx — "המסע שלי": דרגות + תעודות (פרק 3.3 §12)
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Sprout,
  Flame,
  Layers,
  Zap,
  Users,
  Star,
  Calendar,
  GraduationCap,
  HeartHandshake,
  Radio,
  Sunrise,
  Check,
  Brain,
  TreeDeciduous,
  Moon,
  Lock,
  HelpCircle,
} from "lucide-react";
import { data } from "../../lib/data";
import type { Achievement } from "../../lib/data/types";
import { GROWTH_TIERS, tierProgress } from "../../lib/data/types";
import { useSession } from "../../hooks/useSession";
import { GrowthIcon } from "../../components/greenhouse/GrowthIcons";
import { staggerContainer, chipPop, useGatedVariants } from "../../lib/motion";

export const Route = createFileRoute("/_app/achievements")({
  component: JourneyPage,
});

const ICONS: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  seed: Sprout,
  flame: Flame,
  module: Layers,
  marathon: Zap,
  community: Users,
  star: Star,
  calendar: Calendar,
  graduate: GraduationCap,
  hands: HeartHandshake,
  radio: Radio,
  sunrise: Sunrise,
  check: Check,
  brain: Brain,
  sapling: TreeDeciduous,
  moon: Moon,
  lock: Lock,
};

function JourneyPage() {
  const { profile } = useSession();
  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => data.gamification.getAchievements(),
  });
  const gated = useGatedVariants(chipPop);

  if (!profile) return null;
  const currentIdx = GROWTH_TIERS.findIndex((t) => t.stage === profile.growthStage);
  const { toNext, nextName } = tierProgress(profile.xpTotal);
  const unlocked = (achievements ?? []).filter((a) => a.unlockedAt).length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative mb-8">
        <span className="ghost-number" aria-hidden="true">
          05
        </span>
        <span className="label-mono">המסע שלי</span>
        <h1 className="mt-1 text-h1 text-ink">המסע שלך בחממה</h1>
      </div>

      {/* ציר הצמיחה */}
      <section className="surface-card mb-8 p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="label-mono">הדרגה שלך</span>
            <h2 className="mt-1 text-h2 text-ink">{GROWTH_TIERS[currentIdx].name}</h2>
          </div>
          <div className="text-end">
            <div className="display-latin text-h2 tabular gold-text">
              {profile.xpTotal.toLocaleString("en-US")}
            </div>
            <div className="label-mono">נקודות צמיחה</div>
          </div>
        </div>

        {/* ציר 6 הדרגות */}
        <div className="relative flex items-center justify-between">
          <div className="absolute inset-x-4 top-6 h-0.5" style={{ background: "var(--line)" }} />
          <div
            className="absolute start-4 top-6 h-0.5"
            style={{
              width: `${(currentIdx / (GROWTH_TIERS.length - 1)) * 100}%`,
              background: "var(--grad-gold)",
            }}
          />
          {GROWTH_TIERS.map((tier, i) => {
            const reached = i <= currentIdx;
            return (
              <div
                key={tier.stage}
                className="relative z-10 flex flex-col items-center gap-2"
                style={{ width: `${100 / GROWTH_TIERS.length}%` }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: reached ? "var(--accent-faint)" : "var(--panel)",
                    border:
                      i === currentIdx
                        ? "2px solid var(--accent)"
                        : `1px solid ${reached ? "var(--accent-border)" : "var(--line)"}`,
                    boxShadow: i === currentIdx ? "var(--glow-sm)" : undefined,
                  }}
                >
                  <GrowthIcon stage={tier.stage} size={22} active={reached} />
                </span>
                <span
                  className="text-center text-[11px]"
                  style={{ color: reached ? "var(--ink-2)" : "var(--muted-2)" }}
                >
                  {tier.name}
                </span>
              </div>
            );
          })}
        </div>

        {nextName && (
          <p className="mt-6 text-center text-small text-muted">
            עוד{" "}
            <span className="display-latin font-bold text-accent">
              {toNext.toLocaleString("en-US")}
            </span>{" "}
            נקודות צמיחה לדרגת {nextName}
          </p>
        )}
      </section>

      {/* חדר ההישגים */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-h2 text-ink">חדר התעודות</h2>
          <span className="font-mono text-[12px] tabular text-muted">
            {unlocked}/{achievements?.length ?? 0} נפתחו
          </span>
        </div>
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate="visible"
        >
          {(achievements ?? []).map((a) => (
            <motion.div key={a.id} variants={gated}>
              <AchievementCard achievement={a} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function AchievementCard({ achievement: a }: { achievement: Achievement }) {
  const unlocked = !!a.unlockedAt;
  const Icon = a.hidden && !unlocked ? HelpCircle : (ICONS[a.icon] ?? Star);

  return (
    <div
      className="surface-card flex flex-col items-center gap-2.5 p-4 text-center transition-all"
      style={{
        background: unlocked ? "var(--accent-surface)" : "var(--panel)",
        borderColor: unlocked ? "var(--accent-border)" : "var(--line)",
        boxShadow: unlocked ? "var(--glow-sm)" : "var(--elev-1)",
      }}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: unlocked ? "var(--accent-faint)" : "var(--panel-2)" }}
      >
        <Icon
          className="h-6 w-6"
          style={{ color: unlocked ? "var(--accent)" : "var(--muted-2)" }}
        />
      </span>
      <div
        className="text-body font-medium"
        style={{ color: unlocked ? "var(--ink)" : "var(--muted)" }}
      >
        {a.hidden && !unlocked ? "?" : a.title}
      </div>
      <div className="text-[11px]" style={{ color: unlocked ? "var(--ink-2)" : "var(--muted-2)" }}>
        {a.hidden && !unlocked
          ? "הישג נסתר"
          : unlocked
            ? a.description
            : (a.progressHint ?? a.description)}
      </div>
    </div>
  );
}
