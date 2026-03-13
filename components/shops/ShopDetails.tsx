"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";

interface ShopDetailsProps {
  params: Promise<{ id: string }>;
}

export default function ShopDetails({ params }: ShopDetailsProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => fetchShop(p.id));
  }, [params]);

  const fetchShop = async (shopId: string) => {
    try {
      const response = await apiClient.get(`/shop/get/${shopId}`);
      setShop(response.data);
    } catch (error) {
      console.error("Failed to fetch shop:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (confirm("Renew certificate for this shop?")) {
      try {
        await apiClient.post("/certificate/renew", { id: shop!._id });
        alert("Certificate renewed successfully");
        params.then((p) => fetchShop(p.id));
      } catch {
        alert("Failed to renew certificate");
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!shop) return <div className="text-center py-12">Shop not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shop Details</h1>
        {shop.certificateStatus === "ACTIVE" && (
          <button
            onClick={handleRenew}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Renew Certificate
          </button>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600">Shop Name</h3>
            <p className="text-lg font-semibold mt-1">{shop.user?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Category</h3>
            <p className="text-lg font-semibold mt-1">{shop.category}</p>
          </div>
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
            <h3 className="text-sm font-medium text-gray-600">
              Certificate Number
            </h3>
            <p className="text-lg font-semibold mt-1">
              {shop.certificateNumber}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Status</h3>
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
          {shop.certificateIssuedAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Certificate Issued
              </h3>
              <p className="text-lg font-semibold mt-1">
                {new Date(shop.certificateIssuedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {shop.certificateExpiryDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-600">
                Certificate Expiry
              </h3>
              <p className="text-lg font-semibold mt-1">
                {new Date(shop.certificateExpiryDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-600">Phone</h3>
            <p className="text-lg font-semibold mt-1">{shop.user?.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Email</h3>
            <p className="text-lg font-semibold mt-1">{shop.user?.email}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-600">Address</h3>
            <p className="text-lg font-semibold mt-1">
              {shop.user?.address?.line}, {shop.user?.address?.district} -{" "}
              {shop.user?.address?.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
