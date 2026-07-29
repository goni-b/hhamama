import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DXpPRvM6.js
var $$splitComponentImporter = () => import("./search-DxL0Dktr.mjs");
var Route = createFileRoute("/_app/search")({
	validateSearch: (search) => ({ q: typeof search.q === "string" && search.q.length > 0 ? search.q : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
