// src/components/greenhouse/CourseCard.tsx — כרטיס קורס (פרק 4.4.4)
import { Link } from "@tanstack/react-router";
import { BookOpen, Lock, Check } from "lucide-react";
import type { Course } from "../../lib/data/types";

export function CourseCard({ course, progressPct = 0 }: { course: Course; progressPct?: number }) {
  const locked = !!course.lockedReason;
  const completed = progressPct >= 100;
  const inProgress = progressPct > 0 && !completed;

  const body = (
    <article
      className="group surface-card overflow-hidden transition-all duration-200"
      style={{
        transition:
          "transform .2s var(--ease), box-shadow .2s var(--ease), border-color .2s var(--ease)",
      }}
    >
      {/* cover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%), linear-gradient(135deg, var(--panel-2), var(--bg-2))",
            filter: locked ? "grayscale(0.7) brightness(0.55)" : undefined,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen
            className="h-9 w-9"
            style={{ color: "color-mix(in srgb, var(--accent) 55%, transparent)" }}
          />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to top, var(--bg) 10%, transparent)" }}
        />

        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="glass-panel flex h-11 w-11 items-center justify-center rounded-full">
              <Lock className="h-4 w-4 text-accent" />
            </span>
            <span className="label-mono" style={{ color: "var(--accent)" }}>
              {course.lockedReason}
            </span>
          </div>
        )}

        {completed && !locked && (
          <span
            className="absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--grad-gold)" }}
          >
            <Check className="h-4 w-4 text-[#1a1206]" />
          </span>
        )}
        {inProgress && (
          <span
            className="absolute end-3 top-3 rounded-full border px-2 py-0.5 label-mono"
            style={{
              borderColor: "var(--accent-border)",
              background: "var(--accent-faint)",
              color: "var(--accent)",
            }}
          >
            בתהליך
          </span>
        )}
      </div>

      {/* body */}
      <div className="space-y-2.5 p-4">
        {course.category && <span className="label-mono">{course.category}</span>}
        <h3 className="line-clamp-2 text-h3 text-ink">{course.title}</h3>
        <div className="font-mono text-[11px] tabular text-muted">
          {course.modules.length} מודולים · {course.lessonsCount} שיעורים ·{" "}
          {Math.floor(course.totalDurationMin / 60)}:
          {String(course.totalDurationMin % 60).padStart(2, "0")} שעות
        </div>
        {!locked && (progressPct > 0 || completed) && (
          <div className="pt-1">
            <div
              className="h-1 overflow-hidden rounded-full"
              style={{ background: "var(--panel-2)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${progressPct}%`, background: "var(--grad-gold)" }}
              />
            </div>
            <div className="mt-1.5 font-mono text-[10.5px] tabular text-muted">
              {progressPct}% הושלם
            </div>
          </div>
        )}
      </div>
    </article>
  );

  if (locked) {
    return (
      <div className="cursor-not-allowed" title={course.lockedReason ?? undefined}>
        {body}
      </div>
    );
  }
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="block transition-transform hover:-translate-y-[3px]"
    >
      {body}
    </Link>
  );
}
