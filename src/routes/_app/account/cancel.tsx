// src/routes/_app/account/cancel.tsx — מסע ביטול מכבד, 4 שלבים (פרק 2.12 + 3.3 §14)
// הסדר הקנוני: נכסים ← סקר סיבה ← הצעת הצלה אחת ממוקדת ← אישור. בלי dark patterns.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Award,
  BadgePercent,
  CalendarClock,
  Check,
  DoorOpen,
  PauseCircle,
  Sprout,
} from "lucide-react";
import { data } from "../../../lib/data";
import { copy } from "../../../lib/copy";
import { tierByStage, tierName, tierProgress } from "../../../lib/data/types";
import { EASE, staggerContainer, revealUp, useGatedVariants } from "../../../lib/motion";
import { useSession } from "../../../hooks/useSession";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import { XPBar } from "../../../components/greenhouse/XPBar";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Checkbox } from "../../../components/ui/checkbox";

export const Route = createFileRoute("/_app/account/cancel")({
  component: CancelPage,
});

type Reason = "no_time" | "too_expensive" | "not_found" | "finished" | "other";

const REASONS: { id: Reason; label: string }[] = [
  { id: "no_time", label: "אין לי זמן כרגע" },
  { id: "too_expensive", label: "יקר לי מדי" },
  { id: "not_found", label: "לא מצאתי את מה שחיפשתי" },
  { id: "finished", label: "סיימתי את מה שבאתי ללמוד" },
  { id: "other", label: "אחר" },
];

const STEP_LABELS = ["מה בנית", "הסיבה", "הצעה", "אישור"];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/* להבת-עלה חיה שמהבהבת לכבות — רגש, לא אשמה (רגע ה-WOW של שלב 1) */
function LeafFlame({ size = 44 }: { size?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transformOrigin: "50% 90%" }}
      animate={
        reduced ? undefined : { opacity: [1, 0.45, 0.9, 0.55, 1], scale: [1, 0.96, 1.02, 0.97, 1] }
      }
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M12 3 C7 8 6 12 8 16 C9.2 18.4 11 19.5 12 21 C13 19.5 14.8 18.4 16 16 C18 12 17 8 12 3Z"
        fill="var(--accent)"
      />
      <path
        d="M12 8 C10.5 11 10.5 14 12 18"
        stroke="var(--bg)"
        strokeWidth="1"
        opacity="0.4"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="שלבי תהליך הביטול">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] tabular"
              aria-current={active ? "step" : undefined}
              style={{
                borderColor: done || active ? "var(--accent)" : "var(--line)",
                background: done
                  ? "var(--grad-gold)"
                  : active
                    ? "var(--accent-faint)"
                    : "transparent",
                color: done ? "#1a1206" : active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : step}
            </span>
            <span
              className="hidden text-small sm:block"
              style={{ color: active ? "var(--ink)" : "var(--muted)" }}
            >
              {label}
            </span>
            {step < STEP_LABELS.length && (
              <span
                className="h-px flex-1"
                style={{ background: done ? "var(--accent-border)" : "var(--line)" }}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CancelPage() {
  const { profile } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const gated = useGatedVariants(revealUp);

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<Reason | null>(null);
  const [freeText, setFreeText] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [done, setDone] = useState(false);

  const subQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: () => data.account.getSubscription(),
  });
  const streakQuery = useQuery({
    queryKey: ["streak"],
    queryFn: () => data.gamification.getStreak(),
  });
  const achievementsQuery = useQuery({
    queryKey: ["achievements"],
    queryFn: () => data.gamification.getAchievements(),
  });

  const surveyInput = () => ({
    reason: reason ?? "other",
    freeText: freeText.trim() || undefined,
  });

  const acceptPause = useMutation({
    mutationFn: async () => {
      await data.account.submitCancellationSurvey(surveyInput());
      await data.account.pauseSubscription();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("המנוי הושהה ל-30 יום. הכול נשמר — מחכים לך כאן.");
      navigate({ to: "/account" });
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  const acceptDiscount = useMutation({
    mutationFn: async () => {
      await data.account.submitCancellationSurvey(surveyInput());
      await data.account.acceptDiscount();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
      toast.success("ההנחה הופעלה. 3 החודשים הקרובים ב-30% הנחה.");
      navigate({ to: "/account" });
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  const confirmCancel = useMutation({
    mutationFn: async () => {
      await data.account.submitCancellationSurvey(surveyInput());
      await data.account.cancelSubscription();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
      setDone(true);
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  /* ---------- מצבי עמוד ---------- */

  if (subQuery.isLoading || streakQuery.isLoading || achievementsQuery.isLoading || !profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="skeleton mb-8 h-10 w-64 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
        <div className="skeleton mt-6 h-12 rounded-lg" />
      </div>
    );
  }

  if (subQuery.isError || !subQuery.data) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="משהו השתבש"
            description={copy["error.generic"]}
            action={
              <button onClick={() => subQuery.refetch()} className="btn-secondary text-small">
                נסה שוב
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const sub = subQuery.data;
  const endDate = fmtDate(sub.currentPeriodEnd);

  /* מסך "דלת פתוחה" — אחרי ביטול (מסך 4, סיום מכבד) */
  if (done) {
    return (
      <div className="mx-auto max-w-xl">
        <motion.div
          className="surface-card p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <DoorOpen className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
          <h1 className="mt-5 text-h1 text-ink">המנוי בוטל. הדלת נשארת פתוחה.</h1>
          <p className="mt-3 text-body text-ink-2">
            הגישה שלך פתוחה עד{" "}
            <span className="font-mono text-[14px] tabular text-ink">{endDate}</span>. לא יהיה חיוב
            נוסף.
          </p>
          <p className="mt-2 text-small text-muted">
            אם תחזרי תוך 12 חודשים — הנקודות, ההישגים והרצף הטוב ביותר שלך נשמרים בדיוק כאן.
          </p>
          <Link to="/" className="btn-primary mt-7 inline-block text-small">
            חזרה לחממה
          </Link>
        </motion.div>
      </div>
    );
  }

  /* מנוי שכבר בוטל — אין תהליך לחזור עליו */
  if (sub.status === "canceled") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="המנוי כבר בוטל"
            description={`הגישה שלך פתוחה עד ${endDate}. אם תחזרי תוך 12 חודשים — הכול נשמר.`}
            action={
              <Link to="/account" className="btn-secondary text-small">
                חזרה לחשבון
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const streak = streakQuery.data ?? {
    days: profile.streakDays,
    best: profile.streakBest,
    freezes: 0,
    lastActiveDate: "",
  };
  const unlockedCount = (achievementsQuery.data ?? []).filter((a) => a.unlockedAt).length;
  const { toNext, nextStage, nextName } = tierProgress(profile.xpTotal);
  const nextPerk = nextStage ? tierByStage(nextStage).perk : null;

  /* ההצעה הממוקדת — אחת בלבד, לפי הסיבה (פרק 2.12 מסך 3) */
  const offer: "pause" | "discount" =
    reason === "too_expensive" && !sub.discountUsed ? "discount" : "pause";

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/account"
        className="mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        החשבון שלי
      </Link>

      <div className="mb-6">
        <span className="label-mono">ביטול מנוי</span>
      </div>

      <Stepper current={step} />

      {/* בלי mode="wait": ילדי השלב היוצא מונעים מה-exit להסתיים ותוקעים את המעבר */}
      <AnimatePresence initial={false}>
        {/* ---------- שלב 1: מה בנית — ומה מחכה לך ---------- */}
        {step === 1 && (
          <motion.section
            key="step-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="text-h1 text-ink">לפני שממשיכים — זה מה שצברת בחממה</h1>
            <p className="mt-2 text-body text-ink-2">מה בנית, ומה מחכה לך אם נשארים.</p>

            <motion.div
              className="mt-6 grid gap-4 sm:grid-cols-2"
              variants={staggerContainer(0.07)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={gated} className="surface-card p-5">
                <span className="label-mono">נקודות צמיחה</span>
                <p className="display-latin mt-2 text-[32px] font-bold tabular text-ink">
                  {profile.xpTotal.toLocaleString("en-US")}
                </p>
                <p className="mt-1 text-small text-ink-2">דרגת {tierName(profile.growthStage)}</p>
              </motion.div>

              <motion.div variants={gated} className="surface-card p-5">
                <span className="label-mono">רצף השקיה</span>
                <div className="mt-2 flex items-center gap-3">
                  <LeafFlame />
                  <div>
                    <p className="display-latin text-[32px] font-bold tabular text-ink">
                      {streak.days}
                    </p>
                    <p className="text-small text-muted">ימים רצופים · השיא שלך: {streak.best}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={gated} className="surface-card p-5">
                <span className="label-mono">הישגים</span>
                <div className="mt-2 flex items-center gap-3">
                  <Award className="h-8 w-8 text-accent" aria-hidden="true" />
                  <p className="display-latin text-[32px] font-bold tabular text-ink">
                    {unlockedCount}
                  </p>
                </div>
                <p className="mt-1 text-small text-ink-2">הישגים שנפתחו — וכולם נשמרים לך.</p>
              </motion.div>

              <motion.div variants={gated} className="surface-card p-5">
                <span className="label-mono">את במרחק נגיעה</span>
                <div className="mt-3">
                  <XPBar xp={profile.xpTotal} showLabels={false} />
                </div>
                {nextName && nextPerk ? (
                  <p className="mt-3 text-small text-ink-2">
                    עוד{" "}
                    <span className="font-mono text-[13px] tabular text-accent">
                      {toNext.toLocaleString("en-US")}
                    </span>{" "}
                    נקודות ואת בדרגת {nextName}: {nextPerk}.
                  </p>
                ) : (
                  <p className="mt-3 text-small text-ink-2">
                    הגעת לדרגה הגבוהה ביותר — מצמיחה. זה שלך לתמיד.
                  </p>
                )}
              </motion.div>
            </motion.div>

            <p className="mt-6 text-small text-muted">
              עם הביטול, הגישה תיסגר ב-{endDate}. הנתונים נשמרים 12 חודשים למקרה שתחזרי.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate({ to: "/account" })}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Sprout className="h-4 w-4" aria-hidden="true" />
                נשארת בחממה
              </button>
              {/* עובד מקליק ראשון — בלי dark patterns */}
              <button onClick={() => setStep(2)} className="btn-secondary text-small">
                המשך בתהליך הביטול
              </button>
            </div>
          </motion.section>
        )}

        {/* ---------- שלב 2: סקר סיבה — בחירה אחת חובה ---------- */}
        {step === 2 && (
          <motion.section
            key="step-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <h1 className="text-h1 text-ink">מה הסיבה העיקרית?</h1>
            <p className="mt-2 text-body text-ink-2">בחירה אחת — זה עוזר לנו להשתפר באמת.</p>

            <RadioGroup
              dir="rtl"
              className="mt-6 gap-2.5"
              value={reason ?? ""}
              onValueChange={(v) => setReason(v as Reason)}
            >
              {REASONS.map((r) => (
                <label
                  key={r.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors"
                  style={{
                    borderColor: reason === r.id ? "var(--accent)" : "var(--line)",
                    background: reason === r.id ? "var(--accent-faint)" : "transparent",
                  }}
                >
                  <RadioGroupItem value={r.id} />
                  <span className="text-body text-ink">{r.label}</span>
                </label>
              ))}
            </RadioGroup>

            {reason === "other" && (
              <textarea
                autoFocus
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="נקרא כל מילה"
                className="mt-4 min-h-[90px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
              />
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setStep(3)}
                disabled={!reason}
                className="btn-primary text-small disabled:opacity-50"
              >
                המשך
              </button>
              <button onClick={() => setStep(1)} className="btn-ghost text-small">
                חזרה
              </button>
            </div>
          </motion.section>
        )}

        {/* ---------- שלב 3: הצעת הצלה אחת, ממוקדת ---------- */}
        {step === 3 && (
          <motion.section
            key="step-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mx-auto max-w-xl">
              {offer === "discount" ? (
                <div className="surface-card p-8 text-center">
                  <BadgePercent className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
                  <h1 className="mt-4 text-h2 text-ink">נשארים — בתנאים אחרים</h1>
                  <p className="mt-3 text-body text-ink-2">3 החודשים הקרובים ב-30% הנחה.</p>
                  <p className="mt-1.5 text-small text-muted">
                    הטבה חד-פעמית לחשבון. מופעלת מיד, בלי טפסים.
                  </p>
                  <button
                    onClick={() => acceptDiscount.mutate()}
                    disabled={acceptDiscount.isPending}
                    className="btn-primary mt-6 text-small disabled:opacity-60"
                  >
                    {acceptDiscount.isPending ? "רגע..." : "הפעלת ההנחה"}
                  </button>
                </div>
              ) : (
                <div className="surface-card p-8 text-center">
                  <PauseCircle className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
                  <h1 className="mt-4 text-h2 text-ink">צריכה הפסקה? ניקח אותה יחד</h1>
                  <p className="mt-3 text-body text-ink-2">
                    מקפיאים לך את המנוי ל-30 יום — בלי חיוב, הכול נשמר, הרצף מוגן.
                  </p>
                  <p className="mt-1.5 text-small text-muted">
                    החידוש מתוזמן אוטומטית, ונזכיר לך שלושה ימים לפני.
                  </p>
                  <button
                    onClick={() => acceptPause.mutate()}
                    disabled={acceptPause.isPending}
                    className="btn-primary mt-6 text-small disabled:opacity-60"
                  >
                    {acceptPause.isPending ? "רגע..." : "השהיית המנוי ל-30 יום"}
                  </button>
                </div>
              )}

              <div className="mt-5 flex flex-col items-center gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="text-small text-muted underline underline-offset-4 transition-colors hover:text-ink"
                >
                  לא, אני רוצה לבטל
                </button>
                <button onClick={() => setStep(2)} className="btn-ghost text-small">
                  חזרה
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* ---------- שלב 4: אישור וסיום מכבד ---------- */}
        {step === 4 && (
          <motion.section
            key="step-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="mx-auto max-w-xl">
              <h1 className="text-h1 text-ink">אישור אחרון — בקצב שלך</h1>
              <p className="mt-2 text-body text-ink-2">מה בדיוק קורה, ומתי.</p>

              <div className="surface-card mt-6 p-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CalendarClock
                      className="mt-0.5 h-5 w-5 shrink-0 text-ink-2"
                      aria-hidden="true"
                    />
                    <p className="text-body text-ink-2">
                      הגישה שלך נשארת פתוחה עד{" "}
                      <span className="font-mono text-[14px] tabular text-ink">{endDate}</span> — עד
                      סוף התקופה ששולמה. לא יהיה חיוב נוסף.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sprout className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" aria-hidden="true" />
                    <p className="text-body text-ink-2">
                      אם תחזרי תוך 12 חודשים — הנקודות, ההישגים והרצף הטוב ביותר שלך נשמרים.
                    </p>
                  </li>
                </ul>

                <label className="mt-6 flex cursor-pointer items-center gap-3 border-t border-line-soft pt-5">
                  <Checkbox
                    checked={confirmChecked}
                    onCheckedChange={(v) => setConfirmChecked(v === true)}
                  />
                  <span className="text-small text-ink-2">
                    הבנתי — הגישה תיסגר ב-{endDate}, ואפשר לחזור מתי שרוצים.
                  </span>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => confirmCancel.mutate()}
                  disabled={!confirmChecked || confirmCancel.isPending}
                  className="px-5 py-2.5 font-semibold transition-opacity disabled:opacity-50"
                  style={{
                    borderRadius: "var(--radius-md)",
                    color: "var(--danger)",
                    border: "1px solid color-mix(in srgb, var(--danger) 45%, transparent)",
                    background: "color-mix(in srgb, var(--danger) 10%, transparent)",
                  }}
                >
                  {confirmCancel.isPending ? "רגע..." : "ביטול המנוי"}
                </button>
                <button
                  onClick={() => navigate({ to: "/account" })}
                  className="btn-secondary text-small"
                >
                  נשארת בחממה
                </button>
                <button onClick={() => setStep(3)} className="btn-ghost text-small">
                  חזרה
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
