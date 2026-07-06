// src/routes/auth/reset-password.tsx — איפוס סיסמה כפוי בכניסה ראשונה (פרק 3.3 / 5.3)
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AmbientBackground } from "../../components/greenhouse/AmbientBackground";
import { Logo } from "../../components/brand/Logo";
import { Input } from "../../components/ui/input";
import { EASE } from "../../lib/motion";
import { copy } from "../../lib/copy";
import { data } from "../../lib/data";
import { useSession } from "../../hooks/useSession";

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "לפחות 8 תווים"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "הסיסמאות לא זהות",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

function ResetPasswordPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { profile } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const submit = useMutation({
    mutationFn: (v: FormValues) => data.auth.updatePassword(v.password),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["session"] });
      const fresh = await data.auth.getSession();
      if (fresh && !fresh.onboardingCompleted) router.navigate({ to: "/welcome" });
      else router.navigate({ to: "/" });
    },
    onError: () => toast.error(copy["error.generic"]),
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
        <div className="mb-6 flex justify-center">
          <Logo variant="mark" size={56} />
        </div>
        <h1 className="text-center text-h3 text-ink">
          {profile ? `עוד רגע בפנים, ${profile.fullName.split(" ")[0]}` : "בחירת סיסמה חדשה"}
        </h1>
        <p className="mt-2 text-center text-small text-muted">
          בחר סיסמה קבועה שתחליף את הסיסמה הזמנית.
        </p>

        <form
          onSubmit={form.handleSubmit((v) => submit.mutate(v))}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="pw" className="mb-1.5 block text-small text-ink-2">
              סיסמה חדשה
            </label>
            <Input
              id="pw"
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="mt-1.5 text-small text-danger">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="pw2" className="mb-1.5 block text-small text-ink-2">
              אימות סיסמה
            </label>
            <Input
              id="pw2"
              type="password"
              autoComplete="new-password"
              {...form.register("confirm")}
            />
            {form.formState.errors.confirm && (
              <p className="mt-1.5 text-small text-danger">
                {form.formState.errors.confirm.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submit.isPending}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submit.isPending ? "רגע..." : "שמירה והמשך"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
