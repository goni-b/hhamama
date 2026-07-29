import { o as __toESM } from "./_runtime.mjs";
import { n as useForm, r as require_react, t as u } from "./_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "./_libs/motion.mjs";
import { n as EASE } from "./_ssr/motion-D3meAu4o.mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { r as t, t as copy } from "./_ssr/copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { Ot as ArrowRight, V as Link2, _t as Check, c as TriangleAlert, et as FileText, mt as CircleAlert, n as X, o as Upload, st as Clock, wt as BookOpen, x as Send } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-Dw_kDE_a.mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { n as objectType, r as stringType, t as literalType } from "./_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-Cqcrm1Ng.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILES = 5;
var MAX_FILE_MB = 20;
var schema = objectType({
	content: stringType().min(10, "ספר קצת יותר על מה שהכנת — לפחות 10 תווים"),
	link: stringType().url("קישור לא תקין — כתובת מלאה כולל https://").optional().or(literalType(""))
});
function fmtDate(iso) {
	return new Intl.DateTimeFormat("he-IL", {
		day: "numeric",
		month: "long"
	}).format(new Date(iso));
}
function fmtSize(bytes) {
	if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
var STATUS_META = {
	pending: {
		label: "ממתין לבדיקה",
		color: "var(--success)",
		Icon: Clock
	},
	needs_fix: {
		label: "דורש תיקון",
		color: "var(--warning)",
		Icon: TriangleAlert
	},
	approved: {
		label: "אושר",
		color: "var(--accent)",
		Icon: Check
	}
};
function StatusBadge({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]",
		style: {
			borderColor: "var(--line)",
			color: "var(--muted)"
		},
		children: "טרם הוגש"
	});
	const { label, color, Icon } = STATUS_META[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium",
		style: {
			borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
			background: `color-mix(in srgb, ${color} 10%, transparent)`,
			color
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
	});
}
function AssignmentPage() {
	const { id } = useParams({ from: "/_app/assignments/$id" });
	const { data: assignment, isLoading, isError, refetch } = useQuery({
		queryKey: ["assignment", id],
		queryFn: () => data.assignments.get(id)
	});
	const { data: courses } = useQuery({
		queryKey: ["courses"],
		queryFn: () => data.courses.list()
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-6 h-44 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-80 rounded-xl" })]
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
					className: "h-14 w-14",
					style: { color: "var(--danger)" }
				}),
				title: "לא הצלחנו לטעון את המשימה",
				description: copy["error.generic"],
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => refetch(),
					className: "btn-secondary text-small",
					children: "נסה שוב"
				})
			})
		})
	});
	if (!assignment) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "המשימה לא נמצאה",
				description: "ייתכן שהקישור השתנה או שהמשימה הוסרה.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/assignments",
					className: "btn-primary text-small",
					children: "חזרה למשימות"
				})
			})
		})
	});
	const course = (courses ?? []).find((c) => c.id === assignment.courseId) ?? null;
	const sub = assignment.mySubmission;
	const status = sub?.status ?? null;
	const awaiting = !status || status === "needs_fix";
	const overdue = awaiting && !!assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/assignments",
				className: "mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), "חזרה למשימות"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				className: "surface-card relative mb-6 overflow-hidden",
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
					ease: EASE
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0",
					style: { background: "radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative p-6 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "משימה"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "max-w-2xl text-h1 text-ink",
								children: assignment.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted",
							children: [course && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/courses/$slug",
								params: { slug: course.slug },
								className: "inline-flex items-center gap-1.5 transition-colors hover:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }), course.title]
							}), assignment.dueAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								style: overdue ? { color: "var(--danger)" } : void 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), overdue ? `עבר מועד ההגשה — ${fmtDate(assignment.dueAt)}` : `להגשה עד ${fmtDate(assignment.dueAt)}`]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl whitespace-pre-line text-body text-ink-2",
							children: assignment.description
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					sub && sub.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg border p-4",
						style: {
							borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
							background: "color-mix(in srgb, var(--success) 8%, transparent)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "h-5 w-5 shrink-0",
							style: { color: "var(--success)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-body font-medium",
							style: { color: "var(--success)" },
							children: "הוגש — ממתין לבדיקת מנטור"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-small text-muted",
							children: "נעדכן אותך ברגע שהמשוב מוכן. בינתיים אפשר להמשיך לצמוח."
						})] })]
					}),
					sub && sub.status === "needs_fix" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-4",
						style: {
							borderColor: "color-mix(in srgb, var(--warning) 40%, transparent)",
							background: "color-mix(in srgb, var(--warning) 8%, transparent)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								className: "h-5 w-5 shrink-0",
								style: { color: "var(--warning)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-body font-medium",
								style: { color: "var(--warning)" },
								children: "דורש תיקון קטן — המנטור השאיר לך משוב"
							})]
						}), sub.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 border-t pt-3",
							style: { borderColor: "color-mix(in srgb, var(--warning) 25%, transparent)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "משוב מהמנטור"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 whitespace-pre-line text-body text-ink-2",
								children: sub.feedback
							})]
						})]
					}),
					sub && sub.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-4",
						style: {
							borderColor: "var(--accent-border)",
							background: "var(--accent-faint)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
								style: { background: "var(--grad-gold)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[#1a1206]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-body font-medium text-accent",
								children: "המשימה אושרה"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-small text-muted",
								children: [t("points.earned", { count: 40 }), " — בונוס האישור נוסף לחשבון שלך."]
							})] })]
						}), sub.feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 border-t pt-3",
							style: { borderColor: "var(--accent-border)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "משוב מהמנטור"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 whitespace-pre-line text-body text-ink-2",
								children: sub.feedback
							})]
						})]
					}),
					sub && sub.status !== "needs_fix" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionView, { submission: sub }),
					awaiting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionForm, {
						assignmentId: assignment.id,
						existing: sub
					}, sub?.id ?? "new")
				]
			})
		]
	});
}
function SubmissionView({ submission }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card relative p-6",
		children: [
			submission.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				"aria-hidden": "true",
				initial: {
					opacity: 0,
					scale: 1.8,
					rotate: -18
				},
				animate: {
					opacity: 1,
					scale: 1,
					rotate: -10
				},
				transition: {
					duration: .55,
					ease: EASE,
					delay: .25
				},
				className: "pointer-events-none absolute -top-3 left-5 rounded-md border-2 px-3 py-0.5 font-mono text-[13px] font-bold tracking-[0.2em]",
				style: {
					borderColor: "var(--accent)",
					color: "var(--accent)",
					background: "color-mix(in srgb, var(--accent) 10%, var(--bg-2))"
				},
				children: "אושר"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-h3 text-ink",
					children: "ההגשה שלך"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[11px] tabular text-muted",
					children: ["הוגש ב-", fmtDate(submission.submittedAt)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 whitespace-pre-line text-body text-ink-2",
				children: submission.content
			}),
			submission.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: submission.link,
				target: "_blank",
				rel: "noreferrer",
				dir: "ltr",
				className: "mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-small text-accent transition-opacity hover:opacity-80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 shrink-0" }), submission.link]
			}),
			submission.fileNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: submission.fileNames.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2.5 rounded-lg border border-line bg-bg-2 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-small text-ink-2",
						children: name
					})]
				}, name))
			})
		]
	});
}
function SubmissionForm({ assignmentId, existing }) {
	const qc = useQueryClient();
	const [files, setFiles] = (0, import_react.useState)([]);
	const [fileError, setFileError] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			content: existing?.content ?? "",
			link: existing?.link ?? ""
		}
	});
	const submit = useMutation({
		mutationFn: (v) => data.assignments.submit(assignmentId, {
			content: v.content,
			link: v.link ? v.link : void 0,
			files: files.length > 0 ? files : void 0
		}),
		onSuccess: () => {
			toast.success(`המשימה הוגשה לבדיקת המנטור. ${t("points.earned", { count: 60 })}`);
			qc.invalidateQueries({ queryKey: ["assignments"] });
			qc.invalidateQueries({ queryKey: ["assignment", assignmentId] });
			qc.invalidateQueries({ queryKey: ["session"] });
		},
		onError: () => toast.error(copy["error.generic"])
	});
	function addFiles(e) {
		const chosen = Array.from(e.target.files ?? []);
		e.target.value = "";
		if (chosen.length === 0) return;
		const tooBig = chosen.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
		if (tooBig) {
			setFileError(`"${tooBig.name}" גדול מדי — עד ${MAX_FILE_MB}MB לקובץ.`);
			return;
		}
		const next = [...files, ...chosen];
		if (next.length > MAX_FILES) {
			setFileError(`אפשר לצרף עד ${MAX_FILES} קבצים.`);
			return;
		}
		setFileError(null);
		setFiles(next);
	}
	function removeFile(index) {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setFileError(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-h3 text-ink",
				children: existing ? "הגשה מחודשת" : "ההגשה שלך"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-small text-muted",
				children: existing ? "עדכן לפי המשוב והגש שוב — זה בדיוק איך שצומחים." : "ספר מה הכנת, צרף קישור או קבצים — והמנטור יעבור על הכל."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: form.handleSubmit((v) => submit.mutate(v)),
				className: "mt-5 space-y-4",
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "content",
							className: "mb-1.5 block text-small text-ink-2",
							children: "מה הכנת?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "content",
							rows: 6,
							placeholder: "ספר על העבודה שלך — מה בנית, איך ניגשת, ומה למדת בדרך...",
							className: "min-h-[140px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]",
							...form.register("content")
						}),
						form.formState.errors.content && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-small text-danger",
							children: form.formState.errors.content.message
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "link",
							className: "mb-1.5 flex items-center gap-1.5 text-small text-ink-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5 text-muted" }), "קישור (לא חובה) — לדף נחיתה, מסמך או קמפיין שבנית"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "link",
							type: "url",
							dir: "ltr",
							placeholder: "https://",
							...form.register("link")
						}),
						form.formState.errors.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-small text-danger",
							children: form.formState.errors.link.message
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1.5 block text-small text-ink-2",
							children: [
								"קבצים (לא חובה) — עד ",
								MAX_FILES,
								" קבצים, ",
								MAX_FILE_MB,
								"MB לקובץ"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "btn-secondary inline-flex cursor-pointer items-center gap-2 text-small",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
								"צירוף קבצים",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									multiple: true,
									className: "sr-only",
									onChange: addFiles,
									disabled: files.length >= MAX_FILES
								})
							]
						}),
						existing && existing.fileNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-[12px] text-muted",
							children: [
								"בהגשה הקודמת צורפו: ",
								existing.fileNames.join(", "),
								" — צירוף קבצים חדשים מחליף אותם."
							]
						}),
						files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2.5 rounded-lg border border-line bg-bg-2 px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-small text-ink-2",
										children: f.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] tabular text-muted",
										children: fmtSize(f.size)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `הסרת ${f.name}`,
										onClick: () => removeFile(i),
										className: "text-muted transition-colors hover:text-danger",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})
								]
							}, `${f.name}-${i}`))
						}),
						fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-small text-danger",
							children: fileError
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: submit.isPending,
						className: "btn-primary inline-flex items-center gap-2 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), submit.isPending ? "שולח..." : existing ? "הגשה מחודשת" : "הגשת המשימה"]
					})
				]
			})
		]
	});
}
//#endregion
export { AssignmentPage as component };
