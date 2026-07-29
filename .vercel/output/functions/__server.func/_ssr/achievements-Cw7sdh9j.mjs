import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, r as chipPop, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { n as GROWTH_TIERS, r as data, s as tierProgress } from "./data-BDcPQam0.mjs";
import { t as GrowthIcon } from "./GrowthIcons-b9BXkVKG.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { $ as Flame, B as Lock, Ct as Brain, O as Radio, P as Moon, W as Layers, X as HeartHandshake, Z as GraduationCap, _ as Sprout, _t as Check, bt as Calendar, d as TreeDeciduous, dt as CircleQuestionMark, g as Star, m as Sunrise, r as Users, t as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/achievements-Cw7sdh9j.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	seed: Sprout,
	flame: Flame,
	module: Layers,
	marathon: Zap,
	community: Users,
	star: Star,
	calendar: Calendar,
	graduate: GraduationCap,
	hands: HeartHandshake,
	radio: Radio,
	sunrise: Sunrise,
	check: Check,
	brain: Brain,
	sapling: TreeDeciduous,
	moon: Moon,
	lock: Lock
};
function JourneyPage() {
	const { profile } = useSession();
	const { data: achievements } = useQuery({
		queryKey: ["achievements"],
		queryFn: () => data.gamification.getAchievements()
	});
	const gated = useGatedVariants(chipPop);
	if (!profile) return null;
	const currentIdx = GROWTH_TIERS.findIndex((t) => t.stage === profile.growthStage);
	const { toNext, nextName } = tierProgress(profile.xpTotal);
	const unlocked = (achievements ?? []).filter((a) => a.unlockedAt).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ghost-number",
						"aria-hidden": "true",
						children: "05"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "המסע שלי"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-h1 text-ink",
						children: "המסע שלך בחממה"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-card mb-8 p-6 md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "הדרגה שלך"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-h2 text-ink",
							children: GROWTH_TIERS[currentIdx].name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "display-latin text-h2 tabular gold-text",
								children: profile.xpTotal.toLocaleString("en-US")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "label-mono",
								children: "נקודות צמיחה"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-x-4 top-6 h-0.5",
								style: { background: "var(--line)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute start-4 top-6 h-0.5",
								style: {
									width: `${currentIdx / (GROWTH_TIERS.length - 1) * 100}%`,
									background: "var(--grad-gold)"
								}
							}),
							GROWTH_TIERS.map((tier, i) => {
								const reached = i <= currentIdx;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10 flex flex-col items-center gap-2",
									style: { width: `${100 / GROWTH_TIERS.length}%` },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-12 w-12 items-center justify-center rounded-full",
										style: {
											background: reached ? "var(--accent-faint)" : "var(--panel)",
											border: i === currentIdx ? "2px solid var(--accent)" : `1px solid ${reached ? "var(--accent-border)" : "var(--line)"}`,
											boxShadow: i === currentIdx ? "var(--glow-sm)" : void 0
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthIcon, {
											stage: tier.stage,
											size: 22,
											active: reached
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-center text-[11px]",
										style: { color: reached ? "var(--ink-2)" : "var(--muted-2)" },
										children: tier.name
									})]
								}, tier.stage);
							})
						]
					}),
					nextName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-small text-muted",
						children: [
							"עוד",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "display-latin font-bold text-accent",
								children: toNext.toLocaleString("en-US")
							}),
							" ",
							"נקודות צמיחה לדרגת ",
							nextName
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-h2 text-ink",
					children: "חדר התעודות"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[12px] tabular text-muted",
					children: [
						unlocked,
						"/",
						achievements?.length ?? 0,
						" נפתחו"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
				variants: staggerContainer(.04),
				initial: "hidden",
				animate: "visible",
				children: (achievements ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					variants: gated,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementCard, { achievement: a })
				}, a.id))
			})] })
		]
	});
}
function AchievementCard({ achievement: a }) {
	const unlocked = !!a.unlockedAt;
	const Icon = a.hidden && !unlocked ? CircleQuestionMark : ICONS[a.icon] ?? Star;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card flex flex-col items-center gap-2.5 p-4 text-center transition-all",
		style: {
			background: unlocked ? "var(--accent-surface)" : "var(--panel)",
			borderColor: unlocked ? "var(--accent-border)" : "var(--line)",
			boxShadow: unlocked ? "var(--glow-sm)" : "var(--elev-1)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-14 w-14 items-center justify-center rounded-full",
				style: { background: unlocked ? "var(--accent-faint)" : "var(--panel-2)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-6 w-6",
					style: { color: unlocked ? "var(--accent)" : "var(--muted-2)" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-body font-medium",
				style: { color: unlocked ? "var(--ink)" : "var(--muted)" },
				children: a.hidden && !unlocked ? "?" : a.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px]",
				style: { color: unlocked ? "var(--ink-2)" : "var(--muted-2)" },
				children: a.hidden && !unlocked ? "הישג נסתר" : unlocked ? a.description : a.progressHint ?? a.description
			})
		]
	});
}
//#endregion
export { JourneyPage as component };
