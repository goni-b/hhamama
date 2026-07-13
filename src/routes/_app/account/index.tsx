// src/routes/_app/account/index.tsx — החשבון שלי (פרק 3.3 §14)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Bell, CreditCard, RefreshCw, SlidersHorizontal, UserRound } from "lucide-react";
import { data } from "../../../lib/data";
import { copy } from "../../../lib/copy";
import {
  tierName,
  tierProgress,
  type AccountPreferences,
  type Profile,
  type SubscriptionStatus,
} from "../../../lib/data/types";
import { EASE } from "../../../lib/motion";
import { useSession } from "../../../hooks/useSession";
import { GrowthRing } from "../../../components/greenhouse/GrowthRing";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Switch } from "../../../components/ui/switch";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/_app/account/")({
  component: AccountPage,
});

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="surface-card">
      <EmptyState
        title="משהו השתבש"
        description={copy["error.generic"]}
        icon={<RefreshCw className="h-10 w-10 text-muted" aria-hidden="true" />}
        action={
          <button onClick={onRetry} className="btn-secondary text-small">
            נסה שוב
          </button>
        }
      />
    </div>
  );
}

function AccountPage() {
  const { profile, isLoading } = useSession();

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="skeleton mb-6 h-12 w-56 rounded-lg" />
        <div className="skeleton mb-4 h-11 rounded-lg" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-6">
        <span className="ghost-number" aria-hidden="true">
          09
        </span>
        <span className="label-mono">החשבון שלי</span>
        <h1 className="mt-1 text-h1 text-ink">הפינה השקטה שלך</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Tabs defaultValue="profile" dir="rtl">
          <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-line bg-bg-2 p-1">
            <TabsTrigger
              value="profile"
              className="gap-2 px-4 py-2 text-small data-[state=active]:text-accent"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              פרטים אישיים
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="gap-2 px-4 py-2 text-small data-[state=active]:text-accent"
            >
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              מנוי
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="gap-2 px-4 py-2 text-small data-[state=active]:text-accent"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              העדפות התראות
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="gap-2 px-4 py-2 text-small data-[state=active]:text-accent"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              העדפות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab profile={profile} />
          </TabsContent>
          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

/* ---------- טאב 1: פרטים אישיים ---------- */

const profileSchema = z.object({
  fullName: z.string().min(2, "שם קצר מדי").max(60, "עד 60 תווים"),
  username: z
    .string()
    .min(3, "לפחות 3 תווים")
    .max(24, "עד 24 תווים")
    .regex(/^[a-z0-9-]+$/, "אותיות לטיניות קטנות, ספרות ומקפים בלבד"),
  bio: z.string().max(280, "עד 280 תווים"),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileTab({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  const { progress } = tierProgress(profile.xpTotal);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      username: profile.username,
      bio: profile.bio ?? "",
    },
  });

  const save = useMutation({
    mutationFn: (v: ProfileFormValues) =>
      data.profiles.updateMe({ fullName: v.fullName, username: v.username, bio: v.bio }),
    onSuccess: async (updated) => {
      form.reset({
        fullName: updated.fullName,
        username: updated.username,
        bio: updated.bio ?? "",
      });
      await qc.invalidateQueries({ queryKey: ["session"] });
      toast.success(copy["success.profileSaved"]);
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-center gap-4">
        <GrowthRing
          size="md"
          tier={profile.growthStage}
          progress={progress}
          src={profile.avatarUrl}
          name={profile.fullName}
        />
        <div>
          <p className="text-h3 text-ink">{profile.fullName}</p>
          <p className="text-small text-muted">
            דרגת {tierName(profile.growthStage)} ·{" "}
            <span className="font-mono text-[12px] tabular">{profile.email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4" noValidate>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-small text-ink-2">
            שם מלא
          </label>
          <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
          {form.formState.errors.fullName && (
            <p className="mt-1.5 text-small text-danger">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-small text-ink-2">
            שם משתמש
          </label>
          <Input
            id="username"
            className="ltr-field font-mono"
            autoComplete="off"
            {...form.register("username")}
          />
          <p className="mt-1.5 text-small text-muted">
            הכתובת של הפרופיל הציבורי שלך: /profile/{form.watch("username")}
          </p>
          {form.formState.errors.username && (
            <p className="mt-1.5 text-small text-danger">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="mb-1.5 block text-small text-ink-2">
            כמה מילים עליך
          </label>
          <textarea
            id="bio"
            placeholder="מה העסק שלך, ולאן הוא צומח?"
            className="min-h-[90px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
            {...form.register("bio")}
          />
          {form.formState.errors.bio && (
            <p className="mt-1.5 text-small text-danger">{form.formState.errors.bio.message}</p>
          )}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={save.isPending || !form.formState.isDirty}
            className="btn-primary text-small disabled:opacity-50"
          >
            {save.isPending ? "רגע..." : "שמירת השינויים"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- טאב 2: מנוי ---------- */

const STATUS_META: Record<SubscriptionStatus, { label: string; color: string }> = {
  active: { label: "פעיל", color: "var(--success)" },
  paused: { label: "מושהה", color: "var(--warning)" },
  canceled: { label: "בוטל", color: "var(--danger)" },
};

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[12px] font-medium"
      style={{
        color: meta.color,
        borderColor: `color-mix(in srgb, ${meta.color} 35%, transparent)`,
        background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
      }}
    >
      {meta.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line-soft py-3 last:border-b-0">
      <span className="text-small text-muted">{label}</span>
      <span className="font-mono text-[13px] tabular text-ink-2">{value}</span>
    </div>
  );
}

function SubscriptionTab() {
  const {
    data: sub,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => data.account.getSubscription(),
  });

  if (isLoading) return <div className="skeleton h-72 rounded-xl" />;
  if (isError) return <ErrorCard onRetry={() => refetch()} />;
  if (!sub) {
    return (
      <div className="surface-card">
        <EmptyState title="לא נמצא מנוי" description="אם זו טעות — דברו איתנו ונסדר את זה." />
      </div>
    );
  }

  return (
    <div className="surface-card p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="label-mono">התוכנית שלך</span>
        <StatusBadge status={sub.status} />
      </div>
      <h2 className="text-h2 text-ink">{sub.planName}</h2>

      <div className="mt-5">
        {sub.status === "active" && (
          <InfoRow label="החיוב הבא" value={fmtDate(sub.currentPeriodEnd)} />
        )}
        {sub.status === "paused" && (
          <>
            <InfoRow
              label="המנוי מושהה עד"
              value={sub.pausedUntil ? fmtDate(sub.pausedUntil) : "—"}
            />
            <InfoRow label="חידוש" value="אוטומטי, בלי לעשות כלום" />
          </>
        )}
        {sub.status === "canceled" && (
          <InfoRow label="הגישה פתוחה עד" value={fmtDate(sub.currentPeriodEnd)} />
        )}
        {sub.discountUsed && <InfoRow label="הטבת הנחה חד-פעמית" value="נוצלה" />}
      </div>

      {sub.status === "paused" && (
        <p className="mt-4 text-small text-muted">
          המנוי בהפסקה — בלי חיוב, והכול נשמר. הוא יתחדש אוטומטית בתאריך שלמעלה.
        </p>
      )}
      {sub.status === "canceled" && (
        <p className="mt-4 text-small text-muted">
          המנוי בוטל, אבל הדלת פתוחה — הגישה נשארת עד סוף התקופה ששולמה.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled
          title="בקרוב"
          className="btn-secondary text-small opacity-60"
        >
          עדכון אמצעי תשלום (בקרוב)
        </button>
      </div>

      {sub.status !== "canceled" && (
        <div className="mt-6 border-t border-line-soft pt-4">
          <Link
            to="/account/cancel"
            className="text-small text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            ביטול מנוי
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------- מתג העדפה משותף ---------- */

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line-soft py-4 last:border-b-0">
      <div>
        <p className="text-body text-ink">{title}</p>
        <p className="mt-0.5 text-small text-muted">{description}</p>
      </div>
      <Switch dir="ltr" checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}

function usePreferences() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["account-preferences"],
    queryFn: () => data.account.getPreferences(),
  });

  const update = useMutation({
    mutationFn: (input: Partial<AccountPreferences>) => data.account.updatePreferences(input),
    onMutate: async (input) => {
      // optimistic — המתג מגיב מיד (פרק 3.3 §14)
      await qc.cancelQueries({ queryKey: ["account-preferences"] });
      const prev = qc.getQueryData<AccountPreferences>(["account-preferences"]);
      if (prev) qc.setQueryData<AccountPreferences>(["account-preferences"], { ...prev, ...input });
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(["account-preferences"], ctx.prev);
      toast.error(copy["error.generic"]);
    },
    onSuccess: () => {
      toast.success("נשמר. ההעדפות עודכנו.");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["account-preferences"] });
      qc.invalidateQueries({ queryKey: ["session"] });
    },
  });

  return { query, update };
}

/* ---------- טאב 3: העדפות התראות ---------- */

function NotificationsTab() {
  const { query, update } = usePreferences();
  const prefs = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    );
  }
  if (query.isError) return <ErrorCard onRetry={() => query.refetch()} />;
  if (!prefs) {
    return (
      <div className="surface-card">
        <EmptyState title="ההעדפות לא נטענו" description="נסה לרענן את העמוד." />
      </div>
    );
  }

  return (
    <div className="surface-card px-6 py-2">
      <ToggleRow
        title="לייב מתקרב"
        description="תזכורת לפני כל מפגש חי שנרשמת אליו."
        checked={prefs.notifyLives}
        onChange={(v) => update.mutate({ notifyLives: v })}
      />
      <ToggleRow
        title="תגובות"
        description="כשמישהו מגיב לפוסט או לשאלה שלך בקהילה."
        checked={prefs.notifyComments}
        onChange={(v) => update.mutate({ notifyComments: v })}
      />
      <ToggleRow
        title="ריאקציות"
        description="כשחברים מסמנים לך מצמיח, מדויק או שווה זהב."
        checked={prefs.notifyReactions}
        onChange={(v) => update.mutate({ notifyReactions: v })}
      />
      <ToggleRow
        title="רצף בסכנה"
        description="תזכורת עדינה בערב, אם עוד לא הושקה היום."
        checked={prefs.notifyStreak}
        onChange={(v) => update.mutate({ notifyStreak: v })}
      />
    </div>
  );
}

/* ---------- טאב 4: העדפות ---------- */

function PreferencesTab() {
  const { query, update } = usePreferences();
  const prefs = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-32 rounded-lg" />
      </div>
    );
  }
  if (query.isError) return <ErrorCard onRetry={() => query.refetch()} />;
  if (!prefs) {
    return (
      <div className="surface-card">
        <EmptyState title="ההעדפות לא נטענו" description="נסה לרענן את העמוד." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="surface-card px-6 py-2">
        <ToggleRow
          title="מצב מיקוד"
          description="משקיט טוסטים של נקודות ומצניע את טבלת המובילים. הרצף וההתקדמות בקורס נשארים."
          checked={prefs.focusMode}
          onChange={(v) => update.mutate({ focusMode: v })}
        />
        <ToggleRow
          title="הרצף שלי נח בשישי-שבת"
          description="סוף השבוע לא שובר את רצף ההשקיה."
          checked={prefs.streakRestFriSat}
          onChange={(v) => update.mutate({ streakRestFriSat: v })}
        />
      </div>

      <div className="surface-card p-6">
        <p className="text-body text-ink">איך לפנות אלייך?</p>
        <p className="mt-0.5 text-small text-muted">
          ברכות ומשפטים אישיים ינוסחו בהתאם. אפשר לשנות בכל רגע.
        </p>
        <RadioGroup
          dir="rtl"
          className="mt-4 gap-2.5"
          value={prefs.preferredGender ?? ""}
          onValueChange={(v) => update.mutate({ preferredGender: v as "f" | "m" })}
        >
          {(
            [
              { id: "f", label: "לשון נקבה" },
              { id: "m", label: "לשון זכר" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors"
              style={{
                borderColor: prefs.preferredGender === opt.id ? "var(--accent)" : "var(--line)",
                background:
                  prefs.preferredGender === opt.id ? "var(--accent-faint)" : "transparent",
              }}
            >
              <RadioGroupItem value={opt.id} />
              <span className="text-body text-ink-2">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
