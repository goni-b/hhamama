import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-Dw_kDE_a.js
var import_jsx_runtime = require_jsx_runtime();
function SeedSprite() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: 80,
		height: 80,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		className: "animate-float",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "4",
				y1: "20",
				x2: "20",
				y2: "20",
				stroke: "var(--accent-border)",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 20 V11",
				stroke: "var(--accent-border)",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z",
				fill: "var(--accent-faint)",
				stroke: "var(--accent-border)",
				strokeWidth: "1.2",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z",
				fill: "var(--accent-faint)",
				stroke: "var(--accent-border)",
				strokeWidth: "1.2",
				strokeLinejoin: "round"
			})
		]
	});
}
function EmptyState({ title, description, action, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
		children: [
			icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeedSprite, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-h3 text-ink",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-small text-muted",
				children: description
			}),
			action
		]
	});
}
//#endregion
export { EmptyState as t };
