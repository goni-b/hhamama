import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as tierName, r as data } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as Award, I as MessageSquare, _ as Sprout, j as Pin, l as TrendingUp, p as Target } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CommunityPostCard-DCfItWdH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REACTIONS = [
	{
		kind: "grow",
		label: "מצמיח",
		icon: Sprout
	},
	{
		kind: "gold",
		label: "זהב",
		icon: Award
	},
	{
		kind: "precise",
		label: "קולע",
		icon: Target
	},
	{
		kind: "lift",
		label: "מרים",
		icon: TrendingUp
	}
];
var CHANNEL_HE = {
	general: "דיון",
	wins: "ניצחון",
	questions: "שאלה",
	announcements: "הכרזת צוות"
};
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "עכשיו";
	if (m < 60) return `לפני ${m} דק'`;
	const h = Math.floor(m / 60);
	if (h < 24) return `לפני ${h} שע'`;
	return `לפני ${Math.floor(h / 24)} ימים`;
}
function CommunityPostCard({ post, linkToPost = true }) {
	const [myReactions, setMyReactions] = (0, import_react.useState)(post.myReactions);
	const toggle = useMutation({ mutationFn: (kind) => data.community.toggleReaction(post.id, kind) });
	function onReact(kind) {
		setMyReactions((prev) => prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]);
		toggle.mutate(kind);
	}
	const isMentor = post.authorRole !== "student";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "surface-card p-5",
		style: post.pinned ? { borderTop: "3px solid var(--accent)" } : void 0,
		children: [
			post.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 inline-flex items-center gap-1.5 label-mono",
				style: { color: "var(--accent)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3" }), "נעוץ"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
					size: "sm",
					tier: post.authorStage,
					progress: 0,
					name: post.authorName,
					src: post.authorAvatarUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile/$username",
							params: { username: post.authorUsername },
							className: "text-body font-medium text-ink hover:text-accent",
							children: post.authorName
						}), isMentor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded px-1.5 py-0.5 label-mono",
							style: {
								background: "var(--accent-surface)",
								color: "var(--accent)"
							},
							children: "HOFIT & GONI"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] text-muted",
						children: [
							"דרגת ",
							tierName(post.authorStage),
							" · ",
							timeAgo(post.createdAt),
							" ·",
							" ",
							CHANNEL_HE[post.channel] ?? post.channel
						]
					})]
				})]
			}),
			post.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 text-h3 text-ink",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 whitespace-pre-line text-body text-ink-2",
				children: post.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [REACTIONS.map((r) => {
					const active = myReactions.includes(r.kind);
					const count = (post.reactions[r.kind] ?? 0) + (active && !post.myReactions.includes(r.kind) ? 1 : 0) - (!active && post.myReactions.includes(r.kind) ? 1 : 0);
					const Icon = r.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onReact(r.kind),
						className: "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition-all",
						style: {
							borderColor: active ? "var(--accent-border)" : "var(--line)",
							background: active ? "var(--accent-faint)" : "transparent",
							color: active ? "var(--accent)" : "var(--muted)"
						},
						"aria-label": r.label,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular",
							children: count > 0 ? count : ""
						})]
					}, r.kind);
				}), linkToPost && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/community/post/$id",
					params: { id: post.id },
					className: "ms-auto inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular",
							children: post.commentsCount
						}),
						" תגובות"
					]
				})]
			})
		]
	});
}
//#endregion
export { timeAgo as n, CommunityPostCard as t };
