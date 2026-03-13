import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { User } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/user/me");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, refetch: fetchUser };
}
