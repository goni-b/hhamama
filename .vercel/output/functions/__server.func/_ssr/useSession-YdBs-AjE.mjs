import { r as data } from "./data-BDcPQam0.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useSession-YdBs-AjE.js
function useSession() {
	const query = useQuery({
		queryKey: ["session"],
		queryFn: () => data.auth.getSession(),
		staleTime: 6e4
	});
	return {
		profile: query.data ?? null,
		isLoading: query.isLoading,
		isError: query.isError,
		refetch: query.refetch
	};
}
//#endregion
export { useSession as t };
