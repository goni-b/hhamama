import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { o as tierName } from "./data-BDcPQam0.mjs";
import { t as GrowthIcon } from "./GrowthIcons-b9BXkVKG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GrowthRing-A3PAOQq6.js
var import_jsx_runtime = require_jsx_runtime();
var SIZES = {
	sm: 44,
	md: 64,
	lg: 96
};
var C = 2 * Math.PI * 46;
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("");
}
function GrowthRing({ progress, tier, size = "md", src, name, breathe = false }) {
	const px = SIZES[size];
	const clamped = Math.min(1, Math.max(0, progress));
	const badge = Math.round(px * .28);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0",
		style: {
			width: px,
			height: px
		},
		role: "img",
		"aria-label": `דרגת ${tierName(tier)}, התקדמות ${Math.round(clamped * 100)}%`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: `-rotate-90 ${breathe ? "animate-breathe" : ""}`,
				width: px,
				height: px,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "ringGold",
						x1: "0",
						y1: "0",
						x2: "1",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0",
							stopColor: "var(--accent-3)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "1",
							stopColor: "var(--accent-2)"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "50",
						cy: "50",
						r: "46",
						fill: "none",
						stroke: "var(--line)",
						strokeWidth: "4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
						cx: "50",
						cy: "50",
						r: "46",
						fill: "none",
						stroke: "url(#ringGold)",
						strokeWidth: "4",
						strokeLinecap: "round",
						strokeDasharray: C,
						initial: { strokeDashoffset: C },
						whileInView: { strokeDashoffset: C * (1 - clamped) },
						viewport: { once: true },
						transition: {
							duration: 1.2,
							ease: EASE
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-[10%] flex items-center justify-center overflow-hidden rounded-full bg-panel-2",
				"aria-hidden": "true",
				children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-accent",
					style: { fontSize: px * .3 },
					children: initials(name)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -bottom-0.5 flex items-center justify-center rounded-full border border-line bg-panel shadow-[var(--elev-1)]",
				style: {
					width: badge,
					height: badge,
					insetInlineStart: 0
				},
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthIcon, {
					stage: tier,
					size: badge * .7,
					active: true
				})
			})
		]
	});
}
//#endregion
export { GrowthRing as t };
