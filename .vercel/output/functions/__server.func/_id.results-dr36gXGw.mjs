import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useReducedMotion } from "./_libs/framer-motion.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, n as EASE, o as useCountUp, s as useGatedVariants } from "./_ssr/motion-D3meAu4o.mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { r as t, t as copy } from "./_ssr/copy-DH5R7OvZ.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, l as useRouterState, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { Dt as Award, T as RotateCcw, _t as Check, kt as ArrowLeft, n as X } from "./_libs/lucide-react.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id.results-dr36gXGw.js
var import_jsx_runtime = require_jsx_runtime();
var XP_QUIZ_PASS = 50;
var XP_QUIZ_PERFECT = 25;
function QuizResultsPage() {
	const { id } = useParams({ from: "/quiz/$id/results" });
	const review = useRouterState({ select: (s) => s.location.state.quizReview });
	const gated = useGatedVariants(revealUp);
	const { data: quiz, isLoading, isError, refetch } = useQuery({
		queryKey: ["quiz", id],
		queryFn: () => data.quizzes.get(id)
	});
	const { data: courses } = useQuery({
		queryKey: ["courses"],
		queryFn: () => data.courses.list(),
		enabled: !!quiz
	});
	const course = quiz ? courses?.find((c) => c.modules.some((m) => m.id === quiz.moduleId)) ?? null : null;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[3px] w-full",
			style: { background: "var(--panel-2)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mx-auto mb-8 h-44 w-44 rounded-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mx-auto mb-3 h-8 w-1/2 rounded-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-36 rounded-xl" }, i))
				})
			]
		})]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card w-full max-w-md p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-h2 text-ink",
				children: copy["error.generic"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => refetch(),
					className: "btn-primary text-small",
					children: "נסה שוב"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses",
					className: "btn-secondary text-small",
					children: "חזרה לספרייה"
				})]
			})]
		})
	});
	if (!quiz) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "המבחן לא נמצא",
				description: "ייתכן שהקישור השתנה או שהמבחן עוד לא פורסם.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses",
					className: "btn-primary text-small",
					children: "חזרה לספרייה"
				})
			})
		})
	});
	if (!review || review.quizId !== id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "התוצאות כבר לא כאן",
				description: "הגעת לעמוד בלי הגשה טרייה. אפשר לגשת למבחן שוב ולקבל תוצאה חדשה.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/quiz/$id",
						params: { id },
						className: "btn-primary inline-flex items-center gap-2 text-small",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "לגשת למבחן"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseLink, {
						course,
						className: "btn-secondary text-small"
					})]
				})
			})
		})
	});
	const { result, answers } = review;
	const xpShown = result.xpAwarded > 0 ? result.xpAwarded : (result.passed ? XP_QUIZ_PASS : 0) + (result.perfect ? XP_QUIZ_PERFECT : 0);
	const correctCount = quiz.questions.filter((q) => answers[q.id] && answers[q.id] === result.correctByQuestion[q.id]).length;
	const headline = result.perfect ? "מאה אחוז — צמיחה מושלמת" : result.passed ? "עברת את המבחן" : "עוד לא — וזה בסדר";
	const sub = result.perfect ? "ענית נכון על כל השאלות. ההישג נרשם בחממה שלך." : result.passed ? `עברת את סף ה-${quiz.passScore}. הידע מכה שורש.` : "צמיחה היא לא קו ישר. עבור על הפירוט למטה ונסה שוב.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[3px] w-full",
				style: { background: "var(--grad-gold)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseLink, {
						course,
						className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent",
						icon: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-small text-ink",
							children: quiz.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "תוצאות"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
					className: "surface-card relative overflow-hidden p-8 text-center",
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
					children: [result.passed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldParticles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								score: result.score,
								passed: result.passed
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-6 text-h1 text-ink",
								children: headline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-md text-body text-ink-2",
								children: sub
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[12px] tabular text-muted",
										children: [
											correctCount,
											" מתוך ",
											quiz.questions.length,
											" תשובות נכונות"
										]
									}),
									xpShown > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[12px] tabular",
										style: {
											background: "var(--accent-faint)",
											color: "var(--accent)"
										},
										children: t("points.earned", { count: xpShown })
									}),
									result.perfect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]",
										style: {
											background: "var(--accent-faint)",
											color: "var(--accent)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5" }), "הישג: מאה אחוז"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-7 flex flex-wrap items-center justify-center gap-3",
								children: result.passed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseLink, {
									course,
									className: "btn-primary text-small"
								}), !result.perfect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/quiz/$id",
									params: { id },
									className: "btn-secondary inline-flex items-center gap-2 text-small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "נסה שוב"]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/quiz/$id",
									params: { id },
									className: "btn-primary inline-flex items-center gap-2 text-small",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "נסה שוב"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseLink, {
									course,
									className: "btn-secondary text-small"
								})] })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-10 mb-4 text-h2 text-ink",
					children: "פירוט התשובות"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
					className: "space-y-4",
					variants: staggerContainer(.06),
					initial: "hidden",
					animate: "visible",
					children: quiz.questions.map((q, qi) => {
						const chosenId = answers[q.id];
						const correctId = result.correctByQuestion[q.id];
						const ok = !!chosenId && chosenId === correctId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
							variants: gated,
							className: "surface-card p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
									style: {
										background: ok ? "color-mix(in srgb, var(--success) 14%, transparent)" : "color-mix(in srgb, var(--danger) 14%, transparent)",
										color: ok ? "var(--success)" : "var(--danger)"
									},
									"aria-label": ok ? "תשובה נכונה" : "תשובה שגויה",
									children: ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-h3 text-ink",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[13px] tabular text-muted",
													children: String(qi + 1).padStart(2, "0")
												}),
												" ",
												q.prompt
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-3 space-y-2",
											children: q.options.map((o) => {
												const isCorrect = o.id === correctId;
												const isChosen = o.id === chosenId;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-3 rounded-lg border px-3.5 py-2.5",
													style: {
														borderColor: isCorrect ? "color-mix(in srgb, var(--success) 45%, transparent)" : isChosen ? "color-mix(in srgb, var(--danger) 45%, transparent)" : "var(--line-soft)",
														background: isCorrect ? "color-mix(in srgb, var(--success) 8%, transparent)" : isChosen ? "color-mix(in srgb, var(--danger) 8%, transparent)" : "transparent"
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "flex-1 text-small",
															style: { color: isCorrect || isChosen ? "var(--ink)" : "var(--ink-2)" },
															children: o.text
														}),
														isChosen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "label-mono shrink-0",
															children: "התשובה שלך"
														}),
														isCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
															className: "h-4 w-4 shrink-0",
															style: { color: "var(--success)" }
														}) : isChosen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
															className: "h-4 w-4 shrink-0",
															style: { color: "var(--danger)" }
														}) : null
													]
												}, o.id);
											})
										}),
										!chosenId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-small text-muted",
											children: "לא נבחרה תשובה לשאלה זו."
										})
									]
								})]
							})
						}, q.id);
					})
				})
			]
		})]
	});
}
function CourseLink({ course, className, icon = false }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), course ? "חזרה לקורס" : "לספריית הקורסים"] });
	return course ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/courses/$slug",
		params: { slug: course.slug },
		className: `inline-flex items-center gap-2 ${className}`,
		children: inner
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/courses",
		className: `inline-flex items-center gap-2 ${className}`,
		children: inner
	});
}
function ScoreRing({ score, passed }) {
	const C = 2 * Math.PI * 54;
	const { ref, value } = useCountUp(score, 1.4);
	const clamped = Math.min(100, Math.max(0, score));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		style: {
			width: 176,
			height: 176
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 120",
			width: 176,
			height: 176,
			className: "-rotate-90",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "quizScoreGold",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0",
						stopColor: "var(--accent-3)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "1",
						stopColor: "var(--accent-2)"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "54",
					fill: "none",
					stroke: "var(--line)",
					strokeWidth: "7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
					cx: "60",
					cy: "60",
					r: "54",
					fill: "none",
					stroke: passed ? "url(#quizScoreGold)" : "var(--danger)",
					strokeWidth: "7",
					strokeLinecap: "round",
					strokeDasharray: C,
					initial: { strokeDashoffset: C },
					animate: { strokeDashoffset: C * (1 - clamped / 100) },
					transition: {
						duration: 1.4,
						ease: EASE
					}
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			role: "img",
			"aria-label": `ציון ${score} מתוך 100`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				ref,
				className: "display-latin text-ink",
				style: {
					fontSize: 44,
					fontWeight: 800,
					lineHeight: 1
				},
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono mt-1.5",
				children: "מתוך 100"
			})]
		})]
	});
}
function GoldParticles() {
	if (useReducedMotion()) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		"aria-hidden": "true",
		children: Array.from({ length: 14 }, (_, i) => ({
			left: (i * 61 + 13) % 100,
			delay: i % 7 * .9,
			size: 3 + i % 3 * 2,
			dur: 7 + i % 5
		})).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
			className: "absolute rounded-full",
			style: {
				insetInlineStart: `${d.left}%`,
				bottom: -10,
				width: d.size,
				height: d.size,
				background: i % 2 ? "var(--accent)" : "var(--accent-3)"
			},
			initial: {
				y: 0,
				opacity: 0
			},
			animate: {
				y: -280,
				opacity: [
					0,
					.85,
					0
				]
			},
			transition: {
				duration: d.dur,
				delay: d.delay,
				repeat: Infinity,
				ease: "linear"
			}
		}, i))
	});
}
//#endregion
export { QuizResultsPage as component };
