import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Lock, _t as Check, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses-zugkyuup.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CourseCard({ course, progressPct = 0 }) {
	const locked = !!course.lockedReason;
	const completed = progressPct >= 100;
	const inProgress = progressPct > 0 && !completed;
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group surface-card overflow-hidden transition-all duration-200",
		style: { transition: "transform .2s var(--ease), box-shadow .2s var(--ease), border-color .2s var(--ease)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[16/10] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0",
					style: {
						background: "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%), linear-gradient(135deg, var(--panel-2), var(--bg-2))",
						filter: locked ? "grayscale(0.7) brightness(0.55)" : void 0
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
						className: "h-9 w-9",
						style: { color: "color-mix(in srgb, var(--accent) 55%, transparent)" }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 h-16",
					style: { background: "linear-gradient(to top, var(--bg) 10%, transparent)" }
				}),
				locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "glass-panel flex h-11 w-11 items-center justify-center rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						style: { color: "var(--accent)" },
						children: course.lockedReason
					})]
				}),
				completed && !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full",
					style: { background: "var(--grad-gold)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[#1a1206]" })
				}),
				inProgress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute end-3 top-3 rounded-full border px-2 py-0.5 label-mono",
					style: {
						borderColor: "var(--accent-border)",
						background: "var(--accent-faint)",
						color: "var(--accent)"
					},
					children: "בתהליך"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2.5 p-4",
			children: [
				course.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: course.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-h3 text-ink",
					children: course.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-[11px] tabular text-muted",
					children: [
						course.modules.length,
						" מודולים · ",
						course.lessonsCount,
						" שיעורים ·",
						" ",
						Math.floor(course.totalDurationMin / 60),
						":",
						String(course.totalDurationMin % 60).padStart(2, "0"),
						" שעות"
					]
				}),
				!locked && (progressPct > 0 || completed) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 overflow-hidden rounded-full",
						style: { background: "var(--panel-2)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full",
							style: {
								width: `${progressPct}%`,
								background: "var(--grad-gold)"
							}
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 font-mono text-[10.5px] tabular text-muted",
						children: [progressPct, "% הושלם"]
					})]
				})
			]
		})]
	});
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cursor-not-allowed",
		title: course.lockedReason ?? void 0,
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/courses/$slug",
		params: { slug: course.slug },
		className: "block transition-transform hover:-translate-y-[3px]",
		children: body
	});
}
var FILTERS = [
	{
		id: "all",
		label: "הכל"
	},
	{
		id: "mine",
		label: "הקורסים שלי"
	},
	{
		id: "AI",
		label: "AI"
	},
	{
		id: "שיווק",
		label: "שיווק"
	},
	{
		id: "קופי",
		label: "קופי"
	},
	{
		id: "אוטומציות",
		label: "אוטומציות"
	}
];
function CoursesPage() {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const gated = useGatedVariants(revealUp);
	const { data: courses, isLoading } = useQuery({
		queryKey: ["courses", filter],
		queryFn: () => data.courses.list(filter === "all" ? void 0 : { category: filter })
	});
	const { data: enrollments } = useQuery({
		queryKey: ["enrollments"],
		queryFn: () => data.courses.myEnrollments()
	});
	function pctFor(courseId) {
		const e = enrollments?.find((x) => x.courseId === courseId);
		if (!e || e.totalLessons === 0) return 0;
		return Math.round(e.completedLessons / e.totalLessons * 100);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ghost-number",
						"aria-hidden": "true",
						children: "03"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "ספריית הקורסים"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-h1 text-ink",
						children: "כל מה שיש לך לגדל"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: FILTERS.map((f) => {
					const active = filter === f.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(f.id),
						className: "rounded-full border px-4 py-1.5 text-small transition-all",
						style: {
							borderColor: active ? "var(--accent)" : "var(--line)",
							background: active ? "var(--accent-faint)" : "transparent",
							color: active ? "var(--accent)" : "var(--ink-2)"
						},
						children: f.label
					}, f.id);
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
				children: [
					0,
					1,
					2,
					3,
					4,
					5
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "skeleton aspect-[16/10] rounded-lg",
					style: { height: 280 }
				}, i))
			}) : courses && courses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
				variants: staggerContainer(.06),
				initial: "hidden",
				animate: "visible",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					variants: gated,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseCard, {
						course: c,
						progressPct: pctFor(c.id)
					})
				}, c.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "אין קורסים בקטגוריה הזו עדיין",
					description: "נסה קטגוריה אחרת — ספריית החממה גדלה כל הזמן."
				})
			})
		]
	});
}
//#endregion
export { CoursesPage as component };
