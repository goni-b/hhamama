import { x as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as useCountUp } from "./motion-D3meAu4o.mjs";
import { r as data } from "./data-BDcPQam0.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Z as GraduationCap, c as TriangleAlert, l as TrendingUp, r as Users, st as Clock, u as TrendingDown } from "../_libs/lucide-react.mjs";
import { a as Bar, i as Area, n as BarChart, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BgXdeEVa.js
var import_jsx_runtime = require_jsx_runtime();
var MEMBERS_6M = [
	{
		m: "פבר",
		v: 62
	},
	{
		m: "מרץ",
		v: 78
	},
	{
		m: "אפר",
		v: 95
	},
	{
		m: "מאי",
		v: 108
	},
	{
		m: "יוני",
		v: 118
	},
	{
		m: "יולי",
		v: 128
	}
];
var WATCH_WEEK = [
	{
		d: "א",
		v: 480
	},
	{
		d: "ב",
		v: 520
	},
	{
		d: "ג",
		v: 610
	},
	{
		d: "ד",
		v: 470
	},
	{
		d: "ה",
		v: 560
	},
	{
		d: "ו",
		v: 300
	},
	{
		d: "ש",
		v: 180
	}
];
function AdminDashboard() {
	const { data: kpis } = useQuery({
		queryKey: ["admin", "kpis"],
		queryFn: () => data.admin.kpis()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: "דשבורד"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-h1 text-ink",
					children: "תמונת מצב"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
						label: "מנויים פעילים",
						value: kpis?.activeMembers.value ?? 0,
						delta: kpis?.activeMembers.deltaPct ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
						label: "דקות צפייה השבוע",
						value: kpis?.weeklyWatchMinutes.value ?? 0,
						delta: kpis?.weeklyWatchMinutes.deltaPct ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4" }),
						label: "שיעור השלמה",
						value: kpis?.completionRate.value ?? 0,
						suffix: "%",
						delta: kpis?.completionRate.deltaPct ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
						label: "Churn חודשי",
						value: kpis?.churnRate.value ?? 0,
						suffix: "%",
						delta: kpis?.churnRate.deltaPct ?? 0,
						invert: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "מנויים לאורך 6 חודשים"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: MEMBERS_6M,
								margin: {
									top: 6,
									right: 6,
									left: 6,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gGold",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "var(--accent)",
											stopOpacity: .35
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "var(--accent)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "m",
										reversed: true,
										tick: {
											fill: "var(--muted)",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--panel-2)",
										border: "1px solid var(--line)",
										borderRadius: 8,
										color: "var(--ink)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "v",
										stroke: "var(--accent)",
										strokeWidth: 2,
										fill: "url(#gGold)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "דקות צפייה לפי יום"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: WATCH_WEEK,
								margin: {
									top: 6,
									right: 6,
									left: 6,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "d",
										reversed: true,
										tick: {
											fill: "var(--muted)",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--panel-2)" },
										contentStyle: {
											background: "var(--panel-2)",
											border: "1px solid var(--line)",
											borderRadius: 8,
											color: "var(--ink)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "v",
										fill: "var(--accent)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "חברים בסיכון (14 יום ללא פעילות)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5",
						children: [
							"מיכל שרון",
							"יעל דהן",
							"אבי כהן"
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-small text-ink-2",
								children: n
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-ghost text-[12px]",
								children: "שלחי תזכורת"
							})]
						}, n))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "התור שלך"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/submissions",
							className: "flex items-center justify-between rounded-md border border-line px-3 py-2.5 transition-colors hover:border-[color:var(--accent-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-small text-ink-2",
								children: "הגשות ממתינות לבדיקה"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-h3 tabular text-accent",
								children: "0"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/members",
							className: "flex items-center justify-between rounded-md border border-line px-3 py-2.5 transition-colors hover:border-[color:var(--accent-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-small text-ink-2",
								children: "ניהול חברים"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-small tabular text-muted",
								children: "מעבר"
							})]
						})]
					})]
				})]
			})
		]
	});
}
function StatTile({ icon, label, value, suffix = "", delta, invert = false }) {
	const { ref, value: shown } = useCountUp(value);
	const good = invert ? delta < 0 : delta > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-accent",
				children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label-mono",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 display-latin text-h1 tabular text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					ref,
					children: shown.toLocaleString("en-US")
				}), suffix]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 inline-flex items-center gap-1 font-mono text-[11px] tabular",
				style: { color: good ? "var(--success)" : "var(--danger)" },
				children: [
					delta >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }),
					Math.abs(delta),
					"%"
				]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
