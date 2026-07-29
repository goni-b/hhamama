import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { r as t } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Repeat, _t as Check, l as TrendingUp, p as Target, v as Sparkles } from "../_libs/lucide-react.mjs";
import { n as Logo, t as AmbientBackground } from "./AmbientBackground-CqHVwcVb.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-C4M1TUrR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var GOALS = [
	{
		id: "business",
		label: "להקים עסק",
		icon: Target
	},
	{
		id: "revenue",
		label: "להגדיל הכנסה",
		icon: TrendingUp
	},
	{
		id: "career",
		label: "להחליף קריירה",
		icon: Repeat
	},
	{
		id: "ai",
		label: "ללמוד AI",
		icon: Sparkles
	}
];
var INTERESTS = [
	"קמפיינים",
	"דפי נחיתה",
	"אוטומציות",
	"קופירייטינג",
	"AI כללי"
];
var STEPS = [
	"מה היעד?",
	"מה מעניין?",
	"כמה זמן?",
	"החוזה"
];
function WelcomePage() {
	const router = useRouter();
	const qc = useQueryClient();
	const { profile } = useSession();
	const firstName = profile?.fullName.split(" ")[0] ?? "";
	const fem = profile?.preferredGender !== "m";
	const [step, setStep] = (0, import_react.useState)(0);
	const [goal, setGoal] = (0, import_react.useState)(null);
	const [interests, setInterests] = (0, import_react.useState)([]);
	const [minutes, setMinutes] = (0, import_react.useState)(150);
	const [planting, setPlanting] = (0, import_react.useState)(false);
	const finish = useMutation({
		mutationFn: () => data.auth.completeOnboarding({
			goal: goal ?? "business",
			interests,
			weeklyGoalMinutes: minutes
		}),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["session"] });
			toast.success(t("points.earned", { count: 25 }));
			setTimeout(() => router.navigate({ to: "/" }), 1100);
		}
	});
	const goalLabel = GOALS.find((g) => g.id === goal)?.label ?? "להקים עסק";
	const canNext = step === 0 ? !!goal : step === 1 ? interests.length > 0 : true;
	function toggleInterest(x) {
		setInterests((prev) => prev.includes(x) ? prev.filter((i) => i !== x) : [...prev, x]);
	}
	function handleFinish() {
		setPlanting(true);
		setTimeout(() => finish.mutate(), 950);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}),
			planting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GerminationOverlay, { name: firstName }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[560px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex flex-col items-center gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
							variant: "mark",
							size: 48,
							animated: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: STEPS.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-1.5 rounded-full transition-all duration-300",
								style: {
									width: i === step ? 28 : 8,
									background: i <= step ? "var(--accent)" : "var(--line)"
								}
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card min-h-[380px] p-7",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							initial: false,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: 28
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: {
									opacity: 0,
									x: -28
								},
								transition: {
									duration: .22,
									ease: EASE
								},
								children: [
									step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-h2 text-ink",
											children: firstName ? `${firstName}, מה היעד הגדול שלך?` : "מה היעד הגדול שלך?"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-small text-muted",
											children: "נכוון את החממה לכיוון שהכי חשוב לך."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 grid grid-cols-2 gap-3",
											children: GOALS.map((g) => {
												const Icon = g.icon;
												const active = goal === g.id;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setGoal(g.id),
													className: "flex flex-col items-start gap-3 rounded-lg border p-4 text-start transition-all",
													style: {
														borderColor: active ? "var(--accent)" : "var(--line)",
														background: active ? "var(--accent-faint)" : "var(--bg-2)"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
														className: "h-6 w-6",
														style: { color: active ? "var(--accent)" : "var(--ink-2)" }
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-body font-medium text-ink",
														children: g.label
													})]
												}, g.id);
											})
										})
									] }),
									step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-h2 text-ink",
											children: "מה מעניין אותך ללמוד?"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-small text-muted",
											children: "אפשר לבחור כמה שרוצים — נתחיל מכאן."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 flex flex-wrap gap-2.5",
											children: INTERESTS.map((x) => {
												const active = interests.includes(x);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => toggleInterest(x),
													className: "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-small transition-all",
													style: {
														borderColor: active ? "var(--accent)" : "var(--line)",
														background: active ? "var(--accent-faint)" : "transparent",
														color: active ? "var(--accent)" : "var(--ink-2)"
													},
													children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), x]
												}, x);
											})
										})
									] }),
									step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-h2 text-ink",
											children: "כמה זמן תשקיע בשבוע?"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-small text-muted",
											children: "היעד הזה יעזור לנו לשמור אותך על הקצב שלך."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-10 text-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "display-latin text-display gold-text",
												children: minutes
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "label-mono mt-1",
												children: "דקות בשבוע"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-8 px-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
												value: [minutes],
												onValueChange: ([v]) => setMinutes(v),
												min: 30,
												max: 300,
												step: 10
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex justify-between text-small text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "צעד קטן · 60" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "מחויבות · 150" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "טורבו · 300" })
												]
											})]
										})
									] }),
									step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-h2 text-ink",
											children: "החוזה האישי שלך"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-small text-muted",
											children: "כמה מילים לעצמך — זו ההתחלה."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 rounded-lg border border-[color:var(--accent-border)] bg-[color:var(--accent-faint)] p-6 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-body-lg text-ink",
												children: [
													fem ? "אני" : "אני",
													", ",
													firstName || "חבר/ה",
													", ",
													fem ? "מתחייבת" : "מתחייב",
													" ל־",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "display-latin font-bold text-accent",
														children: minutes
													}),
													" דקות בשבוע כדי ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-accent",
														children: goalLabel
													}),
													"."
												]
											})
										})
									] })
								]
							}, step)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStep((s) => Math.max(0, s - 1)),
							className: "btn-ghost text-small",
							style: { visibility: step === 0 ? "hidden" : "visible" },
							children: "חזרה"
						}), step < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => canNext && setStep((s) => s + 1),
							disabled: !canNext,
							className: "btn-primary disabled:opacity-40",
							children: "המשך"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleFinish,
							disabled: finish.isPending || planting,
							className: "btn-primary disabled:opacity-60",
							children: "נטעתי את הזרע"
						})]
					})
				]
			})
		]
	});
}
function GerminationOverlay({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6",
		style: { background: "rgba(10,8,6,0.9)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.svg, {
			width: 120,
			height: 120,
			viewBox: "0 0 24 24",
			fill: "none",
			initial: { scale: .9 },
			animate: { scale: 1 },
			transition: {
				duration: .9,
				ease: EASE
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "4",
					y1: "20",
					x2: "20",
					y2: "20",
					stroke: "var(--accent-border)",
					strokeWidth: "1.5",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
					d: "M12 20 V11",
					stroke: "var(--accent)",
					strokeWidth: "1.8",
					strokeLinecap: "round",
					initial: { pathLength: 0 },
					animate: { pathLength: 1 },
					transition: {
						duration: .6,
						ease: EASE,
						delay: .2
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
					d: "M12 13 C9 13 7.5 11 7.5 9 C10 9 12 10.5 12 13Z",
					fill: "var(--accent-faint)",
					stroke: "var(--accent)",
					strokeWidth: "1.3",
					initial: {
						opacity: 0,
						scale: .4
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: {
						duration: .5,
						ease: EASE,
						delay: .5
					},
					style: { transformOrigin: "12px 11px" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
					d: "M12 13 C15 13 16.5 11 16.5 9 C14 9 12 10.5 12 13Z",
					fill: "var(--accent-faint)",
					stroke: "var(--accent)",
					strokeWidth: "1.3",
					initial: {
						opacity: 0,
						scale: .4
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: {
						duration: .5,
						ease: EASE,
						delay: .65
					},
					style: { transformOrigin: "12px 11px" }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
			className: "text-h3 gold-text",
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			transition: { delay: .8 },
			children: name ? `נטעת את הזרע, ${name}` : "נטעת את הזרע"
		})]
	});
}
//#endregion
export { WelcomePage as component };
