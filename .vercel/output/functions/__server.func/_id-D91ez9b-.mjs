import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { i as AnimatePresence, n as useReducedMotion } from "./_libs/framer-motion.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { n as EASE } from "./_ssr/motion-D3meAu4o.mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { t as copy } from "./_ssr/copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, b as useRouter, f as useChildMatches, p as Outlet, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { Ot as ArrowRight, kt as ArrowLeft, lt as ClipboardCheck, n as X } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-D91ez9b-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizRoute() {
	if (useChildMatches().length > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizPage, {});
}
function QuizPage() {
	const { id } = useParams({ from: "/quiz/$id" });
	const router = useRouter();
	const qc = useQueryClient();
	const reduced = useReducedMotion();
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
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [dir, setDir] = (0, import_react.useState)(1);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const submit = useMutation({
		mutationFn: () => data.quizzes.submitAttempt(id, answers),
		onSuccess: (result) => {
			qc.invalidateQueries({ queryKey: ["session"] });
			qc.invalidateQueries({ queryKey: ["achievements"] });
			router.navigate({
				to: "/quiz/$id/results",
				params: { id },
				replace: true,
				state: (prev) => ({
					...prev,
					quizReview: {
						quizId: id,
						result,
						answers
					}
				})
			});
		},
		onError: () => toast.error(copy["error.generic"])
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[3px] w-full",
			style: { background: "var(--panel-2)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-3 h-5 w-28 rounded-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-8 h-10 w-2/3 rounded-md" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-80 rounded-xl" })
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
	if (!quiz || quiz.questions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
	const total = quiz.questions.length;
	const question = quiz.questions[idx];
	const chosen = answers[question.id];
	const isLast = idx === total - 1;
	const pct = Math.round((idx + 1) / total * 100);
	const slide = reduced ? 0 : 36;
	function goNext() {
		if (idx >= total - 1) return;
		setDir(1);
		setIdx((i) => i + 1);
	}
	function goBack() {
		if (idx === 0) return;
		setDir(-1);
		setIdx((i) => i - 1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[3px] w-full",
				style: { background: "var(--panel-2)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "h-full",
					style: { background: "var(--grad-gold)" },
					initial: { width: 0 },
					animate: { width: `${pct}%` },
					transition: {
						duration: .5,
						ease: EASE
					}
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5",
				children: [
					course ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses/$slug",
						params: { slug: course.slug },
						className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent",
						"aria-label": "יציאה מהמבחן וחזרה לקורס",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "יציאה מהמבחן"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses",
						className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent",
						"aria-label": "יציאה מהמבחן",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "יציאה מהמבחן"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-small text-ink",
							children: quiz.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] tabular text-muted",
						children: [
							"שאלה ",
							idx + 1,
							" מתוך ",
							total
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-2xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "מבחן ידע"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: quiz.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-small text-muted",
					children: [
						"סף מעבר: ",
						quiz.passScore,
						". אפשר לחזור אחורה ולשנות תשובות עד ההגשה."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						initial: false,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
							initial: {
								opacity: 0,
								x: dir * -slide
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: dir * slide
							},
							transition: {
								duration: .35,
								ease: EASE
							},
							className: "surface-card p-6 md:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px]",
									style: {
										background: "var(--accent-faint)",
										color: "var(--accent)"
									},
									children: String(idx + 1).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-h2 text-ink",
									children: question.prompt
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "radiogroup",
								"aria-label": question.prompt,
								className: "mt-6 space-y-3",
								children: question.options.map((o) => {
									const selected = chosen === o.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										role: "radio",
										"aria-checked": selected,
										onClick: () => setAnswers((a) => ({
											...a,
											[question.id]: o.id
										})),
										className: "flex w-full items-center gap-3 rounded-lg border p-4 text-start transition-all",
										style: {
											borderColor: selected ? "var(--accent)" : "var(--line)",
											background: selected ? "var(--accent-faint)" : "var(--bg-2)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
											style: { borderColor: selected ? "var(--accent)" : "var(--muted-2)" },
											"aria-hidden": "true",
											children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-2.5 w-2.5 rounded-full",
												style: { background: "var(--accent)" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-body",
											style: { color: selected ? "var(--ink)" : "var(--ink-2)" },
											children: o.text
										})]
									}, o.id);
								})
							})]
						}, question.id)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: goBack,
						disabled: idx === 0 || submit.isPending,
						className: "btn-ghost inline-flex items-center gap-2 text-small disabled:opacity-40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), "הקודמת"]
					}), isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => submit.mutate(),
						disabled: !chosen || submit.isPending,
						className: "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-4 w-4" }), submit.isPending ? "בודקים את התשובות..." : "הגשת המבחן"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: goNext,
						disabled: !chosen,
						className: "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50",
						children: ["הבאה", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })]
					})]
				}),
				submit.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-end text-small",
					style: { color: "var(--danger)" },
					children: "ההגשה לא נשמרה — נסה שוב."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-center gap-2",
					"aria-hidden": "true",
					children: quiz.questions.map((q, i) => {
						const answered = !!answers[q.id];
						const isCurrent = i === idx;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 rounded-full transition-all",
							style: {
								width: isCurrent ? 22 : 8,
								background: answered ? "var(--grad-gold)" : isCurrent ? "var(--muted-2)" : "var(--line)"
							}
						}, q.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { QuizRoute as component };
