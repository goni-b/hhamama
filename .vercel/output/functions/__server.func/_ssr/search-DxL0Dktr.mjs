import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, n as EASE, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { o as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Link, b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Library, I as MessageSquare, J as History, O as Radio, S as Search, ft as CirclePlay, ht as ChevronLeft, i as UserRound, n as X, r as Users, w as Route, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { t as useDebouncedValue } from "./useDebouncedValue-627230Hh.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { t as Route$1 } from "./search-DXpPRvM6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DxL0Dktr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "הכל"
	},
	{
		id: "course",
		label: "קורסים"
	},
	{
		id: "lesson",
		label: "שיעורים"
	},
	{
		id: "post",
		label: "פוסטים"
	},
	{
		id: "person",
		label: "אנשים"
	}
];
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
var SHORTCUTS = [
	{
		to: "/courses",
		label: copy["nav.library"],
		description: "כל הקורסים במקום אחד",
		icon: Library
	},
	{
		to: "/community",
		label: copy["nav.community"],
		description: "שאלות, ניצחונות ושיחות",
		icon: Users
	},
	{
		to: "/events",
		label: copy["nav.lives"],
		description: "הלייבים הקרובים וההקלטות",
		icon: Radio
	},
	{
		to: "/achievements",
		label: copy["nav.journey"],
		description: "הדרגות וההישגים שלך",
		icon: Route
	}
];
var RECENT_KEY = "hachamama.recentSearches";
var RESULT_ORDER = [
	"course",
	"lesson",
	"post",
	"person"
];
/** פיצול טקסט למקטעים לפי מונח החיפוש — להדגשה בזהב */
function splitByTerm(text, term) {
	const t = term.trim();
	if (!t || !text) return [{
		part: text,
		hit: false
	}];
	const lowerText = text.toLowerCase();
	const lowerTerm = t.toLowerCase();
	const parts = [];
	let i = 0;
	while (i < text.length) {
		const idx = lowerText.indexOf(lowerTerm, i);
		if (idx === -1) {
			parts.push({
				part: text.slice(i),
				hit: false
			});
			break;
		}
		if (idx > i) parts.push({
			part: text.slice(i, idx),
			hit: false
		});
		parts.push({
			part: text.slice(idx, idx + t.length),
			hit: true
		});
		i = idx + t.length;
	}
	return parts;
}
function Highlighted({ text, term }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_react.useMemo)(() => splitByTerm(text, term), [text, term]).map((p, i) => p.hit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
		className: "font-bold",
		style: {
			background: "transparent",
			color: "var(--accent)"
		},
		children: p.part
	}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.part }, i)) });
}
function SearchPage() {
	const { q: urlQ } = Route$1.useSearch();
	const router = useRouter();
	const [q, setQ] = (0, import_react.useState)(urlQ ?? "");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [recent, setRecent] = (0, import_react.useState)([]);
	const term = useDebouncedValue(q, 300).trim();
	const gated = useGatedVariants(revealUp);
	(0, import_react.useEffect)(() => {
		router.navigate({
			to: "/search",
			search: term ? { q: term } : {},
			replace: true
		});
	}, [term, router]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(RECENT_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) setRecent(parsed.filter((x) => typeof x === "string").slice(0, 6));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (term.length < 2) return;
		setRecent((prev) => {
			const next = [term, ...prev.filter((x) => x !== term)].slice(0, 6);
			try {
				localStorage.setItem(RECENT_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
	}, [term]);
	const clearRecent = () => {
		setRecent([]);
		try {
			localStorage.removeItem(RECENT_KEY);
		} catch {}
	};
	const { data: results, isLoading, isFetching, isError, refetch } = useQuery({
		queryKey: [
			"search",
			term,
			filter
		],
		queryFn: () => data.search.query(term, filter === "all" ? void 0 : filter),
		enabled: term.length > 0,
		placeholderData: keepPreviousData
	});
	const groups = (0, import_react.useMemo)(() => {
		const list = results ?? [];
		return RESULT_ORDER.map((type) => ({
			type,
			items: list.filter((r) => r.type === type)
		})).filter((g) => g.items.length > 0);
	}, [results]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ghost-number",
						"aria-hidden": "true",
						children: "16"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "חיפוש"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-h1 text-ink",
						children: "מה מחפשים בחממה?"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .7,
					ease: EASE
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex items-center gap-3 px-4 transition-colors focus-within:border-[color:var(--accent-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 shrink-0 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "קורס, שיעור, פוסט או חבר...",
							"aria-label": "חיפוש בחממה",
							className: "h-14 w-full flex-1 bg-transparent text-body-lg text-ink outline-none placeholder:text-muted-2"
						}),
						q.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQ(""),
							"aria-label": "ניקוי החיפוש",
							className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
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
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: !term ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						ease: EASE,
						delay: .08
					},
					className: "space-y-8",
					children: [recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "חיפושים אחרונים"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearRecent,
							className: "text-small text-muted transition-colors hover:text-ink",
							children: "ניקוי"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQ(r),
							className: "rounded-full border border-line px-4 py-1.5 text-small text-ink-2 transition-colors hover:border-[color:var(--accent-border)] hover:text-ink",
							children: r
						}, r))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "קיצורים פופולריים"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: SHORTCUTS.map((s) => {
							const Icon = s.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: s.to,
								className: "surface-card group flex items-center gap-3 p-4 transition-colors hover:border-[color:var(--accent-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
										style: { background: "var(--accent-faint)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-accent" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-body text-ink",
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-small text-muted",
											children: s.description
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 shrink-0 text-muted-2 transition-transform group-hover:-translate-x-0.5" })
								]
							}, s.to);
						})
					})] })]
				}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-32 rounded-lg" })]
					}, i))
				}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-body text-ink-2",
						children: copy["error.generic"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => refetch(),
						className: "btn-secondary mt-4 text-small",
						children: "נסה שוב"
					})]
				}) : groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: copy["empty.searchResults"],
						description: "אולי בקהילה מישהו יודע — שווה לפתוח שם שאלה.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/community",
							className: "btn-primary text-small",
							children: "שאל בקהילה"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						opacity: isFetching ? .55 : 1,
						transition: "opacity 160ms var(--ease)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 font-mono text-[11px] tabular text-muted",
						children: [(results ?? []).length, " תוצאות"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "space-y-6",
						variants: staggerContainer(.06),
						initial: "hidden",
						animate: "visible",
						children: groups.map((g) => {
							const meta = TYPE_META[g.type];
							const Icon = meta.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
								variants: gated,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "label-mono",
											children: meta.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] tabular text-muted-2",
											children: g.items.length
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "surface-card divide-y divide-[color:var(--line-soft)] overflow-hidden",
									children: g.items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: r.href,
										onClick: (e) => {
											e.preventDefault();
											router.navigate({ to: r.href });
										},
										className: "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--panel-2)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
												style: { background: "var(--accent-faint)" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-accent" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-body text-ink",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighted, {
														text: r.title,
														term
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-small text-muted",
													children: r.subtitle
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 shrink-0 text-muted-2 transition-transform group-hover:-translate-x-0.5" })
										]
									}, `${g.type}-${r.id}`))
								})]
							}, g.type);
						})
					})]
				})
			})
		]
	});
}
//#endregion
export { SearchPage as component };
