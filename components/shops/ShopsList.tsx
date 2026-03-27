"use client";
import { useState } from "react";
import { useShops } from "@/hooks/useShops";
import Link from "next/link";
import { Icon, IC, Sk, StatusBadge, Pagination, Empty } from "@/components/ui";

export default function ShopsList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const { shops, pagination, loading, approveShop, rejectShop } = useShops({
    page,
    status,
    search,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Administration
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Shops Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review, approve, and manage shop registrations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            d={IC.search}
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-700"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <Empty
            icon={IC.building}
            title="No shops found"
            subtitle="Try adjusting your filters"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    "Shop",
                    "Category",
                    "Certificate No.",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shops.map((shop) => (
                  <tr
                    key={shop._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                          {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {shop.shopName || shop.user?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {shop.user?.name} · {shop.user?.address?.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 capitalize">
                      {shop.category?.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-500">
                      {shop.certificateNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={shop.certificateStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/shops/${shop._id}`}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View
                        </Link>
                        {shop.certificateStatus === "PENDING" && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button
                              onClick={() => {
                                if (confirm("Approve this shop?"))
                                  approveShop(shop._id);
                              }}
                              className="text-xs px-2 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Reject this shop?"))
                                  rejectShop(shop._id);
                              }}
                              className="text-xs px-2 py-1 bg-danger-50 text-danger-700 hover:bg-danger-100 rounded font-medium transition-colors"
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
      </div>

      {pagination && (
        <Pagination page={page} pages={pagination.pages} onPage={setPage} />
      )}
    </div>
  );
}
