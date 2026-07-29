import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "./_libs/motion.mjs";
import { n as EASE } from "./_ssr/motion-D3meAu4o.mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Play, B as Lock, W as Layers, _t as Check, gt as ChevronDown, kt as ArrowLeft, lt as ClipboardCheck, st as Clock, yt as ChartColumn } from "./_libs/lucide-react.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-FC5KdfHK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var LEVEL_HE = {
	beginner: "מתחילים",
	intermediate: "בינוני",
	advanced: "מתקדם"
};
var OUTCOMES = [
	"לבנות קמפיין ראשון מקצה לקצה",
	"לכתוב הצעה שאי אפשר לסרב לה",
	"להשתמש ב-AI ככלי עבודה יומיומי",
	"לקרוא נתונים ולדעת מה לשפר"
];
function fmtDur(sec) {
	return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
/** שורת "מבחן המודול" בתחתית כל מודול — מוצגת רק כשקיים מבחן */
function ModuleQuizRow({ moduleId }) {
	const { data: quiz } = useQuery({
		queryKey: ["moduleQuiz", moduleId],
		queryFn: () => data.quizzes.getByModule(moduleId)
	});
	if (!quiz) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/quiz/$id",
		params: { id: quiz.id },
		className: "mb-2 flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors hover:bg-[color:var(--accent-faint)]",
		style: { borderColor: "var(--accent-border)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-5 w-5 shrink-0 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-4 w-4 text-accent" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 text-body text-ink",
				children: "מבחן המודול"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[11px] tabular text-muted",
				children: ["סף מעבר ", quiz.passScore]
			})
		]
	});
}
function CoursePage() {
	const { slug } = useParams({ from: "/_app/courses/$slug" });
	const { data: course, isLoading } = useQuery({
		queryKey: ["course", slug],
		queryFn: () => data.courses.getBySlug(slug)
	});
	const { data: progress } = useQuery({
		queryKey: ["progress", course?.id],
		queryFn: () => course ? data.progress.getForCourse(course.id) : Promise.resolve([]),
		enabled: !!course
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-6 h-64 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-96 rounded-xl" })]
	});
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "הקורס לא נמצא",
				description: "ייתכן שהקישור השתנה.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses",
					className: "btn-primary text-small",
					children: "חזרה לספרייה"
				})
			})
		})
	});
	const doneIds = new Set((progress ?? []).filter((p) => p.completedAt).map((p) => p.lessonId));
	const startedIds = new Set((progress ?? []).map((p) => p.lessonId));
	const allLessons = course.modules.flatMap((m) => m.lessons);
	const doneCount = allLessons.filter((l) => doneIds.has(l.id)).length;
	const pct = allLessons.length ? Math.round(doneCount / allLessons.length * 100) : 0;
	const firstUnwatched = allLessons.find((l) => !doneIds.has(l.id)) ?? allLessons[0];
	const started = startedIds.size > 0;
	const locked = !!course.lockedReason;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
			className: "surface-card relative mb-8 overflow-hidden",
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative p-7 md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses",
						className: "mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "ספריית הקורסים"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: course.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 max-w-2xl text-display text-ink",
						children: course.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-body-lg text-ink-2",
						children: course.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap items-center gap-5 font-mono text-[12px] tabular text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }),
									course.modules.length,
									" מודולים"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }),
									course.lessonsCount,
									" שיעורים"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
									Math.floor(course.totalDurationMin / 60),
									":",
									String(course.totalDurationMin % 60).padStart(2, "0"),
									" שעות"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }), LEVEL_HE[course.level]]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-4",
						children: [locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "btn-secondary inline-flex items-center gap-2 text-small opacity-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), course.lockedReason]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/learn/$courseSlug/$lessonId",
							params: {
								courseSlug: course.slug,
								lessonId: firstUnwatched.id
							},
							className: "btn-primary inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }), started ? "המשך צפייה" : "התחל את הצמיחה"]
						}), started && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 w-40 overflow-hidden rounded-full",
								style: { background: "var(--panel-2)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full",
									style: {
										width: `${pct}%`,
										background: "var(--grad-gold)"
									}
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] tabular text-muted",
								children: [pct, "%"]
							})]
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-[1fr_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-h2 text-ink",
				children: "תוכנית הקורס"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "multiple",
				defaultValue: [course.modules[0]?.id],
				className: "space-y-3",
				children: course.modules.map((m, mi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: m.id,
					className: "surface-card overflow-hidden border-0 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "hover:no-underline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px]",
								style: {
									background: "var(--accent-faint)",
									color: "var(--accent)"
								},
								children: String(mi + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-h3 text-ink",
								children: m.title
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 pb-2",
						children: m.lessons.map((l) => {
							const done = doneIds.has(l.id);
							const isLocked = locked;
							const row = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
								style: { background: "transparent" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-5 w-5 shrink-0 items-center justify-center",
										children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full",
											style: { background: "var(--grad-gold)" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-[#1a1206]" })
										}) : isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-muted-2" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 text-muted" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-body text-ink-2",
										children: l.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] tabular text-muted",
										children: fmtDur(l.durationSec)
									})
								]
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								title: course.lockedReason ?? void 0,
								className: "cursor-not-allowed opacity-60",
								children: row
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/learn/$courseSlug/$lessonId",
								params: {
									courseSlug: course.slug,
									lessonId: l.id
								},
								className: "block hover:bg-[color:var(--panel-2)] rounded-md",
								children: row
							}) }, l.id);
						})
					}), !locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleQuizRow, { moduleId: m.id })] })]
				}, m.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-h3 text-ink",
						children: "מה תשיג"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5",
						children: OUTCOMES.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-small text-ink-2",
								children: o
							})]
						}, o))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-h3 text-ink",
						children: "המנטורים שלך"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-small text-ink-2",
						children: "חופית וגוני — מלווים אותך צעד־צעד, מהיסודות ועד הקמפיין החי הראשון."
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { CoursePage as component };
