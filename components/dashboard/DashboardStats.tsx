"use client";
import { useDashboard } from "@/hooks/useDashboard";
import { useUser } from "@/hooks/useUser";

export default function DashboardStats() {
  const { stats, loading } = useDashboard();
  const { user } = useUser();

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!stats) return null;

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Check your shop status in My Shop section
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Shops</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {stats.shops.total}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-accent-500 mt-2">
            {stats.shops.pending}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Active</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.shops.active}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats.shops.rejected}
          </p>
        </div>
      </div>

      <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
        <p className="text-sm text-primary-800">
          💡 <strong>Quick Tip:</strong> Check the{" "}
          <a href="/certificates" className="underline font-medium">
            Certificates page
          </a>{" "}
          to view expiring certificates and renew them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹{stats.funds.income.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Expense</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{stats.funds.expense.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Balance</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            ₹{stats.funds.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.users}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Notices</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.notices}
          </p>
        </div>
      </div>
    </div>
  );
}
