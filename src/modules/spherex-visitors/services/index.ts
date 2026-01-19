import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexVisitorsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";
import api from "@/core/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { useStore } from "@/lib/zustand/store";

export const useSpherexVisitorsService = (queryParams: Record<string, any> = {}) => {
  const [loading, setLoading] = useState(false);
  const setSpherexVisitor = useStore((state) => state.setSpherexVisitor);
  const queryString = toQueryString(queryParams);
  
  const { data, error, isLoading } = useSWR<SpherexVisitorsResponse>(
    `/spherex/visitors?${queryString}`, 
    fetcher
  );

  const getAVisitor = async (visitorId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/spherex/visitors/${visitorId}`);
      setSpherexVisitor(res.data);
      setLoading(false);
      return res.data;
    } catch (error: any) {
      setSpherexVisitor(null);
      const errorMessage = error.response?.data?.message || error.message || 'Error getting visitor';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return { data, error, isLoading, getAVisitor, loading };
};