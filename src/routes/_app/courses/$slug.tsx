// src/routes/_app/courses/$slug.tsx — עמוד קורס (פרק 3.3 §5)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Play, Check, Lock, Clock, Layers, BarChart3, ArrowLeft } from "lucide-react";
import { data } from "../../../lib/data";
import { EASE } from "../../../lib/motion";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

export const Route = createFileRoute("/_app/courses/$slug")({
  component: CoursePage,
});

const LEVEL_HE: Record<string, string> = {
  beginner: "מתחילים",
  intermediate: "בינוני",
  advanced: "מתקדם",
};
const OUTCOMES = [
  "לבנות קמפיין ראשון מקצה לקצה",
  "לכתוב הצעה שאי אפשר לסרב לה",
  "להשתמש ב-AI ככלי עבודה יומיומי",
  "לקרוא נתונים ולדעת מה לשפר",
];

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, "0")}`;
}

function CoursePage() {
  const { slug } = useParams({ from: "/_app/courses/$slug" });
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => data.courses.getBySlug(slug),
  });
  const { data: progress } = useQuery({
    queryKey: ["progress", course?.id],
    queryFn: () => (course ? data.progress.getForCourse(course.id) : Promise.resolve([])),
    enabled: !!course,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="skeleton mb-6 h-64 rounded-xl" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }
  if (!course) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="הקורס לא נמצא"
            description="ייתכן שהקישור השתנה."
            action={
              <Link to="/courses" className="btn-primary text-small">
                חזרה לספרייה
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const doneIds = new Set((progress ?? []).filter((p) => p.completedAt).map((p) => p.lessonId));
  const startedIds = new Set((progress ?? []).map((p) => p.lessonId));
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneCount = allLessons.filter((l) => doneIds.has(l.id)).length;
  const pct = allLessons.length ? Math.round((doneCount / allLessons.length) * 100) : 0;
  const firstUnwatched = allLessons.find((l) => !doneIds.has(l.id)) ?? allLessons[0];
  const started = startedIds.size > 0;
  const locked = !!course.lockedReason;

  return (
    <div className="mx-auto max-w-5xl">
      {/* הירו */}
      <motion.section
        className="surface-card relative mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)",
          }}
        />
        <div className="relative p-7 md:p-10">
          <Link
            to="/courses"
            className="mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            ספריית הקורסים
          </Link>
          <span className="label-mono">{course.category}</span>
          <h1 className="mt-2 max-w-2xl text-display text-ink">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-body-lg text-ink-2">{course.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[12px] tabular text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {course.modules.length} מודולים
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Play className="h-4 w-4" />
              {course.lessonsCount} שיעורים
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {Math.floor(course.totalDurationMin / 60)}:
              {String(course.totalDurationMin % 60).padStart(2, "0")} שעות
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              {LEVEL_HE[course.level]}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {locked ? (
              <span className="btn-secondary inline-flex items-center gap-2 text-small opacity-80">
                <Lock className="h-4 w-4" />
                {course.lockedReason}
              </span>
            ) : (
              <Link
                to="/learn/$courseSlug/$lessonId"
                params={{ courseSlug: course.slug, lessonId: firstUnwatched.id }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                {started ? "המשך צפייה" : "התחל את הצמיחה"}
              </Link>
            )}
            {started && (
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-40 overflow-hidden rounded-full"
                  style={{ background: "var(--panel-2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "var(--grad-gold)" }}
                  />
                </div>
                <span className="font-mono text-[11px] tabular text-muted">{pct}%</span>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        {/* סילבוס */}
        <section>
          <h2 className="mb-4 text-h2 text-ink">תוכנית הקורס</h2>
          <Accordion type="multiple" defaultValue={[course.modules[0]?.id]} className="space-y-3">
            {course.modules.map((m, mi) => (
              <AccordionItem
                key={m.id}
                value={m.id}
                className="surface-card overflow-hidden border-0 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-start">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px]"
                      style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                    >
                      {String(mi + 1).padStart(2, "0")}
                    </span>
                    <span className="text-h3 text-ink">{m.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pb-2">
                    {m.lessons.map((l) => {
                      const done = doneIds.has(l.id);
                      const isLocked = locked;
                      const row = (
                        <div
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors"
                          style={{ background: "transparent" }}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                            {done ? (
                              <span
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{ background: "var(--grad-gold)" }}
                              >
                                <Check className="h-3 w-3 text-[#1a1206]" />
                              </span>
                            ) : isLocked ? (
                              <Lock className="h-4 w-4 text-muted-2" />
                            ) : (
                              <Play className="h-4 w-4 text-muted" />
                            )}
                          </span>
                          <span className="flex-1 text-body text-ink-2">{l.title}</span>
                          <span className="font-mono text-[11px] tabular text-muted">
                            {fmtDur(l.durationSec)}
                          </span>
                        </div>
                      );
                      return (
                        <li key={l.id}>
                          {isLocked ? (
                            <div
                              title={course.lockedReason ?? undefined}
                              className="cursor-not-allowed opacity-60"
                            >
                              {row}
                            </div>
                          ) : (
                            <Link
                              to="/learn/$courseSlug/$lessonId"
                              params={{ courseSlug: course.slug, lessonId: l.id }}
                              className="block hover:bg-[color:var(--panel-2)] rounded-md"
                            >
                              {row}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* מה תשיג + מנטורים */}
        <aside className="space-y-6">
          <div className="surface-card p-5">
            <h3 className="mb-3 text-h3 text-ink">מה תשיג</h3>
            <ul className="space-y-2.5">
              {OUTCOMES.map((o) => (
                <li key={o} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-small text-ink-2">{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-5">
            <h3 className="mb-3 text-h3 text-ink">המנטורים שלך</h3>
            <p className="text-small text-ink-2">
              חופית וגוני — מלווים אותך צעד־צעד, מהיסודות ועד הקמפיין החי הראשון.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
