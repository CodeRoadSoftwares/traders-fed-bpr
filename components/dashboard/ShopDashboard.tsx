"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk, StatusBadge } from "@/components/ui";
import { Shop, Notice } from "@/types";
import NoticeDetailModal from "./NoticeDetailModal";

const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; label: string; desc: string }
> = {
  ACTIVE: {
    color: "text-primary-700",
    bg: "bg-primary-50",
    border: "border-primary-200",
    label: "Certificate Active",
    desc: "Your shop is verified and listed in the directory.",
  },
  PENDING: {
    color: "text-warning-700",
    bg: "bg-warning-50",
    border: "border-warning-200",
    label: "Pending Approval",
    desc: "Your registration is under review by a federation administrator.",
  },
  REJECTED: {
    color: "text-danger-700",
    bg: "bg-danger-50",
    border: "border-danger-200",
    label: "Registration Rejected",
    desc: "Your registration was not approved. Contact the federation office.",
  },
  EXPIRED: {
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Certificate Expired",
    desc: "Your certificate has expired. Contact the federation to renew.",
  },
};

export default function ShopDashboard({
  user,
}: {
  user: {
    name: string;
    role: string;
    email: string;
    address?: { district?: string; line?: string; pincode?: number };
  };
}) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopError, setShopError] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get("/shop/my-shop").catch(() => null),
      apiClient.get("/notice/get", { params: { limit: 4 } }).catch(() => null),
    ])
      .then(([s, n]) => {
        if (s?.data) setShop(s.data);
        else setShopError(true);
        if (n?.data?.data) setNotices(n.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const now = new Date().getTime();
  const daysLeft = shop?.certificateExpiryDate
    ? Math.ceil(
        (new Date(shop.certificateExpiryDate).getTime() - now) / 86400000,
      )
    : null;

  const cfg = shop
    ? statusConfig[shop.certificateStatus] || statusConfig.PENDING
    : null;

  const quickLinks = [
    { href: "/my-shop", label: "My Shop", icon: IC.shop },
    { href: "/notices", label: "Notices", icon: IC.notice },
    { href: "/directory", label: "Directory", icon: IC.building },
    { href: "/funds", label: "Funds", icon: IC.fund },
    { href: "/verify", label: "Verify", icon: IC.shield },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-gray-900 leading-tight truncate">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {user.address?.district || "Jammu & Kashmir"}
          </p>
        </div>
      </div>

      {/* Certificate Status Card */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Certificate Status
        </p>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Sk className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Sk className="h-4 w-32" />
                <Sk className="h-3 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Sk className="h-3 w-20" />
                  <Sk className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        ) : shopError || !shop ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon d={IC.shop} className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">
              No shop registered
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Register your shop to get a federation certificate.
            </p>
            <Link
              href="/my-shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl shadow-sm"
            >
              Register Shop <Icon d={IC.chevronRight} className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Status banner */}
            <div
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl border ${cfg!.bg} ${cfg!.border}`}
            >
              <div
                className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm ${cfg!.color}`}
              >
                <Icon
                  d={
                    shop.certificateStatus === "ACTIVE"
                      ? IC.check
                      : shop.certificateStatus === "PENDING"
                        ? IC.clock
                        : IC.alert
                  }
                  className="w-5 h-5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${cfg!.color}`}>
                  {cfg!.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {cfg!.desc}
                </p>
              </div>
              <StatusBadge status={shop.certificateStatus} />
            </div>

            {/* Expiry warning */}
            {daysLeft !== null &&
              daysLeft <= 30 &&
              shop.certificateStatus === "ACTIVE" && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${daysLeft <= 7 ? "bg-danger-50 border-danger-200 text-danger-700" : "bg-warning-50 border-warning-200 text-warning-700"}`}
                >
                  <Icon d={IC.alert} className="w-4 h-4 shrink-0" />
                  Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                </div>
              )}

            {/* Details grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {[
                  {
                    label: "Certificate No.",
                    value: shop.certificateNumber,
                    mono: true,
                  },
                  {
                    label: "Category",
                    value: shop.category?.replace(/_/g, " "),
                  },
                  { label: "Registration No.", value: shop.registrationNumber },
                  { label: "License No.", value: shop.licenseNumber },
                  {
                    label: "Issued On",
                    value: shop.certificateIssuedAt
                      ? new Date(shop.certificateIssuedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "Pending",
                  },
                  {
                    label: "Valid Until",
                    value: shop.certificateExpiryDate
                      ? new Date(shop.certificateExpiryDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "Pending",
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[11px] font-medium text-gray-400 mb-0.5">
                      {row.label}
                    </p>
                    <p
                      className={`text-sm font-bold text-gray-900 capitalize truncate ${row.mono ? "font-mono text-xs tracking-wide" : ""}`}
                    >
                      {row.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <Link
                  href="/my-shop"
                  className="text-xs text-primary-600 font-semibold flex items-center gap-1"
                >
                  Full details <Icon d={IC.chevronRight} className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 divide-x divide-gray-100">
          {quickLinks.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center justify-center gap-2 py-4 px-1 hover:bg-primary-50/50 transition-colors active:bg-primary-50"
            >
              <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                <Icon d={a.icon} className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Latest Notices
          </p>
          <Link
            href="/notices"
            className="text-xs text-primary-600 font-medium flex items-center gap-0.5"
          >
            All <Icon d={IC.chevronRight} className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-2 shadow-sm"
              >
                <Sk className="h-4 w-3/4" />
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-1/2" />
              </div>
            ))
          ) : notices.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm">
              <p className="text-sm text-gray-400">No notices at this time</p>
            </div>
          ) : (
            notices.map((n) => (
              <div
                key={n._id}
                onClick={() => setSelectedNotice(n)}
                className={`bg-white rounded-xl border p-3.5 cursor-pointer active:bg-gray-50 transition-colors shadow-sm ${n.urgent ? "border-l-4 border-l-danger-500 border-gray-100" : "border-gray-100"}`}
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
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[11px] text-gray-300 mt-2">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Account
        </p>
        <div className="space-y-3">
          {[
            { icon: IC.user, value: user.name },
            { icon: IC.mail, value: user.email },
            { icon: IC.location, value: user.address?.district || "—" },
          ].map((row) => (
            <div key={row.value} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">
                {row.value}
              </p>
            </div>
          ))}
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
