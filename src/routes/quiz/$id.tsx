// src/routes/quiz/$id.tsx — מסך מבחן ממוקד (פרק 3.3 §7)
import {
  createFileRoute,
  Link,
  Outlet,
  useChildMatches,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ClipboardCheck, X } from "lucide-react";
import { data } from "../../lib/data";
import type { QuizResult } from "../../lib/data/types";
import { copy } from "../../lib/copy";
import { EASE } from "../../lib/motion";
import { EmptyState } from "../../components/greenhouse/EmptyState";

/* תוצאת המבחן עוברת לעמוד התוצאות דרך router state (פרק 3.3 §7) */
declare module "@tanstack/history" {
  interface HistoryState {
    quizReview?: {
      quizId: string;
      result: QuizResult;
      answers: Record<string, string>;
    };
  }
}

export const Route = createFileRoute("/quiz/$id")({
  component: QuizRoute,
});

function QuizRoute() {
  // עמוד התוצאות מקונן תחת הנתיב הזה — כשהוא פעיל מציגים אותו בלבד
  const children = useChildMatches();
  if (children.length > 0) return <Outlet />;
  return <QuizPage />;
}

function QuizPage() {
  const { id } = useParams({ from: "/quiz/$id" });
  const router = useRouter();
  const qc = useQueryClient();
  const reduced = useReducedMotion();

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

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: () => data.quizzes.submitAttempt(id, answers),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["session"] });
      qc.invalidateQueries({ queryKey: ["achievements"] });
      router.navigate({
        to: "/quiz/$id/results",
        params: { id },
        replace: true,
        state: (prev) => ({ ...prev, quizReview: { quizId: id, result, answers } }),
      });
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  /* ---------- מצב טעינה ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-[3px] w-full" style={{ background: "var(--panel-2)" }} />
        <div className="mx-auto w-full max-w-2xl px-4 py-10">
          <div className="skeleton mb-3 h-5 w-28 rounded-md" />
          <div className="skeleton mb-8 h-10 w-2/3 rounded-md" />
          <div className="skeleton h-80 rounded-xl" />
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

  /* ---------- מצב ריק ---------- */
  if (!quiz || quiz.questions.length === 0) {
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

  /* ---------- תוכן ---------- */
  const total = quiz.questions.length;
  const question = quiz.questions[idx];
  const chosen = answers[question.id];
  const isLast = idx === total - 1;
  const pct = Math.round(((idx + 1) / total) * 100);
  const slide = reduced ? 0 : 36;

  function goNext() {
    if (idx >= total - 1) return;
    setDir(1);
    setIdx((i) => i + 1);
  }
  function goBack() {
    if (idx === 0) return;
    setDir(-1);
    setIdx((i) => i - 1);
  }

  return (
    <div className="min-h-screen">
      {/* פס התקדמות עליון + סרגל */}
      <div className="sticky top-0 z-30">
        <div className="h-[3px] w-full" style={{ background: "var(--panel-2)" }}>
          <motion.div
            className="h-full"
            style={{ background: "var(--grad-gold)" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <div className="glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5">
          {course ? (
            <Link
              to="/courses/$slug"
              params={{ slug: course.slug }}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent"
              aria-label="יציאה מהמבחן וחזרה לקורס"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">יציאה מהמבחן</span>
            </Link>
          ) : (
            <Link
              to="/courses"
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent"
              aria-label="יציאה מהמבחן"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">יציאה מהמבחן</span>
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-small text-ink">{quiz.title}</div>
          </div>
          <span className="font-mono text-[11px] tabular text-muted">
            שאלה {idx + 1} מתוך {total}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <span className="label-mono">מבחן ידע</span>
        <h1 className="mt-1 text-h1 text-ink">{quiz.title}</h1>
        <p className="mt-2 text-small text-muted">
          סף מעבר: {quiz.passScore}. אפשר לחזור אחורה ולשנות תשובות עד ההגשה.
        </p>

        {/* כרטיס שאלה — אחד בכל רגע */}
        <div className="mt-8">
          {/* בלי mode="wait" — exit תקוע חוסם את השאלה הבאה (motion v12 + reduced-motion) */}
          <AnimatePresence initial={false}>
            <motion.section
              key={question.id}
              initial={{ opacity: 0, x: dir * -slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * slide }}
              transition={{ duration: 0.35, ease: EASE }}
              className="surface-card p-6 md:p-8"
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px]"
                  style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="text-h2 text-ink">{question.prompt}</h2>
              </div>

              <div role="radiogroup" aria-label={question.prompt} className="mt-6 space-y-3">
                {question.options.map((o) => {
                  const selected = chosen === o.id;
                  return (
                    <button
                      key={o.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAnswers((a) => ({ ...a, [question.id]: o.id }))}
                      className="flex w-full items-center gap-3 rounded-lg border p-4 text-start transition-all"
                      style={{
                        borderColor: selected ? "var(--accent)" : "var(--line)",
                        background: selected ? "var(--accent-faint)" : "var(--bg-2)",
                      }}
                    >
                      <span
                        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border"
                        style={{ borderColor: selected ? "var(--accent)" : "var(--muted-2)" }}
                        aria-hidden="true"
                      >
                        {selected && (
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: "var(--accent)" }}
                          />
                        )}
                      </span>
                      <span
                        className="text-body"
                        style={{ color: selected ? "var(--ink)" : "var(--ink-2)" }}
                      >
                        {o.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* ניווט בין שאלות */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={goBack}
            disabled={idx === 0 || submit.isPending}
            className="btn-ghost inline-flex items-center gap-2 text-small disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
            הקודמת
          </button>
          {isLast ? (
            <button
              onClick={() => submit.mutate()}
              disabled={!chosen || submit.isPending}
              className="btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50"
            >
              <ClipboardCheck className="h-4 w-4" />
              {submit.isPending ? "בודקים את התשובות..." : "הגשת המבחן"}
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!chosen}
              className="btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50"
            >
              הבאה
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {submit.isError && (
          <p className="mt-3 text-end text-small" style={{ color: "var(--danger)" }}>
            ההגשה לא נשמרה — נסה שוב.
          </p>
        )}

        {/* חיווי שאלות שנענו */}
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {quiz.questions.map((q, i) => {
            const answered = !!answers[q.id];
            const isCurrent = i === idx;
            return (
              <span
                key={q.id}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: isCurrent ? 22 : 8,
                  background: answered
                    ? "var(--grad-gold)"
                    : isCurrent
                      ? "var(--muted-2)"
                      : "var(--line)",
                }}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
