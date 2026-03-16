import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop, Pagination } from "@/types";
import { showToast } from "@/lib/toast";

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
      showToast.error("Failed to load shops");
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
    try {
      await apiClient.post("/certificate/approve", { id });
      showToast.success("Shop approved successfully!");
      fetchShops();
    } catch (error) {
      showToast.error("Failed to approve shop");
      throw error;
    }
  };

  const rejectShop = async (id: string) => {
    try {
      await apiClient.post("/certificate/reject", { id });
      showToast.success("Shop rejected successfully!");
      fetchShops();
    } catch (error) {
      showToast.error("Failed to reject shop");
      throw error;
    }
  };

  const deleteShop = async (id: string) => {
    try {
      await apiClient.delete("/shop/delete", { data: { id } });
      showToast.success("Shop deleted successfully!");
      fetchShops();
    } catch (error) {
      showToast.error("Failed to delete shop");
      throw error;
    }
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
