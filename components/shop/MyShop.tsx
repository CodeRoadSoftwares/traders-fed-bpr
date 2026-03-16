"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import RegisterShopForm from "./RegisterShopForm";
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Member
        </p>
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your shop registration and certificate details
        </p>
      </div>

      {/* Status banner */}
      {shop.certificateStatus === "PENDING" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-warning-50 border border-warning-100 rounded-xl text-warning-700 text-sm">
          <Icon d={IC.clock} className="w-4 h-4 shrink-0" />
          Your shop is pending approval by a federation administrator.
        </div>
      )}
      {shop.certificateStatus === "REJECTED" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-danger-50 border border-danger-100 rounded-xl text-danger-700 text-sm">
          <Icon d={IC.alert} className="w-4 h-4 shrink-0" />
          Your shop registration was rejected. Please contact the federation
          office.
        </div>
      )}
      {daysLeft !== null &&
        daysLeft <= 30 &&
        shop.certificateStatus === "ACTIVE" && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm border ${daysLeft <= 7 ? "bg-danger-50 border-danger-100 text-danger-700" : "bg-warning-50 border-warning-100 text-warning-700"}`}
          >
            <Icon d={IC.alert} className="w-4 h-4 shrink-0" />
            Your certificate expires in {daysLeft} day
            {daysLeft !== 1 ? "s" : ""}. Contact the federation to renew.
          </div>
        )}

      {/* Certificate card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Certificate Details
          </p>
          <StatusBadge status={shop.certificateStatus} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Certificate No.",
              value: shop.certificateNumber,
              icon: IC.shield,
              mono: true,
            },
            {
              label: "Category",
              value: shop.category?.replace(/_/g, " "),
              icon: IC.building,
            },
            {
              label: "Registration No.",
              value: shop.registrationNumber,
              icon: IC.check,
            },
            { label: "License No.", value: shop.licenseNumber, icon: IC.check },
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
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 border border-gray-100">
                <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                <p
                  className={`text-sm font-semibold text-gray-900 capitalize ${row.mono ? "font-mono" : ""}`}
                >
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verify link */}
      <p className="text-sm text-gray-500">
        Share your certificate number{" "}
        <span className="font-mono text-gray-700">
          {shop.certificateNumber}
        </span>{" "}
        so others can verify your shop at{" "}
        <a
          href="/verify"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          traders-federation.com/verify
        </a>
      </p>
    </div>
  );
}
