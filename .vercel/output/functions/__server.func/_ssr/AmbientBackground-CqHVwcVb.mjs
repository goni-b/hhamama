import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AmbientBackground-CqHVwcVb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Logo({ variant = "full", size = 40, animated = false, className = "" }) {
	const uid = (0, import_react.useId)().replace(/:/g, "");
	const arcGrad = `arc-${uid}`;
	const seedGrad = `seed-${uid}`;
	const blurId = `blur-${uid}`;
	const mark = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 64 64",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: arcGrad,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "var(--accent-3)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "var(--accent-2)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: seedGrad,
					cx: "50%",
					cy: "50%",
					r: "50%",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0",
							stopColor: "var(--ink)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "40%",
							stopColor: "var(--accent)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "var(--accent)",
							stopOpacity: "0"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("filter", {
					id: blurId,
					x: "-50%",
					y: "-50%",
					width: "200%",
					height: "200%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", { stdDeviation: "2.5" })
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 46 Q10 12 32 6 M54 46 Q54 12 32 6",
				stroke: `url(#${arcGrad})`,
				strokeWidth: "2.5",
				strokeLinecap: "round",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 46 H50",
				stroke: `url(#${arcGrad})`,
				strokeWidth: "2.5",
				strokeLinecap: "round",
				opacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "32",
				cy: "32",
				rx: "8",
				ry: "11",
				fill: `url(#${seedGrad})`,
				filter: `url(#${blurId})`,
				opacity: "0.6",
				className: animated ? "animate-breathe" : void 0,
				style: { transformOrigin: "32px 32px" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "26",
				cy: "32",
				r: "9",
				stroke: "var(--accent)",
				strokeWidth: "2",
				opacity: "0.85",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "38",
				cy: "32",
				r: "9",
				stroke: "var(--accent)",
				strokeWidth: "2",
				opacity: "0.85",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "32",
				cy: "32",
				rx: "4.5",
				ry: "7",
				fill: `url(#${seedGrad})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "6",
				r: "4",
				fill: "var(--accent)",
				opacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "6",
				r: "1.8",
				fill: "var(--ink)"
			})
		]
	});
	if (variant === "mark") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: mark
	});
	const wordmark = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex flex-col leading-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[17px] font-extrabold text-ink",
			children: "החממה"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "display-latin mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted",
			children: "HOFIT & GONI"
		})]
	});
	if (variant === "wordmark") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: wordmark
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `flex items-center gap-2.5 ${className}`,
		children: [mark, wordmark]
	});
}
var GRAIN = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`);
function AmbientBackground({ dimmed = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-[600ms]",
		style: { opacity: dimmed ? 0 : 1 },
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-orb-drift absolute rounded-full",
				style: {
					width: 640,
					height: 640,
					insetInlineStart: "-8vw",
					top: "-12vh",
					background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)",
					filter: "blur(120px)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-orb-drift absolute rounded-full",
				style: {
					width: 820,
					height: 820,
					insetInlineEnd: "-10vw",
					bottom: "-16vh",
					background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 6%, transparent), transparent 70%)",
					filter: "blur(120px)",
					animationDelay: "-45s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: {
					backgroundImage: `url("${GRAIN}")`,
					opacity: .03,
					mixBlendMode: "overlay"
				}
			})
		]
	});
}
//#endregion
export { Logo as n, AmbientBackground as t };
