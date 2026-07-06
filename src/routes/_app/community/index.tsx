// src/routes/_app/community/index.tsx — הקהילה (פרק 3.3 §9)
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Send, Users } from "lucide-react";
import { data } from "../../../lib/data";
import { copy } from "../../../lib/copy";
import { useSession } from "../../../hooks/useSession";
import { staggerContainer, revealUp, useGatedVariants } from "../../../lib/motion";
import { CommunityPostCard } from "../../../components/greenhouse/CommunityPostCard";
import { EmptyState } from "../../../components/greenhouse/EmptyState";
import { GrowthRing } from "../../../components/greenhouse/GrowthRing";

export const Route = createFileRoute("/_app/community/")({
  component: CommunityPage,
});

const CHANNELS = [
  { id: "all", label: "הכל" },
  { id: "general", label: "דיון" },
  { id: "wins", label: "ניצחונות" },
  { id: "questions", label: "שאלות" },
  { id: "announcements", label: "הכרזות צוות" },
];

function CommunityPage() {
  const { profile } = useSession();
  const qc = useQueryClient();
  const [channel, setChannel] = useState("all");
  const gated = useGatedVariants(revealUp);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", channel],
    queryFn: () => data.community.listPosts(channel === "all" ? undefined : channel),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative mb-6">
        <span className="ghost-number" aria-hidden="true">
          06
        </span>
        <span className="label-mono">הקהילה</span>
        <h1 className="mt-1 text-h1 text-ink">החברים שגדלים איתך</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        <div>
          {profile && (
            <Composer
              onPosted={() => qc.invalidateQueries({ queryKey: ["posts"] })}
              authorName={profile.fullName}
              authorStage={profile.growthStage}
            />
          )}

          {/* ערוצים */}
          <div className="my-5 flex flex-wrap gap-2">
            {CHANNELS.map((c) => {
              const active = channel === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className="rounded-full border px-4 py-1.5 text-small transition-all"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--line)",
                    background: active ? "var(--accent-faint)" : "transparent",
                    color: active ? "var(--accent)" : "var(--ink-2)",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-40 rounded-lg" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              className="space-y-4"
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
            >
              {posts.map((p) => (
                <motion.div key={p.id} variants={gated}>
                  <CommunityPostCard post={p} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="surface-card">
              <EmptyState title={copy["empty.communityFeed"]} />
            </div>
          )}
        </div>

        {/* עמודת צד */}
        <aside className="space-y-5">
          <div className="surface-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="label-mono">נוכחות</span>
            </div>
            <p className="text-small text-ink-2">14 חברים בחממה עכשיו</p>
          </div>
          <div className="surface-card p-5">
            <span className="label-mono">כללי הקהילה</span>
            <ul className="mt-3 space-y-2 text-small text-ink-2">
              <li>מכבדים, תומכים, לא שופטים.</li>
              <li>חולקים ניצחונות — קטנים כגדולים.</li>
              <li>שואלים בלי בושה. כולנו למדנו פעם.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Composer({
  onPosted,
  authorName,
  authorStage,
}: {
  onPosted: () => void;
  authorName: string;
  authorStage: import("../../../lib/data/types").GrowthStage;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [ch, setCh] = useState("general");

  const create = useMutation({
    mutationFn: () => data.community.createPost({ body, channel: ch }),
    onSuccess: () => {
      toast.success(copy["success.postPublished"]);
      setBody("");
      setOpen(false);
      onPosted();
    },
  });

  return (
    <div className="surface-card p-4">
      <div className="flex items-center gap-3">
        <GrowthRing size="sm" tier={authorStage} progress={0} name={authorName} />
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="flex-1 rounded-full border border-line bg-bg-2 px-4 py-2.5 text-start text-small text-muted transition-colors hover:border-[color:var(--accent-border)]"
          >
            מה למדת היום?
          </button>
        ) : (
          <span className="text-small text-ink-2">שיתוף עם הקהילה</span>
        )}
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="ספר לקהילה..."
            className="min-h-[100px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {[
                ["general", "דיון"],
                ["wins", "ניצחון"],
                ["questions", "שאלה"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setCh(id)}
                  className="rounded-full border px-3 py-1 text-[12px] transition-all"
                  style={{
                    borderColor: ch === id ? "var(--accent)" : "var(--line)",
                    background: ch === id ? "var(--accent-faint)" : "transparent",
                    color: ch === id ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => body.trim() && create.mutate()}
              disabled={!body.trim() || create.isPending}
              className="btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              פרסום
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
