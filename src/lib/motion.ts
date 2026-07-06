// src/lib/motion.ts — מקור אמת יחיד לכל תנועה ב"חממה"
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, type Variants } from "motion/react";

/* ---------- קבועים קנוניים ---------- */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

export const DUR = {
  micro: 0.16, // hover, toggle
  ui: 0.22, // פתיחת תפריט, tab, accordion
  enter: 0.7, // כניסת כרטיס/צ'יפ
  reveal: 0.85, // כניסת טקסט/סקשן
  hero: 0.9, // כניסות ראשונות בעמוד
} as const;

/* gating אחיד — פעם אחת, כשרבע מהאלמנט נראה */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/* ---------- Variants — כניסות ---------- */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
};

/* RTL: תוכן נכנס מימין — x חיובי (transform הוא פיזי, לא לוגי) */
export const revealFromRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.enter, ease: EASE } },
};

export const chipPop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export const staggerContainer = (stagger = 0.08, delay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/* SVG שמצייר את עצמו — לגרפים, טבעות, קווי דיאגרמה */
export const drawIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.2, ease: EASE }, opacity: { duration: 0.3 } },
  },
};

/* זוהר נושם — לאלמנט פעיל אחד לכל היותר בכל viewport */
export const accentGlow = {
  boxShadow: [
    "0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)",
    "0 0 40px color-mix(in srgb, var(--accent) 50%, transparent)",
    "0 0 20px color-mix(in srgb, var(--accent) 30%, transparent)",
  ],
  transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
} as const;

/* ---------- Reduced motion ---------- */
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

/** עוטף כל variants: אם המשתמש ביקש reduced motion — fade בלבד. */
export function useGatedVariants(v: Variants): Variants {
  const reduced = useReducedMotion();
  return reduced ? fadeOnly : v;
}

/* ---------- countUp — מונה עולה (XP, סטטיסטיקות, KPI) ---------- */
export function useCountUp(
  target: number,
  duration = 1.4,
): {
  ref: React.RefObject<HTMLSpanElement | null>;
  value: number;
} {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);

  return { ref, value };
}
