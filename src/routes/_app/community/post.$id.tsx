// src/routes/_app/community/post.$id.tsx — פוסט בודד + תגובות (פרק 3.3 §9)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { data } from "../../../lib/data";
import { tierName } from "../../../lib/data/types";
import { useSession } from "../../../hooks/useSession";
import { CommunityPostCard, timeAgo } from "../../../components/greenhouse/CommunityPostCard";
import { GrowthRing } from "../../../components/greenhouse/GrowthRing";
import { EmptyState } from "../../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/community/post/$id")({
  component: PostPage,
});

function PostPage() {
  const { id } = useParams({ from: "/_app/community/post/$id" });
  const { profile } = useSession();
  const qc = useQueryClient();
  const [body, setBody] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => data.community.getPost(id),
  });
  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => data.community.listComments(id),
  });

  const addComment = useMutation({
    mutationFn: () => data.community.addComment(id, body),
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-2xl">
        <div className="skeleton h-64 rounded-lg" />
      </div>
    );
  if (!post) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="הפוסט לא נמצא"
            action={
              <Link to="/community" className="btn-primary text-small">
                חזרה לקהילה
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/community"
        className="mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה לקהילה
      </Link>

      <CommunityPostCard post={post} linkToPost={false} />

      {/* הוספת תגובה */}
      {profile && (
        <div className="surface-card mt-5 p-4">
          <div className="flex items-start gap-3">
            <GrowthRing size="sm" tier={profile.growthStage} progress={0} name={profile.fullName} />
            <div className="flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="הוסף תגובה..."
                className="min-h-[70px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => body.trim() && addComment.mutate()}
                  disabled={!body.trim() || addComment.isPending}
                  className="btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  שליחה
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* תגובות */}
      <div className="mt-5 space-y-3">
        {(comments ?? []).map((c) => {
          const isMentor = false;
          return (
            <div
              key={c.id}
              className="surface-card p-4"
              style={isMentor ? { background: "var(--accent-surface)" } : undefined}
            >
              <div className="flex items-center gap-3">
                <GrowthRing size="sm" tier={c.authorStage} progress={0} name={c.authorName} />
                <div>
                  <div className="text-body font-medium text-ink">{c.authorName}</div>
                  <div className="text-[12px] text-muted">
                    דרגת {tierName(c.authorStage)} · {timeAgo(c.createdAt)}
                  </div>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line text-body text-ink-2">{c.body}</p>
            </div>
          );
        })}
        {comments && comments.length === 0 && (
          <p className="py-6 text-center text-small text-muted">
            אין עדיין תגובות. היה הראשון להגיב.
          </p>
        )}
      </div>
    </div>
  );
}
