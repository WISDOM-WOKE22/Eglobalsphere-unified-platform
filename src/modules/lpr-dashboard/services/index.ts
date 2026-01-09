import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRDashboardResponse } from "@/types";
import api from "@/core/services/api";
import { toast } from "sonner";
import { useState } from "react";

export const useLPRDashboardService = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const { data, error, isLoading } = useSWR<LPRDashboardResponse>('/lpr/overview', fetcher);

  const syncLprLogs = async () => {
    try{
      setIsSyncing(true);
      const res = await api.post('/logs/sync/lpr');
      toast.success('LPR data synced successfully');
      setIsSyncing(false);
      return res.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error syncing LPR data';
      toast.error(errorMessage);
      setIsSyncing(false);
    }
  };

  return { data, error, isLoading, syncLprLogs, isSyncing };
};