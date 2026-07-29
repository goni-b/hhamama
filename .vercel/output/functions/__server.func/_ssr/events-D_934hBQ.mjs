import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, n as EASE, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Play, F as Mic, O as Radio, _t as Check, mt as CircleAlert, st as Clock, xt as CalendarDays } from "../_libs/lucide-react.mjs";
import { i as format, t as he } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-D_934hBQ.js
var import_jsx_runtime = require_jsx_runtime();
var EVENTS_KEY = ["events"];
function fmtDay(iso) {
	return format(new Date(iso), "EEEE, d בMMMM", { locale: he });
}
function fmtTime(iso) {
	return format(new Date(iso), "HH:mm", { locale: he });
}
function LiveBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium",
		style: {
			borderColor: "color-mix(in srgb, var(--danger) 45%, transparent)",
			background: "color-mix(in srgb, var(--danger) 10%, transparent)",
			color: "var(--danger)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "animate-pulse-dot h-2 w-2 rounded-full",
			style: { background: "var(--danger)" },
			"aria-hidden": "true"
		}), "שידור חי"]
	});
}
function RsvpButton({ event, onRsvp, pending, compact = false }) {
	if (event.isRegistered) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-small font-medium",
		style: {
			borderColor: "var(--accent-border)",
			background: "var(--accent-faint)",
			color: "var(--accent)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "רשומה"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => onRsvp(event.id),
		disabled: pending,
		className: compact ? "btn-secondary inline-flex items-center gap-2 text-small disabled:opacity-50" : "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), "שריין מקום"]
	});
}
function DateSquare({ iso }) {
	const d = new Date(iso);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border",
		style: {
			borderColor: "var(--line)",
			background: "var(--panel-2)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[18px] leading-none tabular text-ink",
			children: format(d, "d", { locale: he })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 text-micro text-muted",
			children: format(d, "MMM", { locale: he })
		})]
	});
}
function EventsPage() {
	const qc = useQueryClient();
	const gated = useGatedVariants(revealUp);
	const { data: events, isLoading, isError, refetch } = useQuery({
		queryKey: EVENTS_KEY,
		queryFn: () => data.events.list()
	});
	const rsvp = useMutation({
		mutationFn: (eventId) => data.events.rsvp(eventId),
		onMutate: async (eventId) => {
			await qc.cancelQueries({ queryKey: EVENTS_KEY });
			const prev = qc.getQueryData(EVENTS_KEY);
			qc.setQueryData(EVENTS_KEY, (old) => old?.map((e) => e.id === eventId ? {
				...e,
				isRegistered: true
			} : e));
			return { prev };
		},
		onError: (_err, _id, ctx) => {
			if (ctx?.prev) qc.setQueryData(EVENTS_KEY, ctx.prev);
			toast.error(copy["error.generic"]);
		},
		onSuccess: () => {
			toast.success("שריינו לך מקום. נזכיר לך לפני שעולים לשידור.");
		},
		onSettled: () => qc.invalidateQueries({ queryKey: EVENTS_KEY })
	});
	const list = events ?? [];
	const byStart = (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
	const liveNow = list.filter((e) => e.status === "live").sort(byStart);
	const upcoming = list.filter((e) => e.status === "upcoming").sort(byStart);
	const past = list.filter((e) => e.status === "ended").sort((a, b) => byStart(b, a));
	const hero = liveNow[0] ?? upcoming[0] ?? null;
	const nextUp = [...liveNow, ...upcoming].filter((e) => e.id !== hero?.id);
	let content;
	if (isLoading) content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-8 h-64 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: [
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-20 rounded-lg" }, i))
	})] });
	else if (isError) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-20 w-20 items-center justify-center rounded-full",
				style: { background: "var(--panel-2)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-muted" })
			}),
			title: copy["error.generic"],
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => refetch(),
				className: "btn-secondary text-small",
				children: "נסה שוב"
			})
		})
	});
	else if (list.length === 0) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-20 w-20 items-center justify-center rounded-full",
				style: { background: "var(--accent-faint)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 text-accent" })
			}),
			title: "הלייב הבא יעלה בקרוב",
			description: "\"שלישי בחממה\" — כל יום שלישי ב-20:00. שווה לחזור לכאן."
		})
	});
	else content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
			className: "surface-card relative mb-10 overflow-hidden",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: hero.status === "live" ? "עכשיו בחממה" : "הלייב הקרוב"
						}), hero.status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 max-w-2xl text-h1 text-ink",
						children: hero.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-body-lg text-ink-2",
						children: hero.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap items-center gap-5 font-mono text-[12px] tabular text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), fmtDay(hero.startsAt)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
									fmtTime(hero.startsAt),
									" · ",
									hero.durationMin,
									" דקות"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }), hero.hostName]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RsvpButton, {
							event: hero,
							onRsvp: (id) => rsvp.mutate(id),
							pending: rsvp.isPending
						}), hero.isRegistered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-small text-muted",
							children: "נשלח לך תזכורת לפני שעולים לשידור."
						})]
					})
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card mb-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-20 w-20 items-center justify-center rounded-full",
					style: { background: "var(--accent-faint)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 text-accent" })
				}),
				title: "הלייב הבא יעלה בקרוב",
				description: "בינתיים אפשר להשלים את ההקלטות מהלייבים הקודמים."
			})
		}),
		nextUp.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-h2 text-ink",
				children: "הבאים בתור"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
				className: "space-y-3",
				variants: staggerContainer(.06),
				initial: "hidden",
				animate: "visible",
				children: nextUp.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
					variants: gated,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card flex flex-wrap items-center gap-4 p-4 md:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateSquare, { iso: e.startsAt }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-body font-medium text-ink",
										children: e.title
									}), e.status === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap items-center gap-4 font-mono text-[11px] tabular text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
											fmtTime(e.startsAt),
											" · ",
											e.durationMin,
											" דקות"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5" }), e.hostName]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RsvpButton, {
								event: e,
								onRsvp: (id) => rsvp.mutate(id),
								pending: rsvp.isPending,
								compact: true
							})
						]
					})
				}, e.id))
			})]
		}),
		past.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 text-h2 text-ink",
			children: "הקלטות מלייבים קודמים"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
			className: "space-y-3",
			variants: staggerContainer(.06),
			initial: "hidden",
			animate: "visible",
			children: past.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
				variants: gated,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex flex-wrap items-center gap-4 p-4 md:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateSquare, { iso: e.startsAt }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-body font-medium text-ink",
								children: e.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-4 font-mono text-[11px] tabular text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
										e.durationMin,
										" דקות"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5" }), e.hostName]
								})]
							})]
						}),
						e.recordingLessonId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses",
							className: "btn-secondary inline-flex items-center gap-2 text-small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), "לצפייה בהקלטה"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-small text-muted",
							children: "ההקלטה תעלה בקרוב"
						})
					]
				})
			}, e.id))
		})] })
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ghost-number",
					"aria-hidden": "true",
					children: "10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: copy["nav.lives"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: "שלישי בחממה — לייבים ושידורים"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-small text-muted",
					children: "כל יום שלישי ב-20:00: סשן אסטרטגיה עם גוני, סדנת AI עם חופית או אורח מפתיע. שריון מקום יוצר תזכורות אוטומטיות."
				})
			]
		}), content]
	});
}
//#endregion
export { EventsPage as component };
