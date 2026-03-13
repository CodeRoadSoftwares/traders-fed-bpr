import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop, Pagination } from "@/types";

interface UseShopsParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  district?: string;
  search?: string;
}

export function useShops(params: UseShopsParams = {}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/shop/get", { params });
      setShops(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.status,
    params.category,
    params.district,
    params.search,
  ]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const approveShop = async (id: string) => {
    await apiClient.post("/certificate/approve", { id });
    fetchShops();
  };

  const rejectShop = async (id: string) => {
    await apiClient.post("/certificate/reject", { id });
    fetchShops();
  };

  const deleteShop = async (id: string) => {
    await apiClient.delete("/shop/delete", { data: { id } });
    fetchShops();
  };

  return {
    shops,
    pagination,
    loading,
    approveShop,
    rejectShop,
    deleteShop,
    refetch: fetchShops,
  };
}
