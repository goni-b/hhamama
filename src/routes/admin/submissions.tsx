// src/routes/admin/submissions.tsx — תור בדיקת הגשות (פרק 3.4 §21)
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck } from "lucide-react";
import { data } from "../../lib/data";
import { EmptyState } from "../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/admin/submissions")({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const { data: queue } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: () => data.admin.submissionsQueue.list(),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <span className="label-mono">בדיקת הגשות</span>
        <h1 className="mt-1 text-h1 text-ink">התור שלך</h1>
      </div>
      <div className="surface-card">
        {queue && queue.length > 0 ? (
          <ul className="divide-y divide-line-soft">
            {queue.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-body text-ink">{s.studentName}</div>
                  <div className="text-small text-muted">{s.assignmentTitle}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-[12px]">בקשי תיקון</button>
                  <button className="btn-primary text-[12px]">אשרי</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={
              <ClipboardCheck
                className="h-16 w-16"
                style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
              />
            }
            title="כל ההגשות נבדקו"
            description="מודול המבחנים וההגשות ייכנס בפאזה הבאה. התור יתמלא כשחברים יתחילו להגיש."
          />
        )}
      </div>
    </div>
  );
}
