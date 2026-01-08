import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexLogsResponse } from "@/types";

export const useSpherexLogsService = () => {
  const { data, error, isLoading } = useSWR<SpherexLogsResponse>('/spherex/logs', fetcher);

  return { data, error, isLoading };
};