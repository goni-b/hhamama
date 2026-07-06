// src/routes/learn/$courseSlug.$lessonId.tsx — נגן שיעור (פרק 3.3 §6) — הפאזה הקריטית
import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  X,
  Check,
  Play,
  ArrowLeft,
  FileText,
  StickyNote,
  MessageCircleQuestion,
  Download,
} from "lucide-react";
import { data } from "../../lib/data";
import type { Course, Lesson } from "../../lib/data/types";
import { getVideoAdapter } from "../../lib/video/provider";
import { getNote, setNote } from "../../lib/data/mock/store";
import { copy } from "../../lib/copy";
import { EASE } from "../../lib/motion";

export const Route = createFileRoute("/learn/$courseSlug/$lessonId")({
  component: LearnPage,
});

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  return `${m}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}

function LearnPage() {
  const { courseSlug, lessonId } = useParams({ from: "/learn/$courseSlug/$lessonId" });
  const router = useRouter();
  const qc = useQueryClient();

  const { data: course } = useQuery({
    queryKey: ["course", courseSlug],
    queryFn: () => data.courses.getBySlug(courseSlug),
  });
  const { data: progressList } = useQuery({
    queryKey: ["progress", course?.id],
    queryFn: () => (course ? data.progress.getForCourse(course.id) : Promise.resolve([])),
    enabled: !!course,
  });

  const allLessons: { lesson: Lesson; moduleTitle: string }[] =
    course?.modules.flatMap((m) => m.lessons.map((l) => ({ lesson: l, moduleTitle: m.title }))) ??
    [];
  const current = allLessons.find((x) => x.lesson.id === lessonId)?.lesson;
  const currentIdx = allLessons.findIndex((x) => x.lesson.id === lessonId);
  const next =
    currentIdx >= 0 && currentIdx < allLessons.length - 1
      ? allLessons[currentIdx + 1].lesson
      : null;

  const doneIds = new Set((progressList ?? []).filter((p) => p.completedAt).map((p) => p.lessonId));
  const savedPos = (progressList ?? []).find((p) => p.lessonId === lessonId)?.positionSec ?? 0;
  const courseDone = allLessons.filter((x) => doneIds.has(x.lesson.id)).length;
  const coursePct = allLessons.length ? Math.round((courseDone / allLessons.length) * 100) : 0;

  const [tab, setTab] = useState<"materials" | "notes" | "questions">("materials");
  const [showUpNext, setShowUpNext] = useState(false);
  const [completedNow, setCompletedNow] = useState(false);

  if (!course || !current) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="skeleton h-64 w-full max-w-3xl rounded-xl" />
      </div>
    );
  }

  async function handleComplete(silent = false) {
    if (doneIds.has(lessonId) || completedNow) return;
    setCompletedNow(true);
    const res = await data.progress.markComplete(lessonId);
    await qc.invalidateQueries({ queryKey: ["progress", course!.id] });
    await qc.invalidateQueries({ queryKey: ["session"] });
    await qc.invalidateQueries({ queryKey: ["continue"] });
    if (!silent && res.xpAwarded > 0) toast.success(copy["success.lessonComplete"]);
  }

  return (
    <div className="min-h-screen">
      {/* TopProgressBar */}
      <div className="sticky top-0 z-30">
        <div className="h-[3px] w-full" style={{ background: "var(--panel-2)" }}>
          <motion.div
            className="h-full"
            style={{ background: "var(--grad-gold)" }}
            initial={{ width: 0 }}
            animate={{ width: `${coursePct}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
        <div className="glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5">
          <Link
            to="/courses/$slug"
            params={{ slug: course.slug }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-ink"
            aria-label="חזרה לעמוד הקורס"
          >
            <X className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="truncate text-small text-ink">{course.title}</div>
          </div>
          <span className="font-mono text-[11px] tabular text-muted">{coursePct}% מהקורס</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        {/* עמודה ראשית */}
        <div className="min-w-0">
          <VideoPlayer
            key={current.id}
            lesson={current}
            resumeSec={savedPos}
            alreadyDone={doneIds.has(current.id)}
            onSavePosition={(pos) => data.progress.savePosition(current.id, pos, 15)}
            onReach90={() => handleComplete()}
            onEnded={() => {
              handleComplete();
              if (next) setShowUpNext(true);
            }}
          />

          {/* שורת כותרת + פעולות */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-h2 text-ink">{current.title}</h1>
              <span className="font-mono text-[12px] tabular text-muted">
                {fmt(current.durationSec)} דקות
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleComplete()}
                disabled={doneIds.has(current.id) || completedNow}
                className="btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {doneIds.has(current.id) || completedNow ? "הושלם" : copy["cta.markComplete"]}
              </button>
              {next && (
                <Link
                  to="/learn/$courseSlug/$lessonId"
                  params={{ courseSlug: course.slug, lessonId: next.id }}
                  className="btn-primary inline-flex items-center gap-2 text-small"
                >
                  {copy["cta.nextLesson"]}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* טאבים */}
          <div className="mt-6">
            <div className="flex gap-1 border-b border-line">
              <TabBtn
                active={tab === "materials"}
                onClick={() => setTab("materials")}
                icon={<FileText className="h-4 w-4" />}
              >
                חומרים
              </TabBtn>
              <TabBtn
                active={tab === "notes"}
                onClick={() => setTab("notes")}
                icon={<StickyNote className="h-4 w-4" />}
              >
                הערות
              </TabBtn>
              <TabBtn
                active={tab === "questions"}
                onClick={() => setTab("questions")}
                icon={<MessageCircleQuestion className="h-4 w-4" />}
              >
                שאלות
              </TabBtn>
            </div>
            <div className="py-5">
              {tab === "materials" && <MaterialsTab lesson={current} />}
              {tab === "notes" && <NotesTab lessonId={current.id} />}
              {tab === "questions" && (
                <p className="text-small text-muted">
                  שאלות ותשובות לשיעור זה ייפתחו בקרוב. בינתיים אפשר לשאול בקהילה.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SyllabusPanel */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="surface-card overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <span className="label-mono">תוכן הקורס</span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {course.modules.map((m) => (
                <div key={m.id}>
                  <div className="bg-[color:var(--bg-2)] px-4 py-2 text-[12px] font-medium text-muted">
                    {m.title}
                  </div>
                  <ul>
                    {m.lessons.map((l) => {
                      const isCurrent = l.id === current.id;
                      const done = doneIds.has(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to="/learn/$courseSlug/$lessonId"
                            params={{ courseSlug: course.slug, lessonId: l.id }}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-small transition-colors"
                            style={{
                              background: isCurrent ? "var(--accent-faint)" : "transparent",
                              borderInlineStart: isCurrent
                                ? "3px solid var(--accent)"
                                : "3px solid transparent",
                              color: isCurrent ? "var(--accent)" : "var(--ink-2)",
                            }}
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              {done ? (
                                <Check className="h-3.5 w-3.5 text-success" />
                              ) : isCurrent ? (
                                <Play className="h-3 w-3 fill-current" />
                              ) : (
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ background: "var(--muted-2)" }}
                                />
                              )}
                            </span>
                            <span className="flex-1 truncate">{l.title}</span>
                            <span className="font-mono text-[10px] tabular text-muted">
                              {fmt(l.durationSec)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* UpNextCard */}
      <AnimatePresence>
        {showUpNext && next && (
          <UpNextCard
            lesson={next}
            onCancel={() => setShowUpNext(false)}
            onPlay={() => {
              setShowUpNext(false);
              router.navigate({
                to: "/learn/$courseSlug/$lessonId",
                params: { courseSlug: course.slug, lessonId: next.id },
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoPlayer({
  lesson,
  resumeSec,
  alreadyDone,
  onSavePosition,
  onReach90,
  onEnded,
}: {
  lesson: Lesson;
  resumeSec: number;
  alreadyDone: boolean;
  onSavePosition: (pos: number) => void;
  onReach90: () => void;
  onEnded: () => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const lastSaved = useRef(0);
  const reached90 = useRef(alreadyDone);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const adapter = getVideoAdapter(lesson.videoProvider);
    let seekedResume = false;
    const handle = adapter.bindPlayer(el, lesson.videoId, {
      onReady: () => {
        if (resumeSec > 5 && !seekedResume) {
          seekedResume = true;
          handle.seekTo(resumeSec);
          toast(`ממשיכים מ-${fmt(resumeSec)}`);
        }
      },
      onProgress: (pos, dur) => {
        if (dur > 0 && pos - lastSaved.current >= 15) {
          lastSaved.current = pos;
          onSavePosition(Math.floor(pos));
        }
        if (dur > 0 && !reached90.current && pos / dur >= 0.9) {
          reached90.current = true;
          onReach90();
        }
      },
      onEnded: () => onEnded(),
    });
    return () => handle.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  return (
    <div className="surface-card overflow-hidden">
      <div ref={holder} className="aspect-video w-full bg-[color:var(--bg)]" />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 text-small transition-colors"
      style={{
        color: active ? "var(--accent)" : "var(--muted)",
        borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
        marginBottom: -1,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function MaterialsTab({ lesson }: { lesson: Lesson }) {
  if (lesson.resources.length === 0) {
    return <p className="text-small text-muted">אין חומרים מצורפים לשיעור זה.</p>;
  }
  return (
    <ul className="space-y-2">
      {lesson.resources.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            className="surface-panel flex items-center gap-3 p-3 transition-colors hover:border-[color:var(--accent-border)]"
          >
            <FileText className="h-5 w-5 text-accent" />
            <span className="flex-1 text-body text-ink-2">{r.title}</span>
            <Download className="h-4 w-4 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function NotesTab({ lessonId }: { lessonId: string }) {
  const [val, setVal] = useState(() => getNote(lessonId));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChange(v: string) {
    setVal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(lessonId, v), 800);
  }

  return (
    <div>
      <textarea
        value={val}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ההערות שלך לשיעור הזה — נשמרות אוטומטית..."
        className="min-h-[160px] w-full resize-y rounded-lg border border-line bg-bg-2 p-4 text-body text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
      />
      <p className="mt-2 text-[12px] text-muted">נשמר אוטומטית תוך כדי כתיבה.</p>
    </div>
  );
}

function UpNextCard({
  lesson,
  onCancel,
  onPlay,
}: {
  lesson: Lesson;
  onCancel: () => void;
  onPlay: () => void;
}) {
  const [count, setCount] = useState(8);
  useEffect(() => {
    if (count <= 0) {
      onPlay();
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, onPlay]);

  return (
    <motion.div
      className="fixed bottom-6 z-40 w-[92%] max-w-sm rounded-xl p-5 shadow-[var(--elev-3)]"
      style={{
        insetInlineEnd: 24,
        background: "var(--panel-2)",
        border: "1px solid var(--accent-border)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="label-mono">השיעור הבא</span>
      <h3 className="mt-1.5 text-h3 text-ink">{lesson.title}</h3>
      <p className="mt-1 text-small text-muted">מתנגן אוטומטית בעוד {count} שניות</p>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={onPlay} className="btn-primary flex-1 text-small">
          נגן עכשיו
        </button>
        <button onClick={onCancel} className="btn-ghost text-small">
          ביטול
        </button>
      </div>
    </motion.div>
  );
}
