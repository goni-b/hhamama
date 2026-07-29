import { o as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { r as data } from "./_ssr/data-BDcPQam0.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { _ as Link, y as useParams } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as Play, C as Save, N as Paperclip, Ot as ArrowRight, Q as FolderPlus, V as Link2, et as FileText, f as Trash2, k as Plus, o as Upload } from "./_libs/lucide-react.mjs";
import { n as parseVideoUrl, t as getVideoAdapter } from "./_ssr/provider-ndGpaDO1.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-Dw_kDE_a.mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-7tilmvYn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CourseBuilder() {
	const { id } = useParams({ from: "/admin/courses/$id" });
	const qc = useQueryClient();
	const { data: course, isLoading } = useQuery({
		queryKey: [
			"admin",
			"course",
			id
		],
		queryFn: () => data.admin.getCourse(id)
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: [
			"admin",
			"course",
			id
		] });
		qc.invalidateQueries({ queryKey: ["admin", "courses"] });
		qc.invalidateQueries({ queryKey: ["courses"] });
	};
	const publish = useMutation({
		mutationFn: (val) => data.admin.upsertCourse({
			id: course.id,
			slug: course.slug,
			title: course.title,
			description: course.description,
			level: course.level,
			category: course.category,
			isPublished: val
		}),
		onSuccess: () => {
			toast.success("סטטוס הקורס עודכן");
			invalidate();
		}
	});
	const addModule = useMutation({
		mutationFn: (title) => data.admin.addModule(course.id, title),
		onSuccess: () => {
			toast.success("מודול נוסף");
			invalidate();
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-96 rounded-xl" })
	});
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "הקורס לא נמצא",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/courses",
					className: "btn-primary text-small",
					children: "חזרה"
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/courses",
				className: "mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), "כל הקורסים"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: course.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: course.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-small text-muted",
						children: course.isPublished ? "פורסם" : "טיוטה"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => publish.mutate(!course.isPublished),
						className: course.isPublished ? "btn-secondary text-small" : "btn-primary text-small",
						children: course.isPublished ? "העבר לטיוטה" : "פרסם קורס"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-[38%_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [course.modules.map((m, mi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-line px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px]",
								style: {
									background: "var(--accent-faint)",
									color: "var(--accent)"
								},
								children: String(mi + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-body font-medium text-ink",
								children: m.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "p-2",
							children: [m.lessons.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEditing({
									moduleId: m.id,
									lesson: l
								}),
								className: "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-small transition-colors hover:bg-[color:var(--panel-2)]",
								style: editing?.lesson?.id === l.id ? {
									background: "var(--accent-faint)",
									color: "var(--accent)"
								} : { color: "var(--ink-2)" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate",
									children: l.title
								})]
							}) }, l.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEditing({
									moduleId: m.id,
									lesson: null
								}),
								className: "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-start text-small text-muted transition-colors hover:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "הוסף שיעור"]
							}) })]
						})]
					}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddModuleButton, { onAdd: (t) => addModule.mutate(t) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonEditor, {
					moduleId: editing.moduleId,
					lesson: editing.lesson,
					onSaved: () => {
						invalidate();
					}
				}, editing.lesson?.id ?? "new") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "בחר שיעור לעריכה",
						description: "או הוסף שיעור חדש למודול כדי להעלות תוכן."
					})
				}) })]
			})
		]
	});
}
function AddModuleButton({ onAdd }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setOpen(true),
		className: "btn-secondary flex w-full items-center justify-center gap-2 text-small",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4" }), "מודול חדש"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card flex items-center gap-2 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			autoFocus: true,
			value: title,
			onChange: (e) => setTitle(e.target.value),
			placeholder: "שם המודול"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => {
				if (title.trim()) {
					onAdd(title);
					setTitle("");
					setOpen(false);
				}
			},
			className: "btn-primary text-small",
			children: "הוסף"
		})]
	});
}
/** שחזור קישור קנוני מתוך provider+id — לתצוגה בשדה הקישור בעריכה */
function canonicalVideoUrl(l) {
	if (!l?.videoId) return "";
	if (l.videoProvider === "vimeo") return `https://vimeo.com/${l.videoId}`;
	return `https://youtu.be/${l.videoId}`;
}
var PROVIDER_LABEL = {
	youtube: "YouTube",
	vimeo: "Vimeo"
};
function kindForFile(name) {
	return name.toLowerCase().endsWith(".pdf") ? "pdf" : "file";
}
function LessonEditor({ moduleId, lesson, onSaved }) {
	const [title, setTitle] = (0, import_react.useState)(lesson?.title ?? "");
	const [videoInput, setVideoInput] = (0, import_react.useState)(() => canonicalVideoUrl(lesson));
	const [description, setDescription] = (0, import_react.useState)(lesson?.description ?? "");
	const [minutes, setMinutes] = (0, import_react.useState)(lesson ? Math.round(lesson.durationSec / 60) : 8);
	const [resources, setResources] = (0, import_react.useState)(() => lesson?.resources.map(({ title: t, kind, url }) => ({
		title: t,
		kind,
		url
	})) ?? []);
	(0, import_react.useEffect)(() => {
		setTitle(lesson?.title ?? "");
		setVideoInput(canonicalVideoUrl(lesson));
		setDescription(lesson?.description ?? "");
		setMinutes(lesson ? Math.round(lesson.durationSec / 60) : 8);
		setResources(lesson?.resources.map(({ title: t, kind, url }) => ({
			title: t,
			kind,
			url
		})) ?? []);
	}, [lesson]);
	const parsed = parseVideoUrl(videoInput);
	const save = useMutation({
		mutationFn: () => data.admin.upsertLesson({
			id: lesson?.id,
			moduleId,
			title,
			description: description.trim(),
			durationSec: minutes * 60,
			videoProvider: parsed.provider,
			videoId: parsed.videoId,
			orderIndex: lesson?.orderIndex ?? 999,
			resources
		}),
		onSuccess: () => {
			toast.success(lesson ? "השיעור עודכן" : "השיעור נוסף");
			onSaved();
		},
		onError: () => toast.error("השמירה נכשלה — נסה שוב")
	});
	const previewUrl = parsed ? getVideoAdapter(parsed.provider).getEmbedUrl(parsed.videoId) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 text-h3 text-ink",
			children: lesson ? "עריכת שיעור" : "שיעור חדש"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-small text-ink-2",
					children: "שם השיעור"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "לדוגמה: בניית פרסונת קהל יעד"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_110px] gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1.5 flex items-center justify-between text-small text-ink-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "קישור וידאו (YouTube / Vimeo)" }), videoInput.trim() && (parsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full px-2 py-0.5 font-mono text-[10px]",
							style: {
								background: "var(--accent-faint)",
								color: "var(--accent)"
							},
							children: PROVIDER_LABEL[parsed.provider]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px]",
							style: { color: "var(--danger)" },
							children: "קישור לא מזוהה"
						}))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: videoInput,
						onChange: (e) => setVideoInput(e.target.value),
						placeholder: "https://vimeo.com/76979871 או https://youtu.be/aqz-KE-bpKQ"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-small text-ink-2",
						children: "אורך (דקות)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: minutes,
						onChange: (e) => setMinutes(Number(e.target.value) || 0)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-small text-ink-2",
					children: "טקסט מתחת לווידאו (תיאור השיעור)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "מה לומדים בשיעור, דגשים, קישורים שהוזכרו...",
					className: "min-h-[110px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcesEditor, {
					resources,
					onChange: setResources
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "תצוגה מקדימה"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 aspect-video overflow-hidden rounded-lg border border-line bg-bg",
					children: previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: previewUrl,
						title: "preview",
						className: "h-full w-full",
						allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
						allowFullScreen: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center text-small text-muted",
						children: "הדבק קישור וידאו כדי לראות תצוגה מקדימה"
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => title.trim() && parsed && save.mutate(),
					disabled: !title.trim() || !parsed || save.isPending,
					className: "btn-primary inline-flex items-center gap-2 disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), save.isPending ? "שומרים..." : lesson ? "שמירת שינויים" : "הוספת השיעור"]
				})
			]
		})]
	});
}
function ResourcesEditor({ resources, onChange }) {
	const fileRef = (0, import_react.useRef)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [linkOpen, setLinkOpen] = (0, import_react.useState)(false);
	const [linkTitle, setLinkTitle] = (0, import_react.useState)("");
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("");
	async function onFilePicked(file) {
		if (!file) return;
		setUploading(true);
		try {
			const { url } = await data.admin.uploadMaterial(file);
			onChange([...resources, {
				title: file.name,
				kind: kindForFile(file.name),
				url
			}]);
			toast.success("הקובץ הועלה — אל תשכח לשמור את השיעור");
		} catch {
			toast.error("ההעלאה נכשלה — נסה שוב");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	function addLink() {
		const url = linkUrl.trim();
		if (!url) return;
		onChange([...resources, {
			title: linkTitle.trim() || url,
			kind: "link",
			url: url.startsWith("http") ? url : `https://${url}`
		}]);
		setLinkTitle("");
		setLinkUrl("");
		setLinkOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1.5 block text-small text-ink-2",
		children: "חומרים מצורפים (מתחת לווידאו)"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-bg-2 p-3",
		children: [
			resources.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 pb-2 text-small text-muted",
				children: "אין חומרים — הוסף קובץ או קישור."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: resources.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2.5 rounded-md bg-[color:var(--panel)] px-3 py-2",
					children: [
						r.kind === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 shrink-0 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-small text-ink-2",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase text-muted-2",
							children: r.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onChange(resources.filter((_, j) => j !== i)),
							className: "text-muted transition-colors hover:text-[color:var(--danger)]",
							"aria-label": `הסרת ${r.title}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				}, `${r.url}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						className: "hidden",
						onChange: (e) => onFilePicked(e.target.files?.[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => fileRef.current?.click(),
						disabled: uploading,
						className: "btn-secondary inline-flex items-center gap-1.5 text-small disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), uploading ? "מעלים..." : "העלאת קובץ"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setLinkOpen((v) => !v),
						className: "btn-secondary inline-flex items-center gap-1.5 text-small",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3.5 w-3.5" }), "הוספת קישור"]
					})
				]
			}),
			linkOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 grid grid-cols-[1fr_1fr_auto] gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: linkTitle,
						onChange: (e) => setLinkTitle(e.target.value),
						placeholder: "כותרת (לדוגמה: תבנית לעבודה)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: linkUrl,
						onChange: (e) => setLinkUrl(e.target.value),
						placeholder: "https://..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: addLink,
						className: "btn-primary text-small",
						children: "הוסף"
					})
				]
			})
		]
	})] });
}
//#endregion
export { CourseBuilder as component };
