// src/components/greenhouse/GrowthIcons.tsx — שישה סמלי דרגה בעבודת יד (פרק 1.3)
// stroke 1.5, צבע accent; מילוי זוהר רק כשהדרגה פעילה. אין אימוג'י.
import type { GrowthStage } from "../../lib/data/types";

type Props = {
  stage: GrowthStage;
  size?: number;
  active?: boolean;
  className?: string;
};

const stroke = "var(--accent)";
const glow = "color-mix(in srgb, var(--accent) 10%, transparent)";

export function GrowthIcon({ stage, size = 24, active = false, className = "" }: Props) {
  const fill = active ? glow : "none";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: active ? stroke : "var(--muted-2)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };

  switch (stage) {
    case "seed":
      return (
        <svg {...common}>
          <line x1="4" y1="19" x2="20" y2="19" />
          <ellipse cx="12" cy="13.5" rx="3.2" ry="4.5" fill={fill} />
        </svg>
      );
    case "sprout":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <path d="M12 20 V11" />
          <path d="M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z" fill={fill} />
          <path d="M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z" fill={fill} />
        </svg>
      );
    case "sapling":
      return (
        <svg {...common}>
          <path d="M5 20 Q5 8 12 5 Q19 8 19 20" opacity="0.55" />
          <line x1="6" y1="20" x2="18" y2="20" />
          <path d="M12 20 V9" />
          <path d="M12 12 C9.5 12 8 10.5 8 8.5 C10.2 8.5 12 10 12 12Z" fill={fill} />
          <path d="M12 12 C14.5 12 16 10.5 16 8.5 C13.8 8.5 12 10 12 12Z" fill={fill} />
          <path d="M12 15.5 C10 15.5 8.8 14.3 8.8 12.7 C10.6 12.7 12 13.9 12 15.5Z" fill={fill} />
          <path d="M12 15.5 C14 15.5 15.2 14.3 15.2 12.7 C13.4 12.7 12 13.9 12 15.5Z" fill={fill} />
        </svg>
      );
    case "blooming":
      return (
        <svg {...common}>
          <line x1="5" y1="20" x2="19" y2="20" />
          <path d="M12 20 V13" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="12"
              cy="7.5"
              rx="1.7"
              ry="3.4"
              fill={fill}
              transform={`rotate(${a} 12 10)`}
            />
          ))}
          <circle cx="12" cy="10" r="1.6" fill={active ? stroke : "var(--muted-2)"} />
        </svg>
      );
    case "tree":
      return (
        <svg {...common}>
          <line x1="5" y1="20" x2="19" y2="20" />
          <path d="M12 20 V12" />
          <circle cx="9" cy="9" r="4.2" fill={fill} />
          <circle cx="15" cy="9" r="4.2" fill={fill} />
        </svg>
      );
    case "grower":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <path d="M8 20 V13" />
          <circle cx="6" cy="10.5" r="3" fill={fill} />
          <circle cx="10" cy="10.5" r="3" fill={fill} />
          <path d="M16 20 V17" />
          <path d="M16 18 C14.8 18 14 17 14 15.8 C15.2 15.8 16 16.8 16 18Z" fill={fill} />
          <path d="M16 18 C17.2 18 18 17 18 15.8 C16.8 15.8 16 16.8 16 18Z" fill={fill} />
        </svg>
      );
  }
}
