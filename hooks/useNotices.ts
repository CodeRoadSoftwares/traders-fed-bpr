import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Notice, Pagination } from "@/types";
import { showToast } from "@/lib/toast";

interface UseNoticesParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export function useNotices(params: UseNoticesParams = {}) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/notice/get", { params });
      setNotices(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      showToast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.limit,
    params.search,
    params.startDate,
    params.endDate,
  ]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const createNotice = async (data: {
    title: string;
    message: string;
    visibility: string;
    urgent: boolean;
    attachments?: { url: string; name: string; type: "image" | "pdf" }[];
  }) => {
    try {
      await apiClient.post("/notice/create", data);
      showToast.success("Notice created successfully!");
      fetchNotices();
    } catch (error) {
      showToast.error("Failed to create notice");
      throw error;
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await apiClient.delete("/notice/delete", { data: { id } });
      showToast.success("Notice deleted successfully!");
      fetchNotices();
    } catch (error) {
      showToast.error("Failed to delete notice");
      throw error;
    }
  };

  return {
    notices,
    pagination,
    loading,
    createNotice,
    deleteNotice,
    refetch: fetchNotices,
  };
}
