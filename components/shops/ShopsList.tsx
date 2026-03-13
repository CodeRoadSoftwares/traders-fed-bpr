"use client";
import { useState } from "react";
import { useShops } from "@/hooks/useShops";
import Link from "next/link";

export default function ShopsList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { shops, pagination, loading, approveShop, rejectShop } = useShops({
    page,
    status,
    search,
  });

  const handleApprove = async (id: string) => {
    if (confirm("Approve this shop?")) {
      await approveShop(id);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Reject this shop?")) {
      await rejectShop(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Shops Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Shop Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Certificate
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shops.map((shop) => (
                  <tr key={shop._id}>
                    <td className="px-4 py-3 text-sm">{shop.user?.name}</td>
                    <td className="px-4 py-3 text-sm">{shop.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          shop.certificateStatus === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : shop.certificateStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {shop.certificateStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {shop.certificateNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/shops/${shop._id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          View
                        </Link>
                        {shop.certificateStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(shop._id)}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(shop._id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
