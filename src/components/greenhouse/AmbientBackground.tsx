// src/components/greenhouse/AmbientBackground.tsx — שכבת האווירה הגלובלית (פרק 4.5)
// שני אורבי זהב מטושטשים + grain עדין. z-index -1, pointer-events none.

const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

export function AmbientBackground({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-[600ms]"
      style={{ opacity: dimmed ? 0 : 1 }}
      aria-hidden="true"
    >
      <div
        className="animate-orb-drift absolute rounded-full"
        style={{
          width: 640,
          height: 640,
          insetInlineStart: "-8vw",
          top: "-12vh",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="animate-orb-drift absolute rounded-full"
        style={{
          width: 820,
          height: 820,
          insetInlineEnd: "-10vw",
          bottom: "-16vh",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 6%, transparent), transparent 70%)",
          filter: "blur(120px)",
          animationDelay: "-45s",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${GRAIN}")`,
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
