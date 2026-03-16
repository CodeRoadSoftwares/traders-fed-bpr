"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk } from "@/components/ui";
import { Shop, Notice } from "@/types";

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

  useEffect(() => {
    Promise.all([
      apiClient.get("/stats/dashboard"),
      apiClient.get("/shop/get", { params: { status: "PENDING", limit: 5 } }),
      apiClient.get("/notice/get", { params: { limit: 3 } }),
    ])
      .then(([s, p, n]) => {
        setStats(s.data);
        setPending(p.data.data || []);
        setNotices(n.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          label: "Pending Approval",
          value: stats.shops.pending,
          sub: "awaiting review",
          icon: IC.clock,
          color: "text-warning-600",
          bg: "bg-warning-50",
          alert: stats.shops.pending > 0,
        },
        {
          label: "Total Notices",
          value: stats.notices,
          sub: "published",
          icon: IC.notice,
          color: "text-secondary-600",
          bg: "bg-secondary-50",
        },
        {
          label: "Fund Balance",
          value: `₹${stats.funds.balance.toLocaleString("en-IN")}`,
          sub: `₹${stats.funds.income.toLocaleString("en-IN")} income`,
          icon: IC.fund,
          color:
            stats.funds.balance >= 0 ? "text-primary-600" : "text-danger-600",
          bg: stats.funds.balance >= 0 ? "bg-primary-50" : "bg-danger-50",
        },
      ]
    : [];

  const quickLinks = [
    {
      href: "/shops",
      label: "Manage Shops",
      icon: IC.building,
      desc: "Review registrations",
    },
    {
      href: "/certificates",
      label: "Certificates",
      icon: IC.check,
      desc: "Track expiring certs",
    },
    {
      href: "/notices",
      label: "Notices",
      icon: IC.notice,
      desc: "Post announcements",
    },
    {
      href: "/funds",
      label: "Funds",
      icon: IC.fund,
      desc: "Income & expenses",
    },
    ...(user.role === "SUPER_ADMIN"
      ? [
          {
            href: "/admins",
            label: "Admins",
            icon: IC.user,
            desc: "Manage administrators",
          },
        ]
      : []),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              Good day, {user.name.split(" ")[0]}
            </h1>
            <p className="text-xs text-gray-400 capitalize truncate">
              {user.role.toLowerCase().replace("_", " ")} · {user.email}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100 shrink-0">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />{" "}
          Live data
        </span>
      </div>

      <section>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">
          Overview
        </p>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <Sk className="h-9 w-9 rounded-lg mb-3" />
                <Sk className="h-3 w-20 mb-2" />
                <Sk className="h-7 w-16 mb-1" />
                <Sk className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c) => (
              <div
                key={c.label}
                className={`bg-white rounded-xl border p-5 ${"alert" in c && c.alert ? "border-warning-200" : "border-gray-100"}`}
              >
                <div
                  className={`w-9 h-9 ${c.bg} ${c.color} rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon d={c.icon} className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                <p className={`text-2xl font-bold ${c.color} tabular-nums`}>
                  {c.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
              Pending Approvals
            </p>
            <Link
              href="/shops?status=PENDING"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <Icon d={IC.chevronRight} className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Sk className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Sk className="h-3.5 w-1/3" />
                      <Sk className="h-3 w-1/4" />
                    </div>
                    <Sk className="h-7 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-3">
                  <Icon d={IC.check2} className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  All caught up
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  No pending approvals
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map((shop) => (
                  <div
                    key={shop._id}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-warning-50 text-warning-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                      {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {shop.user?.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize truncate">
                        {shop.category?.replace(/_/g, " ")} ·{" "}
                        {shop.user?.address?.district}
                      </p>
                    </div>
                    <Link
                      href={`/shops/${shop._id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                    >
                      <span className="hidden sm:inline">Review</span>
                      <Icon d={IC.chevronRight} className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
                Recent Notices
              </p>
              <Link
                href="/notices"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                All <Icon d={IC.chevronRight} className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Sk className="h-3.5 w-3/4" />
                      <Sk className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : notices.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-gray-400">No notices yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notices.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 ${n.urgent ? "border-l-2 border-l-danger-400" : ""}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {n.urgent && (
                          <Icon
                            d={IC.alert}
                            className="w-3 h-3 text-danger-500 shrink-0"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {n.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {stats && (
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">
                Fund Snapshot
              </p>
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
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
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{row.label}</span>
                        <span className={`font-semibold ${row.color}`}>
                          ₹{row.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.bar} rounded-full transition-all`}
                          style={{ width: `${(row.value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-1 border-t border-gray-50 flex justify-between text-xs">
                  <span className="text-gray-400">Balance</span>
                  <span
                    className={`font-bold ${stats.funds.balance >= 0 ? "text-primary-600" : "text-danger-600"}`}
                  >
                    ₹{stats.funds.balance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">
          Quick Access
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-100 transition-all group text-center"
            >
              <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon d={a.icon} className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {a.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
