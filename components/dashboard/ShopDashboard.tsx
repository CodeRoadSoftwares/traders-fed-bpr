"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk, StatusBadge } from "@/components/ui";
import { Shop, Notice } from "@/types";

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

  useEffect(() => {
    Promise.all([
      apiClient.get("/shop/my-shop").catch(() => null),
      apiClient.get("/notice/get", { params: { limit: 4 } }),
    ])
      .then(([s, n]) => {
        if (s) setShop(s.data);
        else setShopError(true);
        setNotices(n.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const daysLeft = shop?.certificateExpiryDate
    ? Math.ceil(
        (new Date(shop.certificateExpiryDate).getTime() - now.getTime()) /
          86400000,
      )
    : null;

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

  const cfg = shop
    ? statusConfig[shop.certificateStatus] || statusConfig.PENDING
    : null;

  const quickLinks = [
    {
      href: "/my-shop",
      label: "My Shop",
      icon: IC.shop,
      desc: "Certificate & details",
    },
    {
      href: "/notices",
      label: "Notices",
      icon: IC.notice,
      desc: "Announcements",
    },
    {
      href: "/directory",
      label: "Directory",
      icon: IC.building,
      desc: "Browse shops",
    },
    {
      href: "/funds",
      label: "Funds",
      icon: IC.fund,
      desc: "Transparency report",
    },
    {
      href: "/verify",
      label: "Verify",
      icon: IC.shield,
      desc: "Check a certificate",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-gray-400 truncate">
            {user.email} · {user.address?.district || "Jammu & Kashmir"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
            Certificate Status
          </p>
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Sk className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Sk className="h-4 w-32" />
                  <Sk className="h-3 w-48" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Sk className="h-3 w-20" />
                    <Sk className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ) : shopError || !shop ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon d={IC.shop} className="w-6 h-6 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">
                No shop registered yet
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Register your shop to get a federation certificate.
              </p>
              <Link
                href="/my-shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Register Shop <Icon d={IC.chevronRight} className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div
                className={`flex items-start gap-3 px-4 py-4 rounded-xl border ${cfg!.bg} ${cfg!.border}`}
              >
                <div
                  className={`w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 ${cfg!.color}`}
                >
                  <Icon
                    d={
                      shop.certificateStatus === "ACTIVE"
                        ? IC.check
                        : shop.certificateStatus === "PENDING"
                          ? IC.clock
                          : IC.alert
                    }
                    className="w-4.5 h-4.5"
                  />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${cfg!.color}`}>
                    {cfg!.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{cfg!.desc}</p>
                </div>
                <StatusBadge status={shop.certificateStatus} />
              </div>

              {daysLeft !== null &&
                daysLeft <= 30 &&
                shop.certificateStatus === "ACTIVE" && (
                  <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${daysLeft <= 7 ? "bg-danger-50 border-danger-200 text-danger-700" : "bg-warning-50 border-warning-200 text-warning-700"}`}
                  >
                    <Icon d={IC.alert} className="w-4 h-4 shrink-0" />
                    Certificate expires in {daysLeft} day
                    {daysLeft !== 1 ? "s" : ""}. Contact the federation to
                    renew.
                  </div>
                )}

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {
                      label: "Registration No.",
                      value: shop.registrationNumber,
                    },
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
                        ? new Date(
                            shop.certificateExpiryDate,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Pending",
                    },
                  ].map((row) => (
                    <div key={row.label} className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">
                        {row.label}
                      </p>
                      <p
                        className={`text-sm font-semibold text-gray-900 capitalize truncate ${row.mono ? "font-mono text-xs" : ""}`}
                      >
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Share your cert number so others can verify your shop
                  </p>
                  <Link
                    href="/my-shop"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    Full details{" "}
                    <Icon d={IC.chevronRight} className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
              Latest Notices
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
              <div className="p-4 space-y-4">
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
                    className={`px-4 py-3.5 ${n.urgent ? "border-l-2 border-l-danger-400" : ""}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {n.urgent && (
                        <Icon
                          d={IC.alert}
                          className="w-3.5 h-3.5 text-danger-500 shrink-0 mt-0.5"
                        />
                      )}
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {n.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
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

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Account
            </p>
            {[
              { icon: IC.user, value: user.name },
              { icon: IC.mail, value: user.email },
              { icon: IC.location, value: user.address?.district || "—" },
            ].map((row) => (
              <div key={row.value} className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon d={row.icon} className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-700 truncate">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">
          Quick Access
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
