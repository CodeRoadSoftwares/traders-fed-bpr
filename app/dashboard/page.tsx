"use client";
import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@/components/ui";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ShopDashboard from "@/components/dashboard/ShopDashboard";

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Spinner />
      </div>
    );

  if (!user) return null;

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isAdmin ? <AdminDashboard user={user} /> : <ShopDashboard user={user} />}
    </div>
  );
}
