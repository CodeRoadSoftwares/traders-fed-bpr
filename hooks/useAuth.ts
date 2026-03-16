"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios/apiClient";
import { showToast } from "@/lib/toast";

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
      showToast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        const errorMsg = axiosError?.response?.data?.message || "Login failed";
        setError(typeof errorMsg === "string" ? errorMsg : "Login failed");
        showToast.error(
          typeof errorMsg === "string" ? errorMsg : "Login failed",
        );
      } else {
        setError("Login failed");
        showToast.error("Login failed");
      }
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
      showToast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        const errorMsg =
          axiosError?.response?.data?.message || "Registration failed";
        setError(
          typeof errorMsg === "string" ? errorMsg : "Registration failed",
        );
        showToast.error(
          typeof errorMsg === "string" ? errorMsg : "Registration failed",
        );
      } else {
        setError("Registration failed");
        showToast.error("Registration failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      showToast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      showToast.error("Logout failed");
    }
  };

  return { login, register, logout, loading, error };
}
