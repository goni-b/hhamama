import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as tierName, r as data } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as RefreshCw, G as KeyRound, S as Search, a as UserPlus, n as X, ot as Copy } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DialogHeader, n as DialogContent$1, o as DialogTitle$1, s as DialogTrigger, t as Dialog$1 } from "./dialog-DIo89e4g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/members-C1cd9bn7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var ROLE_HE = {
	"super-admin": "מנהלת-על",
	mentor: "מנטור",
	student: "תלמידה"
};
function genPassword() {
	const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 10; i++) out += chars[(i * 7 + 11) % 31];
	return out;
}
function MembersPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const { data: members, isLoading, refetch } = useQuery({
		queryKey: [
			"admin",
			"members",
			search
		],
		queryFn: () => data.admin.listMembers(search || void 0)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "ניהול חברים"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: "החברים בחממה"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewMemberDialog, { onCreated: () => refetch() })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2 md:max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "חיפוש לפי שם או אימייל...",
					className: "flex-1 bg-transparent text-small text-ink outline-none placeholder:text-muted-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-start text-small",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b border-line",
							children: [
								"חברה",
								"תפקיד",
								"דרגה",
								"XP",
								"רצף",
								""
							].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-start label-mono",
								children: h
							}, i))
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? [
							0,
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-b border-line-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-8 rounded" })
							})
						}, i)) : (members ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-[color:var(--panel-2)]",
							onClick: () => setSelected(m),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
											size: "sm",
											tier: m.growthStage,
											progress: 0,
											name: m.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-ink",
											children: m.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[11px] text-muted",
											children: m.email
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-ink-2",
									children: ROLE_HE[m.role]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-ink-2",
									children: tierName(m.growthStage)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono tabular text-ink-2",
									children: m.xpTotal.toLocaleString("en-US")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono tabular text-ink-2",
									children: m.streakDays
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn-ghost text-[12px]",
										children: "נהל"
									})
								})
							]
						}, m.id)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberDrawer, {
				member: selected,
				onClose: () => setSelected(null),
				onChanged: () => refetch()
			})
		]
	});
}
function MemberDrawer({ member, onClose, onChanged }) {
	const [tempPw, setTempPw] = (0, import_react.useState)(null);
	const reset = useMutation({
		mutationFn: () => data.admin.resetPassword(member.id),
		onSuccess: (res) => {
			setTempPw(res.tempPassword);
			toast.success("נוצרה סיסמה זמנית חדשה");
		}
	});
	const setRole = useMutation({
		mutationFn: (role) => data.admin.setRole(member.id, role),
		onSuccess: () => {
			toast.success("התפקיד עודכן");
			onChanged();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!member,
		onOpenChange: (o) => {
			if (!o) {
				onClose();
				setTempPw(null);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			side: "left",
			className: "w-[380px] border-line bg-panel",
			children: member && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "text-ink",
				children: member.fullName
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
							size: "md",
							tier: member.growthStage,
							progress: 0,
							name: member.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[12px] text-muted",
							children: member.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-small text-ink-2",
							children: [
								"דרגת ",
								tierName(member.growthStage),
								" · ",
								member.xpTotal.toLocaleString("en-US"),
								" ",
								"XP"
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "תפקיד"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-2",
						children: [
							"student",
							"mentor",
							"super-admin"
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRole.mutate(r),
							className: "rounded-md border px-3 py-1.5 text-[12px] transition-all",
							style: {
								borderColor: member.role === r ? "var(--accent)" : "var(--line)",
								background: member.role === r ? "var(--accent-faint)" : "transparent",
								color: member.role === r ? "var(--accent)" : "var(--ink-2)"
							},
							children: ROLE_HE[r]
						}, r))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "אבטחה"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: tempPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-[color:var(--accent-border)] bg-bg-2 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-[12px] text-muted",
								children: "סיסמה זמנית חדשה — העבירי לחברה:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									dir: "ltr",
									className: "flex-1 rounded bg-panel-2 px-3 py-2 text-start font-mono text-[15px] tracking-[0.12em] text-ink",
									children: tempPw
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										navigator.clipboard?.writeText(tempPw);
										toast.success("הועתק");
									},
									className: "flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-accent",
									"aria-label": "העתקה",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => reset.mutate(),
							disabled: reset.isPending,
							className: "btn-secondary inline-flex items-center gap-2 text-small",
							children: [reset.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), "איפוס סיסמה"]
						})
					})] })
				]
			})] })
		})
	});
}
function NewMemberDialog({ onCreated }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [pw, setPw] = (0, import_react.useState)(genPassword());
	const [created, setCreated] = (0, import_react.useState)(false);
	const create = useMutation({
		mutationFn: () => data.admin.subscriptions.createMember({
			email,
			fullName: name
		}),
		onSuccess: () => {
			setCreated(true);
			toast.success("החברה נוצרה");
			onCreated();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog$1, {
		onOpenChange: (o) => {
			if (!o) {
				setCreated(false);
				setEmail("");
				setName("");
				setPw(genPassword());
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn-primary inline-flex items-center gap-2 text-small",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), "חברה חדשה"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "glass-panel",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
				className: "text-ink",
				children: "יצירת גישה לחברה חדשה"
			}) }), created ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-small text-success",
					children: "הגישה נוצרה. העבירי לחברה את פרטי הכניסה:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-line bg-bg-2 p-3 text-small",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-muted",
						children: [
							"אימייל:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								dir: "ltr",
								className: "font-mono text-ink",
								children: email
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-muted",
						children: [
							"סיסמה זמנית:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								dir: "ltr",
								className: "font-mono tracking-[0.12em] text-ink",
								children: pw
							})
						]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-small text-ink-2",
						children: "שם מלא"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "שם החברה"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-small text-ink-2",
						children: "אימייל"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "member@example.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-small text-ink-2",
						children: "סיסמה זמנית"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							dir: "ltr",
							className: "flex-1 rounded bg-bg-2 px-3 py-2 text-start font-mono text-[15px] tracking-[0.12em] text-ink",
							children: pw
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPw(genPassword()),
							className: "flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:text-accent",
							"aria-label": "חדש",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => email && name && create.mutate(),
						disabled: !email || !name || create.isPending,
						className: "btn-primary w-full disabled:opacity-50",
						children: "יצירת גישה ושליחה"
					})
				]
			})]
		})]
	});
}
//#endregion
export { MembersPage as component };
