import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRLogsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useLPRLogsService = (queryParams: Record<string, any> = {}) => {
    const queryString = toQueryString(queryParams);
    
    const { data, error, isLoading } = useSWR<LPRLogsResponse>(`/lpr/logs?${queryString}`, fetcher);

    return { data, error, isLoading };
}