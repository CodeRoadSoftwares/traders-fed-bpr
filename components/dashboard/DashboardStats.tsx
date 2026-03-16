"use client";
import { useEffect, useState } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk } from "@/components/ui";

interface Stats {
  totalShops: number;
  activeShops: number;
  pendingShops: number;
  expiredShops: number;
  totalNotices: number;
  urgentNotices: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const cards = (s: Stats) => [
  {
    label: "Total Shops",
    value: s.totalShops,
    icon: IC.building,
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    label: "Active",
    value: s.activeShops,
    icon: IC.check,
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    label: "Pending Approval",
    value: s.pendingShops,
    icon: IC.clock,
    color: "text-warning-600",
    bg: "bg-warning-50",
  },
  {
    label: "Expired",
    value: s.expiredShops,
    icon: IC.alert,
    color: "text-danger-600",
    bg: "bg-danger-50",
  },
  {
    label: "Total Notices",
    value: s.totalNotices,
    icon: IC.notice,
    color: "text-secondary-600",
    bg: "bg-secondary-50",
  },
  {
    label: "Urgent Notices",
    value: s.urgentNotices,
    icon: IC.alert,
    color: "text-danger-600",
    bg: "bg-danger-50",
  },
  {
    label: "Total Income",
    value: `₹${s.totalIncome.toLocaleString()}`,
    icon: IC.fund,
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    label: "Balance",
    value: `₹${s.balance.toLocaleString()}`,
    icon: IC.fund,
    color: s.balance >= 0 ? "text-primary-600" : "text-danger-600",
    bg: s.balance >= 0 ? "bg-primary-50" : "bg-danger-50",
  },
];

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/stats/dashboard")
      .then((r) => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <Sk className="h-8 w-8 rounded-lg mb-3" />
            <Sk className="h-3 w-20 mb-2" />
            <Sk className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards(stats).map((c, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
        >
          <div
            className={`w-9 h-9 ${c.bg} ${c.color} rounded-lg flex items-center justify-center mb-3`}
          >
            <Icon d={c.icon} className="w-4.5 h-4.5" />
          </div>
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
