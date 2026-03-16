import { useState, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import { showToast } from "@/lib/toast";

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
      showToast.error("Failed to load expiring certificates");
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCertificate = async (certificateNumber: string) => {
    try {
      const response = await apiClient.get("/certificate/verify", {
        params: { cert: certificateNumber },
      });
      if (response.data.valid) {
        showToast.success("Certificate is valid!");
      } else {
        showToast.error("Certificate is invalid or expired");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to verify certificate:", error);
      showToast.error("Failed to verify certificate");
      throw error;
    }
  };

  const renewCertificate = async (shopId: string) => {
    try {
      const response = await apiClient.post("/certificate/renew", {
        id: shopId,
      });
      showToast.success("Certificate renewed successfully!");
      return response.data;
    } catch (error) {
      console.error("Failed to renew certificate:", error);
      showToast.error("Failed to renew certificate");
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
