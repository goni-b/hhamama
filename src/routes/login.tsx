// src/routes/login.tsx — כניסה (פרק 3.3 §1). split-screen, RHF+zod, רגע WOW.
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AmbientBackground } from "../components/greenhouse/AmbientBackground";
import { Logo } from "../components/brand/Logo";
import { EASE } from "../lib/motion";
import { copy } from "../lib/copy";
import { data, DataError } from "../lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "צריך גם סיסמה"),
});
type FormValues = z.infer<typeof schema>;

const QUOTES = [
  "המקום היחיד שבו לא נשארתי לבד עם השיווק של העסק.",
  "כל בוקר אני נכנסת לחמש דקות — וזה מה ששינה הכל.",
  "לא עוד קורס. קהילה שבאמת רואה אותך גדל.",
];

function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const signIn = useMutation({
    mutationFn: (v: FormValues) => data.auth.signIn(v.email, v.password),
    onSuccess: async (profile) => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      // רגע WOW — ברכה קצרה ואז ניתוב לפי מצב המשתמש
      setWelcomeName(profile.fullName.split(" ")[0]);
      setTimeout(() => {
        if (profile.mustResetPassword) router.navigate({ to: "/auth/reset-password" });
        else if (!profile.onboardingCompleted) router.navigate({ to: "/welcome" });
        else router.navigate({ to: "/" });
      }, 1200);
    },
    onError: (err) => {
      const msg =
        err instanceof DataError && err.code === "invalid_credentials"
          ? "אימייל או סיסמה שגויים"
          : copy["error.generic"];
      toast.error(msg);
    },
  });

  if (welcomeName) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <AmbientBackground />
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Logo variant="mark" size={80} animated />
          <h1 className="text-display gold-text">שלום, {welcomeName}</h1>
          <span className="label-mono">נכנסים לחממה...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      <AmbientBackground />

      {/* פאנל מותג (שמאל desktop / hero עליון mobile) */}
      <aside className="relative flex items-center justify-center overflow-hidden border-b border-line bg-bg-2 px-8 py-10 md:order-2 md:w-[45%] md:border-b-0 md:border-s md:py-0">
        <div className="relative z-10 max-w-sm text-center">
          <div className="mb-6 flex justify-center">
            <Logo variant="mark" size={64} animated />
          </div>
          <p className="text-body-lg text-ink-2">{QUOTES[0]}</p>
        </div>
      </aside>

      {/* טופס */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 md:order-1">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="mb-8">
            <Logo variant="wordmark" />
            <h1 className="mt-6 text-h1 text-ink">{copy["auth.loginTitle"]}</h1>
            <p className="mt-2 text-small text-muted">המקום הקבוע שלך לצמוח. הזן את פרטי הכניסה.</p>
          </div>

          <form
            onSubmit={form.handleSubmit((v) => signIn.mutate(v))}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-small text-ink-2">
                אימייל
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="noa@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="mt-1.5 text-small text-danger">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-small text-ink-2">
                  סיסמה
                </label>
                <ForgotPasswordDialog />
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="הסיסמה שלך"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="mt-1.5 text-small text-danger">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={signIn.isPending}
              className="btn-primary w-full disabled:opacity-60"
            >
              {signIn.isPending ? "רגע..." : copy["auth.loginCta"]}
            </button>
          </form>

          <div className="mt-8 space-y-2 text-center text-small text-muted">
            <p>
              להדגמה: <span className="font-mono text-ink-2">noa@example.com</span> (חברה קיימת) או{" "}
              <span className="font-mono text-ink-2">new@example.com</span> (זרימת קליטה מלאה) — כל
              סיסמה.
            </p>
            <a
              href="/auth/staff"
              className="inline-block text-muted transition-colors hover:text-accent"
            >
              כניסת צוות
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ForgotPasswordDialog() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-small text-muted transition-colors hover:text-accent">
          שכחתי סיסמה
        </button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>איפוס סיסמה</DialogTitle>
          <DialogDescription>
            נשלח אליך קישור לאיפוס. הזן את האימייל שאיתו נרשמת לחממה.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <p className="text-small text-success">אם הכתובת קיימת בחממה — הקישור בדרך אליך.</p>
        ) : (
          <Input
            type="email"
            placeholder="האימייל שלך"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <DialogFooter>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => setSent(true)}
            disabled={sent}
          >
            {sent ? "נשלח" : "שליחת קישור איפוס"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
