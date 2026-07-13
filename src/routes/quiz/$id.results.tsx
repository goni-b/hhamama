// src/routes/quiz/$id.results.tsx — תוצאות מבחן (פרק 3.3 §7)
import { createFileRoute, Link, useParams, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Award, Check, RotateCcw, X } from "lucide-react";
import { data } from "../../lib/data";
import type { Course } from "../../lib/data/types";
import { copy, t } from "../../lib/copy";
import { EASE, revealUp, staggerContainer, useCountUp, useGatedVariants } from "../../lib/motion";
import { EmptyState } from "../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/quiz/$id/results")({
  component: QuizResultsPage,
});

/* קאנון ה-XP (פרק 2.2): מעבר מבחן 50, מבחן מושלם +25 */
const XP_QUIZ_PASS = 50;
const XP_QUIZ_PERFECT = 25;

function QuizResultsPage() {
  const { id } = useParams({ from: "/quiz/$id/results" });
  const review = useRouterState({ select: (s) => s.location.state.quizReview });
  const gated = useGatedVariants(revealUp);

  const {
    data: quiz,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => data.quizzes.get(id),
  });
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => data.courses.list(),
    enabled: !!quiz,
  });
  const course = quiz
    ? (courses?.find((c) => c.modules.some((m) => m.id === quiz.moduleId)) ?? null)
    : null;

  /* ---------- מצב טעינה ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-[3px] w-full" style={{ background: "var(--panel-2)" }} />
        <div className="mx-auto w-full max-w-2xl px-4 py-10">
          <div className="skeleton mx-auto mb-8 h-44 w-44 rounded-full" />
          <div className="skeleton mx-auto mb-3 h-8 w-1/2 rounded-md" />
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- מצב שגיאה ---------- */
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-md p-8 text-center">
          <h1 className="text-h2 text-ink">{copy["error.generic"]}</h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => refetch()} className="btn-primary text-small">
              נסה שוב
            </button>
            <Link to="/courses" className="btn-secondary text-small">
              חזרה לספרייה
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- מצב ריק — המבחן לא קיים ---------- */
  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-md">
          <EmptyState
            title="המבחן לא נמצא"
            description="ייתכן שהקישור השתנה או שהמבחן עוד לא פורסם."
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

  /* ---------- אין תוצאה טרייה ב-router state — מציעים לגשת שוב ---------- */
  if (!review || review.quizId !== id) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-md">
          <EmptyState
            title="התוצאות כבר לא כאן"
            description="הגעת לעמוד בלי הגשה טרייה. אפשר לגשת למבחן שוב ולקבל תוצאה חדשה."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/quiz/$id"
                  params={{ id }}
                  className="btn-primary inline-flex items-center gap-2 text-small"
                >
                  <RotateCcw className="h-4 w-4" />
                  לגשת למבחן
                </Link>
                <CourseLink course={course} className="btn-secondary text-small" />
              </div>
            }
          />
        </div>
      </div>
    );
  }

  /* ---------- תוכן ---------- */
  const { result, answers } = review;
  const xpShown =
    result.xpAwarded > 0
      ? result.xpAwarded
      : (result.passed ? XP_QUIZ_PASS : 0) + (result.perfect ? XP_QUIZ_PERFECT : 0);
  const correctCount = quiz.questions.filter(
    (q) => answers[q.id] && answers[q.id] === result.correctByQuestion[q.id],
  ).length;
  const headline = result.perfect
    ? "מאה אחוז — צמיחה מושלמת"
    : result.passed
      ? "עברת את המבחן"
      : "עוד לא — וזה בסדר";
  const sub = result.perfect
    ? "ענית נכון על כל השאלות. ההישג נרשם בחממה שלך."
    : result.passed
      ? `עברת את סף ה-${quiz.passScore}. הידע מכה שורש.`
      : "צמיחה היא לא קו ישר. עבור על הפירוט למטה ונסה שוב.";

  return (
    <div className="min-h-screen">
      {/* סרגל עליון */}
      <div className="sticky top-0 z-30">
        <div className="h-[3px] w-full" style={{ background: "var(--grad-gold)" }} />
        <div className="glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5">
          <CourseLink
            course={course}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent"
            icon
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-small text-ink">{quiz.title}</div>
          </div>
          <span className="label-mono">תוצאות</span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        {/* כרטיס ציון */}
        <motion.section
          className="surface-card relative overflow-hidden p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {result.passed && <GoldParticles />}
          <div className="relative flex flex-col items-center">
            <ScoreRing score={result.score} passed={result.passed} />
            <h1 className="mt-6 text-h1 text-ink">{headline}</h1>
            <p className="mt-2 max-w-md text-body text-ink-2">{sub}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="font-mono text-[12px] tabular text-muted">
                {correctCount} מתוך {quiz.questions.length} תשובות נכונות
              </span>
              {xpShown > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[12px] tabular"
                  style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                >
                  {t("points.earned", { count: xpShown })}
                </span>
              )}
              {result.perfect && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
                  style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                >
                  <Award className="h-3.5 w-3.5" />
                  הישג: מאה אחוז
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {result.passed ? (
                <>
                  <CourseLink course={course} className="btn-primary text-small" />
                  {!result.perfect && (
                    <Link
                      to="/quiz/$id"
                      params={{ id }}
                      className="btn-secondary inline-flex items-center gap-2 text-small"
                    >
                      <RotateCcw className="h-4 w-4" />
                      נסה שוב
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/quiz/$id"
                    params={{ id }}
                    className="btn-primary inline-flex items-center gap-2 text-small"
                  >
                    <RotateCcw className="h-4 w-4" />
                    נסה שוב
                  </Link>
                  <CourseLink course={course} className="btn-secondary text-small" />
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* פירוט שאלה-שאלה */}
        <h2 className="mt-10 mb-4 text-h2 text-ink">פירוט התשובות</h2>
        <motion.ul
          className="space-y-4"
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
        >
          {quiz.questions.map((q, qi) => {
            const chosenId = answers[q.id];
            const correctId = result.correctByQuestion[q.id];
            const ok = !!chosenId && chosenId === correctId;
            return (
              <motion.li key={q.id} variants={gated} className="surface-card p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: ok
                        ? "color-mix(in srgb, var(--success) 14%, transparent)"
                        : "color-mix(in srgb, var(--danger) 14%, transparent)",
                      color: ok ? "var(--success)" : "var(--danger)",
                    }}
                    aria-label={ok ? "תשובה נכונה" : "תשובה שגויה"}
                  >
                    {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-h3 text-ink">
                      <span className="font-mono text-[13px] tabular text-muted">
                        {String(qi + 1).padStart(2, "0")}
                      </span>{" "}
                      {q.prompt}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {q.options.map((o) => {
                        const isCorrect = o.id === correctId;
                        const isChosen = o.id === chosenId;
                        return (
                          <li
                            key={o.id}
                            className="flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
                            style={{
                              borderColor: isCorrect
                                ? "color-mix(in srgb, var(--success) 45%, transparent)"
                                : isChosen
                                  ? "color-mix(in srgb, var(--danger) 45%, transparent)"
                                  : "var(--line-soft)",
                              background: isCorrect
                                ? "color-mix(in srgb, var(--success) 8%, transparent)"
                                : isChosen
                                  ? "color-mix(in srgb, var(--danger) 8%, transparent)"
                                  : "transparent",
                            }}
                          >
                            <span
                              className="flex-1 text-small"
                              style={{
                                color: isCorrect || isChosen ? "var(--ink)" : "var(--ink-2)",
                              }}
                            >
                              {o.text}
                            </span>
                            {isChosen && <span className="label-mono shrink-0">התשובה שלך</span>}
                            {isCorrect ? (
                              <Check
                                className="h-4 w-4 shrink-0"
                                style={{ color: "var(--success)" }}
                              />
                            ) : isChosen ? (
                              <X className="h-4 w-4 shrink-0" style={{ color: "var(--danger)" }} />
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                    {!chosenId && (
                      <p className="mt-2 text-small text-muted">לא נבחרה תשובה לשאלה זו.</p>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </main>
    </div>
  );
}

/* ---------- קישור חזרה לקורס (או לספרייה אם הקורס לא אותר) ---------- */
function CourseLink({
  course,
  className,
  icon = false,
}: {
  course: Course | null;
  className: string;
  icon?: boolean;
}) {
  const label = course ? "חזרה לקורס" : "לספריית הקורסים";
  const inner = (
    <>
      {icon && <ArrowLeft className="h-4 w-4" />}
      {label}
    </>
  );
  return course ? (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {inner}
    </Link>
  ) : (
    <Link to="/courses" className={`inline-flex items-center gap-2 ${className}`}>
      {inner}
    </Link>
  );
}

/* ---------- טבעת ציון עם count-up ---------- */
function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const C = 2 * Math.PI * 54;
  const { ref, value } = useCountUp(score, 1.4);
  const clamped = Math.min(100, Math.max(0, score));
  return (
    <div className="relative" style={{ width: 176, height: 176 }}>
      <svg viewBox="0 0 120 120" width={176} height={176} className="-rotate-90">
        <defs>
          <linearGradient id="quizScoreGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-3)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--line)" strokeWidth="7" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={passed ? "url(#quizScoreGold)" : "var(--danger)"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - clamped / 100) }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        role="img"
        aria-label={`ציון ${score} מתוך 100`}
      >
        <span
          ref={ref}
          className="display-latin text-ink"
          style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}
        >
          {value}
        </span>
        <span className="label-mono mt-1.5">מתוך 100</span>
      </div>
    </div>
  );
}

/* ---------- חלקיקי זהב איטיים — רגע ה-WOW במעבר (פרק 3.3 §7) ---------- */
function GoldParticles() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const dots = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 61 + 13) % 100,
    delay: (i % 7) * 0.9,
    size: 3 + (i % 3) * 2,
    dur: 7 + (i % 5),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            insetInlineStart: `${d.left}%`,
            bottom: -10,
            width: d.size,
            height: d.size,
            background: i % 2 ? "var(--accent)" : "var(--accent-3)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -280, opacity: [0, 0.85, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
