import { o as __toESM } from "../_runtime.mjs";
import { n as useForm, r as require_react, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { r as data, t as DataError } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Logo, t as AmbientBackground } from "./AmbientBackground-CqHVwcVb.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C69bekFR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	email: stringType().email("כתובת אימייל לא תקינה"),
	password: stringType().min(1, "צריך גם סיסמה")
});
var QUOTES = [
	"המקום היחיד שבו לא נשארתי לבד עם השיווק של העסק.",
	"כל בוקר אני נכנסת לחמש דקות — וזה מה ששינה הכל.",
	"לא עוד קורס. קהילה שבאמת רואה אותך גדל."
];
function LoginPage() {
	const router = useRouter();
	const qc = useQueryClient();
	const [welcomeName, setWelcomeName] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const signIn = useMutation({
		mutationFn: (v) => data.auth.signIn(v.email, v.password),
		onSuccess: async (profile) => {
			await qc.invalidateQueries({ queryKey: ["session"] });
			setWelcomeName(profile.fullName.split(" ")[0]);
			setTimeout(() => {
				if (profile.mustResetPassword) router.navigate({ to: "/auth/reset-password" });
				else if (!profile.onboardingCompleted) router.navigate({ to: "/welcome" });
				else router.navigate({ to: "/" });
			}, 1200);
		},
		onError: (err) => {
			const msg = err instanceof DataError && err.code === "invalid_credentials" ? "אימייל או סיסמה שגויים" : copy["error.generic"];
			toast.error(msg);
		}
	});
	if (welcomeName) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "flex flex-col items-center gap-6 text-center",
			initial: {
				opacity: 0,
				scale: .96
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			transition: {
				duration: .6,
				ease: EASE
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
					variant: "mark",
					size: 80,
					animated: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-display gold-text",
					children: ["שלום, ", welcomeName]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "נכנסים לחממה..."
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col md:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "relative flex items-center justify-center overflow-hidden border-b border-line bg-bg-2 px-8 py-10 md:order-2 md:w-[45%] md:border-b-0 md:border-s md:py-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 max-w-sm text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
							variant: "mark",
							size: 64,
							animated: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-body-lg text-ink-2",
						children: QUOTES[0]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 items-center justify-center px-6 py-12 md:order-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "w-full max-w-[400px]",
					initial: {
						opacity: 0,
						y: 26
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						ease: EASE
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { variant: "wordmark" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-6 text-h1 text-ink",
									children: copy["auth.loginTitle"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-small text-muted",
									children: "המקום הקבוע שלך לצמוח. הזן את פרטי הכניסה."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: form.handleSubmit((v) => signIn.mutate(v)),
							className: "space-y-4",
							noValidate: true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "email",
										className: "mb-1.5 block text-small text-ink-2",
										children: "אימייל"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										autoComplete: "email",
										placeholder: "noa@example.com",
										...form.register("email")
									}),
									form.formState.errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-small text-danger",
										children: form.formState.errors.email.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1.5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "password",
											className: "block text-small text-ink-2",
											children: "סיסמה"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgotPasswordDialog, {})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: "current-password",
										placeholder: "הסיסמה שלך",
										...form.register("password")
									}),
									form.formState.errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-small text-danger",
										children: form.formState.errors.password.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: signIn.isPending,
									className: "btn-primary w-full disabled:opacity-60",
									children: signIn.isPending ? "רגע..." : copy["auth.loginCta"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-2 text-center text-small text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"להדגמה: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink-2",
									children: "noa@example.com"
								}),
								" (חברה קיימת) או",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink-2",
									children: "new@example.com"
								}),
								" (זרימת קליטה מלאה) — כל סיסמה."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/auth/staff",
								className: "inline-block text-muted transition-colors hover:text-accent",
								children: "כניסת צוות"
							})]
						})
					]
				})
			})
		]
	});
}
function ForgotPasswordDialog() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-small text-muted transition-colors hover:text-accent",
			children: "שכחתי סיסמה"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "glass-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "איפוס סיסמה" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "נשלח אליך קישור לאיפוס. הזן את האימייל שאיתו נרשמת לחממה." })] }),
			sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-small text-success",
				children: "אם הכתובת קיימת בחממה — הקישור בדרך אליך."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "email",
				placeholder: "האימייל שלך",
				value: email,
				onChange: (e) => setEmail(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-primary w-full",
				onClick: () => setSent(true),
				disabled: sent,
				children: sent ? "נשלח" : "שליחת קישור איפוס"
			}) })
		]
	})] });
}
//#endregion
export { LoginPage as component };
