import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { useUser } from "./useUser";

export function useShopApproval() {
  const { user } = useUser();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApproval = async () => {
      if (!user || user.role !== "SHOP") {
        setIsApproved(true);
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/shop/my-shop");
        setIsApproved(res.data?.certificateStatus === "ACTIVE");
      } catch {
        setIsApproved(false);
      } finally {
        setLoading(false);
      }
    };

    checkApproval();
  }, [user]);

  return { isApproved, loading, isShop: user?.role === "SHOP" };
}
