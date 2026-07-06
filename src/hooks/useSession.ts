// src/hooks/useSession.ts — קריאת הסשן הפעיל דרך שכבת הדאטה (פרק 6.3)
import { useQuery } from "@tanstack/react-query";
import { data } from "../lib/data";

export function useSession() {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => data.auth.getSession(),
    staleTime: 60_000,
  });
  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
