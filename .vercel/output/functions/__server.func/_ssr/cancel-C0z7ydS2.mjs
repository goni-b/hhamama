import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as AnimatePresence, n as useReducedMotion } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, n as EASE, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { a as tierByStage, i as stageForXp, n as GROWTH_TIERS, o as tierName, r as data, s as tierProgress } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as Award, Et as BadgePercent, St as CalendarClock, _ as Sprout, _t as Check, kt as ArrowLeft, pt as CirclePause, rt as DoorOpen } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-BJ3sdkEm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cancel-C0z7ydS2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function XPBar({ xp, showLabels = true }) {
	const stage = stageForXp(xp);
	const tierIdx = GROWTH_TIERS.findIndex((t) => t.stage === stage);
	const { progress, nextName } = tierProgress(xp);
	const next = GROWTH_TIERS[tierIdx + 1];
	const target = next ? next.min : GROWTH_TIERS[tierIdx].min;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		role: "progressbar",
		"aria-valuenow": Math.round(progress * 100),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": nextName ? `התקדמות לדרגת ${nextName}` : "דרגה מקסימלית",
		children: [showLabels && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1.5 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "label-mono",
				children: ["LEVEL ", tierIdx + 1]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "display-latin text-[12px] tabular text-ink-2",
				children: [
					xp.toLocaleString("en-US"),
					next ? ` / ${target.toLocaleString("en-US")}` : "",
					" XP"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-2 overflow-hidden rounded-full border",
			style: {
				background: "var(--panel-2)",
				borderColor: "var(--line-soft)"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "h-full rounded-full",
				style: {
					background: "var(--grad-gold)",
					transformOrigin: "right",
					width: "100%"
				},
				initial: { scaleX: 0 },
				whileInView: { scaleX: progress },
				viewport: { once: true },
				transition: {
					duration: 1,
					ease: EASE
				}
			})
		})]
	});
}
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var REASONS = [
	{
		id: "no_time",
		label: "אין לי זמן כרגע"
	},
	{
		id: "too_expensive",
		label: "יקר לי מדי"
	},
	{
		id: "not_found",
		label: "לא מצאתי את מה שחיפשתי"
	},
	{
		id: "finished",
		label: "סיימתי את מה שבאתי ללמוד"
	},
	{
		id: "other",
		label: "אחר"
	}
];
var STEP_LABELS = [
	"מה בנית",
	"הסיבה",
	"הצעה",
	"אישור"
];
function fmtDate(iso) {
	return new Intl.DateTimeFormat("he-IL", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(iso));
}
function LeafFlame({ size = 44 }) {
	const reduced = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.svg, {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		style: { transformOrigin: "50% 90%" },
		animate: reduced ? void 0 : {
			opacity: [
				1,
				.45,
				.9,
				.55,
				1
			],
			scale: [
				1,
				.96,
				1.02,
				.97,
				1
			]
		},
		transition: {
			duration: 3.6,
			repeat: Infinity,
			ease: "easeInOut"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 3 C7 8 6 12 8 16 C9.2 18.4 11 19.5 12 21 C13 19.5 14.8 18.4 16 16 C18 12 17 8 12 3Z",
			fill: "var(--accent)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 8 C10.5 11 10.5 14 12 18",
			stroke: "var(--bg)",
			strokeWidth: "1",
			opacity: "0.4",
			strokeLinecap: "round"
		})]
	});
}
function Stepper({ current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mb-8 flex items-center gap-2",
		"aria-label": "שלבי תהליך הביטול",
		children: STEP_LABELS.map((label, i) => {
			const step = i + 1;
			const done = step < current;
			const active = step === current;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-1 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] tabular",
						"aria-current": active ? "step" : void 0,
						style: {
							borderColor: done || active ? "var(--accent)" : "var(--line)",
							background: done ? "var(--grad-gold)" : active ? "var(--accent-faint)" : "transparent",
							color: done ? "#1a1206" : active ? "var(--accent)" : "var(--muted)"
						},
						children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : step
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-small sm:block",
						style: { color: active ? "var(--ink)" : "var(--muted)" },
						children: label
					}),
					step < STEP_LABELS.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-px flex-1",
						style: { background: done ? "var(--accent-border)" : "var(--line)" },
						"aria-hidden": "true"
					})
				]
			}, label);
		})
	});
}
function CancelPage() {
	const { profile } = useSession();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const gated = useGatedVariants(revealUp);
	const [step, setStep] = (0, import_react.useState)(1);
	const [reason, setReason] = (0, import_react.useState)(null);
	const [freeText, setFreeText] = (0, import_react.useState)("");
	const [confirmChecked, setConfirmChecked] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const subQuery = useQuery({
		queryKey: ["subscription"],
		queryFn: () => data.account.getSubscription()
	});
	const streakQuery = useQuery({
		queryKey: ["streak"],
		queryFn: () => data.gamification.getStreak()
	});
	const achievementsQuery = useQuery({
		queryKey: ["achievements"],
		queryFn: () => data.gamification.getAchievements()
	});
	const surveyInput = () => ({
		reason: reason ?? "other",
		freeText: freeText.trim() || void 0
	});
	const acceptPause = useMutation({
		mutationFn: async () => {
			await data.account.submitCancellationSurvey(surveyInput());
			await data.account.pauseSubscription();
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["subscription"] });
			toast.success("המנוי הושהה ל-30 יום. הכול נשמר — מחכים לך כאן.");
			navigate({ to: "/account" });
		},
		onError: () => toast.error(copy["error.generic"])
	});
	const acceptDiscount = useMutation({
		mutationFn: async () => {
			await data.account.submitCancellationSurvey(surveyInput());
			await data.account.acceptDiscount();
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["subscription"] });
			toast.success("ההנחה הופעלה. 3 החודשים הקרובים ב-30% הנחה.");
			navigate({ to: "/account" });
		},
		onError: () => toast.error(copy["error.generic"])
	});
	const confirmCancel = useMutation({
		mutationFn: async () => {
			await data.account.submitCancellationSurvey(surveyInput());
			await data.account.cancelSubscription();
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["subscription"] });
			setDone(true);
		},
		onError: () => toast.error(copy["error.generic"])
	});
	if (subQuery.isLoading || streakQuery.isLoading || achievementsQuery.isLoading || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-8 h-10 w-64 rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-36 rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-6 h-12 rounded-lg" })
		]
	});
	if (subQuery.isError || !subQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "משהו השתבש",
				description: copy["error.generic"],
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => subQuery.refetch(),
					className: "btn-secondary text-small",
					children: "נסה שוב"
				})
			})
		})
	});
	const sub = subQuery.data;
	const endDate = fmtDate(sub.currentPeriodEnd);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "surface-card p-10 text-center",
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .8,
				ease: EASE
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, {
					className: "mx-auto h-10 w-10 text-accent",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-h1 text-ink",
					children: "המנוי בוטל. הדלת נשארת פתוחה."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-body text-ink-2",
					children: [
						"הגישה שלך פתוחה עד",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[14px] tabular text-ink",
							children: endDate
						}),
						". לא יהיה חיוב נוסף."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-small text-muted",
					children: "אם תחזרי תוך 12 חודשים — הנקודות, ההישגים והרצף הטוב ביותר שלך נשמרים בדיוק כאן."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "btn-primary mt-7 inline-block text-small",
					children: "חזרה לחממה"
				})
			]
		})
	});
	if (sub.status === "canceled") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "המנוי כבר בוטל",
				description: `הגישה שלך פתוחה עד ${endDate}. אם תחזרי תוך 12 חודשים — הכול נשמר.`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					className: "btn-secondary text-small",
					children: "חזרה לחשבון"
				})
			})
		})
	});
	const streak = streakQuery.data ?? {
		days: profile.streakDays,
		best: profile.streakBest,
		freezes: 0,
		lastActiveDate: ""
	};
	const unlockedCount = (achievementsQuery.data ?? []).filter((a) => a.unlockedAt).length;
	const { toNext, nextStage, nextName } = tierProgress(profile.xpTotal);
	const nextPerk = nextStage ? tierByStage(nextStage).perk : null;
	const offer = reason === "too_expensive" && !sub.discountUsed ? "discount" : "pause";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/account",
				className: "mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "החשבון שלי"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "ביטול מנוי"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { current: step }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
				initial: false,
				children: [
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -10
						},
						transition: {
							duration: .5,
							ease: EASE
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-h1 text-ink",
								children: "לפני שממשיכים — זה מה שצברת בחממה"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-body text-ink-2",
								children: "מה בנית, ומה מחכה לך אם נשארים."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "mt-6 grid gap-4 sm:grid-cols-2",
								variants: staggerContainer(.07),
								initial: "hidden",
								animate: "visible",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: gated,
										className: "surface-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "label-mono",
												children: "נקודות צמיחה"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "display-latin mt-2 text-[32px] font-bold tabular text-ink",
												children: profile.xpTotal.toLocaleString("en-US")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-small text-ink-2",
												children: ["דרגת ", tierName(profile.growthStage)]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: gated,
										className: "surface-card p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "label-mono",
											children: "רצף השקיה"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafFlame, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "display-latin text-[32px] font-bold tabular text-ink",
												children: streak.days
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-small text-muted",
												children: ["ימים רצופים · השיא שלך: ", streak.best]
											})] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: gated,
										className: "surface-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "label-mono",
												children: "הישגים"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
													className: "h-8 w-8 text-accent",
													"aria-hidden": "true"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "display-latin text-[32px] font-bold tabular text-ink",
													children: unlockedCount
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-small text-ink-2",
												children: "הישגים שנפתחו — וכולם נשמרים לך."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: gated,
										className: "surface-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "label-mono",
												children: "את במרחק נגיעה"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XPBar, {
													xp: profile.xpTotal,
													showLabels: false
												})
											}),
											nextName && nextPerk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-3 text-small text-ink-2",
												children: [
													"עוד",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[13px] tabular text-accent",
														children: toNext.toLocaleString("en-US")
													}),
													" ",
													"נקודות ואת בדרגת ",
													nextName,
													": ",
													nextPerk,
													"."
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 text-small text-ink-2",
												children: "הגעת לדרגה הגבוהה ביותר — מצמיחה. זה שלך לתמיד."
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-6 text-small text-muted",
								children: [
									"עם הביטול, הגישה תיסגר ב-",
									endDate,
									". הנתונים נשמרים 12 חודשים למקרה שתחזרי."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => navigate({ to: "/account" }),
									className: "btn-primary inline-flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), "נשארת בחממה"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(2),
									className: "btn-secondary text-small",
									children: "המשך בתהליך הביטול"
								})]
							})
						]
					}, "step-1"),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -10
						},
						transition: {
							duration: .5,
							ease: EASE
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-h1 text-ink",
								children: "מה הסיבה העיקרית?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-body text-ink-2",
								children: "בחירה אחת — זה עוזר לנו להשתפר באמת."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
								dir: "rtl",
								className: "mt-6 gap-2.5",
								value: reason ?? "",
								onValueChange: (v) => setReason(v),
								children: REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
									style: {
										borderColor: reason === r.id ? "var(--accent)" : "var(--line)",
										background: reason === r.id ? "var(--accent-faint)" : "transparent"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: r.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-body text-ink",
										children: r.label
									})]
								}, r.id))
							}),
							reason === "other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								autoFocus: true,
								value: freeText,
								onChange: (e) => setFreeText(e.target.value),
								placeholder: "נקרא כל מילה",
								className: "mt-4 min-h-[90px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(3),
									disabled: !reason,
									className: "btn-primary text-small disabled:opacity-50",
									children: "המשך"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(1),
									className: "btn-ghost text-small",
									children: "חזרה"
								})]
							})
						]
					}, "step-2"),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -10
						},
						transition: {
							duration: .5,
							ease: EASE
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-xl",
							children: [offer === "discount" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePercent, {
										className: "mx-auto h-10 w-10 text-accent",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-4 text-h2 text-ink",
										children: "נשארים — בתנאים אחרים"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-body text-ink-2",
										children: "3 החודשים הקרובים ב-30% הנחה."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-small text-muted",
										children: "הטבה חד-פעמית לחשבון. מופעלת מיד, בלי טפסים."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => acceptDiscount.mutate(),
										disabled: acceptDiscount.isPending,
										className: "btn-primary mt-6 text-small disabled:opacity-60",
										children: acceptDiscount.isPending ? "רגע..." : "הפעלת ההנחה"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card p-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, {
										className: "mx-auto h-10 w-10 text-accent",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-4 text-h2 text-ink",
										children: "צריכה הפסקה? ניקח אותה יחד"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-body text-ink-2",
										children: "מקפיאים לך את המנוי ל-30 יום — בלי חיוב, הכול נשמר, הרצף מוגן."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-small text-muted",
										children: "החידוש מתוזמן אוטומטית, ונזכיר לך שלושה ימים לפני."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => acceptPause.mutate(),
										disabled: acceptPause.isPending,
										className: "btn-primary mt-6 text-small disabled:opacity-60",
										children: acceptPause.isPending ? "רגע..." : "השהיית המנוי ל-30 יום"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-col items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(4),
									className: "text-small text-muted underline underline-offset-4 transition-colors hover:text-ink",
									children: "לא, אני רוצה לבטל"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setStep(2),
									className: "btn-ghost text-small",
									children: "חזרה"
								})]
							})]
						})
					}, "step-3"),
					step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -10
						},
						transition: {
							duration: .5,
							ease: EASE
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-h1 text-ink",
									children: "אישור אחרון — בקצב שלך"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-body text-ink-2",
									children: "מה בדיוק קורה, ומתי."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "surface-card mt-6 p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, {
												className: "mt-0.5 h-5 w-5 shrink-0 text-ink-2",
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-body text-ink-2",
												children: [
													"הגישה שלך נשארת פתוחה עד",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[14px] tabular text-ink",
														children: endDate
													}),
													" — עד סוף התקופה ששולמה. לא יהיה חיוב נוסף."
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, {
												className: "mt-0.5 h-5 w-5 shrink-0 text-ink-2",
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-body text-ink-2",
												children: "אם תחזרי תוך 12 חודשים — הנקודות, ההישגים והרצף הטוב ביותר שלך נשמרים."
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mt-6 flex cursor-pointer items-center gap-3 border-t border-line-soft pt-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: confirmChecked,
											onCheckedChange: (v) => setConfirmChecked(v === true)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-small text-ink-2",
											children: [
												"הבנתי — הגישה תיסגר ב-",
												endDate,
												", ואפשר לחזור מתי שרוצים."
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap items-center gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => confirmCancel.mutate(),
											disabled: !confirmChecked || confirmCancel.isPending,
											className: "px-5 py-2.5 font-semibold transition-opacity disabled:opacity-50",
											style: {
												borderRadius: "var(--radius-md)",
												color: "var(--danger)",
												border: "1px solid color-mix(in srgb, var(--danger) 45%, transparent)",
												background: "color-mix(in srgb, var(--danger) 10%, transparent)"
											},
											children: confirmCancel.isPending ? "רגע..." : "ביטול המנוי"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => navigate({ to: "/account" }),
											className: "btn-secondary text-small",
											children: "נשארת בחממה"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setStep(3),
											className: "btn-ghost text-small",
											children: "חזרה"
										})
									]
								})
							]
						})
					}, "step-4")
				]
			})
		]
	});
}
//#endregion
export { CancelPage as component };
