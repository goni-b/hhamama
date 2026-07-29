import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { o as DirectionProvider, x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { _ as Link, b as useRouter, c as HeadContent, d as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as objectType, r as stringType, t as literalType } from "../_libs/zod.mjs";
import { t as Route$29 } from "./search-DXpPRvM6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B2fOEiOG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-4fnLEEQv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$28 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "HOFIT & GONI — אקדמיית קורסים" },
			{
				name: "description",
				content: "HOFIT & GONI — פורטל למידה פרימיום לקורסים דיגיטליים, מבחנים ומשימות. עברית, ממשק כהה, חוויית לימוד ממוקדת."
			},
			{
				property: "og:title",
				content: "HOFIT & GONI — אקדמיית קורסים"
			},
			{
				property: "og:description",
				content: "פורטל למידה פרימיום בעברית לקורסי AI, קופי ואוטומציה."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "he",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$28.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DirectionProvider, {
			dir: "rtl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				dir: "rtl",
				position: "bottom-left",
				gap: 10,
				toastOptions: { classNames: {
					toast: "!bg-panel-2 !border !border-line !rounded-[12px] !text-ink !shadow-[var(--elev-2)] !font-sans",
					title: "!text-ink !font-medium",
					description: "!text-ink-2",
					success: "!border-r-[3px] !border-r-success",
					error: "!border-r-[3px] !border-r-danger"
				} }
			})]
		})
	});
}
var $$splitComponentImporter$27 = () => import("./welcome-C4M1TUrR.mjs");
var Route$27 = createFileRoute("/welcome")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./login-C69bekFR.mjs");
var Route$26 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
objectType({
	email: stringType().email("כתובת אימייל לא תקינה"),
	password: stringType().min(1, "צריך גם סיסמה")
});
var $$splitComponentImporter$25 = () => import("./admin-B6K7p4YE.mjs");
var Route$25 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("../_app-lNe_x8MF.mjs");
var Route$24 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin-BgXdeEVa.mjs");
var Route$23 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("../_app-BAk2DrXa.mjs");
var Route$22 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("../_id-D91ez9b-.mjs");
var Route$21 = createFileRoute("/quiz/$id")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./staff-Cpm8rGTA.mjs");
var Route$20 = createFileRoute("/auth/staff")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
objectType({
	email: stringType().email("כתובת אימייל לא תקינה"),
	password: stringType().min(1, "צריך גם סיסמה")
});
var $$splitComponentImporter$19 = () => import("./reset-password-CoVnFh36.mjs");
var Route$19 = createFileRoute("/auth/reset-password")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
objectType({
	password: stringType().min(8, "לפחות 8 תווים"),
	confirm: stringType()
}).refine((v) => v.password === v.confirm, {
	message: "הסיסמאות לא זהות",
	path: ["confirm"]
});
var $$splitComponentImporter$18 = () => import("./submissions-CVrhPzjD.mjs");
var Route$18 = createFileRoute("/admin/submissions")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./members-C1cd9bn7.mjs");
var Route$17 = createFileRoute("/admin/members")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./notifications-Bl98pqk2.mjs");
var Route$16 = createFileRoute("/_app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./leaderboard-COTMA7T1.mjs");
var Route$15 = createFileRoute("/_app/leaderboard")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./achievements-Cw7sdh9j.mjs");
var Route$14 = createFileRoute("/_app/achievements")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./courses-BawzB0aS.mjs");
var Route$13 = createFileRoute("/admin/courses/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./events-D_934hBQ.mjs");
var Route$12 = createFileRoute("/_app/events/")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./courses-zugkyuup.mjs");
var Route$11 = createFileRoute("/_app/courses/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./community-hAbYdmkr.mjs");
var Route$10 = createFileRoute("/_app/community/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./assignments-D_BnOnEr.mjs");
var Route$9 = createFileRoute("/_app/assignments/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
/** לאיזה טאב שייכת משימה: ללא הגשה או "דורש תיקון" — ממתינות; אחרת לפי הסטטוס */
var $$splitComponentImporter$8 = () => import("./account-CBAw8j_1.mjs");
var Route$8 = createFileRoute("/_app/account/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
objectType({
	fullName: stringType().min(2, "שם קצר מדי").max(60, "עד 60 תווים"),
	username: stringType().min(3, "לפחות 3 תווים").max(24, "עד 24 תווים").regex(/^[a-z0-9-]+$/, "אותיות לטיניות קטנות, ספרות ומקפים בלבד"),
	bio: stringType().max(280, "עד 280 תווים")
});
var $$splitComponentImporter$7 = () => import("../_id.results-dr36gXGw.mjs");
var Route$7 = createFileRoute("/quiz/$id/results")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_courseSlug._lessonId-CJFRFjHC.mjs");
var Route$6 = createFileRoute("/learn/$courseSlug/$lessonId")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_id-7tilmvYn.mjs");
var Route$5 = createFileRoute("/admin/courses/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
/** שחזור קישור קנוני מתוך provider+id — לתצוגה בשדה הקישור בעריכה */
var $$splitComponentImporter$4 = () => import("./profile._username-3klSUzyE.mjs");
var Route$4 = createFileRoute("/_app/profile/$username")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_slug-FC5KdfHK.mjs");
var Route$3 = createFileRoute("/_app/courses/$slug")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
/** שורת "מבחן המודול" בתחתית כל מודול — מוצגת רק כשקיים מבחן */
var $$splitComponentImporter$2 = () => import("../_id-Cqcrm1Ng.mjs");
var Route$2 = createFileRoute("/_app/assignments/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
objectType({
	content: stringType().min(10, "ספר קצת יותר על מה שהכנת — לפחות 10 תווים"),
	link: stringType().url("קישור לא תקין — כתובת מלאה כולל https://").optional().or(literalType(""))
});
var $$splitComponentImporter$1 = () => import("./cancel-C0z7ydS2.mjs");
var Route$1 = createFileRoute("/_app/account/cancel")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./post._id-DZe_FsEN.mjs");
var Route = createFileRoute("/_app/community/post/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WelcomeRoute = Route$27.update({
	id: "/welcome",
	path: "/welcome",
	getParentRoute: () => Route$28
});
var LoginRoute = Route$26.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$28
});
var AdminRoute = Route$25.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$28
});
var AppRoute = Route$24.update({
	id: "/_app",
	getParentRoute: () => Route$28
});
var AdminIndexRoute = Route$23.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AppIndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var QuizIdRoute = Route$21.update({
	id: "/quiz/$id",
	path: "/quiz/$id",
	getParentRoute: () => Route$28
});
var AuthStaffRoute = Route$20.update({
	id: "/auth/staff",
	path: "/auth/staff",
	getParentRoute: () => Route$28
});
var AuthResetPasswordRoute = Route$19.update({
	id: "/auth/reset-password",
	path: "/auth/reset-password",
	getParentRoute: () => Route$28
});
var AdminSubmissionsRoute = Route$18.update({
	id: "/submissions",
	path: "/submissions",
	getParentRoute: () => AdminRoute
});
var AdminMembersRoute = Route$17.update({
	id: "/members",
	path: "/members",
	getParentRoute: () => AdminRoute
});
var AppSearchRoute = Route$29.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppNotificationsRoute = Route$16.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRoute
});
var AppLeaderboardRoute = Route$15.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => AppRoute
});
var AppAchievementsRoute = Route$14.update({
	id: "/achievements",
	path: "/achievements",
	getParentRoute: () => AppRoute
});
var AdminCoursesIndexRoute = Route$13.update({
	id: "/courses/",
	path: "/courses/",
	getParentRoute: () => AdminRoute
});
var AppEventsIndexRoute = Route$12.update({
	id: "/events/",
	path: "/events/",
	getParentRoute: () => AppRoute
});
var AppCoursesIndexRoute = Route$11.update({
	id: "/courses/",
	path: "/courses/",
	getParentRoute: () => AppRoute
});
var AppCommunityIndexRoute = Route$10.update({
	id: "/community/",
	path: "/community/",
	getParentRoute: () => AppRoute
});
var AppAssignmentsIndexRoute = Route$9.update({
	id: "/assignments/",
	path: "/assignments/",
	getParentRoute: () => AppRoute
});
var AppAccountIndexRoute = Route$8.update({
	id: "/account/",
	path: "/account/",
	getParentRoute: () => AppRoute
});
var QuizIdResultsRoute = Route$7.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => QuizIdRoute
});
var LearnCourseSlugLessonIdRoute = Route$6.update({
	id: "/learn/$courseSlug/$lessonId",
	path: "/learn/$courseSlug/$lessonId",
	getParentRoute: () => Route$28
});
var AdminCoursesIdRoute = Route$5.update({
	id: "/courses/$id",
	path: "/courses/$id",
	getParentRoute: () => AdminRoute
});
var AppProfileUsernameRoute = Route$4.update({
	id: "/profile/$username",
	path: "/profile/$username",
	getParentRoute: () => AppRoute
});
var AppCoursesSlugRoute = Route$3.update({
	id: "/courses/$slug",
	path: "/courses/$slug",
	getParentRoute: () => AppRoute
});
var AppAssignmentsIdRoute = Route$2.update({
	id: "/assignments/$id",
	path: "/assignments/$id",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAchievementsRoute,
	AppLeaderboardRoute,
	AppNotificationsRoute,
	AppSearchRoute,
	AppIndexRoute,
	AppAccountCancelRoute: Route$1.update({
		id: "/account/cancel",
		path: "/account/cancel",
		getParentRoute: () => AppRoute
	}),
	AppAssignmentsIdRoute,
	AppCoursesSlugRoute,
	AppProfileUsernameRoute,
	AppAccountIndexRoute,
	AppAssignmentsIndexRoute,
	AppCommunityIndexRoute,
	AppCoursesIndexRoute,
	AppEventsIndexRoute,
	AppCommunityPostIdRoute: Route.update({
		id: "/community/post/$id",
		path: "/community/post/$id",
		getParentRoute: () => AppRoute
	})
};
var AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
var AdminRouteChildren = {
	AdminMembersRoute,
	AdminSubmissionsRoute,
	AdminIndexRoute,
	AdminCoursesIdRoute,
	AdminCoursesIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var QuizIdRouteChildren = { QuizIdResultsRoute };
var rootRouteChildren = {
	AppRoute: AppRouteWithChildren,
	AdminRoute: AdminRouteWithChildren,
	LoginRoute,
	WelcomeRoute,
	AuthResetPasswordRoute,
	AuthStaffRoute,
	QuizIdRoute: QuizIdRoute._addFileChildren(QuizIdRouteChildren),
	LearnCourseSlugLessonIdRoute
};
var routeTree = Route$28._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
