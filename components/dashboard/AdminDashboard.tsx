"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk } from "@/components/ui";
import { Shop, Notice } from "@/types";
import NoticeDetailModal from "./NoticeDetailModal";

interface Stats {
  shops: { total: number; pending: number; active: number; rejected: number };
  users: number;
  notices: number;
  funds: { income: number; expense: number; balance: number };
}

export default function AdminDashboard({
  user,
}: {
  user: { name: string; role: string; email: string };
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<Shop[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get("/stats/dashboard").catch(() => null),
      apiClient
        .get("/shop/get", { params: { status: "PENDING", limit: 5 } })
        .catch(() => null),
      apiClient.get("/notice/get", { params: { limit: 3 } }).catch(() => null),
    ])
      .then(([s, p, n]) => {
        if (s?.data) setStats(s.data);
        if (p?.data?.data) setPending(p.data.data);
        if (n?.data?.data) setNotices(n.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { href: "/shops", label: "Shops", icon: IC.building },
    { href: "/certificates", label: "Certs", icon: IC.check },
    { href: "/notices", label: "Notices", icon: IC.notice },
    { href: "/funds", label: "Funds", icon: IC.fund },
    ...(user.role === "SUPER_ADMIN"
      ? [{ href: "/admins", label: "Admins", icon: IC.user }]
      : []),
    { href: "/carousel", label: "Carousel", icon: IC.image },
  ];

  const statCards = stats
    ? [
        {
          label: "Total Shops",
          value: stats.shops.total,
          sub: `${stats.shops.active} active`,
          icon: IC.building,
          color: "text-primary-600",
          bg: "bg-primary-50",
        },
        {
          label: "Pending",
          value: stats.shops.pending,
          sub: "awaiting review",
          icon: IC.clock,
          color: "text-warning-600",
          bg: "bg-warning-50",
          alert: stats.shops.pending > 0,
        },
        {
          label: "Notices",
          value: stats.notices,
          sub: "published",
          icon: IC.notice,
          color: "text-secondary-600",
          bg: "bg-secondary-50",
        },
        {
          label: "Balance",
          value: `₹${Math.abs(stats.funds.balance).toLocaleString("en-IN")}`,
          sub: stats.funds.balance >= 0 ? "surplus" : "deficit",
          icon: IC.fund,
          color:
            stats.funds.balance >= 0 ? "text-primary-600" : "text-danger-600",
          bg: stats.funds.balance >= 0 ? "bg-primary-50" : "bg-danger-50",
        },
      ]
    : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Good day, {user.name.split(" ")[0]}
            </h1>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {user.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-[11px] font-semibold rounded-full border border-primary-100">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {/* Stats — horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 scrollbar-none">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shrink-0 w-36 sm:w-auto"
              >
                <Sk className="h-8 w-8 rounded-xl mb-3" />
                <Sk className="h-5 w-12 mb-1" />
                <Sk className="h-3 w-16" />
              </div>
            ))
          : statCards.map((c) => (
              <div
                key={c.label}
                className={`bg-white rounded-2xl border p-4 shadow-sm shrink-0 w-36 sm:w-auto ${"alert" in c && c.alert ? "border-warning-200" : "border-gray-100"}`}
              >
                <div
                  className={`w-8 h-8 ${c.bg} ${c.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon d={c.icon} className="w-4 h-4" />
                </div>
                <p className={`text-xl font-bold ${c.color} tabular-nums`}>
                  {c.value}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.label}</p>
              </div>
            ))}
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y divide-gray-100">
          {quickLinks.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center justify-center gap-2 py-4 px-2 hover:bg-primary-50/50 transition-colors active:bg-primary-50"
            >
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                <Icon d={a.icon} className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: side-by-side. Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Approvals */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Pending Approvals
            </p>
            <Link
              href="/shops?status=PENDING"
              className="text-xs text-primary-600 font-medium flex items-center gap-0.5"
            >
              View all <Icon d={IC.chevronRight} className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Sk className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Sk className="h-4 w-1/3" />
                      <Sk className="h-3 w-1/4" />
                    </div>
                    <Sk className="h-8 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2">
                  <Icon d={IC.check2} className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  All caught up
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No pending approvals
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map((shop) => (
                  <div
                    key={shop._id}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    {shop.primaryPhoto || shop.photos?.[0] ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                        <Image
                          src={shop.primaryPhoto || shop.photos![0]}
                          alt={shop.shopName || ""}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-warning-50 text-warning-600 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border border-warning-100">
                        {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {shop.shopName || shop.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {shop.category?.replace(/_/g, " ")} ·{" "}
                        {shop.user?.address?.district}
                      </p>
                    </div>
                    <Link
                      href={`/shops/${shop._id}`}
                      className="shrink-0 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-100"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Fund Snapshot */}
          {!loading && stats && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Fund Snapshot
              </p>
              <div className="space-y-3">
                {[
                  {
                    label: "Income",
                    value: stats.funds.income,
                    color: "text-primary-600",
                    bar: "bg-primary-500",
                  },
                  {
                    label: "Expense",
                    value: stats.funds.expense,
                    color: "text-danger-600",
                    bar: "bg-danger-400",
                  },
                ].map((row) => {
                  const max = Math.max(
                    stats.funds.income,
                    stats.funds.expense,
                    1,
                  );
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-500">
                          {row.label}
                        </span>
                        <span className={`font-bold ${row.color}`}>
                          ₹{row.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.bar} rounded-full`}
                          style={{ width: `${(row.value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  Balance
                </span>
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${stats.funds.balance >= 0 ? "text-primary-700 bg-primary-50 border-primary-100" : "text-danger-700 bg-danger-50 border-danger-100"}`}
                >
                  ₹{stats.funds.balance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {/* Recent Notices */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Recent Notices
              </p>
              <Link
                href="/notices"
                className="text-xs text-primary-600 font-medium flex items-center gap-0.5"
              >
                All <Icon d={IC.chevronRight} className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {loading
                ? [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-gray-100 p-3 space-y-2"
                    >
                      <Sk className="h-4 w-3/4" />
                      <Sk className="h-3 w-full" />
                    </div>
                  ))
                : notices.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => setSelectedNotice(n)}
                      className={`bg-white rounded-xl border p-3.5 cursor-pointer active:bg-gray-50 transition-colors ${n.urgent ? "border-l-4 border-l-danger-500 border-gray-100" : "border-gray-100"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">
                          {n.title}
                        </p>
                        {n.urgent && (
                          <span className="text-[10px] font-bold text-danger-600 bg-danger-50 px-1.5 py-0.5 rounded border border-danger-100 shrink-0">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {n.message}
                      </p>
                      <p className="text-[11px] text-gray-300 mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </main>
  );
}
