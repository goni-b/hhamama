// src/routes/auth/staff.tsx — כניסת צוות (פרק 3.1 / 5.3)
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { AmbientBackground } from "../../components/greenhouse/AmbientBackground";
import { Logo } from "../../components/brand/Logo";
import { Input } from "../../components/ui/input";
import { EASE } from "../../lib/motion";
import { copy } from "../../lib/copy";
import { data, DataError } from "../../lib/data";

export const Route = createFileRoute("/auth/staff")({
  component: StaffLoginPage,
});

const schema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "צריך גם סיסמה"),
});
type FormValues = z.infer<typeof schema>;

function StaffLoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const signIn = useMutation({
    mutationFn: (v: FormValues) => data.auth.signIn(v.email, v.password),
    onSuccess: async (profile) => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      if (profile.role === "student") {
        toast.error("הכניסה הזו מיועדת לצוות בלבד");
        return;
      }
      router.navigate({ to: "/admin" });
    },
    onError: (err) => {
      const msg =
        err instanceof DataError && err.code === "invalid_credentials"
          ? "אימייל או סיסמה שגויים"
          : copy["error.generic"];
      toast.error(msg);
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AmbientBackground />
      <motion.div
        className="glass-panel w-full max-w-[420px] rounded-2xl p-8 shadow-[var(--elev-3)]"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo variant="mark" size={52} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 label-mono">
            <Shield className="h-3.5 w-3.5" />
            כניסת צוות
          </span>
        </div>

        <form
          onSubmit={form.handleSubmit((v) => signIn.mutate(v))}
          className="space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-small text-ink-2">
              אימייל צוות
            </label>
            <Input
              id="email"
              type="email"
              placeholder="hofit@hofitgoni.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1.5 text-small text-danger">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-small text-ink-2">
              סיסמה
            </label>
            <Input id="password" type="password" {...form.register("password")} />
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
            {signIn.isPending ? "רגע..." : "כניסה לניהול"}
          </button>
        </form>

        <div className="mt-6 text-center text-small text-muted">
          <a href="/login" className="transition-colors hover:text-accent">
            חזרה לכניסת חברים
          </a>
        </div>
      </motion.div>
    </div>
  );
}
