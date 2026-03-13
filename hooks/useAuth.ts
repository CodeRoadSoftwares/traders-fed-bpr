import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios/apiClient";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: number;
  address: {
    line1: string;
    district: string;
    pincode: number;
  };
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (data: LoginData) => {
    setError("");
    setLoading(true);
    try {
      await apiClient.post("/auth/login", data);
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errorMsg = axiosError?.response?.data?.message || "Login failed";
      setError(typeof errorMsg === "string" ? errorMsg : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setError("");
    setLoading(true);
    try {
      await apiClient.post("/auth/register", data);
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        axiosError?.response?.data?.message || "Registration failed";
      setError(typeof errorMsg === "string" ? errorMsg : "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { login, register, logout, loading, error };
}
