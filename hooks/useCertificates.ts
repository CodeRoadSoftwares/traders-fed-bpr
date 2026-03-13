import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";

export function useCertificates() {
  const [expiringShops, setExpiringShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpiringCertificates = useCallback(async (days: number = 30) => {
    setLoading(true);
    try {
      const response = await apiClient.get("/certificate/expiring", {
        params: { days },
      });
      setExpiringShops(response.data.data);
    } catch (error) {
      console.error("Failed to fetch expiring certificates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCertificate = async (certificateNumber: string) => {
    try {
      const response = await apiClient.get("/certificate/verify", {
        params: { cert: certificateNumber },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to verify certificate:", error);
      throw error;
    }
  };

  const renewCertificate = async (shopId: string) => {
    try {
      const response = await apiClient.post("/certificate/renew", {
        id: shopId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to renew certificate:", error);
      throw error;
    }
  };

  return {
    expiringShops,
    loading,
    fetchExpiringCertificates,
    verifyCertificate,
    renewCertificate,
  };
}
