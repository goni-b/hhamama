// src/routes/admin/courses/$id.tsx — בונה הקורסים (פרק 3.4 §19)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Plus,
  Play,
  FolderPlus,
  Save,
  FileText,
  Link2,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react";
import { data } from "../../../lib/data";
import type { Lesson, LessonResourceInput } from "../../../lib/data/types";
import { getVideoAdapter, parseVideoUrl } from "../../../lib/video/provider";
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

/** שחזור קישור קנוני מתוך provider+id — לתצוגה בשדה הקישור בעריכה */
function canonicalVideoUrl(l: Lesson | null): string {
  if (!l?.videoId) return "";
  if (l.videoProvider === "vimeo") return `https://vimeo.com/${l.videoId}`;
  return `https://youtu.be/${l.videoId}`;
}

const PROVIDER_LABEL: Record<string, string> = { youtube: "YouTube", vimeo: "Vimeo" };

function kindForFile(name: string): LessonResourceInput["kind"] {
  return name.toLowerCase().endsWith(".pdf") ? "pdf" : "file";
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
  const [videoInput, setVideoInput] = useState(() => canonicalVideoUrl(lesson));
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [minutes, setMinutes] = useState(lesson ? Math.round(lesson.durationSec / 60) : 8);
  const [resources, setResources] = useState<LessonResourceInput[]>(
    () => lesson?.resources.map(({ title: t, kind, url }) => ({ title: t, kind, url })) ?? [],
  );

  useEffect(() => {
    setTitle(lesson?.title ?? "");
    setVideoInput(canonicalVideoUrl(lesson));
    setDescription(lesson?.description ?? "");
    setMinutes(lesson ? Math.round(lesson.durationSec / 60) : 8);
    setResources(
      lesson?.resources.map(({ title: t, kind, url }) => ({ title: t, kind, url })) ?? [],
    );
  }, [lesson]);

  const parsed = parseVideoUrl(videoInput);

  const save = useMutation({
    mutationFn: () =>
      data.admin.upsertLesson({
        id: lesson?.id,
        moduleId,
        title,
        description: description.trim(),
        durationSec: minutes * 60,
        videoProvider: parsed!.provider,
        videoId: parsed!.videoId,
        orderIndex: lesson?.orderIndex ?? 999,
        resources,
      }),
    onSuccess: () => {
      toast.success(lesson ? "השיעור עודכן" : "השיעור נוסף");
      onSaved();
    },
    onError: () => toast.error("השמירה נכשלה — נסה שוב"),
  });

  const previewUrl = parsed ? getVideoAdapter(parsed.provider).getEmbedUrl(parsed.videoId) : null;

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

        <div className="grid grid-cols-[1fr_110px] gap-3">
          <div>
            <label className="mb-1.5 flex items-center justify-between text-small text-ink-2">
              <span>קישור וידאו (YouTube / Vimeo)</span>
              {videoInput.trim() &&
                (parsed ? (
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                    style={{ background: "var(--accent-faint)", color: "var(--accent)" }}
                  >
                    {PROVIDER_LABEL[parsed.provider]}
                  </span>
                ) : (
                  <span className="font-mono text-[10px]" style={{ color: "var(--danger)" }}>
                    קישור לא מזוהה
                  </span>
                ))}
            </label>
            <Input
              dir="ltr"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="https://vimeo.com/76979871 או https://youtu.be/aqz-KE-bpKQ"
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

        <div>
          <label className="mb-1.5 block text-small text-ink-2">
            טקסט מתחת לווידאו (תיאור השיעור)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="מה לומדים בשיעור, דגשים, קישורים שהוזכרו..."
            className="min-h-[110px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
          />
        </div>

        <ResourcesEditor resources={resources} onChange={setResources} />

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
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-small text-muted">
                הדבק קישור וידאו כדי לראות תצוגה מקדימה
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => title.trim() && parsed && save.mutate()}
          disabled={!title.trim() || !parsed || save.isPending}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {save.isPending ? "שומרים..." : lesson ? "שמירת שינויים" : "הוספת השיעור"}
        </button>
      </div>
    </div>
  );
}

/* ---------- חומרי שיעור: קבצים וקישורים מתחת לווידאו ---------- */
function ResourcesEditor({
  resources,
  onChange,
}: {
  resources: LessonResourceInput[];
  onChange: (next: LessonResourceInput[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  async function onFilePicked(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await data.admin.uploadMaterial(file);
      onChange([...resources, { title: file.name, kind: kindForFile(file.name), url }]);
      toast.success("הקובץ הועלה — אל תשכח לשמור את השיעור");
    } catch {
      toast.error("ההעלאה נכשלה — נסה שוב");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addLink() {
    const url = linkUrl.trim();
    if (!url) return;
    onChange([
      ...resources,
      {
        title: linkTitle.trim() || url,
        kind: "link",
        url: url.startsWith("http") ? url : `https://${url}`,
      },
    ]);
    setLinkTitle("");
    setLinkUrl("");
    setLinkOpen(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-small text-ink-2">חומרים מצורפים (מתחת לווידאו)</label>
      <div className="rounded-lg border border-line bg-bg-2 p-3">
        {resources.length === 0 && (
          <p className="px-1 pb-2 text-small text-muted">אין חומרים — הוסף קובץ או קישור.</p>
        )}
        <ul className="space-y-1.5">
          {resources.map((r, i) => (
            <li
              key={`${r.url}-${i}`}
              className="flex items-center gap-2.5 rounded-md bg-[color:var(--panel)] px-3 py-2"
            >
              {r.kind === "link" ? (
                <Link2 className="h-4 w-4 shrink-0 text-accent" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-accent" />
              )}
              <span className="min-w-0 flex-1 truncate text-small text-ink-2">{r.title}</span>
              <span className="font-mono text-[10px] uppercase text-muted-2">{r.kind}</span>
              <button
                onClick={() => onChange(resources.filter((_, j) => j !== i))}
                className="text-muted transition-colors hover:text-[color:var(--danger)]"
                aria-label={`הסרת ${r.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => onFilePicked(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-secondary inline-flex items-center gap-1.5 text-small disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "מעלים..." : "העלאת קובץ"}
          </button>
          <button
            onClick={() => setLinkOpen((v) => !v)}
            className="btn-secondary inline-flex items-center gap-1.5 text-small"
          >
            <Paperclip className="h-3.5 w-3.5" />
            הוספת קישור
          </button>
        </div>

        {linkOpen && (
          <div className="mt-2.5 grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="כותרת (לדוגמה: תבנית לעבודה)"
            />
            <Input
              dir="ltr"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
            <button onClick={addLink} className="btn-primary text-small">
              הוסף
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
