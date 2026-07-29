import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { i as AnimatePresence } from "./_libs/framer-motion.mjs";
import { t as motion } from "./_libs/motion.mjs";
import { n as EASE } from "./_ssr/motion-D3meAu4o.mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { t as copy } from "./_ssr/copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, b as useRouter, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Play, R as MessageCircleQuestionMark, _t as Check, et as FileText, h as StickyNote, kt as ArrowLeft, nt as Download } from "./_libs/lucide-react.mjs";
import { t as getVideoAdapter } from "./_ssr/provider-ndGpaDO1.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_courseSlug._lessonId-CJFRFjHC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(sec) {
	return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}
function LearnPage() {
	const { courseSlug, lessonId } = useParams({ from: "/learn/$courseSlug/$lessonId" });
	const router = useRouter();
	const qc = useQueryClient();
	const { data: course } = useQuery({
		queryKey: ["course", courseSlug],
		queryFn: () => data.courses.getBySlug(courseSlug)
	});
	const { data: progressList } = useQuery({
		queryKey: ["progress", course?.id],
		queryFn: () => course ? data.progress.getForCourse(course.id) : Promise.resolve([]),
		enabled: !!course
	});
	const allLessons = course?.modules.flatMap((m) => m.lessons.map((l) => ({
		lesson: l,
		moduleTitle: m.title
	}))) ?? [];
	const current = allLessons.find((x) => x.lesson.id === lessonId)?.lesson;
	const currentIdx = allLessons.findIndex((x) => x.lesson.id === lessonId);
	const next = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1].lesson : null;
	const doneIds = new Set((progressList ?? []).filter((p) => p.completedAt).map((p) => p.lessonId));
	const savedPos = (progressList ?? []).find((p) => p.lessonId === lessonId)?.positionSec ?? 0;
	const courseDone = allLessons.filter((x) => doneIds.has(x.lesson.id)).length;
	const coursePct = allLessons.length ? Math.round(courseDone / allLessons.length * 100) : 0;
	const [tab, setTab] = (0, import_react.useState)("materials");
	const [showUpNext, setShowUpNext] = (0, import_react.useState)(false);
	const [completedNow, setCompletedNow] = (0, import_react.useState)(false);
	if (!course || !current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-64 w-full max-w-3xl rounded-xl" })
	});
	async function handleComplete(silent = false) {
		if (doneIds.has(lessonId) || completedNow) return;
		setCompletedNow(true);
		const res = await data.progress.markComplete(lessonId);
		await qc.invalidateQueries({ queryKey: ["progress", course.id] });
		await qc.invalidateQueries({ queryKey: ["session"] });
		await qc.invalidateQueries({ queryKey: ["continue"] });
		if (!silent && res.xpAwarded > 0) toast.success(copy["success.lessonComplete"]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[3px] w-full",
					style: { background: "var(--panel-2)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "h-full",
						style: { background: "var(--grad-gold)" },
						initial: { width: 0 },
						animate: { width: `${coursePct}%` },
						transition: {
							duration: .9,
							ease: EASE
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-panel flex items-center gap-3 border-x-0 border-t-0 px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses/$slug",
							params: { slug: course.slug },
							className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-small text-muted transition-colors hover:text-accent",
							"aria-label": "חזרה לעמוד הקורס",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "חזרה לקורס"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-small text-ink",
								children: course.title
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] tabular text-muted",
							children: [coursePct, "% מהקורס"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayer, {
							lesson: current,
							resumeSec: savedPos,
							alreadyDone: doneIds.has(current.id),
							onSavePosition: (pos) => data.progress.savePosition(current.id, pos, 15),
							onReach90: () => handleComplete(),
							onEnded: () => {
								handleComplete();
								if (next) setShowUpNext(true);
							}
						}, current.id),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-h2 text-ink",
								children: current.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[12px] tabular text-muted",
								children: [fmt(current.durationSec), " דקות"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleComplete(),
									disabled: doneIds.has(current.id) || completedNow,
									className: "btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), doneIds.has(current.id) || completedNow ? "הושלם" : copy["cta.markComplete"]]
								}), next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/learn/$courseSlug/$lessonId",
									params: {
										courseSlug: course.slug,
										lessonId: next.id
									},
									className: "btn-primary inline-flex items-center gap-2 text-small",
									children: [copy["cta.nextLesson"], /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })]
								})]
							})]
						}),
						current.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-3xl whitespace-pre-line text-body leading-relaxed text-ink-2",
							children: current.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1 border-b border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
										active: tab === "materials",
										onClick: () => setTab("materials"),
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
										children: "חומרים"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
										active: tab === "notes",
										onClick: () => setTab("notes"),
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-4 w-4" }),
										children: "הערות"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
										active: tab === "questions",
										onClick: () => setTab("questions"),
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleQuestionMark, { className: "h-4 w-4" }),
										children: "שאלות"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-5",
								children: [
									tab === "materials" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialsTab, { lesson: current }),
									tab === "notes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesTab, { lessonId: current.id }),
									tab === "questions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-small text-muted",
										children: "שאלות ותשובות לשיעור זה ייפתחו בקרוב. בינתיים אפשר לשאול בקהילה."
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "lg:sticky lg:top-20 lg:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-line px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "תוכן הקורס"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[70vh] overflow-y-auto",
							children: course.modules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-[color:var(--bg-2)] px-4 py-2 text-[12px] font-medium text-muted",
								children: m.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: m.lessons.map((l) => {
								const isCurrent = l.id === current.id;
								const done = doneIds.has(l.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/learn/$courseSlug/$lessonId",
									params: {
										courseSlug: course.slug,
										lessonId: l.id
									},
									className: "flex items-center gap-2.5 px-4 py-2.5 text-small transition-colors",
									style: {
										background: isCurrent ? "var(--accent-faint)" : "transparent",
										borderInlineStart: isCurrent ? "3px solid var(--accent)" : "3px solid transparent",
										color: isCurrent ? "var(--accent)" : "var(--ink-2)"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-4 w-4 shrink-0 items-center justify-center",
											children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }) : isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-1.5 w-1.5 rounded-full",
												style: { background: "var(--muted-2)" }
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 truncate",
											children: l.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] tabular text-muted",
											children: fmt(l.durationSec)
										})
									]
								}) }, l.id);
							}) })] }, m.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showUpNext && next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpNextCard, {
				lesson: next,
				onCancel: () => setShowUpNext(false),
				onPlay: () => {
					setShowUpNext(false);
					router.navigate({
						to: "/learn/$courseSlug/$lessonId",
						params: {
							courseSlug: course.slug,
							lessonId: next.id
						}
					});
				}
			}) })
		]
	});
}
function VideoPlayer({ lesson, resumeSec, alreadyDone, onSavePosition, onReach90, onEnded }) {
	const holder = (0, import_react.useRef)(null);
	const lastSaved = (0, import_react.useRef)(0);
	const reached90 = (0, import_react.useRef)(alreadyDone);
	(0, import_react.useEffect)(() => {
		const el = holder.current;
		if (!el) return;
		const adapter = getVideoAdapter(lesson.videoProvider);
		let seekedResume = false;
		const handle = adapter.bindPlayer(el, lesson.videoId, {
			onReady: () => {
				if (resumeSec > 5 && !seekedResume) {
					seekedResume = true;
					handle.seekTo(resumeSec);
					toast(`ממשיכים מ-${fmt(resumeSec)}`);
				}
			},
			onProgress: (pos, dur) => {
				if (dur > 0 && pos - lastSaved.current >= 15) {
					lastSaved.current = pos;
					onSavePosition(Math.floor(pos));
				}
				if (dur > 0 && !reached90.current && pos / dur >= .9) {
					reached90.current = true;
					onReach90();
				}
			},
			onEnded: () => onEnded()
		});
		return () => handle.destroy();
	}, [lesson.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: holder,
			className: "aspect-video w-full bg-[color:var(--bg)]"
		})
	});
}
function TabBtn({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "inline-flex items-center gap-2 px-4 py-2.5 text-small transition-colors",
		style: {
			color: active ? "var(--accent)" : "var(--muted)",
			borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
			marginBottom: -1
		},
		children: [icon, children]
	});
}
function MaterialsTab({ lesson }) {
	if (lesson.resources.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-small text-muted",
		children: "אין חומרים מצורפים לשיעור זה."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: lesson.resources.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: r.url,
			className: "surface-panel flex items-center gap-3 p-3 transition-colors hover:border-[color:var(--accent-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-body text-ink-2",
					children: r.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 text-muted" })
			]
		}) }, r.id))
	});
}
function NotesTab({ lessonId }) {
	const [val, setVal] = (0, import_react.useState)("");
	const timer = (0, import_react.useRef)(null);
	const loadedFor = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadedFor.current = null;
		data.progress.getNote(lessonId).then((body) => {
			if (!cancelled) {
				setVal(body);
				loadedFor.current = lessonId;
			}
		});
		return () => {
			cancelled = true;
			if (timer.current) clearTimeout(timer.current);
		};
	}, [lessonId]);
	function onChange(v) {
		setVal(v);
		if (loadedFor.current !== lessonId) return;
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => data.progress.saveNote(lessonId, v), 800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value: val,
		onChange: (e) => onChange(e.target.value),
		placeholder: "ההערות שלך לשיעור הזה — נשמרות אוטומטית...",
		className: "min-h-[160px] w-full resize-y rounded-lg border border-line bg-bg-2 p-4 text-body text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-[12px] text-muted",
		children: "נשמר אוטומטית תוך כדי כתיבה."
	})] });
}
function UpNextCard({ lesson, onCancel, onPlay }) {
	const [count, setCount] = (0, import_react.useState)(8);
	(0, import_react.useEffect)(() => {
		if (count <= 0) {
			onPlay();
			return;
		}
		const id = setTimeout(() => setCount((c) => c - 1), 1e3);
		return () => clearTimeout(id);
	}, [count, onPlay]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "fixed bottom-6 z-40 w-[92%] max-w-sm rounded-xl p-5 shadow-[var(--elev-3)]",
		style: {
			insetInlineEnd: 24,
			background: "var(--panel-2)",
			border: "1px solid var(--accent-border)"
		},
		initial: {
			opacity: 0,
			y: 30
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: 30
		},
		transition: {
			duration: .4,
			ease: EASE
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "label-mono",
				children: "השיעור הבא"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1.5 text-h3 text-ink",
				children: lesson.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-small text-muted",
				children: [
					"מתנגן אוטומטית בעוד ",
					count,
					" שניות"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onPlay,
					className: "btn-primary flex-1 text-small",
					children: "נגן עכשיו"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onCancel,
					className: "btn-ghost text-small",
					children: "ביטול"
				})]
			})
		]
	});
}
//#endregion
export { LearnPage as component };
