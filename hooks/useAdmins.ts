import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { User, Pagination } from "@/types";
import { showToast } from "@/lib/toast";

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
      showToast.error("Failed to load admins");
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
    try {
      await apiClient.post("/admin/create", data);
      showToast.success("Admin created successfully!");
      fetchAdmins();
    } catch (error) {
      showToast.error("Failed to create admin");
      throw error;
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      await apiClient.delete("/admin/delete", { data: { id } });
      showToast.success("Admin deleted successfully!");
      fetchAdmins();
    } catch (error) {
      showToast.error("Failed to delete admin");
      throw error;
    }
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
