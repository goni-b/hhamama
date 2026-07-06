// src/components/greenhouse/EmptyState.tsx — מצב ריק ממותג (פרק 4.4.12)
import { type ReactNode } from "react";

function SeedSprite() {
  return (
    <svg
      width={80}
      height={80}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-float"
    >
      <line
        x1="4"
        y1="20"
        x2="20"
        y2="20"
        stroke="var(--accent-border)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 20 V11" stroke="var(--accent-border)" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z"
        fill="var(--accent-faint)"
        stroke="var(--accent-border)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z"
        fill="var(--accent-faint)"
        stroke="var(--accent-border)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      {icon ?? <SeedSprite />}
      <h3 className="text-h3 text-ink">{title}</h3>
      {description && <p className="max-w-sm text-small text-muted">{description}</p>}
      {action}
    </div>
  );
}
