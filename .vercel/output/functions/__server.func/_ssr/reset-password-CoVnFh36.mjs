import { n as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Logo, t as AmbientBackground } from "./AmbientBackground-CqHVwcVb.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-CoVnFh36.js
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	password: stringType().min(8, "לפחות 8 תווים"),
	confirm: stringType()
}).refine((v) => v.password === v.confirm, {
	message: "הסיסמאות לא זהות",
	path: ["confirm"]
});
function ResetPasswordPage() {
	const router = useRouter();
	const qc = useQueryClient();
	const { profile } = useSession();
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			password: "",
			confirm: ""
		}
	});
	const submit = useMutation({
		mutationFn: (v) => data.auth.updatePassword(v.password),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["session"] });
			const fresh = await data.auth.getSession();
			if (fresh && !fresh.onboardingCompleted) router.navigate({ to: "/welcome" });
			else router.navigate({ to: "/" });
		},
		onError: () => toast.error(copy["error.generic"])
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						variant: "mark",
						size: 56
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-h3 text-ink",
					children: profile ? `עוד רגע בפנים, ${profile.fullName.split(" ")[0]}` : "בחירת סיסמה חדשה"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-small text-muted",
					children: "בחר סיסמה קבועה שתחליף את הסיסמה הזמנית."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: form.handleSubmit((v) => submit.mutate(v)),
					className: "mt-6 space-y-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "pw",
								className: "mb-1.5 block text-small text-ink-2",
								children: "סיסמה חדשה"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pw",
								type: "password",
								autoComplete: "new-password",
								...form.register("password")
							}),
							form.formState.errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-small text-danger",
								children: form.formState.errors.password.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "pw2",
								className: "mb-1.5 block text-small text-ink-2",
								children: "אימות סיסמה"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "pw2",
								type: "password",
								autoComplete: "new-password",
								...form.register("confirm")
							}),
							form.formState.errors.confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-small text-danger",
								children: form.formState.errors.confirm.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: submit.isPending,
							className: "btn-primary w-full disabled:opacity-60",
							children: submit.isPending ? "רגע..." : "שמירה והמשך"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ResetPasswordPage as component };
