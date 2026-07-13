// src/routes/_app/notifications.tsx — מרכז ההתראות (פרק 3.3 §15)
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  Award,
  Bell,
  CheckCheck,
  CircleAlert,
  Heart,
  Info,
  MessageCircle,
  Radio,
  Sprout,
} from "lucide-react";
import { formatDistanceToNow, isToday } from "date-fns";
import { he } from "date-fns/locale";
import { data } from "../../lib/data";
import type { AppNotification } from "../../lib/data/types";
import { copy } from "../../lib/copy";
import { DUR, EASE } from "../../lib/motion";
import { EmptyState } from "../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

/* מפתח הרשימה. ה-badge בכותרת (AppShell) יושב על ["notifications", "unread"] —
   ולכן כל mutation כאן מבטל ["notifications"] כולו, כדי ששניהם יתעדכנו. */
const LIST_KEY = ["notifications", "list"] as const;

const KIND_ICON: Record<AppNotification["kind"], ComponentType<{ className?: string }>> = {
  reaction: Heart,
  comment: MessageCircle,
  level_up: Sprout,
  achievement: Award,
  live: Radio,
  system: Info,
};

const WEEK_MS = 7 * 24 * 3_600_000;

type GroupLabel = "היום" | "השבוע" | "מוקדם יותר";
const GROUP_ORDER: GroupLabel[] = ["היום", "השבוע", "מוקדם יותר"];

function groupOf(iso: string): GroupLabel {
  const d = new Date(iso);
  if (isToday(d)) return "היום";
  if (Date.now() - d.getTime() < WEEK_MS) return "השבוע";
  return "מוקדם יותר";
}

function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: he });
}

function NotificationsPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const reduced = !!useReducedMotion();
  /* מזהים שנכנסו live — מקבלים slide-in מלמעלה במקום כניסת הרשימה הרגילה */
  const [liveIds, setLiveIds] = useState<ReadonlySet<string>>(() => new Set());

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: LIST_KEY,
    queryFn: () => data.notifications.list(),
  });

  /* realtime — התראות חדשות נכנסות בזמן אמת (Supabase Realtime) */
  useEffect(() => {
    const unsubscribe = data.notifications.subscribe((n) => {
      setLiveIds((prev) => {
        const next = new Set(prev);
        next.add(n.id);
        return next;
      });
      qc.setQueryData<AppNotification[]>(LIST_KEY, (old) =>
        old ? [n, ...old.filter((x) => x.id !== n.id)] : [n],
      );
      qc.invalidateQueries({ queryKey: ["notifications", "unread"] });
    });
    return unsubscribe;
  }, [qc]);

  const markRead = useMutation({
    mutationFn: (id: string) => data.notifications.markRead(id),
    onMutate: (id: string) => {
      qc.setQueryData<AppNotification[]>(LIST_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    onError: () => toast.error(copy["error.generic"]),
    onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAll = useMutation({
    mutationFn: () => data.notifications.markAllRead(),
    onMutate: () => {
      qc.setQueryData<AppNotification[]>(LIST_KEY, (old) =>
        old?.map((n) => ({ ...n, read: true })),
      );
    },
    onSuccess: () => toast.success("סומן. הכל נקרא."),
    onError: () => toast.error(copy["error.generic"]),
    onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const open = (n: AppNotification) => {
    if (!n.read) markRead.mutate(n.id);
    if (n.href) void router.navigate({ to: n.href });
  };

  const sorted = useMemo(
    () =>
      [...(notifications ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  );
  const unreadTotal = sorted.filter((n) => !n.read).length;

  const groups = useMemo(() => {
    const byLabel = new Map<GroupLabel, AppNotification[]>();
    for (const n of sorted) {
      const label = groupOf(n.createdAt);
      const arr = byLabel.get(label);
      if (arr) arr.push(n);
      else byLabel.set(label, [n]);
    }
    return GROUP_ORDER.filter((l) => byLabel.has(l)).map((l) => ({
      label: l,
      items: byLabel.get(l) ?? [],
    }));
  }, [sorted]);

  let content: ReactNode;
  if (isLoading) {
    content = (
      <div className="space-y-3">
        <div className="skeleton h-4 w-14 rounded" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-[76px] rounded-lg" />
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="surface-card">
        <EmptyState
          icon={
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: "var(--panel-2)" }}
            >
              <CircleAlert className="h-8 w-8 text-muted" />
            </span>
          }
          title={copy["error.generic"]}
          action={
            <button onClick={() => refetch()} className="btn-secondary text-small">
              נסה שוב
            </button>
          }
        />
      </div>
    );
  } else if (sorted.length === 0) {
    content = (
      <div className="surface-card">
        <EmptyState
          icon={
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: "var(--accent-faint)" }}
            >
              <Bell className="h-8 w-8 text-accent" />
            </span>
          }
          title={copy["empty.notifications"]}
        />
      </div>
    );
  } else {
    content = (
      <div className="space-y-7">
        {groups.map((g, gi) => {
          const offset = groups.slice(0, gi).reduce((sum, x) => sum + x.items.length, 0);
          return (
            <section key={g.label} aria-label={g.label}>
              <h2 className="label-mono mb-2.5">{g.label}</h2>
              <ul className="surface-card overflow-hidden">
                {g.items.map((n, i) => (
                  <NotificationRow
                    key={n.id}
                    n={n}
                    index={offset + i}
                    live={liveIds.has(n.id)}
                    reduced={reduced}
                    onOpen={() => open(n)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="relative">
          <span className="ghost-number" aria-hidden="true">
            08
          </span>
          <span className="label-mono">התראות</span>
          <h1 className="mt-1 text-h1 text-ink">מרכז ההתראות</h1>
        </div>
        <button
          onClick={() => markAll.mutate()}
          disabled={unreadTotal === 0 || markAll.isPending}
          className="btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-50"
        >
          <CheckCheck className="h-4 w-4" />
          סמן הכל כנקרא
        </button>
      </div>

      {content}
    </div>
  );
}

function NotificationRow({
  n,
  index,
  live,
  reduced,
  onOpen,
}: {
  n: AppNotification;
  index: number;
  live: boolean;
  reduced: boolean;
  onOpen: () => void;
}) {
  const Icon = KIND_ICON[n.kind];
  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : live ? { opacity: 0, y: -18 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.01 : live ? 0.5 : DUR.enter,
        ease: EASE,
        delay: reduced || live ? 0 : Math.min(index * 0.05, 0.45),
      }}
      className="border-b border-line last:border-b-0"
    >
      <button
        onClick={onOpen}
        className="flex w-full items-start gap-3.5 px-4 py-4 text-start transition-colors hover:bg-[color:var(--panel-2)] md:px-5"
        style={
          n.read ? undefined : { background: "color-mix(in srgb, var(--accent) 5%, transparent)" }
        }
      >
        {/* אייקון סוג בעיגול זהב */}
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block text-body ${n.read ? "text-ink-2" : "font-medium text-ink"}`}>
            {n.title}
          </span>
          <span className="mt-0.5 block break-words text-small text-muted">{n.body}</span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
          <time dateTime={n.createdAt} className="font-mono text-[11px] tabular text-muted-2">
            {relativeTime(n.createdAt)}
          </time>
          {!n.read && (
            <>
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="sr-only">לא נקרא</span>
            </>
          )}
        </span>
      </button>
    </motion.li>
  );
}
