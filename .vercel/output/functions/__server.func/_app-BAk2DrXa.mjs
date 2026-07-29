import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "./_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, s as useGatedVariants } from "./_ssr/motion-D3meAu4o.mjs";
import { o as tierName, r as data, s as tierProgress } from "./_ssr/data-BDcPQam0.mjs";
import { t as GrowthRing } from "./_ssr/GrowthRing-A3PAOQq6.mjs";
import { n as greetingKey, r as t } from "./_ssr/copy-DH5R7OvZ.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as useSession } from "./_ssr/useSession-YdBs-AjE.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { $ as Flame, A as Play, I as MessageSquare, O as Radio, kt as ArrowLeft, p as Target, tt as Droplet } from "./_libs/lucide-react.mjs";
import { i as format, t as he } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BAk2DrXa.js
var import_jsx_runtime = require_jsx_runtime();
function fmtDur(sec) {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function Dashboard() {
	const { profile } = useSession();
	const gated = useGatedVariants(revealUp);
	const { data: cont } = useQuery({
		queryKey: ["continue"],
		queryFn: () => data.progress.continueLearning()
	});
	const { data: streak } = useQuery({
		queryKey: ["streak"],
		queryFn: () => data.gamification.getStreak()
	});
	const { data: posts } = useQuery({
		queryKey: ["posts", "all"],
		queryFn: () => data.community.listPosts()
	});
	const { data: courses } = useQuery({
		queryKey: ["courses"],
		queryFn: () => data.courses.list()
	});
	const { data: events } = useQuery({
		queryKey: ["events"],
		queryFn: () => data.events.list()
	});
	const nextEvent = (events ?? []).find((e) => e.status === "live") ?? (events ?? []).filter((e) => e.status === "upcoming").sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0] ?? null;
	if (!profile) return null;
	const firstName = profile.fullName.split(" ")[0];
	const { progress: tp, toNext, nextName } = tierProgress(profile.xpTotal);
	const weeklyDone = 68;
	const weeklyGoal = profile.weeklyGoalMinutes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "mx-auto max-w-6xl",
		variants: staggerContainer(),
		initial: "hidden",
		animate: "visible",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
			variants: gated,
			className: "mb-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: tierName(profile.growthStage)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-h1 text-ink",
				children: t(greetingKey(), { name: firstName })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					cont && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: gated,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/learn/$courseSlug/$lessonId",
							params: {
								courseSlug: cont.course.slug,
								lessonId: cont.lesson.id
							},
							className: "group block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card relative overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-[21/8] overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 transition-transform duration-[8000ms] group-hover:scale-105",
											style: { background: "radial-gradient(circle at 75% 25%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 55%), linear-gradient(135deg, var(--panel-2), var(--bg))" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0",
											style: { background: "linear-gradient(to top, var(--bg) 15%, transparent 70%)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-0 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-16 w-16 items-center justify-center rounded-full shadow-[var(--glow-md)] transition-transform group-hover:scale-105 animate-breathe",
												style: { background: "var(--grad-gold)" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 translate-x-0.5 fill-[#1a1206] text-[#1a1206]" })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-x-5 bottom-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "label-mono",
												children: cont.course.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "mt-1 text-h2 text-ink",
												children: cont.lesson.title
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 px-5 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 flex-1 overflow-hidden rounded-full",
											style: { background: "var(--panel-2)" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full",
												style: {
													width: `${cont.progress.watchedPct}%`,
													background: "var(--grad-gold)"
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] tabular text-muted",
											children: cont.progress.positionSec > 0 ? `נשארו ${fmtDur(Math.max(0, cont.lesson.durationSec - cont.progress.positionSec))}` : t("cta.continueWatching")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5 text-accent transition-transform group-hover:-translate-x-1" })
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: gated,
						className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5" }),
								label: "רצף השקיה",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display-latin text-h2 tabular text-ink",
										children: streak?.days ?? profile.streakDays
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-small text-muted",
										children: "ימים רצוף"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatTile, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5" }),
								label: "יעד שבועי",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display-latin text-h2 tabular text-ink",
										children: weeklyDone
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-small text-muted",
										children: [
											"/ ",
											weeklyGoal,
											" דק'"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-1 overflow-hidden rounded-full",
									style: { background: "var(--panel-2)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full",
										style: {
											width: `${Math.min(100, weeklyDone / weeklyGoal * 100)}%`,
											background: "var(--grad-gold)"
										}
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatTile, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "◈"
								}),
								label: "דרגה",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-baseline gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-h3 text-ink",
											children: tierName(profile.growthStage)
										})
									}),
									nextName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[11px] text-muted",
										children: [
											"עוד ",
											toNext.toLocaleString("en-US"),
											" XP ל",
											nextName
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-1 overflow-hidden rounded-full",
										style: { background: "var(--panel-2)" },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full",
											style: {
												width: `${tp * 100}%`,
												background: "var(--grad-gold)"
											}
										})
									})
								]
							})
						]
					}),
					cont && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: gated,
						className: "surface-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "הצעד הבא שלך"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 text-h3 text-ink",
								children: cont.lesson.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-small text-muted",
								children: [
									"כי אתה באמצע \"",
									cont.course.title,
									"\". קליק אחד וממשיכים."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/learn/$courseSlug/$lessonId",
								params: {
									courseSlug: cont.course.slug,
									lessonId: cont.lesson.id
								},
								className: "btn-primary mt-4 inline-flex items-center gap-2 text-small",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), t("cta.continueWatching")]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: gated,
						className: "surface-card flex items-center gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-11 w-11 items-center justify-center rounded-full",
							style: { background: "var(--accent-faint)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5 text-accent" })
						}), nextEvent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-body font-medium text-ink",
								children: nextEvent.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-small text-muted",
								children: [
									format(new Date(nextEvent.startsAt), "EEEE, d בMMMM · HH:mm", { locale: he }),
									" · ",
									nextEvent.hostName
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/events",
							className: "btn-secondary shrink-0 text-small",
							children: nextEvent.status === "live" ? "מצטרפים ללייב" : "לכל הלייבים"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body font-medium text-ink",
								children: "לייבים ושידורים"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-small text-muted",
								children: "הלייב הבא יעלה בקרוב — שווה לעקוב."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/events",
							className: "label-mono transition-colors hover:text-accent",
							children: "ללוח הלייבים"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: gated,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "מהקהילה"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/community",
								className: "text-small text-muted transition-colors hover:text-accent",
								children: "לכל הקהילה"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: (posts ?? []).slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/community/post/$id",
								params: { id: p.id },
								className: "surface-card flex items-center gap-3 p-4 transition-colors hover:border-[color:var(--accent-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
										size: "sm",
										tier: p.authorStage,
										progress: 0,
										name: p.authorName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-body text-ink",
											children: p.title ?? p.body
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-[12px] text-muted",
											children: [
												p.authorName,
												" · דרגת ",
												tierName(p.authorStage)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] tabular",
											children: p.commentsCount
										})]
									})
								]
							}, p.id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
				variants: gated,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "השבוע שלך"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex justify-between",
							children: [
								"א",
								"ב",
								"ג",
								"ד",
								"ה",
								"ו",
								"ש"
							].map((d, i) => {
								const active = i < (streak?.days ?? 0) % 7 || i < 5;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-8 w-8 items-center justify-center rounded-full text-[12px]",
										style: {
											background: active ? "var(--accent-faint)" : "var(--panel-2)",
											color: active ? "var(--accent)" : "var(--muted-2)",
											border: active ? "1px solid var(--accent-border)" : "1px solid var(--line-soft)"
										},
										children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-3.5 w-3.5" }) : d
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted",
										children: d
									})]
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "צמרת החממה"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								style: { color: "var(--accent)" },
								children: "בקרוב"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5 opacity-70",
							children: (courses ? [
								"נועה כהן",
								"דניאל לוי",
								"רון אברהם"
							] : []).map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-4 font-mono text-[12px] text-muted",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-small text-ink-2",
									children: name
								})]
							}, name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "ההשקיה של היום"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-small text-ink-2",
							children: "לפני שכותבים קופי — כתבו במשפט אחד את הפחד הכי גדול של הלקוח. כל השאר נגזר מזה."
						})]
					})
				]
			})]
		})]
	});
}
function StatTile({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-accent",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children
		})]
	});
}
//#endregion
export { Dashboard as component };
