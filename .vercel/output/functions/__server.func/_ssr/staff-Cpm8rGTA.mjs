import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { r as data, t as DataError } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Shield } from "../_libs/lucide-react.mjs";
import { n as Logo, t as AmbientBackground } from "./AmbientBackground-CqHVwcVb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-Cpm8rGTA.js
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	email: stringType().email("כתובת אימייל לא תקינה"),
	password: stringType().min(1, "צריך גם סיסמה")
});
function StaffLoginPage() {
	const router = useRouter();
	const qc = useQueryClient();
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
			if (profile.role === "student") {
				toast.error("הכניסה הזו מיועדת לצוות בלבד");
				return;
			}
			router.navigate({ to: "/admin" });
		},
		onError: (err) => {
			const msg = err instanceof DataError && err.code === "invalid_credentials" ? "אימייל או סיסמה שגויים" : copy["error.generic"];
			toast.error(msg);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientBackground, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "glass-panel w-full max-w-[420px] rounded-2xl p-8 shadow-[var(--elev-3)]",
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
					className: "mb-6 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						variant: "mark",
						size: 52
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 label-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), "כניסת צוות"]
					})]
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
								children: "אימייל צוות"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								placeholder: "hofit@hofitgoni.com",
								...form.register("email")
							}),
							form.formState.errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-small text-danger",
								children: form.formState.errors.email.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "password",
								className: "mb-1.5 block text-small text-ink-2",
								children: "סיסמה"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
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
							children: signIn.isPending ? "רגע..." : "כניסה לניהול"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-center text-small text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/login",
						className: "transition-colors hover:text-accent",
						children: "חזרה לכניסת חברים"
					})
				})
			]
		})]
	});
}
//#endregion
export { StaffLoginPage as component };
