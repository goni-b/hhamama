// src/routes/_app/assignments/$id.tsx — משימה בודדת: תיאור, הגשה ומשוב (פרק 3.3 §8)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  Clock,
  FileText,
  Link2,
  Send,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import { data } from "../../../lib/data";
import type { Submission, SubmissionStatus } from "../../../lib/data/types";
import { copy, t } from "../../../lib/copy";
import { EASE } from "../../../lib/motion";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/_app/assignments/$id")({
  component: AssignmentPage,
});

const MAX_FILES = 5;
const MAX_FILE_MB = 20;

const schema = z.object({
  content: z.string().min(10, "ספר קצת יותר על מה שהכנת — לפחות 10 תווים"),
  link: z.string().url("קישור לא תקין — כתובת מלאה כולל https://").optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long" }).format(new Date(iso));
}

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
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

function AssignmentPage() {
  const { id } = useParams({ from: "/_app/assignments/$id" });

  const {
    data: assignment,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => data.assignments.get(id),
  });
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => data.courses.list(),
  });

  /* מצב טעינה */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="skeleton mb-6 h-44 rounded-xl" />
        <div className="skeleton h-80 rounded-xl" />
      </div>
    );
  }

  /* מצב שגיאה */
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            icon={<CircleAlert className="h-14 w-14" style={{ color: "var(--danger)" }} />}
            title="לא הצלחנו לטעון את המשימה"
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

  /* לא נמצא */
  if (!assignment) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="המשימה לא נמצאה"
            description="ייתכן שהקישור השתנה או שהמשימה הוסרה."
            action={
              <Link to="/assignments" className="btn-primary text-small">
                חזרה למשימות
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const course = (courses ?? []).find((c) => c.id === assignment.courseId) ?? null;
  const sub = assignment.mySubmission;
  const status = sub?.status ?? null;
  const awaiting = !status || status === "needs_fix";
  const overdue =
    awaiting && !!assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/assignments"
        className="mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה למשימות
      </Link>

      {/* כותרת + תיאור המשימה */}
      <motion.section
        className="surface-card relative mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)",
          }}
        />
        <div className="relative p-6 md:p-8">
          <span className="label-mono">משימה</span>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
            <h1 className="max-w-2xl text-h1 text-ink">{assignment.title}</h1>
            <StatusBadge status={status} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted">
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
          <p className="mt-4 max-w-2xl whitespace-pre-line text-body text-ink-2">
            {assignment.description}
          </p>
        </div>
      </motion.section>

      <div className="space-y-5">
        {/* הוגש — ממתין לבדיקה */}
        {sub && sub.status === "pending" && (
          <div
            className="flex items-center gap-3 rounded-lg border p-4"
            style={{
              borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
              background: "color-mix(in srgb, var(--success) 8%, transparent)",
            }}
          >
            <Clock className="h-5 w-5 shrink-0" style={{ color: "var(--success)" }} />
            <div>
              <p className="text-body font-medium" style={{ color: "var(--success)" }}>
                הוגש — ממתין לבדיקת מנטור
              </p>
              <p className="text-small text-muted">
                נעדכן אותך ברגע שהמשוב מוכן. בינתיים אפשר להמשיך לצמוח.
              </p>
            </div>
          </div>
        )}

        {/* דורש תיקון — משוב מוצמד */}
        {sub && sub.status === "needs_fix" && (
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: "color-mix(in srgb, var(--warning) 40%, transparent)",
              background: "color-mix(in srgb, var(--warning) 8%, transparent)",
            }}
          >
            <div className="flex items-center gap-3">
              <TriangleAlert className="h-5 w-5 shrink-0" style={{ color: "var(--warning)" }} />
              <p className="text-body font-medium" style={{ color: "var(--warning)" }}>
                דורש תיקון קטן — המנטור השאיר לך משוב
              </p>
            </div>
            {sub.feedback && (
              <div
                className="mt-3 border-t pt-3"
                style={{ borderColor: "color-mix(in srgb, var(--warning) 25%, transparent)" }}
              >
                <span className="label-mono">משוב מהמנטור</span>
                <p className="mt-1.5 whitespace-pre-line text-body text-ink-2">{sub.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* אושר — בונוס האישור */}
        {sub && sub.status === "approved" && (
          <div
            className="rounded-lg border p-4"
            style={{ borderColor: "var(--accent-border)", background: "var(--accent-faint)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--grad-gold)" }}
              >
                <Check className="h-4 w-4 text-[#1a1206]" />
              </span>
              <div>
                <p className="text-body font-medium text-accent">המשימה אושרה</p>
                <p className="text-small text-muted">
                  {t("points.earned", { count: 40 })} — בונוס האישור נוסף לחשבון שלך.
                </p>
              </div>
            </div>
            {sub.feedback && (
              <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--accent-border)" }}>
                <span className="label-mono">משוב מהמנטור</span>
                <p className="mt-1.5 whitespace-pre-line text-body text-ink-2">{sub.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* ההגשה הקיימת (הוגש / אושר) */}
        {sub && sub.status !== "needs_fix" && <SubmissionView submission={sub} />}

        {/* טופס הגשה — חדש או תיקון */}
        {awaiting && (
          <SubmissionForm key={sub?.id ?? "new"} assignmentId={assignment.id} existing={sub} />
        )}
      </div>
    </div>
  );
}

function SubmissionView({ submission }: { submission: Submission }) {
  return (
    <div className="surface-card relative p-6">
      {submission.status === "approved" && (
        /* רגע WOW — חותמת "אושר" נחתמת על הכרטיס */
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.8, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: -10 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
          className="pointer-events-none absolute -top-3 left-5 rounded-md border-2 px-3 py-0.5 font-mono text-[13px] font-bold tracking-[0.2em]"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
            background: "color-mix(in srgb, var(--accent) 10%, var(--bg-2))",
          }}
        >
          אושר
        </motion.span>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h3 text-ink">ההגשה שלך</h2>
        <span className="font-mono text-[11px] tabular text-muted">
          הוגש ב-{fmtDate(submission.submittedAt)}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line text-body text-ink-2">{submission.content}</p>
      {submission.link && (
        <a
          href={submission.link}
          target="_blank"
          rel="noreferrer"
          dir="ltr"
          className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-small text-accent transition-opacity hover:opacity-80"
        >
          <Link2 className="h-4 w-4 shrink-0" />
          {submission.link}
        </a>
      )}
      {submission.fileNames.length > 0 && (
        <ul className="mt-4 space-y-2">
          {submission.fileNames.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-bg-2 px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-small text-ink-2">{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmissionForm({
  assignmentId,
  existing,
}: {
  assignmentId: string;
  existing: Submission | null;
}) {
  const qc = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: existing?.content ?? "", link: existing?.link ?? "" },
  });

  const submit = useMutation({
    mutationFn: (v: FormValues) =>
      data.assignments.submit(assignmentId, {
        content: v.content,
        link: v.link ? v.link : undefined,
        files: files.length > 0 ? files : undefined,
      }),
    onSuccess: () => {
      toast.success(`המשימה הוגשה לבדיקת המנטור. ${t("points.earned", { count: 60 })}`);
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["assignment", assignmentId] });
      qc.invalidateQueries({ queryKey: ["session"] });
    },
    onError: () => toast.error(copy["error.generic"]),
  });

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (chosen.length === 0) return;
    const tooBig = chosen.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setFileError(`"${tooBig.name}" גדול מדי — עד ${MAX_FILE_MB}MB לקובץ.`);
      return;
    }
    const next = [...files, ...chosen];
    if (next.length > MAX_FILES) {
      setFileError(`אפשר לצרף עד ${MAX_FILES} קבצים.`);
      return;
    }
    setFileError(null);
    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  }

  return (
    <div className="surface-card p-6">
      <h2 className="text-h3 text-ink">{existing ? "הגשה מחודשת" : "ההגשה שלך"}</h2>
      <p className="mt-1 text-small text-muted">
        {existing
          ? "עדכן לפי המשוב והגש שוב — זה בדיוק איך שצומחים."
          : "ספר מה הכנת, צרף קישור או קבצים — והמנטור יעבור על הכל."}
      </p>

      <form
        onSubmit={form.handleSubmit((v) => submit.mutate(v))}
        className="mt-5 space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="content" className="mb-1.5 block text-small text-ink-2">
            מה הכנת?
          </label>
          <textarea
            id="content"
            rows={6}
            placeholder="ספר על העבודה שלך — מה בנית, איך ניגשת, ומה למדת בדרך..."
            className="min-h-[140px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
            {...form.register("content")}
          />
          {form.formState.errors.content && (
            <p className="mt-1.5 text-small text-danger">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="link" className="mb-1.5 flex items-center gap-1.5 text-small text-ink-2">
            <Link2 className="h-3.5 w-3.5 text-muted" />
            קישור (לא חובה) — לדף נחיתה, מסמך או קמפיין שבנית
          </label>
          <Input id="link" type="url" dir="ltr" placeholder="https://" {...form.register("link")} />
          {form.formState.errors.link && (
            <p className="mt-1.5 text-small text-danger">{form.formState.errors.link.message}</p>
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-small text-ink-2">
            קבצים (לא חובה) — עד {MAX_FILES} קבצים, {MAX_FILE_MB}MB לקובץ
          </span>
          <label className="btn-secondary inline-flex cursor-pointer items-center gap-2 text-small">
            <Upload className="h-4 w-4" />
            צירוף קבצים
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={addFiles}
              disabled={files.length >= MAX_FILES}
            />
          </label>
          {existing && existing.fileNames.length > 0 && (
            <p className="mt-1.5 text-[12px] text-muted">
              בהגשה הקודמת צורפו: {existing.fileNames.join(", ")} — צירוף קבצים חדשים מחליף אותם.
            </p>
          )}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-2.5 rounded-lg border border-line bg-bg-2 px-3 py-2"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted" />
                  <span className="min-w-0 flex-1 truncate text-small text-ink-2">{f.name}</span>
                  <span className="font-mono text-[11px] tabular text-muted">
                    {fmtSize(f.size)}
                  </span>
                  <button
                    type="button"
                    aria-label={`הסרת ${f.name}`}
                    onClick={() => removeFile(i)}
                    className="text-muted transition-colors hover:text-danger"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {fileError && <p className="mt-1.5 text-small text-danger">{fileError}</p>}
        </div>

        <button
          type="submit"
          disabled={submit.isPending}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {submit.isPending ? "שולח..." : existing ? "הגשה מחודשת" : "הגשת המשימה"}
        </button>
      </form>
    </div>
  );
}
