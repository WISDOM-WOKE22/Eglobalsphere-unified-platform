import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqEmployeeResponse } from "@/types";

export const useFarouqEmployeeService = () => {
  const { data, error, isLoading } = useSWR<FarouqEmployeeResponse>('/fms/employees', fetcher);

  return { data, error, isLoading };
};