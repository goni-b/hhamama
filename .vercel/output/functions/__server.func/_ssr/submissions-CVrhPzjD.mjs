import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { lt as ClipboardCheck } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/submissions-CVrhPzjD.js
var import_jsx_runtime = require_jsx_runtime();
function SubmissionsPage() {
	const { data: queue } = useQuery({
		queryKey: ["admin", "submissions"],
		queryFn: () => data.admin.submissionsQueue.list()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "בדיקת הגשות"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-h1 text-ink",
				children: "התור שלך"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: queue && queue.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line-soft",
				children: queue.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-body text-ink",
						children: s.studentName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-small text-muted",
						children: s.assignmentTitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn-secondary text-[12px]",
							children: "בקשי תיקון"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn-primary text-[12px]",
							children: "אשרי"
						})]
					})]
				}, s.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, {
					className: "h-16 w-16",
					style: { color: "color-mix(in srgb, var(--accent) 45%, transparent)" }
				}),
				title: "כל ההגשות נבדקו",
				description: "מודול המבחנים וההגשות ייכנס בפאזה הבאה. התור יתמלא כשחברים יתחילו להגיש."
			})
		})]
	});
}
//#endregion
export { SubmissionsPage as component };
