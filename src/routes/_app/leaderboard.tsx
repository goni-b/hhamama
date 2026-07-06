import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { EmptyState } from "../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/leaderboard")({
  component: () => (
    <div className="mx-auto max-w-4xl">
      <div className="relative mb-8">
        <span className="label-mono">טבלת המובילים</span>
        <h1 className="mt-1 text-h1 text-ink">צמרת החממה</h1>
      </div>
      <div className="surface-card">
        <EmptyState
          icon={
            <Trophy
              className="h-16 w-16"
              style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
            />
          }
          title="בקרוב"
          description="לוח המובילים השבועי, החודשי והליגות לפי דרגות — עולה בקרוב."
        />
      </div>
    </div>
  ),
});
