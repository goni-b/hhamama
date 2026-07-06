// src/components/greenhouse/CommunityPostCard.tsx — כרטיס פוסט קהילה (פרק 4.4.9)
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sprout, Award, Target, TrendingUp, MessageSquare, Pin } from "lucide-react";
import type { Post, ReactionKind } from "../../lib/data/types";
import { tierName } from "../../lib/data/types";
import { data } from "../../lib/data";
import { GrowthRing } from "./GrowthRing";

export const REACTIONS: { kind: ReactionKind; label: string; icon: typeof Sprout }[] = [
  { kind: "grow", label: "מצמיח", icon: Sprout },
  { kind: "gold", label: "זהב", icon: Award },
  { kind: "precise", label: "קולע", icon: Target },
  { kind: "lift", label: "מרים", icon: TrendingUp },
];

const CHANNEL_HE: Record<string, string> = {
  general: "דיון",
  wins: "ניצחון",
  questions: "שאלה",
  announcements: "הכרזת צוות",
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "עכשיו";
  if (m < 60) return `לפני ${m} דק'`;
  const h = Math.floor(m / 60);
  if (h < 24) return `לפני ${h} שע'`;
  const d = Math.floor(h / 24);
  return `לפני ${d} ימים`;
}

export function CommunityPostCard({
  post,
  linkToPost = true,
}: {
  post: Post;
  linkToPost?: boolean;
}) {
  const [myReactions, setMyReactions] = useState<ReactionKind[]>(post.myReactions);

  const toggle = useMutation({
    mutationFn: (kind: ReactionKind) => data.community.toggleReaction(post.id, kind),
  });

  function onReact(kind: ReactionKind) {
    setMyReactions((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind],
    );
    toggle.mutate(kind);
  }

  const isMentor = post.authorRole !== "student";

  return (
    <article
      className="surface-card p-5"
      style={post.pinned ? { borderTop: "3px solid var(--accent)" } : undefined}
    >
      {post.pinned && (
        <div
          className="mb-2 inline-flex items-center gap-1.5 label-mono"
          style={{ color: "var(--accent)" }}
        >
          <Pin className="h-3 w-3" />
          נעוץ
        </div>
      )}
      <div className="flex items-center gap-3">
        <GrowthRing
          size="sm"
          tier={post.authorStage}
          progress={0}
          name={post.authorName}
          src={post.authorAvatarUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to="/profile/$username"
              params={{ username: post.authorUsername }}
              className="text-body font-medium text-ink hover:text-accent"
            >
              {post.authorName}
            </Link>
            {isMentor && (
              <span
                className="rounded px-1.5 py-0.5 label-mono"
                style={{ background: "var(--accent-surface)", color: "var(--accent)" }}
              >
                HOFIT &amp; GONI
              </span>
            )}
          </div>
          <div className="text-[12px] text-muted">
            דרגת {tierName(post.authorStage)} · {timeAgo(post.createdAt)} ·{" "}
            {CHANNEL_HE[post.channel] ?? post.channel}
          </div>
        </div>
      </div>

      {post.title && <h3 className="mt-3 text-h3 text-ink">{post.title}</h3>}
      <p className="mt-2 whitespace-pre-line text-body text-ink-2">{post.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {REACTIONS.map((r) => {
          const active = myReactions.includes(r.kind);
          const base = post.reactions[r.kind] ?? 0;
          const count =
            base +
            (active && !post.myReactions.includes(r.kind) ? 1 : 0) -
            (!active && post.myReactions.includes(r.kind) ? 1 : 0);
          const Icon = r.icon;
          return (
            <button
              key={r.kind}
              onClick={() => onReact(r.kind)}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition-all"
              style={{
                borderColor: active ? "var(--accent-border)" : "var(--line)",
                background: active ? "var(--accent-faint)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
              aria-label={r.label}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="font-mono tabular">{count > 0 ? count : ""}</span>
            </button>
          );
        })}
        {linkToPost && (
          <Link
            to="/community/post/$id"
            params={{ id: post.id }}
            className="ms-auto inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-accent"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="font-mono tabular">{post.commentsCount}</span> תגובות
          </Link>
        )}
      </div>
    </article>
  );
}
