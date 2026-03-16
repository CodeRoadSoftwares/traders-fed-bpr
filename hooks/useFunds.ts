import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Fund, Pagination } from "@/types";
import { showToast } from "@/lib/toast";

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
      showToast.error("Failed to load funds");
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
    try {
      await apiClient.post("/fund/create", data);
      showToast.success("Fund entry created successfully!");
      fetchFunds();
    } catch (error) {
      showToast.error("Failed to create fund entry");
      throw error;
    }
  };

  const deleteFund = async (id: string) => {
    try {
      await apiClient.delete("/fund/delete", { data: { id } });
      showToast.success("Fund entry deleted successfully!");
      fetchFunds();
    } catch (error) {
      showToast.error("Failed to delete fund entry");
      throw error;
    }
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
