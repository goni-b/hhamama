// src/routes/_app/profile.$username.tsx — פרופיל ציבורי (פרק 3.3 §13)
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { data } from "../../lib/data";
import { tierName, tierProgress } from "../../lib/data/types";
import { GrowthRing } from "../../components/greenhouse/GrowthRing";
import { EmptyState } from "../../components/greenhouse/EmptyState";
import { CommunityPostCard } from "../../components/greenhouse/CommunityPostCard";
import { EASE } from "../../lib/motion";

export const Route = createFileRoute("/_app/profile/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = useParams({ from: "/_app/profile/$username" });
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => data.profiles.getByUsername(username),
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-3xl">
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="surface-card">
          <EmptyState
            title="הפרופיל לא נמצא"
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

  const { progress } = tierProgress(profile.xpTotal);

  return (
    <div className="mx-auto max-w-3xl">
      <motion.section
        className="surface-card relative overflow-hidden p-7 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-5 text-center md:flex-row md:text-start">
          <GrowthRing
            size="lg"
            tier={profile.growthStage}
            progress={progress}
            name={profile.fullName}
            src={profile.avatarUrl}
            breathe
          />
          <div className="flex-1">
            <h1 className="text-h1 text-ink">{profile.fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="label-mono" style={{ color: "var(--accent)" }}>
                דרגת {tierName(profile.growthStage)}
              </span>
              <span className="font-mono text-[12px] tabular text-muted">
                {profile.xpTotal.toLocaleString("en-US")} XP
              </span>
              <span className="font-mono text-[12px] tabular text-muted">
                רצף {profile.streakDays} ימים
              </span>
            </div>
            {profile.bio && <p className="mt-3 text-body text-ink-2">{profile.bio}</p>}
          </div>
        </div>
      </motion.section>

      {/* הישגים */}
      {profile.achievements.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-h3 text-ink">תעודות נבחרות</h2>
          <div className="flex flex-wrap gap-2">
            {profile.achievements.map((a) => (
              <span
                key={a.id}
                className="rounded-full border px-3 py-1.5 text-small"
                style={{
                  borderColor: "var(--accent-border)",
                  background: "var(--accent-faint)",
                  color: "var(--accent)",
                }}
              >
                {a.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* פוסטים אחרונים */}
      {profile.recentPosts.length > 0 && (
        <section className="mt-6 space-y-4">
          <h2 className="text-h3 text-ink">פוסטים אחרונים</h2>
          {profile.recentPosts.map((p) => (
            <CommunityPostCard key={p.id} post={p} />
          ))}
        </section>
      )}
    </div>
  );
}
