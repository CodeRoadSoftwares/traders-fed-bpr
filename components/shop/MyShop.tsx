"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import RegisterShopForm from "./RegisterShopForm";

export default function MyShop() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await apiClient.get("/shop/my-shop");
      setShop(response.data);
    } catch {
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!shop) {
    return <RegisterShopForm onSuccess={fetchShop} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Shop</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Registration Number
            </h3>
            <p className="text-lg font-semibold mt-1">
              {shop.registrationNumber}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              License Number
            </h3>
            <p className="text-lg font-semibold mt-1">{shop.licenseNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Category</h3>
            <p className="text-lg font-semibold mt-1">{shop.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Certificate Status
            </h3>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full mt-1 ${
                shop.certificateStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : shop.certificateStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {shop.certificateStatus}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Certificate Number
            </h3>
            <p className="text-lg font-semibold mt-1">
              {shop.certificateNumber}
            </p>
          </div>
          {shop.certificateIssuedAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-600">Issued At</h3>
              <p className="text-lg font-semibold mt-1">
                {new Date(shop.certificateIssuedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {shop.certificateExpiryDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-600">Expiry Date</h3>
              <p className="text-lg font-semibold mt-1">
                {new Date(shop.certificateExpiryDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
