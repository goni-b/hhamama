import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as tierName, r as data } from "./data-BDcPQam0.mjs";
import { t as GrowthRing } from "./GrowthRing-A3PAOQq6.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useSession } from "./useSession-YdBs-AjE.mjs";
import { _ as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as ArrowRight, x as Send } from "../_libs/lucide-react.mjs";
import { t as EmptyState } from "./EmptyState-Dw_kDE_a.mjs";
import { n as timeAgo, t as CommunityPostCard } from "./CommunityPostCard-DCfItWdH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post._id-DZe_FsEN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostPage() {
	const { id } = useParams({ from: "/_app/community/post/$id" });
	const { profile } = useSession();
	const qc = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const { data: post, isLoading } = useQuery({
		queryKey: ["post", id],
		queryFn: () => data.community.getPost(id)
	});
	const { data: comments } = useQuery({
		queryKey: ["comments", id],
		queryFn: () => data.community.listComments(id)
	});
	const addComment = useMutation({
		mutationFn: () => data.community.addComment(id, body),
		onSuccess: () => {
			setBody("");
			qc.invalidateQueries({ queryKey: ["comments", id] });
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-64 rounded-lg" })
	});
	if (!post) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "הפוסט לא נמצא",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/community",
					className: "btn-primary text-small",
					children: "חזרה לקהילה"
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/community",
				className: "mb-4 inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), "חזרה לקהילה"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunityPostCard, {
				post,
				linkToPost: false
			}),
			profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card mt-5 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
						size: "sm",
						tier: profile.growthStage,
						progress: 0,
						name: profile.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: body,
							onChange: (e) => setBody(e.target.value),
							placeholder: "הוסף תגובה...",
							className: "min-h-[70px] w-full resize-y rounded-lg border border-line bg-bg-2 p-3 text-body text-ink outline-none placeholder:text-muted-2 focus:border-[color:var(--accent-border)]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => body.trim() && addComment.mutate(),
								disabled: !body.trim() || addComment.isPending,
								className: "btn-primary inline-flex items-center gap-2 text-small disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "שליחה"]
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [(comments ?? []).map((c) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-4",
						style: void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthRing, {
								size: "sm",
								tier: c.authorStage,
								progress: 0,
								name: c.authorName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-body font-medium text-ink",
								children: c.authorName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[12px] text-muted",
								children: [
									"דרגת ",
									tierName(c.authorStage),
									" · ",
									timeAgo(c.createdAt)
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-line text-body text-ink-2",
							children: c.body
						})]
					}, c.id);
				}), comments && comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-small text-muted",
					children: "אין עדיין תגובות. היה הראשון להגיב."
				})]
			})
		]
	});
}
//#endregion
export { PostPage as component };
