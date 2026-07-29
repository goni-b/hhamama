import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as useReducedMotion, t as useInView } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/motion-D3meAu4o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var EASE = [
	.22,
	.61,
	.36,
	1
];
var DUR = {
	micro: .16,
	ui: .22,
	enter: .7,
	reveal: .85,
	hero: .9
};
var revealUp = {
	hidden: {
		opacity: 0,
		y: 26
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: DUR.reveal,
			ease: EASE
		}
	}
};
DUR.enter;
var chipPop = {
	hidden: {
		opacity: 0,
		scale: .5
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: .6,
			ease: EASE
		}
	}
};
var staggerContainer = (stagger = .08, delay = .1) => ({
	hidden: {},
	visible: { transition: {
		staggerChildren: stagger,
		delayChildren: delay
	} }
});
var fadeOnly = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: .01 }
	}
};
/** עוטף כל variants: אם המשתמש ביקש reduced motion — fade בלבד. */
function useGatedVariants(v) {
	return useReducedMotion() ? fadeOnly : v;
}
function useCountUp(target, duration = 1.4) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		amount: .6
	});
	const reduced = useReducedMotion();
	const [value, setValue] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		if (reduced) {
			setValue(target);
			return;
		}
		let raf = 0;
		const t0 = performance.now();
		const tick = (t) => {
			const p = Math.min((t - t0) / (duration * 1e3), 1);
			const eased = 1 - Math.pow(1 - p, 3);
			setValue(Math.round(target * eased));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		inView,
		target,
		duration,
		reduced
	]);
	return {
		ref,
		value
	};
}
//#endregion
export { staggerContainer as a, revealUp as i, EASE as n, useCountUp as o, chipPop as r, useGatedVariants as s, DUR as t };
