import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Pencil, k as Plus, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses-BawzB0aS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function slugify(s) {
	return s.trim().toLowerCase().replace(/[^a-z0-9֐-׿]+/g, "-").replace(/^-|-$/g, "") || `course-${Date.now()}`;
}
function AdminCoursesPage() {
	const qc = useQueryClient();
	const { data: courses } = useQuery({
		queryKey: ["admin", "courses"],
		queryFn: () => data.admin.listCourses()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "ניהול קורסים"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-h1 text-ink",
				children: "הקורסים בחממה"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCourseDialog, { onCreated: () => qc.invalidateQueries({ queryKey: ["admin", "courses"] }) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: (courses ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/courses/$id",
				params: { id: c.id },
				className: "surface-card block p-5 transition-all hover:-translate-y-[3px] hover:border-[color:var(--accent-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-6 w-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border px-2 py-0.5 label-mono",
							style: c.isPublished ? {
								borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
								color: "var(--success)"
							} : {
								borderColor: "var(--line)",
								color: "var(--muted)"
							},
							children: c.isPublished ? "פורסם" : "טיוטה"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-h3 text-ink",
						children: c.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 font-mono text-[11px] tabular text-muted",
						children: [
							c.modules.length,
							" מודולים · ",
							c.lessonsCount,
							" שיעורים"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 inline-flex items-center gap-1.5 text-small text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), "עריכה"]
					})
				]
			}, c.id))
		})]
	});
}
function NewCourseDialog({ onCreated }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("AI");
	const create = useMutation({
		mutationFn: () => data.admin.upsertCourse({
			title,
			slug: slugify(title),
			description: "",
			level: "beginner",
			category,
			isPublished: false
		}),
		onSuccess: () => {
			toast.success("הקורס נוצר כטיוטה");
			setTitle("");
			onCreated();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "btn-primary inline-flex items-center gap-2 text-small",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "קורס חדש"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "glass-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "text-ink",
			children: "קורס חדש"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-small text-ink-2",
					children: "שם הקורס"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "לדוגמה: קמפיינר AI — מתקדמים"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-small text-ink-2",
					children: "קטגוריה"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"AI",
						"שיווק",
						"קופי",
						"אוטומציות"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCategory(c),
						className: "rounded-full border px-3 py-1 text-[12px] transition-all",
						style: {
							borderColor: category === c ? "var(--accent)" : "var(--line)",
							background: category === c ? "var(--accent-faint)" : "transparent",
							color: category === c ? "var(--accent)" : "var(--muted)"
						},
						children: c
					}, c))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => title.trim() && create.mutate(),
					disabled: !title.trim() || create.isPending,
					className: "btn-primary w-full disabled:opacity-50",
					children: "יצירת קורס"
				})
			]
		})]
	})] });
}
//#endregion
export { AdminCoursesPage as component };
