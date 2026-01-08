import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRLogsResponse } from "@/types";

export const useLPRLogsService = () => {
    const { data, error, isLoading } = useSWR<LPRLogsResponse>('/lpr/logs', fetcher);

    return { data, error, isLoading };
}