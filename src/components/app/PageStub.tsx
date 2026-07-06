// src/components/app/PageStub.tsx — עמוד ביניים לפני שהפאזה שלו נבנית.
// מספק כותרת + מצב ריק מכוון-קדימה, כך שאין מבוי סתום (עקרון חוויה 4).
import { EmptyState } from "../greenhouse/EmptyState";

export function PageStub({
  eyebrow,
  title,
  emptyTitle,
  emptyDescription,
}: {
  eyebrow: string;
  title: string;
  emptyTitle: string;
  emptyDescription?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative mb-8">
        <span className="ghost-number" aria-hidden="true">
          {eyebrow.slice(0, 2)}
        </span>
        <span className="label-mono">{eyebrow}</span>
        <h1 className="mt-1 text-h1 text-ink">{title}</h1>
      </div>
      <div className="surface-card">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    </div>
  );
}
