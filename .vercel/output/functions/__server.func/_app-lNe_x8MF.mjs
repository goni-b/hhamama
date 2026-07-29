import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { o as tierName, r as data, s as tierProgress } from "./_ssr/data-BDcPQam0.mjs";
import { t as GrowthRing } from "./_ssr/GrowthRing-A3PAOQq6.mjs";
import { t as copy } from "./_ssr/copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { t as useSession } from "./_ssr/useSession-YdBs-AjE.mjs";
import { _ as Link, b as useRouter, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Play, H as Library, I as MessageSquare, O as Radio, S as Search, Tt as Bell, at as CornerDownLeft, b as Shield, ft as CirclePlay, i as UserRound, q as House, r as Users, s as Trophy, w as Route, wt as BookOpen, z as LogOut } from "./_libs/lucide-react.mjs";
import { n as Logo, t as AmbientBackground } from "./_ssr/AmbientBackground-CqHVwcVb.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-DIo89e4g.mjs";
import { t as useDebouncedValue } from "./_ssr/useDebouncedValue-627230Hh.mjs";
import { t as _e } from "./_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-lNe_x8MF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		to: "/",
		label: copy["nav.dashboard"],
		icon: House
	},
	{
		to: "/courses",
		label: copy["nav.library"],
		icon: Library
	},
	{
		to: "/community",
		label: copy["nav.community"],
		icon: Users
	},
	{
		to: "/events",
		label: copy["nav.lives"],
		icon: Radio
	},
	{
		to: "/achievements",
		label: copy["nav.journey"],
		icon: Route
	},
	{
		to: "/leaderboard",
		label: copy["nav.leaderboard"],
		icon: Trophy
	}
];
function Sidebar({ profile, onSignOut }) {
	const { progress, toNext, nextName } = tierProgress(profile.xpTotal);
	const isStaff = profile.role !== "student";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden w-[248px] shrink-0 flex-col border-s border-line bg-bg-2 md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center px-5 py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
					variant: "full",
					size: 36,
					animated: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/account",
				className: "mx-3 flex items-center gap-3 rounded-lg border border-line bg-panel px-3 py-3 transition-colors hover:border-[color:var(--accent-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
					size: "sm",
					tier: profile.growthStage,
					progress,
					name: profile.fullName,
					src: profile.avatarUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[14px] font-medium text-ink",
						children: profile.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-[12px] text-muted",
						children: [
							"דרגת ",
							tierName(profile.growthStage),
							nextName ? ` · עוד ${toNext.toLocaleString("en-US")} XP` : ""
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-5 flex-1 px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "ניווט"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								activeOptions: { exact: item.to === "/" },
								className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-line-soft hover:text-ink",
								activeProps: { className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-accent bg-[color:var(--accent-faint)]" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-[18px] w-[18px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}) }, item.to);
						})
					}),
					isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-2 pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "מערכת"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-line-soft hover:text-ink",
						activeProps: { className: "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] text-accent bg-[color:var(--accent-faint)]" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-[18px] w-[18px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "מעבר לניהול" })]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-line-soft p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onSignOut,
					className: "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted transition-colors hover:text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "rtl-flip h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy["auth.logout"] })]
				})
			})
		]
	});
}
function LeafFlame({ color, size = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 3 C7 8 6 12 8 16 C9.2 18.4 11 19.5 12 21 C13 19.5 14.8 18.4 16 16 C18 12 17 8 12 3Z",
			fill: color
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 8 C10.5 11 10.5 14 12 18",
			stroke: "var(--bg)",
			strokeWidth: "1",
			opacity: "0.4",
			strokeLinecap: "round"
		})]
	});
}
function StreakBadge({ days, state = "active", freezes = 0, className = "" }) {
	const color = state === "active" ? "var(--accent)" : state === "atRisk" ? "var(--warning)" : "var(--muted-2)";
	const title = state === "broken" ? "מתחילים רצף חדש היום" : `רצף השקיה: ${days} ימים`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${className}`,
		style: {
			borderColor: "var(--accent-border)",
			background: "var(--accent-faint)"
		},
		title,
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: state === "active" ? "animate-breathe" : void 0,
				style: { transformOrigin: "center" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafFlame, { color })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "display-latin text-[13px] font-bold tabular text-ink",
				children: days
			}),
			freezes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-0.5 opacity-70",
				"aria-label": `${freezes} עלי מגן`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafFlame, {
					color: "var(--muted)",
					size: 11
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "display-latin text-[10px] tabular text-muted",
					children: freezes
				})]
			})
		]
	});
}
function streakState(days) {
	if (days <= 0) return "broken";
	return "active";
}
function TopBar({ profile, unreadCount = 0, onOpenSearch }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "glass-panel sticky top-0 z-20 flex items-center gap-3 border-x-0 border-t-0 px-4 py-3 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
					variant: "mark",
					size: 30
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onOpenSearch,
				className: "mx-auto flex w-full max-w-md items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2 text-sm text-muted transition-colors hover:border-[color:var(--accent-border)]",
				"aria-label": "חיפוש בחממה",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-start text-muted-2",
						children: "חיפוש קורס, שיעור, פוסט..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted-2 md:inline-block",
						children: "Ctrl K"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreakBadge, {
					days: profile.streakDays,
					state: streakState(profile.streakDays),
					className: "hidden sm:inline-flex"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/notifications",
					className: "relative flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:text-ink",
					"aria-label": "פתיחת התראות",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-[18px] w-[18px]" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold tabular text-[#1a1206]",
						children: unreadCount > 9 ? "9+" : unreadCount
					})]
				})]
			})
		]
	});
}
var SIDE = [{
	to: "/",
	label: "הבית",
	icon: House,
	exact: true
}, {
	to: "/courses",
	label: "קורסים",
	icon: Library,
	exact: false
}];
var SIDE_2 = [{
	to: "/community",
	label: "קהילה",
	icon: Users,
	exact: false
}, {
	to: "/achievements",
	label: "המסע",
	icon: Route,
	exact: false
}];
function BottomNav() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "glass-panel fixed inset-x-0 bottom-0 z-30 flex items-end justify-around border-x-0 border-b-0 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 md:hidden",
		children: [
			SIDE.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "-mt-5 flex flex-col items-center",
				"aria-label": "המשך מאיפה שעצרת",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--glow-md)]",
					style: { background: "var(--grad-gold)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 translate-x-0.5 fill-[#1a1206] text-[#1a1206]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 text-[10px] font-medium text-ink-2",
					children: "המשך"
				})]
			}),
			SIDE_2.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to))
		]
	});
}
function NavItem({ to, label, icon: Icon, exact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		activeOptions: { exact },
		className: "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-muted",
		activeProps: { className: "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-accent" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px]",
			children: label
		})]
	});
}
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var TYPE_META = {
	course: {
		label: "קורסים",
		icon: BookOpen
	},
	lesson: {
		label: "שיעורים",
		icon: CirclePlay
	},
	post: {
		label: "פוסטים",
		icon: MessageSquare
	},
	person: {
		label: "אנשים",
		icon: UserRound
	}
};
var RESULT_ORDER = [
	"course",
	"lesson",
	"post",
	"person"
];
var ACTIONS = [
	{
		href: "/",
		label: copy["nav.dashboard"],
		icon: House
	},
	{
		href: "/courses",
		label: copy["nav.library"],
		icon: Library
	},
	{
		href: "/community",
		label: copy["nav.community"],
		icon: Users
	},
	{
		href: "/events",
		label: copy["nav.lives"],
		icon: Radio
	},
	{
		href: "/achievements",
		label: copy["nav.journey"],
		icon: Route
	},
	{
		href: "/leaderboard",
		label: copy["nav.leaderboard"],
		icon: Trophy
	},
	{
		href: "/search",
		label: "עמוד החיפוש המלא",
		icon: Search
	}
];
var ITEM_CLS = "cursor-pointer gap-3 rounded-md px-2.5 py-2.5 data-[selected=true]:bg-[color:var(--accent-faint)] data-[selected=true]:text-[color:var(--ink)]";
var GROUP_CLS = "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em]";
function CommandPalette({ open, onOpenChange }) {
	const router = useRouter();
	const [q, setQ] = (0, import_react.useState)("");
	const term = useDebouncedValue(q, 300).trim();
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key.toLowerCase() === "k" || e.key === "ק")) {
				e.preventDefault();
				onOpenChange(!open);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (!open) setQ("");
	}, [open]);
	const { data: results, isLoading, isError, refetch } = useQuery({
		queryKey: [
			"search",
			"palette",
			term
		],
		queryFn: () => data.search.query(term),
		enabled: open && term.length > 0
	});
	const { data: continueItem } = useQuery({
		queryKey: ["continue"],
		queryFn: () => data.progress.continueLearning(),
		enabled: open,
		staleTime: 6e4
	});
	const go = (href) => {
		onOpenChange(false);
		router.navigate({ to: href });
	};
	const groups = (0, import_react.useMemo)(() => {
		const list = results ?? [];
		return RESULT_ORDER.map((type) => ({
			type,
			items: list.filter((r) => r.type === type)
		})).filter((g) => g.items.length > 0);
	}, [results]);
	const visibleActions = term ? ACTIONS.filter((a) => a.label.includes(term)) : ACTIONS;
	const hasResultsArea = term.length > 0;
	const [selected, setSelected] = (0, import_react.useState)("");
	const firstValue = groups.length ? `${groups[0].type}-${groups[0].items[0].id}` : !term && continueItem ? "continue-learning" : visibleActions.length ? `action-${visibleActions[0].href}` : "";
	(0, import_react.useEffect)(() => {
		setSelected(firstValue);
	}, [firstValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: "top-[16%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "חיפוש בחממה"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
				shouldFilter: false,
				value: selected,
				onValueChange: setSelected,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
						value: q,
						onValueChange: setQ,
						placeholder: "חיפוש קורס, שיעור, פוסט או חבר..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, {
						className: "max-h-[400px] p-1.5",
						children: [
							hasResultsArea && isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 p-2",
								children: [
									0,
									1,
									2
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-11 rounded-md" }, i))
							}),
							hasResultsArea && isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-small text-ink-2",
									children: copy["error.generic"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => refetch(),
									className: "btn-secondary mt-3 text-small",
									children: "נסה שוב"
								})]
							}),
							hasResultsArea && !isLoading && !isError && groups.length === 0 && visibleActions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-small text-ink-2",
									children: copy["empty.searchResults"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => go("/community"),
									className: "mt-3 text-small text-accent transition-opacity hover:opacity-80",
									children: "אולי בקהילה מישהו יודע — שאל שם"
								})]
							}),
							!term && continueItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
								heading: "המשך למידה",
								className: GROUP_CLS,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: "continue-learning",
									onSelect: () => go(`/learn/${continueItem.course.slug}/${continueItem.lesson.id}`),
									className: ITEM_CLS,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
											style: { background: "var(--accent-faint)" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current text-accent" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-small text-ink",
												children: continueItem.lesson.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-[11.5px] text-muted",
												children: continueItem.course.title
											})]
										}),
										continueItem.progress.watchedPct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] tabular text-muted",
											children: [Math.round(continueItem.progress.watchedPct), "%"]
										})
									]
								})
							}),
							!isLoading && !isError && groups.map((g) => {
								const meta = TYPE_META[g.type];
								const Icon = meta.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
									heading: meta.label,
									className: GROUP_CLS,
									children: g.items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
										value: `${g.type}-${r.id}`,
										onSelect: () => go(r.href),
										className: ITEM_CLS,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
											style: { background: "var(--accent-faint)" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-accent" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-small text-ink",
												children: r.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-[11.5px] text-muted",
												children: r.subtitle
											})]
										})]
									}, `${g.type}-${r.id}`))
								}, g.type);
							}),
							visibleActions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(groups.length > 0 || !term && continueItem) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, { className: "my-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
								heading: "פעולות",
								className: GROUP_CLS,
								children: visibleActions.map((a) => {
									const Icon = a.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
										value: `action-${a.href}`,
										onSelect: () => go(a.href),
										className: ITEM_CLS,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-small text-ink-2",
											children: a.label
										})]
									}, a.href);
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 border-t px-4 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "h-3 w-3" }), "מעבר"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-muted-2",
								children: "Esc סגירה"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-muted-2",
								children: "חצים לניווט"
							})
						]
					})
				]
			})]
		})
	});
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
function AppShell({ profile, children }) {
	const router = useRouter();
	const qc = useQueryClient();
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const isMobile = useIsMobile();
	const { data: unread = 0 } = useQuery({
		queryKey: ["notifications", "unread"],
		queryFn: () => data.notifications.unreadCount(),
		staleTime: 3e4
	});
	const signOut = useMutation({
		mutationFn: () => data.auth.signOut(),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["session"] });
			router.navigate({ to: "/login" });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
				profile,
				onSignOut: () => signOut.mutate()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
					profile,
					unreadCount: unread,
					onOpenSearch: () => isMobile ? router.navigate({ to: "/search" }) : setSearchOpen(true)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 lg:px-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {
				open: searchOpen,
				onOpenChange: setSearchOpen
			})
		]
	});
}
function FullScreenLoader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
			variant: "mark",
			size: 56,
			animated: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label-mono",
			children: copy["state.loading"]
		})]
	});
}
function AppLayout() {
	const { profile, isLoading } = useSession();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		if (isLoading) return;
		if (!profile) {
			router.navigate({ to: "/login" });
			return;
		}
		if (profile.mustResetPassword) {
			router.navigate({ to: "/auth/reset-password" });
			return;
		}
		if (!profile.onboardingCompleted) router.navigate({ to: "/welcome" });
	}, [
		isLoading,
		profile,
		router
	]);
	if (isLoading || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullScreenLoader, {});
	if (profile.mustResetPassword || !profile.onboardingCompleted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullScreenLoader, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		profile,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	})] });
}
//#endregion
export { AppLayout as component };
