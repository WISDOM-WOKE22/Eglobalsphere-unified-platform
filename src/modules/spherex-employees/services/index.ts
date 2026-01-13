import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexEmployee, SpherexEmployeesResponse } from "@/types";
import api from "@/core/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { useStore } from "@/lib/zustand/store";
import { toQueryString } from "@/lib/utils";

export const useSpherexEmployeeService = (queryParams: Record<string, any> = {}) => {
  const [loading, setLoading] = useState(false);
  const [ employee, setEmployee ] = useState<SpherexEmployee | null>(null);
  const setSpherexEmployee = useStore((state) => state.setSpherexEmployee);

  const queryString = toQueryString(queryParams);

  const { data, error, isLoading } = useSWR<SpherexEmployeesResponse>(`/spherex/employees?${queryString}`, fetcher);

 const getAnEmployee = async (employeeId: string) => {
  try{
    setLoading(true);
    const res = await api.get(`/spherex/employees/${employeeId}`);
    setEmployee(res.data);
    setSpherexEmployee(res.data);
    setLoading(false);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error getting employee';
    toast.error(errorMessage);
    setLoading(false);
    return null;
  }
};

  return { 
    data, 
    error,
    isLoading,
    getAnEmployee,
    loading,
    employee
  };
};