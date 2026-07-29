import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _t as Check, c as TriangleAlert, ct as ClipboardList, kt as ArrowLeft, mt as CircleAlert, st as Clock, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assignments-D_BnOnEr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "awaiting",
		label: "ממתינות"
	},
	{
		id: "submitted",
		label: "הוגשו"
	},
	{
		id: "approved",
		label: "אושרו"
	}
];
var TAB_EMPTY = {
	awaiting: {
		title: "אין משימות שממתינות לך כרגע",
		description: "הכל מטופל. משימות חדשות נפתחות עם ההתקדמות בקורסים."
	},
	submitted: {
		title: "אין הגשות בבדיקה",
		description: "משימות שתגיש יופיעו כאן עד שהמנטור יעבור עליהן."
	},
	approved: {
		title: "עוד אין משימות מאושרות",
		description: "ההגשה הראשונה בדרך לשם — כל אישור שווה 40 נקודות צמיחה."
	}
};
/** לאיזה טאב שייכת משימה: ללא הגשה או "דורש תיקון" — ממתינות; אחרת לפי הסטטוס */
function tabOf(a) {
	if (!a.mySubmission || a.mySubmission.status === "needs_fix") return "awaiting";
	if (a.mySubmission.status === "approved") return "approved";
	return "submitted";
}
function fmtDate(iso) {
	return new Intl.DateTimeFormat("he-IL", {
		day: "numeric",
		month: "long"
	}).format(new Date(iso));
}
var STATUS_META = {
	pending: {
		label: "ממתין לבדיקה",
		color: "var(--success)",
		Icon: Clock
	},
	needs_fix: {
		label: "דורש תיקון",
		color: "var(--warning)",
		Icon: TriangleAlert
	},
	approved: {
		label: "אושר",
		color: "var(--accent)",
		Icon: Check
	}
};
function StatusBadge({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]",
		style: {
			borderColor: "var(--line)",
			color: "var(--muted)"
		},
		children: "טרם הוגש"
	});
	const { label, color, Icon } = STATUS_META[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium",
		style: {
			borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
			background: `color-mix(in srgb, ${color} 10%, transparent)`,
			color
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
	});
}
function AssignmentsPage() {
	const [tab, setTab] = (0, import_react.useState)("awaiting");
	const gated = useGatedVariants(revealUp);
	const { data: assignments, isLoading, isError, refetch } = useQuery({
		queryKey: ["assignments"],
		queryFn: () => data.assignments.list()
	});
	const { data: courses } = useQuery({
		queryKey: ["courses"],
		queryFn: () => data.courses.list()
	});
	const header = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ghost-number",
				"aria-hidden": "true",
				children: "07"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "משימות"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-h1 text-ink",
				children: "המשימות שלך"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-small text-muted",
				children: "כאן הידע הופך לעבודה אמיתית — מגישים, מקבלים משוב מהמנטורים, וצומחים."
			})
		]
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			header,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 flex gap-2",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-9 w-24 rounded-full" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-36 rounded-lg" }, i))
			})
		]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [header, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
					className: "h-14 w-14",
					style: { color: "var(--danger)" }
				}),
				title: "לא הצלחנו לטעון את המשימות",
				description: copy["error.generic"],
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => refetch(),
					className: "btn-secondary text-small",
					children: "נסה שוב"
				})
			})
		})]
	});
	const list = assignments ?? [];
	if (list.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [header, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {
					className: "h-16 w-16",
					style: { color: "color-mix(in srgb, var(--accent) 45%, transparent)" }
				}),
				title: "עוד לא קיבלת משימות",
				description: "הן נפתחות עם ההתקדמות בקורסים. המשך לצפות — הן בדרך.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses",
					className: "btn-primary text-small",
					children: copy["cta.exploreLibrary"]
				})
			})
		})]
	});
	const courseById = new Map((courses ?? []).map((c) => [c.id, c]));
	const counts = {
		awaiting: 0,
		submitted: 0,
		approved: 0
	};
	for (const a of list) counts[tabOf(a)] += 1;
	const visible = list.filter((a) => tabOf(a) === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			header,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 flex flex-wrap gap-2",
				children: TABS.map((t) => {
					const active = tab === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab(t.id),
						className: "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-small transition-all",
						style: {
							borderColor: active ? "var(--accent)" : "var(--line)",
							background: active ? "var(--accent-faint)" : "transparent",
							color: active ? "var(--accent)" : "var(--ink-2)"
						},
						children: [t.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] tabular",
							style: { color: active ? "var(--accent)" : "var(--muted)" },
							children: counts[t.id]
						})]
					}, t.id);
				})
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: TAB_EMPTY[tab].title,
					description: TAB_EMPTY[tab].description
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "space-y-4",
				variants: staggerContainer(.06),
				initial: "hidden",
				animate: "visible",
				children: visible.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					variants: gated,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignmentCard, {
						assignment: a,
						course: courseById.get(a.courseId) ?? null
					})
				}, a.id))
			}, tab)
		]
	});
}
function AssignmentCard({ assignment, course }) {
	const status = assignment.mySubmission?.status ?? null;
	const overdue = (!status || status === "needs_fix") && !!assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now();
	const cta = !status ? "לצפייה והגשה" : status === "needs_fix" ? "לתיקון והגשה מחדש" : status === "pending" ? "לצפייה בהגשה" : "לצפייה במשוב";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-5 transition-colors hover:border-[color:var(--accent-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/assignments/$id",
						params: { id: assignment.id },
						className: "text-h3 text-ink transition-colors hover:text-accent",
						children: assignment.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted",
						children: [course && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses/$slug",
							params: { slug: course.slug },
							className: "inline-flex items-center gap-1.5 transition-colors hover:text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), course.title]
						}), assignment.dueAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							style: overdue ? { color: "var(--danger)" } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), overdue ? `עבר מועד ההגשה — ${fmtDate(assignment.dueAt)}` : `להגשה עד ${fmtDate(assignment.dueAt)}`]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 line-clamp-2 text-small text-ink-2",
				children: assignment.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/assignments/$id",
					params: { id: assignment.id },
					className: "inline-flex items-center gap-1.5 text-small text-accent transition-opacity hover:opacity-80",
					children: [cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })]
				})
			})
		]
	});
}
//#endregion
export { AssignmentsPage as component };
