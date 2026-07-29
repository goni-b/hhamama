import { o as __toESM } from "../_runtime.mjs";
import { n as useForm, r as require_react, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { o as tierName, r as data, s as tierProgress } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as RefreshCw, Tt as Bell, i as UserRound, it as CreditCard, y as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-BJ3sdkEm.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-CBAw8j_1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function fmtDate(iso) {
	return new Intl.DateTimeFormat("he-IL", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(iso));
}
function ErrorCard({ onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "משהו השתבש",
			description: copy["error.generic"],
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
				className: "h-10 w-10 text-muted",
				"aria-hidden": "true"
			}),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onRetry,
				className: "btn-secondary text-small",
				children: "נסה שוב"
			})
		})
	});
}
function AccountPage() {
	const { profile, isLoading } = useSession();
	if (isLoading || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-6 h-12 w-56 rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mb-4 h-11 rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-96 rounded-xl" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ghost-number",
					"aria-hidden": "true",
					children: "09"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "החשבון שלי"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: "הפינה השקטה שלך"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "profile",
				dir: "rtl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-6 h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-line bg-bg-2 p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "profile",
								className: "gap-2 px-4 py-2 text-small data-[state=active]:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), "פרטים אישיים"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "subscription",
								className: "gap-2 px-4 py-2 text-small data-[state=active]:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), "מנוי"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "notifications",
								className: "gap-2 px-4 py-2 text-small data-[state=active]:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), "העדפות התראות"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "preferences",
								className: "gap-2 px-4 py-2 text-small data-[state=active]:text-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), "העדפות"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "profile",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileTab, { profile })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "subscription",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionTab, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "notifications",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsTab, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "preferences",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesTab, {})
					})
				]
			})
		})]
	});
}
var profileSchema = objectType({
	fullName: stringType().min(2, "שם קצר מדי").max(60, "עד 60 תווים"),
	username: stringType().min(3, "לפחות 3 תווים").max(24, "עד 24 תווים").regex(/^[a-z0-9-]+$/, "אותיות לטיניות קטנות, ספרות ומקפים בלבד"),
	bio: stringType().max(280, "עד 280 תווים")
});
function ProfileTab({ profile }) {
	const qc = useQueryClient();
	const { progress } = tierProgress(profile.xpTotal);
	const form = useForm({
		resolver: u(profileSchema),
		defaultValues: {
			fullName: profile.fullName,
			username: profile.username,
			bio: profile.bio ?? ""
		}
	});
	const save = useMutation({
		mutationFn: (v) => data.profiles.updateMe({
			fullName: v.fullName,
			username: v.username,
			bio: v.bio
		}),
		onSuccess: async (updated) => {
			form.reset({
				fullName: updated.fullName,
				username: updated.username,
				bio: updated.bio ?? ""
			});
			await qc.invalidateQueries({ queryKey: ["session"] });
			toast.success(copy["success.profileSaved"]);
		},
		onError: () => toast.error(copy["error.generic"])
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
				size: "md",
				tier: profile.growthStage,
				progress,
				src: profile.avatarUrl,
				name: profile.fullName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-h3 text-ink",
				children: profile.fullName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-small text-muted",
				children: [
					"דרגת ",
					tierName(profile.growthStage),
					" ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[12px] tabular",
						children: profile.email
					})
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: form.handleSubmit((v) => save.mutate(v)),
			className: "space-y-4",
			noValidate: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "fullName",
						className: "mb-1.5 block text-small text-ink-2",
						children: "שם מלא"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fullName",
						autoComplete: "name",
						...form.register("fullName")
					}),
					form.formState.errors.fullName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-small text-danger",
						children: form.formState.errors.fullName.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "username",
						className: "mb-1.5 block text-small text-ink-2",
						children: "שם משתמש"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "username",
						className: "ltr-field font-mono",
						autoComplete: "off",
						...form.register("username")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1.5 text-small text-muted",
						children: ["הכתובת של הפרופיל הציבורי שלך: /profile/", form.watch("username")]
					}),
					form.formState.errors.username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-small text-danger",
						children: form.formState.errors.username.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "bio",
						className: "mb-1.5 block text-small text-ink-2",
						children: "כמה מילים עליך"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "bio",
						placeholder: "מה העסק שלך, ולאן הוא צומח?",
						className: "min-h-[90px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]",
						...form.register("bio")
					}),
					form.formState.errors.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-small text-danger",
						children: form.formState.errors.bio.message
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: save.isPending || !form.formState.isDirty,
						className: "btn-primary text-small disabled:opacity-50",
						children: save.isPending ? "רגע..." : "שמירת השינויים"
					})
				})
			]
		})]
	});
}
var STATUS_META = {
	active: {
		label: "פעיל",
		color: "var(--success)"
	},
	paused: {
		label: "מושהה",
		color: "var(--warning)"
	},
	canceled: {
		label: "בוטל",
		color: "var(--danger)"
	}
};
function StatusBadge({ status }) {
	const meta = STATUS_META[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full border px-2.5 py-0.5 text-[12px] font-medium",
		style: {
			color: meta.color,
			borderColor: `color-mix(in srgb, ${meta.color} 35%, transparent)`,
			background: `color-mix(in srgb, ${meta.color} 10%, transparent)`
		},
		children: meta.label
	});
}
function InfoRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 border-b border-line-soft py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-small text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[13px] tabular text-ink-2",
			children: value
		})]
	});
}
function SubscriptionTab() {
	const { data: sub, isLoading, isError, refetch } = useQuery({
		queryKey: ["subscription"],
		queryFn: () => data.account.getSubscription()
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-72 rounded-xl" });
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCard, { onRetry: () => refetch() });
	if (!sub) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "לא נמצא מנוי",
			description: "אם זו טעות — דברו איתנו ונסדר את זה."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "התוכנית שלך"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: sub.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-h2 text-ink",
				children: sub.planName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					sub.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
						label: "החיוב הבא",
						value: fmtDate(sub.currentPeriodEnd)
					}),
					sub.status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
						label: "המנוי מושהה עד",
						value: sub.pausedUntil ? fmtDate(sub.pausedUntil) : "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
						label: "חידוש",
						value: "אוטומטי, בלי לעשות כלום"
					})] }),
					sub.status === "canceled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
						label: "הגישה פתוחה עד",
						value: fmtDate(sub.currentPeriodEnd)
					}),
					sub.discountUsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
						label: "הטבת הנחה חד-פעמית",
						value: "נוצלה"
					})
				]
			}),
			sub.status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-small text-muted",
				children: "המנוי בהפסקה — בלי חיוב, והכול נשמר. הוא יתחדש אוטומטית בתאריך שלמעלה."
			}),
			sub.status === "canceled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-small text-muted",
				children: "המנוי בוטל, אבל הדלת פתוחה — הגישה נשארת עד סוף התקופה ששולמה."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: true,
					title: "בקרוב",
					className: "btn-secondary text-small opacity-60",
					children: "עדכון אמצעי תשלום (בקרוב)"
				})
			}),
			sub.status !== "canceled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 border-t border-line-soft pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account/cancel",
					className: "text-small text-muted underline underline-offset-4 transition-colors hover:text-ink",
					children: "ביטול מנוי"
				})
			})
		]
	});
}
function ToggleRow({ title, description, checked, disabled, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 border-b border-line-soft py-4 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-body text-ink",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-small text-muted",
			children: description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			dir: "ltr",
			checked,
			disabled,
			onCheckedChange: onChange
		})]
	});
}
function usePreferences() {
	const qc = useQueryClient();
	return {
		query: useQuery({
			queryKey: ["account-preferences"],
			queryFn: () => data.account.getPreferences()
		}),
		update: useMutation({
			mutationFn: (input) => data.account.updatePreferences(input),
			onMutate: async (input) => {
				await qc.cancelQueries({ queryKey: ["account-preferences"] });
				const prev = qc.getQueryData(["account-preferences"]);
				if (prev) qc.setQueryData(["account-preferences"], {
					...prev,
					...input
				});
				return { prev };
			},
			onError: (_err, _input, ctx) => {
				if (ctx?.prev) qc.setQueryData(["account-preferences"], ctx.prev);
				toast.error(copy["error.generic"]);
			},
			onSuccess: () => {
				toast.success("נשמר. ההעדפות עודכנו.");
			},
			onSettled: () => {
				qc.invalidateQueries({ queryKey: ["account-preferences"] });
				qc.invalidateQueries({ queryKey: ["session"] });
			}
		})
	};
}
function NotificationsTab() {
	const { query, update } = usePreferences();
	const prefs = query.data;
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: [
			0,
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-16 rounded-lg" }, i))
	});
	if (query.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCard, { onRetry: () => query.refetch() });
	if (!prefs) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "ההעדפות לא נטענו",
			description: "נסה לרענן את העמוד."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card px-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "לייב מתקרב",
				description: "תזכורת לפני כל מפגש חי שנרשמת אליו.",
				checked: prefs.notifyLives,
				onChange: (v) => update.mutate({ notifyLives: v })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "תגובות",
				description: "כשמישהו מגיב לפוסט או לשאלה שלך בקהילה.",
				checked: prefs.notifyComments,
				onChange: (v) => update.mutate({ notifyComments: v })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "ריאקציות",
				description: "כשחברים מסמנים לך מצמיח, מדויק או שווה זהב.",
				checked: prefs.notifyReactions,
				onChange: (v) => update.mutate({ notifyReactions: v })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "רצף בסכנה",
				description: "תזכורת עדינה בערב, אם עוד לא הושקה היום.",
				checked: prefs.notifyStreak,
				onChange: (v) => update.mutate({ notifyStreak: v })
			})
		]
	});
}
function PreferencesTab() {
	const { query, update } = usePreferences();
	const prefs = query.data;
	if (query.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-16 rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-16 rounded-lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-32 rounded-lg" })
		]
	});
	if (query.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCard, { onRetry: () => query.refetch() });
	if (!prefs) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "ההעדפות לא נטענו",
			description: "נסה לרענן את העמוד."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card px-6 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "מצב מיקוד",
				description: "משקיט טוסטים של נקודות ומצניע את טבלת המובילים. הרצף וההתקדמות בקורס נשארים.",
				checked: prefs.focusMode,
				onChange: (v) => update.mutate({ focusMode: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
				title: "הרצף שלי נח בשישי-שבת",
				description: "סוף השבוע לא שובר את רצף ההשקיה.",
				checked: prefs.streakRestFriSat,
				onChange: (v) => update.mutate({ streakRestFriSat: v })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-body text-ink",
					children: "איך לפנות אלייך?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-small text-muted",
					children: "ברכות ומשפטים אישיים ינוסחו בהתאם. אפשר לשנות בכל רגע."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
					dir: "rtl",
					className: "mt-4 gap-2.5",
					value: prefs.preferredGender ?? "",
					onValueChange: (v) => update.mutate({ preferredGender: v }),
					children: [{
						id: "f",
						label: "לשון נקבה"
					}, {
						id: "m",
						label: "לשון זכר"
					}].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-colors",
						style: {
							borderColor: prefs.preferredGender === opt.id ? "var(--accent)" : "var(--line)",
							background: prefs.preferredGender === opt.id ? "var(--accent-faint)" : "transparent"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: opt.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-body text-ink-2",
							children: opt.label
						})]
					}, opt.id))
				})
			]
		})]
	});
}
//#endregion
export { AccountPage as component };
