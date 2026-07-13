// src/routes/_app/events/index.tsx — לייבים ואירועים (פרק 3.3 §10, פרק 2.9)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarDays, Check, CircleAlert, Clock, Mic, Play, Radio } from "lucide-react";
import { data } from "../../../lib/data";
import { copy } from "../../../lib/copy";
import { EASE, revealUp, staggerContainer, useGatedVariants } from "../../../lib/motion";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import type { LiveEvent } from "../../../lib/data/types";

export const Route = createFileRoute("/_app/events/")({
  component: EventsPage,
});

const EVENTS_KEY = ["events"] as const;

/* ---------- עיצוב תאריך בעברית ---------- */
function fmtDay(iso: string) {
  return format(new Date(iso), "EEEE, d בMMMM", { locale: he });
}
function fmtTime(iso: string) {
  return format(new Date(iso), "HH:mm", { locale: he });
}

/* ---------- תג "שידור חי" — נקודה פועמת ---------- */
function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium"
      style={{
        borderColor: "color-mix(in srgb, var(--danger) 45%, transparent)",
        background: "color-mix(in srgb, var(--danger) 10%, transparent)",
        color: "var(--danger)",
      }}
    >
      <span
        className="animate-pulse-dot h-2 w-2 rounded-full"
        style={{ background: "var(--danger)" }}
        aria-hidden="true"
      />
      שידור חי
    </span>
  );
}

/* ---------- כפתור שריון מקום ↔ "רשומה" ---------- */
function RsvpButton({
  event,
  onRsvp,
  pending,
  compact = false,
}: {
  event: LiveEvent;
  onRsvp: (id: string) => void;
  pending: boolean;
  compact?: boolean;
}) {
  if (event.isRegistered) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-small font-medium"
        style={{
          borderColor: "var(--accent-border)",
          background: "var(--accent-faint)",
          color: "var(--accent)",
        }}
      >
        <Check className="h-4 w-4" />
        רשומה
      </span>
    );
  }
  return (
    <button
      onClick={() => onRsvp(event.id)}
      disabled={pending}
      className={
        compact
          ? "btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-50"
          : "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50"
      }
    >
      <CalendarDays className="h-4 w-4" />
      שריין מקום
    </button>
  );
}

/* ---------- ריבוע תאריך Mono ---------- */
function DateSquare({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <span
      className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border"
      style={{ borderColor: "var(--line)", background: "var(--panel-2)" }}
    >
      <span className="font-mono text-[18px] leading-none tabular text-ink">
        {format(d, "d", { locale: he })}
      </span>
      <span className="mt-1 text-micro text-muted">{format(d, "MMM", { locale: he })}</span>
    </span>
  );
}

function EventsPage() {
  const qc = useQueryClient();
  const gated = useGatedVariants(revealUp);

  const {
    data: events,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: EVENTS_KEY,
    queryFn: () => data.events.list(),
  });

  /* שריון מקום — optimistic: הכפתור הופך ל"רשומה" מיד */
  const rsvp = useMutation({
    mutationFn: (eventId: string) => data.events.rsvp(eventId),
    onMutate: async (eventId) => {
      await qc.cancelQueries({ queryKey: EVENTS_KEY });
      const prev = qc.getQueryData<LiveEvent[]>(EVENTS_KEY);
      qc.setQueryData<LiveEvent[]>(EVENTS_KEY, (old) =>
        old?.map((e) => (e.id === eventId ? { ...e, isRegistered: true } : e)),
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(EVENTS_KEY, ctx.prev);
      toast.error(copy["error.generic"]);
    },
    onSuccess: () => {
      toast.success("שריינו לך מקום. נזכיר לך לפני שעולים לשידור.");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });

  const list = events ?? [];
  const byStart = (a: LiveEvent, b: LiveEvent) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  const liveNow = list.filter((e) => e.status === "live").sort(byStart);
  const upcoming = list.filter((e) => e.status === "upcoming").sort(byStart);
  const past = list.filter((e) => e.status === "ended").sort((a, b) => byStart(b, a));

  const hero = liveNow[0] ?? upcoming[0] ?? null;
  const nextUp = [...liveNow, ...upcoming].filter((e) => e.id !== hero?.id);

  let content: ReactNode;

  if (isLoading) {
    /* מצב טעינה — skeleton */
    content = (
      <>
        <div className="skeleton mb-8 h-64 rounded-xl" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      </>
    );
  } else if (isError) {
    /* מצב שגיאה */
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
  } else if (list.length === 0) {
    /* מצב ריק — אין אירועים בכלל */
    content = (
      <div className="surface-card">
        <EmptyState
          icon={
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: "var(--accent-faint)" }}
            >
              <Radio className="h-8 w-8 text-accent" />
            </span>
          }
          title="הלייב הבא יעלה בקרוב"
          description='"שלישי בחממה" — כל יום שלישי ב-20:00. שווה לחזור לכאן.'
        />
      </div>
    );
  } else {
    /* מצב תוכן */
    content = (
      <>
        {/* הירו — הלייב הקרוב / החי */}
        {hero ? (
          <motion.section
            className="surface-card relative mb-10 overflow-hidden"
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
              <div className="flex flex-wrap items-center gap-3">
                <span className="label-mono">
                  {hero.status === "live" ? "עכשיו בחממה" : "הלייב הקרוב"}
                </span>
                {hero.status === "live" && <LiveBadge />}
              </div>
              <h2 className="mt-2 max-w-2xl text-h1 text-ink">{hero.title}</h2>
              <p className="mt-3 max-w-2xl text-body-lg text-ink-2">{hero.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[12px] tabular text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {fmtDay(hero.startsAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {fmtTime(hero.startsAt)} · {hero.durationMin} דקות
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mic className="h-4 w-4" />
                  {hero.hostName}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <RsvpButton
                  event={hero}
                  onRsvp={(id) => rsvp.mutate(id)}
                  pending={rsvp.isPending}
                />
                {hero.isRegistered && (
                  <span className="text-small text-muted">נשלח לך תזכורת לפני שעולים לשידור.</span>
                )}
              </div>
            </div>
          </motion.section>
        ) : (
          <div className="surface-card mb-10">
            <EmptyState
              icon={
                <span
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: "var(--accent-faint)" }}
                >
                  <Radio className="h-8 w-8 text-accent" />
                </span>
              }
              title="הלייב הבא יעלה בקרוב"
              description="בינתיים אפשר להשלים את ההקלטות מהלייבים הקודמים."
            />
          </div>
        )}

        {/* הבאים בתור */}
        {nextUp.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-h2 text-ink">הבאים בתור</h2>
            <motion.ul
              className="space-y-3"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {nextUp.map((e) => (
                <motion.li key={e.id} variants={gated}>
                  <div className="surface-card flex flex-wrap items-center gap-4 p-4 md:p-5">
                    <DateSquare iso={e.startsAt} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-body font-medium text-ink">{e.title}</span>
                        {e.status === "live" && <LiveBadge />}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 font-mono text-[11px] tabular text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {fmtTime(e.startsAt)} · {e.durationMin} דקות
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mic className="h-3.5 w-3.5" />
                          {e.hostName}
                        </span>
                      </div>
                    </div>
                    <RsvpButton
                      event={e}
                      onRsvp={(id) => rsvp.mutate(id)}
                      pending={rsvp.isPending}
                      compact
                    />
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}

        {/* הקלטות מלייבים קודמים */}
        {past.length > 0 && (
          <section>
            <h2 className="mb-4 text-h2 text-ink">הקלטות מלייבים קודמים</h2>
            <motion.ul
              className="space-y-3"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {past.map((e) => (
                <motion.li key={e.id} variants={gated}>
                  <div className="surface-card flex flex-wrap items-center gap-4 p-4 md:p-5">
                    <DateSquare iso={e.startsAt} />
                    <div className="min-w-0 flex-1">
                      <span className="text-body font-medium text-ink">{e.title}</span>
                      <div className="mt-1 flex flex-wrap items-center gap-4 font-mono text-[11px] tabular text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {e.durationMin} דקות
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Mic className="h-3.5 w-3.5" />
                          {e.hostName}
                        </span>
                      </div>
                    </div>
                    {e.recordingLessonId ? (
                      <Link
                        to="/courses"
                        className="btn-secondary inline-flex items-center gap-2 text-small"
                      >
                        <Play className="h-4 w-4" />
                        לצפייה בהקלטה
                      </Link>
                    ) : (
                      <span className="text-small text-muted">ההקלטה תעלה בקרוב</span>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </section>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative mb-8">
        <span className="ghost-number" aria-hidden="true">
          10
        </span>
        <span className="label-mono">{copy["nav.lives"]}</span>
        <h1 className="mt-1 text-h1 text-ink">שלישי בחממה — לייבים ושידורים</h1>
        <p className="mt-2 max-w-xl text-small text-muted">
          כל יום שלישי ב-20:00: סשן אסטרטגיה עם גוני, סדנת AI עם חופית או אורח מפתיע. שריון מקום
          יוצר תזכורות אוטומטיות.
        </p>
      </div>
      {content}
    </div>
  );
}
