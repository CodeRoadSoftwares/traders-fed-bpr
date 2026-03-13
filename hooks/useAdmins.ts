import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { User, Pagination } from "@/types";

export function useAdmins(page = 1) {
  const [admins, setAdmins] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/get", { params: { page } });
      setAdmins(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const createAdmin = async (data: {
    name: string;
    email: string;
    password: string;
    phone: number;
  }) => {
    await apiClient.post("/admin/create", data);
    fetchAdmins();
  };

  const deleteAdmin = async (id: string) => {
    await apiClient.delete("/admin/delete", { data: { id } });
    fetchAdmins();
  };

  return {
    admins,
    pagination,
    loading,
    createAdmin,
    deleteAdmin,
    refetch: fetchAdmins,
  };
}
