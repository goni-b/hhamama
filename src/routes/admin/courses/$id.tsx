// src/routes/admin/courses/$id.tsx — בונה הקורסים (פרק 3.4 §19)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Plus, Play, FolderPlus, Save } from "lucide-react";
import { data } from "../../../lib/data";
import type { Lesson } from "../../../lib/data/types";
import { getVideoAdapter } from "../../../lib/video/provider";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/admin/courses/$id")({
  component: CourseBuilder,
});

type Editing = { moduleId: string; lesson: Lesson | null };

function CourseBuilder() {
  const { id } = useParams({ from: "/admin/courses/$id" });
  const qc = useQueryClient();
  const { data: course, isLoading } = useQuery({
    queryKey: ["admin", "course", id],
    queryFn: () => data.admin.getCourse(id),
  });
  const [editing, setEditing] = useState<Editing | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "course", id] });
    qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    qc.invalidateQueries({ queryKey: ["courses"] });
  };

  const publish = useMutation({
    mutationFn: (val: boolean) =>
      data.admin.upsertCourse({
        id: course!.id,
        slug: course!.slug,
        title: course!.title,
        description: course!.description,
        level: course!.level,
        category: course!.category,
        isPublished: val,
      }),
    onSuccess: () => {
      toast.success("סטטוס הקורס עודכן");
      invalidate();
    },
  });
  const addModule = useMutation({
    mutationFn: (title: string) => data.admin.addModule(course!.id, title),
    onSuccess: () => {
      toast.success("מודול נוסף");
      invalidate();
    },
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  if (!course) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="הקורס לא נמצא"
            action={
              <Link to="/admin/courses" className="btn-primary text-small">
                חזרה
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/admin/courses"
        className="mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent"
      >
        <ArrowRight className="h-4 w-4" />
        כל הקורסים
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="label-mono">{course.category}</span>
          <h1 className="mt-1 text-h1 text-ink">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-small text-muted">{course.isPublished ? "פורסם" : "טיוטה"}</span>
          <button
            onClick={() => publish.mutate(!course.isPublished)}
            className={course.isPublished ? "btn-secondary text-small" : "btn-primary text-small"}
          >
            {course.isPublished ? "העבר לטיוטה" : "פרסם קורס"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[38%_1fr]">
        {/* עץ הקורס */}
        <div className="space-y-3">
          {course.modules.map((m, mi) => (
            <div key={m.id} className="surface-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px]"
                  style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                >
                  {String(mi + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-body font-medium text-ink">{m.title}</span>
              </div>
              <ul className="p-2">
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setEditing({ moduleId: m.id, lesson: l })}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-small transition-colors hover:bg-[color:var(--panel-2)]"
                      style={
                        editing?.lesson?.id === l.id
                          ? { background: "var(--accent-faint)", color: "var(--accent)" }
                          : { color: "var(--ink-2)" }
                      }
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span className="flex-1 truncate">{l.title}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setEditing({ moduleId: m.id, lesson: null })}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-start text-small text-muted transition-colors hover:text-accent"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    הוסף שיעור
                  </button>
                </li>
              </ul>
            </div>
          ))}
          <AddModuleButton onAdd={(t) => addModule.mutate(t)} />
        </div>

        {/* עורך ההקשר */}
        <div>
          {editing ? (
            <LessonEditor
              key={editing.lesson?.id ?? "new"}
              moduleId={editing.moduleId}
              lesson={editing.lesson}
              onSaved={() => {
                invalidate();
              }}
            />
          ) : (
            <div className="surface-card">
              <EmptyState
                title="בחר שיעור לעריכה"
                description="או הוסף שיעור חדש למודול כדי להעלות תוכן."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddModuleButton({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary flex w-full items-center justify-center gap-2 text-small"
      >
        <FolderPlus className="h-4 w-4" />
        מודול חדש
      </button>
    );
  }
  return (
    <div className="surface-card flex items-center gap-2 p-3">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="שם המודול"
      />
      <button
        onClick={() => {
          if (title.trim()) {
            onAdd(title);
            setTitle("");
            setOpen(false);
          }
        }}
        className="btn-primary text-small"
      >
        הוסף
      </button>
    </div>
  );
}

function LessonEditor({
  moduleId,
  lesson,
  onSaved,
}: {
  moduleId: string;
  lesson: Lesson | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [videoId, setVideoId] = useState(lesson?.videoId ?? "");
  const [minutes, setMinutes] = useState(lesson ? Math.round(lesson.durationSec / 60) : 8);
  const [provider] = useState<Lesson["videoProvider"]>(lesson?.videoProvider ?? "youtube");

  useEffect(() => {
    setTitle(lesson?.title ?? "");
    setVideoId(lesson?.videoId ?? "");
    setMinutes(lesson ? Math.round(lesson.durationSec / 60) : 8);
  }, [lesson]);

  const save = useMutation({
    mutationFn: () =>
      data.admin.upsertLesson({
        id: lesson?.id,
        moduleId,
        title,
        durationSec: minutes * 60,
        videoProvider: provider,
        videoId,
        orderIndex: lesson?.orderIndex ?? 999,
      }),
    onSuccess: () => {
      toast.success(lesson ? "השיעור עודכן" : "השיעור נוסף");
      onSaved();
    },
  });

  const previewUrl = videoId ? getVideoAdapter(provider).getEmbedUrl(videoId) : null;

  return (
    <div className="surface-card p-5">
      <h3 className="mb-4 text-h3 text-ink">{lesson ? "עריכת שיעור" : "שיעור חדש"}</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-small text-ink-2">שם השיעור</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="לדוגמה: בניית פרסונת קהל יעד"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-small text-ink-2">מזהה וידאו (YouTube)</label>
            <Input
              dir="ltr"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="aqz-KE-bpKQ"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-small text-ink-2">אורך (דקות)</label>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* תצוגה מקדימה חיה */}
        <div>
          <span className="label-mono">תצוגה מקדימה</span>
          <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-line bg-bg">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="preview"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-small text-muted">
                הזן מזהה וידאו כדי לראות תצוגה מקדימה
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => title.trim() && videoId.trim() && save.mutate()}
          disabled={!title.trim() || !videoId.trim() || save.isPending}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {lesson ? "שמירת שינויים" : "הוספת השיעור"}
        </button>
      </div>
    </div>
  );
}
