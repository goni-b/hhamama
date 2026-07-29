import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, n as EASE, o as useCountUp, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { o as tierName, r as data } from "./data-BDcPQam0.mjs";
import { t as GrowthIcon } from "./GrowthIcons-b9BXkVKG.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { o as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as RotateCcw, s as Trophy } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-COTMA7T1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERIODS = [
	{
		id: "week",
		label: "השבוע"
	},
	{
		id: "month",
		label: "החודש"
	},
	{
		id: "all",
		label: "כל הזמנים"
	}
];
var MEDAL = {
	1: "var(--accent)",
	2: "color-mix(in srgb, var(--accent) 30%, var(--ink-2))",
	3: "color-mix(in srgb, var(--accent-2) 55%, var(--muted))"
};
var PEDESTAL = {
	1: 104,
	2: 76,
	3: 58
};
function buildTableItems(rows) {
	if (rows.length === 0) return [];
	const byRank = new Map(rows.map((r) => [r.rank, r]));
	const maxRank = Math.max(...rows.map((r) => r.rank));
	const me = rows.find((r) => r.isCurrentUser) ?? null;
	const wanted = /* @__PURE__ */ new Set();
	for (let r = 4; r <= Math.min(5, maxRank); r++) wanted.add(r);
	if (me) {
		for (let r = me.rank - 3; r <= me.rank + 3; r++) if (r >= 4 && r <= maxRank) wanted.add(r);
	} else for (let r = 6; r <= Math.min(10, maxRank); r++) wanted.add(r);
	const items = [];
	let prev = 3;
	for (const rank of [...wanted].sort((a, b) => a - b)) {
		const row = byRank.get(rank);
		if (!row) continue;
		if (rank - prev > 1) items.push({
			kind: "gap",
			id: `gap-${rank}`
		});
		items.push({
			kind: "row",
			row
		});
		prev = rank;
	}
	return items;
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("");
}
function fmtXp(xp) {
	return xp.toLocaleString("he-IL");
}
function LeaderboardPage() {
	const { profile } = useSession();
	const [period, setPeriod] = (0, import_react.useState)("week");
	const query = useQuery({
		queryKey: ["leaderboard", period],
		queryFn: () => data.gamification.getLeaderboard(period),
		placeholderData: keepPreviousData
	});
	const rows = query.data ?? [];
	const me = rows.find((r) => r.isCurrentUser) ?? null;
	const podium = [
		rows.find((r) => r.rank === 2),
		rows.find((r) => r.rank === 1),
		rows.find((r) => r.rank === 3)
	].filter((r) => !!r);
	const tableItems = buildTableItems(rows);
	let body;
	if (query.isLoading) body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mb-6 flex w-full max-w-xl items-end justify-center gap-3 md:gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-44 w-full max-w-[170px] rounded-t-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-56 w-full max-w-[170px] rounded-t-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-36 w-full max-w-[170px] rounded-t-xl" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card space-y-3 p-4",
		children: [
			0,
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-12 rounded-md" }, i))
	})] });
	else if (query.isError) body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
				className: "h-16 w-16",
				style: { color: "color-mix(in srgb, var(--accent) 45%, transparent)" }
			}),
			title: copy["error.generic"],
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => void query.refetch(),
				className: "btn-secondary inline-flex items-center gap-2 text-small",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "נסה שוב"]
			})
		})
	});
	else if (rows.length === 0) body = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
				className: "h-16 w-16",
				style: { color: "color-mix(in srgb, var(--accent) 45%, transparent)" }
			}),
			title: "עוד אין נקודות בתקופה הזו",
			description: "כל שיעור שמסתיים, תגובה בקהילה והשקיה יומית מזיזים אותך למעלה בטבלה."
		})
	});
	else body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `transition-opacity duration-300 ${query.isFetching && !query.isLoading ? "opacity-70" : "opacity-100"}`,
		children: [
			podium.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
				"aria-label": "שלוש המובילות",
				className: "mx-auto mb-2 flex w-full max-w-xl items-end justify-center gap-3 md:gap-5",
				variants: staggerContainer(.14, .1),
				initial: "hidden",
				animate: "visible",
				children: podium.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PodiumCard, { row: r }, r.userId))
			}),
			tableItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "divider-gold my-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-card overflow-hidden",
				"aria-label": "טבלת הדירוג",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b border-line px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono w-9 shrink-0 text-center",
							children: "מקום"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono flex-1",
							children: "חברה"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono shrink-0",
							children: "XP"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
					variants: staggerContainer(.05, .2),
					initial: "hidden",
					animate: "visible",
					children: tableItems.map((item) => item.kind === "gap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						"aria-hidden": "true",
						className: "border-b border-line-soft px-4 py-1 text-center font-mono text-[12px] text-muted-2",
						children: "· · ·"
					}, item.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowItem, { row: item.row }, item.row.userId))
				})]
			})] }),
			me && me.rank > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyRankBar, { row: me })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ghost-number",
						"aria-hidden": "true",
						children: "07"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: copy["nav.leaderboard"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-h1 text-ink",
						children: "צמרת החממה"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-small text-muted",
						children: [
							"מתחרות רק בתוך הליגה של הדרגה שלך",
							profile ? ` — ליגת ה${tierName(profile.growthStage)}` : "",
							", כך שלכל אחת יש סיכוי אמיתי להוביל."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center gap-2",
				children: [PERIODS.map((p) => {
					const active = period === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPeriod(p.id),
						"aria-pressed": active,
						className: "rounded-full border px-4 py-1.5 text-small transition-all",
						style: {
							borderColor: active ? "var(--accent)" : "var(--line)",
							background: active ? "var(--accent-faint)" : "transparent",
							color: active ? "var(--accent)" : "var(--ink-2)"
						},
						children: p.label
					}, p.id);
				}), period === "week" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ms-auto hidden font-mono text-[11px] text-muted-2 sm:inline",
					children: "מתאפס בכל יום ראשון ב-04:00 — התחלה נקייה"
				})]
			}),
			body
		]
	});
}
function PodiumCard({ row }) {
	const gated = useGatedVariants(revealUp);
	const { ref, value } = useCountUp(row.xp, 1.4);
	const place = Math.min(Math.max(row.rank, 1), 3);
	const medal = MEDAL[place];
	const first = place === 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		variants: gated,
		className: "flex w-full min-w-0 max-w-[170px] flex-col",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/profile/$username",
			params: { username: row.username },
			className: "group flex w-full flex-col items-center",
			"aria-label": `מקום ${row.rank}: ${row.fullName}, ${fmtXp(row.xp)} נקודות צמיחה`,
			children: [
				first ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-end justify-center",
					style: {
						width: 112,
						height: 78
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laurel, { className: "absolute inset-x-0 top-0 mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
						size: "md",
						tier: row.growthStage,
						progress: 0,
						src: row.avatarUrl,
						name: row.fullName,
						breathe: true
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
					size: "sm",
					tier: row.growthStage,
					progress: 0,
					src: row.avatarUrl,
					name: row.fullName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 w-full truncate text-center text-small font-semibold text-ink transition-colors group-hover:text-accent",
					children: row.fullName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 flex items-center justify-center gap-1 text-[11px] text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthIcon, {
						stage: row.growthStage,
						size: 13,
						active: true
					}), tierName(row.growthStage)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `display-latin mt-1.5 text-xl font-bold ${first ? "gold-text" : "text-ink-2"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						ref,
						children: fmtXp(value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "XP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex w-full items-start justify-center rounded-t-xl",
					style: {
						height: PEDESTAL[place],
						borderTop: `2px solid ${medal}`,
						background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 10%, var(--panel)) 0%, var(--panel) 75%)",
						boxShadow: "var(--elev-1)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "display-latin mt-2.5 text-lg font-bold",
						style: { color: medal },
						children: place
					})
				})
			]
		})
	});
}
function Laurel({ className = "" }) {
	const branch = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		stroke: "var(--accent)",
		strokeWidth: "1.3",
		strokeLinecap: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M26 8 C12 24 12 46 30 62",
			fill: "none",
			opacity: "0.8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "var(--accent-faint)",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "19",
					cy: "16",
					rx: "2.6",
					ry: "6",
					transform: "rotate(-34 19 16)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "14",
					cy: "28",
					rx: "2.6",
					ry: "6",
					transform: "rotate(-14 14 28)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "14",
					cy: "41",
					rx: "2.6",
					ry: "6",
					transform: "rotate(8 14 41)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "20",
					cy: "53",
					rx: "2.6",
					ry: "6",
					transform: "rotate(32 20 53)"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 112 70",
		width: 112,
		height: 70,
		fill: "none",
		"aria-hidden": "true",
		className,
		children: [branch, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			transform: "translate(112 0) scale(-1 1)",
			children: branch
		})]
	});
}
function RowItem({ row }) {
	const gated = useGatedVariants(revealUp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
		layout: true,
		variants: gated,
		transition: { layout: {
			duration: .22,
			ease: EASE
		} },
		className: "border-b border-line-soft last:border-b-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/profile/$username",
			params: { username: row.username },
			className: "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--panel-2)]",
			style: {
				borderInlineStart: row.isCurrentUser ? "2px solid var(--accent)" : "2px solid transparent",
				background: row.isCurrentUser ? "color-mix(in srgb, var(--accent) 14%, transparent)" : void 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-9 shrink-0 text-center font-mono text-[13px] tabular text-muted",
					children: row.rank
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-panel-2",
					"aria-hidden": "true",
					children: row.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: row.avatarUrl,
						alt: "",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] font-semibold text-accent",
						children: initials(row.fullName)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-body text-ink",
						children: [row.fullName, row.isCurrentUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ms-2 rounded-full px-2 py-0.5 text-[11px]",
							style: {
								background: "var(--accent-faint)",
								color: "var(--accent)"
							},
							children: "אני"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 flex items-center gap-1.5 text-[12px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthIcon, {
							stage: row.growthStage,
							size: 13,
							active: true
						}), tierName(row.growthStage)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 font-mono text-[13px] tabular text-ink-2",
					children: fmtXp(row.xp)
				})
			]
		})
	});
}
function MyRankBar({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "sticky bottom-4 z-10 mt-4",
		initial: {
			opacity: 0,
			y: 16
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .6,
			ease: EASE,
			delay: .35
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/profile/$username",
			params: { username: row.username },
			className: "flex items-center gap-3 rounded-xl border px-4 py-3",
			style: {
				background: "color-mix(in srgb, var(--accent) 10%, var(--panel))",
				borderColor: "var(--accent-border)",
				boxShadow: "var(--elev-2)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono hidden sm:inline",
					children: "המיקום שלך"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "display-latin shrink-0 text-lg font-bold text-accent",
					children: row.rank
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
					size: "sm",
					tier: row.growthStage,
					progress: 0,
					src: row.avatarUrl,
					name: row.fullName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-small font-semibold text-ink",
						children: row.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted",
						children: tierName(row.growthStage)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 font-mono text-[13px] tabular text-ink-2",
					children: [fmtXp(row.xp), " XP"]
				})
			]
		})
	});
}
//#endregion
export { LeaderboardPage as component };
