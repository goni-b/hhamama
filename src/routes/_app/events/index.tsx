import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { EmptyState } from "../../../components/greenhouse/EmptyState";

export const Route = createFileRoute("/_app/events/")({
  component: () => (
    <div className="mx-auto max-w-4xl">
      <div className="relative mb-8">
        <span className="label-mono">לייבים</span>
        <h1 className="mt-1 text-h1 text-ink">לייבים ושידורים חיים</h1>
      </div>
      <div className="surface-card">
        <EmptyState
          icon={
            <Radio
              className="h-16 w-16"
              style={{ color: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
            />
          }
          title="בקרוב"
          description="לוח הלייבים החודשיים, הספירה לאחור החיה וארכיון ההקלטות — עולה בקרוב."
        />
      </div>
    </div>
  ),
});
