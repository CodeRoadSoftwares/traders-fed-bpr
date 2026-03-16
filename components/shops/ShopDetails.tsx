"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import { Icon, IC, StatusBadge, Spinner, Btn } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export default function ShopDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    params.then((p) => fetchShop(p.id));
  }, [params]);

  const fetchShop = async (id: string) => {
    try {
      const r = await apiClient.get(`/shop/get/${id}`);
      setShop(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!shop || !confirm("Renew certificate for this shop?")) return;
    try {
      await apiClient.post("/certificate/renew", { id: shop._id });
      params.then((p) => fetchShop(p.id));
    } catch {
      alert("Failed to renew certificate");
    }
  };

  if (loading) return <Spinner />;
  if (!shop)
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Shop not found.</p>
        <Link
          href="/shops"
          className="text-primary-600 text-sm mt-2 inline-block"
        >
          ← Back to shops
        </Link>
      </div>
    );

  const daysLeft = shop.certificateExpiryDate
    ? Math.ceil(
        (new Date(shop.certificateExpiryDate).getTime() - Date.now()) /
          86400000,
      )
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <Link
        href="/shops"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Icon d={IC.arrowLeft} className="w-4 h-4" /> Back to Shops
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {shop.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {shop.user?.name}
              </h1>
              <p className="text-sm text-gray-500 capitalize mt-0.5">
                {shop.category?.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={shop.certificateStatus} />
            {isAdmin && shop.certificateStatus === "ACTIVE" && (
              <Btn onClick={handleRenew} variant="secondary">
                <Icon d={IC.refresh} className="w-4 h-4" /> Renew
              </Btn>
            )}
          </div>
        </div>

        {/* Expiry warning */}
        {daysLeft !== null &&
          daysLeft <= 30 &&
          shop.certificateStatus === "ACTIVE" && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${daysLeft <= 7 ? "bg-danger-50 text-danger-700" : "bg-warning-50 text-warning-700"}`}
            >
              <Icon d={IC.alert} className="w-4 h-4 shrink-0" />
              Certificate expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Registration No.",
              value: shop.registrationNumber,
              icon: IC.building,
            },
            { label: "License No.", value: shop.licenseNumber, icon: IC.check },
            {
              label: "Certificate No.",
              value: shop.certificateNumber,
              icon: IC.shield,
              mono: true,
            },
            {
              label: "Certificate Status",
              value: <StatusBadge status={shop.certificateStatus} />,
              icon: IC.check,
            },
            {
              label: "Issued On",
              value: shop.certificateIssuedAt
                ? new Date(shop.certificateIssuedAt).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : "—",
              icon: IC.calendar,
            },
            {
              label: "Valid Until",
              value: shop.certificateExpiryDate
                ? new Date(shop.certificateExpiryDate).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  )
                : "—",
              icon: IC.calendar,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                {typeof row.value === "string" ? (
                  <p
                    className={`text-sm font-semibold text-gray-900 ${row.mono ? "font-mono" : ""}`}
                  >
                    {row.value}
                  </p>
                ) : (
                  row.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Contact & Location
        </p>
        <div className="space-y-3">
          {[
            {
              label: "Phone",
              value: String(shop.user?.phone || "—"),
              icon: IC.phone,
            },
            { label: "Email", value: shop.user?.email || "—", icon: IC.mail },
            {
              label: "Address",
              value:
                [
                  shop.user?.address?.line,
                  shop.user?.address?.district,
                  shop.user?.address?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "—",
              icon: IC.location,
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{row.label}</p>
                <p className="text-sm font-medium text-gray-800">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
