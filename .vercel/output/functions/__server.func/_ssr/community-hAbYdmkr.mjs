import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as staggerContainer, i as revealUp, s as useGatedVariants } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { t as copy } from "./copy-DH5R7OvZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { r as Users, x as Send } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { t as CommunityPostCard } from "./CommunityPostCard-DCfItWdH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-hAbYdmkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHANNELS = [
	{
		id: "all",
		label: "הכל"
	},
	{
		id: "general",
		label: "דיון"
	},
	{
		id: "wins",
		label: "ניצחונות"
	},
	{
		id: "questions",
		label: "שאלות"
	},
	{
		id: "announcements",
		label: "הכרזות צוות"
	}
];
function CommunityPage() {
	const { profile } = useSession();
	const qc = useQueryClient();
	const [channel, setChannel] = (0, import_react.useState)("all");
	const gated = useGatedVariants(revealUp);
	const { data: posts, isLoading } = useQuery({
		queryKey: ["posts", channel],
		queryFn: () => data.community.listPosts(channel === "all" ? void 0 : channel)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ghost-number",
					"aria-hidden": "true",
					children: "06"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "הקהילה"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: "החברים שגדלים איתך"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[1fr_260px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					onPosted: () => qc.invalidateQueries({ queryKey: ["posts"] }),
					authorName: profile.fullName,
					authorStage: profile.growthStage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-5 flex flex-wrap gap-2",
					children: CHANNELS.map((c) => {
						const active = channel === c.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setChannel(c.id),
							className: "rounded-full border px-4 py-1.5 text-small transition-all",
							style: {
								borderColor: active ? "var(--accent)" : "var(--line)",
								background: active ? "var(--accent-faint)" : "transparent",
								color: active ? "var(--accent)" : "var(--ink-2)"
							},
							children: c.label
						}, c.id);
					})
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-40 rounded-lg" }, i))
				}) : posts && posts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "space-y-4",
					variants: staggerContainer(.06),
					initial: "hidden",
					animate: "visible",
					children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: gated,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityPostCard, { post: p })
					}, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: copy["empty.communityFeed"] })
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "נוכחות"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-small text-ink-2",
						children: "14 חברים בחממה עכשיו"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "כללי הקהילה"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-small text-ink-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "מכבדים, תומכים, לא שופטים." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "חולקים ניצחונות — קטנים כגדולים." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "שואלים בלי בושה. כולנו למדנו פעם." })
						]
					})]
				})]
			})]
		})]
	});
}
function Composer({ onPosted, authorName, authorStage }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [body, setBody] = (0, import_react.useState)("");
	const [ch, setCh] = (0, import_react.useState)("general");
	const create = useMutation({
		mutationFn: () => data.community.createPost({
			body,
			channel: ch
		}),
		onSuccess: () => {
			toast.success(copy["success.postPublished"]);
			setBody("");
			setOpen(false);
			onPosted();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
				size: "sm",
				tier: authorStage,
				progress: 0,
				name: authorName
			}), !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setOpen(true),
				className: "flex-1 rounded-full border border-line bg-bg-2 px-4 py-2.5 text-start text-small text-muted transition-colors hover:border-[color:var(--accent-border)]",
				children: "מה למדת היום?"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-small text-ink-2",
				children: "שיתוף עם הקהילה"
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				autoFocus: true,
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "ספר לקהילה...",
				className: "min-h-[100px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						["general", "דיון"],
						["wins", "ניצחון"],
						["questions", "שאלה"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCh(id),
						className: "rounded-full border px-3 py-1 text-[12px] transition-all",
						style: {
							borderColor: ch === id ? "var(--accent)" : "var(--line)",
							background: ch === id ? "var(--accent-faint)" : "transparent",
							color: ch === id ? "var(--accent)" : "var(--muted)"
						},
						children: label
					}, id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => body.trim() && create.mutate(),
					disabled: !body.trim() || create.isPending,
					className: "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "פרסום"]
				})]
			})]
		})]
	});
}
//#endregion
export { CommunityPage as component };
