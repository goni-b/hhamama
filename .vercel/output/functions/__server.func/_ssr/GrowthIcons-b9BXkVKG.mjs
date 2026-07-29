import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GrowthIcons-b9BXkVKG.js
var import_jsx_runtime = require_jsx_runtime();
var stroke = "var(--accent)";
var glow = "color-mix(in srgb, var(--accent) 10%, transparent)";
function GrowthIcon({ stage, size = 24, active = false, className = "" }) {
	const fill = active ? glow : "none";
	const common = {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: active ? stroke : "var(--muted-2)",
		strokeWidth: 1.5,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": true,
		className
	};
	switch (stage) {
		case "seed": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "4",
				y1: "19",
				x2: "20",
				y2: "19"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "12",
				cy: "13.5",
				rx: "3.2",
				ry: "4.5",
				fill
			})]
		});
		case "sprout": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "4",
					y1: "20",
					x2: "20",
					y2: "20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20 V11" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z",
					fill
				})
			]
		});
		case "sapling": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M5 20 Q5 8 12 5 Q19 8 19 20",
					opacity: "0.55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "6",
					y1: "20",
					x2: "18",
					y2: "20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20 V9" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 12 C9.5 12 8 10.5 8 8.5 C10.2 8.5 12 10 12 12Z",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 12 C14.5 12 16 10.5 16 8.5 C13.8 8.5 12 10 12 12Z",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 15.5 C10 15.5 8.8 14.3 8.8 12.7 C10.6 12.7 12 13.9 12 15.5Z",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 15.5 C14 15.5 15.2 14.3 15.2 12.7 C13.4 12.7 12 13.9 12 15.5Z",
					fill
				})
			]
		});
		case "blooming": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "5",
					y1: "20",
					x2: "19",
					y2: "20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20 V13" }),
				[
					0,
					72,
					144,
					216,
					288
				].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "12",
					cy: "7.5",
					rx: "1.7",
					ry: "3.4",
					fill,
					transform: `rotate(${a} 12 10)`
				}, a)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "10",
					r: "1.6",
					fill: active ? stroke : "var(--muted-2)"
				})
			]
		});
		case "tree": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "5",
					y1: "20",
					x2: "19",
					y2: "20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20 V12" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "9",
					r: "4.2",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "15",
					cy: "9",
					r: "4.2",
					fill
				})
			]
		});
		case "grower": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			...common,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "4",
					y1: "20",
					x2: "20",
					y2: "20"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 20 V13" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "6",
					cy: "10.5",
					r: "3",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "10",
					cy: "10.5",
					r: "3",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 20 V17" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 18 C14.8 18 14 17 14 15.8 C15.2 15.8 16 16.8 16 18Z",
					fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 18 C17.2 18 18 17 18 15.8 C16.8 15.8 16 16.8 16 18Z",
					fill
				})
			]
		});
	}
}
//#endregion
export { GrowthIcon as t };
