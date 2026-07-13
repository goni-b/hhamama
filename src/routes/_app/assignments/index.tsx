// src/routes/_app/assignments/index.tsx — המשימות שלי (פרק 3.3 §8)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CircleAlert,
  ClipboardList,
  Clock,
  TriangleAlert,
} from "lucide-react";
import { data } from "../../../lib/data";
import type { Assignment, Course, SubmissionStatus } from "../../../lib/data/types";
import { copy } from "../../../lib/copy";
import { revealUp, staggerContainer, useGatedVariants } from "../../../lib/motion";
import { EmptyState } from "../../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/assignments/")({
  component: AssignmentsPage,
});

type TabId = "awaiting" | "submitted" | "approved";

const TABS: { id: TabId; label: string }[] = [
  { id: "awaiting", label: "ממתינות" },
  { id: "submitted", label: "הוגשו" },
  { id: "approved", label: "אושרו" },
];

const TAB_EMPTY: Record<TabId, { title: string; description: string }> = {
  awaiting: {
    title: "אין משימות שממתינות לך כרגע",
    description: "הכל מטופל. משימות חדשות נפתחות עם ההתקדמות בקורסים.",
  },
  submitted: {
    title: "אין הגשות בבדיקה",
    description: "משימות שתגיש יופיעו כאן עד שהמנטור יעבור עליהן.",
  },
  approved: {
    title: "עוד אין משימות מאושרות",
    description: "ההגשה הראשונה בדרך לשם — כל אישור שווה 40 נקודות צמיחה.",
  },
};

/** לאיזה טאב שייכת משימה: ללא הגשה או "דורש תיקון" — ממתינות; אחרת לפי הסטטוס */
function tabOf(a: Assignment): TabId {
  if (!a.mySubmission || a.mySubmission.status === "needs_fix") return "awaiting";
  if (a.mySubmission.status === "approved") return "approved";
  return "submitted";
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long" }).format(new Date(iso));
}

const STATUS_META: Record<SubmissionStatus, { label: string; color: string; Icon: LucideIcon }> = {
  pending: { label: "ממתין לבדיקה", color: "var(--success)", Icon: Clock },
  needs_fix: { label: "דורש תיקון", color: "var(--warning)", Icon: TriangleAlert },
  approved: { label: "אושר", color: "var(--accent)", Icon: Check },
};

function StatusBadge({ status }: { status: SubmissionStatus | null }) {
  if (!status) {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]"
        style={{ borderColor: "var(--line)", color: "var(--muted)" }}
      >
        טרם הוגש
      </span>
    );
  }
  const { label, color, Icon } = STATUS_META[status];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium"
      style={{
        borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        color,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function AssignmentsPage() {
  const [tab, setTab] = useState<TabId>("awaiting");
  const gated = useGatedVariants(revealUp);

  const {
    data: assignments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => data.assignments.list(),
  });
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => data.courses.list(),
  });

  const header = (
    <div className="relative mb-6">
      <span className="ghost-number" aria-hidden="true">
        07
      </span>
      <span className="label-mono">משימות</span>
      <h1 className="mt-1 text-h1 text-ink">המשימות שלך</h1>
      <p className="mt-2 max-w-xl text-small text-muted">
        כאן הידע הופך לעבודה אמיתית — מגישים, מקבלים משוב מהמנטורים, וצומחים.
      </p>
    </div>
  );

  /* מצב טעינה */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        {header}
        <div className="mb-5 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-36 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  /* מצב שגיאה */
  if (isError) {
    return (
      <div className="mx-auto max-w-4xl">
        {header}
        <div className="surface-card">
          <EmptyState
            icon={<CircleAlert className="h-14 w-14" style={{ color: "var(--danger)" }} />}
            title="לא הצלחנו לטעון את המשימות"
            description={copy["error.generic"]}
            action={
              <button onClick={() => refetch()} className="btn-secondary text-small">
                נסה שוב
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const list = assignments ?? [];

  /* מצב ריק כללי */
  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        {header}
        <div className="surface-card">
          <EmptyState
            icon={
              <ClipboardList
                className="h-16 w-16"
                style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
              />
            }
            title="עוד לא קיבלת משימות"
            description="הן נפתחות עם ההתקדמות בקורסים. המשך לצפות — הן בדרך."
            action={
              <Link to="/courses" className="btn-primary text-small">
                {copy["cta.exploreLibrary"]}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const courseById = new Map<string, Course>((courses ?? []).map((c) => [c.id, c]));
  const counts: Record<TabId, number> = { awaiting: 0, submitted: 0, approved: 0 };
  for (const a of list) counts[tabOf(a)] += 1;
  const visible = list.filter((a) => tabOf(a) === tab);

  return (
    <div className="mx-auto max-w-4xl">
      {header}

      {/* טאבים */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-small transition-all"
              style={{
                borderColor: active ? "var(--accent)" : "var(--line)",
                background: active ? "var(--accent-faint)" : "transparent",
                color: active ? "var(--accent)" : "var(--ink-2)",
              }}
            >
              {t.label}
              <span
                className="font-mono text-[11px] tabular"
                style={{ color: active ? "var(--accent)" : "var(--muted)" }}
              >
                {counts[t.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* מצב ריק פר-טאב / תוכן */}
      {visible.length === 0 ? (
        <div className="surface-card">
          <EmptyState title={TAB_EMPTY[tab].title} description={TAB_EMPTY[tab].description} />
        </div>
      ) : (
        <motion.div
          key={tab}
          className="space-y-4"
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
        >
          {visible.map((a) => (
            <motion.div key={a.id} variants={gated}>
              <AssignmentCard assignment={a} course={courseById.get(a.courseId) ?? null} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function AssignmentCard({ assignment, course }: { assignment: Assignment; course: Course | null }) {
  const status = assignment.mySubmission?.status ?? null;
  const awaiting = !status || status === "needs_fix";
  const overdue =
    awaiting && !!assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now();

  const cta = !status
    ? "לצפייה והגשה"
    : status === "needs_fix"
      ? "לתיקון והגשה מחדש"
      : status === "pending"
        ? "לצפייה בהגשה"
        : "לצפייה במשוב";

  return (
    <div className="surface-card p-5 transition-colors hover:border-[color:var(--accent-border)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/assignments/$id"
            params={{ id: assignment.id }}
            className="text-h3 text-ink transition-colors hover:text-accent"
          >
            {assignment.title}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted">
            {course && (
              <Link
                to="/courses/$slug"
                params={{ slug: course.slug }}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <BookOpen className="h-3.5 w-3.5" />
                {course.title}
              </Link>
            )}
            {assignment.dueAt && (
              <span
                className="inline-flex items-center gap-1.5"
                style={overdue ? { color: "var(--danger)" } : undefined}
              >
                <Clock className="h-3.5 w-3.5" />
                {overdue
                  ? `עבר מועד ההגשה — ${fmtDate(assignment.dueAt)}`
                  : `להגשה עד ${fmtDate(assignment.dueAt)}`}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="mt-3 line-clamp-2 text-small text-ink-2">{assignment.description}</p>

      <div className="mt-4">
        <Link
          to="/assignments/$id"
          params={{ id: assignment.id }}
          className="inline-flex items-center gap-1.5 text-small text-accent transition-opacity hover:opacity-80"
        >
          {cta}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
