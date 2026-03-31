"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import RegisterShopForm from "./RegisterShopForm";
import ShopPhotos from "./ShopPhotos";
import CertificatePreview from "./CertificatePreview";
import { Icon, IC, StatusBadge, Spinner } from "@/components/ui";

export default function MyShop() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const r = await apiClient.get("/shop/my-shop");
      setShop(r.data);
    } catch {
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!shop) return <RegisterShopForm onSuccess={fetchShop} />;

  const daysLeft = shop.certificateExpiryDate
    ? Math.ceil(
        (new Date(shop.certificateExpiryDate).getTime() - Date.now()) /
          86400000,
      )
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1.5 shadow-sm inline-block px-2 py-0.5 bg-primary-50 rounded-md border border-primary-100">
            Member Area
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            My Shop Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">
            Manage your shop registration, certificate details, and storefront
            gallery
          </p>
        </div>
      </div>

      {/* Certificate Preview - Show only if ACTIVE */}
      {shop.certificateStatus === "ACTIVE" && (
        <CertificatePreview shop={shop} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        {/* ─── LEFT COLUMN: Details & Status ─── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Status Alerts */}
          {shop.certificateStatus === "PENDING" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-warning-50 border border-warning-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-warning-100">
                <Icon d={IC.clock} className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <h3 className="text-warning-800 font-bold mb-0.5">
                  Approval Pending
                </h3>
                <p className="text-sm text-warning-700 font-medium">
                  Your shop registration is pending approval by a federation
                  administrator. Some features may be limited until active.
                </p>
              </div>
            </div>
          )}

          {shop.certificateStatus === "REJECTED" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-danger-50 border border-danger-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-danger-100">
                <Icon
                  d={IC.alert}
                  className="w-6 h-6 text-danger-500 animate-pulse"
                />
              </div>
              <div>
                <h3 className="text-danger-800 font-bold mb-0.5">
                  Registration Rejected
                </h3>
                <p className="text-sm text-danger-700 font-medium">
                  Your shop registration was rejected. Please contact the
                  federation office to resolve any critical issues.
                </p>
              </div>
            </div>
          )}

          {daysLeft !== null &&
            daysLeft <= 30 &&
            shop.certificateStatus === "ACTIVE" && (
              <div
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl shadow-sm border ${daysLeft <= 7 ? "bg-danger-50 border-danger-200" : "bg-warning-50 border-warning-200"}`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Icon
                    d={IC.alert}
                    className={`w-6 h-6 ${daysLeft <= 7 ? "text-danger-500 animate-pulse" : "text-warning-500"}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-bold mb-0.5 ${daysLeft <= 7 ? "text-danger-800" : "text-warning-800"}`}
                  >
                    Certificate Expiring Soon
                  </h3>
                  <p
                    className={`text-sm font-medium ${daysLeft <= 7 ? "text-danger-700" : "text-warning-700"}`}
                  >
                    Your certificate expires in {daysLeft} day
                    {daysLeft !== 1 ? "s" : ""}. Please contact the federation
                    to initiate renewal.
                  </p>
                </div>
              </div>
            )}

          {/* Core Certificate Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl flex items-center justify-center text-primary-700 font-bold text-2xl shadow-sm shrink-0">
                  {shop.shopName?.charAt(0).toUpperCase() ||
                    shop.user?.name?.charAt(0).toUpperCase() ||
                    "S"}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {shop.shopName || shop.user?.name || "My Shop"}
                  </h1>
                  <div className="inline-flex items-center gap-1.5 mt-2 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 capitalize">
                    <Icon
                      d={IC.building}
                      className="w-3.5 h-3.5 text-gray-400"
                    />
                    {shop.category?.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={shop.certificateStatus} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Registration No.",
                  value: shop.registrationNumber,
                  icon: IC.building,
                },
                {
                  label: "License No.",
                  value: shop.licenseNumber,
                  icon: IC.check,
                },
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
                    : "Pending",
                  icon: IC.calendar,
                },
                {
                  label: "Valid Until",
                  value: shop.certificateExpiryDate
                    ? new Date(shop.certificateExpiryDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" },
                      )
                    : "Pending",
                  icon: IC.calendar,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Icon d={row.icon} className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-0.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {row.label}
                    </p>
                    {typeof row.value === "string" ? (
                      <p
                        className={`text-sm font-bold text-gray-900 ${row.mono ? "font-mono tracking-wide" : "capitalize"}`}
                      >
                        {row.value || "—"}
                      </p>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Gallery & Verify ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon d={IC.image} className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Storefront Gallery
              </p>
            </div>

            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-primary-700">
                Upload up to 5 images to showcase your store, inventory, or
                products. Click on any uploaded image to set it as your primary
                cover photo!
              </p>
            </div>

            <ShopPhotos
              shopId={shop._id}
              initialPhotos={shop.photos ?? []}
              initialPrimary={shop.primaryPhoto}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
