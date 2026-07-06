// src/components/brand/Logo.tsx — "הזרע הזוהר" (פרק 1.2)
// שתי טבעות חופפות שהחפיפה שלהן היא זרע זוהר, תחת קשת חממה/עלה.
import { useId } from "react";

type Variant = "full" | "mark" | "wordmark";

export function Logo({
  variant = "full",
  size = 40,
  animated = false,
  className = "",
}: {
  variant?: Variant;
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const arcGrad = `arc-${uid}`;
  const seedGrad = `seed-${uid}`;
  const blurId = `blur-${uid}`;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={arcGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent-3)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
        <radialGradient id={seedGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--ink)" />
          <stop offset="40%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* קשת חממה/עלה + קו אדמה */}
      <path
        d="M10 46 Q10 12 32 6 M54 46 Q54 12 32 6"
        stroke={`url(#${arcGrad})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 46 H50"
        stroke={`url(#${arcGrad})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* זוהר הזרע (מאחור) */}
      <ellipse
        cx="32"
        cy="32"
        rx="8"
        ry="11"
        fill={`url(#${seedGrad})`}
        filter={`url(#${blurId})`}
        opacity="0.6"
        className={animated ? "animate-breathe" : undefined}
        style={{ transformOrigin: "32px 32px" }}
      />

      {/* שתי הטבעות (המורשת) */}
      <circle
        cx="26"
        cy="32"
        r="9"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.85"
        fill="none"
      />
      <circle
        cx="38"
        cy="32"
        r="9"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.85"
        fill="none"
      />

      {/* הזרע הזוהר במרכז החפיפה */}
      <ellipse cx="32" cy="32" rx="4.5" ry="7" fill={`url(#${seedGrad})`} />

      {/* נקודת האור בחוד */}
      <circle cx="32" cy="6" r="4" fill="var(--accent)" opacity="0.25" />
      <circle cx="32" cy="6" r="1.8" fill="var(--ink)" />
    </svg>
  );

  if (variant === "mark") return <span className={className}>{mark}</span>;

  const wordmark = (
    <span className="flex flex-col leading-none">
      <span className="text-[17px] font-extrabold text-ink">החממה</span>
      <span className="display-latin mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
        HOFIT &amp; GONI
      </span>
    </span>
  );

  if (variant === "wordmark") return <span className={className}>{wordmark}</span>;

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {mark}
      {wordmark}
    </span>
  );
}
