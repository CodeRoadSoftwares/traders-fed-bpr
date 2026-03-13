import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Fund, Pagination } from "@/types";

interface UseFundsParams {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export function useFunds(params: UseFundsParams = {}) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/fund/get", { params });
      setFunds(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch funds:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.type,
    params.startDate,
    params.endDate,
  ]);

  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);

  const createFund = async (data: {
    type: string;
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    await apiClient.post("/fund/create", data);
    fetchFunds();
  };

  const deleteFund = async (id: string) => {
    await apiClient.delete("/fund/delete", { data: { id } });
    fetchFunds();
  };

  return {
    funds,
    pagination,
    loading,
    createFund,
    deleteFund,
    refetch: fetchFunds,
  };
}
