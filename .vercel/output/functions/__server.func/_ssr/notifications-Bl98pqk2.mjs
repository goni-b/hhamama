import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useReducedMotion } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE, t as DUR } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as Award, K as Info, L as MessageCircle, O as Radio, Tt as Bell, Y as Heart, _ as Sprout, mt as CircleAlert, vt as CheckCheck } from "../_libs/lucide-react.mjs";
import { n as isToday, r as formatDistanceToNow, t as he } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-Bl98pqk2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LIST_KEY = ["notifications", "list"];
var KIND_ICON = {
	reaction: Heart,
	comment: MessageCircle,
	level_up: Sprout,
	achievement: Award,
	live: Radio,
	system: Info
};
var WEEK_MS = 168 * 36e5;
var GROUP_ORDER = [
	"היום",
	"השבוע",
	"מוקדם יותר"
];
function groupOf(iso) {
	const d = new Date(iso);
	if (isToday(d)) return "היום";
	if (Date.now() - d.getTime() < WEEK_MS) return "השבוע";
	return "מוקדם יותר";
}
function relativeTime(iso) {
	return formatDistanceToNow(new Date(iso), {
		addSuffix: true,
		locale: he
	});
}
function NotificationsPage() {
	const qc = useQueryClient();
	const router = useRouter();
	const reduced = !!useReducedMotion();
	const [liveIds, setLiveIds] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const { data: notifications, isLoading, isError, refetch } = useQuery({
		queryKey: LIST_KEY,
		queryFn: () => data.notifications.list()
	});
	(0, import_react.useEffect)(() => {
		return data.notifications.subscribe((n) => {
			setLiveIds((prev) => {
				const next = new Set(prev);
				next.add(n.id);
				return next;
			});
			qc.setQueryData(LIST_KEY, (old) => old ? [n, ...old.filter((x) => x.id !== n.id)] : [n]);
			qc.invalidateQueries({ queryKey: ["notifications", "unread"] });
		});
	}, [qc]);
	const markRead = useMutation({
		mutationFn: (id) => data.notifications.markRead(id),
		onMutate: (id) => {
			qc.setQueryData(LIST_KEY, (old) => old?.map((n) => n.id === id ? {
				...n,
				read: true
			} : n));
		},
		onError: () => toast.error(copy["error.generic"]),
		onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] })
	});
	const markAll = useMutation({
		mutationFn: () => data.notifications.markAllRead(),
		onMutate: () => {
			qc.setQueryData(LIST_KEY, (old) => old?.map((n) => ({
				...n,
				read: true
			})));
		},
		onSuccess: () => toast.success("סומן. הכל נקרא."),
		onError: () => toast.error(copy["error.generic"]),
		onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] })
	});
	const open = (n) => {
		if (!n.read) markRead.mutate(n.id);
		if (n.href) router.navigate({ to: n.href });
	};
	const sorted = (0, import_react.useMemo)(() => [...notifications ?? []].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [notifications]);
	const unreadTotal = sorted.filter((n) => !n.read).length;
	const groups = (0, import_react.useMemo)(() => {
		const byLabel = /* @__PURE__ */ new Map();
		for (const n of sorted) {
			const label = groupOf(n.createdAt);
			const arr = byLabel.get(label);
			if (arr) arr.push(n);
			else byLabel.set(label, [n]);
		}
		return GROUP_ORDER.filter((l) => byLabel.has(l)).map((l) => ({
			label: l,
			items: byLabel.get(l) ?? []
		}));
	}, [sorted]);
	let content;
	if (isLoading) content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-14 rounded" }), [
			0,
			1,
			2,
			3,
			4
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-[76px] rounded-lg" }, i))]
	});
	else if (isError) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-20 w-20 items-center justify-center rounded-full",
				style: { background: "var(--panel-2)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-muted" })
			}),
			title: copy["error.generic"],
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => refetch(),
				className: "btn-secondary text-small",
				children: "נסה שוב"
			})
		})
	});
	else if (sorted.length === 0) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-20 w-20 items-center justify-center rounded-full",
				style: { background: "var(--accent-faint)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-8 w-8 text-accent" })
			}),
			title: copy["empty.notifications"]
		})
	});
	else content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-7",
		children: groups.map((g, gi) => {
			const offset = groups.slice(0, gi).reduce((sum, x) => sum + x.items.length, 0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": g.label,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "label-mono mb-2.5",
					children: g.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "surface-card overflow-hidden",
					children: g.items.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationRow, {
						n,
						index: offset + i,
						live: liveIds.has(n.id),
						reduced,
						onOpen: () => open(n)
					}, n.id))
				})]
			}, g.label);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ghost-number",
						"aria-hidden": "true",
						children: "08"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "התראות"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-h1 text-ink",
						children: "מרכז ההתראות"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => markAll.mutate(),
				disabled: unreadTotal === 0 || markAll.isPending,
				className: "btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-4 w-4" }), "סמן הכל כנקרא"]
			})]
		}), content]
	});
}
function NotificationRow({ n, index, live, reduced, onOpen }) {
	const Icon = KIND_ICON[n.kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
		initial: reduced ? { opacity: 0 } : live ? {
			opacity: 0,
			y: -18
		} : {
			opacity: 0,
			y: 14
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: reduced ? .01 : live ? .5 : DUR.enter,
			ease: EASE,
			delay: reduced || live ? 0 : Math.min(index * .05, .45)
		},
		className: "border-b border-line last:border-b-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: onOpen,
			className: "flex w-full items-start gap-3.5 px-4 py-4 text-start transition-colors hover:bg-[color:var(--panel-2)] md:px-5",
			style: n.read ? void 0 : { background: "color-mix(in srgb, var(--accent) 5%, transparent)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
					style: {
						background: "var(--accent-faint)",
						color: "var(--accent)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-[18px] w-[18px]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `block text-body ${n.read ? "text-ink-2" : "font-medium text-ink"}`,
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block break-words text-small text-muted",
						children: n.body
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 flex-col items-end gap-2 pt-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: n.createdAt,
						className: "font-mono text-[11px] tabular text-muted-2",
						children: relativeTime(n.createdAt)
					}), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-2 w-2 rounded-full bg-accent",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "לא נקרא"
					})] })]
				})
			]
		})
	});
}
//#endregion
export { NotificationsPage as component };
