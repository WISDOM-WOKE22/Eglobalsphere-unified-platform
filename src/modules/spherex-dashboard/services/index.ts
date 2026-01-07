import api from "@/core/services/api";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexDashboardResponse } from "@/types";

export const useSpherexDashboardService = () => {
  const { data, error, isLoading } = useSWR<SpherexDashboardResponse>('/spherex/overview', fetcher);

  const getSpherexDashboard = async () => {
    const res = await api.get('/spherex/overview');
    return res.data;
  };
  return { data, error, isLoading, getSpherexDashboard };
};