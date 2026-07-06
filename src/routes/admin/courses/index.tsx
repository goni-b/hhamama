// src/routes/admin/courses/index.tsx — רשימת קורסים לניהול (פרק 3.4 §19)
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, BookOpen, Pencil } from "lucide-react";
import { data } from "../../../lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCoursesPage,
});

function slugify(s: string) {
  return (
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9֐-׿]+/g, "-")
      .replace(/^-|-$/g, "") || `course-${Date.now()}`
  );
}

function AdminCoursesPage() {
  const qc = useQueryClient();
  const { data: courses } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => data.admin.listCourses(),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="label-mono">ניהול קורסים</span>
          <h1 className="mt-1 text-h1 text-ink">הקורסים בחממה</h1>
        </div>
        <NewCourseDialog
          onCreated={() => qc.invalidateQueries({ queryKey: ["admin", "courses"] })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => (
          <Link
            key={c.id}
            to="/admin/courses/$id"
            params={{ id: c.id }}
            className="surface-card block p-5 transition-all hover:-translate-y-[3px] hover:border-[color:var(--accent-border)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <BookOpen className="h-6 w-6 text-accent" />
              <span
                className="rounded-full border px-2 py-0.5 label-mono"
                style={
                  c.isPublished
                    ? {
                        borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
                        color: "var(--success)",
                      }
                    : { borderColor: "var(--line)", color: "var(--muted)" }
                }
              >
                {c.isPublished ? "פורסם" : "טיוטה"}
              </span>
            </div>
            <h3 className="text-h3 text-ink">{c.title}</h3>
            <div className="mt-2 font-mono text-[11px] tabular text-muted">
              {c.modules.length} מודולים · {c.lessonsCount} שיעורים
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-small text-accent">
              <Pencil className="h-3.5 w-3.5" />
              עריכה
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewCourseDialog({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI");

  const create = useMutation({
    mutationFn: () =>
      data.admin.upsertCourse({
        title,
        slug: slugify(title),
        description: "",
        level: "beginner",
        category,
        isPublished: false,
      }),
    onSuccess: () => {
      toast.success("הקורס נוצר כטיוטה");
      setTitle("");
      onCreated();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-primary inline-flex items-center gap-2 text-small">
          <Plus className="h-4 w-4" />
          קורס חדש
        </button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle className="text-ink">קורס חדש</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-small text-ink-2">שם הקורס</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="לדוגמה: קמפיינר AI — מתקדמים"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-small text-ink-2">קטגוריה</label>
            <div className="flex flex-wrap gap-2">
              {["AI", "שיווק", "קופי", "אוטומציות"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="rounded-full border px-3 py-1 text-[12px] transition-all"
                  style={{
                    borderColor: category === c ? "var(--accent)" : "var(--line)",
                    background: category === c ? "var(--accent-faint)" : "transparent",
                    color: category === c ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => title.trim() && create.mutate()}
            disabled={!title.trim() || create.isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            יצירת קורס
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
