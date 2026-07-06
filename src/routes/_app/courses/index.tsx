// src/routes/_app/courses/index.tsx — ספריית הקורסים (פרק 3.3 §4)
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, revealUp, useGatedVariants } from "../../../lib/motion";
import { data } from "../../../lib/data";
import { CourseCard } from "../../../components/greenhouse/CourseCard";
import { EmptyState } from "../../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/courses/")({
  component: CoursesPage,
});

const FILTERS = [
  { id: "all", label: "הכל" },
  { id: "mine", label: "הקורסים שלי" },
  { id: "AI", label: "AI" },
  { id: "שיווק", label: "שיווק" },
  { id: "קופי", label: "קופי" },
  { id: "אוטומציות", label: "אוטומציות" },
];

function CoursesPage() {
  const [filter, setFilter] = useState("all");
  const gated = useGatedVariants(revealUp);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", filter],
    queryFn: () => data.courses.list(filter === "all" ? undefined : { category: filter }),
  });
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: () => data.courses.myEnrollments(),
  });

  function pctFor(courseId: string) {
    const e = enrollments?.find((x) => x.courseId === courseId);
    if (!e || e.totalLessons === 0) return 0;
    return Math.round((e.completedLessons / e.totalLessons) * 100);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative mb-6">
        <span className="ghost-number" aria-hidden="true">
          03
        </span>
        <span className="label-mono">ספריית הקורסים</span>
        <h1 className="mt-1 text-h1 text-ink">כל מה שיש לך לגדל</h1>
      </div>

      {/* פילטרים */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="rounded-full border px-4 py-1.5 text-small transition-all"
              style={{
                borderColor: active ? "var(--accent)" : "var(--line)",
                background: active ? "var(--accent-faint)" : "transparent",
                color: active ? "var(--accent)" : "var(--ink-2)",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton aspect-[16/10] rounded-lg" style={{ height: 280 }} />
          ))}
        </div>
      ) : courses && courses.length > 0 ? (
        <motion.div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="visible"
        >
          {courses.map((c) => (
            <motion.div key={c.id} variants={gated}>
              <CourseCard course={c} progressPct={pctFor(c.id)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="surface-card">
          <EmptyState
            title="אין קורסים בקטגוריה הזו עדיין"
            description="נסה קטגוריה אחרת — ספריית החממה גדלה כל הזמן."
          />
        </div>
      )}
    </div>
  );
}
