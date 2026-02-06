import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqLogsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";
import api from "@/core/services/api";
import { toast } from "sonner";

export const useFarouqLogsService = (queryParams: Record<string, any> = {}) => {
  // Ensure default pagination parameters are always included
  const params: Record<string, any> = {
    page: queryParams.page ?? 1,
    page_size: queryParams.page_size ?? 10,
  };
  
  // Add optional filters if provided
  if (queryParams.search) {
    params.search = queryParams.search;
  }
  
  const queryString = toQueryString(params);
  const url = `/fms/logs?${queryString}`;
  
  const { data, error, isLoading } = useSWR<FarouqLogsResponse>(
    url, 
    fetcher
  );

  /** Fetch all logs matching current filters for export (same query as table, high page_size). */
  const fetchLogsForExport = async (exportQueryParams: Record<string, any> = {}) => {
    const exportParams: Record<string, any> = {
      page: 1,
      page_size: 100,
    };
    if (exportQueryParams.search) {
      exportParams.search = exportQueryParams.search;
    }
    const qs = toQueryString(exportParams);
    const res = await api.get(`/fms/logs?${qs}`);
    const raw = res?.data;
    const logs = raw?.doc?.logs ?? raw?.logs ?? [];
    return Array.isArray(logs) ? logs : [];
  };

  const exportFarouqLogsData = async (exportQueryParams: Record<string, any> = {}) => {
    try {
      return await fetchLogsForExport(exportQueryParams);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch logs for export");
      return [];
    }
  };

  return { data, error, isLoading, fetchLogsForExport, exportFarouqLogsData };
};