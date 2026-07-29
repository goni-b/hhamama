import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useDebouncedValue-627230Hh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useDebouncedValue(value, delayMs = 300) {
	const [debounced, setDebounced] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(t);
	}, [value, delayMs]);
	return debounced;
}
//#endregion
export { useDebouncedValue as t };
