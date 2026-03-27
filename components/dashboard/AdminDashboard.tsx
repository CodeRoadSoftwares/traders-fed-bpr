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

function SectionHeader({
  title,
  actionProps,
}: {
  title: string;
  actionProps?: { href: string; label: string };
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
        {title}
      </p>
      {actionProps && (
        <Link
          href={actionProps.href}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group"
        >
          {actionProps.label}{" "}
          <Icon
            d={IC.chevronRight}
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-xl border border-gray-100 h-full min-h-[200px]">
      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mb-3">
        <Icon d={icon} className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{desc}</p>
    </div>
  );
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
    {
      href: "/carousel",
      label: "Carousel",
      icon: IC.image,
      desc: "Edit home slides",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 mb-24">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate tracking-tight">
              Good day, {user.name.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 capitalize truncate mt-0.5">
              {user.role.toLowerCase().replace("_", " ")} · {user.email}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100 shrink-0 shadow-sm">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />{" "}
          Live Dashboard
        </span>
      </div>

      {/* ── Overview Stats ── */}
      <section>
        <SectionHeader title="Overview" />
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
              >
                <Sk className="h-10 w-10 rounded-lg mb-4" />
                <Sk className="h-3 w-20 mb-2" />
                <Sk className="h-7 w-16 mb-2" />
                <Sk className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c) => (
              <div
                key={c.label}
                className={`bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${"alert" in c && c.alert ? "border-warning-200 bg-warning-50/10" : "border-gray-100"}`}
              >
                <div
                  className={`w-10 h-10 ${c.bg} ${c.color} rounded-lg flex items-center justify-center mb-4 shadow-sm`}
                >
                  <Icon d={c.icon} className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {c.label}
                </p>
                <p
                  className={`text-2xl font-bold ${c.color} tabular-nums tracking-tight`}
                >
                  {c.value}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  {c.sub}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <SectionHeader
            title="Pending Approvals"
            actionProps={{ href: "/shops?status=PENDING", label: "View all" }}
          />

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex-1">
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Sk className="h-14 w-14 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Sk className="h-4 w-1/3" />
                      <Sk className="h-3 w-1/4" />
                      <div className="flex items-center gap-2 pt-1">
                        <Sk className="h-3 w-16" />
                        <Sk className="h-3 w-20" />
                      </div>
                    </div>
                    <Sk className="h-8 w-20 rounded-lg shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : pending.length === 0 ? (
            <EmptyState
              icon={IC.check2}
              title="All caught up"
              desc="There are currently no shop registrations waiting for your approval."
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex-1">
              <div className="divide-y divide-gray-50">
                {pending.map((shop) => (
                  <div
                    key={shop._id}
                    className="flex items-center gap-3 sm:gap-4 px-4 py-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    {shop.primaryPhoto ||
                    (shop.photos && shop.photos.length > 0) ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative shadow-sm">
                        <Image
                          src={shop.primaryPhoto || shop.photos![0]}
                          alt={shop.shopName || shop.user?.name || "Shop"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-warning-50 to-warning-100 text-warning-600 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-warning-100">
                        {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {shop.shopName || shop.user?.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
                        {shop.user?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                          <Icon d={IC.store} className="w-3.5 h-3.5" />
                          {shop.category?.replace(/_/g, " ")}
                        </span>
                        {shop.user?.address?.district && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                            <Icon d={IC.location} className="w-3.5 h-3.5" />
                            {shop.user.address.district}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/shops/${shop._id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shrink-0 shadow-sm"
                    >
                      <span className="hidden sm:inline">Review</span>
                      <Icon d={IC.chevronRight} className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 lg:gap-8 h-full">
          {/* Notices Section */}
          <div className="flex flex-col h-full">
            <SectionHeader
              title="Recent Notices"
              actionProps={{ href: "/notices", label: "All notices" }}
            />

            {loading ? (
              <div className="space-y-3 flex-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Sk className="h-4 w-2/3" />
                        <Sk className="h-3 w-10" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Sk className="h-3 w-full" />
                      <Sk className="h-3 w-4/5" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Sk className="h-3 w-16" />
                      <div className="flex gap-2">
                        <Sk className="h-4 w-4 rounded" />
                        <Sk className="h-4 w-4 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notices.length === 0 ? (
              <EmptyState
                icon={IC.notice}
                title="No notices yet"
                desc="Create notices to keep platform users informed."
              />
            ) : (
              <div className="space-y-3 flex-1">
                {notices.map((n) => {
                  const imgCount =
                    n.attachments?.filter((a) => a.type === "image").length ||
                    0;
                  const pdfCount =
                    n.attachments?.filter((a) => a.type === "pdf").length || 0;
                  const hasAttachments = imgCount > 0 || pdfCount > 0;

                  return (
                    <div
                      key={n._id}
                      onClick={() => setSelectedNotice(n)}
                      className={`w-full text-left bg-white rounded-xl border p-4 hover:shadow-md transition-all group cursor-pointer ${
                        n.urgent
                          ? "border-l-[3px] border-l-danger-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 bg-danger-50/10 hover:border-r-danger-200 hover:border-t-danger-200 hover:border-b-danger-200"
                          : "border-gray-100 hover:border-primary-200"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                          {n.title}
                        </p>
                        {n.urgent && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-danger-100 text-danger-700 text-[10px] font-bold rounded shrink-0 shadow-sm border border-danger-200 uppercase tracking-wide">
                            <Icon d={IC.alert} className="w-2.5 h-2.5" />
                            Urgent
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-medium text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                        <p className="text-[11px] font-semibold text-gray-400">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        {hasAttachments && (
                          <div className="flex items-center gap-2">
                            {imgCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                <Icon
                                  d={IC.image}
                                  className="w-3 h-3 text-gray-400"
                                />
                                {imgCount}
                              </span>
                            )}
                            {pdfCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                <Icon
                                  d={IC.fileText}
                                  className="w-3 h-3 text-gray-400"
                                />
                                {pdfCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fund Snapshot Section */}
          <div className="flex flex-col">
            <SectionHeader title="Fund Snapshot" />
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-sm">
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <Sk className="h-3 w-16" />
                        <Sk className="h-3 w-20" />
                      </div>
                      <Sk className="h-2 w-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <Sk className="h-3 w-16" />
                  <Sk className="h-4 w-24 rounded" />
                </div>
              </div>
            ) : stats ? (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
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
                    bar: "bg-danger-500",
                  },
                ].map((row) => {
                  const max = Math.max(
                    stats.funds.income,
                    stats.funds.expense,
                    1,
                  );
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-gray-500 uppercase tracking-wide">
                          {row.label}
                        </span>
                        <span className={`font-bold ${row.color}`}>
                          ₹{row.value.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full ${row.bar} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${(row.value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-500 uppercase tracking-wide">
                    Balance
                  </span>
                  <span
                    className={`text-sm font-bold px-2.5 py-1 rounded-md shadow-sm border ${
                      stats.funds.balance >= 0
                        ? "text-primary-700 bg-primary-50 border-primary-200"
                        : "text-danger-700 bg-danger-50 border-danger-200"
                    }`}
                  >
                    ₹{stats.funds.balance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Quick Access ── */}
      <section>
        <SectionHeader title="Quick Access" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickLinks.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all group flex flex-col items-center justify-center text-center h-full shadow-sm"
            >
              <div className="w-10 h-10 bg-primary-50/50 text-primary-600 rounded-xl flex items-center justify-center mb-3 shadow-sm border border-primary-50 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                <Icon d={a.icon} className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug">
                {a.label}
              </p>
              <p className="text-[11px] font-medium text-gray-400 mt-1 line-clamp-1">
                {a.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </main>
  );
}
