// src/routes/_app/index.tsx — "החממה שלי" (דשבורד, פרק 3.3 §3)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Play, ArrowLeft, Flame, Target, MessageSquare, Radio, Droplet } from "lucide-react";
import { greetingKey, t } from "../../lib/copy";
import { revealUp, useGatedVariants, staggerContainer } from "../../lib/motion";
import { useSession } from "../../hooks/useSession";
import { data } from "../../lib/data";
import { tierName, tierProgress } from "../../lib/data/types";
import { GrowthRing } from "../../components/greenhouse/GrowthRing";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Dashboard() {
  const { profile } = useSession();
  const gated = useGatedVariants(revealUp);

  const { data: cont } = useQuery({
    queryKey: ["continue"],
    queryFn: () => data.progress.continueLearning(),
  });
  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: () => data.gamification.getStreak(),
  });
  const { data: posts } = useQuery({
    queryKey: ["posts", "all"],
    queryFn: () => data.community.listPosts(),
  });
  const { data: courses } = useQuery({ queryKey: ["courses"], queryFn: () => data.courses.list() });

  if (!profile) return null;
  const firstName = profile.fullName.split(" ")[0];
  const { progress: tp, toNext, nextName } = tierProgress(profile.xpTotal);
  const weeklyDone = 68;
  const weeklyGoal = profile.weeklyGoalMinutes;

  return (
    <motion.div
      className="mx-auto max-w-6xl"
      variants={staggerContainer()}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={gated} className="mb-7">
        <span className="label-mono">{tierName(profile.growthStage)}</span>
        <h1 className="mt-1 text-h1 text-ink">{t(greetingKey(), { name: firstName })}</h1>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* עמודה ראשית */}
        <div className="space-y-6">
          {/* ContinueHero */}
          {cont && (
            <motion.div variants={gated}>
              <Link
                to="/learn/$courseSlug/$lessonId"
                params={{ courseSlug: cont.course.slug, lessonId: cont.lesson.id }}
                className="group block"
              >
                <div className="surface-card relative overflow-hidden">
                  <div className="relative aspect-[21/8] overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-[8000ms] group-hover:scale-105"
                      style={{
                        background:
                          "radial-gradient(circle at 75% 25%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 55%), linear-gradient(135deg, var(--panel-2), var(--bg))",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, var(--bg) 15%, transparent 70%)",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-full shadow-[var(--glow-md)] transition-transform group-hover:scale-105 animate-breathe"
                        style={{ background: "var(--grad-gold)" }}
                      >
                        <Play className="h-6 w-6 translate-x-0.5 fill-[#1a1206] text-[#1a1206]" />
                      </span>
                    </div>
                    <div className="absolute inset-x-5 bottom-4">
                      <span className="label-mono">{cont.course.title}</span>
                      <h2 className="mt-1 text-h2 text-ink">{cont.lesson.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full"
                      style={{ background: "var(--panel-2)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${cont.progress.watchedPct}%`,
                          background: "var(--grad-gold)",
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] tabular text-muted">
                      {cont.progress.positionSec > 0
                        ? `נשארו ${fmtDur(Math.max(0, cont.lesson.durationSec - cont.progress.positionSec))}`
                        : t("cta.continueWatching")}
                    </span>
                    <ArrowLeft className="h-5 w-5 text-accent transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* StatsStrip */}
          <motion.div variants={gated} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile icon={<Flame className="h-5 w-5" />} label="רצף השקיה">
              <div className="flex items-baseline gap-2">
                <span className="display-latin text-h2 tabular text-ink">
                  {streak?.days ?? profile.streakDays}
                </span>
                <span className="text-small text-muted">ימים רצוף</span>
              </div>
            </StatTile>
            <StatTile icon={<Target className="h-5 w-5" />} label="יעד שבועי">
              <div className="flex items-baseline gap-2">
                <span className="display-latin text-h2 tabular text-ink">{weeklyDone}</span>
                <span className="text-small text-muted">/ {weeklyGoal} דק'</span>
              </div>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full"
                style={{ background: "var(--panel-2)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (weeklyDone / weeklyGoal) * 100)}%`,
                    background: "var(--grad-gold)",
                  }}
                />
              </div>
            </StatTile>
            <StatTile icon={<span className="text-accent">◈</span>} label="דרגה">
              <div className="flex items-baseline gap-2">
                <span className="text-h3 text-ink">{tierName(profile.growthStage)}</span>
              </div>
              {nextName && (
                <div className="mt-1 text-[11px] text-muted">
                  עוד {toNext.toLocaleString("en-US")} XP ל{nextName}
                </div>
              )}
              <div
                className="mt-2 h-1 overflow-hidden rounded-full"
                style={{ background: "var(--panel-2)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${tp * 100}%`, background: "var(--grad-gold)" }}
                />
              </div>
            </StatTile>
          </motion.div>

          {/* NextStepCard */}
          {cont && (
            <motion.div variants={gated} className="surface-card p-5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="label-mono">הצעד הבא שלך</span>
              </div>
              <h3 className="mt-2 text-h3 text-ink">{cont.lesson.title}</h3>
              <p className="mt-1 text-small text-muted">
                כי אתה באמצע "{cont.course.title}". קליק אחד וממשיכים.
              </p>
              <Link
                to="/learn/$courseSlug/$lessonId"
                params={{ courseSlug: cont.course.slug, lessonId: cont.lesson.id }}
                className="btn-primary mt-4 inline-flex items-center gap-2 text-small"
              >
                <Play className="h-4 w-4 fill-current" />
                {t("cta.continueWatching")}
              </Link>
            </motion.div>
          )}

          {/* UpcomingEvents — בקרוב */}
          <motion.div variants={gated} className="surface-card flex items-center gap-4 p-5">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: "var(--accent-faint)" }}
            >
              <Radio className="h-5 w-5 text-accent" />
            </span>
            <div className="flex-1">
              <div className="text-body font-medium text-ink">לייבים חודשיים</div>
              <div className="text-small text-muted">לוח הלייבים והשידורים החיים יעלה בקרוב.</div>
            </div>
            <span className="label-mono">בקרוב</span>
          </motion.div>

          {/* CommunityTeaser */}
          <motion.div variants={gated}>
            <div className="mb-3 flex items-end justify-between">
              <span className="label-mono">מהקהילה</span>
              <Link
                to="/community"
                className="text-small text-muted transition-colors hover:text-accent"
              >
                לכל הקהילה
              </Link>
            </div>
            <div className="space-y-3">
              {(posts ?? []).slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  to="/community/post/$id"
                  params={{ id: p.id }}
                  className="surface-card flex items-center gap-3 p-4 transition-colors hover:border-[color:var(--accent-border)]"
                >
                  <GrowthRing size="sm" tier={p.authorStage} progress={0} name={p.authorName} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-body text-ink">{p.title ?? p.body}</div>
                    <div className="mt-0.5 text-[12px] text-muted">
                      {p.authorName} · דרגת {tierName(p.authorStage)}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-muted">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-mono text-[11px] tabular">{p.commentsCount}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* עמודת צד */}
        <motion.aside variants={gated} className="space-y-5">
          {/* לוח רצף שבועי */}
          <div className="surface-card p-5">
            <span className="label-mono">השבוע שלך</span>
            <div className="mt-3 flex justify-between">
              {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((d, i) => {
                const active = i < (streak?.days ?? 0) % 7 || i < 5;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[12px]"
                      style={{
                        background: active ? "var(--accent-faint)" : "var(--panel-2)",
                        color: active ? "var(--accent)" : "var(--muted-2)",
                        border: active
                          ? "1px solid var(--accent-border)"
                          : "1px solid var(--line-soft)",
                      }}
                    >
                      {active ? <Droplet className="h-3.5 w-3.5" /> : d}
                    </span>
                    <span className="text-[10px] text-muted">{d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* מיני-מובילים */}
          <div className="surface-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="label-mono">צמרת החממה</span>
              <span className="label-mono" style={{ color: "var(--accent)" }}>
                בקרוב
              </span>
            </div>
            <div className="space-y-2.5 opacity-70">
              {(courses ? ["נועה כהן", "דניאל לוי", "רון אברהם"] : []).map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-4 font-mono text-[12px] text-muted">{i + 1}</span>
                  <span className="flex-1 text-small text-ink-2">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ההשקיה של היום */}
          <div className="surface-card p-5">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-accent" />
              <span className="label-mono">ההשקיה של היום</span>
            </div>
            <p className="mt-2 text-small text-ink-2">
              לפני שכותבים קופי — כתבו במשפט אחד את הפחד הכי גדול של הלקוח. כל השאר נגזר מזה.
            </p>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

function StatTile({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <span className="label-mono">{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
