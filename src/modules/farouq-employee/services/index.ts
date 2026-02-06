import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqEmployeeResponse } from "@/types";
import { toQueryString } from "@/lib/utils";
import api from "@/core/services/api";
import { toast } from "sonner";

export const useFarouqEmployeeService = (queryParams: Record<string, any> = {}) => {
  const params: Record<string, any> = {
    page: queryParams.page ?? 1,
    page_size: queryParams.page_size ?? 20,
  };

  if (queryParams.search) params.search = queryParams.search;
  if (queryParams.department) params.department = queryParams.department;
  if (queryParams.status) params.status = queryParams.status;
  if (queryParams.sort_by) params.sort_by = queryParams.sort_by;
  if (queryParams.sort_order) params.sort_order = queryParams.sort_order;

  const queryString = toQueryString(params);
  
  const { data, error, isLoading } = useSWR<FarouqEmployeeResponse>(
    `/fms/employees?${queryString}`, 
    fetcher
  );

  const fetchEmployeesForExport = async (exportQueryParams: Record<string, any> = {}) => {
    const exportParams: Record<string, any> = {
      page: 1,
      page_size: 100,
    };
    if (exportQueryParams.search) exportParams.search = exportQueryParams.search;
    if (exportQueryParams.department) exportParams.department = exportQueryParams.department;
    if (exportQueryParams.status) exportParams.status = exportQueryParams.status;
    if (exportQueryParams.sort_by) exportParams.sort_by = exportQueryParams.sort_by;
    if (exportQueryParams.sort_order) exportParams.sort_order = exportQueryParams.sort_order;

    const qs = toQueryString(exportParams);
    const res = await api.get(`/fms/employees?${qs}`);
    const raw = res?.data;
    const employees = raw?.doc?.employees ?? raw?.employees ?? [];
    return Array.isArray(employees) ? employees : [];
  };

  const exportFarouqEmployeesData = async (exportQueryParams: Record<string, any> = {}) => {
    try {
      return await fetchEmployeesForExport(exportQueryParams);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch employees for export");
      return [];
    }
  };

  return { data, error, isLoading, exportFarouqEmployeesData };
};