// src/routes/welcome.tsx — אשף הקליטה (פרק 3.3 §2). 4 צעדים + נביטה + 25 נקודות צמיחה.
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Target, TrendingUp, Repeat, Sparkles, Check } from "lucide-react";
import { AmbientBackground } from "../components/greenhouse/AmbientBackground";
import { Logo } from "../components/brand/Logo";
import { Slider } from "../components/ui/slider";
import { EASE } from "../lib/motion";
import { t } from "../lib/copy";
import { data } from "../lib/data";
import { useSession } from "../hooks/useSession";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
});

const GOALS = [
  { id: "business", label: "להקים עסק", icon: Target },
  { id: "revenue", label: "להגדיל הכנסה", icon: TrendingUp },
  { id: "career", label: "להחליף קריירה", icon: Repeat },
  { id: "ai", label: "ללמוד AI", icon: Sparkles },
] as const;

const INTERESTS = ["קמפיינים", "דפי נחיתה", "אוטומציות", "קופירייטינג", "AI כללי"] as const;

const STEPS = ["מה היעד?", "מה מעניין?", "כמה זמן?", "החוזה"] as const;

function WelcomePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { profile } = useSession();
  const firstName = profile?.fullName.split(" ")[0] ?? "";
  const fem = profile?.preferredGender !== "m";

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [minutes, setMinutes] = useState(150);
  const [planting, setPlanting] = useState(false);

  const finish = useMutation({
    mutationFn: () =>
      data.auth.completeOnboarding({
        goal: goal ?? "business",
        interests,
        weeklyGoalMinutes: minutes,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      toast.success(t("points.earned", { count: 25 }));
      setTimeout(() => router.navigate({ to: "/" }), 1100);
    },
  });

  const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "להקים עסק";
  const canNext = step === 0 ? !!goal : step === 1 ? interests.length > 0 : true;

  function toggleInterest(x: string) {
    setInterests((prev) => (prev.includes(x) ? prev.filter((i) => i !== x) : [...prev, x]));
  }

  function handleFinish() {
    setPlanting(true);
    setTimeout(() => finish.mutate(), 950);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <AmbientBackground />

      {planting && <GerminationOverlay name={firstName} />}

      <div className="w-full max-w-[560px]">
        <div className="mb-8 flex flex-col items-center gap-5">
          <Logo variant="mark" size={48} animated />
          {/* progress dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 28 : 8,
                  background: i <= step ? "var(--accent)" : "var(--line)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="surface-card min-h-[380px] p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {step === 0 && (
                <div>
                  <h1 className="text-h2 text-ink">
                    {firstName ? `${firstName}, מה היעד הגדול שלך?` : "מה היעד הגדול שלך?"}
                  </h1>
                  <p className="mt-1 text-small text-muted">נכוון את החממה לכיוון שהכי חשוב לך.</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {GOALS.map((g) => {
                      const Icon = g.icon;
                      const active = goal === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          className="flex flex-col items-start gap-3 rounded-lg border p-4 text-start transition-all"
                          style={{
                            borderColor: active ? "var(--accent)" : "var(--line)",
                            background: active ? "var(--accent-faint)" : "var(--bg-2)",
                          }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: active ? "var(--accent)" : "var(--ink-2)" }}
                          />
                          <span className="text-body font-medium text-ink">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h1 className="text-h2 text-ink">מה מעניין אותך ללמוד?</h1>
                  <p className="mt-1 text-small text-muted">אפשר לבחור כמה שרוצים — נתחיל מכאן.</p>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {INTERESTS.map((x) => {
                      const active = interests.includes(x);
                      return (
                        <button
                          key={x}
                          type="button"
                          onClick={() => toggleInterest(x)}
                          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-small transition-all"
                          style={{
                            borderColor: active ? "var(--accent)" : "var(--line)",
                            background: active ? "var(--accent-faint)" : "transparent",
                            color: active ? "var(--accent)" : "var(--ink-2)",
                          }}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                          {x}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="text-h2 text-ink">כמה זמן תשקיע בשבוע?</h1>
                  <p className="mt-1 text-small text-muted">
                    היעד הזה יעזור לנו לשמור אותך על הקצב שלך.
                  </p>
                  <div className="mt-10 text-center">
                    <div className="display-latin text-display gold-text">{minutes}</div>
                    <div className="label-mono mt-1">דקות בשבוע</div>
                  </div>
                  <div className="mt-8 px-2">
                    <Slider
                      value={[minutes]}
                      onValueChange={([v]) => setMinutes(v)}
                      min={30}
                      max={300}
                      step={10}
                    />
                    <div className="mt-3 flex justify-between text-small text-muted">
                      <span>צעד קטן · 60</span>
                      <span>מחויבות · 150</span>
                      <span>טורבו · 300</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="text-h2 text-ink">החוזה האישי שלך</h1>
                  <p className="mt-1 text-small text-muted">כמה מילים לעצמך — זו ההתחלה.</p>
                  <div className="mt-6 rounded-lg border border-[color:var(--accent-border)] bg-[color:var(--accent-faint)] p-6 text-center">
                    <p className="text-body-lg text-ink">
                      {fem ? "אני" : "אני"}, {firstName || "חבר/ה"}, {fem ? "מתחייבת" : "מתחייב"} ל־
                      <span className="display-latin font-bold text-accent">{minutes}</span> דקות
                      בשבוע כדי <span className="text-accent">{goalLabel}</span>.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-ghost text-small"
            style={{ visibility: step === 0 ? "hidden" : "visible" }}
          >
            חזרה
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-primary disabled:opacity-40"
            >
              המשך
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={finish.isPending || planting}
              className="btn-primary disabled:opacity-60"
            >
              נטעתי את הזרע
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GerminationOverlay({ name }: { name: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(10,8,6,0.9)" }}
    >
      <motion.svg
        width={120}
        height={120}
        viewBox="0 0 24 24"
        fill="none"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <line
          x1="4"
          y1="20"
          x2="20"
          y2="20"
          stroke="var(--accent-border)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <motion.path
          d="M12 20 V11"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        />
        <motion.path
          d="M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z"
          fill="var(--accent-faint)"
          stroke="var(--accent)"
          strokeWidth="1.3"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
          style={{ transformOrigin: "12px 11px" }}
        />
        <motion.path
          d="M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z"
          fill="var(--accent-faint)"
          stroke="var(--accent)"
          strokeWidth="1.3"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.65 }}
          style={{ transformOrigin: "12px 11px" }}
        />
      </motion.svg>
      <motion.p
        className="text-h3 gold-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {name ? `נטעת את הזרע, ${name}` : "נטעת את הזרע"}
      </motion.p>
    </div>
  );
}
