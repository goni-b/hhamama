import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as EASE } from "./motion-D3meAu4o.mjs";
import { o as tierName, r as data, s as tierProgress } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { t as CommunityPostCard } from "./CommunityPostCard-DCfItWdH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile._username-3klSUzyE.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { username } = useParams({ from: "/_app/profile/$username" });
	const { data: profile, isLoading } = useQuery({
		queryKey: ["profile", username],
		queryFn: () => data.profiles.getByUsername(username)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-3xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-48 rounded-xl" })
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "הפרופיל לא נמצא",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/community",
					className: "btn-primary text-small",
					children: "חזרה לקהילה"
				})
			})
		})
	});
	const { progress } = tierProgress(profile.xpTotal);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				className: "surface-card relative overflow-hidden p-7 md:p-8",
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
					style: { background: "radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col items-center gap-5 text-center md:flex-row md:text-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
						size: "lg",
						tier: profile.growthStage,
						progress,
						name: profile.fullName,
						src: profile.avatarUrl,
						breathe: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-h1 text-ink",
								children: profile.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center justify-center gap-3 md:justify-start",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "label-mono",
										style: { color: "var(--accent)" },
										children: ["דרגת ", tierName(profile.growthStage)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[12px] tabular text-muted",
										children: [profile.xpTotal.toLocaleString("en-US"), " XP"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[12px] tabular text-muted",
										children: [
											"רצף ",
											profile.streakDays,
											" ימים"
										]
									})
								]
							}),
							profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-body text-ink-2",
								children: profile.bio
							})
						]
					})]
				})]
			}),
			profile.achievements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-h3 text-ink",
					children: "תעודות נבחרות"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: profile.achievements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border px-3 py-1.5 text-small",
						style: {
							borderColor: "var(--accent-border)",
							background: "var(--accent-faint)",
							color: "var(--accent)"
						},
						children: a.title
					}, a.id))
				})]
			}),
			profile.recentPosts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-h3 text-ink",
					children: "פוסטים אחרונים"
				}), profile.recentPosts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityPostCard, { post: p }, p.id))]
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
