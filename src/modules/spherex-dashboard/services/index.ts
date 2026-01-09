import api from "@/core/services/api";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexDashboardResponse } from "@/types";
import { toast } from "sonner";
import { useState } from "react";

export const useSpherexDashboardService = () => {

  const [isSyncing, setIsSyncing] = useState(false);
  const { data, error, isLoading } = useSWR<SpherexDashboardResponse>('/spherex/overview', fetcher);

  const syncSpherexLogs = async () => {
    try{
      setIsSyncing(true);
      const res = await api.post('/logs/sync/spherex');
      toast.success('Spherex data synced successfully');
      setIsSyncing(false);
      return res.data;
    }
    catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error syncing Spherex data';
      toast.error(errorMessage);
      setIsSyncing(false);
    }
  };
  return { data, error, isLoading, isSyncing, syncSpherexLogs };
};