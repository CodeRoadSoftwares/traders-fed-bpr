"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC, Sk, StatusBadge } from "@/components/ui";
import { Shop, Notice } from "@/types";
import NoticeDetailModal from "./NoticeDetailModal";

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
  actionProps,
}: {
  icon: string;
  title: string;
  desc: string;
  actionProps?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-xl border border-gray-100 h-full min-h-[200px] shadow-sm">
      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mb-3">
        <Icon d={icon} className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{desc}</p>
      {actionProps && (
        <Link
          href={actionProps.href}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          {actionProps.label} <Icon d={IC.chevronRight} className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 mb-24">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate tracking-tight">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
            {user.email} · {user.address?.district || "Jammu & Kashmir"}
          </p>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Certificate Section */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <SectionHeader title="Certificate Status" />

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 shadow-sm flex-1">
              <div className="flex items-center gap-4">
                <Sk className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Sk className="h-4 w-32" />
                  <Sk className="h-3 w-48" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Sk className="h-3 w-20" />
                    <Sk className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ) : shopError || !shop ? (
            <EmptyState
              icon={IC.shop}
              title="No shop registered yet"
              desc="Register your shop to get a federation certificate and be listed in our directory."
              actionProps={{ href: "/my-shop", label: "Register Shop" }}
            />
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <div
                className={`flex items-start gap-4 px-5 py-5 rounded-xl border shadow-sm ${cfg!.bg} ${cfg!.border}`}
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
                <div className="flex-1 min-w-0 mt-0.5">
                  <p className={`font-bold text-sm ${cfg!.color}`}>
                    {cfg!.label}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-1">
                    {cfg!.desc}
                  </p>
                </div>
                <StatusBadge status={shop.certificateStatus} />
              </div>

              {daysLeft !== null &&
                daysLeft <= 30 &&
                shop.certificateStatus === "ACTIVE" && (
                  <div
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium border shadow-sm ${daysLeft <= 7 ? "bg-danger-50 border-danger-200 text-danger-700" : "bg-warning-50 border-warning-200 text-warning-700"}`}
                  >
                    <Icon d={IC.alert} className="w-5 h-5 shrink-0" />
                    Certificate expires in {daysLeft} day
                    {daysLeft !== 1 ? "s" : ""}. Contact the federation to
                    renew.
                  </div>
                )}

              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {row.label}
                      </p>
                      <p
                        className={`text-sm font-bold text-gray-900 capitalize truncate ${row.mono ? "font-mono tracking-wider text-xs" : ""}`}
                      >
                        {row.value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-400">
                    Share your cert number so others can verify your shop
                  </p>
                  <Link
                    href="/my-shop"
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1.5 group"
                  >
                    Full details{" "}
                    <Icon
                      d={IC.chevronRight}
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 lg:gap-8 h-full">
          {/* Notices Section */}
          <div className="flex flex-col h-full">
            <SectionHeader
              title="Latest Notices"
              actionProps={{ href: "/notices", label: "All" }}
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
                desc="There are currently no announcements or notices available."
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

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Account
            </p>
            {[
              { icon: IC.user, value: user.name },
              { icon: IC.mail, value: user.email },
              { icon: IC.location, value: user.address?.district || "—" },
            ].map((row) => (
              <div key={row.value} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <SectionHeader title="Quick Access" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
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
