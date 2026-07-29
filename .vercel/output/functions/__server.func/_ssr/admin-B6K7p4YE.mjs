import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { _ as Link, b as useRouter, p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as ArrowRight, U as LayoutDashboard, lt as ClipboardCheck, r as Users, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { n as Logo, t as AmbientBackground } from "./AmbientBackground-CqHVwcVb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B6K7p4YE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "דשבורד",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/members",
		label: "ניהול חברים",
		icon: Users,
		exact: false
	},
	{
		to: "/admin/courses",
		label: "ניהול קורסים",
		icon: BookOpen,
		exact: false
	},
	{
		to: "/admin/submissions",
		label: "בדיקת הגשות",
		icon: ClipboardCheck,
		exact: false
	}
];
function AdminShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-[240px] shrink-0 flex-col border-s border-line bg-bg-2 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						variant: "full",
						size: 34
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex-1 px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "ניהול"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: NAV.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								activeOptions: { exact: item.exact },
								className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-line-soft hover:text-ink",
								activeProps: { className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-accent bg-[color:var(--accent-faint)]" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-[18px] w-[18px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}) }, item.to);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-line-soft p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted transition-colors hover:text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), "חזרה לחממה"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-6 py-2",
				style: {
					background: "var(--accent-faint)",
					borderColor: "var(--accent-border)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					style: { color: "var(--accent)" },
					children: "מצב ניהול"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-[12px] text-accent md:hidden",
					children: "חזרה לחממה"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0 flex-1 px-4 py-6 md:px-8",
				children
			})]
		})]
	});
}
function AdminLayout() {
	const { profile, isLoading } = useSession();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		if (isLoading) return;
		if (!profile) {
			router.navigate({ to: "/login" });
			return;
		}
		if (profile.role === "student") {
			toast.error("אין לך הרשאה למערך הניהול");
			router.navigate({ to: "/" });
		}
	}, [
		isLoading,
		profile,
		router
	]);
	if (isLoading || !profile || profile.role === "student") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
			variant: "mark",
			size: 48,
			animated: true
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })] });
}
//#endregion
export { AdminLayout as component };
