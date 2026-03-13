"use client";
import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import Link from "next/link";

export default function ShopDirectory() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      if (search) {
        const response = await apiClient.get("/shop/search", {
          params: { q: search },
        });
        setShops(response.data.data);
      } else {
        // Fetch all active shops when no search query
        const response = await apiClient.get("/shop/get", {
          params: { status: "ACTIVE", limit: 100 },
        });
        setShops(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shops:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Shop Directory</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <input
          type="text"
          placeholder="Search shops by name, category, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {search ? "No shops found" : "No active shops available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {shop.user?.name}
              </h3>
              <p className="text-gray-600 mb-4">{shop.category}</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {shop.user?.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span>{" "}
                  {shop.user?.address?.line}, {shop.user?.address?.district}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Certificate:</span>{" "}
                  {shop.certificateNumber}
                </p>
              </div>
              <Link
                href={`/shops/${shop._id}`}
                className="mt-4 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
